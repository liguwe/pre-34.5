# 路径总和：是否存在根节点到叶子节点的路径和为 target

>  [112. 路径总和](https://leetcode.cn/problems/path-sum/)


```javascript
var hasPathSum = function (root, targetSum) {
    let res = false;
    let sum = 0;
    function traverse(root) {
        if (root === null) return;
        sum += root.val;
        if (root.left === null && root.right === null) {
            if (sum === targetSum) {
                res = true;
                return;
            }
        }
        traverse(root.left);
        traverse(root.right);
        sum -= root.val;
    }
    traverse(root);
    return res;
};
```
