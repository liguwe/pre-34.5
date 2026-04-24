# 分裂二叉树的最大乘积：删除 1 条边，使二叉树分裂成两棵子树，且它们子树和的乘积尽可能大

>  [1339. 分裂二叉树的最大乘积](https://leetcode.cn/problems/maximum-product-of-splitted-binary-tree/)


-  `getSumAndUpdateRes`
- `getSum`

```javascript hl:13
var maxProduct = function (root) {
    let res = 0;
    let rootSum = getSum(root);
    getSumAndUpdateRes(root);
    // return res;
    return Math.floor(res % (10 ** 9 + 7));

    function getSumAndUpdateRes(root) {
        if (!root) return 0;
        let left = getSumAndUpdateRes(root.left);
        let right = getSumAndUpdateRes(root.right);
        let sum = left + right + root.val;
        res = Math.max(res, (rootSum - sum) * sum);
        return sum;
    }

    function getSum(root) {
        if (!root) return 0;
        let left = getSum(root.left);
        let right = getSum(root.right);
        let sum = left + right + root.val;
        return sum;
    }
};

```
