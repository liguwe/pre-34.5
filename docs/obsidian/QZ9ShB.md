# React Fiber 节点的主要属性及其用途

`#React` 

## 总结

- 再读一遍
- todo

## 1. 篇一

### 1.1. 节点标识和类型相关

```typescript
interface FiberNode {
  // 标记 Fiber 节点的类型
  tag: WorkTag;  // 例如：FunctionComponent = 0, ClassComponent = 1, HostComponent = 5 等

  // 元素的唯一标识
  key: null | string;
  
  // 元素的类型，对应 React Element 的 type
  // 可能是函数、类或原生 DOM 类型（如 'div'）
  elementType: any;
  
  // 实际使用的类型，考虑了 elementType 可能被 resolve 的情况
  type: any;

  // 对于原生 DOM 节点，保存实际 DOM 节点的引用
  // 对于组件，保存组件实例
  stateNode: any;
}
```

### 1.2. Fiber 树结构相关

>  树结构相关，比如 return 代表父级节点


```typescript
interface FiberNode {
  // 指向父级 Fiber 节点
  return: Fiber | null;
  
  // 指向第一个子 Fiber 节点
  child: Fiber | null;
  
  // 指向下一个兄弟 Fiber 节点
  sibling: Fiber | null;
  
  // 索引号，用于处理数组类型的子节点
  index: number;

  // 指向旧树中对应的 Fiber 节点
  alternate: Fiber | null;
}
```

### 1.3. 状态和副作用相关

```typescript
interface FiberNode {
  // setState
  // 待更新队列，存储 setState 的更新
  updateQueue: UpdateQueue<any> | null;
  
  // 当前的状态
  memoizedState: any;
  
  // 待处理的 props
  pendingProps: any;
  
  // 已经处理完的 props
  memoizedProps: any;

  // 副作用标记，表示节点需要执行的操作
  // 如：Placement、Update、Deletion 等
  flags: Flags;
  
  // 子树中的副作用标记
  subtreeFlags: Flags;
  
  // 指向下一个有副作用的 Fiber 节点
  nextEffect: Fiber | null;
  
  // 副作用链表的第一个和最后一个节点
  firstEffect: Fiber | null;
  lastEffect: Fiber | null;
}
```

### 1.4. 优先级相关

```typescript
interface FiberNode {
  // 任务的优先级
  lanes: Lanes;
  
  // 子树的优先级
  childLanes: Lanes;
  
  // 替代树的优先级
  alternateLanes: Lanes;
}
```

### 1.5. 工作进度相关

```typescript
interface FiberNode {
  // 记录已经处理到的 Hook 位置
  nextHook: Hook | null;
  
  // 工作进行到的时间
  expirationTime: ExpirationTime;
}
```

### 1.6. 主要属性的使用场景

#### 1.6.1. 节点更新流程

```javascript
function updateFiberNode(fiber: FiberNode) {
  // 1. 检查更新优先级
  if (fiber.lanes === NoLanes) {
    return;
  }

  // 2. 处理 props 更新
  if (fiber.pendingProps !== fiber.memoizedProps) {
    // 需要更新
    fiber.flags |= Update;
  }

  // 3. 处理状态更新
  const updateQueue = fiber.updateQueue;
  if (updateQueue !== null) {
    processUpdateQueue(fiber, updateQueue);
  }

  // 4. 处理副作用
  if (fiber.flags !== NoFlags) {
    // 将当前节点加入副作用链表
    scheduleCallback(fiber);
  }
}
```

#### 1.6.2. Fiber 树的遍历

```javascript
function traverseFiber(fiber: FiberNode) {
  let nextFiber = fiber;

  while (nextFiber !== null) {
    // 1. 处理当前节点
    processNode(nextFiber);

    // 2. 深度优先遍历
    if (nextFiber.child) {
      nextFiber = nextFiber.child;
      continue;
    }

    // 3. 没有子节点，处理兄弟节点
    while (nextFiber.sibling === null) {
      if (nextFiber.return === null || nextFiber.return === fiber) {
        return;
      }
      nextFiber = nextFiber.return;
    }
    nextFiber = nextFiber.sibling;
  }
}
```

#### 1.6.3. 状态更新示例

```javascript
function updateState(fiber: FiberNode, update: Update) {
  // 1. 创建或获取更新队列
  const updateQueue = fiber.updateQueue || createUpdateQueue();
  
  // 2. 将更新添加到队列
  enqueueUpdate(updateQueue, update);
  
  // 3. 标记需要更新
  fiber.flags |= Update;
  
  // 4. 设置更新优先级
  const lane = requestUpdateLane();
  fiber.lanes |= lane;
  
  // 5. 向上标记父节点的 childLanes
  let parent = fiber.return;
  while (parent !== null) {
    parent.childLanes |= lane;
    parent = parent.return;
  }
}
```

#### 1.6.4. 副作用处理

```javascript
function commitWork(fiber: FiberNode) {
  // 1. 检查副作用标记
  if (fiber.flags & Placement) {
    // 处理节点插入
    commitPlacement(fiber);
  }
  
  if (fiber.flags & Update) {
    // 处理节点更新
    commitUpdate(fiber);
  }
  
  if (fiber.flags & Deletion) {
    // 处理节点删除
    commitDeletion(fiber);
  }

  // 2. 处理生命周期和 hooks 的副作用
  if (fiber.flags & PassiveEffect) {
    schedulePassiveEffects(fiber);
  }
}
```

#### 1.6.5. 优先级调度

```javascript
function scheduleFiberWork(fiber: FiberNode, lane: Lane) {
  // 1. 设置当前工作的优先级
  fiber.lanes |= lane;
  
  // 2. 向上传播优先级
  let parent = fiber.return;
  while (parent !== null) {
    parent.childLanes |= lane;
    parent = parent.return;
  }
  
  // 3. 根据优先级调度工作
  scheduleCallback(
    getCurrentPriorityLevel(),
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

### 1.7. 注意事项

1. **内存管理**
   - 及时清理不需要的 Fiber 节点
   - 重用 alternate 节点以减少内存分配

2. **优先级处理**
   - 正确设置和传播优先级
   - 考虑任务中断和恢复

3. **副作用管理**
   - 合理使用 flags 标记
   - 维护好副作用链表

4. **状态一致性**
   - 确保 memoizedState 和 memoizedProps 的正确性
   - 处理好 updateQueue 的更新顺序

## 2. 篇二

### 2.1. 节点标识和类型属性

```javascript
class FiberNode {
  tag: WorkTag;           // 标识节点类型（函数组件、类组件、原生组件等）
  key: null | string;     // React元素的key属性
  elementType: any;       // 元素类型
  type: any;             // 对于函数组件，是函数本身；对于类组件，是类
  stateNode: any;        // 指向实际DOM节点或组件实例
}
```

这些属性用于标识和存储 Fiber 节点的基本信息，帮助 React 识别和管理不同类型的组件

### 2.2. Fiber **树结构**相关属性

```javascript
class FiberNode {
  return: Fiber | null;    // 指向父 Fiber 节点
  child: Fiber | null;     // 指向第一个子 Fiber 节点
  sibling: Fiber | null;   // 指向下一个兄弟 Fiber 节点
  index: number;           // 在兄弟节点中的索引
  ref: any;               // ref 属性
}
```

这些属性构建了 Fiber 树的基本结构，使 **React 能够在树中进行遍历和更新**。

### 2.3. 工作单元相关属性

```javascript
class FiberNode {
  pendingProps: any;      // 新的待处理 props
  memoizedProps: any;     // 上一次渲染使用的 props
  updateQueue: UpdateQueue<any> | null;  // 更新队列
  memoizedState: any;     // 上一次渲染使用的 state
  dependencies: Dependencies | null;  // 依赖项（context、事件等）
}
```

这些属性用于管理组件的状态和属性更新，是实现组件渲染和更新的核心。

### 2.4. 副作用相关属性

```javascript
class FiberNode {
  flags: Flags;          // 副作用标记（需要执行的操作类型）
  subtreeFlags: Flags;   // 子树的副作用标记
  deletions: Array<Fiber> | null;  // 需要删除的子节点
  lanes: Lanes;          // 优先级相关
  childLanes: Lanes;     // 子节点的优先级
}
```

这些属性用于标记和追踪需要在 **commit 阶段**执行的副作用操作。

### 2.5. 调度相关属性

```javascript
class FiberNode {
  alternate: Fiber | null;  // 指向内存中另一个版本的 fiber
  nextEffect: Fiber | null; // 指向下一个有副作用的 fiber
  firstEffect: Fiber | null; // 子树中第一个有副作用的 fiber
  lastEffect: Fiber | null;  // 子树中最后一个有副作用的 fiber
}
```

这些属性用于实现 React 的**双缓冲机制**和**副作用链表**，支持**增量渲染和优先级调度**

### 2.6. 属性的使用场景

#### 2.6.1. 渲染阶段

```javascript
function beginWork(current: Fiber | null, workInProgress: Fiber) {
  // 使用 tag 确定组件类型
  switch (workInProgress.tag) {
    case FunctionComponent: {
      // 处理函数组件
      const Component = workInProgress.type;
      const props = workInProgress.pendingProps;
      // ...
    }
    // ...其他类型处理
  }
}
```

#### 2.6.2. 提交阶段

```javascript
function commitWork(current: Fiber | null, finishedWork: Fiber) {
  // 根据 flags 执行相应的 DOM 操作
  if (finishedWork.flags & Update) {
    // 更新 DOM
    const instance = finishedWork.stateNode;
    // ...
  }
}
```

#### 2.6.3. 调度优先级

```javascript
function markUpdateLaneFromFiberToRoot(fiber: Fiber) {
  // 设置更新优先级
  fiber.lanes = mergeLanes(fiber.lanes, lane);
  let alternate = fiber.alternate;
  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane);
  }
  // ...
}
```

### 2.7. 重要注意点

1. **性能影响**
   - 属性访问应该避免深层遍历
   - 合理使用 memoization 减少不必要的更新
   - 注意内存占用，及时清理不需要的引用

2. **调试技巧**
   - 使用 React DevTools 查看 Fiber 树结构
   - 通过 flags 追踪更新过程
   - 监控 lanes 了解优先级变化 

3. **常见陷阱**
   - 避免直接修改 Fiber 节点属性
   - 注意处理 null 值
   - 正确处理副作用清理 

通过深入理解这些属性，我们可以更好地理解 React 的工作原理，编写更高效的 React 应用。
