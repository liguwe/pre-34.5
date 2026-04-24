# 二叉搜索树的最近公共祖先：p 和 q 一定在树中

>  [235. 二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

## 1. 总结

1、如果 `p` 和 `q` 都比`当前节点`小，那么显然 `p` 和 `q` 都在`左子树`，那么 `LCA` 在`左子树`。
2、如果 `p` 和 `q` 都比`当前节点`大，那么显然 `p` 和 `q` 都在`右子树`，那么 `LCA` 在`右子树`。
3、一旦发现 `p` 和 `q` 在当前节点的两侧，说明当前节点就是 LCA。

```javascript
var lowestCommonAncestor = function (root, p, q) {
    return find(root, p, q);
    function find(root, p, q) {
        if (!root) return null;
        if (root.val > p.val && root.val > q.val) {
            return find(root.left, p, q);
        }
        if (root.val < p.val && root.val < q.val) {
            return find(root.right, p, q);
        }
        return root;
    }
};
```

## 2. 题目

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907102039.png)

## 3. 题意要点

- 这是一颗 **不含重复值**的二叉**搜索树**
- 找 **两个节点** 的最近公共祖先
- 给点的节点**一定存在**于二叉树中

## 4. 代码

```javascript
// 二叉树搜索树中两个节点的最近公共祖先
var lowestCommonAncestor = function (root, p, q) {
  // 如果当前节点为空，说明没有最近公共祖先
  if (root == null) {
    return null;
  }

  // 如果 p 和 q 都小于当前节点的值，说明最近公共祖先在左子树
  if (root.val > p.val && root.val > q.val) {
    return lowestCommonAncestor(root.left, p, q);
  }

  // 如果 p 和 q 都大于当前节点的值，说明最近公共祖先在右子树
  if (root.val < p.val && root.val < q.val) {
    return lowestCommonAncestor(root.right, p, q);
  }

  // 如果 p 和 q 一个大于当前节点的值，一个小于当前节点的值，说明当前节点就是最近公共祖先
  return root;
};

```
