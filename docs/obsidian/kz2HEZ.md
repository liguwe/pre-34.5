# 和可被 K 整除的子数组

> [974. 和可被 K 整除的子数组](https://leetcode.cn/problems/subarray-sums-divisible-by-k/)


子数组 `nums[i..j]` 中的元素之和能被 `k` 整除，
- 就是说 `sum(nums[i..j]) % k == 0`

## 1. 解法一：会超时，但简单

>  掌握这种解法即可

说明：
- 需要注意和为负数的情况
- `j = i + 1` 而不是 `j = i`
- 下面的解法超时了

```javascript hl:13
var subarraysDivByK = function (nums, k) {
    let n = nums.length;
    // ① 构造前缀和
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    // ② 计算和可被 K 整除的子数组
    let res = 0;
    for (let i = 0; i < n + 1; i++) {
        for (let j = i + 1; j < n + 1; j++) {
            let sum = preSum[j] - preSum[i];
            // if(sum % k === 0){ // 不能处理负数的场景
            if (((sum % k) + k) % k === 0) {
                res++;
            }
        }
    }
    return res;
};
```

## 2. 解法二：同余定理

同余定理：如果两个前缀和对 k 取模结果相同，那么它们之间的子数组和一定能被 k 整除

```javascript
var subarraysDivByK = function (nums, k) {
    let n = nums.length;
    // ① 构造前缀和
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    // ② 计算和可被 K 整除的子数组
    // 用map记录每个余数出现的次数
    let map = new Map();
    let res = 0;
    // 遍历前缀和数组，统计每个余数出现的次数
    for (let sum of preSum) {
        let mod = ((sum % k) + k) % k;
        // 如果这个余数之前出现过，说明中间的子数组和能被k整除
        if (map.has(mod)) {
            res += map.get(mod);
        }
        map.set(mod, (map.get(mod) || 0) + 1);
    }

    return res;
};

```
