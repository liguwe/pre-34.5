# 二叉搜索树中的中序后继：比 p.val 大的节点中键值最小的节点

`#leetcode-plus`  

> [285. 二叉搜索树中的中序后继](https://leetcode.cn/problems/inorder-successor-in-bst/)



- 如果当前节点值`大于p`的值
	- 那么`后继节点`可能是当前节点或者在当前节点的左子树中
- 如果当前节点值`小于等于 p`的值
	- 那么`后继节点`一定在当前节点的右子树中
- 不断更新 res，最终得到最接近p的大于p的节点

```javascript
var inorderSuccessor = function (root, p) {
    let res = null; // 后继节点
    let cur = root; // 当前节点
    while (cur) {
        // 当前节点值大于目标值，可能是后继
        // 记录当前节点，继续往左找更小的可能解
        if (cur.val > p.val) {
            res = cur;
            cur = cur.left;
            // 当前节点值小于等于目标值，后继一定在右子树
        } else {
            cur = cur.right;
        }
    }
    return res;
};
```

> 这个解法利用 BST的特性，不需要进行完整的中序遍历
