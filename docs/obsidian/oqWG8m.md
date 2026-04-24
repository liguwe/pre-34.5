# 递增的三元子序列

`#leetcode` `#2024/07/28`  `#算法` 

## 题目及理解

![image.png|640](https://832-1310531898.cos.ap-beijing.myqcloud.com/13c6ebae35cee42b11c377759cf0b779.png)

## 解题思路

- 两个变量：`第一最大值` 和 `第二最大值`
- 遍历，根据当前遍历的元素
   - 更新第一最大值
   - 更新第二最大值，他一定小于第一最大值
   - 否则：小于第一最大值，也许与第二最大值
      - 那么 当前值、第二最大值、第一最大值不就满足题设了吗？

## 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function (nums) {
  // base case
  if (nums.length < 3) {
    return false;
  }
  // 先定义两个最大值
  // first 为第一个最大值
  let first = Number.MAX_SAFE_INTEGER;
  // second 为第二个最大值
  let second = Number.MAX_SAFE_INTEGER;
  // 遍历数组
  for (let i = 0; i < nums.length; i++) {
    // ① 当当前元素小于第一个最大值时，确保 first 是遍历到当前元素之前的最小值
    if (nums[i] <= first) {
      // 更新第一个最大值
      first = nums[i];
      //②  用于更新第二小值 second，确保 second 是遍历到当前元素之前的第二小值，并且大于 first。
    } else if (nums[i] <= second) {
      // 当当前元素小于第二个最大值时
      // 更新第二个最大值
      second = nums[i];
      //③ 否则， 当 num 大于 second 时，说明找到了一个递增的三元组，返回 true
    } else {
      // 当当前元素大于第二个最大值时
      // 返回 true
      return true;
    }
  }
  return false;
};
```

### 注意📢

>  如果手写不出来` Number.MAX_SAFE_INTEGER` 可以参考下面写法

```javascript
const first =  Number.MAX_SAFE_INTEGER; 
const first = Math.min() // 返回无穷大 Infinity 


// 先定义两个最大值
let first = 2**31 -1;
let second = 2**31 -1;
```

>  `const  first =  Number.MAX_SAFE_INTEGER;` 
>  `const first =  2^31 -1 ;`

### 复杂度分析

## 错误记录
