# 把 useDebugValue 加入你的React调试工具库

`#react` 

## 1. 总结

- useDebugValue(value, formatFn?) ：用于在 DevTools 中显示当前值
	- value: 要显示的调试值
	- formatFn: (可选) 格式化函数，用于格式化调试值

## 2. useDebugValue 基本介绍

`useDebugValue` 是一个用于在 **React DevTools** 中显示自定义 hook 标签的 Hook。它的主要目的是帮助开发者在调试时更好地理解自定义 Hook 的内部状态

### 2.1. 基本语法

```javascript
useDebugValue(value, formatFn?)
```

参数说明：

- value: 要显示的调试值
- formatFn: (可选) 格式化函数，用于格式化调试值

## 3. 使用方法

### 3.1. 基本使用

```javascript
function useCustomHook(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  // 在 DevTools 中显示当前值
  useDebugValue(value);
  
  return [value, setValue];
}

// 使用这个 hook
function MyComponent() {
  const [value, setValue] = useCustomHook('initial');
  return <div>{value}</div>;
}
```

### 3.2. 使用格式化函数

```javascript
function useUserStatus(userId) {
  const [isOnline, setIsOnline] = useState(false);
  
  useDebugValue(isOnline, (online) => 
    online ? 'Online' : 'Offline'
  );
  
  return isOnline;
}
```

### 3.3. 复杂对象的格式化

```javascript
function useDataFetching(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useDebugValue(
    { data, loading, error },
    state => ({
      status: state.loading ? 'loading' : state.error ? 'error' : 'success',
      dataLength: state.data?.length || 0,
      errorMessage: state.error?.message
    })
  );
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}
```

## 4. 实际示例：带图

```javascript
export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // useDebugValue
  useDebugValue(isOnline ? "✅ Online(useDebugValue)" : "❌ Disconnected(useDebugValue)")
  return isOnline;
}
```

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241031-1.png)
