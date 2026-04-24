# 2 的幂：判断一个数是不是 2 的指数

`#算法/位运算` 

> [231. 2 的幂](https://leetcode.cn/problems/power-of-two/)


一个数如果是 2 的指数，那么它的二进制表示**一定只含有一个 1**。

位运算 `n&(n-1)` 在算法中挺常见的，作用是消除数字 `n` 的二进制表示中的最后一个 1，用这个技巧可以判断 2 的指数


```javascript
var isPowerOfTwo = function (n) {
    if (n <= 0) return false;
    let res = n & (n - 1);
    return res === 0;
};
```




一个数如果是 `2 的指数`，那么它的二进制表示一定`只含有一个 1`

```java
2^0 = 1 = 0b0001
2^1 = 2 = 0b0010
2^2 = 4 = 0b0100
```

```javascript
一个数如果是 `2 的指数`，那么它的二进制表示一定`只含有一个 1`
var isPowerOfTwo = function(n) {
    if (n <= 0) return false; // 注意是小于等于
    return (n & (n - 1)) === 0; // 注意运算符优先级，括号不可以省略
};
```
