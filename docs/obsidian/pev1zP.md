# 匹配子序列的单词数： words中是 s 的子序列的单词个数

`#数组/双指针` `#算法/二分搜索` 

>  [792. 匹配子序列的单词数](https://leetcode.cn/problems/number-of-matching-subsequences/)

## 思路一：

- 使用 [392. 判断子序列](/O168OS) ，遍历单词列表即可

```javascript
var numMatchingSubseq = function (s, words) {
  let res = 0;
  for (let item of words) {
    if (isSubsequence(item, s)) {
      res++;
    }
  }
  return res;
};
var isSubsequence = function (s, t) {
  let slow = 0;
  let fast = 0;
  while (fast < t.length) {
    if (s[slow] === t[fast]) {
      slow++;
    }
    fast++;
  }
  return slow === s.length;
};
```

>  上面代码不能通过所有用例

## 思路二：使用二分搜索

>  没太理解，Pass 吧，以后有机会再练
