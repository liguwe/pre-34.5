# 优先级队列：Leetcode 中提供的数据结构介绍

`#优先级队列` 

## 1. 队列类型

这个库提供了3种优先队列实现：

1. **PriorityQueue**: 通用优先队列，需要自定义比较器
2. **MinPriorityQueue**: 最小优先队列，数值越小优先级越高
3. **MaxPriorityQueue**: 最大优先队列，数值越大优先级越高

## 2. 基本用法

### 2.1. 创建队列

#### 2.1.1. 通用 PriorityQueue

```javascript
// 创建一个自定义比较器的优先队列
const customQueue = new PriorityQueue({
  compare: (a, b) => {
    // 返回 <= 0 表示不交换位置
    // 返回 > 0 表示交换位置
    return a.priority - b.priority;
  }
});
```

#### 2.1.2. 最小优先队列

```javascript
// 简单数字优先队列
const minQueue = new MinPriorityQueue();

// 对象优先队列，指定优先级获取方式为 .value
const objectMinQueue = new MinPriorityQueue({ 
  priority: (obj) => obj.value 
});
```

#### 2.1.3. 最大优先队列

```javascript
// 简单数字优先队列
const maxQueue = new MaxPriorityQueue();

// 对象优先队列，指定优先级获取方式
const objectMaxQueue = new MaxPriorityQueue({ 
  priority: (obj) => obj.value 
});
```

### 2.2. 核心 API

#### 2.2.1. 入队 (enqueue)

```javascript
// 基础入队
queue.enqueue(element);

// 带优先级入队（适用于 Min/MaxPriorityQueue）
queue.enqueue(element, priority);
```

#### 2.2.2. 出队 (dequeue)

```javascript hl:2
const element = queue.dequeue();
// PriorityQueue: 返回元素本身
// Min/MaxPriorityQueue: 返回 { priority, element } 对象
```

#### 2.2.3. 查看队首元素 (front)

```javascript
const frontElement = queue.front();
// 不移除元素，只返回队首元素
```

#### 2.2.4. 查看队尾元素 (back)

```javascript
const backElement = queue.back();
// 返回优先级最低的元素
```

#### 2.2.5. 其他实用方法

```javascript
// 检查队列是否为空
queue.isEmpty(); // 返回 boolean

// 获取队列大小
queue.size(); // 返回 number

// 转换为数组（按优先级排序）
queue.toArray(); // 返回数组

// 清空队列
queue.clear();
```

### 2.3. 实际应用示例

#### 2.3.1. 简单数字优先队列

```javascript
const minQueue = new MinPriorityQueue();

// 添加元素
minQueue.enqueue(10);
minQueue.enqueue(5);
minQueue.enqueue(15);

console.log(minQueue.dequeue()); // { priority: 5, element: 5 }
console.log(minQueue.dequeue()); // { priority: 10, element: 10 }
```

#### 2.3.2. 对象优先队列

```javascript
const taskQueue = new MaxPriorityQueue({
  priority: (task) => task.priority
});

// 添加任务
taskQueue.enqueue({ id: 1, name: "任务1", priority: 3 });
taskQueue.enqueue({ id: 2, name: "任务2", priority: 1 });
taskQueue.enqueue({ id: 3, name: "任务3", priority: 4 });

// 处理最高优先级任务
console.log(taskQueue.dequeue()); 

// { priority: 4, element: { id: 3, name: "任务3", priority: 4 } }

```
