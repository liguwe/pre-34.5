# React 的 Capture Value（捕获值）特性与解决方案

`#react` 

## 1. 总结

- 什么是 Capture Value。
- 定时器问题和事件处理器问题是常见的 Capture Value 问题
- 使用函数式更新可以解决定时器问题
- 解决方案
	- 使用 useRef 可以保存最新值
	- 正确使用依赖数组可以确保取到最新值
	- 使用 useReducer 的 dispatch 永远是稳定的,不需要依赖
	- 自定义 useLatest Hook 可以保存最新值
	- 使用 useCallback 或 useMemo 可以处理 Capture Value 问题

## 2. 什么是 Capture Value

Capture Value 是指：
- React 的函数组件在**每次渲染时都会捕获当前渲染时的 props 和 state 值**。
- 每次渲染**都有自己的事件处理函数，这些函数会"记住"当时的值**。

### 2.1. 表现

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241030.png)

```jsx hl:6
import React, { useState } from "react";
function Counter() {
  const [count, setCount] = useState(0);

  // 点击按钮，3 秒后弹出当前 count 值
  // 但是由于 setTimeout 是异步的，所以会捕获当时的 count 值
  const handleClick = () => {
    setTimeout(() => {
      alert(count); // 会捕获当时的 count 值
    }, 3000);
  };

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={handleClick}>显示计数</button>
    </div>
  );
}

export default Counter;

```

## 3. 常见的 Capture Value 问题

### 3.1. 定时器问题

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  
  // ❌ 问题示例
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // count 被捕获，永远是初始值
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // 空依赖数组
}
```

### 3.2. 事件处理器问题

```jsx
function EventHandler() {
  const [message, setMessage] = useState('');
  
  // ❌ 问题示例
  const handleClick = useCallback(() => {
    console.log(message); // 总是打印旧值
  }, []); // 空依赖数组
}
```

## 4. 常见的解决方案

### 4.1. 使用函数式更新

```jsx
function Timer() {
  const [count, setCount] = useState(0);
  
  // ✅ 使用函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // 不依赖外部的 count
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // 空依赖数组是安全的
}
```

### 4.2. 使用 useRef

```jsx
function Component() {
  const [value, setValue] = useState('');
  const valueRef = useRef(value);
  
  // 更新 ref
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  
  // ✅ 使用 ref 访问最新值
  const handleAsync = useCallback(() => {
    setTimeout(() => {
      console.log(valueRef.current); // 总是能获取最新值
    }, 1000);
  }, []);
}
```

### 4.3. 正确使用依赖数组

> 传入的值总能保证是最新的

```jsx
function SearchComponent({ onSearch }) {
  const [query, setQuery] = useState('');
  
  // ✅ 添加必要的依赖
  const search = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);
}
```

### 4.4. 使用 useReducer

>  dispatch 永远是稳定的，不需要依赖

```jsx hl:16,13
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  // ✅ dispatch 永远是稳定的，不需要依赖
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'increment' });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
}
```

### 4.5. 使用 useLatest 自定义 Hook

#### 4.5.1. 定义 Hooks：使用 useRef 

```jsx
function useLatest(value) {
  const ref = useRef(value);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref;
}

```

#### 4.5.2. 使用

```javascript
function Component() {
  const [value, setValue] = useState('');
  const latestValue = useLatest(value);
  
  const handleAsync = useCallback(() => {
    setTimeout(() => {
      console.log(latestValue.current);
    }, 1000);
  }, []);
}
```

### 4.6. 使用 useCallback 或 useMemo 来处理 Capture Value

```javascript hl:4
function Example() {
  const [count, setCount] = useState(0);
  
  // 每次 count 改变时都会创建新的回调
  const handleClick = useCallback(() => {
    console.log(`Count is: ${count}`);
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={handleClick}>Log count</button>
    </div>
  );
}
```
