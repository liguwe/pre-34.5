# 将二叉搜索树转化为排序的双向链表

>  [426. 将二叉搜索树转化为排序的双向链表](https://leetcode.cn/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/)


题目要求：
1. 不能创建新的节点，只能改变节点之间的指针
2. 对于双向循环链表，每个节点的 `left` 指针指向前驱，`right` 指针指向后继
	- 不是使用 `prev` 和 `next`
3. 转换后的链表要保持节点值的升序排序


思路：用中序遍历来解决，因为BST的中序遍历正好是升序的


```javascript
var treeToDoublyList = function (root) {
    if (!root) return null;

    let first = null; // 记录链表的第一个节点
    let p = null; // 指针，指向当前正在遍历的节点，即上一次访问的节点

    function traverse(root) {
        if (!root) return;
        traverse(root.left);
        if (p) {
            p.right = root;
            root.left = p;
        } else {
            first = root; // 记录第一个节点
        }
        p = root;
        traverse(root.right);
    }
    traverse(root);
    // 首尾相连，形成循环链表
    p.right = first;
    first.left = p;
    return first;
};

```
