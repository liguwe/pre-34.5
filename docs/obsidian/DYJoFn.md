# 连续数组

>  [525. 连续数组](https://leetcode.cn/problems/contiguous-array/)


给定一个二进制数组 `nums` , 找到含有相同数量的 `0` 和 `1` 的最长连续子数组，并返回该子数组的长度。

如果我们把 `0` 视作 `-1`，就把题目转变成了：**寻找和为 0 的最长子数组**



- 使用`前缀和`来计算`累积和`
- 用`哈希表`记录每个前缀和第一次出现的位置
- **当遇到相同的前缀和时（或者说这个前缀和之前出现过了），说明这两个位置之间的子数组和为 0**


- 注意点：
	- mapping 使用 Map，使用对象判断是否存在值了，**不好排除为 0 的场景**

```javascript
var findMaxLength = function (nums) {
    let n = nums.length;
    let preSum = new Array(n + 1).fill(0);
    // 计算 nums 的前缀和 →  转换为 寻找和为 0 的最长子数组
    for (let i = 0; i < n; i++) {
        preSum[i + 1] = preSum[i] + (nums[i] === 0 ? -1 : 1);
    }
    let res = 0;

    // key 为 preSum item，val 为 index
    let mapping = new Map();
    for (let i = 0; i < preSum.length; i++) {
        let item = preSum[i];
        // 如果这个前缀和之前出现过，说明找到了一个连续数组
        // 因为这两个位置之间的子数组和为 0
        if (mapping.has(item)) {
            res = Math.max(res, i - mapping.get(item));
            // 这个前缀和第一次出现
        } else {
            mapping.set(item, i);
        }
    }

    return res;
};

```
