# 两两交换链表中的节点

> [24. 两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)



```javascript
var swapPairs = function(head) {
    if (head === null || head.next === null) {
        return head;
    }
    let first = head;
    let second = head.next;
    let others = head.next.next;
    // 先把前两个元素翻转
    second.next = first;
    first.next = swapPairs(others);
    return second;
};
```
