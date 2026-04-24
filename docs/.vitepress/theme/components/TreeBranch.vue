<script setup lang="ts">
defineOptions({ name: "TreeBranch" });

type TreeNode = {
  type: "directory" | "file";
  title: string;
  name: string;
  uid?: string;
  href?: string;
  relativePath?: string;
  mtime?: string;
  children?: TreeNode[];
};

defineProps<{
  nodes: TreeNode[];
  depth: number;
}>();

function chapterNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function fileId(node: TreeNode) {
  return node.uid || node.href?.replace(/^\//, "") || "";
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}
</script>

<template>
  <ul class="tree-branch" :style="{ '--tree-depth': depth }">
    <li
      v-for="(node, index) in nodes"
      :key="node.relativePath || node.href || node.name"
      class="tree-node"
    >
      <details
        v-if="node.type === 'directory'"
        class="tree-details"
        :open="depth === 0"
      >
        <summary class="tree-row tree-row-directory">
          <span class="tree-arrow" aria-hidden="true">
            <span />
          </span>
          <span class="tree-chapter" aria-hidden="true">
            {{ depth === 0 ? chapterNumber(index) : "§" }}
          </span>
          <span class="tree-title">{{ node.title }}</span>
          <span class="tree-rule" aria-hidden="true" />
          <span class="tree-meta">
            <span>{{ node.children?.length || 0 }}</span>
            <span>items</span>
          </span>
        </summary>
        <div class="tree-children">
          <TreeBranch :nodes="node.children || []" :depth="depth + 1" />
        </div>
      </details>

      <a v-else class="tree-row tree-row-file" :href="node.href">
        <span class="tree-leaf" aria-hidden="true" />
        <span class="tree-chapter tree-chapter-file" aria-hidden="true">
          {{ depth === 0 ? chapterNumber(index) : "·" }}
        </span>
        <span class="tree-title">{{ node.title }}</span>
        <span class="tree-rule" aria-hidden="true" />
        <span class="tree-meta">
          <span class="tree-id">{{ fileId(node) }}</span>
          <span class="tree-date">{{ formatDate(node.mtime) }}</span>
        </span>
      </a>
    </li>
  </ul>
</template>
