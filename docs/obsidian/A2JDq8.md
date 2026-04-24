# 二叉树的最近公共祖先 III：包含 parent 指针

>  [1650. 二叉树的最近公共祖先 III](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree-iii/)

## 1. 总结

- 其实就是两个单链表相交问题
	- 更多参考：[160. 相交链表](/zCvyIS)

```javascript
var lowestCommonAncestor = function (p, q) {
    let p1 = p;
    let p2 = q;
    while (p1 !== p2) {
        if (p1 !== null){
             p1 = p1.parent;
        }else{
            p1 = q;
        };
        if (p2 !== null){
             p2 = p2.parent;
        }else{
            p2 = p;
        };
    }
    return p1;
};
```

## 2. 分析

输入的二叉树节点比较特殊，包含指向父节点的指针 `parent`

```javascript
var Node = {
    val: 0,
    left: null,
    right: null,
    parent: null
};

// 由于节点中包含父节点的指针，所以二叉树的根节点就没必要输入了
// 函数签名如下
var lowestCommonAncestor = function(p, q) {}

```

**这道题其实不是公共祖先的问题，而是单链表相交的问题**，你把 `parent` 指针想象成单链表的 `next` 指针，题目就变成了：

![cos-blog-832-34-20241012|544](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907103749.png)

如下图：

![cos-blog-832-34-20241012|560](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240907104537.png)

## 3. 代码

```javascript
var Node = {
  val: 0,
  left: null,
  right: null,
  parent: null,
};

// 二叉树中两个节点的最近公共祖先
var lowestCommonAncestor = function (p, q) {
  // 分别记录 p 和 q 的父节点，用于移动 p 和 q 到根节点
  let p1 = p;
  let p2 = q;

  while (p1 != p2) {
    // 如果 p1 为空，移动到 q 的父节点
    // 如果 p1 不为空，向根节点方向移动，即指针向指向 p1 的父节点
    if (p1 === null) {
      p1 = q;
    } else {
      p1 = p1.parent;
    }
    // 如果 p2 为空，移动到 p 的父节点
    // 如果 p2 不为空，向根节点方向移动，指针向指向 p2 的父节点
    if (p2 === null) {
      p2 = p;
    } else {
      p2 = p2.parent;
    }
  }
};
```
