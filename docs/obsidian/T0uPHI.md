# Vite 和 Webpack 在热更新（HMR - Hot Module Replacement）机制上的主要区别

`#webpack` `#vite` 

## 1. 基本原理对比

### 1.1. **Webpack HMR:**

```javascript
// Webpack HMR 基本流程
1. 文件更改
↓
2. Webpack 重新编译变更模块
↓
3. 生成新的模块 hash
↓
4. 通过 WebSocket 推送更新
↓
5. 客户端收到更新，加载新模块
↓
6. 执行模块热替换
```

### 1.2. **Vite HMR:**

```javascript
// Vite HMR 基本流程
1. 文件更改
↓
2. 直接发送变更文件给浏览器
↓
3. 浏览器使用原生 ESM 重新加载变更模块
↓
4. 执行模块热替换
```

## 2. **构建方式**：

### 2.1. Webpack： Webpack 需要对整个应用进行打包

```javascript hl:1
// Webpack 需要对整个应用进行打包
const webpack = require('webpack');
const compiler = webpack({
  // ... webpack 配置
  entry: './src/index.js',
  output: {
    // ... 输出配置
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});
```

### 2.2. Vite：Vite 开发环境下不需要打包，直接使用 ESM

```javascript
// Vite 开发环境下不需要打包，直接使用 ESM
import { createServer } from 'vite';

const server = await createServer({
  // Vite 配置
  server: {
    hmr: true // 默认开启
  }
});
```

## 3. **更新粒度**：

### 3.1. Webpack HMR：Webpack 中需要手动处理模块热替换逻辑

```javascript
// Webpack 中需要手动处理模块热替换逻辑
if (module.hot) {
  module.hot.accept('./someModule.js', function() {
    // 处理更新逻辑
    console.log('Module updated');
  });
}
```

### 3.2. Vite HMR：Vite 中的 HMR API 更简洁

```javascript
// Vite 中的 HMR API 更简洁
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // 更新逻辑
    console.log('Module updated');
  });
}
```

## 4. **性能表现**：

```javascript
// Webpack 开发服务器启动时间示例
// 需要先打包整个应用
const startWebpackServer = async () => {
  const compiler = webpack({...});
  const server = new WebpackDevServer(compiler, {
    hot: true
    // 其他配置
  });
  await server.start();
  // 可能需要几秒到几十秒
};

// Vite 开发服务器启动时间示例
// 无需打包，直接启动
const startViteServer = async () => {
  const server = await createServer({
    server: { hmr: true }
  });
  await server.listen();
  // 通常只需要几百毫秒
};
```

## 5. **更新速度**：

### 5.1. Vite：

- 更快，因为只需要精确更新变化的模块
- 利用浏览器原生 ESM 能力
- 不需要打包过程

```javascript
// Vite 的更新过程
// 1. 检测文件变化
watcher.on('change', async (file) => {
  // 2. 直接发送更新的模块
  ws.send({
    type: 'update',
    path: file,
    content: await fs.readFile(file, 'utf-8')
  });
});
```

### 5.2. Webpack：

- 需要重新编译构建变更模块
- 生成**新的 chunk**
- 可能**触发关联模块的更新**

```javascript
// Webpack 的更新过程
// 1. 检测文件变化
// 2. 重新编译模块
compilation.buildModule(module, (err) => {
  // 3. 生成新的 chunk
  compilation.processModuleDependencies(module, (err) => {
    // 4. 发送更新
    hotMiddleware.publish({ action: 'built' });
  });
});
```

## 6. **内存占用**：

### 6.1. Vite：

- 开发环境下几乎不占用额外内存
- 按需加载模块

### 6.2. Webpack：

  - 需要在内存中维护打包后的模块
  - 占用更多内存

## 7. **源码映射**：

```javascript hl:2,9
// Vite 源码映射
// 直接使用浏览器原生 sourcemap
{
  type: 'module',
  src: '/src/components/App.vue?t=1634567890'
}

// Webpack 源码映射
// 需要额外的 sourcemap 文件
{
  devtool: 'source-map',
  output: {
    sourceMapFilename: '[name].map'
  }
}
```

## 8. **生态系统支持**：

```javascript
// Webpack 生态
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

// Vite 生态
export default {
  plugins: [
    // Vite 特有的插件系统
    vue(),
    react()
  ]
};
```
