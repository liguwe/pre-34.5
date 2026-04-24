# 二叉搜索树中的中序后继 II：包含 parent节点

>  [510. 二叉搜索树中的中序后继 II](https://leetcode.cn/problems/inorder-successor-in-bst-ii/)


同 [285. 二叉搜索树中的中序后继：比 p.val 大的节点中键值最小的节点](/78Abae)，但有几个限制
- 节点定义中包含 `parent` 指针
- **不给定树的根节点**，只给定某个节点 node
- 需要找到给定节点的中序后继节点


思路：
- 情况1：如果有右子树
	- 后继在右子树的最左节点
-  情况2：如果没有右子树
	- 向上找第一个"**当前节点是其父节点的左子节点**"的节点

```javascript
var inorderSuccessor = function (node) {
    // 情况1：如果有右子树，后继在右子树的最左节点
    if (node.right) {
        node = node.right;
        while (node.left) {
            node = node.left;
        }
        return node;
    }
    // 情况2：如果没有右子树，向上找第一个"当前节点是其父节点的左子节点"的节点
    while (node.parent && node.parent.right === node) {
        node = node.parent;
    }
    return node.parent;
};
```
