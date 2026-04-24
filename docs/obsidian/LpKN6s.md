# 将二叉搜索树变平衡

>  [1382. 将二叉搜索树变平衡](https://leetcode.cn/problems/balance-a-binary-search-tree/)


## 总结

```javascript
var balanceBST = function (root) {
    let nums = [];
    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        nums.push(root.val);
        traverse(root.right);
    }
    traverse(root);
    function build(nums, left, right) {
        if (left > right) return null;
        let mid = left + Math.floor((right - left) / 2);
        let root = new TreeNode(nums[mid]);
        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);
        return root;
    }
    return build(nums, 0, nums.length - 1);
};
```

## 题目与思路

- 中序遍历转成 → 有序序列
- 有序序列 → 构造二叉树 
	- 这就是 ：[108. 将有序数组转换为二叉搜索树](/21UUo0)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250122-3.png)
