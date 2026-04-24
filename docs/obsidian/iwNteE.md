# 二叉搜索树的范围和：返回给定区间所有结点的值的和

>  [938. 二叉搜索树的范围和](https://leetcode.cn/problems/range-sum-of-bst/)

```javascript
var rangeSumBST = function (root, low, high) {
    let res = 0;
    function traverse(root) {
        if (!root) return;
        if (root.val >= low && root.val <= high) {
            res += root.val;
        }
        traverse(root.left);
        traverse(root.right);
    }
    traverse(root);
    return res;
};
```
