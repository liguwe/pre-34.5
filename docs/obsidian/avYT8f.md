# 有序转化数组：f(x) = a * x * x + b * x + c

`#leetcode-plus` `#数组/左右指针` 

> [360. 有序转化数组](https://leetcode.cn/problems/sort-transformed-array/)

## 1. 总结

- 三个指针
	- left
	- right
	- p 根据 a 初始化
- `while (left <= right) {`
	- 抛物线开口向上，两端的值更大
	- 抛物线开口向下，两端的值更小


> [!tip]
> - 画图，画图，抛物线，帮助理解
> - `f 函数`写到里面，减少传参
> - `right = len-1` 请注意，而不是 `len`

## 2. 代码

```javascript
/**
 * @param {number[]} nums
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number[]}
 */
var sortTransformedArray = function (nums, a, b, c) {
  let left = 0;
  let right = nums.length - 1;
  let p = a >= 0 ? nums.length - 1 : 0;
  let res = [];
  while (left <= right) {
    let v1 = f(nums[left]);
    let v2 = f(nums[right]);
    // 抛物线开口向上，两端的值更大
    if (a >= 0) {
      if (v1 > v2) {
        res[p] = v1;
        left++;
      } else {
        res[p] = v2;
        right--;
      }
      p--;
    }
    // 抛物线开口向下，两端的值更小
    else {
      if (v1 < v2) {
        res[p] = v1;
        left++;
      } else {
        res[p] = v2;
        right--;
      }
      p++;
    }
  }

  function f(x) {
    return a * x * x + b * x + c;
  }

  return res;
};

```
