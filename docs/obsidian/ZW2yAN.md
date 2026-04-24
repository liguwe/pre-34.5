# 从未排序的链表中移除重复元素：不是去重

> [1836. 从未排序的链表中移除重复元素](https://leetcode.cn/problems/remove-duplicates-from-an-unsorted-linked-list/)


思路：
- 使用：**虚拟头结点**
- 使用 **链表分解的技巧**

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicatesUnsorted = function (head) {
  let obj = {};
  let p = head;
  while (p) {
    obj[p.val] = (obj[p.val] || 0) + 1;
    p = p.next;
  }

  let d = new ListNode(-1);
  d.next = head;
  p = d;
  while (p) {
    let unique = p.next;
    while (unique !== null && obj[unique.val] > 1) {
      // 跳过重复节点，直到找到不重复的节点
      unique = unique.next;
    }
    p.next = unique;
    p = p.next;
  }
  return d.next;
};
```
