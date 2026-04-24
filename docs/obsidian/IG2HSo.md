# 删除链表的倒数第 N 个结点

> [19. 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

## 总结

- 定义 fast d  slow=d
	-  ==d.next = head==
- 快指针先走 n 步 → for 循环
- 快慢指针同时走，直到快指针走完
- 删除 slow 指向的节点
	- slow.next = slow.next.next;
		- **注意不是**：`show = slow.next.next;`
- 最后返回 `d.next`

## 代码

```javascript
var removeNthFromEnd = function (head, n) {
  let fast = head;
  let d = new ListNode(-1);
  d.next = head;
  let slow = d;
  // 快指针先走 n 步
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }
  // 快指针走到头
  // 并且慢指针也跟着走，快指针走到头时，慢指针正好指向倒数第 n 个节点
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  // 删除 slow 指向的节点
  // show = slow.next.next;  // 错误
  slow.next = slow.next.next; // 正确
  return d.next;
};
```

## 详解

### 先找到单链表的倒数第 k 个节点

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/ac036e825212ca37f1a513d5e8b41e08.png)

代码如下：

```javascript
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    // 使用了虚拟头结点的技巧，也是为了防止出现空指针的情况，见备注
    let dummy = new ListNode(-1);
    // 第一步，使用双指针 先找到 倒数第 n 个节点
    let p1 = head;
    let p2 = dummy;
    p2.next = head;
    // p1 先走 n 步
    for (let i = 0; i < n; i++) {
        p1 = p1.next;
    }
    // p1 和 p2 同时走 k 步
    while (p1 != null) {
        p2 = p2.next;
        p1 = p1.next;
    }
    // 这个时候找到了
    
    // 删掉倒数第 n 个节点
    p2.next = p2.next.next;
    return dummy.next;
};

```

>  使用了`虚拟头结点`的技巧，也是为了防止出现空指针的情况，比如说链表总共有 5 个节点，题目就让你删除倒数第 5 个节点，也就是第一个节点，那按照算法逻辑，应该首先找到倒数第 6 个节点。但第一个节点前面已经没有节点了，这就会出错。
