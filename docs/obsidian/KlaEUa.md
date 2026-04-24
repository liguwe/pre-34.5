# 最接近的二叉搜索树值：二叉搜索树中找到最接近目标值 target 的数值，如果有多个答案，返回最小的那个

>  [270. 最接近的二叉搜索树值](https://leetcode.cn/problems/closest-binary-search-tree-value/)


- 注意两个条件，别自己师帅 `abs <= gap`
	- ① 当前差值小于已知最小差值
	- ② 差值相等时，选择较小的值

```javascript hl:7,12
var closestValue = function (root, target) {
    let res = root.val;
    let gap = Infinity;
    function traverse(root) {
        if (!root) return;
        let abs = Math.abs(root.val - target);
        // 1. 当前差值小于已知最小差值
        if (abs < gap) {
            res = root.val;
            gap = abs;
        }
        // 2. 差值相等时，选择较小的值
        if (abs === gap && root.val < res) {
            res = root.val;
        }
        if (target < root.val) {
            traverse(root.left);
        } else {
            traverse(root.right);
        }
    }
    traverse(root);
    return res;
};
```
