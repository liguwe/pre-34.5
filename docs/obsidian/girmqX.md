# 二叉树的最近公共祖先：p 和 q 一定在树中

[236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

## 1. 总结

```javascript
var lowestCommonAncestor = function (root, p, q) {
    return find(root, p, q);
    function find(root, p, q) {
        if (!root) return null;
        if (root === p || root == q) return root;
        let left = find(root.left, p, q);
        let right = find(root.right, p, q);
        if (left && right) return root;
        return left || right;
    }
};
```

> 如果 p 和 q 不一定在树中，可参考 [1644. 二叉树的最近公共祖先 II：p 和 q 不一定在树中](/6tx0fR)

## 2. 题意要点

- 这是一颗 **不含重复值**的二叉树
- 找 **两个节点** 的最近公共祖先
- 给点的节点**一定存在于**二叉树中

## 3. 思路

只要在上文 [#二叉树中寻找值为 val1 或 val2 的节点](/girmqX#%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%AD%E5%AF%BB%E6%89%BE%E5%80%BC%E4%B8%BA-val1-%E6%88%96-val2-%E7%9A%84%E8%8A%82%E7%82%B9) 中修改**后序位置**的部分代码即可实现

>[236. 二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

## 4. 两种情况

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907095203.png)

## 5. 代码 

```javascript
var lowestCommonAncestor = function (root, p, q) {
  return find(root, p.val, q.val);
};
var find = function (root, val1, val2) {
  if (root == null) {
    return null;
  }
  if (root.val == val1 || root.val == val2) {
    return root;
  }
  let left = find(root.left, val1, val2);
  let right = find(root.right, val1, val2);
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

## 6. 参考

[1. 最近公共祖先问题合集](/i7zQ8f)
