# N 叉树的后序遍历

> [590. N 叉树的后序遍历](https://leetcode.cn/problems/n-ary-tree-postorder-traversal/)



```javascript hl:9
var postorder = function (root) {
    let res = [];
    function traverse(root) {
        if (!root) return;
        for (let item of root.children) {
            traverse(item);
        }
        // 后序位置
        res.push(root.val);
    }
    traverse(root);
    return res;
};

```
