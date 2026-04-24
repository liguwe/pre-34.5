# 二叉树中的最大路径和：不一定经过根节点，可以从左到右边

>  [124. 二叉树中的最大路径和](https://leetcode.cn/problems/binary-tree-maximum-path-sum/)


```javascript
var maxPathSum = function (root) {
  let res = Number.MIN_SAFE_INTEGER;
  // 定义：计算从根节点 root 为起点的最大单边路径和
  function oneSideMax(root) {
    if (root === null) {
      return 0;
    }
    let leftMaxSum = Math.max(0, oneSideMax(root.left));
    let rightMaxSum = Math.max(0, oneSideMax(root.right));
    // 后序遍历位置，顺便更新最大路径和
    let pathMaxSum = root.val + leftMaxSum + rightMaxSum;
    res = Math.max(res, pathMaxSum);
    // 实现函数定义，左右子树的最大单边路径和加上根节点的值
    // 就是从根节点 root 为起点的最大单边路径和
    return Math.max(leftMaxSum, rightMaxSum) + root.val;
  }
  // 计算单边路径和时顺便计算最大路径和
  if (root === null) {
    return 0;
  }
  oneSideMax(root);
  return res;
};
```
