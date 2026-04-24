# 接雨水：下雨了柱子间能装多少水

`#leetcode` `#算法/双指针` `#算法/备忘录`   

## 1. 题目及理解

> [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)


![image.png600|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407310906405.png?imageSlim)

## 2. 解题思路

🌧 最多能够装多少水 = 每个柱子上能够装多少水 = `每个柱子左边和右边最高柱子的最矮的那个 - 该柱子的高度` ，如下代码

```python
water[i] = min(
    # 左边最高的柱子
    max(height[0..i]),  
    # 右边最高的柱子
    max(height[i..end]) 
) - height[i]
```

如下图：

![image.png600|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407310915725.png?imageSlim)

## 3. 代码实现

### 3.1. 解法一：暴力遍历

按照上面的思路，直接**暴力遍历**即可，复杂度是 `O(N^2)`，空间复杂度 `O(1)`

```javascript
var trap = function(height) {
    var n = height.length;
    var res = 0;
    for (var i = 1; i < n - 1; i++) {
        var l_max = 0, r_max = 0;
        // 找右边最高的柱子
        for (var j = i; j < n; j++)
            r_max = Math.max(r_max, height[j]);
        // 找左边最高的柱子
        for (var j = i; j >= 0; j--)
            l_max = Math.max(l_max, height[j]);
        // 如果自己就是最高的话，
        // l_max == r_max == height[i]
        res += Math.min(l_max, r_max) - height[i];
    }
    return res;
};
```

### 3.2. 解法二：备忘录优化

对于解法一，可以使用备忘录优化：

- 定义两个数组 `r_max` 和 `l_max` 充当备忘录，预先把这两个数组计算好，避免重复计算
	- `l_max[i]` 表示位置 `i` 左边最高的柱子高度
	- `r_max[i]` 表示位置 `i` 右边最高的柱子高度

### 3.3. 解法三：双指针

时间复杂度为 `O(n)`，空间复杂度为 `O(1)`

```javascript
water[i] = min(
    # 左边最高的柱子
    max(height[0..i]),  
    # 右边最高的柱子
    max(height[i..end]) 
) - height[i]
/**  
 * @param {number[]} height  
 * @return {number}  
 */  
var trap = function (height) {  
  
    // 双指针  
    let left = 0;  
    let right = height.length - 1;  
  
    // 当前遍历的元素的 左边的最大值  
    let leftMax = 0;  
    // 当前遍历的元素的 右边的最大值  
    let rightMax = 0;  
    // 结果  
    let res = 0;  
  
    // 遍历, 双向遍历，从两边向中间靠拢  
    while (left < right) {  
        // 更新左边的最大值  
        leftMax = Math.max(leftMax, height[left]);  
        // 更新右边的最大值  
        rightMax = Math.max(rightMax, height[right]);  
  
        // 说明最小值在左边，当前元素的水量 = 左边最大值 - 当前元素的高度  
        if (leftMax < rightMax) {  
            // 更新结果  
            res += leftMax - height[left];  
            // 左指针向右移动  
            left++;  
            // 说明最小值在右边，当前元素的水量 = 右边最大值 - 当前元素的高度  
        } else {  
            // 更新结果  
            res += rightMax - height[right];  
            // 右指针向左移动  
            right--;  
        }  
    }  
  
    // 返回结果  
    return res;  
  
};
```
