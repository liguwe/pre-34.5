# 二叉树的中序遍历

> [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)


```javascript hl:6
var inorderTraversal = function (root) {
    let res = [];
    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        res.push(root.val);
        traverse(root.right);
    }
    traverse(root);
    console.log(res);
    return res;
};
```
