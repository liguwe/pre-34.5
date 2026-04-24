# commonjs 的 require 机制

`#nodejs` 

## 1. 基本加载过程：7 个步骤

1. 解析路径
2. 检查**缓存**
3. 创建**模块对象**
4. 将模块放入**缓存**
5. 加载模块
6. 标记**模块对象** 为已加载
7. 返回 `exports 对象`

```javascript
// require 的基本实现原理
function require(modulePath) {

    // 1. 解析路径
    const absolutePath = resolveModulePath(modulePath);
    
    // 2. 检查缓存
    if (require.cache[absolutePath]) {
        return require.cache[absolutePath].exports;
    }
    
    // 3. 创建模块对象
    const module = {
        exports: {},
        loaded: false,
        id: absolutePath
    };
    
    // 4. 将模块放入缓存
    require.cache[absolutePath] = module;
    
    // 5. 加载模块
    loadModule(absolutePath, module, require);
    
    // 6. 标记为已加载
    module.loaded = true;
    
    // 7. 返回 exports 对象
    return module.exports;
}
```

## 2. 模块缓存机制：查看缓存和清除缓存 →  `require.cache`

```javascript
// example.js
module.exports = {
    count: 0,
    increment() {
        this.count++;
    }
};

// main.js
const module1 = require('./example');
const module2 = require('./example');

console.log(module1 === module2); // true
// 因为缓存的存在，两次 require 返回同一个对象

// 查看缓存
console.log(require.cache);
// 清除缓存
delete require.cache[require.resolve('./example')];
```

## 3. 路径解析规则

1. 核心模块
2. 文件模块
3. npm 包
4. 文件扩展名解析路径 **顺序如下**
	1. `.js`
	2. `.json`
	3. `.node`
	4. `mymodule/index.js

```javascript hl:14
// 1. 核心模块
const fs = require('fs');              // 直接从 Node.js 核心模块加载

// 2. 文件模块
const myModule = require('./myModule'); // 相对路径
const config = require('/opt/config');  // 绝对路径

// 3. npm 包
const lodash = require('lodash');      // 从 node_modules 查找

// 文件扩展名解析顺序
require('./myModule');  

// 依次查找：
// 1. myModule.js
// 2. myModule.json
// 3. myModule.node
// 4. myModule/index.js
```

## 4. 模块包装机制

```javascript hl:1
// Node.js 实际上会将你的模块代码包装在一个函数中
(function(exports, require, module, __filename, __dirname) {
    // 你的模块代码在这里
    const something = require('./something');
    module.exports = {
        // ...
    };
});
```

## 5. 异常处理

- 比如
	- 处理模块不存在
	- 处理模块加载错误

```javascript hl:2,10
try {
    // 处理模块不存在
    const nonExistent = require('./non-existent');
} catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        console.log('模块未找到');
    }
}

// 处理模块加载错误
try {
    const badModule = require('./bad-module');
} catch (err) {
    console.error('模块加载失败:', err);
}
```

## 6. 条件加载

```javascript
// 根据环境加载不同的配置
const config = require(process.env.NODE_ENV === 'production'
    ? './config.prod'
    : './config.dev');

// 动态加载模块
function loadPlugin(name) {
    try {
        return require(`./plugins/${name}`);
    } catch (err) {
        console.error(`插件 ${name} 加载失败`);
        return null;
    }
}
```

## 7. 性能优化：比如 fs/path 等

- **缓存**路径
- **预加载**模块
- **延迟**模块

```javascript hl:1,5,12
// 1. 使用路径缓存
const modulePath = require.resolve('./myModule');
const myModule = require(modulePath);

// 2. 预加载模块
const modules = {
    fs: require('fs'),
    path: require('path'),
    util: require('util')
};

// 3. 延迟加载
let heavyModule;
function getHeavyModule() {
    if (!heavyModule) {
        heavyModule = require('./heavyModule');
    }
    return heavyModule;
}
```

## 8. 模块导出方式

- `module.exports` 导出
- `exports.xxx` 快捷方式

```javascript
// 1. module.exports 导出
module.exports = {
    method1() {},
    method2() {}
};

// 2. exports 快捷方式
exports.method1 = function() {};
exports.method2 = function() {};

// ❌  3. 注意: 直接赋值 exports 无效 
exports = { method: () => {} };  // 这样做是错误的
```

## 9. 目录作为模块

> 先找 pageage.json 中的 main 字段，然后再找对应的文件

```javascript
// myModule/index.js
module.exports = {
    // 模块内容
};

// myModule/package.json
{
    "main": "lib/entry.js"  // 指定入口文件
}

// 使用
const myModule = require('./myModule');
```

## 10. `require.main` 的使用  →  判断该模块是否是入口文件

```javascript
// 检查模块是否为入口文件
if (require.main === module) {
    // 直接运行此文件
    console.log('这是主模块');
} else {
    // 被其他模块引用
    console.log('这是被导入的模块');
}
```

## 11. 调试技巧

```javascript
// 1. 查看模块搜索路径
console.log(module.paths);

// 2. 查看已加载的模块
console.log(Object.keys(require.cache));

// 3. 模块解析路径
console.log(require.resolve('./myModule'));

// 4. 模块元信息
console.log(module);
```

## 12. 最佳实践

1. 总是使用 `const` 声明 `require`
2. 将所有 `require` 语句放在文件顶部
3. 使用明确的文件扩展名
4. 适当使用模块缓存机制
5. 注意循环依赖问题
6. 正确处理异常情况
7. 合理组织模块结构
8. 使用 `package.json` 管理依赖
9. 注意模块加载性能
10. 遵循单一职责原则

## 13. 核心模块是**二进制和缓存**，所以很快

- `require('fs')` 核心模块很快，因为是编译好的`二进制可执行文件` 
	- 缓存：所以很快

## 14. Node.js 中对不同扩展名文件的处理机制


> `js → json → .node → 目录 → inex.js ...`

### 14.1. 扩展名解析优先级

```javascript
// require 的扩展名解析优先级
const path = './myModule';
require(path);  // 按以下顺序查找：
// 1. ./myModule.js
// 2. ./myModule.json
// 3. ./myModule.node
// 4. ./myModule/index.js
// 5. ./myModule/index.json
// 6. ./myModule/index.node
```

### 14.2. `.js` 文件处理

```javascript
// 1. JS 文件会被包装在函数中执行
(function(exports, require, module, __filename, __dirname) {
    // 你的 JS 代码
    const foo = 'bar';
    module.exports = { foo };
});

// 2. 支持所有 JavaScript 特性
// example.js
const fs = require('fs');

class MyClass {
    constructor() {
        this.data = 'test';
    }
}

module.exports = {
    MyClass,
    async readFile(path) {
        return fs.promises.readFile(path, 'utf8');
    }
};
```

### 14.3. .json 文件处理

>  会有 `json.parse ` 的操作

```javascript
// 1. JSON 文件直接被解析为对象
// config.json
{
    "host": "localhost",
    "port": 3000,
    "debug": true
}

// 使用 JSON 文件
const config = require('./config.json');
console.log(config.host);  // localhost

// 2. JSON 文件的错误处理
try {
    const badJson = require('./bad.json');
} catch (err) {
    if (err instanceof SyntaxError) {
        console.error('JSON 解析错误');
    }
}

// 3. JSON 文件是只读的
const config = require('./config.json');
config.port = 4000;  // 修改只影响内存中的副本
// 重新 require 时会获得原始文件的内容
```

### 14.4. `.node` 文件处理

```javascript
// .node 文件是编译好的 C++ 插件
// 1. 加载 .node 文件
try {
    const nativeModule = require('./addon.node');
} catch (err) {
    console.error('加载 native 模块失败:', err);
}

// 2. 通常通过 node-gyp 编译
// binding.gyp
{
    "targets": [{
        "target_name": "addon",
        "sources": [ "addon.cc" ]
    }]
}

// 3. C++ 插件示例
// addon.cc
`#include` <node.h>

void Initialize(v8::Local<v8::Object> exports) {
    // 导出函数和对象
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```

### 14.5. 目录模块处理：查找顺序

总结：`pageage.json 的 main 字段` → `.js` → `.json` → `.node`

```javascript hl:17,18,19,20
// 1. package.json 方式
// myModule/package.json
{
    "name": "myModule",
    "main": "./lib/index.js"  // 指定入口文件
}

// 2. index 文件方式
// myModule/index.js
module.exports = {
    // 模块内容
};

// 3. 目录模块加载顺序
const myModule = require('./myModule');
// 查找顺序：
// 1. ./myModule/package.json 中的 main 字段
// 2. ./myModule/index.js
// 3. ./myModule/index.json
// 4. ./myModule/index.node
```

### 14.6. 特殊文件处理

```javascript
// 1. 处理二进制文件
const binary = require('fs').readFileSync('./file.bin');

// 2. 处理源码文件
const sourceMap = require('./file.js.map');

// 3. 处理配置文件
const tsConfig = require('./tsconfig.json');
const babelConfig = require('./.babelrc');
```

### 14.7. 自定义扩展名处理 →    `require.extensions`

```javascript
// 注册自定义扩展名处理器
require.extensions['.xyz'] = function(module, filename) {
    const content = fs.readFileSync(filename, 'utf8');
    // 处理内容
    module._compile(content, filename);
};

// 使用自定义扩展名
const xyzModule = require('./file.xyz');
```

### 14.8. 文件缓存机制  →  r`equire.cache` 

> require.cache 

```javascript hl:15,1,6
// 1. 不同扩展名的缓存处理
const jsModule = require('./file.js');
const jsonModule = require('./file.json');
const nodeModule = require('./file.node');

// 2. 清除特定扩展名的缓存
function clearCache(extension) {
    Object.keys(require.cache).forEach(key => {
        if (key.endsWith(extension)) {
            delete require.cache[key];
        }
    });
}

// 3. 监视文件变化：fs.watch
const fs = require('fs');
fs.watch('./config.json', (event, filename) => {
    delete require.cache[require.resolve('./config.json')];
});
```

### 14.9. 错误处理最佳实践

```javascript
function safeRequire(path) {
    try {
        return require(path);
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error(`模块 ${path} 不存在`);
        } else if (err instanceof SyntaxError) {
            console.error(`模块 ${path} 语法错误`);
        } else {
            console.error(`加载模块 ${path} 时发生错误:`, err);
        }
        return null;
    }
}

// 使用示例
const config = safeRequire('./config.json') || defaultConfig;
const addon = safeRequire('./addon.node') || mockAddon;
```

### 14.10. 性能考虑

- 缓存：比如使用 map 缓存
- 大文件处理
	- 流式读取
- 延迟处理

```javascript hl:18
// 1. JSON 文件缓存
const configs = new Map();

function loadConfig(path) {
    if (!configs.has(path)) {
        configs.set(path, require(path));
    }
    return configs.get(path);
}

// 2. 大文件处理
const fs = require('fs');
const stream = fs.createReadStream('./large-file.json');
// 使用流处理大型 JSON 文件

// 3. 延迟加载
let heavyModule;
function getHeavyModule() {
    if (!heavyModule) {
        heavyModule = require('./heavy.node');
    }
    return heavyModule;
}
```
