# 二叉搜索树中的搜索

> [700. 二叉搜索树中的搜索](https://leetcode.cn/problems/search-in-a-binary-search-tree/)

## 1. 总结

>  注意返回值

```javascript
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var searchBST = function (root, val) {
  if (!root) return null;
  if (root.val === val) {
    return root;
  }
  if (root.val > val) {
    return searchBST(root.left, val);
  } else {
    return searchBST(root.right, val);
  }
  return root;
};
```

## 2. 在 BST 中搜索一个节点 

### 2.1. 遍历一遍找到目标节点

```javascript
var searchBST = function (root, target) {
  if (root === null) {
    return null;
  }
  // base case: root 为 null 时，返回 null
  if (root.val === target) {
    return root;
  }
  // 左子树中搜索
  let left = searchBST(root.left, target);
  if (left) {
    return left;
  }
  // 右子树中搜索
  let right = searchBST(root.right, target);
  if (right) {
    return right;
  }
  // 没有找到目标值
  return null;
};

```

### 2.2. 利用 BST 的左小右大的特性

```javascript
var searchBST = function (root, target) {
  if (root === null) {
    return null;
  }
  // base case: root 为 null 时，返回 null
  if (root.val === target) {
    return root;
  }
  // 如果目标值小于当前节点值，搜索左子树
  if (target < root.val) {
    return searchBST(root.left, target);
  }
  // 如果目标值大于当前节点值，搜索右子树
  if (target > root.val) {
    return searchBST(root.right, target);
  }
  return null;
};

```
