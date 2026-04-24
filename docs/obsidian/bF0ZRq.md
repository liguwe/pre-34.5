# queueMicrotask

`#bom` `#异步` 

## 1. 基本概念

```javascript
// 最简单的使用方式
queueMicrotask(() => {
    console.log('这是一个微任务');
});
```

- `queueMicrotask` 是一个用于将回调函数作为**微任务（microtask）** 添加到微任务队列中的全局函数
- **nodejs 环境和浏览器环境都可用**
- `queueMicrotask` 可用于批量处理状态更新
	- **确保 DOM 只更新一次**，而不是每次状态变化都更新，如下代码

```javascript hl:9,22,23,24
let state = { count: 0 };
let updateScheduled = false;

function updateState(newState) {
  Object.assign(state, newState);

  if (!updateScheduled) {
    updateScheduled = true;
    queueMicrotask(() => {
      updateDOM();
      updateScheduled = false;
    });
  }
}

function updateDOM() {
  console.log("Updating DOM with state:", state);
  // 实际的 DOM 更新操作
}

// 使用示例
updateState({ count: 1 });
updateState({ count: 2 });
updateState({ count: 3 });

console.log("Current state:", state);
```

## 2. 与 Promise 的关系

**看哪个在前面，哪个在前面就先执行**

```javascript
// 这两种方式效果相同
queueMicrotask(() => {
    console.log('方式1');
});

Promise.resolve().then(() => {
    console.log('方式2');
});
```

## 3. 执行顺序

```javascript
console.log('1'); // 同步任务

setTimeout(() => {
    console.log('4'); // 宏任务
}, 0);

queueMicrotask(() => {
    console.log('2'); // 微任务
});

console.log('3'); 

// 输出顺序: 1, 3, 2, 4
```

## 4. 常见使用场景及注意事项

### 4.1. 状态同步

```javascript
class State {
    constructor() {
        this.value = 0;
        this.callbacks = [];
    }

    setValue(newValue) {
        this.value = newValue;
        // 确保回调在当前同步代码执行完后才执行
        queueMicrotask(() => {
            this.callbacks.forEach(cb => cb(this.value));
        });
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }
}
```

### 4.2. 防止递归嵌套堆栈溢出

```javascript
function processArray(array) {
    const results = [];
    
    function process(index) {
        if (index >= array.length) return;
        
        results.push(array[index]);
        
        // 避免深层递归
        queueMicrotask(() => process(index + 1));
    }
    
    process(0);
}
```

### 4.3. 错误处理：一定要**顶层使用**

```javascript hl:11
// 错误的方式
try {
    queueMicrotask(() => {
        throw new Error('错误');
    });
} catch(e) {
    // 永远不会捕获到错误
    console.error(e);
}

// 正确的方式
queueMicrotask(() => {
    try {
        throw new Error('错误');
    } catch(e) {
        console.error(e);
    }
});
```

### 4.4. 批量处理

```javascript
class BatchProcessor {
    constructor() {
        this.queue = [];
        this.scheduled = false;
    }

    add(item) {
        this.queue.push(item);
        if (!this.scheduled) {
            this.scheduled = true;
            queueMicrotask(() => {
                this.processQueue();
                this.scheduled = false;
            });
        }
    }

    processQueue() {
        const items = [...this.queue];
        this.queue = [];
        // 处理队列项
        items.forEach(item => console.log('处理:', item));
    }
}
```

### 4.5. 尽量顶层使用

```javascript hl:1,6
// 不好的做法
for (let i = 0; i < 1000; i++) {
    queueMicrotask(() => console.log(i));
}

// 更好的做法
const items = Array.from({length: 1000}, (_, i) => i);
queueMicrotask(() => {
    items.forEach(i => console.log(i));
});
```

## 5. 与其他异步机制的比较

```javascript
// 1. queueMicrotask
queueMicrotask(() => console.log('微任务'));

// 2. Promise
Promise.resolve().then(() => console.log('Promise微任务'));

// 3. setTimeout
setTimeout(() => console.log('宏任务'), 0);

// 4. requestAnimationFrame
requestAnimationFrame(() => console.log('动画帧'));

// 执行顺序：微任务 ≈ Promise微任务 > 宏任务 > 动画帧
```

## 6. 总结

- `queueMicrotask` 是处理微任务的标准方式
- 比 `Promise` 更直接和轻量
- 适用于需要异步但又要保持高优先级的场景
- 需要注意错误处理和性能影响
