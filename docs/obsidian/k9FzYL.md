# 重复的DNA序列

> [187. 重复的DNA序列](https://leetcode.cn/problems/repeated-dna-sequences/)

## 思路一：使用 Set + 遍历一遍

注意点：
- for 循环条件 ：`i + 10 <= 10`
- 最后结果记得去重

```javascript hl:13,8,5
var findRepeatedDnaSequences = function (s) {
    let n = s.length;
    let res = [];
    let S = new Set();
    for (let i = 0; i + 10 <= n; i++) {
        let str = s.substring(i, i + 10);
        // 找到一个重复的
        if (S.has(str)) {
            res.push(str);
        }
        S.add(str);
    }
    // 记得需要去重
    return [...new Set(res)];
};

```

## 思路二：滑动窗口

```javascript
var findRepeatedDnaSequences = function (s) {
    let S = new Set();
    let res = new Set();
    let left = 0;
    let right = 0;
    while (right < s.length) {
        // 扩大窗口，移入字符
        right++;
        // 当子串的长度达到要求
        if (right - left == 10) {
            let str = s.substring(left, right);
            if (S.has(str)) {
                res.add(str);
            }
            S.add(str);
            // 缩小窗口，移出字符
            left++;
        }
    }
    return [...res];
};
```

## 思路三：更好的办法

更好的办法是 [Rabin-Karp 滚动哈希算法](https://labuladong.online/algo/practice-in-action/rabinkarp/ "null")，一边移动滑动窗口一边快速计算窗口内字符串的哈希值

> 这里先不看了，这到有这种算法就行
