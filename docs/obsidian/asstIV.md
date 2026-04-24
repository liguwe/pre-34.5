# 根据传入的值  n，生成所有小于 n 的二进制

`#二叉树` 

## 1. 分析：转化成`多叉树遍历`问题

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/e80454be7e5ee8b8f530f525cf64a6c9.png)

- 二进制，就是`二叉树` 嘛
- 十进制，就是 `十叉树` 嘛
- 这其实是一个`回溯算法` ，所以前后序位置，放到 `for 循环` 里面
    - 然后，在前后序位置，做`选择`或者`撤销选择`

## 2. 代码：使用`回溯算法框架`实现

```javascript
function generateBinaray(n) {
    const res = [];
    const path = [];
    function backtrack(n) {
        if (n === 0) {
            res.push(path.join(""));
            return;
        }
        // 二进制，所以这里是 0 和 1， 即 i < 2 即可
        for (let i = 0; i < 2; i++) {
            // 选择
            path.push(i);
            backtrack(n - 1);
            // 取消选择
            path.pop();
        }
    }
    backtrack(n);
    console.log(res);
    return res;
}
generateBinaray(3);
generateBinaray(10);
```

- 满足条件时，**一定要深拷贝，一定要深拷贝，一定要深拷贝**
- 需要**生成其他进制的数**，更改 `for 循环`的里的数即可，即`多叉数` **对应 `多少进制`
    - `二进制` 对应 `2 叉树` 
    - `十进制` 对应 `10 叉树` 
    - `八进制` 对应 `8 叉树`
- 输入的别太大，否则很容易`爆了`
