# 克隆 N 叉树

> [1490. 克隆 N 叉树](https://leetcode.cn/problems/clone-n-ary-tree/)

## 1. 分解问题的思路

定义：输入 N 叉树节点，**返回**以该节点为根的 N 叉树的深拷贝

```javascript hl:1
// 定义：输入 N 叉树节点，返回以该节点为根的 N 叉树的深拷贝
var cloneTree = function (root) {
    if (!root) return null;
    let newRoot = new Node(root.val);
    newRoot.children = [];
    root.children.forEach((node) => {
        newRoot.children.push(cloneTree(node));
    });
    return newRoot;
};
```

## 2. 遍历的思路

- 遍历两边
	- 第一次遍历用哈希表把原节点和克隆节点映射起来
	- 第二次遍历把克隆节点组装起来
