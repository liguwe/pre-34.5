# 字符串中的第一个唯一字符

`#算法/哈希`

> [387. 字符串中的第一个唯一字符](https://leetcode.cn/problems/first-unique-character-in-a-string/)

## 思路一：使用哈希

```javascript
var firstUniqChar = function (s) {
    let obj = {};
    for (let c of s) {
        obj[c] = (obj[c] || 0) + 1;
    }
    for (let i = 0; i < s.length; i++) {
        if (obj[s[i]] === 1) {
            return i;
        }
    }
    return -1;
};
```

注意点：
- 使用 `Object.keys(obj).findIndex()`会返回哈希表中键的索引，而不是原字符串中字符的索引

## 思路二：使用字符串的 `indexOf` 和 `lastIndexOf` 方法

```javascript
var firstUniqChar = function(s) {
    for (let i = 0; i < s.length; i++) {
        // 如果字符第一次出现的位置和最后一次出现的位置相同
        // 说明该字符只出现了一次
        if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) {
            return i;
        }
    }
    return -1;
};
```
