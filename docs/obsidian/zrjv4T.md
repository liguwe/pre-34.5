# 交替合并字符串

`#算法/双指针`  `#2024/07/28` `#leetcode` 

## 题目

![image.png|576](https://832-1310531898.cos.ap-beijing.myqcloud.com/d4ea1f26f2d3ac5e04cf57f5500ed2e4.png)

### 题目重点

- 交替合并
- 最后的直接到末尾即可

## 思路

- 也是`双指针技巧`
- 从 `0` 开始

## 代码实现

```javascript
/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var mergeAlternately = function (word1, word2) {
  let res = ""; // 保存结果
  const m = word1.length;
  const n = word2.length;
  const max = Math.max(m, n); // 取最大长度
  for (let k = 0; k < max; k++) {
    // 如果k小于m, 则将word1的第k个字符加入到res中
    if (k < m) {
      res += word1[k];
    }
    // 如果k小于n, 则将word2的第k个字符加入到res中
    if (k < n) {
      res += word2[k];
    }
  }

  return res;
};

```

> **注意：就没有最后字符串拼接环节，正常遍历就好**

## 参考

- [https://leetcode.cn/problems/merge-strings-alternately/submissions/548008565/?envType=study-plan-v2&envId=leetcode-75](https://leetcode.cn/problems/merge-strings-alternately/submissions/548008565/?envType=study-plan-v2&envId=leetcode-75)
