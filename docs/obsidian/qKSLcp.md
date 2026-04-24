# React 重新渲染的场景以及对应的优化方案

`#React` 

## 1. 重复渲染场景及解决思路

- **State 变化**触发重新渲染
	- 合并状态更新
	- 使用 `useReducer` 管理复杂状态
- **Props 变化**触发子组件重新渲染
	- 使用 React.memo 包装组件
	- 使用 useMemo 缓存计算属性
	- 使用 useCallback 缓存**回调函数**
- 父组件重新渲染导致子组件重新渲染
	- 组件拆分，将变化部分隔离
	- 使用 React.memo 阻止不必要的重新渲染
- Context 变化触发消费组件重新渲染
	- 拆分 Context
	- 使用 useMemo 缓存 Context 值
- 列表渲染优化
	- 使用稳定的 key
	- 虚拟列表： 
		- 虚拟列表（react-window 或 react-virtualized）
	- 分页或无限滚动
- 事件处理函数优化，**每次渲染都创建新的函数**
	- 使用 useCallback
	- 使用 ref 存储函数，这是静态的，就不会每次都创建新函数
- 异步操作和副作用优化
	- 使用 `AbortController` 取消请求
	- 使用缓存
	- 考虑使用 React Query 或 SWR 等数据管理库
- 强制重新渲染：
	- `const [, forceUpdate] = useReducer(x => x + 1, 0);`

## 2. 总结：关键优化思路

1. 减少渲染范围
    - 状态下移
    - 组件拆分
    - 使用 React.memo
2. 稳定化数据和回调
    - useCallback
    - useMemo
    - useReducer
    - 提取静态数据
        - 使用 useRef 存储静态数据，他不会导致重新渲染
3. 优化数据流
    - 合理的状态管理
    - Context 拆分
    - 批量更新
4. 性能监测：
    - React DevTools Profiler
    - 性能监控
    - 代码分割

## 3. 使用 React DevTools 分析渲染

```jsx
// 使用 React Profiler 组件包裹需要分析的部分
function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponent />
    </Profiler>
  );
}

function onRenderCallback(
  id, // 发生提交的 Profiler 树的 "id"
  phase, // "mount" （首次渲染）或 "update" （重新渲染）
  actualDuration, // 本次更新花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新开始渲染的时间
  commitTime, // 本次更新被提交的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 在这里进行性能分析
}
```
