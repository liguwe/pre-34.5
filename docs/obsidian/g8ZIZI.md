# 最长递增子序列：最长递增子序列数量

>  [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

- 以 `num[i] 结尾`的最长递增子序列数量为 `dp[i]`
- for i → n
	- for j → **i** 

```javascript
var lengthOfLIS = function (nums) {
    let n = nums.length;
    // 以 num[i] 结尾的最长递增子序列为 dp[i]
    let dp = new Array(n).fill(1);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[j] + 1, dp[i]);
            }
        }
    }
    return Math.max(...dp);
};
```

## 1. 更多

- [3. 如何查找状态转移方程：最长递增子序列与俄罗斯套娃](/nguP8f)
