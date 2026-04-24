# JavaScript 的垃圾回收机制

`#javascript` 

## 1. 垃圾回收机制：一般就两种

- `标记清理`
	- **离开作用域的值** 会被自动标记为可回收，然后在**垃圾回收期间**被删除
		- 下面会展开
- `引用计数`是另一种垃圾回收策略，需要记录值被引用了多少次
	- **循环引用场景会出问题**

## 2. 标记-清除：**两个阶段**

最常用的垃圾回收算法是 **标记-清除 (Mark-and-Sweep)**。以下是主要特点和步骤
1. **标记阶段 (Marking Phase)**:
	- 从根对象（例如全局对象、局部变量等）开始，标记所有可达的对象，即有引用的对象
2. **清除阶段 (Sweeping Phase)**:
	- 遍历内存，将未被标记的对象视为垃圾，并将其内存释放

## 3. 其他优化策略

1. **分代垃圾回收 (Generational Garbage Collection)**:
	- 将内存分为两代：
		- **新生代和老生代**
	- 新生代对象生命周期**短**，频繁回收
	- 老生代对象生命周期**长**，较少回收
2. **增量垃圾回收 (Incremental Garbage Collection)**:
	- 将标记和清除过程分成多个小步进行，以避免长时间停顿
3. **惰性垃圾回收 (Lazy Garbage Collection)**:
	- 当**系统空闲时**才进行垃圾回收，减少对应用程序性能的影响。

### 3.1. 垃圾回收触发条件

- 内存使用达到**一定阈值**。
- **系统空闲时**主动触发垃圾回收。

### 3.2. 优点

- **自动内存管理**：
	- 开发者无需手动管理内存，减少内存泄漏风险。
- **优化性能**：
	- 现代垃圾回收机制通过多种优化策略，降低了对应用性能的影响。

### 3.3. 缺点

- **不可控性**：
	- 垃圾回收时机和频率由引擎管理，**开发者无法完全控制**。
- **潜在的性能影响**：
	- 尽管有多种优化策略，但垃圾回收仍可能在高负载应用中引入停顿


## 4. 是否有什么办法能够主动触发垃圾回收？

**在常规 JavaScript 中，不能直接、可靠地触发垃圾回收（Garbage Collection，GC）**，
- 因为这是由 JavaScript 引擎自动管理的
- 不过也有一些特定环境或者间接的方法触发

### 4.1. 开发环境下的调试方法

```javascript hl:1,10
// Chrome DevTools
// 1. 打开开发者工具
// 2. 打开 Memory 面板
// 3. 点击垃圾桶图标 "Collect garbage"

// Node.js 环境
if (global.gc) {
    global.gc();
}
// 需要使用 --expose-gc 参数启动 Node.js
// node --expose-gc script.js
```

### 4.2. 间接触发 GC 的常见做法

```javascript hl:6
// 1. 解除引用
let obj = { data: "some data" };
obj = null;  // 解除引用，使对象可被回收

// 2. 使用 WeakRef 和 WeakMap
let weakRef = new WeakRef(obj);
obj = null;  // 原对象可能被回收

// 3. 闭包内的变量
function createClosure() {
    let largeData = new Array(1000000);
    return function() {
        // largeData 在这里被引用
    };
}
let closure = createClosure();
closure = null; // 清除闭包引用
```

### 4.3. 内存监控方法

```javascript hl:9
// 1. Node.js 环境
const used = process.memoryUsage();
console.log({
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`
});

// 2. 浏览器环境
console.log(performance.memory); // Chrome only
```

### 4.4. 开发建议

- 避免全局变量
- 及时清除事件监听器
- 及时清除定时器
- 避免循环引用
- 使用适当的数据结构（WeakMap、WeakSet 等）
- 分批处理大量数据
- 注意闭包的使用

```javascript
// 错误示例
window.globalData = { /* 大量数据 */ };

// 正确示例
function processData() {
    const data = { /* 大量数据 */ };
    // 处理数据
    // 函数结束后 data 可被回收
}
```

### 4.5. 调试工具

- Chrome DevTools 的 `Memory` 面板
- Node.js 的 `--inspect` 调试模式
- 内存泄漏检测工具（如 `heapdump`）

JavaScript 的`垃圾回收机制`主要通过`自动内存管理`来处理不再使用的对象和变量，以释放内存资源。
