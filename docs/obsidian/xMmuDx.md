# 左叶子之和

>  [404. 左叶子之和](https://leetcode.cn/problems/sum-of-left-leaves/)

## 1. 代码

- 注意`左叶子节点`的判断

```javascript hl:6
var sumOfLeftLeaves = function (root) {
    let res = 0;
    function traverse(root, parent) {
        if (!root) return;
        // 左叶子结点
        if (root.left !== null && root.left.left === null && root.left.right === null) {
            res += root.left.val;
        }
        traverse(root.left);
        traverse(root.right);
    }
    traverse(root);
    return res;
};
```

## 2. 错误记录

不需要通过 prarent 参数至递归函数

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250118.png)
