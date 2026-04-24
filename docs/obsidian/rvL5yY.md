# AbortController

`#bom` `#浏览器` 

## 1. 简介

>  用于终止或取消一个请求、或者删除关联的事件监听器

`AbortController` 接口表示一个控制器对象，允许你根据需`要中止一个或多个 Web 请求`。

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-19.png)

## 2. 使用 

```javascript hl:9
// `AbortController` 是 JavaScript 中的一个全局类，
const controller = new AbortController();  

// 可以将它传递给要中断的 API，来响应中断事件并进行相应处理，例如，传递给 `fetch()` 方法就可以终止这个请求了
controller.signal;  
// 调用这个方法会触发 `signal` 上的中止事件，并将信号标记为已中止
controller.abort();

// 监听 abort 事件
controller.signal.addEventListener('abort', () => {  
  // 实现中止逻辑  
});
```

## 3. 不仅可以使用请求，还可以用于各类事件 → **删除关联的事件监听器**

```javascript hl:14
useEffect(() => {  
  const controller = new AbortController();  
  
  window.addEventListener('resize', handleResize, {  
    signal: controller.signal,  
  });  
  window.addEventListener('hashchange', handleHashChange, {  
    signal: controller.signal,  
  });  
  window.addEventListener('storage', handleStorageChange, {  
    signal: controller.signal,  
  });  

 // 在清理函数中，我只需调用一次 `controller.abort()` 就可以删除所有添加的监听器
  return () => {  
    // 调用 `.abort()` 会删除所有关联的事件监听器  
    controller.abort();  
  };  
}, []);
```

## 4. Node.js 中由 `http` 模块发出的请求也支持 `signal` 属性

## 5. 一个示例：终止错误原因

```javascript
async function fetchData() {
  const controller = new AbortController();
  const signal = controller.signal; // 监听 abort 事件，并打印中止原因

  signal.addEventListener("abort", () => {
    console.log("请求中止原因:", signal.reason); // 打印自定义的中止原因
  });

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1",
      { signal },
    );
    const data = await response.json();
    console.log("请求成功:", data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("请求因中止被取消:", error.message);
    } else {
      console.error("请求出错:", error.message);
    }
  } // 保存 controller 以便取消操作
  window.currentAbortController = controller;
}

fetchData(); // 监听取消按钮的点击事件

document.getElementById("cancelButton").addEventListener("click", () => {
  if (window.currentAbortController) {
    window.currentAbortController.abort("用户取消了请求"); // 提供自定义的中止原因
    console.log("点击了取消请求按钮");
  } else {
    console.log("没有正在进行的请求");
  }
});

```
