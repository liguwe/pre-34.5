# 删除给定值的叶子节点

> [1325. 删除给定值的叶子节点](https://leetcode.cn/problems/delete-leaves-with-a-given-value/)


- `返回 null` 代表删除
- 后序位置

```javascript  hl:7
var removeLeafNodes = function (root, target) {
    if (root === null) return null;

    root.left = removeLeafNodes(root.left, target);
    root.right = removeLeafNodes(root.right, target);
    // 后序遍历位置
    // 此时节点 root 直到自己是否需要被删除
    if (root.val === target && root.left === null && root.right === null) {
        return null;
    }
    return root;
};
```
