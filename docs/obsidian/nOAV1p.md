# 实现批量请求并支持控制最大并发数

`#前端` 

## 1. 最简易实现：promise + finally

- 请求队列
- 支持批量请求
- 支持取消

```javascript hl:22,19,26
function request(url) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(url), 1000);
    });
}

/**
 * @desc
 * @param urls 请求的URL数组
 * @param maxNum 并发数
 * */
function multiRequest(urls = [], maxNum) {
    const total = urls.length
    const result = new Array(total).fill(false);
    let count = 0 // 进行到第几个
    let cancel = null;
    let promise = new Promise((resolve, reject) => {
        // 关键，如何调用cancel直接取消
        cancel = () => reject('cancel');
        // 注意，这是第一次，连续添加5个并发数，然后就是 结束一个添加一个
        // 第一次，添加最大并发数目，再之后，每次finally后就添加一个，就能够保证一直是5个并发数
        while (count < maxNum) {
            // 首次就添加 5次
            next()
        }
        // 下一个请求
        function next() {
            const current = count++
            // ::::如果当前的请求已经大于 total了，那么就直接resolve结果
            if (current >= total) {
                !result.includes(false) && resolve(result)
                return
            }
            // 否则，一直请求，使用fanally
            // 或者直接使用原生fetch函数
            request(urls[current]).finally((res) => {
                result[current] = res
                if (current < total) {
                    // 这里有个递归
                    // 完了就添加一次
                    next()
                }
            })
        }
    })
    // ::::返回，方便外面可取消
    return {promise, cancel}
}

let urls = []
for (let i = 0; i < 20; i++) {
    urls.push(`https://api.github.com/search/users?q=${i}`)
}
let q = multiRequest(urls, 5);

// 可直接调用取消发请求
q.cancel()
```

## 2. 另外一种思路：`Promise.all()`和`Promise.race()`结合循环来实现

### 2.1. 先使用 setimeout 模拟请求

```javascript
/**
 * 模拟异步请求
 * @param {*} id 标识符
 * @param {*} delay 延迟时间
 */
const mockRequest = (id, delay) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`完成请求 ${id}`);
            resolve(`响应 ${id}`);
        }, delay);
    });
};
```

### 2.2. 主要逻辑

**关键点：**

- 使用 `set` 来存储任务集合
- 使用 `next` 来标识处理每一个请求逻辑，这里是**主要逻辑**
   - 每次执行完成需要从集合中 `delete` 掉
      - 失败也需要从集合中 `delete` 掉
   - 判断是否达到最大并发数
      - 达到，等待任意请求完成
         - 使用 `Promise.race` 来竞赛，完成后 `then` 继续执行 `next`
      - 没达到
         - 直接启动下个任务 `next()`

```javascript
/**
 * 批量执行请求，控制最大并发数
 * @param {Array} tasks 任务数组
 * @param {number} maxConcurrency 最大并发数
 */
async function runBatchRequests(tasks, maxConcurrency) {
    let i = 0; // 当前处理的任务索引
    const total = tasks.length;
    const executing = new Set(); // 正在执行的任务集合

    // 下一个任务 , 递归调用
    const next = () => {
        // 所有任务已经启动
        if (i === total) {
            return Promise.resolve();
        }
        const task = tasks[i++](); // 获取任务并执行
        executing.add(task);

        const clean = () => executing.delete(task);
        task.then(clean).catch(clean);

        let p = Promise.resolve();

        if (executing.size >= maxConcurrency) {
            // 达到最大并发数，等待任意任务完成
            p = Promise.race(executing).then(() => next());
        } else {
            // 未达到最大并发数，直接启动下一个任务
            p = next();
        }
        return p;
    };

    await next().then(() => Promise.all(executing)); // 确保所有任务都完成了
}
```

### 2.3. 测试

```javascript
// 示例使用
const awaitList = [1000, 500, 1000, 300, 800, 700, 900];
const tasks = awaitList.map((item, index) => () => mockRequest(index + 1, item));

runBatchRequests(tasks, 10).then(() => console.log('所有请求完成'));

```

### 2.4. 总结

- `runBatchRequests` 函数接受一个任务数组和最大并发数作为参数。每个任务都是一个返回Promise的函数。
   - 函数内部，通过**递归调用** `next 函数` 来不断地启动新的任务，直到所有任务都被处理。
   - 通过维护一个`executing集合`来跟踪当前正在执行的任务，并使用`Promise.race()`在达到最大并发限制时等待至少一个任务完成。这样可以在任何任务完成后立即启动新的任务，从而维持最大并发数，直到所有任务都完成。
