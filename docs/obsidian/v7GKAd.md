# 合并两个有序链表

> [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

## 总结

- 合并两个有序单链表
	- **四个**变量：
		- p1 p2  d  p
	- `while (p1 && p2) {`
	- if (p1) {
	- if (p2) {
	- return d.next

## 分析

> [https://leetcode.cn/problems/merge-two-sorted-lists/](https://leetcode.cn/problems/merge-two-sorted-lists/)

**仔细重复的** 看下面的`动图`，有`6个`变量

- `l1` 代表链表 `list1` 
- `p1` 指针指向 链表 `list1` 
- `l2` 代表链表 `list2`
- `p2` 指针指向链表 `list2` 
- `dummy 节点` , 「虚拟头结点」
- `p` 指针指向 虚拟头结点

![|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/a95e9523866627037deca38bff57f245.gif)
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  let p1 = list1;
  let p2 = list2;
  let d = new ListNode(-1);
  let p = d;
  while (p1 && p2) {
    if (p1.val < p2.val) {
      p.next = p1;
      p1 = p1.next;
    } else {
      p.next = p2;
      p2 = p2.next;
    }
    p = p.next;
  }
  if (p2) {
    p.next = p2;
  }
  if (p1) {
    p.next = p1;
  }
  return d.next;
};
```

上面 `while 条件` 的两种写法还是会有性能差异的，如下图：

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/9c4e07ba21ffab641f8328ec40605ea5.png)


## 「虚拟头结点」技巧

`dummy` 节点，其实就是一个`占位符` ，有了它，方便处理 `p` 为空指针的场景

什么时候需要用**虚拟头结点**？

**当你需要创造一条新链表的时候，可以使用虚拟头结点简化边界情况的处理。**，比如本地中 中是不是需要创建一个`新的链表`

> [!info]
以后虚拟头结点都使用 变量 `d` 代替，方便 code
