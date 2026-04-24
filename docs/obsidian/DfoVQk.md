# 判断一个数是否是素数

`#数学运算`

## 思路1

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/d7bf6e3d5cb1498ea2adc78b638d0332.png)

### 另外一个思路

- 首先从 2 开始，我们知道 2 是一个素数，那么 `2 × 2 = 4, 3 × 2 = 6, 4 × 2 = 8… `都不可能是素数了。
- 然后我们发现 3 也是素数，那么 `3 × 2 = 6, 3 × 3 = 9, 3 × 4 = 12… `也都不可能是素数了。

所以，找一个输在`primes=[] 、primes.flll(true) ` ，填充`prime` ，最后返回为`true`的个数

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/51f8b821cec36334861176bf701e8743.png)
