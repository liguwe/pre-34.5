# Webpack 5

`#webpack` 

## 1. 总结

- 持久化缓存
	- 默认启用，使用文件系统缓存
- 顶层 await 支持
- 资源模块 Asset Modules
	- 内置了资源模块类型，不再需要额外的loader
- **模块联邦**
- 改进了对 `WebAssembly` 的支持

## 2. 性能优化：持久化缓存（Persistent Caching）

Webpack 5 引入了更好的**持久化缓存机制**，可以显著提升构建性能：

 - 改进了持久化缓存机制，默认启用
- 通过`文件系统缓存`提高重复构建性能

```javascript hl:4
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem', // 使用文件系统缓存
    buildDependencies: {
      config: [__filename] // 构建依赖
    },
    name: 'my-cache' // 缓存名称
  }
}
```

## 3. 资源模块（Asset Modules）

取代了 `file-loader、url-loader 和 raw-loader`，直接**内置支持资源文件**：
- 内置了资源模块类型，不再需要额外的loader
- 支持四种新的模块类型：
	- asset/source
	- asset
	- asset/inline
	- asset/resource

```javascript hl:7
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset', // 可选 'asset/resource'、'asset/inline'、'asset/source'
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb
          }
        }
      }
    ]
  }
}
```

## 4. 模块联邦（Module Federation） 

>  更多参考：[10. Webpack 5 的 Module Federation](/Qeq16P)

- 允许多个独立的构建可以组成一个应用
- 支持运行时动态加载远程模块
- **实现真正的微前端架构**
- 可以共享依赖，减少重复加载

允许多个独立的构建可以组成一个应用程序：

```javascript
// host/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js'
      }
    })
  ]
}

// remote/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button'
      }
    })
  ]
}
```

## 5. 性能优化：Tree Shaking 优化

 - 改进了Tree Shaking算法
- 能够处理更多的模块类型
- 支持嵌套的树摇，提高打包效率
- 改进了 Tree Shaking 机制，支持更多场景：

```javascript
// package.json
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}

// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    minimize: true
  }
}
```

## 6. 更好的代码生成

支持 ECMAScript 模块的输出：

```javascript hl:6,7
module.exports = {
  experiments: {
    outputModule: true
  },
  output: {
    library: {
      type: 'module'
    }
  }
}
```

## 7. Node.js Polyfills 自动加载被移除

- 不再自动引入 Node.js polyfills
- 减小了打包体积
- 需要显式引入所需的polyfills 
- 更好的Node.js支
	- 改进了对Node.js模块的处理
	- 提供了更好的CommonJS支持

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  }
}
```

## 8. 顶层 await 支持

- 支持在模块顶层使用await
- 无需包装在async函数中

```javascript
// 支持直接在模块顶层使用 await
const data = await fetch('https://api.example.com/data');
export { data };
```

## 9. 改进的开发体验

更好的错误提示和开发工具支持：

```javascript
module.exports = {
  stats: {
    errorDetails: true
  }
}
```

## 10. 新的 WebAssembly 支持

改进了对 WebAssembly 的支持：
- 异步导入WebAssembly
- 支持WebAssembly as ESM
- 改进的WebAssembly集成

```javascript
module.exports = {
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true
  }
}
```

## 11. 改进的长期缓存

通过确定性的模块 ID 和 chunk ID 生成算法：

```javascript
module.exports = {
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  }
}
```

## 12. 更新的配置验证

更严格的配置验证：

```javascript
module.exports = {
  mode: 'production', // 必须指定 mode
  entry: './src/index.js',
  output: {
    clean: true // 构建前清理输出目录的新选项
  }
}
```

## 13. 改进的打包体积

优化了打包体积，移除了一些内部结构：

```javascript
module.exports = {
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000
    }
  }
}
```

## 14. 主要优势总结

- 性能提升：
	- 持久化缓存提升构建速度
	- 改进的 Tree Shaking
	- 更优的长期缓存策略
- 开发体验：
	- 内置资源模块处理
	- 更好的错误提示
	- 更严格的配置验证
- 新功能：
	- 模块联邦支持微前端架构
	- 原生支持 `WebAssembly`
	- 支持`顶层 await`
- 包体积优化：
	- 移除自动的 Node.js polyfills
	- 优化内部结构
	- 更好的代码生成
