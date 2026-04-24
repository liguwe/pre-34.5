# 为什么要用 setTimeout 模拟 setInterval ？

`#2023/03/20` `#前端` 

## 1. 先说说 `setInterval` 的问题

`setInterval(fn, N)`;  
- 即`fn()` 将会在 `N` 秒之后被推入`任务队列`
- 但每次推之前，都要判断看`上次的任务是否还在队列中`，
	- 如果在，则不添加。所以 `setInterval` 有两个`缺点`：
		- 使用 `setInterval` 时，某些间隔会`被跳过`；
		- 甚至可能多个定时器会`连续执行` ，即刚好在两个队列的缝隙时，会`连续执行`

## 2. 再看看 `setTimeout`

一个经典案例：

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

为什么是`一秒后输出了 5 个 5` 呢？ 
- `for` 是`主线程代码`，先执行完了，才轮到执行 `setTimeout`
- 每个 `setTimeout` 产生的新的任务会直接 `push` 到`任务队列`中。

而且它是`一次性`的，或者换个思路，`setInterval` 循环执行，链路长，不好控制，而 `setTimeout` 只是延时`一次` ，方便控制。

## 3. 使用 `setTimeout` 来模拟 `setInterval`

```javascript
function mySetInterval(fn, timeout) {
    // 关键，标识是否继续,并返回
    let timer = {
        flag: true
    }
    // 两次 settimeout，需要闭包定义一个函数
    function func() {
        if (timer.flag) {
            fn();
            setTimeout(func, timeout);
        }
    }
    setTimeout(func, timeout);
    return timer;
}

// 测试
const timer = mySetInterval(() => {
    console.log('log 1');
},1000)

// 5s后，停止定时器
setTimeout(() => {
    timer.flag = false;
},5000)

```

> [!danger]
 手写这种代码时，`套路` 就是 函数 里 再定义一个函数，形成`闭包`，另外需要`返回 定时标识`，另外一定会有递归，比如这里的 `func` 

## 4. 最后

再次强调，定时器指定的`时间间隔`，表示的是 `何时将定时器的代码添加到消息队列`，而`不是何时执行代码`。 所以真正何时执行代码的时间是不能保证的，取决于`何时被主线程的事件循环取到，并执行`.

W3C在HTML标准中规定，规定要求 `setTimeout` 中低于`4ms`的时间间隔算为`4ms`。

## 5. 参考

- [https://juejin.cn/post/6914201197620494350](https://juejin.cn/post/6914201197620494350)
