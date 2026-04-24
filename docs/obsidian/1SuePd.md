# 序列化和反序列化二叉搜索树

> [449. 序列化和反序列化二叉搜索树](https://leetcode.cn/problems/serialize-and-deserialize-bst/)


>  本题的关键点：序列化和反序列化是对应的，互相依赖的

## 1. 思路一

当然可以复用 [449. 序列化和反序列化二叉搜索树](/1SuePd) 的代码，完全能通过所有用例

## 2. 思路二：利用 BST 的特性，优化存储空间

### 2.1. 利用BST特性优化序列化

BST的一个重要特性是：**前序遍历的结果可以唯一确定一棵BST，不需要存储空节点标记"#"**。

> [!danger]
> 注意是：是前序遍历，因为：
> - ① 前序遍历顺序：根节点 -> 左子树 -> 右子树
> - ② 在BST中，这个序列具有特殊含义：每个节点都可以作为后续节点的范围界定

```javascript
var serialize = function(root) {
    let res = [];
    // 只需要前序遍历，不需要记录空节点
    function preorder(root) {
        if (!root) return;
        res.push(root.val);
        preorder(root.left);
        preorder(root.right);
    }
    preorder(root);
    return res.join(',');
};
```

### 2.2. 优化反序列化

利用BST的性质，我们可以通过值的大小关系来重建树，而不是依赖于"`#`"标记。

> 主要参数：`build(values, min, max) {`


```javascript
var deserialize = function(data) {
    if (!data) return null;
    const values = data.split(',').map(Number);
    function build(values, min, max) {
        if (values.length === 0) return null;
        // 如果当前值不在合法范围内，说明应该返回null
        if (values[0] < min || values[0] > max) return null;
        const val = values.shift();
        const root = new TreeNode(val);
        // 递归构建左右子树
        root.left = build(values, min, val);
        root.right = build(values, val, max);
        return root;
    }
    return build(values, -Infinity, Infinity);
};
```

### 2.3. 完整优化后的代码

```javascript
var serialize = function(root) {
    const res = [];
    function preorder(node) {
        if (!node) return;
        res.push(node.val);
        preorder(node.left);
        preorder(node.right);
    }
    preorder(root);
    return res.join(',');
};

var deserialize = function(data) {
    if (!data) return null;
    const values = data.split(',').map(Number);
    function build(values, min, max) {
        if (values.length === 0) return null;
        if (values[0] < min || values[0] > max) return null;
        const val = values.shift();
        const root = new TreeNode(val);
        root.left = build(values, min, val);
        root.right = build(values, val, max);
        return root;
    }
    
    return build(values, -Infinity, Infinity);
};
```
