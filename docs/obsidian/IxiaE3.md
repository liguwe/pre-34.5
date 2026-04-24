# 寻找数组的中心下标

`#leetcode` `#算法/前缀和`  

## 1. 总结

```javascript hl:8,9,11
var pivotIndex = function (nums) {
    // 构造前缀和
    let n = nums.length;
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        preSum[i] = preSum[i - 1] + nums[i - 1];
    }
    // 0 ~ i 之间的元素和为 preSum[i] - preSum[0]
    // i + 1 ~ n 之间的元素和为 preSum[n] - preSum[i + 1]
    for (let i = 0; i < n; i++) {
        if (preSum[i] - preSum[0] === preSum[n] - preSum[i + 1]) {
            return i;
        }
    }
    return -1;
};
```

>  注意 i 不参与计算

## 2. 题目及理解

![image.png|672](https://832-1310531898.cos.ap-beijing.myqcloud.com/806cae66a6a82c0cf9ac12cab22d1c66.png)

## 3. 解题思路

- 前缀和 `preSum`
- 假设原数组 nums = `[1, 7, 3, 6, 5, 6]`
   - 前缀和数组 `prefixSum` 就会是：`[0, 1, 8, 11, 17, 22, 28]`
      - 长度为 `length + 1 ` 
      - 第一个元素为 `0`，表示前 `0` 个元素的和
      - `preSum[i]` 表示前 `i` 个元素的和

## 4. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
  // 前缀和数组
  // 注意：前缀和数组的长度为 nums.length + 1，第一个元素为 0，表示前 0 个元素的和
  // preSum[i] 表示前 i 个元素的和
  // 这种方式可以：避免判断边界条件
  let preSum = new Array(nums.length + 1).fill(0);
  // 初始化前缀和数组
  for (let i = 1; i <= nums.length; i++) {
    // 当前元素的前缀和 = 前一个元素的前缀和 + 当前元素
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }
  // 根据前缀和判断左半边数组和右半边数组的元素和是否相同
  for (let i = 0; i < nums.length; i++) {
    // 当前元素之前的元素和 = 当前元素之后的元素的和
    // 当前元素右边的元素和 = 当前元素之前的元素的和，
    // 注意①：当前元素不参与计算
    // 注意②：preSum[nums.length] 表示整个数组的和
    // 注意③：当前元素右边的元素和 = 整个数组的和 - 当前元素之后的元素的前缀和
    if (preSum[i] === preSum[nums.length] - preSum[i + 1]) {
      return i;
    }
  }
  return -1;
};
```

### 4.1. 复杂度分析

## 5. 错误记录

- 而`当前元素`不参与计算
- 注意前缀和初始化遍历是从`1` 开始的
