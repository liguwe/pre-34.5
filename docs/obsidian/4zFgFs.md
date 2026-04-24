# 平衡二叉树

> [110. 平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

- **平衡二叉树** 是指该树所有节点的左右子树的高度相差不超过 1
- 不必要完全遍历完成，发现不满足的直接 return
- 需要在后序位置计算
- **分解问题**的思路

```javascript hl:10,18,20,24
var isBalanced = function (root) {
  // 记录二叉树是否平衡
  let res = true;
  // 输入一个节点，返回以该节点为根的二叉树的最大深度
  var maxDepth = function (root) {
    if (root === null) {
      return 0;
    }
    // 提前结束递归
    if (!res) {
      return;
    }
    let leftMaxDepth = maxDepth(root.left);
    let rightMaxDepth = maxDepth(root.right);

    // 后序遍历位置
    // 如果左右最大深度大于 1，就不是平衡二叉树
    if (Math.abs(rightMaxDepth - leftMaxDepth) > 1) {
      res = false;
    }

    return 1 + Math.max(leftMaxDepth, rightMaxDepth);
  };

  maxDepth(root);
  return res;
};

```
