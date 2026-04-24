# React 的 Render Props

`#react` 

## 1. 总结

- 传入一个 `prop.render`
	- 来传递需要渲染的内容
- 有点类似于 Vue 的作用域插槽

## 2. 基本概念

```javascript
// Render Props 的基本形式
<DataProvider render={data => (
  <h1>Hello {data.name}</h1>
)}/>
```

这是一种组件**通过一个函数 prop 来传递需要渲染的内容的技术**。

>  这个 prop **通常命名为 render，但不是必须的**。

## 3. 具体示例：以一个鼠标追踪器为例

```javascript hl:16
// MouseTracker 组件
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {/* 调用 render prop */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用 MouseTracker
<MouseTracker
  render={({ x, y }) => (
    <h1>鼠标位置：({x}, {y})</h1>
  )}
/>
```

## 4. children prop 方式

```javascript hl:8
// 也可以使用 children 作为函数
class MouseTracker extends React.Component {
  // ... 同上的 state 和 handleMouseMove

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// 使用方式
<MouseTracker>
  {({ x, y }) => (
    <h1>鼠标位置：({x}, {y})</h1>
  )}
</MouseTracker>
```

## 5. 现代替代方案现：在更推荐使用 Hooks 来实现类似功能

```javascript
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

// 使用
function App() {
  const { x, y } = useMousePosition();
  return <h1>鼠标位置：({x}, {y})</h1>;
}
```

## 6. Vue 的解决方案

`Vue 的作用域插槽`和 `React 的 Render Props` 是**解决相同问题的不同方案**

## 7. 最后

- Render Props 是 React **早期**一个重要的代码复用模式
- 现在有了 Hooks 这样更**现代**的解决方案
