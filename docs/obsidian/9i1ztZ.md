# 二叉树最长连续序列 II：最长连续的路径

> [549. 二叉树最长连续序列 II](https://leetcode.cn/problems/binary-tree-longest-consecutive-sequence-ii/)


关键点：
- 返回值
	- `返回：[从 root 出发的最长递增路径长度, 从 root 出发的最长递减路径长度]`
- 如果当前节点的值比子节点的值小 1，说明可以形成递增序列
- 对于左子节点：
	- 应该是 `leftP + 1`
- 对于右子节点：
	- 需要取 `Math.max(rootP, rightP + 1)`，因为**可能左子树已经形成了更长的序列**



```javascript hl:18,29
var longestConsecutive = function (root) {
    let res = 0;

    // 返回：[从 root 出发的最长递增路径长度, 从 root 出发的最长递减路径长度]
    function find(root) {
        if (!root) return [0, 0];
        let left = find(root.left);
        let right = find(root.right);
        // 根据左右子树的递增/递减序列长度  →  推导以 root 为根的树的递增/递减序列长度
        let [leftP, leftM] = left;
        let [rightP, rightM] = right;
        let rootP = 1; // 递增序列长度
        let rootM = 1; // 递减序列长度

        // 检查左子树
        if (root.left) {
            if (root.val + 1 === root.left.val) {  // 递增
                rootP = leftP + 1;
            }
            if (root.val - 1 === root.left.val) {  // 递减
               
                rootM = leftM + 1;
            }
        }

        // 检查右子树
        if (root.right) {
            if (root.val + 1 === root.right.val) {   // 递增
                rootP = Math.max(rootP, rightP + 1);
            }
            if (root.val - 1 === root.right.val) {   // 递减
                rootM = Math.max(rootM, rightM + 1);
            }
        }
        // 更新全局最大值
        res = Math.max(res, rootP + rootM - 1);
        return [rootP, rootM];
    }
    find(root);
    return res;
};
```
