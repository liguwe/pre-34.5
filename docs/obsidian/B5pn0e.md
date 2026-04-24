# 子集：元素不重复不可复选

> [78. 子集](https://leetcode.cn/problems/subsets/)

## 1. 题目

![|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/e5977d58a644022f4079de04183590fb.png)

## 2. 分析

- 元素互不相同
- 子集不可重复
- 通过**保证元素之间的相对顺序不变**  
	-  **→→→** 来防止出现重复的子集

![|824](https://832-1310531898.cos.ap-beijing.myqcloud.com/72a8bcd2508fda6eaa0e6a7ee541627f.png)

## 3. 代码

```javascript hl:12
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  let res = [];
  let n = nums.length;

  function backtrack(track, start) {
    res.push([...track]);

    for (let i = start; i < n; i++) {
      track.push(nums[i]);
      backtrack(track, i + 1);
      track.pop();
    }
  }

  backtrack([], 0);

  return res;
};

```

## 4. 注意

- 如何保证相对顺利：
	- for 循环时，`i = start`
		- 然后递归调用 `backtrack(i + 1)`
- 重点：`for (let i = start; i < n; i++) {`
