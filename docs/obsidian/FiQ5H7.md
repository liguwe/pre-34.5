# 二叉搜索树的最小绝对差：任意两个节点的差值的绝对值最小值

>  [530. 二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/)


中序遍历遍历一遍 BST 的所有节点得到有序结果，然后在遍历过程中计算最小差值即可


> [!danger]
> 注意点：
> - 一般都需要 `prev` 前驱结点这边变量，你也可以把这个变量理解为 `p 指针` ，另外某个题也是这思路，忘了哪题了？

```javascript
var getMinimumDifference = function (root) {
    let prev = null;
    let res = Number.MAX_VALUE;
    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        if (prev){
	         res = Math.min(res, root.val - prev.val);
        }
        prev = root;
        traverse(root.right);
    }
    traverse(root);
    return res;
};
```
