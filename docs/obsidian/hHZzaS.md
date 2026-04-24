# 删除排序链表中的重复元素 II：删除所有重复的节点

> [82. 删除排序链表中的重复元素 II](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/)

## 1. 总结

- 快慢指针
	- `slow = d` ，但 `fast = head`
	- 如果不等
		- 快慢指针都先后移动
	- 如果相等
		- while 循环：fast 向后移动直到找到不重复的值，→ 跳过了所有重复节点
		- 慢指针指向 fast.next： slow.next = fast.next
		- 快指针向后移动我一位


```javascript hl:13
var deleteDuplicates = function (head) {
  if (!head || !head.next) return head;
  let d = new ListNode(-1);
  d.next = head;
  // 如果slow 指向 head，将无法处理头节点重复的情况
  let slow = d; 
  let fast = head; // 注意：不等于 d
  while (fast && fast.next) {
    if (fast.val !== fast.next.val) {
       slow = slow.next;
       fast = fast.next;
    } else {
      // 如果发现重复节点，fast 向后移动直到找到不重复的值
      while (fast.next && fast.val === fast.next.val) {
        fast = fast.next;
      }
      // 跳过所有重复节点
      slow.next = fast.next;
      fast = fast.next;
    }
  }
  return d.next;
};

```

## 2. 相关题目

[83. 删除排序链表中的重复元素：去重](/LNt6V2)
