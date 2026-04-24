# React 整体架构介绍

`#react` 

## 1. 总结

- React 元素、React 组件、FiberNode
	- **职责不同**
		- React 元素：描述 UI 的**纯数据结构**
		- React 组件：封装可重用的 UI 逻辑
		- FiberNode：管理组件**更新和调度**
	- **可变性**
		- React 元素：不可变
		- React 组件：状态可变
		- FiberNode： 完全可变
	- **生命周期**
		- React 元素：无生命周期
		- React 组件：有完整生命周期
		- FiberNode：负责管理组件的生命周期
	- **使用场景**
		- React 元素：作为组件的**渲染结果**
		- React 组件：构建应用界面
		- FiberNode：React **内部实现机制**
- todo 再读一遍



---

> 关于 Fiber节点，更多参考 [32. React Fiber 节点的主要属性及其用途](/QZ9ShB)
> 前文 [6.  React 的架构设计演变](/qEuAN4) 介绍了基本的 React 整体架构，本文继续

## 2. React  元素、React 组件、FiberNode

### 2.1. React 元素 (React Elements)

React 元素是描述 UI 的普通 JavaScript 对象，是最基本的构建块

```javascript
// React 元素的结构
const element = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello'
        }
      }
    ]
  }
}

// JSX 创建 React 元素
const jsxElement = (
  <div className="container">
    <h1>Hello</h1>
  </div>
);

// React.createElement 创建元素
const createElement = React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello')
);
```

特点：
1. 不可变对象（Immutable）
2. 描述界面的**快照**
3. 轻量级**普通对象**
4. **每次更新都会创建新的元素树**

### 2.2. React 组件 (React Components)

React 组件是可复用的代码片段，**可以是函数组件或类组件**

```javascript hl:1,6
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 组件的使用
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Greeting name="Bob" />
    </div>
  );
}
```

特点：
1. 接受 `props` 作为输入
2. **返回 React 元素**
3. 可以包含`状态`和`生命周期`
4. 可以被`多次`复用

### 2.3. FiberNode

Fiber 节点是 `React` 内部实现的**核心数据结构**，用于**跟踪组件树的状态和变化**。

```ts
// Fiber 节点的简化结构
interface FiberNode {
  // 静态数据结构
  type: any;
  key: null | string;
  elementType: any;
  stateNode: any;

  // Fiber 树结构
  return: Fiber | null;    // 父节点
  child: Fiber | null;     // 第一个子节点
  sibling: Fiber | null;   // 下一个兄弟节点

  // 工作单元
  pendingProps: any;
  memoizedProps: any;
  memoizedState: any;
  updateQueue: UpdateQueue<any> | null;

  // 副作用
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Array<Fiber> | null;

  // 调度优先级
  lanes: Lanes;
  childLanes: Lanes;
}

// Fiber 节点示例
const fiber = {
  type: 'div',
  key: null,
  stateNode: domElement,
  
  // 链接到其他 Fiber 节点
  return: parentFiber,
  child: childFiber,
  sibling: null,

  // 状态相关
  memoizedState: null,
  memoizedProps: { className: 'container' },
  
  // 副作用标记
  flags: Update,
};
```

特点：
1. 构成了**可中断的工作单元（动态工作单元）**
2. 包含了完整的组件信息，每个 FiberNode 对应一个 React 元素，包括这个 React 对应的所有`静态数据结构`
3. 形成了`链表`结构
4. 支持优先级调度

### 2.4. 三者的关系与区别

#### 2.4.1. 数据结构对比

```javascript
// React 元素 - 普通对象
const element = {
  type: 'div',
  props: { className: 'example' }
};

// React 组件 - 函数或类
function Component(props) {
  return <div className="example" />;
}

// FiberNode - 复杂数据结构
const fiber = {
  type: Component,
  memoizedState: null,
  memoizedProps: {},
  // ... 更多 Fiber 相关属性
};
```

#### 2.4.2. 生命周期和更新机制

```jsx
// React 元素 - 不可变
const element1 = <div>Hello</div>;
const element2 = <div>Hello</div>; // 完全新的对象

// React 组件 - 可维护状态
class StatefulComponent extends React.Component {
  state = { count: 0 };
  
  componentDidMount() {
    // 生命周期方法
  }
  
  render() {
    return <div>{this.state.count}</div>;
  }
}

// FiberNode - 跟踪更新
function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  // 处理更新队列
  // 设置新的状态
  fiber.memoizedState = newState;
}
```

#### 2.4.3. 用途对比

```jsx
// 1. React 元素 - UI 描述
const buttonElement = (
  <button className="btn">
    Click me
  </button>
);

// 2. React 组件 - 逻辑封装
function Button({ onClick, children }) {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <button
      className={`btn ${isPressed ? 'pressed' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 3. FiberNode - 内部调度
class FiberScheduler {
  workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    requestIdleCallback(workLoop);
  }
}
```

### 2.5. 主要区别

- **职责不同**
	- React 元素：描述 UI 的纯数据结构
	- React 组件：封装可重用的 UI 逻辑
	- FiberNode：管理组件**更新和调度**
- **可变性**
	- React 元素：不可变
	- React 组件：状态可变
	- FiberNode： 完全可变
- **生命周期**
	- React 元素：无生命周期
	- React 组件：有完整生命周期
	- FiberNode：负责管理组件的生命周期
- **使用场景**
	- React 元素：作为组件的渲染结果
	- React 组件：构建应用界面
	- FiberNode：React 内部实现机制

## 3. 完整的 FiberNode 节点

```javascript hl:7,14,22,37,41
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他 Fiber 节点形成 Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该 fiber 在另一次更新时对应的fiber
  this.alternate = null;
}

```

## 4. 两棵 Fiber 树：双缓存机制

- 真实 UI 对应的 Fiber Tree：
	- **前缓冲区**、即`浏览器上显示的 UI`
		- workInProgress Fiber 树
		- 使用 current 指针 指向它
- 正在内存中构建 Fiber Tree：**后缓冲区**
	- workInProgress Fiber 树

### 4.1. 举个示例：mount 一个组件时

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241029-3.png)

### 4.2. 举个示例：点击 p 节点，update 一个组件时

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241029-4.png)

## 5. 为什么需要 Fiber

在旧的架构中，React 的更新过程是同步的，称为 `Stack Reconciler`。这可能导致以下问题：
- **当组件树很大时，更新过程会占用主线程太长时间**
- 无法中断更新过程
- 可能导致掉帧和页面卡顿
Fiber 是 React 16 引入的新架构，其核心目标是实现：
- **增量渲染**：
	- 能够将渲染工作分片，并将其分散到**多个帧**中
- **任务暂停和恢复**：
	- 能够暂停正在进行的工作，稍后再恢复
- **任务优先级**：
	- 能够为不同的更新分配优先级
- **并发模式**：
	- 支持并发更新

## 6. Fiber 节点的基本结构

```javascript hl:7,14,22,37,41
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他 Fiber节点 形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps; // 正在等待处理的新props
  this.memoizedProps = null;    // 上一次渲染时的props
  this.updateQueue = null;     //  一个队列，包含了该Fiber上的状态更新和副作用
  this.memoizedState = null;   // 上一次渲染时的 state
  this.dependencies = null;    // 该 Fiber 订阅的上下文或其他资源的描述

  this.mode = mode;

  // 副作用：effects
  this.effectTag = NoEffect;
   this.flags = NoFlags; // 描述该Fiber发生的副作用的标志（十六进制的标识）
   this.subtreeFlags = NoFlags; // 描述该Fiber子树中发生的副作用的标志（十六进制的标识） 
   this.deletions = null; // 在commit阶段要删除的子Fiber数组
  this.nextEffect = null;
  

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}


```

- **单元工作**：
	- 每个Fiber节点代表一个`工作单元`，所有Fiber节点共同组成一个Fiber链表树（有链接属性，同时又有树的结构）
	- 这种结构让React可以**细粒度控制节点的行为**。
- **指针属性**：
	- **`child`**、**`sibling`** 和 **`return`** 字段构成了Fiber之间的链接关系
	- 使React能够遍历组件树并知道从哪里开始、继续或停止工作。
- **双缓冲技术**
- **State 和 Props**：
	- `memoizedProps`、**`pendingProps`** 和 **`memoizedState`** 字段
		- 让 React 知道组件的**上一个状态和即将应用的状态**
	- 通过比较这些值，React 可以决定组件是否需要更新，从而避免不必要的渲染，提高性能
- **副作用的追踪**：
	- `flags` 和 **`subtreeFlags`** 字段标识 Fiber 及其子树中需要执行的副作用
	- 例如 DOM 更新、生命周期方法调用等。
	- **React 会积累这些副作用，然后在 Commit 阶段一次性执行，从而提高效率。**

## 7. 协调阶段（Reconciler）：Render 阶段

协调阶段（Reconciler）：
- 构建 Fiber 树：
	-  workInProgress tree
- Diff 算法
- **收集副作用**：
	- 生成 `effects list`
- **目标**: 
	- 确定哪些部分的UI需要更新
- **原理**:
	-  这是React构建`工作进度树`的阶段，会比较新的 props 和 旧的Fiber树来确定哪些部分需要更新

### 7.1. `react-reconciler`包

此处先归纳一下`react-reconciler`包的主要作用, 将主要功能分为 4 个方面:
1. 输入: 暴露`api`函数(如: `scheduleUpdateOnFiber`), 供给其他包(如`react`包)调用.
2. 注册调度任务: 与调度中心(`scheduler`包)交互, 注册调度任务`task`, 等待任务回调.
3. 执行任务回调: 在内存中构造出`fiber树`, 同时与与渲染器(`react-dom`)交互, 在内存中创建出与`fiber`对应的`DOM`节点.
4. 输出: 与渲染器(`react-dom`)交互, 渲染`DOM`节点.

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-19.png)

### 7.2. `Fiber节点`是如何被创建并构建`Fiber 树`的呢？

`render阶段`开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用，这取决于本次更新是同步更新还是异步更新

- workInProgress
- performUnitOfWork

```javascript
//① performSyncWorkOnRoot 会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

//②  performConcurrentWorkOnRoot 会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

// ③ performUnitOfWork 方法
// 会创建下一个Fiber节点并赋值给 workInProgress
// 并将 workInProgress 与 已创建的Fiber节点连接起来构成 Fiber树
function performUnitOfWork(fiber) {
  // 1. 处理当前 fiber 节点
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    // 2. 没有子节点，完成当前节点
    completeUnitOfWork(fiber);
  }
  return next;
}

```

### 7.3. 举个示例

```tsx
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

```

对应的 `Fiber 树` 如下：

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-18.png)

然后就是`DFS 递归遍历`这个树了
- 如果是**进入**节点，执行 `beginWork`
- 如果是**离开**节点，执行 `completeWork`

所以，下面打印出遍历这些节点的顺序

```bash
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
```

### 7.4. beginWork：创建与标记更新节点

- 判断`Fiber节点`是否要更新
- 判断`Fiber子节点`是更新还是复用

### 7.5. completeWork：收集副作用列表

主要完成收集副作用列表：
- 记录`Fiber`的副作用标志
- 为`子Fiber`创建链表

## 8. 渲染阶段（Renderer） ：commit 阶段

- Render 阶段可能被打断，但 `commit` 不能
- 目标：更新DOM并**执行副作用** 
- 遍历在`Reconciliation阶段（render 阶段）`创建的副作用列表进行更新

```javascript hl:2,5,8
function commitRoot(root: FiberRoot) {
  // 1. 执行前置操作：执行`DOM`操作前）
  commitBeforeMutationEffects(root);
  
  // 2. 执行 DOM 操作：（执行`DOM`操作）
  commitMutationEffects(root);
  
  // 3. 执行布局副作用：执行`DOM`操作后
  commitLayoutEffects(root);
}

```

- `before mutation 阶段`，会遍历`effectList`，依次执行：
	- 处理`DOM节点`渲染/删除后的 `autoFocus`、`blur`逻辑
	- 调用`getSnapshotBeforeUpdate`生命周期钩子
	- 调度`useEffect`
- `mutation阶段`会遍历`effectList`，依次执行`commitMutationEffects`。
	- 该方法的主要工作为“根据`effectTag`调用不同的处理函数处理`Fiber`
- `layout阶段`会遍历`effectList`
	- 根据`effectTag`调用不同的处理函数处理`Fiber`并更新`ref`

> 是的，三个阶段都会遍历一遍 `effectList` 

## 9. 调度模块（Scheduler）

Scheduler（调度器）是 React 的核心模块，主要负责：
- 任务优先级管理
- 时间片分配
- 可中断渲染

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-25.png)

### 9.1. 调度中心的核心实现

1. **任务创建**：通过 `scheduleCallback` 创建任务
2. **优先级分配**：根据任务类型分配优先级
3. **入队排序**：放入对应优先级队列
4. **任务调度**：循环执行任务，支持中断
5. **时间切片**：控制执行时间，避免阻塞

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-20.png)

### 9.2. 时间切片的实现

- MessageChannel 实现：`new MessageChannel();`
