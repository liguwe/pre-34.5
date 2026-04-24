# 链表：JavaScript 描述

`#数据结构` 

> 这是`最基本、最底层`的两种存储结构

## 1. 快速概览

数组和链表 是所有数据结构的【基础】
数据结构种类很多，甚至你也可以发明自己的数据结构，但是底层存储无非数组或者链表，

### 1.1. 数组 

- 访问高效，能够随机访问，访问时间复杂度 `O(1)` 
	- 我们知道 计算机内存空间不是连续的 ，  **怎么实现能够随机访问的呢**？ →  三个条件
		- 第一个`内存地址`我们知道，即数组名 指向的地址
		- 地址紧凑存储 （但维护他就有成本，比如删除，涉及到数据搬移）
		- 索引为 `int` ，即每个字字节大小确定
	- 由于是紧凑连续存储, 可以`随机访问`，通过索引快速找到对应元素，而且相对节约存储空间。
- 缺点是低效的 `插入和删除`
	- 因为层需要大量的 `数据搬迁` 来保持数据的连续性； 
	- 即维护它需要成本，因为连续存储，内存空间必须一次性分配够，所以说数组如果要扩容，需要重新分配一块更大的空间，再把数据全部复制过去，时间复杂度` O(N)`； 
	- 而且你如果想在数组中间进行插入和删除，每次必须搬移后面的所有数据以保持连续，时间复杂度 `O(N)`。
		- 插入：从最好 `O(1)` ，最坏 `O(n)` ，平均 `O(n)`
		- 删除：从最好 `O(1)` ，最坏 `O(n) `，平均 `O(n)`

### 1.2. 链表

- 链表 
	- 元素不连续，而是靠指针指向下一个元素的位置，所以不存在数组的`扩容问题`；
	- 如果知道某一元素的`前驱和后驱`，操作指针即可删除该元素或者插入新元素，时间复杂度 `O(1)`。
	- 但是正因为存储空间不连续，你无法根据一个索引算出对应元素的地址，所以`不能随机访问`；
	- 而且由于每个元素必须存储指向前后元素位置的指针，会`消耗相对更多的储存空间`。

## 2. 数组

### 2.1. 如何自己实现一个 Array ？

- 需要注意的点：
	- 插入缝隙，`size`和 `length` 属性不一样；
		- `length` 代表真正的数组元素个数
		- `size` 代表缝隙数，方便插入或者删除的时候方便 
- 数组的扩容与缩容时，因为内存空间并不是连续的，而数组是 紧凑连续存储， 为了维护连续性，需要重新申请内存地址。

### 2.2. 问：如何使用 JS/TS实现 Array 的一些常用方法呢？ 

- 可参考 v8 Array implementation
- 或者：[https://github.com/zloirock/core-js#ecmascript-array](https://github.com/zloirock/core-js#ecmascript-array)

## 3. 链表数据结构

- 不支持 随机访问，如果需要找特定项，需要从头开始找，所以访问的时间复杂度为`O(n)`
- 高效的插入和删除，表中`插入和删除`一个数据是非常快速的，时间复杂度为 `O(1)` 

### 3.1. 如何实现一个链表数据结构呢？

注意点：
- 哨兵节点技巧：`head` `tail` 是技巧，可以理解为占位符
	- `head`一直指向第一个
	- `tail`一直指向最后一个
- 在后面很有用

### 3.2. 单链表

![image.png|528](https://832-1310531898.cos.ap-beijing.myqcloud.com/0542898d8fa6d910736fb27fba9b60f6.png)

```javascript
// Node 类 
export class Node {
  constructor(element, next) {
    this.element = element;
    this.next = next;
  }
}

export default class LinkedList {
  constructor() {
    this.count = 0;
    this.head = null;
  }

  push(element) {
    const node = new Node(element);
    let current;
    if (this.head == null) {
      this.head = node;
    } else {
      current = this.head;
      while (current.next != null) {
        current = current.next;
      }
      current.next = node;
    }
    this.count++;
  }

  getElementAt(index) {
    if (index >= 0 && index <= this.count) {
      let node = this.head;
      for (let i = 0; i < index && node != null; i++) {
        node = node.next;
      }
      return node;
    }
    return null;
  }

  insert(element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node(element);
      if (index === 0) {
        const current = this.head;
        node.next = current;
        this.head = node;
      } else {
        const previous = this.getElementAt(index - 1);
        node.next = previous.next;
        previous.next = node;
      }
      this.count++;
      return true;
    }
    return false;
  }

  removeAt(index) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = current.next;
      }
      this.count--;
      return current.element;
    }
    return undefined;
  }

  remove(element) {
    const index = this.indexOf(element);
    return this.removeAt(index);
  }

  indexOf(element) {
    let current = this.head;
    for (let i = 0; i < this.size() && current != null; i++) {
      if (element === current.element) {
        return i;
      }
      current = current.next;
    }
    return -1;
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    return this.count;
  }

  getHead() {
    return this.head;
  }

  clear() {
    this.head = undefined;
    this.count = 0;
  }

  toString() {
    if (this.head == null) {
      return '';
    }
    let objString = `${this.head.element}`;
    let current = this.head.next;
    for (let i = 1; i < this.size() && current != null; i++) {
      objString = `${objString},${current.element}`;
      current = current.next;
    }
    return objString;
  }
}
```

通过控制打印，就能看出对于JS来说，链表数据就是对象，里面存储这 `next` 属性。

![image.png|472](https://832-1310531898.cos.ap-beijing.myqcloud.com/389820c4f9173393d6149c2491f7b31b.png)

### 3.3. 双向链表

![image.png|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/8f6dc869c193063aad199bcc490cd88e.png)

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/4c700a89c496baf7fd654ed318a75acb.png)

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/217f996a736b94f64b1fbed202804866.png)

### 3.4. 循环列表

![image.png|472](https://832-1310531898.cos.ap-beijing.myqcloud.com/5975cb8f5b90f5e00b94c59eed80e557.png)
