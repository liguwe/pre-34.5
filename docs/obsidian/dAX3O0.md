# 子数组最大平均数 I

`#leetcode` `#算法/滑动窗口` 

## 题目及理解

![image.png|608](https://832-1310531898.cos.ap-beijing.myqcloud.com/400755e6e2354c1f2047b7ed1977227b.png)

> **注意：返回的是最大平均树**

## 解题思路

### 解法一：滑动窗口，看下面几张图

![image.png|520](https://832-1310531898.cos.ap-beijing.myqcloud.com/d519707b0a58722271e07e52f00ca916.png)

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/67925ec639e4c341ddabdba40ca16863.png)

![image.png|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/c0a15fa222bab11b280369e83f570392.png)

### 解法二：前缀和

> 不展开了

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function (nums, k) {
  // sum 用于记录滑动窗口中的元素之和
  let sum = 0;
  // 前 k 个元素之和，即滑动窗口的初始值，即【滑动窗口】的前 k 个元素之和
  // 初始化 sum，代表【滑动窗口】的前 k 个元素之和
  for (let i = 0; i < k; i++) {
    sum += nums[i];
  }

  // max 用于记录滑动窗口中元素之和的最大值
  let max = sum;

  // 开始滑动窗口，从 k 开始，每次移动一位，动态维护 sum 和 max 的值
  // 遍历数组，从 k 开始
  for (let i = k; i < nums.length; i++) {
    // 滑动窗口，每次移动一位
    sum = sum + nums[i] - nums[i - k];
    // 比较 sum 和 max 的大小，取最大值
    max = Math.max(max, sum);
  }

  // 最后返回 max / k，即最大平均值
  return max / k;
};

```

### 复杂度分析

- 时间复杂度：`O(n)`，其中 n 是数组的长度。我们只遍历了一次数组。 
- 空间复杂度：`O(1)`，我们只使用了常数额外空间。

## 错误记录
