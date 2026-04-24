# 常用的 package.json 字段说明

`#nodejs` 

## 1. 整体介绍

- module → esm , mjs
- main → cjs
- types 
- exports:{ ... }

```json hl:5,9
{
  // 基础信息：忽略
  // 入口文件配置
  "main": "./dist/index.js",  // CommonJS 入口
  "module": "./dist/index.mjs",// ES Module 入口
  "types": "./dist/index.d.ts",// TypeScript 类型声明文件
  "exports": {                // 现代化的导出配置
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },

  // 脚本命令：忽略
  "scripts": {},

  // 依赖配置
  "dependencies": {           // 生产环境依赖
    "react": "^18.0.0"
  },
  "devDependencies": {        // 开发环境依赖
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  },
  // `peerDependencies` 
  // 表示宿主项目中需要安装的依赖，这些依赖不会被自动安装，而是期望由使用该包的项目提供
  // 1. 避免依赖重复安装
  // 2. 确保版本兼容性 等
  "peerDependencies": {      // 同版本对等依赖
    "react": "^18.0.0"
  },

  // 项目配置
  "private": true,           // 是否私有包
  "type": "module",          // 指定模块类型(commonjs/module)
  "engines": {               // 指定 node/npm 版本要求
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },

  // 发布配置，npm 发布包含的文件
  "files": [                
    "dist",
    "README.md"
  ]
}
```

### 1.1. 总结

- 开发库/框架时
	- 重点关注：
		- `main`、`module`、`types`、`exports`、`peerDependencies`
- 开发应用时
	- 重点关注：
		- `scripts`、`dependencies`、`devDependencies`
- 发布 npm 包时
	- 重点关注：
		- `name`、`version`、`files`、`keywords`

## 2. devDependencies 和 dependencies 区别

### 2.1. 主要区别

- dependencies：
	* **运行时**必需的依赖
	* **会被打包到生产环境**
	* 项目运行必须的包
- devDependencies：
	* **开发时**需要的依赖
	* **不会被打包到生产环境**
	* 仅在开发过程中使用的包

### 2.2. 安装命令的区别

```bash
# 安装到 dependencies
npm install axios --save
# 或
npm install axios -S
# 或
npm install axios

# 安装到 devDependencies
npm install webpack --save-dev
# 或
npm install webpack -D
```

### 2.3. 典型使用场景

`dependencies` 适用于：

```json
{
  "dependencies": {
    // 运行时框架
    "vue": "^3.3.0",
    "react": "^18.2.0",
    
    // 功能性库
    "axios": "^1.5.0",
    "lodash": "^4.17.21",
    
    // UI 组件库
    "element-plus": "^2.3.0",
    "ant-design-vue": "^4.0.0",
    
    // 路由
    "vue-router": "^4.2.0",
    
    // 状态管理
    "vuex": "^4.1.0"
  }
}
```

`devDependencies` 适用于：

```json
{
  "devDependencies": {
    // 构建工具
    "webpack": "^5.88.0",
    "vite": "^4.4.0",
    
    // 代码检查
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    
    // 测试工具
    "jest": "^29.6.0",
    "vitest": "^0.34.0",
    
    // 类型定义
    "@types/node": "^20.4.0",
    
    // 开发服务器
    "webpack-dev-server": "^4.15.0",
    
    // 编译器/转译器
    "typescript": "^5.1.0",
    "babel-loader": "^9.1.0"
  }
}
```

### 2.4. 环境影响

开发环境：

```bash
# 安装所有依赖
npm install
# 会同时安装 dependencies 和 devDependencies 中的所有包
```

生产环境：

```bash
# 只安装 dependencies
npm install --production
# 或
NODE_ENV=production npm install
```

### 2.5. 项目部署考虑

```json hl:4
{
  "scripts": {
    "build": "webpack --mode production",
    "deploy": "npm ci --production && node server.js"
  }
}
```

>  在部署时，通常只需要安装 `dependencies`，可以减少安装包的大小和时间

### 2.6. 依赖分类的建议

```json
{
  "dependencies": {
    // 1. 项目运行必需的框架和库
    "vue": "^3.3.0",
    // 2. 生产环境需要的功能模块
    "axios": "^1.5.0",
    // 3. 用户交互必需的UI组件
    "element-plus": "^2.3.0"
  },
  "devDependencies": {
    // 1. 开发工具和构建工具
    "webpack": "^5.88.0",
    // 2. 代码质量和测试工具
    "eslint": "^8.45.0",
    // 3. 类型定义文件
    "@types/node": "^20.4.0"
  }
}
```

### 2.7. 注意事项

#### 2.7.1. 依赖版本管理

```json
{
  "dependencies": {
    "package1": "^1.0.0",  // 自动更新小版本和补丁版本
    "package2": "~1.0.0",  // 只更新补丁版本
    "package3": "1.0.0"    // 固定版本
  }
}
```

#### 2.7.2. 安全考虑

```bash hl:2,3
# 定期更新依赖以修复安全漏洞
npm audit
npm audit fix

# 使用 package-lock.json 锁定版本
npm ci

# 开发环境
npm install  # 可以使用 npm install

# 测试/构建/部署环境
npm ci  # 推荐使用 npm ci

# 团队协作
git add package-lock.json  # 确保将 package-lock.json 提交到版本控制

```

### 2.8. 使用 npm ci →  严格按照 `package-lock.json` 来安装

```markdown hl:7,6
# npm install
- 会修改 package-lock.json
- 可以安装单个包
- 可以在没有 package-lock.json 的情况下工作

# npm ci
- 严格按照 package-lock.json 安装
- 不能安装单个包
- 必须有 package-lock.json
- 安装前会删除 node_modules

```
