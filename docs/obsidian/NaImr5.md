# 替换后的最长重复字符：替换 k 次后最长重复字符数

> [424. 替换后的最长重复字符](https://leetcode.cn/problems/longest-repeating-character-replacement/)


```javascript
输入：s = "ABAB", k = 2
输出：4
解释：用 2 次操作可以将 "ABAB" 变成 "AAAA"，方法是：
- 将第 2 个字符 'B' 改为 'A'
- 将第 4 个字符 'B' 改为 'A'
最终得到最长的包含相同字母的子串 "AAAA"，长度为 4。

```


> - `s` 仅由**大写英文字母**组成


- 关键点：
	- 缩小窗口的逻辑：
		- `当前窗口长度 - 当前窗口出现的最多字符的次数 > 需要替换的字符数`
	- left 和 right 变化时都得需要更新`当前窗口出现的最多字符的次数`
		- 即更新 maxCount
	- 在每次窗口调整后**再更新结果**


```javascript hl:14,15
var characterReplacement = function (s, k) {
    let n = s.length;
    let left = 0;
    let right = 0;
    let mapping = {};
    let res = 0;

    while (right < n) {
        let c = s[right];
        mapping[c] = (mapping[c] || 0) + 1;
        right++; //扩大窗口

        let maxCount = getMaxCount();
        // 当前窗口长度 - 当前窗口出现的最多字符的次数 > 需要替换的字符数
        // 当需要替换的字符数大于 k 时，才需要缩小窗口
        while (right - left - maxCount > k) {
            let c = s[left];
            mapping[c]--;
            if (mapping[c] === 0) delete mapping[c];
            left++;
            maxCount = getMaxCount(); // 更新最大计数
        }
        res = Math.max(res, right - left);
    }

    return res;

    function getMaxCount() {
        let vals = Object.values(mapping);
        return vals.length > 0 ? Math.max(...vals) : 0;
    }
};

```
