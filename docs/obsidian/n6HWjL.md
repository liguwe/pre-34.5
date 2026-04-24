# 二叉树的最近公共祖先 IV：多个节点的最近公共祖先

> [1676. 二叉树的最近公共祖先 IV](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-iv/)

## 总结

- nodes 中所有节点都在树中，所以可参考 [236. 二叉树的最近公共祖先：p 和 q 一定在树中](/girmqX)
	- 唯一区别是： `nodes.includes(root)`  的判断

```javascript
var lowestCommonAncestor = function (root, nodes) {
    return find(root, nodes);
    function find(root, nodes) {
        if (root == null) return null;
        if (nodes.includes(root)) return root;
        
        let left = find(root.left, nodes);
        let right = find(root.right, nodes);
        // 后序位置：
        if (left && right)  return root;
        return left || right || null;
    };
};
```

## 1. 题意要点

- 这是一颗 **不含重复值**的二叉树
- 找 **多个节点** 的最近公共祖先

![cos-blog-832-34-20241012|504](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907095756.png)

## 2. 代码

```javascript
var lowestCommonAncestor = function (root, nodes) {
  // 将列表转化成哈希集合，便于判断元素是否存在
  let values = new Set();
  for (let node of nodes) {
    values.add(node.val);
  }

  return find(root, values);
};

var find = function (root, values) {
  if (root == null) {
    return null;
  }
  // 使用哈希集合判断当前节点存在于 values 中
  if (values.has(root.val)) {
    return root;
  }
  let left = find(root.left, values);
  let right = find(root.right, values);

  // 后序位置：
  // 如果左右子树都找到了，说明当前节点就是最近公共祖先
  if (left && right) {
    return root;
  }
  // 如果左子树找到了，右子树没找到，说明最近公共祖先在左子树
  // 如果右子树找到了，左子树没找到，说明最近公共祖先在右子树
  // 如果左右子树都没找到，说明最近公共祖先不存在
  // 因为题设说了 p 和 q 一定存在于二叉树中，所以这里不用考虑两个都没找到的情况
  return left || right;
};
```
