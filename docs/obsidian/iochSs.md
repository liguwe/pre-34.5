# 判断链表是否有环

>  [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)

## 思路

- 每当`慢指针 slow` 前进一步，`快指针 fast` 就前进两步
	- 如果 `fast` 最终遇到空指针，说明链表中没有环
	- 如果 `fast` 最终和 slow `相遇`
		- 那肯定是 `fast` 超过了 `slow` 一圈，说明链表中含有环

## 代码

```javascript
var hasCycle = function (head) {
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (fast === slow) {
      return true;
    }
  }
  return false;
};
```

> 虽然 `while (fast && fast.next) {` 条件会导致有环时，死循环，当时循环体里面有 return 条件，来终止循环

## 注意点

> [!NOTE]
疑问❓
不会死循环嘛？比如这是一个循环列表 → 最终是会相遇的，如何相遇？ 理解成学校操场 400m 场地跑步，一个跑的快，一个跑得慢。**所以，最终还是会追上的**
