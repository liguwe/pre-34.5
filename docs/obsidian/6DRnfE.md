# 根据二叉树创建字符串：二叉树转字符串 → 1(2(4))(3)

> [606. 根据二叉树创建字符串](https://leetcode.cn/problems/construct-string-from-binary-tree/)

- 输入：`root = [1,2,3,4]`
- 输出：`"1(2(4))(3)"`


---

- 空的左子树`不能省略`
- 空的右子树`省略`

```javascript
var tree2str = function (root) {
    if (!root) return "";
    if (root.left === null && root.right === null) {
        return root.val + "";
    }
    let left = tree2str(root.left);
    let right = tree2str(root.right);
    // 右子树为空
    if (root.left !== null && root.right === null) {
        // 省略空的右子树
        return root.val + "(" + left + ")";
    }
    // 左子树为空
    if (root.left === null && root.right !== null) {
        // 空的左子树不能省略
        return root.val + "()" + "(" + right + ")";
    }
    // 左右子树都不空的情况
    return root.val + "(" + left + ")" + "(" + right + ")";
};
```
