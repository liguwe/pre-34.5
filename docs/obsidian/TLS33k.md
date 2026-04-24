# 移动零

>  [283. 移动零](https://leetcode.cn/problems/move-zeroes/)

- 将数组中 `0` 移动到最后
	- 并列的两个 for 循环
		- 第一个 `0 →  len`
		- 第二个 `slow → len`
			- 修改为 0

```javascript
var moveZeroes = function (nums) {
  let slow = 0;
  let fast = 0;

  let len = nums.length;

  for (let i = 0; i < len; i++) {
    fast = i;
    if (nums[i] !== 0) {
      nums[slow] = nums[fast];
      slow++;
    }
  }

  for (let i = slow; i < len; i++) {
    nums[i] = 0;
  }

  return nums;
};
```
