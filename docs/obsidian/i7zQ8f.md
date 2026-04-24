# 最近公共祖先问题合集

`#leetcode` `#二叉树` `#二叉树/公共祖先问题`

## 1. 从二叉树中寻找一个元素

### 1.1. 基本写法：完整搜索

```javascript
/**
 * @description 从二叉树中寻找一个元素
 * @param {TreeNode} root
 * @param {number} val
 */
var find = function (root, val) {
  if (root == null) {
    return null;
  }
  if (root.val == val) {
    return root;
  }
  let left = find(root.left, val);
  let right = find(root.right, val);
  return left || right;
};

```

### 1.2. 优化： 如果已经在左子树找到了，就不需要再去右子树找了

```javascript
/**
 * 优化： 如果已经在左子树找到了，就不需要再去右子树找了
 * @description 从二叉树中寻找一个元素
 * @param {TreeNode} root
 * @param {number} val
 */
var find1 = function (root, val) {
  if (root == null) {
    return null;
  }
  if (root.val == val) {
    return root;
  }
  let left = find1(root.left, val);
  if (left) {
    return left;
  }
  let right = find1(root.right, val);
  if (right) {
    return right;
  }
};
```

### 1.3. 二叉树中寻找值为 `val1` 或 `val2` 的节点

```javascript
/**
 * @description 定义：在以 root 为根的二叉树中寻找值为 val1 或 val2 的节点
 */
var find2 = function (root, val1, val2) {
  if (root == null) {
    return null;
  }
  if (root.val == val1 || root.val == val2) {
    return root;
  }
  let left = find2(root.left, val1, val2);
  let right = find2(root.right, val1, val2);

  return left || right;
};
```

## 2. 习题合集

- [236. 二叉树的最近公共祖先：p 和 q 一定在树中](/girmqX)
- [1676. 二叉树的最近公共祖先 IV：多个节点的最近公共祖先](/n6HWjL)
- [1644. 二叉树的最近公共祖先 II：p 和 q 不一定在树中](/6tx0fR)
- [1650. 二叉树的最近公共祖先 III：包含 parent 指针](/A2JDq8)
- [235. 二叉搜索树的最近公共祖先：p 和 q 一定在树中](/cuYdyX)
- [1740. 找到二叉树中的距离：p 到 q 的路径上边的数目](/t0kp1N)
