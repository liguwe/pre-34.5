# pnpm（performant npm）

`#nodejs` 

## 1. 高效的磁盘空间利用

pnpm 使用`硬链接和符号链接`来共享项目间的依赖，这意味着：

- **相同的依赖包只会在磁盘上存储一次**
- 大大减少了磁盘空间的使用
- 安装速度更快，因为许多包可能**已经存在于全局存储中**

```
.pnpm-store/
  |-- node_modules/
      |-- packageA@1.0.0
      |-- packageB@2.0.0
      ...
```

## 2. 严格的依赖结构

pnpm 创建了一个**非平铺**的 `node_modules` 结构：

- **每个包只能访问其直接依赖**
- 防止依赖提升，避免"幽灵依赖"问题
- 提高了项目的可预测性和安全性

``` hl:2
node_modules/
  |-- .pnpm/
      |-- packageA@1.0.0/
      |-- packageB@2.0.0/
  |-- packageA -> .pnpm/packageA@1.0.0/node_modules/packageA
  |-- packageB -> .pnpm/packageB@2.0.0/node_modules/packageB
```

## 3. 快速安装

- 并行安装多个包
- 利用缓存和硬链接，减少网络和磁盘 I/O

## 4. 支持 monorepo

pnpm 内置了对 `monorepo`（单仓多包）项目的支持：

- 使用 `pnpm-workspace.yaml` 定义工作空间
- 提供 `pnpm add -w` 命令来安装根依赖
- 支持 `--filter` 参数来操作特定的包

## 5. 兼容性

- 与 npm 和 Yarn 的 `package.json` 格式完全兼容
- 可以直接替换现有的 npm 或 Yarn 项目

## 6. 其他特性

- 内置对 Node.js 版本管理的支持
- 支持插件系统
- 提供了许多有用的命令，如 `pnpm why` 用于分析依赖关系

## 7. 使用示例

```bash
# 安装依赖
pnpm install

# 添加依赖
pnpm add react

# 运行脚本
pnpm run build

# 在工作空间中添加依赖
pnpm add -w typescript

# 在特定包中添加依赖
pnpm add lodash --filter package-name
```

## 8. pnpm.lock 文件

pnpm 使用 `pnpm-lock.yaml` 文件来锁定依赖版本，确保团队成员和 CI 环境使用相同的依赖版本。

## 9. 性能对比

在大多数情况下，pnpm 的安装速度比 npm 和 Yarn 快，**尤其是在处理大型项目或 monorepo 时**。
