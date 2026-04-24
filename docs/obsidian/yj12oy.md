# 移除元素：移除指定元素

`#done` 

>  [27. 移除元素](https://leetcode.cn/problems/remove-element/)

- 移除数组中的指定元素
	- for 循环一次即可
		- `if(nums[i] !== val){` 
			- slow++

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    let fast = 0;
    let slow = 0;
    while (fast < nums.length){
        if(nums[fast] !== val){
            // ::::关键，快指针的值给slow的值即可
            nums[slow] = nums[fast];
            slow++;
        }
        fast++;
    }
    return slow;
};
```

## 1. 题目及理解

![image.png600|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407281629958.png?imageSlim)

## 2. 解题思路

- 快慢指针
- 知道了 `slow`，将后面的元素重置为`_` (按照题设要求)

## 3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  // 快慢指针,都从0开始
  let fast = 0;
  let slow = 0;
  // 快指针遍历数组
  while (fast < nums.length) {
    // 当快指针对应的元素不等于 val 时
    if (nums[fast] !== val) {
      // 将快指针对应的元素赋值给慢指针对应的元素
      nums[slow] = nums[fast];
      slow++;
    }
    // 快指针，每遍历一个元素，就向后移动一次
    fast++;
  }
  // 修改 nums 后面的元素为 _
  for (let i = slow; i < nums.length; i++) {
    nums[i] = "_";
  }
  return slow;
};

```

## 4. 错误记录
