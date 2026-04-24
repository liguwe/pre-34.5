# 在排序数组中查找元素的第一个和最后一个位置

> [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

## 总结

- 两个函数：
	- `searchLeft`
	- `searchRight`
- 判断：小于 → 大于 →  等于 
	- if `<` target
	- else if `>` target
	- else if `===` target
		- **别返回**
		- 收缩右侧边界
		- 或者收缩右侧边界
	- 没有 else 

>  上面两个函数可以自己写到函数体里面，**省得传参了**

## 代码

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  let l = searchLeft(nums, target);
  let r = searchRight(nums, target);
  return [l, r];
};

function searchLeft(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      right = mid - 1;
    }
  }
  if (left >= nums.length || nums[left] !== target) {
    return -1;
  }
  return left;
}

function searchRight(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    } else if (nums[mid] === target) {
      left = mid + 1;
    }
  }
  if (right < 0 || nums[right] !== target) {
    return -1;
  }
  return right;
}

```
