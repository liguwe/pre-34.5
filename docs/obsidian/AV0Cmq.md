# 零钱兑换：需要的最小硬币数

`#算法/动态规划` 

> [!success]
> `dp[i]` 代表凑足 `i 元`所需要的**最小**硬币数量


- 最小：意味着需要 `Math.min`
- 遍历可选择硬币：
	- `不选`该面值的硬币
	- `选择`该面值的硬币

```javascript
var coinChange = function (coins, amount) {
    let n = amount + 1;
    // dp[i]：凑足 i 元需要最少的硬币数
    let dp = new Array(n).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i < n; i++) {
        for (let coin of coins) {
            // 金额 - 面值 < 0 时跳过
            if (i - coin < 0) continue;
            dp[i] = Math.min(
                dp[i], // 不选该面值的硬币
                dp[i - coin] + 1, // 选择该面值的硬币
            );
        }
    }
};
```


>  另外见 [2. 动态规划解题套路框架：以最小零钱为例说明](/hRY7fJ)
