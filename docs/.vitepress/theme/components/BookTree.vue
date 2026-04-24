<script setup lang="ts">
import tree from "../../generated/tree.json";
import TreeBranch from "./TreeBranch.vue";

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

const nodes = tree.children as TreeNode[];

function countDirectories(items: TreeNode[]): number {
  return items.reduce((total, item) => {
    if (item.type !== "directory") return total;
    return total + 1 + countDirectories(item.children || []);
  }, 0);
}

const directoryCount = countDirectories(nodes);
const generatedAt = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date(tree.generatedAt));
</script>

<template>
  <main class="book-tree-page book-stage">
    <section class="manual-book" aria-labelledby="site-title">
      <aside class="manual-spine" aria-hidden="true">
        <span class="manual-spine-code">832</span>
        <span class="manual-spine-line" />
        <span class="manual-spine-label">FIELD MANUAL</span>
      </aside>

      <article class="manual-page">
        <div class="manual-page-edge" aria-hidden="true" />
        <div class="manual-page-corner manual-page-corner-a" aria-hidden="true" />
        <div class="manual-page-corner manual-page-corner-b" aria-hidden="true" />

        <header class="book-tree-hero">
          <div class="book-tree-imprint">
            <span>PRIVATE INDEX</span>
            <span>OBSIDIAN EXPORT</span>
            <span>VOL. 832</span>
          </div>

          <div class="book-tree-head">
            <div class="book-tree-title-block">
              <p class="book-tree-kicker">A PERSONAL FIELD MANUAL</p>
              <h1 id="site-title">liguwe.site</h1>
              <p>
                一棵从 Obsidian 发布出来的个人知识目录。它保留文件夹的
                阅读秩序，但每篇文章通过短链接进入，像翻开一本持续生长的手册。
              </p>
            </div>

            <div class="book-tree-monogram" aria-hidden="true">
              <span>832</span>
            </div>
          </div>

          <div class="book-tree-stats" aria-label="站点统计">
            <div>
              <strong>{{ tree.stats.files }}</strong>
              <span>notes</span>
            </div>
            <div>
              <strong>{{ directoryCount }}</strong>
              <span>folders</span>
            </div>
            <div>
              <strong>{{ generatedAt }}</strong>
              <span>updated</span>
            </div>
          </div>
        </header>

        <section class="book-tree-panel" aria-label="目录树">
          <div class="book-tree-panel-bar">
            <span class="panel-path">root / 832</span>
            <span class="panel-title">Table of Contents</span>
            <span>{{ tree.stats.files }} entries</span>
          </div>
          <div class="book-tree-panel-body">
            <TreeBranch :nodes="nodes" :depth="0" />
          </div>
        </section>

        <footer class="manual-page-footer" aria-hidden="true">
          <span>00</span>
          <span class="manual-footer-rule" />
          <span>liguwe.site / generated field notes</span>
          <span class="manual-footer-rule" />
          <span>832</span>
        </footer>
      </article>
    </section>
  </main>
</template>
