# 二叉树的前序遍历

> [144. 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)


```javascript hl:8
var preorderTraversal = function (root) {
  let res = [];

  function traverse(root) {
    if (!root) {
      return;
    }
    res.push(root.val);
    traverse(root.left);
    traverse(root.right);
  }

  traverse(root);

  return res;
};

```
