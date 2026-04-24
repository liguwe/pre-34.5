# 路径总和 II ：找到所有从根节点到叶子节点路径总和等于 target 的路径

> [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/)


思路：
- 找到所有路径
- 然后到叶子节点的时候判断下就行

```javascript hl:12
var pathSum = function (root, targetSum) {
    let res = [];
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        if (root.left === null && root.right === null) {
            let sum = 0;
            for (let item of path) {
                sum += item;
            }
            if (sum === targetSum) {
                res.push([...path]);
            }
        }
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }

    traverse(root, []);
    return res;
};
```
