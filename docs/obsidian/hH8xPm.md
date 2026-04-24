# 恢复二叉搜索树：恰好两个节点的值被错误地交换，请修正

> [99. 恢复二叉搜索树](https://leetcode.cn/problems/recover-binary-search-tree/)


原理：
1. **中序遍历特性**：BST的中序遍历应该是升序序列
2. **错误检测**：如果发现当前节点值小于前一个节点值，说明找到了错误位置
3. **节点记录**：
    - `第一个错误节点`是`第一次出现`逆序时较大的那个节点
    - `第二个错误节点`是`第二次出现`逆序时较小的那个节点

```javascript
var recoverTree = function(root) {
    let first = null;   // 第一个错误节点
    let second = null;  // 第二个错误节点
    let prev = new TreeNode(Number.MIN_SAFE_INTEGER);  // 前一个节点
    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        // 在中序遍历位置检查是否违反BST性质
        if (root.val < prev.val) {
            // 第一次找到逆序对时，记录第一个节点
            if (first === null) first = prev;
            // 持续更新第二个节点
            second = root;
        }
        prev = root;
        traverse(root.right);
    }
    traverse(root);
    // 交换两个错误节点的值
    if (first && second) {
        let temp = first.val;
        first.val = second.val;
        second.val = temp;
    }
};
```
