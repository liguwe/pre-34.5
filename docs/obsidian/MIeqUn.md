# 相同的树：判断两个二叉树是否相同

`#二叉树`  `#二叉树/分解问题`

> [100. 相同的树](https://leetcode.cn/problems/same-tree/)


## 1. 总结

- 明确递归函数并且相信它
- 明确 base case
	- 这个题判断是否为空最好使用 `null`

```javascript
var isSameTree = function (p, q) {
  if (p === null && q === null) {
    return true;
  }
  if (p === null || q === null) {
    return false;
  }
  if (p.val !== q.val) {
    return false;
  }
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
```

## 2. 题目

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/6bf68f208bf310637368597563ebcc3b.png)

### 2.1. ① 明确`递归函数`的定义，并相信它

```javascript
/**
 * @description 判断两个二叉树是否相同
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
// :::第一步：定义：输入两棵树p、q，返回一个布尔值，表示两棵树是否相同
var isSameTree = function(p, q) {

};
```

### 2.2. ② `base case`, 递归`结束`的条件

```javascript
// ::::定义：输入两棵树p、q，返回一个布尔值，表示两棵树是否相同
var isSameTree = function(p, q) {

    // ::::第二步：base case, 递归结束的条件
    
    //:::: ① 条件一：两个节点都为空，返回true，说明两个节点相同
    if(p === null && q === null){
        return true;
    }
  
    // :::: ② 条件二：两个节点中有一个为空，一个不为空，返回false，说明两个节点不相同
    if(p === null || q === null){
        return false;
    }
  
    // :::: ③ 条件三：两个节点都不为空，但是值不相等，返回false，说明两个节点不相同
    if(p.val !== q.val){
        return false;
    }

};
```

### 2.3. ③ `递归调用左右子树`

```javascript
/**
 * @description 判断两个二叉树是否相同
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
// ::::第一步：定义：输入两棵树p、q，返回一个布尔值，表示两棵树是否相同
var isSameTree = function(p, q) {

    // ::::第二步：base case, 递归结束的条件

    //:::: ① 条件一：两个节点都为空，返回true，说明两个节点相同
    if(p === null && q === null){
        return true;
    }
    // :::: ② 条件二：两个节点中有一个为空，一个不为空，返回false，说明两个节点不相同
    if(p === null || q === null){
        return false;
    }
    // :::: ③ 条件三：两个节点都不为空，但是值不相等，返回false，说明两个节点不相同
    if(p.val !== q.val){
        return false;
    }

    // ::::::第三步：递归调用左右子树
    const isLeftSame = isSameTree(p.left, q.left);
    const isRightSame = isSameTree(p.right, q.right);

    return isLeftSame && isRightSame;

};

```
