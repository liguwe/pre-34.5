# 二叉树的层序遍历

> [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

## 1. 总结

![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/e80c234bde21ae68b50486fcd25f1061.png)


> [!danger]
> 一定要注意 base case ，搞了一会儿，发现是 base case 没写

```javascript hl:2
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  let q = [root];
  let res = [];
  while (q.length) {
    let arr = [];
    let size = q.length;
    for (let i = 0; i < size; i++) {
      let cur = q.shift();
      arr.push(cur.val);
      if (cur.left) q.push(cur.left);
      if (cur.right) q.push(cur.right);
    }
    res.push(arr);
  }
  return res;
};
```

## 2. 题目

![image.png|584](https://832-1310531898.cos.ap-beijing.myqcloud.com/dd5bac7e1d5221a13ccb0336ce2d97d4.png)

- 注意是`队列`，所以是 `push` 和 `shift`，而不是 `pop` 
	- `while 循环`，管从上到下
	- `for 循环`， 分管和从左到右的遍历

## 3. 代码

```javascript
/*
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
    // 如果根节点为空，则返回空数组
    if (root === null) return [];
    // 返回的结果
    const res = [];
    // 辅助队列,初始化队列，首先加入根节点
    const q = [root];

    while (q.length) {
        const size = q.length;
        // 用于存储当前层的节点值
        const currentLevel = [];
        for (let i = 0; i < size; i++) {
            // :::::出队列
            const node = q.shift();
            currentLevel.push(node.val);
            // :::::左节点先入队列
            if (node.left) {
                q.push(node.left);
            }
            // :::::右节点后入队列
            if (node.right) {
                q.push(node.right);
            }
        }
        res.push(currentLevel);
    }
    return res;
};

```

## 遍历的思路

```javascript
// DFS 思路
var levelTraverse = function(){
    res = [];
    const traverse = function(root, depth) {
        if (root === null) {
            return;
        }
        // 前序位置，看看是否已经存储 depth 层的节点了
        if (res.length <= depth) {
            // 第一次进入 depth 层
            res.push([]);
        }
        // 前序位置，在 depth 层添加 root 节点的值
        res[depth].push(root.val);
        traverse(root.left, depth + 1);
        traverse(root.right, depth + 1);
    }
    // root 视为第 0 层
    traverse(root, 0);
    return res;
}
```
