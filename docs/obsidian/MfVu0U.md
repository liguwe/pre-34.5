# 找出两数组的不同

`#算法` `#leetcode`  `#2024/07/28` 

## 题目及理解

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/2957c151de2e1cf09ca75212d17676ae.png)

## 解题思路

1. `nums1` 中有，但 nums2 `中没有的数字`
2. `nums2` 中有，但 `nums1` 中没有的数字

## 代码实现
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[][]}
 */
var findDifference = function (nums1, nums2) {
  const s1 = new Set(nums1);
  const s2 = new Set(nums2);

  const res1 = [...s1].filter((num) => !s2.has(num));
  const res2 = [...s2].filter((num) => !s1.has(num));

  return [res1, res2];
};
```

### 复杂度分析

## 错误记录
