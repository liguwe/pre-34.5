# 二分查找

`#算法/二分搜索` 

> [704. 二分查找](https://leetcode.cn/problems/binary-search/)

## 1. 总结

- left = 0；right = **len -1**
- while (left `<=` right) { 
	- 注意是**小于等于**
- 为什么 **是 mid + 1 或者 mid - 1**
- 去搜索区间 `[left, mid-1]` 或者区间 `[mid+1, right]` 对不对？
	- 因为 `mid` **已经搜索过**，应该从搜索区间中去除
- 约定顺序：→ 为了寻找左边界、右边界，好记住
	- if `< target`
	- else if `> target` 
	- else if `=== target`
	- 没有 else



> [!danger]
> 都以为很简单，很简单，然后写不出来？？？

## 2. 代码

```javascript hl:16
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      return mid;
    }
  }
  return -1;
};
```

## 3. 错误记录

- 是 `right - left`
- 不是 `++` 和 `--`

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250106-2.png)
