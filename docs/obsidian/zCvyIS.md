# 相交链表

>  [160. 相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

## 1. 总结

- while (p1 !== p2) {
	- 然后**遍历到头了，指向另外一个的 head**

## 2. 代码

```javascript
var getIntersectionNode = function (headA, headB) {
  let p1 = headA;
  let p2 = headB;
  while (p1 !== p2) {
    if (p1) {
      p1 = p1.next;
    } else {
      p1 = headB;
    }
    if (p2) {
      p2 = p2.next;
    } else {
      p2 = headA;
    }
  }
  return p1; // 或者 return p2 一样的效果
};
```


> - `while (p1 !== p2) {` 不会死循环吗？
> 	- 不会
> 		- 如果相交，那么肯定会有 `p1 = p2` 时
> 		- 如果不会相交，那么最终也会 `p1 = p2 = null`

## 3. 题解

如下面，相交，所以返回 `c1`
![|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/def94355a4edce1c7384c0730bbb2a6a.png)
又如下面，返回，`8`
![|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/fdee7a7947e38677438607d6ee9de92f.png)

### 3.1. 思路 1

通过 `hash` 来判断出现过的次数，如果出现过两次，则说明相交了，但空间复杂度略高，需要额外的空间。即空间复杂度为 `O(m+n)`

### 3.2. 思路 2

关键点在于，拼接，哪个先遍历完，指针指向另外一个

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/beaa1e2785882f802f7c0c94903ebaf2.png)

空间复杂度为 `O(1)`，时间复杂度为 `O(N)`

### 3.3. 代码

```javascript
var getIntersectionNode = function (headA, headB) {
    // 都指向各自的头结点
    let p1 = headA;
    let p2 = headB;
    while (p1 !== p2) {
        if (p1 === null) {
            p1 = headB;
        } else {
            p1 = p1.next;
        }
        if (p2 === null) {
            p2 = headA;
        } else {
            p2 = p2.next;
        }
    }
    return p1;
};

```

## 4. 疑问

那你可能会问，如果说**两个链表没有相交点**，是否能够正确的返回 `null` 呢？
这个逻辑可以覆盖这种情况的，相当于 `c1` 节点是 `null空指针`，可以正确返回 null
