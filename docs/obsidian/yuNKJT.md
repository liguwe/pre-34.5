# React 中实现异步加载组件

`#react` 

## 1. 总结

- 使用 React.lazy 和 Suspense 实现异步组件
- 懒加载
- 重试机制
- startTransition 优化交互体验
- 错误处理
- 异步组件的**自己实现**
	- Class 实现 AsyncComponent
	- Hooks：useAsync 

## 2. React.lazy 和 Suspense（推荐方式）

这是 React 16.6+ 官方提供的异步组件解决方案：

```jsx
// 1. 基础用法
import React, { Suspense } from 'react';

// 使用 React.lazy 动态引入组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// 2. 多个异步组件
const LazyComponent1 = React.lazy(() => import('./LazyComponent1'));
const LazyComponent2 = React.lazy(() => import('./LazyComponent2'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <LazyComponent1 />
        <LazyComponent2 />
      </div>
    </Suspense>
  );
}

// 3. 嵌套 Suspense
function App() {
  return (
    <Suspense fallback={<div>Loading outer...</div>}>
      <div>
        <h1>Main Content</h1>
        <Suspense fallback={<div>Loading inner...</div>}>
          <LazyComponent />
        </Suspense>
      </div>
    </Suspense>
  );
}
```

## 3. 路由级别的代码分割

### 3.1. 基础路由懒加载

```jsx
// 1. 基础路由懒加载
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense } from 'react';

const Home = React.lazy(() => import('./routes/Home'));
const About = React.lazy(() => import('./routes/About'));
const User = React.lazy(() => import('./routes/User'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/user" component={User} />
        </Switch>
      </Suspense>
    </Router>
  );
}
```

### 3.2. 创建可重用的异步路由组件

```tsx
// 2. 创建可重用的异步路由组件
const AsyncRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...props} />
      </Suspense>
    )}
  />
);

// 使用
function App() {
  return (
    <Router>
      <Switch>
        <AsyncRoute exact path="/" component={Home} />
        <AsyncRoute path="/about" component={About} />
        <AsyncRoute path="/user" component={User} />
      </Switch>
    </Router>
  );
}
```

## 4. 自定义异步组件实现

如果需要更细粒度的控制，可以自己实现异步组件：

### 4.1. 基于 Class 组件的实现

```jsx hl:13
// 1. 基于 Class 组件的实现
class AsyncComponent extends React.Component {
  state = {
    Component: null
  };

  componentDidMount() {
    this.loadComponent();
  }

  loadComponent = async () => {
    const { loader } = this.props;
    const Component = await loader();
    this.setState({ Component });
  };

  render() {
    const { Component } = this.state;
    const { fallback, ...props } = this.props;

    return Component ? <Component {...props} /> : fallback;
  }
}

// 使用方式
const AsyncHome = props => (
  <AsyncComponent
    loader={() => import('./Home')}
    fallback={<div>Loading...</div>}
    {...props}
  />
);

```

### 4.2. 基于 Hooks 的实现

```jsx

// 2. 基于 Hooks 的实现
function useAsync(loader) {
  const [Component, setComponent] = React.useState(null);

  React.useEffect(() => {
    loader().then(comp => {
      setComponent(comp.default || comp);
    });
  }, [loader]);

  return Component;
}

function AsyncComponent({ loader, fallback, ...props }) {
  const Component = useAsync(loader);
  return Component ? <Component {...props} /> : fallback;
}
```

## 5. 错误处理和重试机制

### 5.1. 使用 Error Boundary

```jsx hl:5
// 1. 使用 Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong!</div>;
    }
    return this.props.children;
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

```

### 5.2. 带重试机制的异步组件

```javascript

// 2. 带重试机制的异步组件
function RetryableAsyncComponent({ loader, maxRetries = 3, ...props }) {
  const [error, setError] = React.useState(null);
  const [retries, setRetries] = React.useState(0);
  const [Component, setComponent] = React.useState(null);

  const loadComponent = async () => {
    try {
      const comp = await loader();
      setComponent(comp.default || comp);
      setError(null);
    } catch (err) {
      setError(err);
      if (retries < maxRetries) {
        setTimeout(() => {
          setRetries(r => r + 1);
          loadComponent(); // 递归调用
        }, Math.pow(2, retries) * 1000); // 指数退避
      }
    }
  };

  React.useEffect(() => {
    loadComponent();
  }, []);

  if (error && retries >= maxRetries) {
    return <div>Failed to load component after {maxRetries} retries</div>;
  }

  return Component ? <Component {...props} /> : <div>Loading...</div>;
}
```

### 5.3. 最简单的重试机制

```javascript
function RetryableComponent({ retries = 3 }) {
  const [retry, setRetry] = useState(0);

  return (
    <ErrorBoundary
      onError={() => {
        if (retry < retries) {
          setRetry(r => r + 1);
        }
      }}
    >
      <Suspense fallback={<Loading />}>
        <LazyComponent key={retry} />
      </Suspense>
    </ErrorBoundary>
  );
}

```

## 6. 性能优化

### 6.1. 在需要时预加载

```jsx
// 1. 预加载组件
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// 在需要时预加载
const preloadComponent = () => {
  const componentPromise = import('./LazyComponent');
  return componentPromise;
};

// 使用
function App() {
  const handleMouseEnter = () => {
    preloadComponent(); // 用户hover时预加载
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}


```

### 6.2. 优化加载状态

```javascript
// 2. 优化加载状态
function DelayedFallback({ delay = 200 }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return show ? <div>Loading...</div> : null;
}

function App() {
  return (
    <Suspense fallback={<DelayedFallback />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 6.3. 使用 `startTransition` 优化用户体验

```javascript
import { startTransition } from 'react';

function App() {
  const [tab, setTab] = useState('home');

  const switchTab = (nextTab) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <TabButton onClick={() => switchTab('home')}>Home</TabButton>
      <TabButton onClick={() => switchTab('profile')}>Profile</TabButton>
      <Suspense fallback={<Loading />}>
        {tab === 'home' ? <Home /> : <Profile />}
      </Suspense>
    </div>
  );
}

```

## 7. 数据预加载

```jsx
// 1. 创建资源加载器
function createResource(promise) {
  let status = 'pending';
  let result;
  let suspender = promise.then(
    r => {
      status = 'success';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  };
}

// 2. 使用数据预加载
const dataResource = createResource(fetch('/api/data').then(r => r.json()));

function AsyncDataComponent() {
  const data = dataResource.read();
  return <div>{data.message}</div>;
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncDataComponent />
    </Suspense>
  );
}
```

## 8. 建议

在实际应用中，建议：
- 优先使用 React.lazy 和 Suspense
- 在路由层面实现代码分割
	- 实现代码分割和按需加载
- 实现适当的错误处理
- 添加加载状态反馈
	- 提供良好的加载体验
- 考虑预加载策略
	- 实现数据预加载
- 优化加载体验
