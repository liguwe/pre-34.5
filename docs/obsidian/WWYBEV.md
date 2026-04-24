# 二叉树与单链表的关系

`#算法/二叉树`  

## 先看看单链表的一些 `迭代` 场景

```javascript
function ListNode() {
    this.val = val;
    this.next = null;
}

/**
 * @description 打印链表
 * @param {ListNode} head
 * */
function printList(head) {
    let p = head;
    while (p) {
        console.log(p.val);
        p = p.next;
    }
}

/**
 * @description 打印数组
 * @param {number[]} arr
 * */
function printArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

/**
 * @description 给链表添加元素，添加到链表尾部
 * 1->2->3->4->5->6->7->8->9->10->null
 * // ::::添加元素11
 * 1->2->3->4->5->6->7->8->9->10->11->null
 * */
function addLast(head, val) {
    let newNode = new ListNode(val);
    if (head == null) {
        head = newNode;
        return head;
    }
    let p = head;
    while (p.next) {
        p = p.next;
    }
    p.next = newNode;
    return head;
}
```

## 删除链表的最后一个节点

```javascript
/**
 * @description 删除链表的最后一个节点
 * @param {ListNode} head
 * */
function removeLast(head) {
    if (head == null) {
        // ::::返回
        return null;
    }
    if (head.next == null) {
        // ::::返回
        return null;
    }
    let p = head;
    // ::::::::找到倒数第二个节点
    while (p.next.next) {
        p = p.next;
    }
    // ::::::::删除最后一个节点
    p.next = null;
    // ::::::::返回头节点
    return head;
}
```

- `单链表` **其实完全可以理解 `只有一个节点的二叉树`
- 上面是正常的迭代写法，请问如果都改成 `递归解法` **呢？
