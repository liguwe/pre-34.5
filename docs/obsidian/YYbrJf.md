# 单词拆分 II：加空格生成多少种句子

> [140. 单词拆分 II](https://leetcode.cn/problems/word-break-ii/)


```javascript
var wordBreak = function (s, wordDict) {
    let n = s.length;
    let res = [];
    // index 代表遍历到 s 的第几个字符了
    function backtrack(track, index) {
        if (index === n) {
            res.push(track.join(" "));
        }
        if (index > n) return;
        for (let w of wordDict) {
            let len = w.length;
            // 单词太长了
            if (index + len > s.length) continue;
            // 获取子串
            let subStr = s.slice(index, index + len);
            // 不匹配
            if (subStr !== w) continue;
            track.push(w);
            backtrack(track, index + len);
            track.pop();
        }
    }

    backtrack([], 0);

    return res;
};
```
