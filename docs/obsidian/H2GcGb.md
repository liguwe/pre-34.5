# 寻找峰值：峰值元素是指其值严格大于左右相邻值的元素

>  [162. 寻找峰值](https://leetcode.cn/problems/find-peak-element/)

## 1. 题目

- 相邻元素不相等：`nums[i] ≠ nums[i + 1]`
- **峰值元素**是指其值严格大于左右相邻值的元素

## 2. 方法有：二分查找

> 这是二分查找的一个很好的应用，它不是传统的查找具体值，而是**通过比较趋势来缩小搜索范围**


```javascript
var findPeakElement = function (nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 如果中间元素小于右边元素，峰值在右边
    if (nums[mid] < nums[mid + 1]) {
      left = mid + 1;
    } else {
      // 如果中间元素大于右边元素，峰值在左边（包括mid）
      right = mid;
    }
  }
  return left; // 或者返回right，因为循环结束时left==right
};

```

## 3. 方法二：遍历一遍，**找第一个下降点**

```javascript
var findPeakElement = function (nums) {
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      return i;
    }
  }
  return nums.length - 1;
};
```

分析：
1. 如果数组是**单调递增**的，最后一个元素就是峰值
2. 如果数组是**单调递减**的，第一个元素就是峰值
3. 如果数组有**波动**：
    - 在**第一个下降点**处，前一个元素就是**峰值**
    - 我们的代码正是在找这个下降点
