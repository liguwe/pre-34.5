# 任务饥饿（Task Starvation）

`#react` 

## 1. 总结

- 首先检查是否有过期任务，有则最优先执行
- 如果没有过期任务，则按优先级处理

## 2. 任务饥饿的概念

想象一个餐厅场景：
```javascript hl:7
class Restaurant {
  constructor() {
    this.vipOrders = [];    // 高优先级订单
    this.normalOrders = []; // 普通优先级订单
  }

  // 模拟传统的处理方式
  processOrders() {
    while(true) {
      // 总是优先处理 VIP 订单
      if(this.vipOrders.length > 0) {
        this.processVipOrder();
      } else if(this.normalOrders.length > 0) {
        this.processNormalOrder();
      }
    }
  }
}
```

如果 VIP 订单不断进来，普通订单就会一直得不到处理，这就是"饥饿"现象。

## 3. React 中的任务饥饿

```javascript hl:13,6
// 简化的 React 任务示例
const tasks = {
  // 高优先级任务：用户点击按钮
  highPriority: {
    type: 'UserBlockingPriority',
    expirationTime: 250, // 250ms 超时
    work: () => updateButtonState()
  },
  
  // 低优先级任务：数据列表渲染
  lowPriority: {
    type: 'NormalPriority',
    expirationTime: 5000, // 5000ms 超时
    work: () => renderDataList()
  }
}
```

## 4. 饥饿问题的具体表现

```javascript
// 问题场景模拟
function problematicScheduler() {
  let highPriorityTasks = [];
  let lowPriorityTasks = [];
  
  setInterval(() => {
    // 模拟频繁的高优先级任务
    highPriorityTasks.push(() => console.log('High priority task'));
  }, 100);
  
  // 低优先级任务可能永远无法执行
  while(true) {
    if(highPriorityTasks.length > 0) {
      const task = highPriorityTasks.shift();
      task();
    } else if(lowPriorityTasks.length > 0) {
      const task = lowPriorityTasks.shift();
      task();
    }
  }
}
```

## 5. React 解决方案演示

```javascript hl:22,30,35
class ImprovedScheduler {
  constructor() {
    this.tasks = new Map();
    this.currentTime = 0;
  }
  
  addTask(task) {
    const expirationTime = this.currentTime + task.timeout;
    this.tasks.set(task.id, {
      ...task,
      expirationTime,
      startTime: this.currentTime
    });
  }
  
  // 改进的调度器
  schedule() {
    while(this.tasks.size > 0) {
      const now = this.currentTime;
      let nextTask = null;
      
      // 1. 首先检查是否有过期任务
      for(const [id, task] of this.tasks) {
        if(now >= task.expirationTime) {
          nextTask = task;
          break;
        }
      }
      
      // 2. 如果没有过期任务，则按优先级处理
      if(!nextTask) {
        nextTask = this.getHighestPriorityTask();
      }
      
      // 3. 执行任务
      this.executeTask(nextTask);
    }
  }
  
  // 示例：执行任务
  executeTask(task) {
    console.log(`Executing task: ${task.id}`);
    // 实际执行任务
    task.work();
    this.tasks.delete(task.id);
  }
}

// 使用示例
const scheduler = new ImprovedScheduler();

// 添加一些任务
scheduler.addTask({
  id: 'button-click',
  priority: 'high',
  timeout: 250,
  work: () => console.log('Button click handled')
});

scheduler.addTask({
  id: 'data-fetch',
  priority: 'low',
  timeout: 5000,
  work: () => console.log('Data fetched and rendered')
});
```

## 6. 实际效果对比

没有解决饥饿问题的情况：

```javascript hl:6
// 糟糕的情况
Time 0ms: 高优任务1开始执行
Time 100ms: 高优任务2进入
Time 200ms: 高优任务3进入
Time 300ms: 高优任务4进入
// 低优任务一直得不到执行
```

React 的解决方案：

```javascript hl:4
// 改进后的情况
Time 0ms: 高优任务1开始执行
Time 100ms: 高优任务2执行
Time 250ms: 低优任务1得到执行（因为到达超时时间）
Time 300ms: 高优任务3执行
Time 500ms: 低优任务2得到执行
```

## 7. 生动的类比：排队

- 这就像排队买票：
	- 普通窗口：按先来后到
	- VIP窗口：优先处理
- React的解决方案相当于：
	- 给普通用户发放"等待时间过长"加急券
	- 超过等待时限的普通用户可以去VIP窗口
	- 确保每个人最终都能得到服务

通过这种机制，React 确保：

1. 高优先级任务能够快速响应（比如用户交互）
2. 低优先级任务不会无限期等待（比如数据更新、渲染）
3. 系统整体运行更加公平和高效

这就是为什么在 React 应用中，即使有大量的更新任务，用户交互依然流畅，而且后台更新最终也都能完成的原因。
