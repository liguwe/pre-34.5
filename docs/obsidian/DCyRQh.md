# 乘积小于 K 的子数组：子数组内所有元素的乘积严格小于 k 的连续子数组的数目

> [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/)


- 初始化乘积：一定要是 `1` 
- 窗口内的子数组如何计算？
	- 即 `right - left`

```javascript hl:6,20
var numSubarrayProductLessThanK = function (nums, k) {
    let n = nums.length;
    let left = 0;
    let right = 0;
    let res = 0;
    let product = 1;
    while (right < n) {
        product *= nums[right];
        right++;
        // 缩小窗口
        while (product >= k && left < right) {
            product /= nums[left];
            left++;
        }
        // 现在必然是一个合法的窗口，这个窗口中的子数组个数怎么计算：
        // 比方说 left = 1, right = 4 划定了 [1, 2, 3] 这个窗口（right 是开区间）
        // 但不止 [left..right] 是合法的子数组
        // [left+1..right], [left+2..right] 等都是合法子数组
        // 所以我们需要把 [3], [2,3], [1,2,3] 这 right - left 个子数组都加上
        res += right - left;
    }
    return res;
};
```
