# 翻转二叉树：翻转二叉树的两种解题思路

`#算法/二叉树` 

>  [226. 翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

## 总结

遍历的思路：
- **每一个节点**需要做的事就是交换它的左右子节点

```javascript
var invertTree = function (root) {
  function traverse(root) {
    if (!root) return;
    // 进入每个节点时，应该干什么？
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    traverse(root.left);
    traverse(root.right);
  }
  traverse(root);
  // 以 root 为根的这棵二叉树已经被翻转，返回 root
  return root;
};
```


> [!tip]
> 分解问题的思路：大概率是需要都有 **返回值的**

## 二叉树的解题总纲 - 两种思路

二叉树解题的思维模式分两类：

1、是否可以通过**遍历一遍二叉树**得到答案？如果可以，用一个 `traverse` 函数配合外部变量来实现，这叫 **「遍历」的思维模式**。

2、是否可以定义一个`递归函数`，**通过子问题（子树）的答案推导出原问题的答案**？如果可以，写出这个递归函数的定义，并充分利用这个函数的返回值，这叫 **「分解问题」的思维模式**。

无论使用哪种思维模式，你都需要思考：

**如果单独抽出一个二叉树节点，它需要做什么事情？需要在什么时候（前/中/后序位置）做？** 其他的节点不用你操心，递归函数会帮你在所有节点上执行相同的操作。

## 翻转二叉树

> [https://leetcode.cn/problems/invert-binary-tree/](https://leetcode.cn/problems/invert-binary-tree/)

### 遍历的思路

即，写一个递归函数`traverse` ，然后配合外部变量 `tmp` ，选择在是在 前、后、还是中序位置做，即可

```javascript
var invertTree = function(root) {
    var traverse = function(root) {
        if (root === null) {
            return;
        }
        /**** 前序位置 ****/
        // 每一个节点需要做的事就是交换它的左右子节点
        var tmp = root.left;
        root.left = root.right;
        root.right = tmp;
        // 遍历框架，去遍历左右子树的节点
        traverse(root.left);
        traverse(root.right);
    }
    // 遍历二叉树，交换每个节点的子节点
    traverse(root);
    return root;
};

```

`后序位置`也是可以的， 但不能是 `中序位置`，需要做些修改，如下：

```javascript
var invertTree = function (root) {
    const traverse = function (root) {
        if (root === null) {
            return;
        }
        
        traverse(root.left);
        
        // 中序位置
        let tmp = root.left;
        root.left = root.right;
        
        traverse(root.right);
        
        root.right = tmp;
    };

    // 遍历二叉树，交换每个节点的子节点
    traverse(root);
    return root;
};

```

### 分解问题的思路

即，写一个递归函数，然后这个**递归函数，会帮你在每个节点做同样的事情**。

```javascript
// 定义：将以 root 为根的这棵二叉树翻转，返回翻转后的二叉树的根节点
var invertTree = function (root) {
    if (root === null) {
        return null;
    }
    // 利用函数定义，先翻转左右子树
    // ::::翻转左子树
    var left = invertTree(root.left);
    // ::::翻转右子树
    var right = invertTree(root.right);

    // 然后交换左右子节点
    root.left = right;
    root.right = left;

    // 和定义逻辑自恰：以 root 为根的这棵二叉树已经被翻转，返回 root
    return root;
}
```
