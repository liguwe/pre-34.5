# React 组件的各种定义和声明方式

`#react`  

## 1. 总结

- 简单的展示型组件
	- 使用函数式组件
- 需要状态管理和生命周期的
	- 使用 **类组件或 Hooks**
- 需要**复用**逻辑的
	- 使用**高阶组件或自定义 Hooks**
- 需要性能优化的
	- 使用 `React.memo` 或 `PureComponent`
- 需要代码分割的
	- 使用 `React.lazy` 和 `Suspense`

## 2. 函数式组件（Function Component）

```jsx
// 1.1 普通函数声明
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 1.2 箭头函数声明
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 1.3 箭头函数简写（单行返回）
const Welcome = props => <h1>Hello, {props.name}</h1>;

// 1.4 使用解构的箭头函数
const Welcome = ({ name, age }) => (
  <div>
    <h1>Hello, {name}</h1>
    <p>Age: {age}</p>
  </div>
);
```

## 3. 类组件（Class Component）

```jsx hl:1,8,15
// 2.1 基础类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 2.2 使用 React.PureComponent
class PureWelcome extends React.PureComponent {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 2.3 使用 class fields
class ModernWelcome extends React.Component {
  state = {
    count: 0
  };

  handleClick = () => {
    this.setState(state => ({ count: state.count + 1 }));
  };

  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}</h1>
        <button onClick={this.handleClick}>
          Count: {this.state.count}
        </button>
      </div>
    );
  }
}
```

## 4. 高阶组件（HOC）

```jsx
// 3.1 基本的高阶组件
const withLogger = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      console.log('Component mounted');
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};

// 使用高阶组件
const LoggedWelcome = withLogger(Welcome);

// 3.2 带参数的高阶组件
const withData = (dataSource) => (WrappedComponent) => {
  return class extends React.Component {
    state = {
      data: null
    };

    componentDidMount() {
      this.fetchData();
    }

    fetchData = async () => {
      const data = await dataSource();
      this.setState({ data });
    };

    render() {
      return (
        <WrappedComponent
          data={this.state.data}
          {...this.props}
        />
      );
    }
  };
};
```

## 5. Render Props 模式

```jsx
// 4.1 基本的 Render Props
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用 Render Props
<MouseTracker
  render={({ x, y }) => (
    <h1>Mouse position: {x}, {y}</h1>
  )}
/>

// 4.2 使用 children 作为函数
class MouseTracker extends React.Component {
  // ... 同上
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}
```

## 6. 使用 Hooks 的函数组件

```jsx
// 5.1 使用多个 Hooks
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>Welcome {user.name}</div>;
};

// 5.2 自定义 Hook
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

// 使用自定义 Hook
const ResponsiveComponent = () => {
  const { width, height } = useWindowSize();
  return <div>Window size: {width} x {height}</div>;
};
```

## 7. React.memo 组件

```jsx hl:1,6
// 6.1 基本的 Memo 组件
const MemoizedComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});

// 6.2 带有比较函数的 Memo 组件
const MemoizedComponent = React.memo(
  function MyComponent(props) {
    return <div>{props.value}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  }
);
```

## 8. 动态组件 & 异步组件

```jsx hl:1,13
// 7.1 使用条件渲染创建动态组件
const DynamicComponent = ({ type, ...props }) => {
  const components = {
    text: TextComponent,
    image: ImageComponent,
    video: VideoComponent
  };

  const Component = components[type];
  return Component ? <Component {...props} /> : null;
};

// 7.2 使用 lazy 和 Suspense 进行代码分割
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```
