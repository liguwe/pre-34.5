# 阶乘算法题

| LeetCode                                                                                                                     | 力扣                                                                                          | 难度  |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --- |
| [793. Preimage Size of Factorial Zeroes Function](https://leetcode.com/problems/preimage-size-of-factorial-zeroes-function/) | [793. 阶乘函数后 K 个零](https://leetcode.cn/problems/preimage-size-of-factorial-zeroes-function/) | 🔴  |
| [172. Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)                                   | [172. 阶乘后的零](https://leetcode.cn/problems/factorial-trailing-zeroes/)                       | 🟠  |

## 1. 第 793 题：阶乘后的零

- 输入一个非负整数 `n`，请你计算阶乘 `n!` 的结果末尾有`几个 0` ？
	- 比如说输入 `n = 5`，算法返回 1，因为 `5! = 120`，末尾有一个 0。

### 1.1. 思路

- 肯定不可能真去把 `n!` 的结果算出来，**阶乘增长可是比指数增长都恐怖**
- 首先，两个数相乘结果末尾有 `0`，一定是因为两个数中有因子 `2` 和 `5`，因为 `10 = 2 x 5`
	- **只要是偶数就能分解除因子 `2`，所以，只需要关注能够分解除多少因子 `5`**
		- 举个例子：`5! = 1*2*3*4*5` 
			- 只有一个 5 ，但有两个偶数 2 和 4
- 所以问题转换为：**`n!` 最多可以分解出多少个因子 5**

- 首先计算n 中 5的倍数的个数：n/5
- 然后计算n中25的倍数的个数：n/25（因为25贡献了两个5）
- 然后计算n中125的倍数的个数：n/125（因为125贡献了三个5）
- 以此类推...
- 比如计算 25! 末尾有多少个0：
	- 5的倍数：25÷5 = 5个数（5,10,15,20,25）
	- 25的倍数：25÷25 = 1个数（25）
	- 最终结果：6个0
- 所以 25! 末尾有6个0，实际上25! = 15511210043330985984000000，确实末尾有6个0。

### 1.2. 代码

```javascript
var trailingZeroes = function (n) {
  // 用于存储结果（零的个数）
  let res = 0;
  // 除数，初始值为5
  let divisor = 5;

  // 从 5 开始，每次乘 5
  // 并 统计 n 中有多少个 5 的因子
  while (divisor <= n) {
    // n 除以 5 的商，即 n 中包含有多少个 5 的因子
    // n 除以 25 的商，即 n 中包含有多少个 25 的因子
    // n 除以 125 的商，即 n 中包含有多少个 125 的因子
    // ...
    res += Math.floor(n / divisor);
    divisor = divisor * 5;
  }
  return res;
};
```

## 2. 第 793 题：阶乘函数后 K 个零

- 输入一个非负整数 `K`，请你计算有多少个 `n`，满足 `n!` 的结果末尾恰好有 `K` 个 0。
	- 比如说输入 `K = 1`，算法返回 5，因为 `5!,6!,7!,8!,9!` 这 5 个阶乘的结果最后只有一个 0，即有 5 个 `n` 满足条件。

### 2.1. 思路

可以使用**二分查找**来解决，因为 **n! 末尾零的个数是单调递增的**

### 2.2. 代码

```javascript
// 可以使用**二分查找**来解决，因为 **n! 末尾零的个数是单调递增的**
var preimageSizeFZF = function (K) {
  // 左边界和右边界之差 + 1 就是答案
  return right_bound(K) - left_bound(K) + 1;
};

// 搜索 trailingZeroes(n) == K 的左侧边界
var left_bound = function (target) {
  var lo = 0,
    hi = 10 ** 10;
  while (lo < hi) {
    var mid = lo + Math.floor((hi - lo) / 2);
    if (trailingZeroes(mid) < target) {
      lo = mid + 1;
    } else if (trailingZeroes(mid) > target) {
      hi = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
};

// 搜索 trailingZeroes(n) == K 的右侧边界
var right_bound = function (target) {
  var lo = 0,
    hi = 10 ** 10;
  while (lo < hi) {
    var mid = lo + Math.floor((hi - lo) / 2);
    if (trailingZeroes(mid) < target) {
      lo = mid + 1;
    } else if (trailingZeroes(mid) > target) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo - 1;
};

var trailingZeroes = function (n) {
  // 用于存储结果（零的个数）
  let res = 0;
  // 除数，初始值为5
  let divisor = 5;

  // 从 5 开始，每次乘 5
  // 并 统计 n 中有多少个 5 的因子
  while (divisor <= n) {
    // n 除以 5 的商，即 n 中包含有多少个 5 的因子
    // n 除以 25 的商，即 n 中包含有多少个 25 的因子
    // n 除以 125 的商，即 n 中包含有多少个 125 的因子
    // ...
    res += Math.floor(n / divisor);
    divisor = divisor * 5;
  }
  return res;
};

```
