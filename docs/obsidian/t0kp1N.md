# 找到二叉树中的距离：p 到 q 的路径上边的数目

> [1740. 找到二叉树中的距离](https://leetcode.cn/problems/find-distance-in-a-binary-tree/)

- 题目：
	- `p` 到 `q` 的路径上`边的数目`
- 思路：
	- 两个节点间的距离等于**它们到最近公共祖先的距离之和**
		- 所以可参考 [236. 二叉树的最近公共祖先：p 和 q 一定在树中](/girmqX)


注意点：
- `p` 和 `q` 是两个整数，不用 `p.val`
- `getDistance` 其实就是`获取深度`
	- 即以 `LCA` 为根节点到 `p` 或者 `q` 的距离
		- 其实就是获取深度

```javascript
var findDistance = function (root, p, q) {
    let lca = getLCA(root, p, q);
    return getDistance(lca, p) + getDistance(lca, q);

    function getDistance(root, target) {
        let res = 0;
        function traverse(root, depth) {
            if (!root) return;
            if (root.val === target) {
                res = depth;
                return;
            }
            traverse(root.left, depth + 1)
            traverse(root.right, depth + 1)
        }
        traverse(root, 0)
        return res;
    }
    function getLCA(root, p, q) {
        return find(root, p, q);
        function find(root, p, q) {
            if (!root) return null;
            if (root.val === p || root.val === q) return root;
            let left = find(root.left, p, q);
            let right = find(root.right, p, q);
            if (left && right) return root;
            return left || right || null;
        }
    }
};
```
