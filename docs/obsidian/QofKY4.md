# PureComponent

`#react`  

## 1. 总结

- PureComponent 自动实现了 `shouldComponentUpdate`
	- 支持所有常规的 React 生命周期方法
- Component vs PureComponent
	- PureComponent：
		- 会对 props 和 state 进行**浅比较**，只有在数据真正发生变化时才重新渲染
	- Component：
		- 默认情况下，只要父组件重新渲染，组件就会重新渲染
- 可使用 **React.memo** 来实现类似 PureComponent 的功能
	- 因为它也接受第二个参数
- 一些注意点
	- 对象属性尽量单独提出，比如 style，每次渲染都创建新对象
		- 建议，将对象提到组件外部或使用 useMemo
	- 数组属性使用 map 时，会新建数组
	- 函数属性不要内联
		- 内联函数会导致 PureComponent 失效

## 2. PureComponent 的定义

PureComponent 是 React 提供的一个基础组件类，它自动实现了 `shouldComponentUpdate` 生命周期方法，通`过浅比较（shallow comparison）props 和 state` 来决定是否需要重新渲染组件

PureComponent **完全支持所有常规的 React 生命周期方法**。
- 它主要通过自动实现 `shouldComponentUpdate()` 来优化性能，但不会限制你使用其他生命周期钩子。

## 3. PureComponent vs Component

```javascript
// 普通 Component
class RegularComponent extends React.Component {
  render() {
    console.log("Regular Component render");
    return <div>{this.props.value}</div>;
  }
}

// PureComponent
class PureComponentExample extends React.PureComponent {
  render() {
    console.log("Pure Component render");
    return <div>{this.props.value}</div>;
  }
}
```

### 3.1. 更新机制

   - Component：默认情况下，**只要父组件重新渲染，组件就会重新渲染**
   - PureComponent：**会对 props 和 state 进行浅比较，只有在数据真正发生变化时才重新渲染**

### 3.2. 性能影响

   - Component：可能导致不必要的重渲染
   - PureComponent：通过**浅比较**避免不必要的重渲染，提高性能

## 4. 浅比较的工作原理

```javascript hl:10,12,20,22
class Example extends React.PureComponent {
  state = {
    data: { count: 0 },
    array: [1, 2, 3],
  };

  // 浅比较的情况
  goodUpdate = () => {
    this.setState({
      // 创建新对象，会触发重新渲染
      data: { count: 1 },
      // 创建新数组，会触发重新渲染
      array: [...this.state.array, 4],
    });
  };

  // 浅比较可能出问题的情况
  problematicUpdate = () => {
    const { data, array } = this.state;
    // 直接修改对象，不会触发重新渲染
    data.count = 1;
    // 直接修改数组，不会触发重新渲染
    array.push(4);
    this.setState({ data, array });
  };
}

```

## 5. 使用场景和注意事项

### 5.1. 适合使用 `PureComponent` 的场景

```javascript
// 展示型组件，props 是简单类型
class UserInfo extends React.PureComponent {
  render() {
    return (
      <div>
        <h2>{this.props.name}</h2>
        <p>{this.props.email}</p>
      </div>
    );
  }
}
```

### 5.2. 不适合使用 `PureComponent` 的场景

```javascript
// 频繁更新的组件
class Timer extends React.Component { // 使用普通 Component
  state = { time: new Date() };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <div>{this.state.time.toLocaleTimeString()}</div>;
  }
}
```

## 6. 在函数组件中的等效实现

在函数组件中，我们使用 **React.memo 来实现类似 PureComponent 的功能**：

```javascript hl:11,22
// 使用 React.memo 创建类似 PureComponent 的效果
const MemoizedComponent = React.memo(function UserInfo({ name, email }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
});

// 自定义比较逻辑
const CustomMemoized = React.memo(
  function UserInfo({ user }) {
    return (
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // 返回 true 则不重新渲染
    return prevProps.user.id === nextProps.user.id;
  }
);
```

## 7. 常见陷阱和优化

### 7.1. 对象属性的问题

> [!danger]
> 关键的， `style=&#123;&#123; color: 'red' &#125;&#125;` 不好！

```javascript hl:3
class Parent extends React.Component {
  render() {
    // 不好的做法：每次渲染都创建新对象
    return <PureChild style={{ color: 'red' }} />;

    // 好的做法：将对象提到组件外部或使用 useMemo
    return <PureChild style={styles} />;
  }
}

const styles = { color: 'red' };
```

### 7.2. 数组属性的处理

```javascript hl:7,16
class ListComponent extends React.PureComponent {
  render() {
    const { items } = this.props;
    
    return (
      <ul>
        {/* 不好的做法：map 创建新数组 */}
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
}

// 优化：将 map 结果缓存
class OptimizedList extends React.PureComponent {
  memoizedItems = null;
  
  getMemoizedItems(items) {
    if (!this.memoizedItems || this.props.items !== items) {
      this.memoizedItems = items.map((item, index) => (
        <li key={index}>{item}</li>
      ));
    }
    return this.memoizedItems;
  }

  render() {
    return <ul>{this.getMemoizedItems(this.props.items)}</ul>;
  }
}
```

### 7.3. 函数属性的处理

```javascript hl:9,12
class Parent extends React.Component {
  // 好的做法：使用类方法
  handleClick = () => {
    // 处理点击
  };

  render() {
    return (
      // 不好的做法：内联函数会导致 PureComponent 失效
      <PureChild onClick={() => this.handleClick()} />
      
      // 好的做法：传递类方法引用
      <PureChild onClick={this.handleClick} />
    );
  }
}
```
