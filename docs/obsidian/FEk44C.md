# 俄罗斯套娃信封问题：最长子序列的二维版本

>  [354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)

- 按宽度 → 升序
	- 高度相等时，则 降序
	- `return a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1];`
- 下面的写法超时了，得用另外一种写法（二分法）

```javascript
var maxEnvelopes = function (envelopes) {
    envelopes.sort((a, b) => {
        return a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1];
    });
    let height = [];
    for (let item of envelopes) {
        height.push(item[1]);
    }
    return lengthOfLIS(height);
    
    function lengthOfLIS(nums) {
        let n = nums.length;
        // dp[i]：以 num[i] 结尾的最长递增子序列为 
        let dp = new Array(n).fill(1);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[j] + 1, dp[i]);
                }
            }
        }
        return Math.max(...dp);
    }
};

```


## 更多参考

- [3. 如何查找状态转移方程：最长递增子序列与俄罗斯套娃](/nguP8f)
