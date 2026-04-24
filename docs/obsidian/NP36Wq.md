# 移动零 1

`#算法/双指针`  `#leetcode` 

## 题目及理解

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/4d1151bf396c03af984ebd8f5e3bcad9.png)

## 解题思路

> 其实就是 [移除元素](https://www.yuque.com/liguwe/agorithms/wftg17qn12ytlsrc) （指定移动哪个元素） 的特殊版本，这里指定移动` 0 `

- 双指针：`slow` 和 `fast`
- `slow` 之后的值换成 `0` 即可

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast];
      slow++;
    }
    fast++;
  }
  for (let i = slow; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
};

```

## 错误记录
