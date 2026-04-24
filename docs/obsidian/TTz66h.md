# 验证二叉搜索树的前序遍历序列

`#leetcode-plus` `#算法/BST` 

>  [255. 验证二叉搜索树的前序遍历序列](https://leetcode.cn/problems/verify-preorder-sequence-in-binary-search-tree/)


```javascript
var verifyPreorder = function (preorder) {
    const MAX = 10 ** 4 + 1;
    let n = preorder.length;
    return check(preorder, 0, n - 1, -MAX, MAX);
};
// 定义：检查 preorder[start,end] 是否能够组成一棵值在 [min, max] 中的 BST
var check = function (preorder, start, end, min, max) {
    // 基础情况：如果起始位置超过结束位置，说明是空子树，返回true
    if (start > end) return true; 
    let rootVal = preorder[start];
    // 检查根节点值是否在有效范围内
    if (rootVal < min || rootVal > max) return false;
    // 寻找右子树的起始位置
    // 通过遍历找到第一个大于根节点的元素，该位置就是右子树的开始
    let p = start + 1;
    while (p <= end && preorder[p] < rootVal) {
        p++;
    }
    // 递归检查左右子树
    // 左子树：范围是[start+1, p-1]，所有节点值必须在[min, rootVal]之间
    // 右子树：范围是[p, end]，所有节点值必须在[rootVal, max]之间
    return (
        check(preorder, start + 1, p - 1, min, rootVal) &&
        check(preorder, p, end, rootVal, max)
    );
};
```
