# React.memo 、 useMemo 、 useCallback 对比

`#react` 

## 1. 总结

- React.memo 是一个**高阶组件(HOC)**，用于**组件级别的缓存**
	- 可接受第二个参数：自定义比较函数
- useMemo 用于**缓存**计算结果
- useCallback 用于缓存 函数

## 2. React.useCallback 和 useCallback

实际上它们是完全一样的！这只是引用方式的不同：

```javascript
// 方式 1：从 React 对象中解构
import { useCallback } from 'react';
const memoizedFn = useCallback(() => {}, []);

// 方式 2：通过 React 对象调用
import React from 'react';
const memoizedFn = React.useCallback(() => {}, []);
```

两种方式功能完全相同，都是用来缓存函数的 Hook。选择哪种方式主要取决于你的代码风格和项目约定。

## 3. React.memo 和 useMemo 的区别

### 3.1. React.memo

React.memo 是一个**高阶组件(HOC)**，用于**组件级别的缓存**：

```javascript hl:12
// React.memo 示例
const MyComponent = React.memo(function MyComponent(props) {
  /* 渲染逻辑 */
  return (
    <div>
      <h1>{props.name}</h1>
      <p>{props.description}</p>
    </div>
  );
});

// 可以添加第二个参数：可以添加自定义比较函数
const MyComponent = React.memo(function MyComponent(props) {
  /* 渲染逻辑 */
}, (prevProps, nextProps) => {
  // 返回 true 则不重新渲染，返回 false 则重新渲染
  return prevProps.name === nextProps.name;
});
```

#### 3.1.1. 主要特点

- 用于优化函数组件的重渲染
- 对比 props 变化，决定是否重新渲染组件
- 是一个高阶组件，包裹整个组件
- 适用于纯展示型组件的优化

### 3.2. useMemo

useMemo 是一个 Hook，用于缓存计算结果：

```javascript
// useMemo 示例
function MyComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 缓存计算结果
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(count);
  }, [count]);

  // 缓存对象
  const memoizedObject = useMemo(() => ({
    id: count,
    text: text
  }), [count, text]);

  return (
    <div>
      <p>Computed value: {expensiveValue}</p>
      <ChildComponent data={memoizedObject} />
    </div>
  );
}
```

主要特点：

- 用于缓存计算结果或值
- 只在依赖项改变时重新计算
- 是一个 Hook，在组件内部使用
- 适用于昂贵的计算或防止对象引用变化

### 3.3. 总结

1. React.memo 适用于减少组件重渲染
2. useMemo 适用于缓存计算结果或对象引用
3. 不要过度优化，只在性能问题明显时使用
4. 配合 React DevTools 进行性能分析
