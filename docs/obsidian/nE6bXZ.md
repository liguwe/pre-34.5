# 奇偶链表

`#单链表`    `#单链表/双指针` `#单链表/快慢指针`  

## 1. 题目及理解

![image.png600|744](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407300802267.png?imageSlim)

## 2. 解题思路

1. 处理特殊情况：base case
    - 如果`链表为空`或`只有一个节点`，直接返回原链表。
2. 初始化指针：三个变量
    - odd：指向奇数索引节点，初始为 head
    - even：指向偶数索引节点，初始为 head.next
    - evenHead：保存偶数链表的头节点，用于最后的连接
3. 遍历链表，分离奇偶节点
    - 奇数节点连接到奇数链表
    - 偶数节点连接到偶数链表
4. 连接奇偶链表
    - 将`奇数链表的尾部`与`偶数链表的头部`相连
5. 返回重组后的链表头

## 3. 代码实现

```javascript
/**  
 * @description 解题思路步骤：  
 * 1. 处理特殊情况：base case  
 *     - 如果`链表为空`或`只有一个节点`，直接返回原链表。  
 * 2. 初始化指针：三个变量  
 *     - odd：指向奇数索引节点，初始为 head  
 *     - even：指向偶数索引节点，初始为 head.next  
 *     - evenHead：保存偶数链表的头节点，用于最后的连接  
 * 3. 遍历链表，分离奇偶节点  
 *     - 奇数节点连接到奇数链表  
 *     - 偶数节点连接到偶数链表  
 * 4. 连接奇偶链表  
 *     - 将`奇数链表的尾部`与`偶数链表的头部`相连  
 * 5. 返回重组后的链表头  
 * */  
  
/**  
 * Definition for singly-linked list. * function ListNode(val, next) {  
 *     this.val = (val===undefined ? 0 : val)  
 *     this.next = (next===undefined ? null : next) * }  
 */  
/**  
 * @param {ListNode} head  
 * @return {ListNode}  
 */  
var oddEvenList = function (head) {  
    // ① 处理特殊情况：base case  
    if (head === null || head.next === null) {  
        return head;  
    }  
    // ② 初始化指针：三个变量  
    let odd = head; // 奇数链表的头节点  
    let even = head.next; // 偶数链表的头节点  
    let evenHead = even;  // 保存偶数链表的头节点，用于最后的连接  
  
    // ③ 遍历链表，分离奇偶节点  
    while (even !== null && even.next !== null) {  
        // 奇数节点连接到奇数链表  
        // 奇数节点的下一个节点 指向 偶数节点的下一个节点（自然是下一个技术节点了）  
        odd.next = even.next; 
        odd = odd.next;       // 奇数节点指针后移  
        // 偶数节点连接到偶数链表  
        // 偶数节点的下一个节点 指向 奇数节点的下一个节点（自然是下一个偶数节点了）  
        even.next = odd.next;  
        even = even.next;      // 偶数节点指针后移  
    }  
    // ④ 连接奇偶链表  
    odd.next = evenHead; // 将奇数链表的尾部与偶数链表的头部相连  
    // ⑤ 返回重组后的链表头  
    return head;  
};
```

### 3.1. 复杂度分析

- 时间复杂度：`O(n)`，其中 `n` 是链表的长度，我们只遍历了一次链表。 
- 空间复杂度：`O(1)`，我们只使用了`常数级`的额外空间

## 4. 错误记录
