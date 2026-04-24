# 位1的个数

`#算法/位运算` 

> [191. 位1的个数](https://leetcode.cn/problems/number-of-1-bits/)

## 1. 思路一：先转成二进制字符串

```javascript
var hammingWeight = function (n) {
    let str = n.toString(2);

    let res = 0;
    for (let c of str) {
        if (c === "1") {
            res++;
        }
    }
    return res;
};
```

## 2. 思路二：`n & (n-1)` 消除二进制中最后一个 1

`n & (n-1) `这个操作是算法中常见的，作用是 `消除 n 数字的二进制表示` 中的最后一个 `1` ，见下图：

![image.png|504](https://832-1310531898.cos.ap-beijing.myqcloud.com/9e3ec3f2938022fe5b554440d3219676.png)


![image.png|584](https://832-1310531898.cos.ap-beijing.myqcloud.com/352470d4bb4ef69b30dcceb86e93b758.png)

```javascript
// 用一个循环不停地消除 1 同时计数，直到 n 变成 0 为止
var hammingWeight = function(n) {
    var res = 0;
    while (n != 0) { 
        n = n & (n - 1); 
        res++;
    }
    return res;
};
```
