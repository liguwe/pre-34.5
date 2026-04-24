# 双向队列：Python 描述

`#双向队列` `#列队` `#数据结构` 


## 1. 定义

双向队列兼具**栈与队列**的逻辑

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922112356.png)

其实就相对于 JS 中的 Array 的几个方法
- 对首入队：unshift
- 队首出队：shift
- 队尾入队：push
- 队尾出队：pop() 

## 2. 基于双向链表的实现

**双向链表** 很适合作为双向队列的底层数据结构，如下图

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922114233.png)

具体实现不展开了

## 3. 基于数组的实现

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922114337.png)

注意需要维护两个变量：`front` 和 `rear`

具体实现不展开了

## 4. 标准库 deque（双端队列）


> [!danger]
> 是的，它就是类似于的 JavaScript 的 Array，叫法不一样而已

- deque 是 "double-ended queue" 的缩写
- deque 是一个双端队列，允许你在队列的两端高效地进行添加和删除操作。它是线程安全的，并且在两端的操作时间复杂度都是 O(1)

```python
from collections import deque

# deque 的常用方法

# append(e)：向队尾插入元素 e

# appendleft(e)：向队头插入元素 e

# pop()：从队尾删除元素

# popleft()：从队头删除元素

# extend(iterable)：扩展队列，从队尾插入元素
#   iterable 为可迭代对象，如列表、元组、集合等

# extendleft(iterable)：扩展队列，从队头插入元素
#   iterable 为可迭代对象，如列表、元组、集合等

# rotate(n)：将队列旋转 n 步
#  n > 0 时，队列的最右边的 n 个元素会被移动到最左边
#  n < 0 时，队列的最左边的 n 个元素会被移动到最右边

# reverse()：反转队列

# clear()：清空队列

# count(e)：统计队列中元素 e 的个数

# remove(e)：删除队列中第一个出现的元素 e

# index(e)：返回队列中第一个出现的元素 e 的索引

# insert(i, e)：在索引 i 处插入元素 e

# copy()：复制队列

# maxlen：队列的最大长度，如果为 None 则表示队列长度无限制
#   maxlen 只能在创建 deque 对象时指定，不能通过方法修改
#   如果队列长度超过 maxlen，则会从另一端删除元素

```

## 5. 双向列队的作用


我们知道，软件的“撤销”功能通常使用栈来实现：系统将每次更改操作 `push` 到栈中，然后通过 `pop` 实现撤销。然而，考虑到系统资源的限制，软件通常会限制撤销的步数（例如仅允许保存 50 步）。当栈的长度超过 50 时，软件需要在栈底（队首）执行删除操作。**但栈无法实现该功能，此时就需要使用双向队列来替代栈**。请注意，“撤销”的核心逻辑仍然遵循栈的先入后出原则，只是双向队列能够更加灵活地实现一些额外逻辑。
