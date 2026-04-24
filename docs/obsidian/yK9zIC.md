# 翻转等价二叉树：判断这两棵二叉树是否是翻转等价的

>  [951. 翻转等价二叉树](https://leetcode.cn/problems/flip-equivalent-binary-trees/)


```javascript
var flipEquiv = function (root1, root2) {
  // 定义：输入两棵二叉树，判断这两棵二叉树是否是翻转等价的
  // 判断 root1 和 root2 两个节点是否能够匹配
  if (root1 == null && root2 == null) {
    return true;
  }
  if (root1 == null || root2 == null) {
    return false;
  }
  if (root1.val != root2.val) {
    return false;
  }
  // 根据函数定义，判断子树是否能够匹配
  // 不翻转、翻转两种情况满足一种即可算是匹配
  return (
    // 不翻转子树
    (flipEquiv(root1.left, root2.left) &&
      flipEquiv(root1.right, root2.right)) ||
    // 反转子树
    (flipEquiv(root1.left, root2.right) &&
     flipEquiv(root1.right, root2.left))
  );
};
```
