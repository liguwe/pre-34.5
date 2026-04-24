# 和等于 k 的最长子数组长度

>  [325. 和等于 k 的最长子数组长度](https://leetcode.cn/problems/maximum-size-subarray-sum-equals-k/)

## 1. 总结

- 寻找 `i, j` 使得 `preSum[j] - preSum[i] == k` 且 `j - i` 尽可能的大
- 使用 `mapping` 记录前缀和**第一次出现的索引**
- 错误记录
	- 构建 maping 这里应该用`preSum[i]`而不是`nums[i]`
	- 不需要`+1`，因为前缀和下标差就是长度

## 2. 代码

```javascript
var maxSubArrayLen = function (nums, k) {
    let n = nums.length;
    // ① 构造前缀和
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    // ② 构造前缀和首次出现的位置
    let mapping = new Map();
    for (let i = 0; i < n + 1; i++) {
        let val = preSum[i];
        // 只记录前缀和首次出现的位置
        if (!mapping.has(val)) {
            mapping.set(val, i);
        }
    }
    // ③ 计算和等于 k 的最长子数组长度
    let res = 0;
    for (let j = 1; j < n + 1; j++) {
        // target 相等于  preSum[i]
        let target = preSum[j] - k;
        if (mapping.has(target)) {
            let i = mapping.get(target);
            res = Math.max(res, j - i);
        }
    }
    return res;
};
```

## 3. 错误记录：

找到了几个关键错误，保持你的思路，主要修改以下几点：

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxSubArrayLen = function (nums, k) {
    let n = nums.length;
    // ① 构造前缀和
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    
    // ② 构造前缀和首次出现的位置
    let mapping = new Map();
    // 初始化前缀和 0 的位置为 0
    mapping.set(0, 0);
    for (let i = 1; i < n + 1; i++) {
        let val = preSum[i];  // 错误1：这里应该用preSum[i]而不是nums[i]
        // 只记录前缀和首次出现的位置
        if (!mapping.has(val)) {
            mapping.set(val, i);
        }
    }

    // ③ 计算和等于 k 的最长子数组长度
    let res = 0;
    for (let j = 1; j < n + 1; j++) {
        let target = preSum[j] - k;
        if (mapping.has(target)) {
            let i = mapping.get(target);
            res = Math.max(res, j - i);  // 错误2：不需要+1，因为前缀和下标差就是长度
        }
    }

    return res;
};
```


1. **在构造mapping时使用了错误的值**：
   ```javascript
   // 错误
   let val = nums[i];
   // 正确
   let val = preSum[i];
   ```
   应该记录前缀和的值，而不是原数组的值。

2. **计算长度时多加了1**：
   ```javascript
   // 错误
   res = Math.max(res, j - i + 1);
   // 正确
   res = Math.max(res, j - i);
   ```
   因为使用前缀和，两个位置的差就直接是长度，不需要+1。

3. **缺少初始化前缀和0的位置**：
   ```javascript
   // 需要添加
   mapping.set(0, 0);
   ```
   这对于处理从数组开始位置的子数组很重要。
