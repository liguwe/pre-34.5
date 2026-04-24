# Babel  的原理（篇一）

`#babel` 

## 总结

- 源码 → 解析 → token → AST 
	- 多叉树遍历 → 生成代码 → 目标代码
- babel 插件系统

## 1. Babel 的整体工作流程图

````mermaid

    graph TB
    A[源代码] --> B[Parse解析]
    B --> C[词法分析<br>Tokenizer]
    C --> D[语法分析<br>Parser]
    D --> E[AST<br>抽象语法树]
    E --> F[Transform转换]
    F --> G[遍历<br>Traverse]
    G --> H[访问<br>Visitor]
    H --> I[修改AST]
    I --> J[Generate生成]
    J --> K[目标代码]
````

## 2. 解析（Parse）

   - 词法分析（Tokenizer）：将源代码转换成令牌（Token）流
   - 语法分析（Parser）：将令牌流转换成 AST
   
让我们看一个具体的例子：

```javascript
// 源代码
const sum = (a, b) => a + b;

// 词法分析后的 Tokens（简化表示）
[
  { type: "keyword", value: "const" },
  { type: "identifier", value: "sum" },
  { type: "operator", value: "=" },
  { type: "punctuator", value: "(" },
  { type: "identifier", value: "a" },
  { type: "punctuator", value: "," },
  { type: "identifier", value: "b" },
  { type: "punctuator", value: ")" },
  { type: "operator", value: "=>" },
  { type: "identifier", value: "a" },
  { type: "operator", value: "+" },
  { type: "identifier", value: "b" }
]
```

## 3. 转换（Transform）

   - 遍历（Traverse）：深度优先遍历 AST
   - 访问（Visitor）：对 AST 节点进行增删改
   - 应用插件：使用各种 Babel 插件转换代码

这是 AST 的简化示例：

```javascript
{
  type: "Program",
  body: [{
    type: "VariableDeclaration",
    declarations: [{
      type: "VariableDeclarator",
      id: {
        type: "Identifier",
        name: "sum"
      },
      init: {
        type: "ArrowFunctionExpression",
        params: [
          {
            type: "Identifier",
            name: "a"
          },
          {
            type: "Identifier",
            name: "b"
          }
        ],
        body: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "Identifier",
            name: "a"
          },
          right: {
            type: "Identifier",
            name: "b"
          }
        }
      }
    }]
  }]
}
```

## 4. 生成（Generate）

   - 根据转换后的 AST 生成新的代码
   - 处理格式化、空白和注释

转换后的代码可能如下：

```javascript
"use strict";

var sum = function sum(a, b) {
  return a + b;
};
```

## 5. Babel 插件系统

Babel 的强大之处在于其插件系统：

### 5.1. 语法插件（Syntax Plugins）

- 用于解析特定语法
- 例如：@babel/plugin-syntax-jsx

### 5.2. 转换插件（Transform Plugins）

- 用于转换特定语法
- 例如：@babel/plugin-transform-arrow-functions

### 5.3. 预设（Presets）

- 插件集合
- 常用预设：@babel/preset-env, @babel/preset-react

配置示例

```javascript
// babel.config.js
module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: {
        browsers: ["> 1%", "last 2 versions"]
      }
    }]
  ],
  plugins: [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-runtime"
  ]
}
```

## 6. 常用包

### 6.1. @babel/parser

这个 API 用于将源代码解析成 AST（抽象语法树）。

```javascript
const parser = require('@babel/parser');

const code = 'const square = (x) => x * x;';
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

console.log(ast);
```

### 6.2. @babel/traverse

这个 API 用于遍历和修改 AST

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = 'const square = (x) => x * x;';
const ast = parser.parse(code);

traverse(ast, {
  ArrowFunctionExpression(path) {
    console.log('Found an arrow function');
  },
  Identifier(path) {
    console.log(`Found identifier: ${path.node.name}`);
  }
});
```

### 6.3. @babel/types

这个 API 提供了用于 AST 节点的类型检查和节点创建的方法。

```javascript
const t = require('@babel/types');

// 创建一个标识符节点
const identifier = t.identifier('x');

// 创建一个二元表达式节点
const binaryExpression = t.binaryExpression('*', identifier, identifier);

// 创建一个箭头函数表达式节点
const arrowFunction = t.arrowFunctionExpression(
  [identifier],
  binaryExpression
);

console.log(arrowFunction);
```

### 6.4. @babel/generator

这个 API 用于从 AST 生成代码。

```javascript
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;

const code = 'const square = (x) => x * x;';
const ast = parser.parse(code);

const output = generate(ast, {}, code);
console.log(output.code);
```

### 6.5. @babel/core

这是 Babel 的核心 API，它结合了解析、转换和生成的功能。

```javascript
const babel = require('@babel/core');

const code = 'const square = (x) => x * x;';

babel.transform(code, {
  plugins: ['@babel/plugin-transform-arrow-functions']
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result.code);
  }
});
```

### 6.6. 更复杂的例子

示如何使用这些 API 来创建一个简单的 Babel 插件：

这个例子展示了如何创建一个简单的 Babel 插件，将字符串连接操作 (`+`) 转换为 `String.concat()` 方法调用。

````js
  const parser = require('@babel/parser');
  const traverse = require('@babel/traverse').default;
  const generate = require('@babel/generator').default;
  const t = require('@babel/types');

  // 源代码
  const code = `
  function greet(name) {
    console.log('Hello, ' + name + '!');
  }
  `;

  // 解析代码为 AST
  const ast = parser.parse(code);

  // 遍历 AST 并修改
  traverse(ast, {
    BinaryExpression(path) {
      if (path.node.operator === '+') {
        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier('String'), t.identifier('concat')),
            path.node.left.type === 'StringLiteral' 
              ? [path.node.left, path.node.right]
              : [path.node.right, path.node.left]
          )
        );
      }
    }
  });

  // 生成新的代码
  const output = generate(ast, {}, code);

  console.log('转换后的代码:');
  console.log(output.code);
````
