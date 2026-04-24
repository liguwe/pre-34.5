# 在受污染的二叉树中查找元素

>  [1261. 在受污染的二叉树中查找元素](https://leetcode.cn/problems/find-elements-in-a-contaminated-binary-tree/)

## 1. 题目

1. 二叉树中所有节点的值`都被污染为 -1`
2. 我们需要还原这棵树的原始值
	- 规则是：
		- 根节点为 0，
			- 对于任意节点 `x` 
				- 其左子节点值为 `2 * x + 1`
				- 右子节点值为 `2 * x + 2`
3. 然后实现一个 `find` 方法来查找某个值`是否存在于`还原后的树中

### 1.1. 示例一

```javascript
输入：
        -1
       /  \
     -1   -1
初始所有节点都是 -1

还原后：
         0
       /  \
      1    2

调用示例：
find(1) -> true  (值1在树中)
find(2) -> true  (值2在树中)
find(3) -> false (值3不在树中)
find(4) -> false (值4不在树中)

```

### 1.2. 示例二

```javascript
输入：
        -1
       /  \
     -1   -1
    /
   -1

还原后：
         0
       /  \
      1    2
     /
    3

调用示例：
find(1) -> true   (值1在树中)
find(3) -> true   (值3在树中)
find(6) -> false  (值6不在树中)
```

## 2. 实现

- 要点一：定义一个 `Set` 集合存储所有节点的值，方便快速判断 `find`
- 要点二：遍历的思路，前序位置还原 `节点的 val` 和 `Set 集合`
- 要点三：`function (root, val) {` 两个参数

```javascript hl:2,8,10
var FindElements = function (root) {
    // 帮助 find 函数快速判断
    this.values = new Set();
    // 还原二叉树中的值
    this.traverse = function (root, val) {
        if (root === null) {
            return;
        }
        root.val = val;
        this.values.add(val);
        this.traverse(root.left, 2 * val + 1);
        this.traverse(root.right, 2 * val + 2);
    };
    this.traverse(root, 0);
};

/**
 * @param {number} target
 * @return {boolean}
 */
FindElements.prototype.find = function (target) {
    return this.values.has(target);
};
```
