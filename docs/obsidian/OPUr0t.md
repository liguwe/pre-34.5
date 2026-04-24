# 将 x 减到 0 的最小操作数

> [1658. 将 x 减到 0 的最小操作数](https://leetcode.cn/problems/minimum-operations-to-reduce-x-to-zero/)


- 给你一个整数数组 `nums` 和一个整数 `x` 。
- 每一次操作时，你应当移除数组 `nums` 最左边或最右边的元素，然后从 `x` 中减去该元素的值。
- 如果可以将 `x` **恰好** 减到 `0` 
	- 返回 **最小操作数** 
	- 否则，返回 `-1` 


 `nums` 中的元素都是正数
 - 这就保证了只要有元素加入窗口，和一定变大
 - 只要有元素离开窗口，和一定变小。



- 原问题：从数组两端取数，使得取出的数之和等于 x
- **转化为**：找到数组中的**最长连续子数组**，其和等于 `sum - x`
- 原因：剩下的元素就是我们需要从两端取出的元素


重点：从"找两端和为`x`的`最少元素`" 转化为 "找中间和为`sum-x`的`最长子数组`"


错误记录：
- res 为 -1 ，表示没找到
- 只在 `winSum === target` 时更新结果

```javascript hl:11,21
var minOperations = function (nums, x) {
    let n = nums.length;
    let sum = 0;
    for (let item of nums) {
        sum += item;
    }
    let left = 0;
    let right = 0;
    let target = sum - x;
    // 从 "找两端和为x的最少元素" 转化为 "找中间和为 sum-x 的最长子数组"
    let res = -1;
    let winSum = 0; // 窗口和
    while (right < n) {
        winSum += nums[right];
        right++;
        // 缩小窗口
        while (winSum > target) {
            winSum -= nums[left];
            left++;
        }
        // 只在 winSum === target 时更新结果
        if (winSum === target) {
            res = Math.max(res, right - left);
        }
    }
    // 如果没找到符合条件的子数组
    return res === -1 ? -1 : n - res;
};

```
