# 二叉树的最近公共祖先 II：p 和 q 不一定在树中

> [1644. 二叉树的最近公共祖先 II](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-ii/)

## 1. 题意要点

- 这是一颗 **不含重复值**的二叉树
- 找 **两个节点** 的最近公共祖先
- 给点的节点**不一定存在**于二叉树中

## 2. 思路

- `p` 和 `q` 不一定存在于树中，所以你不能遇到一个目标值就直接返回，
	- 而应该对二叉树进行**完全搜索**（遍历每一个节点）
		- 应该**在后续位置完全遍历完**才行
	- 如果发现 `p` 或 `q` 不存在于树中，那么是不存在 `LCA` 的

## 3. 代码

- `foundP` 和 `foundQ` 两个变量
- 逻辑都应该放到后序位置

```javascript hl:14
var lowestCommonAncestor = function (root, p, q) {
    let foundP = false;
    let foundQ = false;
    let res = find(root, p, q);
    if (foundP && foundQ) return res;
    return null;

    function find(root, p, q) {
        if (!root) return null;

        let left = find(root.left, p, q);
        let right = find(root.right, p, q);

        // 重点：都在后序位置
        if (root === p) {
            foundP = true;
            return root;
        }
        if (root === q) {
            foundQ = true;
            return root;
        }
        if (left && right) return root;
        return left || right || null;
    }
};
```
