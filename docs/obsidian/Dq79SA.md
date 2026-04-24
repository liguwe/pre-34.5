# JavaScript 引擎

`#javascript` 

## 1. 主要的 JavaScript 引擎包括

1. **V8 (谷歌)**:
	- 开发者：谷歌
	- 用于：Chrome 浏览器、Node.js 等
	- 特色：
		- 使用`即时编译`（JIT，Just-In-Time compilation），
			- 将 JavaScript 代码即时编译成与**机器码**，以提高执行效率。
2. **SpiderMonkey (Mozilla)**:
	- 开发者：Mozilla
	- 用于：Firefox 浏览器
	- 特色：
		- 是第一个 JavaScript 引擎，支持`解释和编译`两种模式，使用多层优化编译器。
3. **Chakra (微软)**:
	- 开发者：微软
	- 用于：曾用于 Internet Explorer 和 Microsoft Edge (旧版，EdgeHTML)
	- 特色：拥有一个强大的 JIT 编译器，支持优化的执行和垃圾回收
		- 转向 webkit，反映了微软的务实态度，通过采用主流的开源解决方案，他们可以提供更好的用户体验，**同时将资源集中在差异化功能的开发上**
4. **JavaScriptCore (苹果)**:
	- 开发者：苹果
	- 用于：Safari 浏览器
	- 特色：
		- 也被称为 `Nitro`，注重内存管理和执行性能

## 2. 工作原理与组成部分

引擎很复杂，但是基本原理很简单

1. 引擎（如果是浏览器，则引擎被嵌入在其中）读取（“解析”）脚本。
2. 然后，引擎将脚本转化（“编译”）为机器语言。
3. 然后，机器代码快速地执行

1. **解析和编译**
	- 代码首先被解析器解析为 AST，
	- 然后 JIT 编译器将部分 AST 编译成机器码。
	- 当运行过程中发现某些代码片段被**频繁调用**，编译器会进一步优化这些片段。
2. **执行**
	- 执行引擎会根据编译后的代码直接运行机器码，从而提高性能
3. **垃圾回收 (Garbage Collection)**
	- JavaScript 引擎会自动管理内存，自动回收不再使用的对象和变量
	- 这通常是通过垃圾回收器实现的，
		- 常见的算法包括：
			- 标记-清除 (mark-and-sweep)
			- 引用计数 (reference counting) 等。

**JavaScript 引擎的组成部分**
1. **解析器 (Parser)**:
	- 将源代码转换成抽象语法树 (AST，Abstract Syntax Tree)。
	- 分析代码结构，保证语法正确。
2. **解释器 (Interpreter)**:
	- 逐行解释和执行 JavaScript 代码，使用 AST 生成中间代码。
3. **编译器 (Compiler)**:
	- JIT 编译器会在运行时将`频繁执行的代码`编译成机器码，以更快地执行。
4. **运行时 (Runtime)**:
	- 提供内置函数、内存管理（如垃圾回收）和执行环境。

```javascript hl:1
// 源代码 -> 解析 -> AST -> 字节码 -> 机器码
const code = `
    function add(a, b) {
        return a + b;
    }
    add(1, 2);
`;

// 1. 解析阶段
// 2. 生成 AST
// 3. 生成字节码
// 4. JIT 编译为机器码
```

引擎处理过程：

```css
源代码 
  ↓
词法分析器 (Lexer)
  ↓ [将代码分解为 tokens]
语法分析器 (Parser)
  ↓ [生成 AST]
解释器 (Interpreter)
  ↓ [生成字节码]
编译器 (Compiler)
  ↓ [生成机器码]
优化编译器
```

> 源码 → token → ast → 字节码 → 机器码

### 2.1. 词法分析（Lexical Analysis）

```javascript
// 词法分析（Lexical Analysis）
// 将源代码分解成 tokens
let x = 42;
// 转换为 tokens：
// [
//   { type: 'keyword', value: 'let' },
//   { type: 'identifier', value: 'x' },
//   { type: 'operator', value: '=' },
//   { type: 'number', value: '42' },
//   { type: 'punctuator', value: ';' }
// ]

// 语法分析（Syntactic Analysis）
// 构建 AST（抽象语法树）

```

### 2.2. 字节码生成：编译

```javascript
// 字节码生成
function example() {
    let x = 1;
    return x + 2;
}

// 可能的字节码表示（伪代码）
/*
LOAD_CONST 1
STORE_FAST 'x'
LOAD_FAST 'x'
LOAD_CONST 2
BINARY_ADD
RETURN_VALUE
*/

```

## 3. **优化机制**

- **即时编译 (Just-In-Time Compilation, JIT)**
	- 使用 JIT 编译器，代码在运行时被动态编译，避免了解释代码的开销
- **内联缓存 (Inline Caching)**
	- 用于加速属性查找和方法调用频繁的对象
	- 下面有介绍
- **惰性解析 (Lazy Parsing)**
	- 只在真正需要时解析 JavaScript 代码，提高初始加载性能
- **垃圾回收优化**
	- 通过分代垃圾回收、增量垃圾回收等技术，提高内存管理效率
- **热点代码优化**：**频繁执行的代码**会被优化
	- 比如 for 循环里面的代码
- **去优化**：
	- 当假设不再成立时，会回退优化

**其实很多思路类似**，
- 比如，**缓存，避免重复搞第二遍**； 
- 比如，**内存，特定时机就得回收，别等到最后**  
- 比如，**惰性解析**，真正需要执行的时候再执行
- 比如，`懒加载，预加载`等等思路
	- 其实`在 JavaScript 引擎`都有体现

### 3.1. **JIT（即时编译）**

```javascript
// 热点代码示例
function hotFunction() {
    // 被频繁调用的代码
    for(let i = 0; i < 1000000; i++) {
        // 执行操作
    }
}
```

### 3.2. **内联缓存 (Inline Caching)** → 缓存

```javascript
function getProperty(obj, prop) {
    return obj[prop];  // 引擎会缓存属性访问路径
}
```

### 3.3. **隐藏类 (Hidden Classes)**

```javascript
// 推荐写法
function Point(x, y) {
    this.x = x;
    this.y = y;
}

// 不推荐写法（会创建多个隐藏类）
let point = {};
point.x = 1;
point.y = 2;
```

## 4. **内存管理**

### 4.1. **堆内存**

```javascript
// 对象存储在堆内存中
const obj = {
    largeData: new Array(1000000)
};
```

### 4.2. **栈内存**

```javascript
// 基本类型和引用存储在栈内存中
let number = 42;
let string = "hello";
```

### 4.3. **垃圾回收**

```javascript
let obj = {
    name: 'test'
};
obj = null; // 标记为可回收
```

## 5. 优化技巧：写代码时的注意事项

### 5.1. **避免动态属性**

```javascript
// 好的做法
function createObject(value) {
    const obj = {
        property: value
    };
    return obj;
}

// 避免这样做
function createObject(value) {
    const obj = {};
    obj.property = value;
    return obj;
}
```

>  不然 JavaScript 引擎不太好优化

### 5.2. **使用类型一致的代码**

```javascript
// 好的做法
function add(a, b) {
    // 总是传入数字类型
    return a + b;
}

// 避免这样做
function add(a, b) {
    // 参数类型不确定
    if (typeof a === 'string') {
        return a + String(b);
    }
    return a + b;
}
```

>  不然 JavaScript 引擎不太好优化

### 5.3. 使用数组时预分配空间

```javascript hl:9
// 2. 使用数组时预分配空间
const arr = new Array(1000); // 好的做法
const arr = []; // 动态增长，可能导致多次重新分配

// 3. 避免稀疏数组
const arr = [1, 2, 3]; // 好的做法
const arr = [];
arr[0] = 1;
arr[1000] = 2; // 避免这样做

```

>  不然 JavaScript 引擎不太好优化

## 6. **性能监控**

```javascript
// 使用 Performance API
console.time('operation');
// 执行操作
console.timeEnd('operation');

// 内存使用情况
console.memory;
```

## 7. **最新发展**

- WebAssembly 集成
- 新的语言特性支持
- 性能优化改进
- 内存管理优化

## 8. **调试和工具**

```javascript hl:6
// 使用 Chrome DevTools
// 设置断点
debugger;

// 性能分析
console.profile('MyProfile');
// ... 代码 ...
console.profileEnd('MyProfile');

// 内存快照
console.memory;
```

### 8.1. 新的性能 API 和调试工具

```javascript hl:8
// 1. 性能监控 API
performance.mark('start');
// 执行代码
performance.mark('end');
performance.measure('操作耗时', 'start', 'end');

// 2. 内存泄漏检测
const tracker = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    // 分析内存使用模式
});

// 3. 新的调试功能
console.profile('DetailedProfile');
// 代码执行
console.profileEnd('DetailedProfile');

```

>  PerformanceObserver 观察者模式监控性能

## 9. 参考

- [https://zh.javascript.info/intro](https://zh.javascript.info/intro)
- [https://kangax.github.io/compat-table](https://kangax.github.io/compat-table) ：
	- 一份列有语言功能以及引擎是否支持这些功能的表格。
