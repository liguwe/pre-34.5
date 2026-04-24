# 最大二叉搜索子树：给定一个二叉树，找到其中最大的二叉搜索树（BST）子树，并返回该子树的大小

>  [333. 最大二叉搜索子树](https://leetcode.cn/problems/largest-bst-subtree/)


- 关键点：
	- findBST 的 返回值
		- ① 如果这棵二叉树不是 BST，则返回 `null`
		- ② 如果这棵树是 BST
			- 则返回三个数：`[BST 中的最小值,BST 中的最大值,BST 的节点总数]`

```javascript
var largestBSTSubtree = function (root) {
    const MAX = 10 ** 4 + 1;
    let res = 0;
    // 定义：输入一棵二叉树
    // ①  如果这棵二叉树不是 BST，则返回 null，
    // ②  如果这棵树是 BST，则返回三个数：[BST 中的最小值,BST 中的最大值,BST 的节点总数]
    function findBST(root) {
        if (!root) return [MAX, -MAX, 0];
        // ****************后序位置****************
        let left = findBST(root.left);
        let right = findBST(root.right);
        // 如果左右子树如果有一个不是 BST  →  root 一定不是 BST
        if (left === null || right === null) return null;
        let [leftMin, leftMax, leftCount] = left;
        let [rightMin, rightMax, rightCount] = right;
        // 以 root 为根的二叉树是 BST
        if (root.val > leftMax && root.val < rightMin) {
            let rootCount = 1 + leftCount + rightCount;
            res = Math.max(res, rootCount);
            return [
                Math.min(leftMin, root.val),
                Math.max(rightMax, root.val),
                rootCount,
            ];
        }
        return null;
    }
    findBST(root);
    return res;
};
```
