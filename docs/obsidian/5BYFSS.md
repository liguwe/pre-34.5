# 使用两个栈实现队列

`#队列` `#栈` 

> [232. 用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

为什么需要**两个栈**：
- 一个栈用于处理入队操作（s1）
- 另一个栈用于处理出队操作（s2）
- 通过在两个栈之间倒腾元素，实现顺序的反转


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250107.png)

## 总结

- 只能使用栈的：
	- push 和 pop
- 当 s1 和 s2 都不为空时，每次 push 时，正常 push 到 s1 中，这时候调用 pop 正常从 s2 中取
	- 仅仅 **s2 为空时，做一次搬移**
- 为空判断：
	- s1 和 s2 都为空时

## 代码

```javascript
var MyQueue = function () {
  // 使用栈的特性：push、pop
  this.s1 = []; // 入队时使用的栈
  this.s2 = []; // 出队时使用的栈
};

MyQueue.prototype.push = function (x) {
  this.s1.push(x);
};

// 删除队头的元素并返回
MyQueue.prototype.pop = function () {
  // 先调用 peek 保证 s2 非空
  this.peek();
  return this.s2.pop();
};

// 返回队头元素
MyQueue.prototype.peek = function () {
  // 如果 s2 为空时，把 s1 中的元素挪到 s2 中
  // 先从 s1 出栈，紧接着入栈 s2
  if (this.s2.length === 0) {
    while (this.s1.length !== 0) {
      let last = this.s1.pop();
      this.s2.push(last);
    }
  }
  return this.s2[this.s2.length - 1];
};

MyQueue.prototype.empty = function () {
  // 两个栈都为空时，队列才为空
  return this.s1.length === 0 && this.s2.length === 0;
};
```

## 相关题目

- [225. 用队列实现栈](/MoP2ym)
