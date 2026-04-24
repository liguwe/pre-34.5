# 下降路径最小和：从第一行下降到最后一行最小路径合为多少？

> [931. 下降路径最小和](https://leetcode.cn/problems/minimum-falling-path-sum/)


- 定义 `dp[i,j]` : 下降到 `[i,j]` 这个位置的**最小**路径和 
	- ![image.png|368](https://832-1310531898.cos.ap-beijing.myqcloud.com/736082a26402922ebd21bf34f8136d34.png)

所以**状态转移方程**是：

```javascript
dp[i][j] =
    matrix[i][j] + 
    Math.min(
        dp[i - 1][j - 1], 
        dp[i - 1][j], 
        dp[i - 1][j + 1]
    );
```

## 1. 更多

- [4. base case 和备忘录的初始值怎么定：下降路径的最小和](/IJlFOa)
