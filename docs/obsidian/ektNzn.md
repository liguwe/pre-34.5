# 单词拆分：给定的字符串是否能由给定的单词集合组合成

[139. 单词拆分](https://leetcode.cn/problems/word-break/)

- `dp[i]` 表示 `s[..i]` 是否能够被拼出

```javascript
var wordBreak = function (s, wordDict) {
    let n = s.length + 1;
    // dp[i] 表示 s[..i] 是否能够被拼出
    let dp = new Array(n).fill(false);
    // base case：空字符串可以被拆分
    dp[0] = true;

    // 遍历字符串的每个位置
    for (let i = 0; i <= n; i++) {
        // 遍历每个可能的拆分点
        for (j = 0; j < i; j++) {
            // 如果前半部分可以被拆分，且后半部分在字典中存在
            if (dp[j] && wordDict.includes(s.slice(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n - 1];
};
```


## 更多

- [7. 动态规划和回溯算法：单词拆分与单词拆分 II](/tJ08dB)
