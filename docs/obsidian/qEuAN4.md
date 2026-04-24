# React 的架构设计演变

`#react` 

## 1. 总结

- 性能瓶颈来源，就**两个**
	- cpu 瓶颈
	- io 瓶颈
- 架构演变
	- 15 及之前 → **协调器 + 渲染器**
	- 16 及之后 → **协调器 + 渲染器 + 调度器**
		- 可中断更新

## 2. 前端框架性能问题都可以归因以下两个

### 2.1. CPU 瓶颈

- JavaScript 是**单线程**执行的
- 在主线程上进行大量计算会阻塞渲染
- 长任务（>50ms）会导致页面响应迟钝
	- 比如同时渲染 30000 个 DOM
	- vdom 相关的处理
		- 所以，要求 React 具有将长任务拆解的能力，即时间切片 `time slice`

未使用时间切片的效果如下：

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241029.png)

使用时间切片的效果如下：**很平滑**

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241029-1.png)

### 2.2. I/O 瓶颈

- 主要的 `I/O 瓶颈`是网络
- 又比如输入打字
- 解决方案
	- 结合**人机交互**，**用户对不同的操作的感知敏感度不一样**，比如
		- 键盘输入到显示，稍微延迟，用户也能感觉到
		- 鼠标悬停，稍微延迟，用户也能感觉到
		- 点击按钮，到数据显示，有点延迟用户也能接受
	- 所以，对不同操作，要求 React 具有
		- 有优先级调度的能力，这就要求
			- 调用算法
			- 可中断 VDOM，毕竟不中断，CPU 一直占着

## 3. React 架构演变

### 3.1. React 15 ：Reconciler 架构

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-21.png)

#### 3.1.1. Reconciler 协调器

同步的，VDOM 的实现

```javascript hl:3
// React15 中的递归处理示意
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  // 同步递归处理，无法中断
  for (let i = 0; i < newChildren.length; i++) {
    reconcileChildrenArray(/*...*/)
  }
}
```

#### 3.1.2. Renderer 渲染器

负责将 UI变化渲染到宿主环境

### 3.2. React 16 ：支持时间切片的 Fiber Reconciler

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-22.png)

- 新引入：`Scheduler 调度器`
	- 调度任务的优先级，高优的优先进入 Reconciler
- `Reconciler 协调器`：
	- VDOM 的实现，计算出 UI 的变化
- Renderer 渲染器：
	- 负责将 UI 变化渲染到宿主环境

#### 3.2.1. 演示更新效果

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241029-2.png)

### 3.3. Legacy（遗产） 模式（React 16/17 默认模式）

这是 React 最古老的渲染模式，通过 `ReactDOM.render()` 创建应用。

```javascript
// Legacy 模式
import ReactDOM from 'react-dom';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

#### 3.3.1. 特点：

1. 同步渲染
2. 不支持新的并发特性
3. 更新是同步的且不可中断

### 3.4. Blocking 模式（React 16.x 实验性）

这是向并发模式过渡的中间模式。

`createBlockingRoot`

```javascript hl:4
// Blocking 模式
import ReactDOM from 'react-dom';

ReactDOM.createBlockingRoot(
  document.getElementById('root')
).render(<App />);
```

#### 3.4.1. 特点：

1. **部分并发**模式特性
2. 比 Legacy 模式更接近并发
3. 作为过渡阶段的模式

### 3.5. Concurrent 模式（React 18+）

最新的渲染模式，支持所有新特性

`createRoot`

```javascript hl:5
// Concurrent 模式
import ReactDOM from 'react-dom/client';

// 创建根节点
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

// 渲染应用
root.render(<App />);
```

#### 3.5.1. 特点：

1. 完整的并发特性支持
2. 可中断的渲染
3. 自动批处理
4. 优先级调度

#### 3.5.2. 示例：使用 startTransition 将状态更新标记为非紧急，降低优先级

```javascript hl:12,9
// Concurrent 模式特性示例
function ConcurrentComponent() {
  const [isPending, startTransition] = useTransition();
  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');

  // 搜索处理
  const handleSearch = (e) => {
    // 立即更新输入值（高优先级）
    setQuery(e.target.value);

    // 将搜索结果更新标记为转换（低优先级）
    startTransition(() => {
      const searchResults = performExpensiveSearch(e.target.value);
      setList(searchResults);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />
      
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {list.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 4. 架构分层与核心包的关系

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-23.png)
