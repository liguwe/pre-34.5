# requestIdleCallback

`#R1` `#bom` 

## 1. 定义

- `requestIdleCallback` 允许开发者在**浏览器的空闲时间**执行后台或低优先级的任务。
- 它的工作原理是利用**浏览器的空闲周期**来执行任务，而不会影响关键的渲染和交互操作

## 2. API 

API： `window.requestIdleCallback(callback[, options])`
 
```javascript
requestIdleCallback(myNonEssentialWork);

// 非必要任务
function myNonEssentialWork(deadline) {
  // timeRemaining()： 返回当前空闲期还剩余的毫秒数
  // didTimeout： 一个布尔值，表示任务是否已经超时
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    doWorkIfNeeded();
  }
  if (tasks.length > 0) {
    requestIdleCallback(myNonEssentialWork);
  }
}

```

## 3. 使用场景

`requestIdleCallback` 主要用于执行非必要的后台任务或计算，例如：
- 数据预加载
- 长列表的渐进式渲染
- 复杂计算的分割执行
- 非关键数据的处理和分析
- 大量 DOM 操作：
	- 例如，动态插入大量 DOM 元素时，可以使用 `requestIdleCallback` 分批处理，避免长时间阻塞主线程。
- 数据处理：
	- 处理大量数据或执行复杂计算时，可以将任务分割并在空闲时执行。
- 预加载：
	- 在用户不活跃时预加载资源或数据

## 4. 它影响了React Fiber 架构设计

React 的 **Fiber 架构** 在内部实现了类似 `requestIdleCallback` 的机制，用于将渲染工作分割成小块，在浏览器空闲时执行。
- 这允许 React 在不阻塞主线程的情况下进行复杂的更新操作

## 5. 注意

- 不要在 `requestIdleCallback` 中执行 DOM 操作，因为它可能会触发重排或重绘，影响性能
- 对于有**时间限制**的任务
	- 应该使用 setTimeout 或 requestAnimationFrame，而不是 requestIdleCallback
