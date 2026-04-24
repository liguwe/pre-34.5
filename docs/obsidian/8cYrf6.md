# 长度最小的子数组

> [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)


输入：`target = 7, nums = [2,3,1,2,4,3]`
输出：2
解释：子数组 `[4,3]` 是该条件下的长度最小的子数组


---


- 不用单独写一个函数来判断窗口内是否满足
- 直接维护一个 `winSum` 更好

```javascript hl:6
var minSubArrayLen = function (target, nums) {
    let res = Number.MAX_VALUE;
    let left = 0;
    let right = 0;
    let n = nums.length;
    let winSum = 0; // 维护窗口内元素之和

    while (right < n) {
        winSum += nums[right];
        right++;
        while (winSum >= target && left < right) {
            res = Math.min(res, right - left);
            winSum -= nums[left];
            left++;
        }
    }
    return res == Number.MAX_VALUE ? 0 : res;
};

```
