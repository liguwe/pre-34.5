# 二叉树剪枝：返回移除了所有不包含 1 的子树的原二叉树

`#二叉树/分解问题` 

> [814. 二叉树剪枝](https://leetcode.cn/problems/binary-tree-pruning/)


分解问题的思路

- 这道题的难点在于**要一直剪枝**
	- 直到没有值为 0 的叶子节点为止
	- 只有从**后序遍历位置自底向上处理**才能获得最高的效率

> 分解问题，递归很巧妙吧

```javascript
var pruneTree = function (root) {
    if (!root) return null;
    root.left = pruneTree(root.left);
    root.right = pruneTree(root.right);
    // 后序遍历位置
    // 判断自己是否是值为 0 的叶子节点
    if (root.val === 0 && root.left === null && root.right === null) {
        // 返回值会被父节点接收，相当于把自己删掉了
        return null;
    }
    // 如果不是，正常返回
    return root;
};
```
