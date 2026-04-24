# 连续的子数组和

`#算法/前缀和` 


> [523. 连续的子数组和](https://leetcode.cn/problems/continuous-subarray-sum/)


本题让你寻找`长度至少为 2` 且和为 `k` 的倍数的子数组，翻译一下就是：
- 寻找 `i, j` 使得 `(preSum[i] - preSum[j]) % k == 0` 且 `i - j >= 2`。
- 另外，`(preSum[i] - preSum[j]) % k == 0` 其实就是 `preSum[i] % k == preSum[j] % k`。
- 所以我们使用一个哈希表，记录 `preSum[j] % k` 的值以及对应的索引，就可以迅速判断 `preSum[i]` 是否符合条件了


基本可以复用 [523. 连续的子数组和](/v3QJLB) 的代码，简单修改即可

```javascript hl:11,17,20
var checkSubarraySum = function (nums, k) {
    let n = nums.length;
    let preSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        preSum[i + 1] = preSum[i] + nums[i];
    }

    // key 为 preSum item，val 为 preSum[i] % k
    let mapping = new Map();
    for (let i = 0; i < preSum.length; i++) {
        let val = preSum[i] % k;
        if (!mapping.has(val)) {
            mapping.set(val, i);
        }
    }
    for (let i = 0; i < preSum.length; i++) {
        let need = preSum[i] % k;
        if (mapping.has(need)) {
            // 已经出现过了，判断长度至少为 2
            if (i - mapping.get(need) >= 2) {
                return true;
            }
        }
    }
    return false;
};

```
