# 使用 useDeferredValue  来延迟状态更新

`#react` 

## 1. 总结

- useDeferredValue 与 useTransition
	- **使用场景**
		- useDeferredValue
			- 适用于`值`的延迟
			- 把特定状态的更新标记为`低优先级`
		- useTransition：
			- 适用于`状态更新`的优先级 
			- 关注点是 **状态的过渡**
	- **控制方式**
		- useDeferredValue
			- `被动`控制
		- useTransition
			- `主动`控制 
	- **应用方式**
		- useDeferredValue：直接应用于`值`
			- 具体的 state 比如 `xxx`
		- useTransition：
			- 包装`状态更新函数` 
				- 包装具体的状态更新函数
					- 比如 `setXxx`
	- 注意点
		- 和`useTransition`一样，`useDeferredValue`**只会中断或延迟UI的渲染**，**不会阻止网络请求**
		- 仅在**并发模式**下生效
- useDeferredValue 使用案例
	- 实时搜索的**搜索结果展示组件**
	- 数据可视化的，**chart 图展示**
	- 实时文本的 **预览文本展示**
- useDeferredValue 工作原理
	- **延迟处理**
		- 创建**值的延迟副本**
		- 优先处理紧急更新
		- 在**空闲时间**处理延迟值 
	- **性能优化**
		- 避免阻塞主线程
		- 提高用户交互响应性
		- 平滑处理大量数据更新 

## 2. `useTransition`和`useDeferredValue`的差异

- `useTransition`主要关注点是**状态的过渡**。
	- 它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- `useDeferredValue`主要关注点是**单个值的延迟更新**。
	- 它允许你把特定状态的更新标记为`低优先级`。

## 3. 定义和基本概念

useDeferredValue 是 React 18 引入的一个 Hook，它允许我们**延迟更新 UI 的某些部分**。这个 Hook 接收一个值并返回该值的延迟版本：

```javascript
const deferredValue = useDeferredValue(value);
```

它的主要作用是在处理大量数据或复杂计算时，通过延迟非关键更新来保持 UI 的响应性 

## 4. 工作原理

- **延迟处理**
	- 创建值的延迟副本
	- 优先处理紧急更新
	- 在空闲时间处理延迟值 
- **性能优化**
	- 避免阻塞主线程
	- 提高用户交互响应性
	- 平滑处理大量数据更新 

## 5. 主要使用场景

- **大数据展示**
	- 长列表渲染
	- 实时搜索
	- 数据过滤 
- **复杂计算**
	- 图表更新
	- 数据分析
	- 动态表格 
- **用户输入处理**
   - 自动完成
   - 实时预览
   - 表单验证 

## 6. 实际使用案例

### 6.1. 案例1：实时搜索

> 搜索结果可以往后延迟

```javascript hl:3,12,19
function SearchComponent() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
      />
      <SearchResults query={deferredQuery} />
    </div>
  );
}

function SearchResults({ query }) {
  const results = useMemo(() => {
    // 复杂的搜索逻辑
    return performExpensiveSearch(query);
  }, [query]);

  return (
    <ul>
      {results.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 6.2. 案例2：数据可视化

```javascript hl:3,12,18
function DataVisualization() {
  const [data, setData] = useState([]);
  const deferredData = useDeferredValue(data);

  const handleDataUpdate = (newData) => {
    setData(newData);
  };

  return (
    <div>
      <DataControls onUpdate={handleDataUpdate} />
      <Chart data={deferredData} />
    </div>
  );
}

function Chart({ data }) {
  // 使用 useMemo 优化复杂的图表计算
  const chartConfig = useMemo(() => {
    return generateChartConfig(data);
  }, [data]);

  return <ChartComponent config={chartConfig} />;
}
```

### 6.3. 案例3：实时文本预览

```javascript hl:3,12,19
function MarkdownEditor() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  return (
    <div className="editor-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入 Markdown 文本..."
      />
      <MarkdownPreview text={deferredText} />
    </div>
  );
}

function MarkdownPreview({ text }) {
  const html = useMemo(() => {
    return convertMarkdownToHtml(text);
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

## 7. 使用的注意事项

- `useDeferredValue` 仅在**开启React并发模式**的时候才有效
- 传递给`useDeferredValue`的值应该是**原始值**（如字符串和数字）或**在渲染外部创建的对象**
- 当同一个`useDeferredValue`在渲染前接收到多次不同的值时，只有**最后一个会被渲染**
- 和`useTransition`一样，`useDeferredValue`**只会中断或延迟UI的渲染**，**不会阻止网络请求**。
   

## 8. 使用的好处、与防抖与节流的区别

- 它与React深度集成，可以适应用户的设备。
	- 如果设备性能好，延迟的重新渲染会很快完成；
	- 如果设备性能差，重新渲染会相应地延迟。
- 它不需要选择固定的延迟，与防抖和节流不同。
	- **防抖与节流的局限性**：
		- 这两种方法都是为了控制函数的执行频率，但它们是阻塞的，可能会导致不流畅的用户体验。
- 由`useDeferredValue`执行的重新渲染是可中断的
	- 这意味着在React重新渲染期间，如果发生了其他更新，React会中断当前的渲染并处理新的更新。

## 9. 与 useTransition 的区别

- **使用场景**
	- useDeferredValue：
		- 适用于`值`的延迟
	- useTransition：
		- 适用于`状态更新`的优先级 
- **控制方式**
	- useDeferredValue：
		- `被动`控制
	- useTransition：
		- `主动`控制 
- **应用方式**
	- useDeferredValue：直接应用于`值`
		- 具体的 state 比如 `xxx`
	- useTransition：
		- 包装`状态更新函数` 
			- 包装具体的状态更新函数，比如 `setXxx`
