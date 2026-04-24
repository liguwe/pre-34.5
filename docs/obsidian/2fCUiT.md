# 二叉搜索树中的众数：找出并返回 BST 中的所有出现频率最高的元素

`#算法/BST` 

> [501. 二叉搜索树中的众数](https://leetcode.cn/problems/find-mode-in-binary-search-tree/)


BST 的中序遍历有序，在中序遍历的位置做一些判断逻辑和**操作有序数组差不多**

## 1. 通用二叉树解法

边遍历边更新，其实很容易写错
- 所以就变遍历一遍，然后使用`哈希`记住出现的次数，最会返回出现次数最多那几个元素即可
- 记住：res 返回的元素是数字，所以需要 `parseInt`

```javascript
var findMode = function (root) {
    let obj = {}; // 每个元素出现的次数

    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        obj[root.val] = (obj[root.val] || 0) + 1;
        traverse(root.right);
    }
    traverse(root);

    let maxCount = Math.max(...Object.values(obj));
    let res = [];
    for (let k of Object.keys(obj)) {
        if (obj[k] === maxCount) {
            res.push(parseInt(k));
        }
    }
    return res;
};
```

## 2. 二叉树特性的解法

1. 二叉搜索树的中序遍历会得到一个升序序列
2. **相同的数字在中序遍历中一定是连续的**
	1. 我们可以在中序遍历的过程中统计每个数字出现的次数
	2. 记录最大频率，当遇到相同频率的数字时加入结果数组

> 先忽略了，需要再自己实现
