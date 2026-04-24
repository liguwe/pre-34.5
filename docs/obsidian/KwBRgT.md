# React 组件间通信

`#react` 

## 1. 总结

- Props 传递（父子组件通信）
- React.createContext
- 状态管理库
- 事件总线
	- 比如 eventBus
- 使用 `useRef` 和 `forwardRef` 实现父组件对子组件的直接访问
- URL 参数
- strage
- hooks 组合

## 2. Props 传递（父子组件通信）

最基本也是最常用的通信方式：

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleChildClick = (value) => {
    console.log('从子组件收到：', value);
  };

  return (
    <Child 
      count={count} 
      onIncrement={() => setCount(count + 1)}
      onChildClick={handleChildClick}
    />
  );
}

// 子组件
function Child({ count, onIncrement, onChildClick }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>增加</button>
      <button onClick={() => onChildClick('hello')}>向父组件发送数据</button>
    </div>
  );
}
```

## 3. Context（跨层级组件通信）

适用于需要在组件树中共享数据的场景：

```jsx
// 创建 Context
const ThemeContext = React.createContext('light');

// 提供者组件
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="app">
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

// 消费者组件（使用 useContext Hook）
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// 或使用 Consumer 组件
function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {({ theme, setTheme }) => (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Current theme: {theme}
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```

## 4. 状态管理库（全局状态管理）

使用 Redux、MobX 或 Zustand 等状态管理库：

```jsx
// Redux 示例
// store.js
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 }
  }
});

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// App.js
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Counter.js
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <span>{count}</span>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

## 5. 自定义事件（发布-订阅模式）

适用于非父子组件间的通信：

```jsx
// eventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName]
        .filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus();

// ComponentA.js
function ComponentA() {
  const sendMessage = () => {
    eventBus.emit('message', 'Hello from A!');
  };

  return <button onClick={sendMessage}>Send Message</button>;
}

// ComponentB.js
function ComponentB() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMessage = (msg) => setMessage(msg);
    eventBus.on('message', handleMessage);
    
    return () => eventBus.off('message', handleMessage);
  }, []);

  return <div>Received: {message}</div>;
}
```

## 6. Refs 传递（父组件访问子组件）

使用 `useRef` 和 `forwardRef` 实现父组件对子组件的直接访问：

```jsx
// 子组件
const ChildComponent = forwardRef((props, ref) => {
  const childMethod = () => {
    console.log('Child method called');
  };

  useImperativeHandle(ref, () => ({
    childMethod
  }));

  return <div>Child Component</div>;
});

// 父组件
function ParentComponent() {
  const childRef = useRef();

  const handleClick = () => {
    childRef.current.childMethod();
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleClick}>Call Child Method</button>
    </div>
  );
}
```

## 7. URL 参数（路由通信）

通过 URL 参数在组件间传递数据：

```jsx
// 使用 React Router
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// 发送组件
function ComponentA() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/component-b/123?name=test');
  };

  return <button onClick={handleClick}>Go to B</button>;
}

// 接收组件
function ComponentB() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  return (
    <div>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
    </div>
  );
}
```

## 8. localStorage/sessionStorage

通过浏览器存储实现组件通信：

```jsx
// ComponentA
function ComponentA() {
  const saveData = () => {
    localStorage.setItem('sharedData', JSON.stringify({ message: 'Hello!' }));
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('storage-update'));
  };

  return <button onClick={saveData}>Save Data</button>;
}

// ComponentB
function ComponentB() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const handleStorage = () => {
      const storedData = localStorage.getItem('sharedData');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };

    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  return <div>Stored Message: {data?.message}</div>;
}
```

## 9. 组合组件（Compound Components）

通过组件组合模式实现组件间通信：

```jsx
// 创建 Context
const TabContext = React.createContext();

// 父组件
function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <TabContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
}

// 子组件
function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabContext);
  
  return (
    <button
      className={activeIndex === index ? 'active' : ''}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { activeIndex } = useContext(TabContext);
  
  if (activeIndex !== index) return null;
  return <div className="tab-panel">{children}</div>;
}

// 使用示例
function App() {
  return (
    <Tabs>
      <TabList>
        <Tab index={0}>Tab 1</Tab>
        <Tab index={1}>Tab 2</Tab>
      </TabList>
      <TabPanel index={0}>Content 1</TabPanel>
      <TabPanel index={1}>Content 2</TabPanel>
    </Tabs>
  );
}
```
