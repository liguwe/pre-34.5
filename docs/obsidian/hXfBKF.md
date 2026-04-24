# 完全二叉树的节点个数

> [222. 完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

## 思路一：遍历一遍的思路

```javascript
var countNodes = function(root) {
    let res = 0;
    function traverse(root){
        if(!root) return;
        res++;
        traverse(root.left);
        traverse(root.right);
    }
    traverse(root)
    return res;
};
```

## 思路二：使用完全二叉树的特性

```javascript hl:11,17
var countNodes = function (root) {
    if (!root) return 0;

    // 计算树的高度
    let leftHeight = 0;
    let rightHeight = 0;
    let left = root;
    let right = root;

    // 计算左边界高度
    while (left) {
        leftHeight++;
        left = left.left;
    }

    // 计算右边界高度
    while (right) {
        rightHeight++;
        right = right.right;
    }

    // 如果左右高度相同，说明是满二叉树
    if (leftHeight === rightHeight) {
        return 2 ** leftHeight - 1;
    }

    // 否则递归计算
    return 1 + countNodes(root.left) + countNodes(root.right);
};
```
