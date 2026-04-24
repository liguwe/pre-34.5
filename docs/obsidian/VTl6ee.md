# 无状态组件（Stateless Component）概念、原理及最佳实践

`#react`  

## 1. 总结

- 无状态组件 === 函数式组件
- 优势：
	- 更少的内存占用，性能优势、代码简洁性
- 缺陷：
	- 无法使用生命周期方法、不能维护内部状态、不支持复杂组件功能等
	- 但通过 React Hooks，无状态组件的大部分缺陷都可以得到解决，推荐在现代React开发中使用**函数组件 + Hooks的组合**。
- 条件渲染
	- `if` 或者 `&&`
- 性能优化思路
	- 使用 React.memo 包装
	- 内联对象 → 提取常量
	- 事件回调 → 使用 usecallback
	- 复杂计算：使用 useMemo 缓存结果
	- 样式
		- 使用 className  
		- 或者 style 提出变量

## 2. 什么是无状态组件

无状态组件（也叫**函数式组件**）是最简单的 React 组件形式，它们是**纯函数**
- 接收 props 并返回 React 元素
- **不包含内部状态、生命周期方法和 this 引用。**

## 3. 基本语法

```jsx
// 1. 最基本的无状态组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 2. 箭头函数形式
const Welcome = (props) => <h1>Hello, {props.name}</h1>;

// 3. 使用解构的形式
const Welcome = ({ name, age }) => (
  <div>
    <h1>Hello, {name}</h1>
    <p>Age: {age}</p>
  </div>
);
```

## 4. 特点和优势

### 4.1. 性能优势

```jsx
// 无状态组件
const PureDisplay = ({ text }) => <div>{text}</div>;

// 等效的类组件
class DisplayComponent extends React.Component {
  render() {
    return <div>{this.props.text}</div>;
  }
}
```

主要优势：
- 更少的内存占用
	- **因为没有实例创建**
- 更快的渲染速度
- 更容易测试和维护

### 4.2. 代码简洁

```jsx
// 无状态组件：简洁明了
const UserCard = ({ name, email, avatar }) => (
  <div className="user-card">
    <img src={avatar} alt={name} />
    <h2>{name}</h2>
    <p>{email}</p>
  </div>
);

// 类组件：相对冗长
class UserCard extends React.Component {
  render() {
    const { name, email, avatar } = this.props;
    return (
      <div className="user-card">
        <img src={avatar} alt={name} />
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
    );
  }
}
```

## 5. 最佳实践

### 5.1. Props 的**默认值**处理

> 两种方式

```jsx
// 方式1：使用默认参数
const Button = ({ text = 'Click me', onClick = () => {} }) => (
  <button onClick={onClick}>{text}</button>
);

// 方式2：使用 defaultProps
const Button = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);

Button.defaultProps = {
  text: 'Click me',
  onClick: () => {}
};
```

### 5.2. Props 类型检查

```jsx
import PropTypes from 'prop-types';

const UserProfile = ({ name, age, email }) => (
  <div>
    <h2>{name}</h2>
    <p>Age: {age}</p>
    <p>Email: {email}</p>
  </div>
);

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired
};
```

### 5.3. 条件渲染

```jsx
const ConditionalComponent = ({ isLoggedIn, userData }) => (
  <div>
    {isLoggedIn ? (
      <UserDashboard data={userData} />
    ) : (
      <LoginPrompt />
    )}
  </div>
);

// 使用 && 运算符
const Notification = ({ message }) => (
  <div>
    {message && <div className="alert">{message}</div>}
  </div>
);
```

## 6. 组合模式

### 6.1. 组件组合

```jsx
// 小型可复用组件
const Avatar = ({ src, alt }) => (
  <img src={src} alt={alt} className="avatar" />
);

const UserInfo = ({ name, title }) => (
  <div className="user-info">
    <h3>{name}</h3>
    <p>{title}</p>
  </div>
);

// 组合使用
const UserCard = ({ user }) => (
  <div className="user-card">
    <Avatar src={user.avatarUrl} alt={user.name} />
    <UserInfo name={user.name} title={user.title} />
  </div>
);
```

### 6.2. 渲染属性模式

```jsx
const WithTooltip = ({ children, tooltip }) => (
  <div className="tooltip-wrapper">
    {children}
    <span className="tooltip">{tooltip}</span>
  </div>
);

const Button = () => (
  <WithTooltip tooltip="Click to submit">
    <button>Submit</button>
  </WithTooltip>
);
```

## 7. 性能优化

### 7.1. 使用 React.memo

```jsx
const ExpensiveComponent = React.memo(({ data }) => (
  <div>
    {/* 复杂的渲染逻辑 */}
    {data.map(item => (
      <ComplexItem key={item.id} {...item} />
    ))}
  </div>
));

// 自定义比较函数
const MemoizedComponent = React.memo(
  ({ value }) => <div>{value}</div>,
  (prevProps, nextProps) => {
    return prevProps.value === nextProps.value;
  }
);
```

### 7.2. 避免不必要的渲染

```jsx hl:1,9
// 不好的做法：内联对象
const BadExample = () => (
  <UserCard
    style={{ margin: '10px' }} // 每次渲染都创建新对象
    data={{ id: 1, name: 'John' }}
  />
);

// 好的做法：提取常量
const cardStyle = { margin: '10px' };
const userData = { id: 1, name: 'John' };

const GoodExample = () => (
  <UserCard
    style={cardStyle}
    data={userData}
  />
);
```

## 8. 常见问题和解决方案

### 8.1. 处理事件

```jsx hl:12,1,8,3
// 不好的做法：每次渲染创建新函数
const BadButton = ({ onClick, text }) => (
  <button onClick={(e) => onClick(e, text)}>
    {text}
  </button>
);

// 好的做法：使用 useCallback
import { useCallback } from 'react';

const GoodButton = ({ onClick, text }) => {
  const handleClick = useCallback((e) => {
    onClick(e, text);
  }, [onClick, text]);

  return (
    <button onClick={handleClick}>
      {text}
    </button>
  );
};
```

### 8.2. 复杂计算：使用 useMemo 缓存结果

```jsx
import { useMemo } from 'react';

const DataDisplay = ({ items }) => {
  // 使用 useMemo 缓存计算结果
  const processedData = useMemo(() => {
    return items.map(item => ({
      ...item,
      processed: expensiveOperation(item)
    }));
  }, [items]);

  return (
    <ul>
      {processedData.map(item => (
        <li key={item.id}>{item.processed}</li>
      ))}
    </ul>
  );
};
```

### 8.3. 样式处理

```jsx
// CSS-in-JS
const StyledButton = ({ primary, children }) => (
  <button
    style={{
      backgroundColor: primary ? 'blue' : 'gray',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px'
    }}
  >
    {children}
  </button>
);

// 使用 className
const Button = ({ type, children }) => (
  <button className={`btn btn-${type}`}>
    {children}
  </button>
);
```

## 9. 无状态组件的主要缺陷

1. 无法使用生命周期方法
2. 不能维护内部状态
3. 难以实现复杂交互逻辑
4. 性能优化受限
5. Refs 使用受限
6. 缺少实例方法，比如无法像 class 那样调用方法

但是**通过 React Hooks，这些问题大多可以得到解决**，而且能够保持代码的简洁性和函数式编程的优势。

在现代 React 开发中，推荐使用**函数组件 + Hooks 的组合**来构建应用。
