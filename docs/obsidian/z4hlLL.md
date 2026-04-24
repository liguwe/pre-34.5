# 使用 useTransition 进行非阻塞渲染

`#react` 

## 1. 总结

- useTransition 是 React 18 引入的一个强大的性能优化 Hook
	- 它允许我们**将某些更新标记为非紧急的过渡更新**
	- API：`  const [isPending, startTransition] = useTransition();`
- 使用场景
	- 选项卡切换
	- 输入框高于搜索结果，搜索结果使用 `startTransition` 包装
	- 使用 startTransition 来包装**路由切换**
- 注意点
	- 传递给`startTransition`的函数**必须是同步的，而不能是异步的**
- 优势
	- **避免阻塞**：防止大型更新阻塞用户输入
	- **优先级管理**：自动处理更新优先级
	- **更流畅的体验**：减少界面卡顿和延迟 

## 2. 基本概念

useTransition 是 React 18 引入的一个强大的性能优化 Hook，它允许我们**将某些更新标记为非紧急的过渡更新**。

```typescript
const [isPending, startTransition] = useTransition();
```

- `isPending`: 布尔值，表示过渡状态是否处于进行中
- `startTransition`: 
	- 当你希望启动一个新的过渡状态时调用它
	- 用于包装需要标记为过渡更新的状态更新函数 
	- 当你使用`startTransition`函数进行状态更新时
		- 你实际上告诉 React：**这个更新不是非常紧急的**
		- 如果有更重要的更新要处理，你可以中断或延后这个次要更新

## 3. 主要用途

- 处理大量数据更新
	- 避免界面卡顿
	- 保持用户界面响应
	- 优化用户体验
- 并发渲染控制
	- 区分紧急和非紧急更新
	- 优化渲染优先级
	- 提供更流畅的交互
- **智能调度**
	- 自动批处理更新
	- 优化渲染时机
	- 减少不必要的渲染
- **避免阻塞**
	- 保持输入响应性
	- 防止 UI 冻结
	- 改善用户体验

## 4. 与 useDeferredValue 的比较

- **useTransition**
	- 直接控制状态更新
	- 适用于触发更新的地方
	- 提供 pending 状态
- **useDeferredValue**
	- 延迟值的更新
	- **适用于接收值**的地方
	- 不提供 pending 状态

## 5. 注意事项

- `useTransition`仅在开启**React 并发模式**的时候才有效

```javascript
// React v18以前
ReactDOM.render(<app />, rootNode) // ❌ 无法开启useTransition
 
// React v18
ReactDOM.createRoot(rootNode).render(<app />) // ✅ 开启useTransition
```

- 只有当你能访问某个状态的`set函数`时，你才能将更新包装进`useTransition`中

- 传递给`startTransition`的函数**必须是同步的，而不能是异步的**。

```javascript
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
 
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

- 不能用于控制文本输入。因为输入框是需要实时更新的，如果用`useTransition`降低了渲染优先级，可能造成输入“卡顿”。

- 不要在`startTransition`内部使用`setTimeout`，如果一定要用`setTimeout`，你可以在`startTransition`外层使用

```javascript
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
 
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

- 前面说到很多次“中断或延后更新”，那么什么时候中断，什么时候延后更新？
	- 最简单的理解：
		- 被`useTransition`包裹的同一个状态多次更新，只会渲染最后一个，前面的都算中断（仅UI层面，如：长列表多次请求）；
	- 不同组件触发不同状态的更新，被`useTransition`包裹的状态优先级较低，被中断后会等高优先级的状态更新完成后继续更新（如：复杂图表渲染被中断，会在高优先级状态更新后，继续处理图表的渲染）。

## 6. 实际应用示例

### 6.1. 示例1：选项卡切换

如下代码，这样我们快速切换tab，无论点到哪一个tab都不会卡顿

```javascript hl:9,17
function Tabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <TabButton 
        onClick={() => {
          startTransition(() => {
            setTab('home');
          });
        }}>
        Home
      </TabButton>
      <TabButton 
        onClick={() => {
          startTransition(() => {
            setTab('posts');
          });
        }}>
        Posts
      </TabButton>
      {isPending ? (
        <Spinner />
      ) : (
        <TabContent tab={tab} />
      )}
    </>
  );
}

```

### 6.2. 示例 2：输入框优先级高于搜索结果，立即更新

```typescript hl:6,9
function SearchResults() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const updateQuery = (e) => {
    // 立即更新输入框
    setQuery(e.target.value);
    
    // 将搜索结果更新标记为过渡
    startTransition(() => {
      // 复杂的搜索逻辑
      performSearch(e.target.value);
    });
  };

  return (
    <div>
      <input value={query} onChange={updateQuery} />
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <SearchResults />
      )}
    </div>
  );
}
```

### 6.3. 示例 3： `useTransition`和`Suspense`实现路由流畅切换

```jsx hl:5,9,39
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
 
const [location, setLocation] = useState(window.location);
const [isPending, startTransition] = React.unstable_useTransition();
 
// 使用 startTransition 来更新 location 状态，能够延迟显示新页面的内容，直到数据加载完毕
function handleNavigation(newLocation) {
  startTransition(() => {
    setLocation(newLocation);
  });
}
 
function CustomLink({ to, children }) {
  return (
    <a
      href={to}
      onClick={(event) => {
        event.preventDefault();
        handleNavigation(to);
      }}
    >
      {children}
    </a>
  );
}
 
// 主应用组件
function App() {
  return (
    <div>
      <BrowserRouter>
        {/* 导航 */}
        <nav>
          <CustomLink to="/about">About</CustomLink>
          <CustomLink to="/contact">Contact</CustomLink>
        </nav>
 
        {/* 使用 React.Suspense 来处理组件的懒加载 */}
        <React.Suspense fallback={<LoadingIndicator />}>
          <Switch location={location}>
            <Route path="/about" component={AboutPage} />
            <Route path="/contact" component={ContactPage} />
            {/* ...其他路由... */}
          </Switch>
        </React.Suspense>
 
        {/* 使用 isPending 显示或隐藏全局加载指示器 */}
        {isPending && <LoadingIndicator />}
      </BrowserRouter>
    </div>
  );
}
 
export default App;
```

## 7. 使用场景

- **复杂数据过滤**：处理大型列表的过滤和搜索
- **切换视图**：在不同视图之间平滑过渡
- **数据可视化**：更新大型图表或数据集
- **延迟加载**：处理异步内容加载 

## 8. 性能优势

- **避免阻塞**：防止大型更新阻塞用户输入
- **优先级管理**：自动处理更新优先级
- **更流畅的体验**：减少界面卡顿和延迟 

## 9. 最佳实践

### 9.1. **识别非紧急更新**

  ```typescript
  // 好的使用方式
  startTransition(() => {
    setFilteredItems(computeExpensiveFiltering(items));
  });
  ```

### 9.2. **结合 Suspense**

  ```typescript
  <Suspense fallback={<Loading />}>
    {isPending ? <OldContent /> : <NewContent />}
  </Suspense>
  ``` 

## 10. 使用建议

1. 优先考虑以下场景使用 useTransition：
    - 大数据列表渲染
    - 复杂计算操作
    - 频繁状态更新
2. 避免在以下情况使用：
    - 简单的状态更新
    - 不需要优化的操作
    - 紧急的用户反馈
3. 结合其他优化手段：
    - 虚拟列表
    - 数据分页
    - 缓存策略

## 11. 性能优化技巧

### 11.1. 分批处理更新

  ```typescript
  startTransition(() => {
    // 将大型更新分成小批次
    for (let i = 0; i < items.length; i += 100) {
      const batch = items.slice(i, i + 100);
      processItems(batch);
    }
  });
  ```

### 11.2. 条件使用

  ```typescript
  const handleChange = (e) => {
    if (isComplexUpdate) {
      startTransition(() => updateState(e.target.value));
    } else {
      updateState(e.target.value);
    }
  };
  ```
