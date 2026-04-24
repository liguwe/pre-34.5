# 子树的最大平均值

> [1120. 子树的最大平均值](https://leetcode.cn/problems/maximum-average-subtree/)


- 关键点：
	- 返回值

```javascript hl:3
var maximumAverageSubtree = function (root) {
    let res = 0;
    // [节点个数 , 节点值之和]
    function getCountAndSum(root) {
        if (!root) return [0, 0];
        let [leftCount, leftSum] = getCountAndSum(root.left);
        let [rightCount, rightSum] = getCountAndSum(root.right);
        let sum = root.val + leftSum + rightSum;
        let count = 1 + leftCount + rightCount;
        res = Math.max(res, sum / count);
        return [count, sum];
    }
    getCountAndSum(root);
    return res;
};
```
