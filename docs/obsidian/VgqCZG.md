# WeakRef 与 FinalizationRegistry

`#javascript` 

## 1. WeakRef  → 创建一个对象的引用 →  `new WeakRef(obj)`

- WeakRef（弱引用）是 ECMAScript 2021 (ES12) 引入的一个新特性。
- 它的主要作用是**允许你保持对对象的引用，而不阻止该对象被垃圾回收器回收**

### 1.1. 主要作用

WeakRef 的主要作用是**创建对对象的弱引用**。这意味着：
- 如果一个对象只被 WeakRef 引用，它可以被垃圾回收
- WeakRef 不会阻止其引用的对象被垃圾回收

### 1.2. 使用方法

```javascript hl:2,9
let obj = { data: "some data" };
let weakRef = new WeakRef(obj);

// 稍后使用
let objAgain = weakRef.deref();
if (objAgain) {
    console.log(objAgain.data);
} else {
    console.log("Object has been garbage collected");
}
```

```javascript hl:1,8
大型对象的临时引用
function processLargeObject(obj) {
    let weakRef = new WeakRef(obj);
    
    // 做一些其他操作...
    
    // 当需要时再次访问对象
    let objAgain = weakRef.deref();
    if (objAgain) {
        // 使用对象
    }
}
```

### 1.3. 优点

- 内存效率：**允许垃圾回收器回收不再需要的对象，防止内存泄漏**。
- 灵活性：可以保持对对象的引用，同时允许该对象在必要时被回收。

### 1.4. 注意事项

- 不确定性：**无法预测对象何时会被回收**。
- 性能开销：
	- 频繁检查对象是否仍然存在可能会影响性能。
- 复杂性：
	- 增加了代码的复杂性，使用时需要额外的检查。

### 1.5. 与 WeakMap 和 WeakSet 的关系

- WeakRef 与 WeakMap 和 WeakSet 类似，都是处理对象的弱引用
- 但 `WeakRef` 更加灵活，允许你直接操作弱引用

### 1.6. 最佳实践

- 仅在真正需要时使用 `WeakRef`。
- 总是检查 `deref()` 的结果是否为 `null`。
- 考虑使用 `FinalizationRegistry` 来清理相关资源

```javascript hl:7
const registry = new FinalizationRegistry(heldValue => {
    console.log(`Object with ${heldValue} has been garbage collected.`);
});

let obj = { data: "important data" };
let weakRef = new WeakRef(obj);
registry.register(obj, "my object");

// 使用完毕后
obj = null; // 允许对象被回收
```

## 2. FinalizationRegistry  → 回收前的一个回调

`FinalizationRegistry 对象`可以让你**在对象被垃圾回收时请求一个回调**。
- 这个机制提供了一种方式来为那些不再被使用的对象执行一些清理操作

```javascript
const registry = new FinalizationRegistry(heldValue => {
  console.log('对象被回收了，关联值为:', heldValue);
});

let obj = {};
registry.register(obj, "自定义数据");

// 当 obj 被垃圾回收时，回调函数会被调用
```

### 2.1. FinalizationRegistry 不能主动触发垃圾回收

- 虽然 `FinalizationRegistry` 确实与垃圾回收（GC）密切相关，但它并**不能直接触发垃圾回收**
- `FinalizationRegistry` 主要用于在对象被垃圾回收后执行一些清理操作。
	- 它允许你注册一个**回调函数**，这个函数会在某个对象被垃圾回收后被调用
- `FinalizationRegistry` 是一个**被动机制**
	- 它依赖于 JavaScript 引擎的垃圾回收器来触发回调，而不是主动触发垃圾回收
