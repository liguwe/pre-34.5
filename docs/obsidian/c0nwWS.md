# React.createContext 与 useContext

`#react` 

## 1. 总结

- `React.createContext` 与 `useContext` 需要**配合使用**
	- 一个定义
	- 一个使用
	- 示例
		- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250101-1.png)
- 考虑是否真的需要 Context，有时 props 传递可能是更好的选择

## 2. 发布订阅模式

这就是一个 `发布订阅模式`

## 3. Context 的基本概念和使用场景

Context 提供了一种在组件树中共享数据的方式，无需通过 props 手动传递。主要用于：

```jsx
// 常见的使用场景
// 1. 主题切换
// 2. 用户认证状态
// 3. 语言偏好
// 4. 全局配置
```

## 4. createContext 的基本使用

```jsx
// 创建 Context
const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// 可以提供默认值
const UserContext = React.createContext(null);

// Provider 组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // value 属性传递共享值
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用 Provider 包装应用
function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
```

## 5. useContext 的使用方式

```jsx hl:3
function ChildComponent() {
  // 使用 useContext 获取上下文值
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className={`theme-${theme}`}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'}
      </button>
    </div>
  );
}
```

## 6. 高级用法和最佳实践

```jsx
// 4.1 创建自定义 Hook 封装 Context 逻辑
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 4.2 组合多个 Context
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// 4.3 使用 Context 的 Consumer 组件（类组件中）
class ClassComponent extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {value => (
          <div className={`theme-${value.theme}`}>
            <button onClick={value.toggleTheme}>
              Toggle Theme
            </button>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
```

## 7. 性能优化

```jsx
// 5.1 使用 memo 优化子组件
const MemoizedChild = React.memo(function Child() {
  console.log("Child render");
  const { theme } = useContext(ThemeContext);
  return <div>Theme: {theme}</div>;
});

// 5.2 分离 Context 值
const ThemeContext = React.createContext('light');
const ThemeUpdateContext = React.createContext(() => {});

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeUpdateContext.Provider value={toggleTheme}>
        {children}
      </ThemeUpdateContext.Provider>
    </ThemeContext.Provider>
  );
}
```

## 8. 实际应用示例

- 全局状态管理
- 多语言支持

```jsx
// 6.1 全局状态管理
const GlobalStateContext = React.createContext();

function GlobalStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// 6.2 多语言支持
const LanguageContext = React.createContext({
  language: 'en',
  translations: {},
  setLanguage: () => {}
});

function useTranslation() {
  const { language, translations } = useContext(LanguageContext);
  
  const t = useCallback((key) => {
    return translations[language]?.[key] || key;
  }, [language, translations]);
  
  return { t, language };
}
```

## 9. 常见陷阱和注意事项

```jsx
// 7.1 避免重复渲染
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // 不好的做法：每次渲染都创建新对象
  return (
    <ThemeContext.Provider value={{ theme: 'light', count }}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
  
  // 好的做法：使用 useMemo
  const value = useMemo(() => ({ theme: 'light', count }), [count]);
  return (
    <ThemeContext.Provider value={value}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
}

// 7.2 Context 嵌套过深的问题
// 不好的做法
function DeepNesting() {
  return (
    <ContextA.Provider>
      <ContextB.Provider>
        <ContextC.Provider>
          <ContextD.Provider>
            <Component />
          </ContextD.Provider>
        </ContextC.Provider>
      </ContextB.Provider>
    </ContextA.Provider>
  );
}

// 好的做法：使用组合
function CombinedProvider({ children }) {
  // 在一个组件中处理所有 context 逻辑
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}
```

### 9.1. 避免过度使用

```tsx
// 不推荐
const UserContext = React.createContext();
const ThemeContext = React.createContext();
const SettingsContext = React.createContext();

function DeepNestedComponent() {
  const user = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const settings = useContext(SettingsContext);
  // ...
}

// 推荐
const AppContext = React.createContext();

function DeepNestedComponent() {
  const { user, theme, settings } = useContext(AppContext);
  // ...
}

```

## 10. 调试技巧

```jsx
// 8.1 添加 displayName
ThemeContext.displayName = 'ThemeContext';

// 8.2 开发环境下的调试日志
function useDebugContext(context, name) {
  const value = useContext(context);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} context value:`, value);
    }
  }, [value, name]);
  return value;
}
```

## 11. 使用 Context 时的关键建议

1. 适度使用：不要为了避免 props 传递就过度使用 Context
	- 考虑是否真的需要 Context，有时 props 传递可能是更好的选择
2. 合理拆分：
	1. 将不同领域的 Context 分开，避免不必要的重渲染
3. 提供默认值：
	1. 总是为 createContext 提供合理的默认值
4. 错误处理：
	1. 在自定义 Hook 中添加必要的错误检查
5. 性能优化：
	1. 使用 memo、useMemo 和 useCallback 优化性能
6. 类型安全：
	1. 在 TypeScript 项目中，为 Context 添加适当的类型定义
