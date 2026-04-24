# 二叉树中的链表：二叉树中是否包含某条单链表

> [1367. 二叉树中的链表](https://leetcode.cn/problems/linked-list-in-binary-tree/)

## 题目

下图中的二叉树包含  `4 → 2 → 8` 的单链表

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250121-3.png)

```javascript
二叉树：
     1
    / \
   4   4
  / \
 2   2
/
1

链表：
1->4->2

返回：true （因为树中存在 1->4->2 这条路径）

```

## 思路及代码

思路：
- `isSubPath` 就是在遍历二叉树的所有节点，对每个节点用 `dfs` 函数判断是否能够将链表嵌进去
- 分解问题的思路 

```javascript
var isSubPath = function (head, root) {
    // 如果链表为空，返回 true
    if (!head) return true;
    // 如果树为空但链表不为空，返回 false
    if (!root) return false;
    // 从当前节点开始匹配
    // 或者从左子树开始匹配
    // 或者从右子树开始匹配
    return (
        dfs(head, root) ||
        isSubPath(head, root.left) ||
        isSubPath(head, root.right)
    );
};
// 检查从当前树节点开始是否能匹配整个链表
function dfs(head, root) {
    // 如果链表已经匹配完，返回true
    if (!head) return true;
    // 如果树节点为空但链表还没匹配完，返回false
    if (!root) return false;
    // 如果当前值不匹配，返回false
    if (root.val !== head.val) return false;
    // 继续匹配链表的下一个节点，可以选择树的左子节点或右子节点
    return dfs(head.next, root.left) || dfs(head.next, root.right);
}
```
