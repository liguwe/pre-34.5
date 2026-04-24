# Source Map 的本质和实现原理

### 19.1. Source Map 是什么？

Source Map **是一个 JSON 格式的文件**，它建立了转换后的**代码与源代码之间的映射关系**。主要用于解决以下问题：

1. **代码转换问题**：
	- ES6 → ES5 转换
	- TypeScript → JavaScript 编译
	- 代码压缩和混淆
	- CSS 预处理器编译

2. **调试需求**：
	- 在浏览器中直接调试源代码
	- 准确定位运行时错误
	- 显示原始变量名和函数名

### 19.2. Source Map 文件结构

一个典型的 Source Map 文件结构：

>  关键字段是 `mappings`

```json hl:11
{
  "version": 3,
  "file": "out.js",
  "sourceRoot": "",
  "sources": ["foo.js", "bar.js"],
  "sourcesContent": [
    "function foo() { ... }",
    "function bar() { ... }"
  ],
  "names": ["foo", "bar", "console", "log"],
  "mappings": "AAAA,SAASA,MAAMA,CAAA..."
}
```

字段详解：

- `version`: Source Map 规范版本
- `file`: 输出文件名
- `sourceRoot`: 源文件根目录
- `sources`: 源文件列表
- `sourcesContent`: 源文件内容
- `names`: 变量和函数名列表
- `mappings`: 位置映射信息

### 19.3. 映射原理详解

#### 19.3.1. VLQ 编码

Source Map 使用 Base64 VLQ（Variable-Length Quantity）编码来表示映射关系。

```javascript
// 示例：源代码
function hello() {
    console.log("Hello");
}

// 压缩后
function hello(){console.log("Hello")}

// mappings 片段
"AAAA,SAASA,KAAK..."
```

每个分段包含 5 个部分：
1. 转换后的列号
2. 源文件索引
3. 源代码行号
4. 源代码列号
5. 名字索引

#### 19.3.2. 映射格式示例

```javascript
// 源代码示例
let x = 1;
console.log(x);

// 生成的映射关系（简化表示）
{
  生成位置: [0, 0],  // 第0行，第0列
  源文件: "source.js",
  源位置: [0, 0],    // 原始第0行，第0列
  源名称: "x"
}
```

### 19.4. 实现原理深入

让我们通过一个简单的例子来理解 Source Map 的生成过程：

```javascript
// 1. 源代码
const name = "John";
console.log(name);

// 2. 压缩后代码
const a="John";console.log(a);

// 3. 生成映射过程
let mapping = {
  // 记录每个位置的映射关系
  positions: [
    {
      // const name = "John";
      generated: {line: 1, column: 0},
      original: {line: 1, column: 0},
      source: 'source.js',
      name: 'name'
    },
    {
      // console.log
      generated: {line: 1, column: 14},
      original: {line: 2, column: 0},
      source: 'source.js'
    }
  ]
};
```

#### 19.4.1. 生成算法核心步骤

```javascript hl:15
function generateSourceMap(source, generated) {
  const map = new SourceMapGenerator({
    file: 'output.js'
  });

  // 1. 解析源代码
  const ast = parse(source);
  
  // 2. 遍历 AST，记录位置信息
  traverse(ast, {
    enter(path) {
      const original = path.node.loc.start;
      const generated = getGeneratedPosition(path);
      
      // 3. 添加映射
      map.addMapping({
        generated: generated,
        original: original,
        source: 'input.js',
        name: path.node.name
      });
    }
  });
  
  return map.toString();
}
```

### 19.5. 实际应用示例

#### 19.5.1. Webpack 中的 Source Map 配置

```javascript
// webpack.config.js
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceMaps: true
          }
        }
      }
    ]
  }
};
```

#### 19.5.2. 自定义 Source Map 生成

```javascript
// 简单的 Source Map 生成器示例
class SimpleSourceMapGenerator {
  constructor() {
    this.mappings = [];
  }

  addMapping(generated, original, source) {
    this.mappings.push({
      generated: generated,
      original: original,
      source: source
    });
  }

  generate() {
    return {
      version: 3,
      file: "output.js",
      sources: [this.mappings[0].source],
      mappings: this.encodeMappings(),
      names: []
    };
  }

  // VLQ 编码实现（简化版）
  encodeMappings() {
    return this.mappings
      .map(mapping => this.encodeMapping(mapping))
      .join(';');
  }
}
```

### 19.6. 调试与应用

#### 19.6.1. 浏览器中的使用：两种方式

> 下面两种方式，浏览器会自动识别

```javascript hl:1,4
// 在生成的代码末尾添加 source map 引用
//# sourceMappingURL=output.js.map

// 或通过 HTTP 头
SourceMap: /path/to/file.js.map
```

#### 19.6.2. Node.js 中的使用：需要启用 source map 支持

```javascript
// 启用 source map 支持
require('source-map-support').install();

// 错误堆栈将显示源代码位置
try {
  throw new Error('Test');
} catch (err) {
  console.log(err.stack);  // 将显示源代码行号
}
```

### 19.7. 性能考虑

1. **文件大小优化**：
```javascript
// webpack 配置
module.exports = {
  devtool: process.env.NODE_ENV === 'development'
    ? 'eval-cheap-module-source-map'  // 开发环境，更快的构建速度
    : 'hidden-source-map'             // 生产环境，仅用于错误追踪
}
```

2. **按需加载**：
```javascript
// 仅在需要时加载 source map
if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install();
}
```
