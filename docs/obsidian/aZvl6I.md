# 删除有序数组中的重复项 II：最多允许重复两次

`#数组/快慢指针`

> [80. 删除有序数组中的重复项 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/)

## 1. 总结

- base case：数组长度小于 3 时，直接返回
- slow fast 都等于 2
- 从第三个元素开始遍历：`for (; fast < nums.length; fast++) {`
	- `if (nums[fast] !== nums[slow - 2]) {`
		- 说明当前元素最多只重复了一次
			- `nums[slow] = nums[fast];` 即可

>  删除有序数组中的重复元素，一定会有 `nums[slow] = nums[fast];`


思路 2：双指针
- `count = 0/1/2` ，计算重复次数
- 记得需要重置为 0 ，当 `nums[fast] !== nums[fast - 1]`

## 2. 思路

1. 由于题目允许最多重复两次，所以**前两个元素必定保留**
2. 从第三个元素开始，将当前元素与新数组中倒数第二个元素比较
3. 如果不相同，说明当前元素最多只重复了一次，可以保留
4. 最终 `slow` 指向新数组长度

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  // 数组长度小于 3 时，无需处理
  if (nums.length <= 2) return nums.length;

  // slow 表示新数组的待插入位置
  // fast 表示当前遍历的位置
  let slow = 2;
  let fast = 2;

  // 从第三个元素开始遍历
  for (; fast < nums.length; fast++) {
    // 如果当前元素与新数组倒数第二个元素不相同
    // 说明当前元素最多只重复了一次
    if (nums[fast] !== nums[slow - 2]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }

  return slow;
};

```

## 3. 删除有序数组中的重复项 II

### 3.1. 题目及理解

![image.png600|696](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407281632176.png?imageSlim)

### 3.2. 解题思路

- 双指针
	- `count = 0/1/2` ，计算重复次数
	- 记得需要重置为 0 ，当 `nums[fast] !== nums[fast - 1]`

### 3.3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  // 快慢指针,都从0开始
  let slow = 0;
  let fast = 0;
  // 用于记录重复元素的个数，初始值为0，最多只能有两个重复元素
  let count = 0;
  // 快指针遍历数组
  while (fast < nums.length) {
    // 当快指针对应的元素不等于慢指针对应的元素时
    if (nums[fast] !== nums[slow]) {
      // 慢指针向后移动一位
      slow++;
      // 将快指针对应的元素赋值给慢指针对应的元素
      nums[slow] = nums[fast];
      // 此时，对于 nums[0..slow] 来说，nums[fast] 重复次数小于 2，也加进来
    } else if (slow < fast && count < 2) {
      // 慢指针向后移动一位
      slow++;
      // 将快指针对应的元素赋值给慢指针对应的元素
      nums[slow] = nums[fast];
    }
    // 快指针，每遍历一个元素，就向后移动一次
    fast++;
    // 计数器，记录重复元素的个数
    count++;
    // fast 遇到新的不同的元素时，重置 count
    if (fast < nums.length && nums[fast] !== nums[fast - 1]) {
      count = 0;
    }
  }
  // 删除后面的元素
  nums.splice(slow + 1);
  return slow + 1;
};

```

> 记得最后删除元素

### 3.4. 错误记录
