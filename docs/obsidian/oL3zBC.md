# 强制重新渲染有哪些方式

`#react` 

## 1. 总结

- 自定义 useForceUpdate
- useReducer 中的 forceUpdate
- useState 切换布尔值达到类似效果
- 变更 key →  完全卸载并重新挂载组件

>  强制更新应该作为**一种例外情况下的解决方案**，而不是常规做法

## 2. 自定义 Hook： `useForceUpdate` 

这是一种常见的模式，可以创建一个自定义 Hook 来强制组件重新渲染：

```javascript
import { useState, useCallback } from 'react';

function useForceUpdate() {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
}

// 使用方式
function MyComponent() {
  const forceUpdate = useForceUpdate();
  
  const handleClick = () => {
    // 进行一些操作
    forceUpdate();
  };

  return <button onClick={handleClick}>Force Update</button>;
}
```

这种方法通过**更新一个空对象**来触发重新渲染

## 3. 使用 `useReducer`

`useReducer` 也可以用来强制更新，有一个 `forceUpdate`

```javascript
import { useReducer } from 'react';

const [, forceUpdate] = useReducer(x => x + 1, 0);

// 使用方式
function MyComponent() {
  const handleClick = () => {
    // 进行一些操作
    forceUpdate();
  };

  return <button onClick={handleClick}>Force Update</button>;
}
```

这种方法通过递增一个计数器来触发重新渲染 

## 4. 使用 `useState`

简单地使用 `useState` 也可以达到强制更新的效果：

```javascript
import { useState } from 'react';

function MyComponent() {
  const [, setToggle] = useState(false);

  const handleClick = () => {
    // 进行一些操作
    setToggle(prev => !prev);
  };

  return <button onClick={handleClick}>Force Update</button>;
}
```

这种方法通过**切换一个布尔值**来触发重新渲染 

## 5. 使用 `key` 属性

对于整个组件的强制更新，可以使用 `key` 属性：

```jsx
function ParentComponent() {
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <button onClick={handleReset}>Reset Component</button>
      <MyComponent key={key} />
    </>
  );
}
```

通过改变 `key` 值，React 会**完全卸载并重新挂载组件**，相当于强制重新渲染
