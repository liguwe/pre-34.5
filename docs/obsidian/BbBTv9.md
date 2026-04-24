# 至少有 K 个重复字符的最长子串

> [395. 至少有 K 个重复字符的最长子串](https://leetcode.cn/problems/longest-substring-with-at-least-k-repeating-characters/)


滑动窗口的写法，没搞出来，可使用**分治&递归**的写法，更容易理解写，主要步骤如下：
1. **基本情况判断**
    - 如果字符串长度小于`k`，不可能满足条件，返回0
2. **统计字符频率**
    - 遍历字符串，统计每个字符出现的次数
3. **寻找分割点**
    - 找到`第一个出现次数小于 k 的字符`作为`分割点`
    - 如果没有这样的字符，说明当前字符串已满足条件
4. **递归处理**
    - 用出现次数小于k 的字符分割字符串
    - 对每个子串`递归`处理
    - 返回所有子串中最长的有效子串长度

```javascript
var longestSubstring = function (s, k) {
    // ①  如果字符串长度小于k，直接返回0
    if (s.length < k) return 0;

    // ② 统计字符频率
    const mapping = {};
    for (let c of s) {
        mapping[c] = (mapping[c] || 0) + 1;
    }

    // ③ 寻找分割点几分割字符
    let split = false;
    let splitChar = "";
    for (let key of Object.keys(mapping)) {
        if (mapping[key] < k) {
            split = true;
            splitChar = c;
            break;
        }
    }

    // 如果所有字符出现次数都大于等于k，返回整个字符串长度
    if (!split) return s.length;

    // 否则，以出现次数小于k的字符为分割点，递归处理子串
    let substrings = s.split(splitChar);
    let maxLen = 0;
    for (let substr of substrings) {
        maxLen = Math.max(maxLen, longestSubstring(substr, k));
    }

    return maxLen;
};
```
