# 把二叉搜索树转换为累加树：每个节点变成 `>=` 该节点的所有节点之和

`#BST` `#leetcode` `#二叉树/二叉搜索树` 

> [538. 把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)

## 总结

- 需要先遍历**右节点** ， 这样在中序位置的代码就是 **右 → 根节点** → 左
	- `sum = 所有右节点 + 根节点的值

## 1. 题目

![cos-blog-832-34-20241012|648](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240908115150.png)

```javascript
/**
 * @description 二叉搜索树转累加树
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var convertBST = function (root) {
  var sum = 0;

  var traverse = function (root) {
    if (root == null) {
      return;
    }
    // 需要反序中序遍历
    // 先进入右子树，再访问根节点，最后左子树
    // 所以中序遍历的逆序是：右 -> 根 -> 左
    // 计算累加和时，需要先遍历右子树，再累加根节点的值，最后遍历左子树
    traverse(root.right);
    /*****************
     * 中序遍历位置
     ****************/
    // 维护累加和
    sum += root.val;
    // 将 BST 转化成累加树
    root.val = sum;
    traverse(root.left);
  };

  traverse(root);

  // 返回根节点
  return root;
};
```
