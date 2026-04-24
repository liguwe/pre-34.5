# Eslint 的原理

`#前端工程化` 

## 1. 总结

- 原理：
	- 将代码解析成 AST，然后使用**访问者模式**遍历 AST 节点
	- 对每个节点使用 **配置的规则**进行检查

## 2. ESLint 的工作原理

**将代码解析成 AST，然后使用**访问者模式**遍历 AST 节点，对每个节点应用配置的规则进行检查**。这种方式既保证了检查的准确性，也提供了足够的灵活性来自定义规则。

## 3. ESLint 工作流程

ESLint 的代码检查主要分为以下几个步骤：

```mermaid
graph LR
    A[源代码] --> B[解析器]
    B --> C[AST生成]
    C --> D[规则校验]
    D --> E[问题报告]
```

## 4. 详细步骤解释

### 4.1. 解析（Parsing）

```javascript
// 示例代码
function hello() {
    console.log('Hello');
}
```

解析器（默认是 Espree）会：
1. 将代码转换成令牌（Tokens）
2. 检查语法是否正确
3. 生成抽象语法树（AST）

```javascript
// 转换成的令牌示例
[
    { type: "Keyword", value: "function" },
    { type: "Identifier", value: "hello" },
    { type: "Punctuator", value: "(" },
    { type: "Punctuator", value: ")" },
    { type: "Punctuator", value: "{" },
    // ...
]
```

### 4.2. AST（抽象语法树）生成

```javascript
// AST 结构示例（简化版）
{
    type: "Program",
    body: [{
        type: "FunctionDeclaration",
        id: {
            type: "Identifier",
            name: "hello"
        },
        params: [],
        body: {
            type: "BlockStatement",
            body: [{
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "console" },
                        property: { type: "Identifier", name: "log" }
                    }
                }
            }]
        }
    }]
}
```

### 4.3. 规则校验

```javascript
// ESLint 规则示例
module.exports = {
    rules: {
        'no-console': {
            create: function(context) {
                return {
                    // 访问者模式
                    CallExpression: function(node) {
                        if (node.callee.type === 'MemberExpression' &&
                            node.callee.object.name === 'console') {
                            context.report({
                                node: node,
                                message: 'Unexpected console statement.'
                            });
                        }
                    }
                };
            }
        }
    }
};
```

## 5. 自定义规则示例

```javascript hl:10
// 创建一个禁止使用特定变量名的规则
module.exports = {
    create: function(context) {
        return {
            Identifier: function(node) {
                // 检查变量名是否为 'foo'
                if (node.name === 'foo') {
                    context.report({
                        node: node,
                        message: "变量名 'foo' 是被禁止的"
                    });
                }
            }
        };
    }
};
```

## 6. 配置文件示例

```javascript
// .eslintrc.js
module.exports = {
    // 解析器选项
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module'
    },
    // 环境
    env: {
        browser: true,
        node: true
    },
    // 规则配置
    rules: {
        'no-console': 'error',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single']
    }
};
```

## 7. 工作流集成

```javascript hl:9
// package.json
{
    "scripts": {
        "lint": "eslint src/**/*.js",
        "lint:fix": "eslint src/**/*.js --fix"
    },
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.js": ["eslint --fix", "git add"]
    }
}
```

## 8. 性能优化建议

### 8.1. **使用缓存**

```bash
# 使用 eslint 的缓存功能
eslint --cache src/
```

### 8.2. **忽略不需要检查的文件**

```javascript
// .eslintignore
node_modules/
dist/
build/
```

### 8.3. **并行处理**

```bash
# 使用 eslint-parallel 进行并行检查
eslint-parallel src/
```

## 9. 常见问题处理

### 9.1. **规则冲突**

```javascript
// .eslintrc.js
module.exports = {
    rules: {
        // 处理与 Prettier 的冲突
        'prettier/prettier': 'error',
        // 关闭可能冲突的规则
        'max-len': 'off'
    }
};
```

### 9.2. **自定义处理器**

```javascript
// 处理非 JavaScript 文件
module.exports = {
    processors: {
        '.vue': require('eslint-plugin-vue/processor')
    }
};
```
