# 区域和检索 - 数组不可变

`#算法/前缀和` 

> [303. 区域和检索 - 数组不可变](https://leetcode.cn/problems/range-sum-query-immutable/)


```javascript
var NumArray = function (nums) {
    let n = nums.length;
    let preSum = new Array(n + 1).fill(0);
    preSum[0] = 0;
    for (let i = 1; i < preSum.length; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    this.preSum = preSum;
};
NumArray.prototype.sumRange = function (left, right) {
    return this.preSum[right + 1] - this.preSum[left];
};

```
