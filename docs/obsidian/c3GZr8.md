# 两数之和 II - 输入有序数组

>  [167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)


- 两数之和
	- `while(left < right)`
		- `return [left + 1, right + 1];` 
	- `return [-1, -1]`

```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let left = 1;
  let right = numbers.length;

  while (left <= right) {
    let sum = numbers[left - 1] + numbers[right - 1];

    if (sum === target) {
      return [left, right];
    }
    if (sum > target) {
      right--;
    }
    if (sum < target) {
      left++;
    }
  }

  return [-1, -1];
};

```
