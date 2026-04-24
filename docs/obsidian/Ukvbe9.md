# useEffect

`#react` 

## 1. 总结

- 依赖数组
	- 不传，每次渲染都执行
	- 空数组，仅在挂载时执行
	- 正常传，仅在变化时执行
- 执行顺序说明：正常顺序是**渲染后再执行副作用函数**
	- **挂载时**：
		1. 渲染组件
		2. 执行 effect 
			- 组件渲染后才会执行 `useEffect`
			- 和 `useLayoutEffect` 有区别
	- **更新时**：
		1. 渲染组件
		2. 执行上一次的**清理函数**
		3. 执行新的 `effect`
	- **卸载时**：
		1. 执行清理函数
		2. 移除组件

## 2. 基本概念

`useEffect` 是 React 中用于处理副作用的 Hook。`副作用`包括：
- 数据获取（API 调用）
- 订阅
- DOM 手动修改
	- 修改标题
- 事件监听
- 定时器
- 日志记录等

## 3. 基本语法

```jsx hl:5
useEffect(() => {
  // 副作用代码
  
  return () => {
    // 清理函数
  };
  
}, [dependencies]);
```

## 4. 示例

通过几个具体的例子来说明 `useEffect` 的不同使用场景：

1. 基础效果：每次 count 改变时执行
2. 模拟数据获取
3. 事件监听器示例
4. 定时器示例

````jsx hl:9,30,44,56,9,15,32,46
import React, { useState, useEffect } from "react";

const EffectExamples = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [timer, setTimer] = useState(0);

  // 1. 基础效果：每次 count 改变时执行
  useEffect(() => {
    console.log("Count changed:", count);
    document.title = `Count is ${count}`;
  }, [count]);

  // 2. 模拟数据获取
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟 API 调用
        const response = await new Promise((resolve) =>
          setTimeout(() => resolve({ data: "模拟数据" }), 1000),
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 3. 事件监听器示例
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 空依赖数组，但包含清理函数，只在组件挂载时执行一次

  // 4. 定时器示例
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, []); // 空依赖数组，但包含清理函数，只在组件挂载时执行一次

  return (
    <div className="p-4 space-y-4">
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">计数器效果</h2>
        <p>当前计数: {count}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCount((c) => c + 1)}
        >
          增加计数
        </button>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">数据获取效果</h2>
        <p>获取的数据: {data || "加载中..."}</p>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">窗口大小监听</h2>
        <p>当前窗口宽度: {windowWidth}px</p>
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">定时器效果</h2>
        <p>计时器: {timer}秒</p>
      </div>
    </div>
  );
};
export default EffectExamples;
````

## 5. 依赖数组的使用规则

### 5.1. **空依赖数组 `[]`**

- 效果**只在组件挂载时执行一次**

   ```jsx
useEffect(() => {
 console.log('组件挂载');
}, []);
   ```

### 5.2. **有依赖的数组 `[dep1, dep2]`**

- 当依赖项改变时执行
   ```jsx
useEffect(() => {
	console.log('依赖项改变');
}, [dep1, dep2]);
   ```

#### 5.2.1. **没有依赖数组**

- **每次渲染都执行**

```jsx
useEffect(() => {
	console.log('每次渲染');
});
```

## 6. 清理函数（Cleanup）

useEffect 的清理函数（Cleanup Function）有几个重要的执行时机，让我通过具体示例来详细说明：

### 6.1. **组件卸载时**

```jsx
useEffect(() => {
  console.log('组件挂载');
  return () => {
    console.log('组件卸载时执行清理'); // 当组件被移除时执行
  };
}, []);
```

- 当组件被完全从 DOM 中移除时执行
- 适用于清理订阅、定时器等持久性的副作用

### 6.2. **依赖项变化时**

```jsx
useEffect(() => {
  console.log(`count 值: ${count}`);
  return () => {
    // 在下一次 effect 执行前，会先执行上一次的清理函数
    console.log(`清理 count 旧值: ${count}`);
  };
}, [count]);
```

执行顺序：

1. 首次渲染：
	1. 执行 effect
2. count 更新时：
   - **先执行**上一次的清理函数
   - 然后执行新的 effect

> 和 Vue 的 watch 是不是很像
> 这样能够规避**竞态问题**

### 6.3. **每次重新渲染时**

```jsx
useEffect(() => {
  console.log('渲染后执行');
  return () => {
    console.log('下一次渲染前执行清理');
  };
}); // 没有依赖数组，每次都重新渲染
```

- **每次组件重新渲染都会触发**
- **清理函数在下一次渲染前执行**

### 6.4. **常见的清理场景**

#### 6.4.1. **清理定时器**

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    // 定时器逻辑
  }, 1000);

  return () => {
    // 防止内存泄漏
    clearInterval(timer); 
  };
}, []);
```

#### 6.4.2. **取消事件监听**

```jsx
useEffect(() => {
  const handleScroll = () => {
    // 滚动处理逻辑
  };
  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

#### 6.4.3. **取消订阅**

```jsx
useEffect(() => {
  const subscription = someService.subscribe();
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 6.5. **执行顺序的重要说明**

- **挂载时**：
	  1. 渲染组件
	  2. 执行 effect 
	  	  - 组件渲染后才会执行 `useEffect`
	  	  - 和 `useLayoutEffect` 有区别）
- **更新时**：
	  1. 渲染组件
	  2. 执行上一次的**清理函数**
	  3. 执行新的 `effect`
- **卸载时**：
	  1. 执行清理函数
	  2. 移除组件

## 7. 常见陷阱和注意事项

### 7.1. **闭包陷阱**

```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const timer = setInterval(() => {
    // 这里的 count 永远是初始值 0
    // 这里的 count 会被"闭包"捕获
    console.log(count);
  }, 1000);

  return () => clearInterval(timer);
}, []); 

// 即使后续 count 更新到 1, 2, 3... 
// 定时器中的闭包仍然引用着最初的 count 值
```

#### 7.1.1. 解决方案1：添加 `count` 作为依赖

```javascript hl:7
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count); // 现在会正确输出最新的 count
  }, 1000);

  return () => clearInterval(timer);
}, [count]); // 添加 count 作为依赖

```

#### 7.1.2. 解决方案 2：使用`函数更新形式`

```javascript hl:3
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1); // 使用函数式更新，不需要依赖 count
  }, 1000);

  return () => clearInterval(timer);
}, []); // 空依赖数组是安全的

```

#### 7.1.3. 解决方案 3：使用 `useRef` 

```javascript hl:1,9
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count; // 更新 ref
}, [count]);

useEffect(() => {
  const timer = setInterval(() => {
    console.log(countRef.current); // 总是能获取最新值
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

### 7.2. **清理函数的返回值**

```jsx hl:2,6
useEffect(() => {
  // 清理函数必须返回 undefined
  return () => {
    // 清理逻辑
  };
  // 不要返回其他值
}, []);
```

### 7.3. **异步清理函数**

```jsx hl:2,9
useEffect(() => {
  // 清理函数不能是异步的
  return () => {
    // 这是正确的
    cleanup();
  };

  // 这是错误的
  // return async () => {
  //   await cleanup();
  // };
}, []);
```

### 7.4. **无限循环**

```jsx
// 错误示例
useEffect(() => {
  setCount(count + 1); // 这会导致无限循环
}, [count]);
```

### 7.5. **竞态条件**

> 见下面

### 7.6. **依赖项处理**

需要**包含所有使用的外部变量**，如下：

```jsx
// 正确的依赖项处理
useEffect(() => {
  const handler = (e) => {
    if (e.key === 'Enter') {
      callback();
    }
  };
  
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [callback]); // 包含所有使用的外部变量
```

## 8. 使用场景总结

- **数据获取**
	- API 调用
	- 数据订阅
- **DOM 操作**
	- 修改标题
	- 管理焦点
	- 操作 canvas
- **订阅/监听**
	- 事件监听
	- WebSocket 连接
	- 第三方库订阅
- **定时任务**
	- 定时器
	- 轮询
- **与其他系统集成**
	- 第三方库初始化
	- 外部系统同步

## 9. useEffect 中的竞态条件（Race Condition）问题

竞态条件是指当多个异步操作的结果以不可预测的顺序返回时可能导致的问题。

### 9.1. **问题场景**

```jsx
// 有问题的代码
useEffect(() => {
  const fetchData = async () => {
    const data = await fetchUserData(userId);
    setUserData(data); // 可能设置错误的数据
  };
  fetchData();
}, [userId]);
```

问题在于：
- 用户`快速切换 userId`（比如连续点击按钮）
- 多个请求被发出，但返回顺序不确定
- 可能后发出的请求先返回，而先发出的请求后返回
- 导致显示的是旧的请求结果，而不是最新的

### 9.2. **基本解决方案**

```jsx
useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const data = await fetchUserData(userId);
    if (isMounted) {
      setUserData(data);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, [userId]);
```

这个方案：

- 使用 `isMounted` 标志追踪组件是否仍然挂载
- 在设置状态前检查组件是否仍然挂载
- 在`清理函数`中将标志设为 `false`

### 9.3. **最佳实践方案（使用 AbortController）**

```jsx hl:20
useEffect(() => {

  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const data = await fetchUserData(userId);
      if (!abortController.signal.aborted) {
        setUserData(data);
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        setError(error);
      }
    }
  };

  fetchData();

  return () => {
    abortController.abort();
  };
}, [userId]);
```

这个方案的优点：
- 可以**真正取消进行中**的请求
- 更好的错误处理
- 更完整的状态管理（`loading`、`error` 状态）

### 9.4. **其他解决方案**

#### 9.4.1. 使用防抖/节流

```jsx
import { debounce } from 'lodash';
useEffect(() => {
  const debouncedFetch = debounce(async () => {
    const data = await fetchUserData(userId);
    setUserData(data);
  }, 300);
  debouncedFetch();
  return () => {
    debouncedFetch.cancel();
  };
}, [userId]);
```

#### 9.4.2. 使用数据获取库：useQuery

```jsx
// 使用 React Query
const { data, isLoading } = useQuery(
  ['user', userId],
  () => fetchUserData(userId)
);
```

### 9.5. **最佳实践建议**

- 始终实现清理函数
- **始终返回清理函数来防止内存泄漏**
- 确保清理函数清理了所有副作用
- 在开发时使用 **React DevTools** 检查是否有遗漏的清理
- 使用 `ESLint` 的 `exhaustive-deps 规则`确保依赖项正确
- 测试组件的挂载、更新和卸载场景
- 考虑使用 `AbortController` 取消请求
- 适当的错误处理
- 考虑使用专门的数据获取库（如 `React Query, SWR`）
- 实现加载状态和错误状态
- 考虑使用`防抖/节流`来限制请求频率
