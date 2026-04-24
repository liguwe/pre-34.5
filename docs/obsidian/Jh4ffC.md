# 从叶结点开始的最小字符串

>  [988. 从叶结点开始的最小字符串](https://leetcode.cn/problems/smallest-string-starting-from-leaf/)

## 1. 思路一

- 还是找到所有路径
- 然后使用 `abcdefghijklmnopqrstuvwxyz` 映射成字符串
- 使用内置的 reverse 和 sort 排好序，
- 然后返回第一个即可

```javascript
var smallestFromLeaf = function (root) {
    let res = [];
    function traverse(root, path) {
        if (!root) {
            return;
        }
        if (!root.left && !root.right) {
            path.push(root.val);
            res.push([...path]);
            path.pop();
        }
        path.push(root.val);
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }

    traverse(root, []);

    let chars = "abcdefghijklmnopqrstuvwxyz";
    res = res.map((item) => {
        return item.map((it) => {
            return chars[it];
        });
    });
    res = res.map((item) => {
        return item.reverse().join("");
    });
    res.sort();

    return res[0];
};
```

## 2. 思路二：用 `path` 维护递归遍历的路径，到达叶子节点的时候判断字典序最小的路径

这种解法不需要那么多代码

可能需要 `charCodeAt` 方法
