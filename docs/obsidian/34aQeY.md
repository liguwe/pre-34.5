# 数组中重复的数据：找出所有出现 两次 的整数，并以数组形式返回

`#算法/哈希`

>  [442. 数组中重复的数据](https://leetcode.cn/problems/find-all-duplicates-in-an-array/)


注意：
- res 的元素是整数，所以需要 `parseInt` 下

```javascript
var findDuplicates = function (nums) {
    let obj = {};
    for (let item of nums) {
        obj[item] = (obj[item] || 0) + 1;
    }
    let res = [];
    for (let key of Object.keys(obj)) {
        if (obj[key] === 2) {
            res.push(parseInt(key))
        }
    }
    return res;
};
```
