# Webpack 的三种hash模式

`#webpack` 

## 1. Hash

只要项目中有任何文件发生变化，所有文件的 hash 都会改变。

示例：
```javascript
output: {
    filename: '[name].[hash].js'
}
```

缺点：
- 不利于浏览器缓存，因为即使只修改了一个文件，所有文件的 hash 都会变化。
- 不利用**版本管理**

## 2. Chunkhash

`Chunkhash` 基于不同的入口文件(entry)进行依赖文件解析、构建对应的 chunk，生成对应的hash值。

特点：
- 同一个chunk中的文件 hash 值相同。
- 不同 chunk 的hash值不同。
- 适用于**多入口项目**。

示例：

```javascript
output: {
    filename: '[name].[chunkhash].js'
}
```

优点：

- 相对于 hash，chunkhash 能够更好地利用浏览器缓存。

## 3. `Contenthash`

Contenthash是最精确的hash模式，它根据文件内容来生成hash值。

特点：
- 只有当文件内容发生变化时，该文件的hash才会改变。
- 最适合用于缓存。

示例：
```javascript
output: {
    filename: '[name].[contenthash].js'
}
```

优点：
- 能够最大化利用浏览器缓存。
- 即使是在同一个chunk中，如果文件内容没有变化，hash也不会改变。

## 4. 使用建议

- 对于 JavaScript 文件，推荐使用 `chunkhash`
- 对于 CSS 文件，推荐使用 `contenthash`
	- 因为不希望 css 内容变化影响到 js 
- 对于图片和字体等资源文件，可以使用 `hash` 或 `contenthash` 

需要确保在生产环境中**最大化利用浏览器缓存**，提高应用性能。

理解并正确使用这三种hash模式可以帮助您更好地**管理文件版本和优化缓存策略**，这在大型项目中尤为重要。

## 5. webpack的 区分三种hash模式的疑问❓

webpack的 区分三种hash模式：
- hash chunkhash 和 contentHash
- 我理解打包的时候contentHash会影响chunkhash，chunkhash会影响 hash ,所以最终不就是一个模式嘛，为什么还建议对于 CSS 文件，推荐使用 `contenthash` 之类的？

### 5.1. 三种 Hash 的定义和特点

```javascript
// webpack.config.js
module.exports = {
  output: {
    // 1. hash
    filename: '[name].[hash].js',
    // 2. chunkhash
    filename: '[name].[chunkhash].js',
    // 3. contenthash
    filename: '[name].[contenthash].js'
  }
};
```

#### 5.1.1. hash

- 项目级别的 hash，只要项目文件有修改，整个项目构建的 hash 值就会改变
```javascript
// 示例：所有文件使用相同的 hash
{
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
  ]
}
```

#### 5.1.2. chunkhash

- 基于入口文件(entry)进行依赖解析，构建对应的 chunk 生成的 hash
```javascript
// 示例：按照 chunk 生成 hash
{
  entry: {
    main: './src/main.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: '[name].[chunkhash].js'
  }
}
```

#### 5.1.3. contenthash

- 基于文件内容生成 hash，文件内容不变，hash 就不变
```javascript
// 示例：CSS 文件使用 contenthash
new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css'
})
```

### 5.2. 为什么需要不同的 hash 模式？

让我们通过一个实际的例子来说明：

```javascript
// 项目结构
src/
  ├── index.js
  ├── style.css
  ├── utils.js
  └── vendor.js

// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
};
```

#### 5.2.1. 场景1：只修改 JS 代码

```javascript
// 修改 index.js
- console.log('Hello');
+ console.log('Hello World');

// 构建结果
main.abc123.js        → main.xyz789.js      // 变化
main.abc123.css       → main.abc123.css     // 不变
vendor.def456.js      → vendor.def456.js    // 不变
```

#### 5.2.2. 场景2：只修改 CSS 代码

```css
/* 修改 style.css */
.title {
-  color: black;
+  color: blue;
}

// 构建结果
main.abc123.js        → main.abc123.js      // 不变
main.abc123.css       → main.xyz789.css     // 变化
vendor.def456.js      → vendor.def456.js    // 不变
```

#### 5.2.3. 场景3：修改公共依赖

```javascript
// 修改 utils.js（被多个文件引用）
- export const add = (a, b) => a + b;
+ export const add = (a, b) => Number(a) + Number(b);

// 构建结果（使用 hash）
main.abc123.js        → main.xyz789.js      // 全部变化
vendor.def456.js      → vendor.xyz789.js    // 全部变化
main.abc123.css       → main.xyz789.css     // 全部变化

// 构建结果（使用 chunkhash）
main.abc123.js        → main.xyz789.js      // 变化
vendor.def456.js      → vendor.def456.js    // 不变
main.abc123.css       → main.abc123.css     // 不变

// 构建结果（使用 contenthash）
main.abc123.js        → main.xyz789.js      // 变化
vendor.def456.js      → vendor.def456.js    // 不变
main.abc123.css       → main.abc123.css     // 不变
```

### 5.3. 最佳实践

```javascript
// webpack.config.js
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    // JS 文件使用 chunkhash
    filename: '[name].[chunkhash].js',
    // 第三方库使用 chunkhash
    chunkFilename: '[name].[chunkhash].chunk.js'
  },
  plugins: [
    // CSS 文件使用 contenthash
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css'
    })
  ],
  optimization: {
    // 提取公共模块
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    }
  }
};
```

### 5.4. 为什么推荐 CSS 使用 contenthash？

1. **独立的缓存控制**：
```javascript
// CSS 文件的变化不应该影响 JS 文件的 hash
import './style.css';
// 即使 style.css 改变，这个 JS 文件的 hash 也不应该改变
```

2. **更精确的缓存失效**：
```css
/* style.css */
.button { color: blue; }

/* 只修改 CSS 时，只有 CSS 文件的 hash 改变 */
// old: style.abc123.css
// new: style.xyz789.css
// js 文件保持不变: main.def456.js
```

3. **更好的浏览器缓存利用**：
```javascript
// 浏览器可以分别缓存 JS 和 CSS 文件
// 当只有 CSS 变化时，用户只需要重新下载 CSS 文件
```

### 5.5. 实际应用示例

```javascript
// 完整的 webpack 配置示例
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    admin: './src/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    })
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: -20
        }
      }
    }
  }
};
```

总结：
1. 不同的 hash 模式服务于不同的缓存策略
2. contenthash 提供了最细粒度的缓存控制
3. 合理使用不同的 hash 模式可以优化缓存效果
4. CSS 文件使用 contenthash 可以实现与 JS 文件的解耦
