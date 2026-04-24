# 搜索插入位置：有序数组中插入 target，保证有序，返回插入的位置

>  [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)


- 不需要特殊处理边界情况
- `while (left <= right) {`
- 最后返回 left
- 主要：
	- 都使用 else-if
		- ① =
		- ② <
		- ③ >

```javascript  hl:3,5,16
var searchInsert = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else if(nums[mid] > target){
      right = mid - 1;
    }
  }
  // 如果没找到，left 就是应该插入的位置
  return left;
};

```
