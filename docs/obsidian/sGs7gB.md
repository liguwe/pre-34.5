# 跳跃游戏

`#leetcode` `#算法/贪心算法`  

## 1. 总结

- `num[i]` 代表的是**你最大跳多远，而不是一定要跳多远**
- 如果**当前位置大于最远位置**，说明无法到达

```javascript
var canJump = function (nums) {
  let n = nums.length;
  // 代表当前能到达的最远位置
  let maxReach = 0;
  for (let i = 0; i < n; i++) {
    // 如果当前位置大于最远位置，说明无法到达
    if (i > maxReach) {
      return false;
    }
    // 更新最远位置
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  // 如果最远位置大于等于数组长度，说明可以到达
  return true;
};

```

## 2. 题目及理解

[https://leetcode.cn/problems/jump-game/](https://leetcode.cn/problems/jump-game/)

![cos-blog-832-34-20241012|656](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240816081854.png)

## 3. 思路一：贪心算法

1. 贪心算法： 我们可以使用贪心算法来解决这个问题。核心思想是维护一个变量 `maxReach`，表示能够到达的**最远位置**。
2. 遍历数组： 从左到右遍历数组，对于每个位置，我们更新 `maxReach`。
3. 更新 `maxReach`： 对于当前位置 i，我们可以跳到的最远位置是 `i + nums[i]`
	- 因此，`maxReach` 应该更新为 `Math.max(maxReach, i + nums[i])` 
4. 检查是否可以继续： 
	- 如果在某个`位置 i`，`maxReach` 小于或等于 `i`，且 `i` 还不是最后一个位置，那么我们就无法继续前进，返回 false。
5. 到达终点：
	-  **如果我们能够遍历完整个数组**，那么就意味着我们可以到达最后一个位置，返回 `true`。

### 3.1. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  // 代表当前能到达的最远位置
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    // 如果当前位置大于最远位置，说明无法到达
    // maxReach 是当前能到达的最远位置
    // 例如 [3, 2, 1, 0, 4]，当 i = 4 时，maxReach = 3，无法到达
    // 例如 [2, 3, 1, 1, 4]，当 i = 4 时，maxReach = 4，可以到达
    if (i > maxReach) {
      return false;
    }
    // 更新最远位置
    // i + nums[i] 代表当前位置能到达的最远位置,i 是当前位置，nums[i] 是当前位置的值
    // question: 为什么要取最大值？
    // answer: 因为当前位置的值是当前位置能到达的最远位置，所以要取最大值
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  // 如果最远位置大于等于数组长度，说明可以到达
  return true;
};
```

### 3.2. 复杂度分析

- 时间复杂度是 `O(n)`，其中 n 是数组的长度，因为我们只遍历了一遍数组。
- 空间复杂度是 `O(1)`，因为我们只使用了常数额外空间

## 4. 思路二：动态规划

- 重点：
	- 定义 `dp[i]` 站在`位置 i` 上是否能跳到最后
	- 从后往前推导

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let n = nums.length;
  // 站在位置 i 上是否能跳到最后
  dp = new Array(n).fill(false);
  
  // 我站在最后肯定能跳到最后，
  dp[n - 1] = true;

  for (let i = n - 2; i >= 0; i--) {
    // 当前位置可以跳到的最远位置
    let maxReach = i + nums[i];

    // 如果我能跳到一个可以到达终点的位置，那么我当前的位置也一定可以到达终点
    for (let j = i + 1; j <= maxReach && j <= n; j++) {
      // 我能从 i 跳到 i+1 到 i+ num[i] 的任何位置
      // 所以，只要 dp[j] = true，那么 dp[i] = true
      if (dp[j]) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[0];
};

```
