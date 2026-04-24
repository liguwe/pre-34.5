# 分隔链表

> [86. 分隔链表](https://leetcode.cn/problems/partition-list/)

## 总结

- 分隔链表
	- 注意：
		- 不是排序，不是排序，不是排序，需要保持相对顺序
	- 五个变量：d1 d2 p1 p2 p 
		- 小于 `x` 时： p1 前进
		- 否则： `p2` 前进
		- 原链表的指针不断前进 
			- 但不是`p = p.next;`
			- 因为**要断开**原链表中的每个节点的 next 指针
	- 连接两个链表：`p1.next = d2.next`
	- 返回 d1.next

## 代码

```javascript
var partition = function (head, x) {
  let d1 = new ListNode(-1);
  let d2 = new ListNode(-1);
  let p1 = d1;
  let p2 = d2;

  let p = head;

  while (p) {
    if (p.val < x) {
      p1.next = p;
      p1 = p1.next;
    } else {
      p2.next = p;
      p2 = p2.next;
    }

    // p = p.next;
    let temp = p.next;
    p.next = null;
    p = temp;
  }

  p1.next = d2.next;

  return d1.next;
};
```

## 分析

![|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/69c926657ba9b5889d24dd3ad5c220ed.png)

**分析：**
原链表分成`两个小链表`
- 一个链表中的元素大小都小于 `x`
- 另一个链表中的元素都大于等于 `x`，最后再把这两条链表接到一起

**要点分析：**

- 两个虚拟头结点 `dummy1 和 dummy2`，分别用于存储大于和小于 `x` 的节点，并使用两个指针 `p1` `p2` ，并指向它对应的虚拟头结点
- `p` 指向`原链表` ，并且每次` while` 循环都更新 `p` (一定要注意断开每个节点的 `next` 指针)
- 最后，连接两个 虚拟头结点，返回 `dummy1.next`

```javascript
var partition = function (head, x) {
    // 存放小于 x 的链表的虚拟头结点
    var dummy1 = new ListNode(-1);
    // 存放大于等于 x 的链表的虚拟头结点
    var dummy2 = new ListNode(-1);
    // p1, p2 指针负责生成结果链表
    var p1 = dummy1, p2 = dummy2;
    // p 负责遍历原链表，类似合并两个有序链表的逻辑
    // 这里是将一个链表分解成两个链表
    var p = head;
    while (p !== null) {
        if (p.val >= x) {
            p2.next = p;
            p2 = p2.next;
        } else {
            p1.next = p;
            p1 = p1.next;
        }
    // 原链表的指针不断前进 
    // p = p.next;
    ////////// ==============>
        // 断开原链表中的每个节点的 next 指针
      // todo 
    }
    
    // 连接两个链表
    p1.next = dummy2.next;
    return dummy1.next;
}
```

### 踩过的坑

![|576](https://832-1310531898.cos.ap-beijing.myqcloud.com/5730a315459e150017323bbcdaddd6ab.png)

#### 解决方法 1

断开原链表中的每个节点的 `next` 指针 ，具体代码如上

#### 解决方法 2

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/a091f56e19c9fcaaac00e6e23b6af9e7.png)
