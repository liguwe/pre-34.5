# 两棵二叉搜索树中的所有元素：合并两个 BST，返回有序数组

> [1305. 两棵二叉搜索树中的所有元素](https://leetcode.cn/problems/all-elements-in-two-binary-search-trees/)


## 解法一：中序遍历 + 合并有序数组

```javascript
var getAllElements = function (root1, root2) {
    const nums1 = [];
    const nums2 = [];

    function traverse(root, arr) {
        if (!root) return;
        traverse(root.left, arr);
        arr.push(root.val);
        traverse(root.right, arr);
    }
    traverse(root1, nums1);
    traverse(root2, nums2);

    // 合并两个有序数组
    const res = [];
    let i = 0;
    let j = 0;

    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] < nums2[j]) {
            res.push(nums1[i++]);
        } else {
            res.push(nums2[j++]);
        }
    }

    // 处理剩余元素
    while (i < nums1.length) res.push(nums1[i++]);
    while (j < nums2.length) res.push(nums2[j++]);

    return res;
};
```

##  解法二：迭代器模式（更优解）

可使用 [173. 二叉搜索树迭代器](/NJdLvF) ，这里省略了
