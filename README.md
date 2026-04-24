# liguwe's site

基于 [mdBook](https://github.com/rust-lang/mdBook) 的静态知识库。推送到 `master` 时由 [GitHub Actions](.github/workflows/deploy.yml) 构建并发布到 [GitHub Pages](https://pages.github.com/)。

## 在线访问

站点挂在自定义域 **https://liguwe.site** 下的子路径，请使用：

**https://liguwe.site/pre-34.5/**

> 子路径在 [`book.toml`](book.toml) 的 `site-url` 与部署工作流中保持一致；修改其一请同步另一处。

## 本地开发

1. 安装 [Rust / mdBook](https://github.com/rust-lang/mdBook#installation) 与仓库依赖（见 [`package.json`](package.json)）。
2. 执行：

```sh
pnpm install
pnpm run dev
```

`pnpm run dev` 会按 [`server.sh`](server.sh) 拉取/生成 `src` 相关文件并执行 `mdbook serve`，默认在本地根路径预览；线上环境使用上述 `site-url` 子路径发布。

## 更多

[https://liguwe.site](https://liguwe.site)

<!-- last deploy: 2026-04-25 -->
