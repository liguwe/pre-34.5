# 盛最多水的容器：找两条线装水最多

`#leetcode` `#算法/双指针` 

> [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

## 1. 总结

- 左右指针技巧：
	- 用 `left` 和 `right` 两个指针从**两端中心向收缩**
	- 边收缩边计算即可

## 2. 题目及理解

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/1177bd34d377d88a18b423f085b603ef.png)

## 3. 解题思路

- 左右指针技巧
- 用 `left` 和 `right` 两个指针从**两端**向中心收缩，
   - 一边收缩一边计算 `[left, right]` 之间的`矩形面积`，取`最大的面积`值即是答案
      - `矩形面积 =  left 的高度 * right 的高度`

## 4. 代码实现

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let left = 0; // 左指针
  let right = height.length - 1; // 右指针
  let max = 0; // 最大面积

  // 当左指针小于右指针时，执行循环
  // 这里的循环条件是left < right，而不是left <= right
  while (left < right) {
    // 计算当前左右指针对应的面积
    //  [left, right] 之间的矩形面积 为什么是这个公式？
    // 因为矩形的面积是由两个因素决定的：底边和高度，底边是两个指针之间的距离，
    // 高度是两个指针对应的元素中的较小值
    const area = Math.min(height[left], height[right]) * (right - left);
    // 更新最大面积
    max = Math.max(max, area);
    // 如果左指针对应的元素小于右指针对应的元素
    if (height[left] < height[right]) {
      // 左指针右移
      left++;
    } else {
      // 右指针左移
      right--;
    }
  }
  return max;
};
```

### 4.1. 复杂度分析

## 5. 错误记录

> 注意下面的公式，别搞混了

![image.png|824](https://832-1310531898.cos.ap-beijing.myqcloud.com/5015126dadf1d8fb35a2abe46218b231.png)

## 6. 参考

- [如何高效解决接雨水问题](https://labuladong.online/algo/frequency-interview/trapping-rain-water/#%E6%89%A9%E5%B1%95%E5%BB%B6%E4%BC%B8)
