# 递增顺序搜索树： BST转成单链表

`#链表` `#树与链表`

>  [897. 递增顺序搜索树](https://leetcode.cn/problems/increasing-order-search-tree/)


1. 创建一个虚拟头节点 `d`
2. 使用中序遍历（左->根->右）访问所有节点
3. 在遍历过程中：
    - 将当前节点的左子树置为 null
    - 将当前节点连接到 `p` 的右子节点
    - 更新 `p` 指针
4. 返回 d.right 作为新树的根节点

```javascript
var increasingBST = function (root) {
    // 创建一个虚拟头节点
    let d = new TreeNode(0);
    // p 用于记录当前处理的节点：p 指针
    let p = d;
    // 中序遍历函数
    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        root.left = null;
        p.right = root;
        p = root;
        traverse(root.right);
    }
    traverse(root);
    return d.right;
};
```

## 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250216-1.png)
