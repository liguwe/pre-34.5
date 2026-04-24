# 删除有序数组中的重复项

`#数组/快慢指针`  `#done` 

> [26. 删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

## 总结

- 删除有序数组中的重复项
	- 使用 **for 循环**
		- `if` 快慢指针指向的元素不相等时
			- `slow++`
			- `nums[slow] = nums[fast];`

```javascript
var removeDuplicates = function (nums) {
    let slow = 0,
        fast = 0;
    for (let i = 0; i < nums.length; i++) {
        fast = i;
        if (nums[fast] !== nums[slow]) {
           slow++;
           nums[slow] = nums[fast];
        }
    }
    return slow + 1;
};
```

## 题目及理解

![image.png600|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407281631265.png?imageSlim)

## 解题思路

- 双指针技巧
- 原地修改

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  // 快慢指针,都从0开始
  let fast = 0;
  let slow = 0;
  // 快指针遍历数组
  while (fast < nums.length) {
    // 当快指针对应的元素不等于慢指针对应的元素时
    if (nums[fast] !== nums[slow]) {
      // 不相等时，先移动模板
      slow++;
      // 将快指针对应的元素赋值给慢指针对应的元素
      nums[slow] = nums[fast];
    }
    // 快指针，每遍历一个元素，就向后移动一次
    fast++;
  }
  // 删除后面的元素
  nums.splice(slow + 1);

  return slow + 1;
};

```

## 错误记录
