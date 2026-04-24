# 链表的中间结点：寻找链表的中间节点

`#单链表/双指针` 

> [876. 链表的中间结点](https://leetcode.cn/problems/middle-of-the-linked-list/)

## 要点

- 快慢指针
- `while (fast && fast.next) {`

## 代码

```javascript
var middleNode = function (head) {
  let fast = head;
  let slow = head;

  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  return slow;
};
```



>  注：需要注意的是，如果链表长度为`偶数`，也就是说中点有两个的时候，我们这个解法返回的节点是`靠后的那个节点`。
