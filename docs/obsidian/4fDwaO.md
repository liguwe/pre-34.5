# 判断给定的序列是否是二叉树从根到叶的路径

> [1430. 判断给定的序列是否是二叉树从根到叶的路径](https://leetcode.cn/problems/check-if-a-string-is-a-valid-sequence-from-root-to-leaves-path-in-a-binary-tree/)

## 1. 基础代码

> [!danger]
> 注意：不用直接赋值，而是使用判断 ` res = arr.join(',') === path.join(',');`

```javascript hl:8
var isValidSequence = function (root, arr) {
    let res = false;
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        // 叶子节点
        if (root.left === null && root.right === null) {
            if (arr.join(",") === path.join(",")) {
                res = true;
            }
        }
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }

    traverse(root, []);

    return res;
};
```

## 2. 优化

- 只在路径长度正确时进行比较
- 提前终止无效的路径探索
- 正确判断是否存在满足条件的根到叶子的路径

```javascript
var isValidSequence = function (root, arr) {
    if (!root) return arr.length === 0;

    let res = false;

    function traverse(root, path) {
        if (!root) return;
        if (path.length > arr.length) return;
        path.push(root.val);
        // 叶子节点
        if (
            root.left === null &&
            root.right === null &&
            path.length === arr.length
        ) {
            if (arr.join(",") === path.join(",")) {
                res = true;
            }
        }
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }

    traverse(root, []);

    return res;
};
```
