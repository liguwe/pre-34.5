# 合并二叉树：两个树强强组合

> [617. 合并二叉树](https://leetcode.cn/problems/merge-two-binary-trees/)


注意：分解问题都有返回值

```javascript
// 定义：输入两棵树的根节点，返回合并后的树的根节点
// 如果一棵树非空，那么合并后就是另一棵树
var mergeTrees = function (root1, root2) {
    if (root1 == null) {
        return root2;
    }
    if (root2 == null) {
        return root1;
    }
    // 两棵树都有的节点，叠加节点值
    root1.val += root2.val;
    // 利用函数定义，子树合并后接到
    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);
    return root1;
};
```
