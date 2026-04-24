# 字符串解码

`#算法/栈` 

>  [394. 字符串解码](https://leetcode.cn/problems/decode-string/)


## 题目及理解

![image.png600|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407280730257.png?imageSlim)

## 解题思路

**栈结构**可以很好地处理嵌套问题
1. **使用两个栈**：
    - 一个栈存储重复次数（数字部分）。
    - 另一个栈存储字符串（字符部分）。
2. **遍历字符串**：
    - ① 遇到`数字`时，将完整的数字提取出来。
    - ② 遇到 `[` 时，表示接下来会是一个新的子字符串，准备入栈。
    - ③ 遇到 `]` 时，表示当前子字符串结束，需要出栈并进行处理重复。
    - ④ 遇到`普通字符`时，直接累加到当前的字符串段中。

## 代码实现

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
  // ① 使用两个栈，分别存储倍数和字符串
  let countStack = [];
  let strStack = [];
  // 代表当前的字符串
  let currentStr = "";
  //代表出现的次数
  let k = 0;
  // 遍历字符串
  for (let i = 0; i < s.length; i++) {
    // ①
    // 如果是数字，可能是多位数，比如 "12[abc]"，所有处理两次遍历到的数字，计算出真正的数字
    // 例如：第一次遍历到的是1，第二次遍历到的是2，那么真正的数字就是 1 * 10 + 2 = 12
    if (!isNaN(s[i])) {
      k = k * 10 + parseInt(s[i]);
    }
    // ② 如果是左括号
    else if (s[i] === "[") {
      // 将出现的次数入栈
      countStack.push(k);
      // 字符串入栈
      strStack.push(currentStr);
      // 重置出现次数和字符串
      k = 0;
      currentStr = "";
    }
    // ③ 如果是右括号
    else if (s[i] === "]") {
      // 出栈
      let count = countStack.pop();
      // 出栈
      let str = strStack.pop();
      // 拼接字符串
      currentStr = str + currentStr.repeat(count);
    }
    // ④ 如果是字母，即普通字符，更新当前字符串，用于后面拼接逻辑
    else {
      // 拼接字符串, 例如 "abc"，"abc" 就是一个字符串
      // 例如 "12[abc]"，"abc" 就是一个字符串
      currentStr += s[i];
    }
  }
  return currentStr;
};

```

### 复杂度分析

- **时间复杂度**：
    - 遍历字符串的次数为 `O(n)`，每个字符在栈中操作的时间为 `O(1)`，所以总时间复杂度为 `O(n)`。
- **空间复杂度**：
    - 空间复杂度主要由栈占用，最坏情况下需要 `O(n)` 的空间，因为所有字符和数字可能都需要入栈。

## 错误记录
