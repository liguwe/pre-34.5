# JavaScript 内存泄漏场景及其解决方案

`#javascript` 

## 1. 闭包导致的内存泄漏 → cleanup

```javascript hl:2
function createClosure() {
  const largeData = new Array(1000000);  // 一个大数组
  
  return function() {
    // 这个内部函数引用了外部的 largeData
    console.log(largeData.length);
  }
}

// 创建闭包
const closure = createClosure();  // largeData 会一直保留在内存中
```

解决方案：`cleanup 函数`

```javascript hl:9
function createClosure() {
  const largeData = new Array(1000000);
  
  const result = function() {
    console.log(largeData.length);
  }
  
  // 使用完后手动解除引用
  result.cleanup = function() {
    largeData = null;
  }
  
  return result;
}

const closure = createClosure();
// 使用完后调用清理方法
closure.cleanup();
```

>  其实在函数式编程里，`cleanup` 使用场景很多，比如 Vue watch 的 cleanup 、React 的 useEffect 的返回值（clearup）

## 2. 事件监听器未移除：**一般都是再返回一个函数**

```javascript
function addHandler() {
  const element = document.getElementById('button');
  element.addEventListener('click', () => {
    // 处理点击事件
    doSomething();
  });
}

// 每次调用都会添加新的事件监听器，而不会移除旧的
addHandler();
addHandler();
```

解决方案：

```javascript hl:10
function addHandler() {
  const element = document.getElementById('button');
  const handler = () => {
    doSomething();
  };
  
  element.addEventListener('click', handler);
  
  // 在适当的时机移除事件监听器
  return () => {
    element.removeEventListener('click', handler);
  };
}

const removeHandler = addHandler();
// 不需要时移除监听器
removeHandler();
```

## 3. 定时器未清除：→ 返回回清理函数

```javascript
function startTimer() {
  const data = { /* 一些数据 */ };
  
  setInterval(() => {
    // 使用 data 进行操作
    console.log(data);
  }, 1000);
}

// 定时器会一直运行，data 对象无法被垃圾回收
startTimer();
```

解决方案：

```javascript hl:9
function startTimer() {
  const data = { /* 一些数据 */ };
  
  const timerId = setInterval(() => {
    console.log(data);
  }, 1000);
  
  // 返回清理函数
  return () => {
    clearInterval(timerId);
  };
}

const stopTimer = startTimer();
// 在适当的时候停止定时器
stopTimer();
```

## 4. DOM 引用

```javascript
const elements = {
  button: document.getElementById('button'),
  image: document.getElementById('image'),
  text: document.getElementById('text')
};

// 即使元素从 DOM 中移除，仍然保留在内存中
function removeButton() {
  document.body.removeChild(document.getElementById('button'));
  // elements.button 仍然引用着已删除的 DOM 元素
}
```

解决方案：

```javascript hl:9
const elements = {
  button: document.getElementById('button'),
  image: document.getElementById('image'),
  text: document.getElementById('text')
};

function removeButton() {
  document.body.removeChild(document.getElementById('button'));
  // 移除引用
  elements.button = null;
}
```

## 5. 全局变量

```javascript hl:2,7
function createGlobalVar() {
  // 意外创建全局变量
  leakedVariable = 'I am leaked';  // 没有使用 var/let/const
}

// 或者
window.globalVar = { /* 大量数据 */ };
```

解决方案：

```javascript
function createGlobalVar() {
  // 使用严格模式
  'use strict';
  
  // 现在这会抛出错误而不是创建全局变量
  leakedVariable = 'I am leaked';  // ReferenceError
  
  // 正确的声明方式
  const localVar = 'I am local';
}

// 如果确实需要全局变量，在使用完后记得清理
window.globalVar = { /* 大量数据 */ };
// 使用完后
window.globalVar = null;
```

## 6. 缓存未清理：→ 设置缓存时间

> 最大缓存值
> 最近缓存值

```javascript
const cache = new Map();

function addToCache(key, value) {
  cache.set(key, value);
}

// 缓存不断增长，没有清理机制
```

解决方案：

```javascript
class Cache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // 删除最早的项目
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new Cache(100);
```

## 7. 使用 Map 而未使用 WeakMap/WeakSet 的场景

当需要在对象上存储额外数据时，使用 `WeakMap` 可以防止内存泄漏：

```javascript
// 不好的做法
const cache = new Map();

function process(obj) {
  cache.set(obj, { /* some data */ });  // obj 的引用会被保留
}

// 好的做法
const cache = new WeakMap();

function process(obj) {
  cache.set(obj, { /* some data */ });  // 当 obj 不再被使用时，缓存数据会被自动清理
}
```

## 8. 最佳实践

- **使用严格模式**：
	- 避免意外创建全局变量
- **及时清理**：
	- 清除定时器
	- 移除事件监听器
	- 解除 DOM 引用
- **使用 WeakMap/WeakSet**：
	- 存储对象引用
- **实现清理机制**：
	- 为长期运行的程序实现缓存清理
- **开发工具**：
   - 使用 Chrome DevTools 的 Memory 面板
   - 使用内存分析工具定期检查
- **代码审查**：关注可能造成内存泄漏的代码模式
