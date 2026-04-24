# 反转单链表：反转全部、反转前 N 个节点、反转一部分

## 1. 反转单链表

### 1.1. 题目

https://leetcode.cn/problems/reverse-linked-list/

![image.png|543](https://832-1310531898.cos.ap-beijing.myqcloud.com/a444f3cfa45e08ed2455b6d3a6ed5679.png)

这个算法常常拿来显示递归的巧妙和优美

对于递归算法，**最重要的就是明确递归函数的定义**:  输入一个节点 `head`，将「以 `head` 为起点」的链表反转，并返回反转之后的头结点 

### 1.2. 代码实现

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */

var reverseList = function(head) {
  // ① base case 
  if(head === null || head.next === null){
        return head;
   }
  // ② 递归
  let last = reverseList(head.next)
  // ③ 上面的递归完成后，这时候只需要 `第二个节点` 处理后面的节点指向即可
  head.next.next = head;
  head.next = null;
  // ④ 返回 last
  return last;
};
```

### 1.3. 分析：见下面的流程图

https://www.figma.com/file/9busNTH6MZx5E6ZU8Xfahx/2023.07?type=whiteboard&node-id=1-159&t=CYZxXXoabx9ztccc-4

> [!info]
> - 不要跳进递归（你的脑袋能压几个栈呀？）
> - 不要想着彻底理解它，仔细看上面的流程图即可

## 2. 反转链表前 N 个节点

### 2.1. 迭代解法

两步，如下图

1. 将 1 2 3 变成 3 2 1 如下图标注中的 `①`
2. 将 1 指向 4 ，如下图中的 `②`
 
![image.png|510](https://832-1310531898.cos.ap-beijing.myqcloud.com/5fb53c7d851607b64d3ad4b6ef17f25c.png)

> [!danger]
> - 上图标注的红色的 `① ②` ，然后正常写递归就好了
> - 注意两个变量 `curr` 和 `prev`，你应该就能写出了

```javascript
function reverseN(head, n) {
  // 迭代，解法， 
  // 第 ① 步：操作链表的指针
  var curr = head;
  var prev = null;
  for (var i = 0; i < n; i++) {
	// 下面两行代码就是更换位置
    curr.next = prev; 
    prev = curr; 
    // 然后，前进
    curr = curr.next;
  }
  // 第 ② 步：递归完后，还需要处理指向
  head.next = curr;
  return prev;
}
```

### 2.2. 递归解法

> [!danger]
> 再看又不好理解了，pass 吧，看迭代解法即可，时间有限，点到位置

```javascript

var successor = null; // 后驱节点

// 反转以 head 为起点的 n 个节点，返回新的头结点
function reverseN(head, n) {
    // ① base case
    // 反转一个元素，就是它本身，同时要记录后驱节点
    if (n === 1) {
        // 记录第 n + 1 个节点
        successor = head.next;
        return head;
    }
    // ② 递归
    // 以 head.next 为起点，需要反转前 n - 1 个节点
    var last = reverseN(head.next, n - 1);
	// ③ 处理递归后的节点指向
    head.next.next = head;
    // 让反转之后的 head 节点和后面的节点连起来
    head.next = successor;
    // ④ 返回 last 即可
    return last;
}
```

![image.png|480](https://832-1310531898.cos.ap-beijing.myqcloud.com/caeae889a676751bdd2c7d083c720ecd.png)

## 3. 反转链表的一部分

给一个索引区间 `[m, n]`（索引从 `1` 开始），仅仅反转区间中的链表元素

- 如果 `m == 1`，就相当于反转链表开头的 n 个元素，见  [#二、反转链表前 N 个节点](/G2ICH1#%E4%BA%8C%E3%80%81%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8%E5%89%8D-N-%E4%B8%AA%E8%8A%82%E7%82%B9)
- 如果 `m != 1`
	-  `head` 的索引视为 `1`，那么我们是想从`第 m 个元素`开始反转对吧
	-  `head.next` 的索引视为 `1` 呢？那么相对于 `head.next`，反转的区间应该是从`第 m - 1 个元素`开始的。
	- 那么对于 `head.next.next` 呢？反转的区间应该是从`第 m - 2 个元素`开始的
	- 依次往下推，直到

```javascript
var reverseBetween = function (head, m, n) {
    // ① base case
    if (m === 1) {
        // 反转以head开头的n个节点
        return reverseN(head, n);
    }
    // ② 将 head.next 作为起点 反转 前 m-1 个节点
    head.next = reverseBetween(head.next, m - 1, n - 1);
    return head;
}
```

>  **这个流程图可以不用看**，直接看上面文本更好理解 ，具体分析过程见：  https://www.figma.com/file/9busNTH6MZx5E6ZU8Xfahx/2023.07?type=whiteboard&node-id=25-107&t=T9anQJy5miIZYOFR-4

## 4. 最后

- 不要跳进`递归`， 你的脑袋瓜子能搞几个 `递归`
- 递归操作链表并不高效。和`迭代解法`相比，虽然时间复杂度都是 `O(N)`，但是迭代解法的`空间复杂度是 O(1)`，而递归解法需要`堆栈`，`空间复杂度`是 `O(N)`
