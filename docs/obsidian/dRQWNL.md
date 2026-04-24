# 背包：数组是否可以分割两个子集，使得这两子集的元素和相等

## 题目

> [力扣（LeetCode）](https://leetcode.cn/problems/partition-equal-subset-sum/description/)

![image.png|656](https://832-1310531898.cos.ap-beijing.myqcloud.com/04774a23f90d397bbb8af286c8b1cde9.png)

## 题解

这道题是  [14. 背包：0-1 背包问题](/7LF1h6) 的变种：

- 给一个可装载重量为 `sum / 2 ` 的背包和 `N` 个物品，每个物品的重量为`nums[i]`。现在让你装物品，是否存在一种装法，能够恰好将背包装满。

## 明确 `状态` 和 `选择`

**状态：**
- 背包还能装多少重量的物品
- 还能选择的物品
**选择：**
- `装`进背包
- `不装`进背包

## 明确 `dp数组` 的定义

###  定义

`dp[i][w] = x` 表示：
- 对于前 `i` 个物品（ i 从 1 开始计数），当前背包的容量为 `w` 时，是否能装满背包
   - 若 `x` 为 `true`，则说明 `可以`恰好将背包`装满`
   - 若 `x` 为 `false`，则说明`不能`恰好将背包`装满`


> 所以，本题的题解就是求：`dp[N][sum/2]`

### base case

- `dp[...][0] = true` ，表示没有容量，`装满了`
- `dp[0][...]= false` ，表示没有可选择的物品，`不能装满`

## 根据 `选择` 确定 `状态转移方程`

### 1. 选择一：不选

```javascript
dp[i][w] = dp[i-1][w]
```

解释：

> 你不把第`i` 装入包中时，`是否装满`只取决于 `前 i-1 个物品` 是否装满剩余容量为 `w` 的背包

### 2. 选择二：选择

```javascript
dp[i][w] = dp[i-1][w-num[i-1]]
```

解释：

> 你把第`i` 装入包中时，`是否装满`只取决于 `前 i-1 个物品` 是否装满剩余容量为 `w - num[i-1]` 的背包
> 
> 换句话说，如果 `w - nums[i-1]` 的 重量可以被恰好装满，那么只要把第 `i` 个物品**能装进去**，也可恰好装满 `w` 的重量

## 根据 `动态规划框架` 写出 `最终代码`

```javascript hl:9
/**
 * @description 分割等和子集, 0/1背包的变种
 * @url https://leetcode-cn.com/problems/partition-equal-subset-sum/
 * @param {number} N
 * @param {number} W
 * @param {number[]} wt
 * */
function fn(N, W, wt) {
    // :::: 初始化dp数组 及其 base case
    const dp = [];
    for (let i = 0; i <= N; i++) {
        dp[i] = [];
        for (let w = 0; w <= W; w++) {
            // ::::重量为0时，表示能够装入
            if (w === 0) {
                dp[i][w] = true;
            }
            // ::::可选择的物品为0时，表示不能装入
            else if (i === 0) {
                dp[i][w] = false;
            }
            // ::::其余情况，初始化为false
            else {
                dp[i][w] = false;
            }
        }
    }
    // ::::根据状态个数，决定嵌套层数，
    // ::::使用动态规划框架模板代码遍历
    for (let i = 1; i <= N; i++) {
        for (let w = 1; w <= W; w++) {
            // ::::剩余容量已经小于 0 了，只能取决于上一个物品的状态，是否装满了
            if (w - wt[i - 1] < 0) {
                dp[i][w] = dp[i - 1][w];
            } else {
                // ::::选择
                dp[i][w] =
                    // ::::不装入
                    dp[i - 1][w] ||
                    // ::::装入
                    dp[i - 1][w - wt[i - 1]];
            }
        }
    }
    return dp[N][W];
}


/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function (nums) {
    const sum = nums.reduce((a, b) => a + b, 0);
    // ::::如果总和为奇数，直接返回false
    if (sum % 2 !== 0) return false;
    // ::::背包容量
    const W = sum / 2;
    // ::::物品数量
    const N = nums.length;
    return fn(N, W, nums);
};

```

## 优化空间复杂度

```javascript
var canPartition = function (nums) {
    let W = 0;
    for (let num of nums) W += num;
    // 和为奇数时，不可能划分成两个和相等的集合
    if (W % 2 !== 0) return false;
    let N = nums.length;
    W = W / 2;

    let dp = new Array(W + 1).fill(false);

    // base case
    dp[0] = true;

    for (let i = 0; i < N; i++) {
        // ::::: 从后往前遍历
        for (let w = W; w >= 0; w--) {
            if (w - nums[i] >= 0) {
                dp[w] = dp[w] || dp[w - nums[i]];
            }
        }
    }
    return dp[W];
};
```

时间复杂度 `O(n*sum)`，空间复杂度 `O(sum)`

> - 注意是`倒序`，记住正常的解法就行，这种压缩空间复杂度的解法，还没理解透
