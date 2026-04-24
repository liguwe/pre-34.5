# 最大连续1的个数 III：最多 k 次把 0 变成 1，数组中连续 1 的最大个数

> [1004. 最大连续1的个数 III](https://leetcode.cn/problems/max-consecutive-ones-iii/)


## 1. 总结

- 缩小条件：
	- 当窗口中需要替换的 `0` 的数量大于 k，缩小窗口
		- 即 `right - left - 0 的个数 > k`

```javascript
var longestOnes = function (nums, k) {
    let n = nums.length;
    let left = 0;
    let right = 0;
    let count = 0; // 当前窗口 1 的个数
    let res = 0;
    while (right < n) {
        if (nums[right] === 1) count++;
        right++;
        while (right - left - count > k) {
            if (nums[left] === 1) count--;
            left++;
        }
        res = Math.max(res, right - left);
    }
    return res;
};
```


## 2. 题目及理解

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/090a868fc6988e29390058bac437720d.png)

### 2.1. 原题不好理解，换种问法

> - 如果我可以改变`最多 k 个 0`，那么我能得到的`最长的连续 1 序列`有多长 ？ 
> - 看题目是：最大连续 1 的个数

## 3. 解题思路

1. 使用两个指针 `left` 和 `right`，初始都指向数组开头。
   1. 向右移动 right 指针，`扩大窗口`。
   2. 如果遇到 0，就将 k 减 1。
2. 当 k 小于 0 时，说明窗口内 0 的数量超过了允许的最大值，这时需要`收缩窗口`：
   - 移动 left 指针
   - 如果 left 指针经过的是 0，就将 k 加 1
3. 在`每次迭代中`更新最大窗口长度。

## 4. 代码实现
```javascript
/**
 * @param {number[]}  nums
 * @param {number} k  0 的个数
 * @return {number}
 */
var longestOnes = function (nums, k) {
  // 左指针
  let left = 0;
  // 右指针
  let right = 0;

  // 结果：最长的连续的 1 的个数
  let res = 0;

  // 向右移动 right 指针，扩大窗口
  for (; right < nums.length; right++) {
    // 如果遇到 0，就将 k 减 1
    // 如果当前数字是 0，就减少可用的 k
    if (nums[right] === 0) {
      k--;
    }

    // 如果 k 小于 0，需要移动左指针
    // 说明窗口内 0 的数量超过了允许的最大值，这时需要收缩窗口
    if (k < 0) {
      // 如果左指针指向的是 0，增加可用的 k
      if (nums[left] === 0) {
        k++;
      }
      left++;
    }

    // 在每次迭代中更新最大窗口长度
    res = Math.max(res, right - left + 1);
  }

  return res;
};

```

> 为什么是 `right - left + 1`，而不是 `right - left` ？
> - 在数组中，索引是从 0 开始的。例如，如果 `left = 0，right = 3`，那么实际上包含了 4 个元素（`索引 0, 1, 2, 3`）

### 4.1. 复杂度分析

- 时间复杂度：`O(n)`，其中 n 是数组的长度。我们只遍历了一次数组。
- 空间复杂度：`O(1)`，我们只使用了常数额外空间

## 5. 错误记录
