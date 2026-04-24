# 高阶组件（HOC）

`#react`  

## 1. 总结

- 高阶组件**本质是**一个函数，接收一个组件作为参数，返回一个新的**增强组件**
- 使用场景
	- 属性代理：`withExtraProps`
	- 条件渲染：权限控制
		- 比如 withAuth
	- withState 状态
	- withLogger
	- React.memo 本质也是 HOC
	- withData 数据获取
	- withStyles 
	- `withFetch(url)`
- 注意事项
	- **组合而非修改**
	- 不要在 render 中使用 hoc
	- 静态方法会丢失
	- 可使用 compose 组合多个 HOC
- hoist-non-react-statics
	- JavaScript 中，静态方法是定义在类本身上，而不是类的原型上
		- 当我们创建一个新的组件类来包装原始组件时，这个**新类并不会自动继承原始组件的静态方法** 
- 使用组合而不是继承
	- 在现代 React 开发中，**Hooks 通常是更简单和灵活的选择**

## 2. 什么是高阶组件

高阶组件是一个函数，接收一个组件作为参数，返回一个新的增强组件。这是一种基于 React 组合特性的组件**复用**技术

```jsx
// 基本的 HOC 结构
const withExample = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
// 使用 HOC
const EnhancedComponent = withExample(OriginalComponent);
```

## 3. 常见使用场景

### 3.1. 属性代理

```jsx
// 添加额外的 props
const withExtraProps = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const newProps = {
        extraProp: 'Extra Property'
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }
}

// 使用示例
const MyComponent = ({ extraProp }) => (
  <div>{extraProp}</div>
);

const Enhanced = withExtraProps(MyComponent);
```

### 3.2. 条件渲染：权限控制

```jsx 
// 权限控制 HOC
const withAuth = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      if (!this.props.isAuthenticated) {
        return <Navigate to="/login" />;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}

// 加载状态 HOC
const withLoading = (WrappedComponent) => {
  return function({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  }
}
```

### 3.3. 状态管理

```jsx
// 添加本地状态管理
const withState = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      count: 0
    };
    increment = () => {
      this.setState(prev => ({ count: prev.count + 1 }));
    };
    render() {
      return (
        <WrappedComponent
          {...this.props}
          count={this.state.count}
          onIncrement={this.increment}
        />
      );
    }
  }
}
```

### 3.4. 日志记录

```jsx
// 组件生命周期日志
const withLogger = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      console.log(`${WrappedComponent.name} mounted`);
    }

    componentWillUnmount() {
      console.log(`${WrappedComponent.name} will unmount`);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

### 3.5. 性能优化：React.memo

```jsx
// 添加性能优化
const withMemo = (WrappedComponent) => {
  return React.memo(WrappedComponent, (prevProps, nextProps) => {
    // 自定义比较逻辑
    return prevProps.value === nextProps.value;
  });
}
```

### 3.6. **数据获取和加载状态**

```javascript hl:11
const withData = (dataSource) => (WrappedComponent) => {
  return class extends React.Component {
    state = {
      data: null,
      loading: true,
      error: null
    };

    async componentDidMount() {
      try {
        const data = await dataSource();
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    }

    render() {
      const { data, loading, error } = this.state;
      return (
        <WrappedComponent
          data={data}
          loading={loading}
          error={error}
          {...this.props}
        />
      );
    }
  };
};
```

### 3.7. **样式注入**

```javascript
const withStyles = (styles) => (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <div style={styles}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};
```

## 4. 复杂示例

### 4.1. 组合多个 HOC：compose

```jsx
// HOC 组合
const compose = (...funcs) => x => funcs.reduceRight((v, f) => f(v), x);

const enhance = compose(
  withAuth,
  withLogger,
  withState,
  withLoading
);

const EnhancedComponent = enhance(BaseComponent);
```

### 4.2. 带参数的 HOC：带参数 `url`

```jsx
const withFetch = (url) => (WrappedComponent) => {
  return class extends React.Component {
    state = {
      data: null,
      loading: true,
      error: null
    };

    componentDidMount() {
      this.fetchData();
    }

    fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ data, loading: false });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    };

    render() {
      const { data, loading, error } = this.state;
      return (
        <WrappedComponent
          {...this.props}
          data={data}
          loading={loading}
          error={error}
        />
      );
    }
  };
};

// 使用
const UserList = withFetch('https://api.example.com/users')(UserComponent);
```

## 5. 注意事项

### 5.1. 不要在 render 方法中使用 HOC

```jsx
// ❌ 错误示例
class Example extends React.Component {
  render() {
    // 每次渲染都会创建新的组件实例
    const EnhancedComponent = withExample(MyComponent);
    return <EnhancedComponent />;
  }
}

// ✅ 正确示例
const EnhancedComponent = withExample(MyComponent);
class Example extends React.Component {
  render() {
    return <EnhancedComponent />;
  }
}
```

### 5.2. 复制静态方法

```javascript
import hoistNonReactStatics from 'hoist-non-react-statics';

function withExample(WrappedComponent) {
  class WithExample extends React.Component {
    /* ... */
  }
  
  // 复制静态方法
  hoistNonReactStatics(WithExample, WrappedComponent);
  return WithExample;
}
```

### 5.3. **命名约定**

```javascript
// 为 HOC 添加显示名称以便调试
function withExample(WrappedComponent) {
  class WithExample extends React.Component {/* ... */}
  
  // 设置有意义的显示名称
  WithExample.displayName = `WithExample(${getDisplayName(WrappedComponent)})`;
  return WithExample;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

### 5.4. 传递 Refs

```jsx
const withRef = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    return <WrappedComponent {...props} forwardedRef={ref} />;
  });
}
```

## 6. 最佳实践

### 6.1. **命名约定**

```jsx
// 使用 with 前缀
const withAuth = (WrappedComponent) => {
  // HOC 实现
};

// 为 HOC 包装的组件设置显示名称
const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

HOC.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
```

### 6.2. **解构 props**

```jsx
const withExample = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const { specialProp, ...passThroughProps } = this.props;
      return <WrappedComponent {...passThroughProps} />;
    }
  }
}
```

### 6.3. **组合而非修改**

```jsx
// ❌ 错误示例：直接修改原组件
const withExample = (WrappedComponent) => {
  WrappedComponent.prototype.componentDidMount = function() {
    // 某些操作
  };
  return WrappedComponent;
};

// ✅ 正确示例：使用组合
const withExample = (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      // 某些操作
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
};
```

## 7. 常见问题和解决方案

### 7.1. **props 命名冲突**

```jsx
const withProps = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const newProps = {
        // 使用特定前缀避免冲突
        withProps_value: 'example'
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }
}
```

### 7.2. **多个 HOC 的顺序问题**

```jsx
// HOC 的执行顺序从下到上
const enhance = compose(
  withAuth,      // 第三个执行
  withLayout,    // 第二个执行
  withLoading    // 第一个执行
);
```

## 8. 替代方案

在某些情况下，可以考虑使用以下替代方案：

1. **Render Props**
2. **Hooks**
3. **组件组合**

选择使用 HOC 还是其他方案，应该基于：
- 代码复用的粒度
- 性能要求
- 组件的复杂度
- 团队的开发习惯

HOC 是一个强大的模式，但不是唯一的解决方案。

在现代 React 开发中，**Hooks 通常是更简单和灵活的选择**。

## 9. 性能考虑

### 9.1. **避免不必要的嵌套**

```javascript
// ❌ 过度嵌套
export default withRouter(connect(mapState)(withStyles(MyComponent)));

// ✅ 使用组合函数
const enhance = compose(
  withRouter,
  connect(mapState),
  withStyles
);
export default enhance(MyComponent);
```

### 9.2. **使用记忆化**

```javascript
const memoizedHOC = (WrappedComponent) => {
  return React.memo((props) => {
    return <WrappedComponent {...props} />;
  });
};
```

## 10. 高阶组件，为什么静态方法会丢失？

### 10.1. **组件包装的本质**

高阶组件本质上是一个函数，它接受一个组件作为参数，然后返回一个新的组件。这个新组件通常会包装原始组件。例如：

```javascript
function withExampleHOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

在这个过程中，**返回的是一个全新的组件类，而不是原始组件的修改版本**

### 10.2. **静态方法不会被继承**

JavaScript 中，静态方法是定义在类本身上，而不是类的原型上。当我们创建一个新的组件类来包装原始组件时，这个**新类并不会自动继承原始组件的静态方法** 

### 10.3. **React 的组件模型**

React 的组件模型主要关注实例方法和生命周期，而不是静态方法。
当 React 处理组件时，它主要关注组件的 render 方法和生命周期方法，而不会特别处理静态方法

### 10.4. 示例说明

考虑以下例子：

```javascript hl:2
class OriginalComponent extends React.Component {
  static staticMethod() {
    console.log('This is a static method');
  }

  render() {
    return <div>Original Component</div>;
  }
}

function withHOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}

const EnhancedComponent = withHOC(OriginalComponent);

// 这会导致错误，因为 staticMethod 不存在于 EnhancedComponent 上
EnhancedComponent.staticMethod();
```

在这个例子中，`EnhancedComponent` 是一个全新的类，它不包含 `OriginalComponent` 的静态方法

### 10.5. 解决方案

#### 10.5.1. **手动复制静态方法**

你可以在 HOC 中手动复制静态方法：

```javascript hl:8
function withHOC(WrappedComponent) {
  class HOC extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  
  HOC.staticMethod = WrappedComponent.staticMethod;
  return HOC;
}
```

### 10.6. **使用 hoist-non-react-statics**

这就是为什么 `hoist-non-react-statics` 库变得有用。它自动处理静态方法的复制：

```javascript
import hoistNonReactStatics from 'hoist-non-react-statics';

function withHOC(WrappedComponent) {
  class HOC extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  
  return hoistNonReactStatics(HOC, WrappedComponent);
}
```

这个库会自动复制所有非 React 特定的静态方法，同时避免覆盖 React 特定的静态属性（如 `displayName`、`propTypes` 等）

### 10.7. **使用组合而不是继承**

React 推荐使用组合而不是继承。在某些情况下，你可以通过组合来避免使用 HOC，从而避免静态方法丢失的问题

### 10.8. 结论

高阶组件中静态方法丢失是由于 JavaScript 的类继承机制和 React 的组件模型共同导致的。
理解这一点有助于我们更好地设计组件和使用 HOC。
虽然有多种方法可以解决这个问题，但 `hoist-non-react-statics` 提供了一个简洁和自动化的解决方案，特别是在处理复杂组件或第三方库时。
