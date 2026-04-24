# cjs 与 esm

`#nodejs` 

## 1. cjm / esm 的区别

### 1.1. 引用与拷贝

- ESM 输出的是`值的引用`
- 而 CJS 输出的是`值的拷贝`

### 1.2. 运行时与编译时

- CJS 的输出是`运行时加载`
- 而 ESM 是 `编译时` 输出接口

### 1.3. 同步与异步

- CJS是`同步加载`，ESM是`异步加载`； 
	- 同步是服务器代码都在**本地**，浏览器需要去**异步**拿
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027-1.png)

### 1.4. 动态加载

- 都支持 `动态加载`
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027-2.png)

### 1.5. 文件扩展名与 `package.json`配置

- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027-3.png)

### 1.6. 顶级 `await` 支持

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027-4.png)

### 1.7. `this` 指向

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027-5.png)

>  ??? 如果直接在浏览器中 `console.log(this)` 打印出 `window` ？ 为什么

### 1.8. **循环引用**的处理差异

- CommonJS
	- 模块在首次 `require` 时会被 `缓存`
		- 因为是`缓存` ，所以避免了 **无限循环**
	- 如果出现循环引用，会返回未完成的导出对象
	- 可能导致获取到部分初始化的对象
- ESM
	- 使用绑定`引用`而不是值`拷贝`
	- 提供了`静态分析能力`，可以在`编译`时检测问题
	- `webpack 插件`或者 `vite 插件`检测是否循环引用了

### 1.9. ESM 下处理循环引用的几个主要解决方案

#### 1.9.1. **使用函数包装**

```javascript
// a.js
import { getB } from './b.js';
export const a = 1;
export function getA() { 
    return a; 
}

// b.js
import { getA } from './a.js';
export const b = 2;
export function getB() { 
    return b; 
}
```

#### 1.9.2. **动态导入**

```javascript
// a.js
export const a = 1;
// 使用动态导入替代静态导入
const b = await import('./b.js');

// b.js
export const b = 2;
const a = await import('./a.js');
```

#### 1.9.3. **提取共享代码**

```javascript
// shared.js
export const shared = {};

// a.js 和 b.js 都引用 shared.js
import { shared } from './shared.js';
```

### 1.10. 错误处理机制

#### 1.10.1. cjs 

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241027.png)

```javascript
// CJS
try {
    require('./non-existent');
} catch (err) {
    console.log(err.code);  // MODULE_NOT_FOUND
}

// ESM
import './non-existent.js'
    .catch(err => {
        console.log(err.code);  // ERR_MODULE_NOT_FOUND
    });

```

## 2. ESM 和 CJS 的混合使用

>  **只要知道可以混用，并且需要配置 package.json 支持双模式即可**，需要时再查询即可

### 2.1. ESM 中使用 CJS 模块

```javascript hl:1,9
// 方法1：使用 createRequire
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 现在可以使用 require 了
const fs = require('fs');
const lodash = require('lodash');

// 方法2：使用动态 import 代替 require
// cjs-module.js (CommonJS)
module.exports = { hello: 'world' };

// esm-module.mjs (ESM)
const cjsModule = await import('./cjs-module.js');
console.log(cjsModule.default.hello); // 注意：需要使用 .default
```

### 2.2. CJS 中使用 ESM 模块

```javascript hl:1,12
// 方法1：使用异步 import()
// esm-module.mjs
export const hello = 'world';

// cjs-module.js
async function loadEsm() {
    const esmModule = await import('./esm-module.mjs');
    console.log(esmModule.hello);
}
loadEsm();

// 方法2：使用 async/await 包装
(async () => {
    const { hello } = await import('./esm-module.mjs');
    console.log(hello);
})();
```

### 2.3. 包装 CJS 模块为 ESM

```javascript hl:8
// wrapper.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 导入 CJS 模块
const cjsModule = require('./cjs-module');

// 重新导出为 ESM
export const { methodA, methodB } = cjsModule;
export default cjsModule;
```

### 2.4. 在 package.json 中配置双模式支持

```json
{
    "name": "my-package",
    "exports": {
        ".": {
            "import": "./dist/index.mjs",
            "require": "./dist/index.cjs"
        }
    },
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "type": "module"
}
```

### 2.5. 条件导出

```javascript
// index.cjs
if (typeof require !== 'undefined') {
    module.exports = require('./cjs/index.js');
}

// index.mjs
export * from './esm/index.js';
```

### 2.6. 处理不同的导出方式

```javascript hl:10
// CJS 模块
// math.cjs
module.exports = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// ESM 包装器
// math.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const cjsMath = require('./math.cjs');

// 重新导出为具名导出
export const { add, subtract } = cjsMath;

// 同时提供默认导出
export default cjsMath;
```

### 2.7. 处理异步操作

```javascript
// async-cjs.cjs
module.exports = async function getData() {
    return Promise.resolve('data');
};

// async-esm.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const getData = require('./async-cjs.cjs');

// 使用异步函数包装
export async function fetchData() {
    return await getData();
}
```

### 2.8. 类型定义的处理

```typescript
// types.d.ts
declare module 'my-mixed-module' {
    // CJS 风格
    export = {
        method: () => void
    };
    
    // ESM 风格
    export const method: () => void;
}
```

### 2.9. 动态导入处理

- 先尝试 ESM 导入
- 降级到 CJS

```javascript
// dynamic-import.mjs
async function loadModule(modulePath) {
    try {
        // 尝试 ESM 导入
        return await import(modulePath);
    } catch (err) {
        // 降级到 CJS
        const require = createRequire(import.meta.url);
        return require(modulePath);
    }
}
```

### 2.10. 环境检测：`typeof require === 'undefined'`

```javascript
// utils.js
export function isESM() {
    return typeof require === 'undefined';
}

export function isCJS() {
    return typeof require !== 'undefined';
}

// 根据环境使用不同的导入方式
const loader = isESM() ? 
    (m) => import(m) : 
    (m) => Promise.resolve(require(m));
```

### 2.11. 错误处理

```javascript
// error-handler.mjs
export async function safeImport(modulePath) {
    try {
        const module = await import(modulePath);
        return module;
    } catch (err) {
        if (err.code === 'ERR_REQUIRE_ESM') {
            // 处理 ESM 模块的情况
            console.log('This is an ESM module');
        } else if (err.code === 'MODULE_NOT_FOUND') {
            // 处理模块未找到的情况
            console.log('Module not found');
        }
        throw err;
    }
}
```

### 2.12. 构建工具配置

```javascript
// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/bundle.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/bundle.esm.js',
            format: 'esm'
        }
    ],
    plugins: [
        commonjs() // 转换 CJS 到 ESM
    ]
};
```

### 2.13. 最佳实践建议

1. 尽可能使用 ESM
2. 为旧模块提供 ESM 包装器
3. **在 package.json 中提供双模式支持**
4. 使用构建工具处理兼容性
5. 谨慎处理异步操作
6. 提供清晰的类型定义
7. 做好错误处理
8. 考虑向后兼容性

这样的混合使用策略可以帮助你在过渡期间平稳地处理不同模块系统的代码。

## 3. `module.exports` 和 `exports` 的区别

### 3.1. 基本关系

```javascript
// Node.js 模块系统中
exports = module.exports = {};  // 初始时，exports 是 module.exports 的引用
```

### 3.2. 关键区别

```javascript hl:8
// 正确使用
exports.foo = 'bar';           // 添加属性有效

module.exports.foo = 'bar';    // 添加属性有效
module.exports = { foo: 'bar' };// 直接赋值有效

// 错误使用
// 无效！这会断开与 module.exports 的引用
exports = { foo: 'bar' };      
```

### 3.3. 简单记忆

- `exports` 只能通过 `.` 语法添加属性
- `module.exports` 可以直接赋值新对象
- 最终导出的始终是 `module.exports` 的值

### 3.4. 最后

- 总结：`exports` 是 `module.exports` 的引用，`exports` 只能通过 `.`添加属性
	- 因此，为避免混淆，建议统一使用 `module.exports`

## 4. Node.js 在使用 ES modules 时要求加上文件扩展名有几个重要原因

### 4.1. 明确性和性能

Node.js 要求在导入 ES modules 时使用文件扩展名，主要是为了提高模块解析的明确性和性能。

```javascript
// 正确的导入方式
import { someFunction } from './myModule.js';

// 错误的导入方式（在 ES modules 中）
import { someFunction } from './myModule'; // 这将导致错误
```

通过明确指定文件扩展名，Node.js 可以直接定位到正确的文件，而不需要尝试多种可能的文件扩展名。这样可以减少文件系统的查找次数，提高模块加载的效率。

### 4.2. 与浏览器环境的一致性

在浏览器环境中，使用 ES modules 时通常需要指定完整的文件名（包括扩展名）。Node.js 采用相同的方式可以保持与浏览器环境的一致性，使得代码在不同环境中的行为更加一致。

```html hl:2
<!-- 在浏览器中 -->
<script type="module" src="./myModule.js"></script>
```

### 4.3. 避免歧义

在 Node.js 中，不同的文件扩展名可能对应不同的模块类型或处理方式。例如，`.js`、`.mjs`、`.cjs` 分别可能表示不同的模块系统。通过明确指定扩展名，可以避免潜在的歧义。

```javascript
import { func1 } from './module1.js';  // ES module
import { func2 } from './module2.mjs'; // ES module（显式）
const { func3 } = require('./module3.cjs'); // CommonJS module
```

### 4.4. 简化模块解析逻辑

通过要求明确的文件扩展名，Node.js 可以简化其模块解析逻辑。这不仅提高了性能，还减少了可能的错误和意外行为。

### 4.5. 区分文件类型

在一个项目中，可能存在同名但不同类型的文件（如 `data.json` 和 `data.js`）。强制使用扩展名可以明确指定要导入的确切文件。

```javascript
import data from './data.json';
import { processData } from './data.js';
```

### 4.6. 未来兼容性

这种做法为未来可能出现的新文件类型或模块系统留下了扩展空间，而不会破坏现有的导入语句。
