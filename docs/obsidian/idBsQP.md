# 二叉搜索树的增删改查模板

`#BST` `#leetcode`  `#二叉树/二叉搜索树`   


```javascript
var BST = function (root, target) {
  if (root.val === target) {
    // 找到目标，做点什么
  }
  if (root.val < target) {
    BST(root.right, target);
  }
  if (root.val > target) {
    BST(root.left, target);
  }
};
```
