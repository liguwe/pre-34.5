# 至多包含 K 个不同字符的最长子串：找出至多包含 k 个 不同 字符的最长子串

> [340. 至多包含 K 个不同字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-most-k-distinct-characters/)


- `res` 的更新为止，需要在第二个 `while` 循环之后
- 注意同步更新 `count` 

```javascript hl:17,16,22
var lengthOfLongestSubstringKDistinct = function (s, k) {
    let n = s.length;
    let left = 0;
    let right = 0;
    let mapping = {};
    let res = 0;
    while (right < n) {
        let c = s[right];
        mapping[c] = (mapping[c] || 0) + 1;
        right++;
        let count = Object.keys(mapping).length;
        while (count > k) {
            let c = s[left];
            mapping[c]--;
            if (mapping[c] === 0) {
                delete mapping[c];
                count--;
            }
            left++;
        }
        // 更新结果（移到这里）
        res = Math.max(res, right - left);
    }
    return res;
};
```
