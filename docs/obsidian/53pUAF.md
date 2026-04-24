# 节点与其祖先之间的最大差值

> [1026. 节点与其祖先之间的最大差值](https://leetcode.cn/problems/maximum-difference-between-node-and-ancestor/)


  - 每个节点需要知道左右子树的最小值和最大值
	  - 然后就能算出「以自己为祖先」的最大差值
- `getMaxMin(root)` 定义：输入一棵二叉树，返回该二叉树中节点的最小值和最大值， 
	-  `[最小值，最大值]`

```javascript
var maxAncestorDiff = function (root) {
    let res = 0;
    const MAX = 10 ** 5 + 1;
    function getMinMax(root) {
        if (!root) return [MAX, -MAX];

        let [leftMin, leftMax] = getMinMax(root.left);
        let [rightMin, rightMax] = getMinMax(root.right);

        let rootMin = Math.min(root.val, leftMin, rightMin);
        let rootMax = Math.max(root.val, leftMax, rightMax);

        res = Math.max(res, rootMax - root.val, root.val - rootMin);

        return [rootMin, rootMax];
    }

    getMinMax(root);

    return res;
};
```
