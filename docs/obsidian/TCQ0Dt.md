# 找树左下角的值：找出该二叉树的 最底层 最左边 节点的值

> [513. 找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)

## 错误

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250121.png)

## depth 通过递归函数参数传递

```javascript hl:7
var findBottomLeftValue = function (root) {
    let maxDepth = 0;
    let res = null;
    function traverse(root, depth) {
        if (!root) return;
        if (depth > maxDepth) {
	        maxDepth = depth
            res = root.val;
        }
        traverse(root.left, depth + 1);
        traverse(root.right, depth + 1);
    }
    traverse(root, 1);
    return res;
};
```

## depth 为全局变量

```javascript
var findBottomLeftValue = function (root) {
    let maxDepth = 0;
    let depth = 0;
    let res = null;

    function traverse(root) {
        if (root === null) {
            return;
        }
        depth++;
        if (depth > maxDepth) {
            maxDepth = depth;
            res = root;
        }
        traverse(root.left);
        traverse(root.right);
        depth--;
    }

    traverse(root);
    return res.val;
};
```
