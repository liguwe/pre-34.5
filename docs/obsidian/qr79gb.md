# 两数之和 IV - 输入二叉搜索树，是否存在

> [653. 两数之和 IV - 输入二叉搜索树](https://leetcode.cn/problems/two-sum-iv-input-is-a-bst/)

思路：
- ① 遍历一遍有序数组
- ② 然后转 `nsum` 问题

```javascript hl:24,21
var findTarget = function (root, k) {
    let arr = [];

    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        arr.push(root.val);
        traverse(root.right);
    }
    traverse(root);

    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        let sum = arr[left] + arr[right];
        if (sum < k) {
            left++;
        } else if (sum > k) {
            right--;
        } else {
            return true;
        }
    }
    return false;
};
```
