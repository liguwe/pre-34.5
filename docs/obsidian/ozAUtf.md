# 有序数组的平方

`#数组/左右指针`

>  [977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/)

## 1. 总结

- **三个**指针：left 、right、**p**
	- 关键点，p 指针的作用， →  `p--`
	- 倒着遍历
		- 因为两边，最大或者最小的平方肯定是最大的
- 比较使用：
	- 使用 `Math.abs` 比较元素，而**不是比较元素的平方**

## 2. 代码

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  let left = 0;
  let right = nums.length - 1;
  let p = nums.length - 1;
  let res = [];

  while (left <= right) {
    if (Math.abs(nums[left]) > Math.abs(nums[right])) {
      res[p] = nums[left] * nums[left];
      left++;
    } else {
      res[p] = nums[right] * nums[right];
      right--;
    }
    p--;
  }
  return res;
};

```
