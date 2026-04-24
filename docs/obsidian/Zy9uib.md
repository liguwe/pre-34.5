# 搜索旋转排序数组 II：从两个排序数组中查找目标值，但存在重复元素

> [81. 搜索旋转排序数组 II](https://leetcode.cn/problems/search-in-rotated-sorted-array-ii/)


同 [33. 搜索旋转排序数组：从两个有序组成的数组中找目标值](/02qX2F) ， 但数组中可能**存在重复元素**， 这个变化会导致算法的时间复杂度在最坏情况下退化到 `O(n)`


```javascript
var search = function (nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    // 本题需要在计算 mid 之前收缩左右边界去重
    while (left < right && nums[left] == nums[left + 1]) {
      left++;
    }
    while (left < right && nums[right] == nums[right - 1]) {
      right--;
    }
    // 其余逻辑和第 33 题完全相同
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] == target) {
      return true;
    }
    if (nums[mid] >= nums[left]) {
      // mid 落在断崖左边，此时 nums[left..mid] 有序
      if (target >= nums[left] && target < nums[mid]) {
        // target 落在 [left..mid-1] 中
        right = mid - 1;
      } else {
        // target 落在 [mid+1..right] 中
        left = mid + 1;
      }
    } else {
      // mid 落在断崖右边，此时 nums[mid..right] 有序
      if (target <= nums[right] && target > nums[mid]) {
        // target 落在 [mid+1..right] 中
        left = mid + 1;
      } else {
        // target 落在 [left..mid-1] 中
        right = mid - 1;
      }
    }
  }
  // while 结束还没找到，说明 target 不存在
  return false;
};

```
