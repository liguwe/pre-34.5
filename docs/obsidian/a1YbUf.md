# 重排链表：1→n-1→2→n-2→...

> [143. 重排链表](https://leetcode.cn/problems/reorder-list/)

## 1. 关键点

- 一个单链表只能从头部向尾部遍历节点，无法从尾部开始向头部遍历节点
	- 所以可以使用栈：
		- 头到尾的顺序让链表节点入栈
		- 那么**出栈顺序**就是反过来从尾到头了

## 2. 总结

- 以 1 → 2 → 3 → 4 为例
	- 定义变量：
		- p：
			-  复用一个就好，重新指向即可
		- s
			-  约定，代表栈
		- head 、next 、last
			- head 指向 1
			- next 指向 2
			- last 代表最后一个
			- 搞清楚他们应该互相怎么指向
	- 还是要**自己画画图**
	- break 条件：
		- if (last =** next || last.next **= next) {

>  不需要使用虚拟节点

## 3. 代码

```javascript hl:10
var reorderList = function (head) {
  let s = [];
  let p = head;
  while (p) {
    s.push(p);
    p = p.next;
  }
  // 重新指向 head = 1
  p = head;
  // 以 1 → 2 → 3 → 4 为例
  while (p) {
    // next = 2
    let next = p.next;
    // last = 4
    let last = s.pop();
    if (last === next || last.next === next) {
      last.next = null;
      break;
    }
    // 1 → 4
    p.next = last;
    // 4 → 2
    last.next = next;
    // 前进 p 指向 2
    p = next;
  }
};
```
