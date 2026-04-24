import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  lang: "zh-Hans",
  /** 部署于 https://liguwe.site/pre-34.5/ */
  base: "/pre-34.5/",
  title: "pre-v34.5",
  description: "liguwe 的 Obsidian 知识库与个人博客（pre-v34.5 归档站点）",
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
