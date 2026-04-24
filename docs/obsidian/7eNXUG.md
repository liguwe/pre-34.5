# 拆分二叉搜索树：大于 k 的子树 和 小于 k 的子树

`#算法/BST`  `#leetcode-plus` 

[776. 拆分二叉搜索树](https://leetcode.cn/problems/split-bst/)

给定一个二叉搜索树（BST）的根节点 `root` 和一个目标值 `target`，将该树拆分为两个子树：
- 一个子树包含所有小于等于目标值的节点
- 另一个子树包含所有大于目标值的节点

---


- 分解问题的思路
	- 注意初始值是 `[null, null]`


```javascript
var splitBST = function (root, target) {
    if (root == null) return [null, null];
    let res = [null, null];
    // 目标节点在根节点的右边
    if (root.val <= target) {
        // root 必然是第一棵 BST 的根节点
        res[0] = root;
        // 第二棵 BST 的根节点需要去右子树算
        let right = splitBST(root.right, target);
        res[1] = right[1];
        // 保证 root 的右子树都是小于 target 的
        root.right = right[0];
    } else {
        // root 必然是第二棵 BST 的根节点
        res[1] = root;
        // 第一棵 BST 的根节点需要去左子树寻找
        let left = splitBST(root.left, target);
        res[0] = left[0];
        // 保证 root 的左子树都是大于 target 的
        root.left = left[1];
    }
    return res;
};
```
