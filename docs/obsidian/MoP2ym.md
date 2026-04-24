# 用队列实现栈

`#队列` `#栈` 

> [225. 用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)

## 分析

- JavaScript 的**列队**即相当于
	- 入队： push 
	- 出队： shift
- JavaScript 的**栈**即相当于
	- 入栈： push 
	- 出栈： pop

>  所以，**其实 unshift 其实用不着**

故本题 使用`列队`实现`栈` ，所以只能使用   `push` 和 `shift`

- **只使用队列的操作（push 和 shift）**来实现栈的功能
- 使用 while 或者 for 循环

## 重点：

- push
	- 通过在每次 `push` 操作后**重新排列队列**元素，确保**最后入队的元素总是在队首**
- pop
	- 直接使用列队的对首元素即可
- top
	- 第一个元素


## 代码

```javascript
/**
 * 用队列实现栈
 * 使用一个队列就可以实现
 */
var MyStack = function () {
  // 初始化队列
  // 在 JavaScript 中使用数组模拟队列
  // 只能使用队列的操作：push(入队)和shift(出队)
  this.q = [];
};

/**
 * 入栈操作
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function (x) {
  // 1. 先将元素入队
  this.q.push(x);
  // 2. 把队列前面的所有元素都依次出队，然后再入队
  // 这样可以实现最后入队的元素到队首
  for (let i = 0; i < this.q.length - 1; i++) {
    let first = this.q.shift();
    this.q.push(first);
  }
};

/**
 * 出栈操作
 * @return {number}
 */
MyStack.prototype.pop = function () {
  // 直接将队首元素出队即可
  return this.q.shift();
};

/**
 * 获取栈顶元素
 * @return {number}
 */
MyStack.prototype.top = function () {
  // 队首元素就是栈顶元素
  return this.q[0];
};

/**
 * 判断栈是否为空
 * @return {boolean}
 */
MyStack.prototype.empty = function () {
  return this.q.length === 0;
};

```
