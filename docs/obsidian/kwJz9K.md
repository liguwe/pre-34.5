# 定长子串中元音的最大数目

`#leetcode`  `#算法/滑动窗口`

## 题目及理解

![image.png|624](https://832-1310531898.cos.ap-beijing.myqcloud.com/019ec18db0ccfeb560170c4fd4b24b5a.png)

## 解题思路

1. 使用`滑动窗口`技术，维护一个`固定长度为 k 的窗口`。
2. 在窗口内统计元音字母的数量。
3. 随着窗口的滑动，更新元音字母的数量，并记录最大值。

## 代码实现

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */

var maxVowels = function (s, k) {
  // 辅助函数：判断字符是否为元音
  const isVowel = (c) => {
    return ["a", "e", "i", "o", "u"].includes(c);
  };

  // 结果
  let res = 0;
  // 记录滑动窗口中的元音字母个数，即【滑动窗口】中的元音字母个数，用于更新 res 的值
  let count = 0;

  // 初始化滑动窗口,先统计前 k 个元素中的元音字母个数
  for (let i = 0; i < k; i++) {
    if (isVowel(s[i])) {
      count++;
    }
  }

  // 更新 res 的值
  res = count;

  // 开始滑动窗口，从 k 开始，每次移动一位，动态维护 count 和 res 的值
  for (let i = k; i < s.length; i++) {
    // 先移除滑动窗口的前一个元素，如果是元音字母，则 count 减一
    if (isVowel(s[i - k])) {
      count--;
    }
    // 新添加的元素是元音字母，则 count 加一
    if (isVowel(s[i])) {
      count++;
    }
    // 更新 res 的值
    res = Math.max(res, count);
    // 如果 res 等于 k，直接返回 k,可以提前结束循环
    if (res === k) {
      break;
    }
  }

  return res;
};

```

> - 真正滑动窗口时，
>    - 需要先判断上一个字母是否元音，是的话，`count --`
>    - 然后再判断当前的元素，是的话，`count++`

### 复杂度分析

- 时间复杂度是 O(n)，其中 n 是字符串的长度。我们只需要遍历一次字符串
- 空间复杂度是 O(1)，因为我们只使用了几个变量来存储状态，不需要额外的数据结构

优化点：

1. 使用`**Set**`来存储元音字母集合，可以稍微提高查找效率。
2. 当找到长度为 k 的全是元音的子串时，`**可以提前结束循环**`，因为这已经是最大可能值。

## 错误记录
