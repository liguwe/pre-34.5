# 从根到叶的二进制数之和

`#遍历二叉树的思路` `#二叉树` 

>  [1022. 从根到叶的二进制数之和](https://leetcode.cn/problems/sum-of-root-to-leaf-binary-numbers/)


- 使用 if-else 结构，别提请返回，不然不太好理解
- 使用 `parseInt(str, 2)` 转成 `10 进制`

```javascript
var sumRootToLeaf = function (root) {
    let sum = 0;
    let res = [];
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        if (!root.left && !root.right) {
            res.push([...path]);
        } else {
            traverse(root.left, path);
            traverse(root.right, path);
        }
        path.pop();
    }
    traverse(root, []);
    res.forEach((item) => {
        sum += parseInt(item.join(""), 2);
    });

    return sum;
};
```
