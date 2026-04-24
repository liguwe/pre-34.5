# 求根节点到叶节点数字之和

>  这种结构适合于数字做压缩

> [129. 求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)


同 [257. 二叉树的所有路径：返回二叉树的所有路径，以a→b的方式](/t7zrtx) ，只不过需要求和

- 注意
	-  `1->2` 代表数字 `12`
	-  `1->3` 代表数字 `13`


```javascript
var sumNumbers = function (root) {
    let res = [];
    function traverse(root, path) {
        if (!root) return;
        if (root.left === null && root.right === null) {
            path.push(root.val);
            res.push(path.join(""));
            path.pop();
            return;
        }
        path.push(root.val);
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }
    traverse(root, []);
    console.log("res", res);
    let sum = 0;
    for (let item of res) {
        sum += parseInt(item);
    }
    return sum;
};
```
