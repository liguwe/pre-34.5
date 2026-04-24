# 合并 K 个升序链表

`#算法/链表`

> [23. 合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

## 1. 总结

- 最简易实现：
	- 使用 `sort 函数`实现优先级队列入队函数，更多可参考 [4. 优先级队列：入队函数最简易实现（sort）](/15AZwa)
		- 注意每次 `push` 时，添加空值检查
- 其他注意事项
	- base case 别忘了
	- 使用虚拟节点，约定为简写 `d`
	- 使用 `pq` 代表数组，约定为简写 `pd`


```javascript
var mergeKLists = function (lists) {
  // base case
  if (lists.length === 0) return null;
  let d = new ListNode(-1);
  let p = d;
  let pq = [];
  function enqueue(node) {
    // 添加空值检查
    if (!node) return;
    pq.push(node);
    pq.sort((a, b) => {
      return a.val - b.val;
    });
  }
  for (let item of lists) {
    enqueue(item);
  }
  while (pq.length) {
    let node = pq.shift();
    p.next = node;
    if (node.next) {
      enqueue(node.next);
    }
    p = p.next;
  }
  return d.next;
};
```

> 能通过，虽然性能不怎么好

## 2. 题目

![|496](https://832-1310531898.cos.ap-beijing.myqcloud.com/086fb314d78535b9d53982f756f711be.png)

## 3. 看代码

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 * 分析:
 * 1、关键是 优先级队列的 【入队函数】的实现
 * 2、优先级队列的【权重】就是单链表Node节点的val值
 */
var mergeKLists = function (lists) {
    if (lists.length === 0) {
        return null
    }
    // 虚拟头结点
    let dummy = new ListNode(-1);
    // 指针指向 虚拟头结点 , 用于移动
    let p = dummy;
    // 优先级队列，值最小的先入队，即优先级最高
    let q = [];
    // 优先队列的【入队函数】，值最小的先入队列
    let enqueue = (node) => {
        if (q.length === 0) {
            q.push(node);
        } else {
            // 是否插入了
            let added = false;
            for (let i = 0; i < q.length; i++) {
                if (node.val < q[i].val) {
                    q.splice(i, 0, node)
                    added = true;
                    break;
                }
            }
            // 没找到合适的插入位置，则添加到末尾
            if (!added) {
                q.push(node);
            }
        }
    }
    // 遍历lists , 入队链表数组的每个元素
    for (let i = 0; i < lists.length; i++) {
        if (lists[i] !== null) {
            enqueue(lists[i])
        }
    }
    // 优先级队列有值，则继续遍历
    while (q.length !== 0) {
        // 取出 优先级队列里的第一个
        let node = q.shift();
        // p指针指向 把取出的节点
        p.next = node;
        // 检测node.next 否则，重新入队
        if (node.next !== null) {
            // ::::关键
            enqueue(node.next);
        }
        // p 指针不断前进
        p = p.next;
    }
    return dummy.next;
};

```

## 4. 时间复杂度分析

> [!todo]
 复杂度，没弄明白，再研究！

分析：`q` 代表优先级队列，假设所有节点都会入队，所以 q 的长度为上限为 `N`
这个算法复杂度，没弄明白？ 因为并不是自己实现了
> 算法整体的时间复杂度是 `O(Nlogk)`
> - 其中 `k` 是 **链表的条数**，即有几个链表，即 提设中，`lists` 的长度
> - `N` 是 **这些链表的节点总数**。

> [!question]
这个题，并没有双指针，就是单指针
