/**
 * @description Mirror publishable Obsidian markdown into a VitePress docs site.
 *
 * 短 ID 相关环境变量（会决定 `docs/obsidian/{uid}.md` 的 slug，进而影响已发布 URL）：
 * - `SHORT_ID_LENGTH`：定长段长度，默认 6。加大可显著降低碰撞率。
 * - `SHORT_ID_LEGACY=1`：与旧版一致，使用 `md5` + 36 小写字母表；不设置则使用 `sha256` + 62 字符表。
 * - `SHORT_ID_ALPHABET`：自定义字母表（非空时覆盖上述默认/legacy 字母表）。更换会导致全量 slug 与旧链接不一致。
 * - `SHORT_ID_ALGORITHM`：自定义哈希名（如 `md5`），可覆盖 `SHORT_ID_LEGACY` 的算法；若需稳定旧链接，请与 legacy/旧配置一并固定。
 * - `SHORT_ID_MAX_ATTEMPTS`：冲突时 salt 递增重试次数上限，默认 1000000；用尽仍冲突会抛错，请增大 `SHORT_ID_LENGTH` 等。
 *
 * 修改 `SHORT_ID_LENGTH` / 字母表 / 算法后，输出文件名与路由会整体变化；对外已分享的链接需全站重生成，或自行做 301/映射。
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const ShortIdGenerator = require("./shortId");
const { ALPHABET_36, ALPHABET_62 } = ShortIdGenerator;

const repoRoot = __dirname;
const obsidianRoot = path.resolve(
  process.env.OBSIDIAN_ROOT || path.resolve(repoRoot, "../832"),
);
const docsRoot = path.resolve(repoRoot, "docs");
const notesRoot = path.resolve(docsRoot, "obsidian");
const publicRoot = path.resolve(docsRoot, "public");
const assetsRoot = path.resolve(publicRoot, "obsidian-assets");
const generatedRoot = path.resolve(docsRoot, ".vitepress/generated");

const indexReg = /^\d+\.\s*/;
const excludeReg = /@832|@ing|@todo|@/;
const configuredShortIdLength = Number.parseInt(
  process.env.SHORT_ID_LENGTH || "6",
  10,
);
const shortIdLength =
  Number.isInteger(configuredShortIdLength) && configuredShortIdLength > 0
    ? configuredShortIdLength
    : 6;
const shortIdLegacy =
  process.env.SHORT_ID_LEGACY === "1" || process.env.SHORT_ID_LEGACY === "true";
const customShortIdAlphabet = process.env.SHORT_ID_ALPHABET;
const shortIdAlphabet =
  customShortIdAlphabet && customShortIdAlphabet.trim() !== ""
    ? customShortIdAlphabet
    : shortIdLegacy
      ? ALPHABET_36
      : ALPHABET_62;
const customShortIdAlgorithm = process.env.SHORT_ID_ALGORITHM;
const shortIdAlgorithm =
  customShortIdAlgorithm && customShortIdAlgorithm.trim() !== ""
    ? customShortIdAlgorithm
    : shortIdLegacy
      ? "md5"
      : "sha256";
const configuredMaxAttempts = Number.parseInt(
  process.env.SHORT_ID_MAX_ATTEMPTS || "1000000",
  10,
);
const shortIdMaxAttempts =
  Number.isInteger(configuredMaxAttempts) && configuredMaxAttempts > 0
    ? configuredMaxAttempts
    : 1000000;

const shortIdGenerator = new ShortIdGenerator({
  length: shortIdLength,
  alphabet: shortIdAlphabet,
  algorithm: shortIdAlgorithm,
});
const linkMap = new Map();
const titleMap = new Map();
const uidMap = new Map();
const files = [];

function generateUniqueId(name, salt) {
  return shortIdGenerator.generate(
    name,
    salt == null || salt === "" ? undefined : { salt: String(salt) },
  );
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function removeMdExt(filePath) {
  return filePath.replace(/\.md$/i, "");
}

function stripIndex(name) {
  return name.replace(indexReg, "");
}

function parseName(name, type) {
  const baseName = type === "file" ? name.replace(/\.md$/i, "") : name;
  const index = indexReg.test(baseName) ? parseInt(baseName.split(".")[0], 10) : 0;
  return {
    index,
    title: indexReg.test(baseName) ? baseName.split(indexReg)[1] : baseName,
  };
}

function shouldExclude(absPath, dirent) {
  const name = dirent.name;
  if (name.startsWith(".")) return true;
  if (name === "Clippings") return true;
  if (excludeReg.test(absPath)) return true;
  return false;
}

function encodeRoute(routePath) {
  return routePath
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
}

function anchorSlug(anchor) {
  return encodeURIComponent(
    anchor
      .trim()
      .replace(/^#+/, "")
      .replace(/\s+/g, "-")
      .replace(/\./g, "")
      .replace(/：/g, ""),
  );
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function ensureUniqueUid(file) {
  const relativePath = file.relativePath;

  for (let n = 0; n < shortIdMaxAttempts; n++) {
    const uid = generateUniqueId(
      relativePath,
      n === 0 ? undefined : String(n),
    );
    const existingPath = uidMap.get(uid);

    if (existingPath === relativePath) {
      return uid;
    }
    if (!existingPath) {
      uidMap.set(uid, relativePath);
      return uid;
    }
  }

  throw new Error(
    `Short id: exceeded ${shortIdMaxAttempts} collision retries for "${relativePath}". Increase SHORT_ID_LENGTH or narrow collisions via alphabet.`,
  );
}

function buildTree(dir, depth = 0) {
  const stat = fs.statSync(dir);
  const meta = parseName(path.basename(dir), "directory");
  const node = {
    type: "directory",
    name: path.basename(dir),
    title: meta.title,
    index: meta.index,
    depth,
    sourcePath: dir,
    mtime: stat.mtime,
    children: [],
  };

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absPath = path.resolve(dir, entry.name);
    if (shouldExclude(absPath, entry)) continue;

    if (entry.isDirectory()) {
      const child = buildTree(absPath, depth + 1);
      if (child.children.length) {
        node.children.push(child);
      }
      continue;
    }

    if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue;

    const fileMeta = parseName(entry.name, "file");
    const stats = fs.statSync(absPath);
    const fileNode = {
      type: "file",
      name: entry.name,
      title: fileMeta.title,
      index: fileMeta.index,
      depth: depth + 1,
      sourcePath: absPath,
      mtime: stats.mtime,
      createAt: stats.birthtime,
    };
    node.children.push(fileNode);
    files.push(fileNode);
  }

  node.children.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return a.name.localeCompare(b.name, "zh-Hans");
  });

  return node;
}

function registerFile(file) {
  const relativePath = toPosix(path.relative(obsidianRoot, file.sourcePath));
  const relativeNoExt = removeMdExt(relativePath);
  const uid = ensureUniqueUid({ ...file, relativePath });
  const outputRelativePath = `${uid}.md`;
  const outputRelativeNoExt = uid;
  const outputPath = path.resolve(notesRoot, outputRelativePath);
  const route = `/${outputRelativeNoExt}`;
  const href = encodeRoute(route);

  file.relativePath = relativePath;
  file.uid = uid;
  file.outputRelativePath = outputRelativePath;
  file.relativeNoExt = relativeNoExt;
  file.outputRelativeNoExt = outputRelativeNoExt;
  file.outputPath = outputPath;
  file.href = href;
  file.link = href;
  file.mdLink = href;

  linkMap.set(relativeNoExt, file);

  const titleItems = titleMap.get(file.title) || [];
  titleItems.push(file);
  titleMap.set(file.title, titleItems);
}

function registerTitleShortcuts() {
  for (const [title, matchedFiles] of titleMap.entries()) {
    if (matchedFiles.length === 1) {
      linkMap.set(title, matchedFiles[0]);
    }
  }
}

function resolveObsidianLink(target) {
  const normalized = target.trim();
  if (!normalized) return null;
  if (linkMap.has(normalized)) return linkMap.get(normalized);

  const withoutMd = removeMdExt(normalized);
  if (linkMap.has(withoutMd)) return linkMap.get(withoutMd);

  return null;
}

function displayText(rawTarget, alias) {
  if (alias) return alias;
  const withoutAnchor = rawTarget.split("#")[0];
  const text = withoutAnchor.split("/").pop() || rawTarget;
  return stripIndex(removeMdExt(text));
}

function copyAttachment(rawPath) {
  const attachmentPath = rawPath.split("|")[0].trim();
  const source = path.resolve(obsidianRoot, attachmentPath);
  if (!fs.existsSync(source)) return null;

  const ext = path.extname(source);
  const base = path.basename(source, ext).replace(/\s/g, "");
  const fileName = `${generateUniqueId(source)}-${base}${ext}`;
  const dest = path.resolve(assetsRoot, fileName);
  ensureDir(assetsRoot);
  fs.copyFileSync(source, dest);

  return `/obsidian-assets/${encodeURIComponent(fileName)}`;
}

function convertObsidianHighlight(text) {
  const replacements = [];
  const placeholderPrefix = "HLD_PH_";
  let counter = 0;

  function storeReplacement(content) {
    const placeholder = `${placeholderPrefix}${counter}_`;
    replacements[counter] = content;
    counter++;
    return placeholder;
  }

  let processedText = text;
  [
    /^```[\s\S]*?^```/gm,
    /^````[\s\S]*?^````/gm,
    /`[^`\n]+`/g,
  ].forEach((regex) => {
    processedText = processedText.replace(regex, (match) => storeReplacement(match));
  });

  processedText = processedText.replace(/==([^=\n]+?)==/g, "**$1**");

  for (let i = replacements.length - 1; i >= 0; i--) {
    const placeholder = `${placeholderPrefix}${i}_`;
    processedText = processedText.replace(new RegExp(placeholder, "g"), replacements[i]);
  }

  return processedText;
}

function escapeVueTemplateSyntax(text) {
  const replacements = [];
  let counter = 0;

  function storeReplacement(content) {
    const placeholder = `VUE_ESC_PH_${counter}_`;
    replacements[counter] = content;
    counter++;
    return placeholder;
  }

  let processedText = text;
  [/^````[\s\S]*?^````/gm, /^```[\s\S]*?^```/gm].forEach((regex) => {
    processedText = processedText.replace(regex, (match) => storeReplacement(match));
  });

  processedText = processedText
    .replace(/{{/g, "&#123;&#123;")
    .replace(/}}/g, "&#125;&#125;");

  for (let i = replacements.length - 1; i >= 0; i--) {
    processedText = processedText.replace(new RegExp(`VUE_ESC_PH_${i}_`, "g"), replacements[i]);
  }

  return processedText;
}

function transformContent(file) {
  const raw = fs.readFileSync(file.sourcePath, "utf8");
  const parsed = matter(raw);
  let content = parsed.content || "";

  content = content.replace(/!\[\[([^\]]+)\]\]/g, (match, target) => {
    const assetHref = copyAttachment(target);
    if (!assetHref) return "";
    return `![图片&文件](${assetHref})`;
  });

  content = content.replace(/\[\[([^\]]+)\]\]/g, (match, rawLink) => {
    const [rawTarget, alias] = rawLink.split("|");
    if (rawTarget.includes("@")) {
      return `[${displayText(rawTarget, alias)}](#)`;
    }

    const [rawPath, rawAnchor] = rawTarget.split("#");
    const text = displayText(rawTarget, alias);
    const targetFile = rawPath ? resolveObsidianLink(rawPath) : file;

    if (!targetFile) {
      const fallbackAnchor = rawAnchor ? `#${anchorSlug(rawAnchor)}` : "#";
      return `[${text}](${fallbackAnchor})`;
    }

    const anchor = rawAnchor ? `#${anchorSlug(rawAnchor)}` : "";
    return `[${text}](${targetFile.href}${anchor})`;
  });

  const tagRegex = /(?<!\S)#([^\s#]+)(?:\/([^\s#]+))*(?!\S)/g;
  content = content.replace(tagRegex, (match) => `\`${match}\``);
  content = convertObsidianHighlight(content);
  content = escapeVueTemplateSyntax(content);

  return `# ${file.title}\n\n${content.trim()}\n`;
}

function writeFile(file) {
  const content = transformContent(file);
  ensureDir(path.dirname(file.outputPath));
  fs.writeFileSync(file.outputPath, content);
}

function toPublicTree(node) {
  if (node.type === "file") {
    return {
      type: "file",
      title: node.title,
      name: node.name,
      uid: node.uid,
      href: node.href,
      relativePath: node.relativePath,
      mtime: node.mtime,
    };
  }

  return {
    type: "directory",
    title: node.title,
    name: node.name,
    children: node.children.map(toPublicTree),
  };
}

function main() {
  if (!fs.existsSync(obsidianRoot)) {
    throw new Error(`Obsidian root does not exist: ${obsidianRoot}`);
  }

  fs.rmSync(notesRoot, { recursive: true, force: true });
  fs.rmSync(assetsRoot, { recursive: true, force: true });
  ensureDir(notesRoot);
  ensureDir(generatedRoot);

  const tree = buildTree(obsidianRoot);
  files.forEach(registerFile);
  registerTitleShortcuts();
  files.forEach(writeFile);

  const generatedTree = {
    generatedAt: new Date().toISOString(),
    sourceRoot: obsidianRoot,
    stats: {
      files: files.length,
    },
    children: tree.children.map(toPublicTree),
  };

  fs.writeFileSync(
    path.resolve(generatedRoot, "tree.json"),
    JSON.stringify(generatedTree, null, 2),
  );

  console.log(`Generated ${files.length} notes from ${obsidianRoot}`);
}

main();
