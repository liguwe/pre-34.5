# 二叉搜索树中的插入操作

> [701. 二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)


> [!tip]
> >  一旦涉及**改**，就  **类似二叉树的构造问题**，函数要返回 `TreeNode` 类型
> 并且要对递归调用的返回值进行**接收**


- 分解问题的思路
	- 递归的插入
		- `root.right = insertIntoBST(root.right, val);`
	- 注意返回值
```javascript
/**
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var insertIntoBST = function (root, val) {
  if (!root) return new TreeNode(val);
  if (root.val < val) {
    root.right = insertIntoBST(root.right, val);
  } else {
    root.left = insertIntoBST(root.left, val);
  }
  return root;
};
```
