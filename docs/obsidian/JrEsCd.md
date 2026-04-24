# 前序遍历构造二叉搜索树：前序位置构造二叉搜索树

`#二叉树的构造` `#算法/BST` 


>  [1008. 前序遍历构造二叉搜索树](https://leetcode.cn/problems/construct-binary-search-tree-from-preorder-traversal/)

- 普通二叉树：前序和中序构造二叉树，然后就转换成 [105.  从前序与中序遍历序列构造二叉树](/1Br2fd)
- BST 的特点
	- 左子树都比根节点的值小，右子树都比根节点的值大。
	- 所以如何找到根节点？前序遍历的第一个就是根节点。
	- 如何找到左右子树？
		- 比根节点小的就是左子树的节点
		- 比根节点大的就是右子树的节点

```javascript
var bstFromPreorder = function (preorder) {
    return build(preorder, 0, preorder.length - 1);
    function build(preorder, start, end) {
        if (start > end) return null;
        let rootVal = preorder[start];
        let root = new TreeNode(rootVal);
        // 根据 BST 的特点，左子树都比根节点的值小，右子树都比根节点的值大
        // p 就是左右子树的分界点
        let p = start + 1;
        while (p <= end && preorder[p] < rootVal) {
            p++;
        }
        // [start+1, p-1] 区间内是左子树元素
        root.left = build(preorder, start + 1, p - 1);
        // [p, end] 区间内是右子树元素
        root.right = build(preorder, p, end);
        return root;
    }
};
```

这题和 [255. 验证二叉搜索树的前序遍历序列](/TTz66h) 类似
