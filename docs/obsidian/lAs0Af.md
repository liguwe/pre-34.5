# useRef、forwardRef 的用法及实现原理

`#React` 

## 1. 总结

- useRef 的作用
	- 获取 DOM 引用
	- 用户获取最新数据
	- 不会导致重新渲染
	- `.current`
	- 可以用来存储定时器，方便 `clear`
- useRef vs useState 的区别：
	- 是否会导致重新渲染
- **React 不允许组件访问其他组件的 DOM 节点，甚至自己的子组件也不行**
	- 但可使用 `forwardRef` 包装和可以，然后再配合 `useRef`
- useRef 的实现原理
	- 本质上是维护了**一个包含 `current` 属性的对象**，这个对象**在组件的整个生命周期中保持不变**

## 2. useRef 

### 2.1. useRef 的作用

- 获取 DOM 引用
- 创建元素对象，只要函数组件未被销毁，原始对象就一直存在，故可以用它来`保存数据`
- 保存前一次的值
- 记得都存在 `.current` 里，有点类似于 vue 的 `.value`
	- 即`let domRef = useRef()` 始终是同一个对象引用，只有 `ref.current` 可以改变
- 可以用来存储定时器，方便 `clear`
- 缓存不需要触发重新染的值
- 同样，只能在顶层使用

### 2.2. 注意点

- 不要在渲染时，修改 ref
- 不要过度使用，需要区分哪些使用 `state` 来管理

### 2.3. useRef vs useState 的区别

区别在于**是否会触发重现渲染**

```javascript hl:10
function ComparisonExample() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  
  const updateState = () => {
    setStateCount(stateCount + 1); // 触发重渲染
  };
  
  const updateRef = () => {
    refCount.current += 1; // 不会触发重渲染
    console.log('ref count:', refCount.current);
  };
  
  return (
    <>
      <p>State count: {stateCount}</p>
      <p>Ref count: {refCount.current}</p>
      <button onClick={updateState}>Update State</button>
      <button onClick={updateRef}>Update Ref</button>
    </>
  );
}

```

## 3. forwardRef 与 useRef 配合使用

**React 不允许组件访问其他组件的 DOM 节点**。甚至自己的子组件也不行，使用 `forwardRef` 可以

```javascript hl:3,19
import { forwardRef, useRef } from 'react';

// 子组件使用 forwardRef 
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});


// 父组件
export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

## 4. useRef 用于性能优化

```javascript hl:7
function SearchResults() {
  const [query, setQuery] = useState('');
  const lastQuery = useRef('');
  
  useEffect(() => {
    // 只有当查询真正改变时才发起请求
    if (query !== lastQuery.current) {
      lastQuery.current = query;
      // 发起搜索请求
      fetchSearchResults(query);
    }
  }, [query]);
  
  return (
    // ...
  );
}
```

## 5. useRef 的实现原理

本质上是维护了**一个包含 `current` 属性的对象**，这个对象**在组件的整个生命周期中保持不变**。

### 5.1. 数据结构

```typescript hl:2,10
type Hook = {
  memoizedState: any; // 保存 ref 对象
  next: Hook | null; // 指向下一个 Hook
  queue: UpdateQueue<any> | null; // 更新队列
  baseState: any; // 基础状态
  baseQueue: Update<any> | null; // 基础更新队列
};

// ref 对象的结构
type RefObject = {
  current: any;
};

type Fiber = {
  // ...其他属性
  memoizedState: Hook | null; // 指向第一个 Hook
  updateQueue: mixed;
  stateNode: any;
};

```

### 5.2. 在 Fiber 中的存储

```typescript
type Fiber = {
  // ...其他属性
  memoizedState: Hook | null,  // 指向第一个 Hook
  updateQueue: mixed,
  stateNode: any,
};

// Hook 链表结构示意
function Component() {
  const ref1 = useRef(null);    // Hook1
  const ref2 = useRef(null);    // Hook2
  const [state, setState] = useState(null);  // Hook3
  
  // Hooks 在 Fiber 中形成链表
  // Fiber.memoizedState -> Hook1 -> Hook2 -> Hook3
}

```

### 5.3. 初始阶段

```typescript hl:2,20
function createRef(initialValue) {
  const refObject = {
    current: initialValue,
  };

  // 在开发环境下，添加一些额外属性
  if (__DEV__) {
    Object.seal(refObject);
  }

  return refObject;
}

// 在组件首次渲染时
function mountRef(initialValue) {
  // 1. 创建 hook 对象
  const hook = mountWorkInProgressHook();

  // 2. 创建 ref 对象
  const ref = createRef(initialValue);

  // 3. 将 ref 对象存储在 hook 的 memoizedState 中
  hook.memoizedState = ref;

  return ref;
}
```

### 5.4. 更新阶段

```typescript
function updateRef(initialValue) {
  // 1. 获取当前的 hook
  const hook = updateWorkInProgressHook();
  
  // 2. 直接返回之前存储的 ref 对象
  // 注意：不会创建新的 ref 对象
  return hook.memoizedState;
}

```
