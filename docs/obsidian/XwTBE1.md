# 二叉树的堂兄弟节点：x 和 y 是否是堂兄弟

>  [993. 二叉树的堂兄弟节点](https://leetcode.cn/problems/cousins-in-binary-tree/)


- x 和 y 是否是堂兄弟，需要满足
	- x 和 y 深度相同
	- `x` 和 `y` 父节点不同
- 关键点：
	- 遍历传参数 `function traverse(root, depth, parent) {`

```javascript
var isCousins = function (root, x, y) {
    let xD = -1;
    let yD = -1;
    let xP = -1;
    let yP = -1;
    function traverse(root, depth, parent) {
        if (!root) return;
        if (root.val === x) {
            xD = depth;
            xP = parent?.val;
        }
        if (root.val === y) {
            yD = depth;
            yP = parent?.val;
        }
        traverse(root.left, depth + 1, root);
        traverse(root.right, depth + 1, root);
    }
    traverse(root, 1, null);
    // 二叉树的两个节点深度相同，但父节点不同
    return xD === yD && xP !== yP;
};
```
