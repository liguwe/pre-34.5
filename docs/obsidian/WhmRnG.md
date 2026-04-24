# 常见自定义 Hooks

`#react` 

## 1. 总结

- [ ] check 常见编程题

## 2. useRequest：模拟请求

```javascript
import { useState, useEffect } from "react";

const useRequest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response");
        }
        const result = await res.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// 使用
const MyComponent = () => {
  const { data, loading, error } = useRequest("https://localhost:3000/api");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Data fetched:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

```

> 比较成熟的请求 hooks：[swr](https://swr.vercel.app/)

## 3. useSetState：管理 object 类型的 state 的 Hooks

```javascript
import { useState } from "react";

const useSetState = (initialState) => {
  const [state, setState] = useState(initialState);

  const setMergeState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return [state, setMergeState];
};

```

## 4. useDidMount：类似于类组件中的 `componentDidMount`，用于组件挂载后的操作

```javascript hl:12,6
import { useEffect } from "react";

const useDidMount = (callback) => {
  useEffect(() => {
    callback();
    // 空数组：表示只在组件挂载时执行一次
  }, []);
};

// 使用
const MyComponent = () => {
  useDidMount(() => {
    console.log("Component has mounted!");
  });

  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

```

## 5. useUnmount：类似于类组件中的 `componentWillUnmount`，用于组件卸载时的操作

```javascript hl:19
import { useEffect } from "react";

// 定义：组件卸载时执行回调
// 参数：callback 回调函数，组件卸载时执行
// 原理：useEffect 第一个参数是一个函数，返回一个函数，当组件卸载时执行返回的函数
const useUnmount = (callback) => {
  useEffect(() => {
    // 没其他逻辑，如果有，会在组件刚挂载时执行
    // 但是这里我们只关心组件卸载时执行
    // 清理函数
    return () => {
      callback();
    };
  }, []);
};

// 使用
const MyComponent = () => {
  useUnmount(() => {
    console.log("Component has unmount!");
  });

  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

```

## 6. useDebounce：用于处理输入框内容的防抖处理，避免频繁触发请求

```javascript hl:16
import { useState, useEffect } from "react";

const useDebounce = (stateValue, wait) => {
  const [val, setVal] = useState(stateValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVal(stateValue);
    }, wait);

    // 清除定时器
    return () => {
      clearTimeout(timer);
    };
    // 这里依赖 stateValue，当 stateValue 变化时，重新设置定时器
    // 所以不需要像 lodash.debounce 那样，每次都重新创建一个新的函数
  }, [stateValue, wait]);

  return val;
};

const MyComponent = () => {
  const [value, setValue] = useState < string > "";
  const debouncedValue = useDebounce(value, 500);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Typed value"
        style={{ width: 280 }}
      />
      <p style={{ marginTop: 16 }}>DebouncedValue: {debouncedValue}</p>
    </div>
  );
};

```

## 7. useThrottle：用于限制某个函数的调用频率

```javascript 
import { useState, useEffect } from "react";

// 方案一：防抖值
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 方案二：防抖函数
function useDebounceFn(fn, delay = 500) {
  const [timer, setTimer] = useState(null);

  const debouncedFn = (...args) => {
    // 如果有定时器，清除定时器
    if (timer) clearTimeout(timer);

    // 设置定时器
    setTimer(
      setTimeout(() => {
        fn(...args);
      }, delay),
    );
  };

  return debouncedFn;
}

// 使用示例
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  // 使用防抖值
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 使用防抖函数
  const handleSearch = useDebounceFn((value) => {
    console.log("Searching for:", value);
  }, 500);

  return (
    <div>
      {/* 方案一：使用防抖值 */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="使用防抖值..."
      />
      <p>防抖后的值: {debouncedSearchTerm}</p>

      {/* 方案二：使用防抖函数 */}
      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="使用防抖函数..."
      />
    </div>
  );
}

```

## 8. useLocalStorage：便捷地使用 `localStorage` 存储数据

```javascript
import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.log(error)
            return initialValue
        }
    })
    
    const SetValue = (value) => {
        try {
            const valueToStore = 
                  value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
      		window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error)
        }
    }
    
    return [storedValue, setValue]
}
```

> 需要JSON 解析或者序列化

## 9. useEventListener：用于简化事件监听器的添加和清理

```javascript hl:4,22
import { useEffect , useRef } from 'react';

const useEventListener = (eventName, handler, element = window) => {
    const savedHandle = useRef()
    
    useEffect(() => {
        savedHandle.current = handle
    }, [handle])
    
    useEffect(() => {
        const isSupported = element && element.addEventListener
        if (!isSupported) return;
        
        const eventListener = event => savedHandle.current(event)
        
       	element.addEventListener(eventName, eventListener);
        
     	// 清理函数，卸载时移除事件监听器
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element])
}

const MyComponent = () => {
  const handleScroll = () => {
    console.log('Scrolled!', window.scrollY);
  };

  useEventListener('scroll', handleScroll); // 添加滚动事件监听

  return (
    <div style={{ height: '2000px', background: 'linear-gradient(#fff, `#000)'` }}>
      <h1>Scroll down to see event listener in action!</h1>
    </div>
  );
};
```

## 10. useScroll：用于监测滚动位置的变化

```javascript
import { useEffect, useState } from 'react';

/**
 * 自定义 Hook，用于获取当前的滚动位置
 */
const useScroll = () => {
  const [scrollPosition, setScrollPosition] = useState({ 
    scrollX: window.scrollX, 
    scrollY: window.scrollY 
  });

  const handleScroll = () => {
    setScrollPosition({ 
      scrollX: window.scrollX, 
      scrollY: window.scrollY 
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
};

// 使用
const MyComponent = () => {
  const { scrollX, scrollY } = useScroll(); // 使用自定义的滚动 Hook

  return (
    <div style={{ height: '2000px', background: 'linear-gradient(#fff, `#000)'` }}>
      <h1>Scroll to see scroll position!</h1>
      <p>Scroll X: {scrollX}</p>
      <p>Scroll Y: {scrollY}</p>
    </div>
  );
};
```

## 11. 更多：阿里 ahooks

https://ahooks.js.org/zh-CN/hooks/use-request/index
