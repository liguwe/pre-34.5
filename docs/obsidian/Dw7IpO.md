# 从字符串中移除星号

`#leetcode`  `#算法/栈`  `#done` 

## 1. 题目及理解

![image.png600|640](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407271718841.png?imageSlim)

## 2. 解题思路

1.  我们使用一个`栈`来存储字符。
2.  遍历输入字符串 `s` 中的每个字符：
    - 如果当前字符`不是星号`，我们就把它`推入栈`中。
    - 如果当前字符`是星号`，我们就从`栈顶弹出一个字符`（如果栈不为空）。
3. 最后，栈中剩下的字符就是我们的结果。
	- 我们使用 `join()` 方法将栈中的字符连接成一个字符串

## 3. 代码实现

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var removeStars = function (s) {
  // 使用栈
  let stack = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "*") {
      stack.pop();
    } else {
      stack.push(s[i]);
    }
  }
  return stack.join("");
};

```

### 3.1. 复杂度分析

- 时间复杂度是 `O(n)`，其中 n 是字符串的长度。
- 空间复杂度也是 `O(n)`，因为在最坏的情况下（没有星号）

## 4. 错误记录
