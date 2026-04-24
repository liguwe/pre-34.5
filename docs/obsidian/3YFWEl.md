# React 中获取 DOM 引用的方式

`#react`  

## 1. 总结

1. 优先使用 `useRef` 和 `createRef`
2. 需要更细粒度控制时使用 `回调refs`
3. 需要**跨组件传递 ref 时**使用 `forwardRef`
4. 尽量避免使用`字符串 refs` 和 `findDOMNode`
5. 只在必要时使用 refs（如焦点管理、动画、第三方 DOM 库集成等）
6. 不要过度使用 refs 来操作 DOM，尽量通过 React 的声明式更新来管理 UI

## 2. React.createRef()

最新推荐的创建 ref 的方式：

```jsx hl:5
// 1.1 在类组件中使用
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    // 访问 DOM 节点
    console.log(this.myRef.current);
  }

  render() {
    return <div ref={this.myRef}>Hello</div>;
  }
}

// 1.2 在类组件中使用 class fields
class MyComponent extends React.Component {
  myRef = React.createRef();

  handleClick = () => {
    // 访问 DOM 节点
    this.myRef.current.focus();
  };

  render() {
    return (
      <>
        <input ref={this.myRef} />
        <button onClick={this.handleClick}>Focus Input</button>
      </>
    );
  }
}
```

## 3. useRef Hook

在函数组件中使用的 Hook 方式：

```jsx
// 2.1 基本用法
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

// 2.2 多个 ref 的使用
function MultipleRefs() {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);

  const handleClick = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <button onClick={() => handleClick(firstRef)}>Scroll to First</button>
      <button onClick={() => handleClick(secondRef)}>Scroll to Second</button>
      <button onClick={() => handleClick(thirdRef)}>Scroll to Third</button>
      
      <div ref={firstRef}>First Element</div>
      <div ref={secondRef}>Second Element</div>
      <div ref={thirdRef}>Third Element</div>
    </div>
  );
}
```

## 4. 回调 Refs（Callback Refs）

通过回调函数的方式设置 ref：

```jsx hl:1,22,15,36
// 3.1 基本用法
class CallbackRefComponent extends React.Component {
  setTextInputRef = (element) => {
    this.textInput = element;
  };

  focusTextInput = () => {
    // 直接使用 DOM API
    if (this.textInput) this.textInput.focus();
  };

  render() {
    return (
      <>
        <input type="text" ref={this.setTextInputRef} />
        <button onClick={this.focusTextInput}>Focus Input</button>
      </>
    );
  }
}

// 3.2 在函数组件中使用
function CallbackRefFunctional() {
  let textInput = null;

  const setTextInputRef = (element) => {
    textInput = element;
  };

  const focusTextInput = () => {
    if (textInput) textInput.focus();
  };

  return (
    <>
      <input ref={setTextInputRef} />
      <button onClick={focusTextInput}>Focus Input</button>
    </>
  );
}
```

## 5. forwardRef

用于**转发 refs 到子组件**：

```jsx
// 4.1 基本用法
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="fancy-button">
    {props.children}
  </button>
));

// 使用 FancyButton
function Parent() {
  const buttonRef = useRef(null);

  return <FancyButton ref={buttonRef}>Click me!</FancyButton>;
}

// 4.2 带有 HOC 的 forwardRef
const withLogger = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    useEffect(() => {
      console.log('Component mounted');
    }, []);

    return <WrappedComponent {...props} ref={ref} />;
  });
};

const LoggedButton = withLogger(FancyButton);
```

## 6. 字符串 Refs（不推荐）

旧版本的 ref 方式，现已不推荐使用：

```jsx hl:5
// 不推荐使用的字符串 ref
class LegacyComponent extends React.Component {
  componentDidMount() {
    // 不推荐
    this.refs.myInput.focus();
  }

  render() {
    return <input ref="myInput" />;
  }
}
```

## 7. findDOMNode（不推荐）

legacy API，在严格模式下会警告：

```jsx
// 不推荐使用 findDOMNode
class LegacyFindDOMNode extends React.Component {
  componentDidMount() {
    // 不推荐
    const node = ReactDOM.findDOMNode(this);
  }

  render() {
    return <div>Legacy</div>;
  }
}
```

## 8. 实际应用示例

```jsx
// 7.1 复杂表单处理
function ComplexForm() {
  const formRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null)
  };

  const validateField = (fieldName) => {
    const value = formRefs[fieldName].current.value;
    // 验证逻辑
  };

  return (
    <form>
      <input ref={formRefs.name} placeholder="Name" />
      <input ref={formRefs.email} type="email" placeholder="Email" />
      <input ref={formRefs.phone} placeholder="Phone" />
    </form>
  );
}

// 7.2 媒体播放器
function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePause = () => {
    videoRef.current.pause();
  };

  return (
    <div>
      <video ref={videoRef} src={src} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}
```
