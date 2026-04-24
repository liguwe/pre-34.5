# 寻找所有的独生节点

> [1469. 寻找所有的独生节点](https://leetcode.cn/problems/find-all-the-lonely-nodes/)


> [!danger]
> 别老想着传参 `parent`

```javascript
var getLonelyNodes = function (root) {
    let res = [];
    function traverse(root) {
        if (!root) return;
        if (root.left && !root.right) {
            res.push(root.left.val);
        }
        if (!root.left && root.right) {
            res.push(root.right.val);
        }
        traverse(root.left);
        traverse(root.right);
    }
    traverse(root, null);
    return res;
};
```
