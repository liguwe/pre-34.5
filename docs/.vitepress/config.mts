import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  lang: "zh-Hans",
  title: "liguwe.site",
  description: "liguwe 的 Obsidian 知识库与个人博客",
  cleanUrls: true,
  rewrites: (id) =>
    id.startsWith("obsidian/") ? id.slice("obsidian/".length) : id,
  ignoreDeadLinks: true,
  lastUpdated: true,
  vite: {
    plugins: [tailwindcss()],
  },
  themeConfig: {
    nav: [{ text: "目录", link: "/" }],
    outline: {
      level: [2, 6],
      label: "本文目录",
    },
    search: {
      provider: "local",
    },
    footer: {
      message: "Powered by VitePress",
      copyright: "Copyright © liguwe",
    },
  },
});
