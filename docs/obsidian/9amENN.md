# 二叉树中第二小的节点：root 总是小于子节点，找第二小的值

>  [671. 二叉树中第二小的节点](https://leetcode.cn/problems/second-minimum-node-in-a-binary-tree/)

题意：
- 给定一个特殊的二叉树：
	- 每个节点要么有 0 个子节点
	- 要么有 2 个子节点
- 如果一个节点有两个子节点
	- 那么`这个节点的值`等于`两个子节点中较小的那个值`
- 需要找到整棵树中第二小的值，如果不存在第二小的值则返回 `-1`


思路：
1. `根节点`一定是整棵树中`最小的值`
2. `第二小的值`一定比根节点值大
3. 找到`比根节点大`的最小值

重点：
- 分解问题的思路：`findMin`

```javascript
var findSecondMinimumValue = function (root) {
    if (!root) return -1; // 树为空
    if (!root.left && !root.right) return -1; // 没有子节点
    // 获取根节点的值（最小值）
    const rootValue = root.val;
    function findMin(node) {
        if (!node) return -1;
        // 如果当前节点值大于根节点值，直接返回当前值
        if (node.val > rootValue) return node.val;
        const left = findMin(node.left);
        const right = findMin(node.right);
        // 如果左子树没找到（返回-1），返回右子树的结果
        if (left === -1) return right;
        // 如果右子树没找到（返回-1），返回左子树的结果
        if (right === -1) return left;
        // 如果左右子树都找到了值，返回较小的那个
        return Math.min(left, right);
    }
    return findMin(root);
};
```
