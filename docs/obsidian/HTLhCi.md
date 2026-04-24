# 算法核心框架

`#算法` 

## 一句话总结

- 数据结构基础的就两种
	- 数组：顺序储存
	- 链表：链式存储
- 两种数据结构只做两件事情，或者说只做增删查改
	- 遍历
	- 访问
- 一起算法的本质是**穷举**

## 本文画板

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/计算机算法框架思维.jpg)

## 数据结构的存储方式就两种：数组和链表

- 哈希表
	- 拉链法：链表
	- 线性探测法：数组
- 栈和队列
	- 都可使用链表和数组来实现
- 堆
	- 使用数组实现，因为是完全二叉树
- 树
	- 完全二叉树，适合使用数组来存储
	- 非完全二叉树，适合使用链表存储
- 图
	- 邻接表：链表
	- 邻接矩阵：二维数组

## 所有数据结构的操作，只有访问+遍历（增删改查）

- 再拆解，**遍历+访问**只有两种形式
	- 线性的： for/while
		- 数组遍历
		- 链表遍历：同时具备线性和非线性的遍历方式
	- 非线性的：即递归
		- 链表遍历：同时具备线性和非线性的遍历方式
		- 二叉树的遍历是非线性的
		- 多叉树的遍历是非线性的
		- 图的遍历也是非线性的

以下是代码示例：

### 线性：数组的遍历框架

```javascript
/*****************************************
 * 线性：数组的遍历框架
 *****************************************/
function traverse(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 对当前元素进行操作
    console.log(arr[i]);
  }
}
```

### 线性：链表的遍历框架（记得使用 p 变量）

```javascript hl:10,17,22
/*****************************************
 * 线性：链表的遍历框架（记得使用 p 变量）
 *****************************************/
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
// 使用 for 循环
function traverse(node) {
  for (let p = node; p !== null; p = p.next) {
    // 对当前节点进行操作
    console.log(p.val);
  }
}
// 使用 while 循环
function traverse(node) {
  let p = node;
  while (p !== null) {
    // 对当前节点进行操作
    // 有点类似于 前序位置
    console.log(p.val);
    p = p.next;
  }
}

```

### 非线性（递归）：链表的遍历框架

```javascript
/*****************************************
 * 非线性（递归）：链表的遍历框架
 *****************************************/
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
// 递归遍历链表
function traverse(node) {
  if (node === null) return;
  console.log(node.val);
  traverse(node.next);
}

```

### 非线性（递归）：二叉树的遍历框架

```js
/*****************************************
 * 非线性（递归）：二叉树的遍历框架
 *****************************************/
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}
// 递归遍历链表
function traverse(node) {
  if (node === null) {
    return;
  }
  // 前序遍历
  traverse(node.left);
  // 中序遍历
  traverse(node.right);
  // 后序遍历
}

```

### 非线性（递归）：多叉树的遍历框架

```js
/*****************************************
 * 非线性（递归）：多叉树的遍历框架
 *****************************************/
class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
}
// 递归遍历链表
function traverse(node) {
  if (!node) return;
  console.log(node.value);
  //前序位置
  for (let i = 0; i < node.children.length; i++) {
    traverse(node.children[i]);
  }
  //后序位置
}

```

### 非线性（递归）：图的遍历框架

`N` 叉树的遍历又可以扩展为图的遍历，因为图就是好几 `N` 叉棵树的结合体。你说图是可能出现环的？这个很好办，用个布尔数组 `visited` 做标记就行了

## 算法的本质是穷举

- 数学算法和计算机算法是有区别的
	- 数学算法可以推导出公式
	- 但计算机算法不能，别一上来就想着推导出公式，不然必然死翘翘
- 计算机最牛逼的不就是算的快吗，1s 转几万次，但人脑不行啊，所以才说别想着像计算机一样递归
- 穷举的两个难点
	- 无遗漏
		- 回溯算法：遍历的思维
		- 动态规划算法：分解问题思维
			- 为何分解问题的思维？
				- 树上只有一片叶子，和剩下的叶子 
					- 再分解：树上只有一片叶子，和剩下的叶子 
						- 再分解：树上只有一片叶子，和剩下的叶子 
	- 如何避免重复的穷举（聪明地穷举）
		- 备忘录
		- 空间压缩技巧
		- 二分
		- 连通分量技巧 ？
		- 贪心等
		- 双指针
			- 快慢指针
		- 前缀和
		- 差分数组

## 二叉树算法：二叉树模型是所有高级算法的基础

- 遍历的思维模式
- 分解问题的思维模式


## 参考

> https://labuladong.online/algo/essential-technique/algorithm-summary/
