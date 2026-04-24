# 回文链表

`#算法/链表` 

> [234. 回文链表](https://leetcode.cn/problems/palindrome-linked-list/)

- `reverse()` 方法会直接修改原数组，需要需要浅拷贝下

```javascript
var isPalindrome = function (head) {
    let arr = [];
    let p = head;
    while (p) {
        arr.push(p.val);
        p = p.next;
    }
    return [...arr].reverse().join(",") === arr.join(",");
};
```
