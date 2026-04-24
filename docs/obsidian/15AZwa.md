# 优先级队列：入队函数最简易实现（sort）

`#优先级队列` 

>  当一些算法依赖于优先级队列时，先别管最佳实现，用`sort`实现最建议的入队函数

## 1. 代码

```javascript
let pq = [];
function enqueue(item) {
  if (!item) return;
  pq.push(item);

  pq.sort((a, b) => {
    return a - b;
  });
  console.log(pq);
}
enqueue(1);
enqueue(10);
enqueue(12);
enqueue(10);
pq.shift();
enqueue(5);
```

## 2. 注意事项

> [!abstract]
> - 上面 item 为**数组**，如果 item 为一个**对象**时，需要同步修改 sort 的回调
> - 每次**入队**
> 	- 每次 `push` 时**一定要判断是否为空**
> - 命名都使用 `pq`
> - 出队：直接 `pq.shift()` 即可
