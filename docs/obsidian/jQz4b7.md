# 二叉树的层序遍历 II：自底向上的层序遍历

> [107. 二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)

## 代码

- 同 [102. 二叉树的层序遍历](/EYXDXq)， 只不过最后`push` 变成 `unshift` 即可
- 一定要注意 base case 

```javascript hl:18,3
var levelOrderBottom = function (root) {
  let res = [];
  if (!root) {
    return res;
  }
  let q = [];
  q.push(root);
  while (q.length > 0) {
    let sz = q.length;
    let level = [];
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < sz; i++) {
      let cur = q.shift();
      level.push(cur.val);
      if (cur.left) q.push(cur.left);
      if (cur.right) q.push(cur.right);
    }
    // 把每一层添加到头部，就是自底向上的层序遍历。
    res.unshift(level);
  }
  return res;
};
```

## 1. 更多

- 问：如果遍历，改成 `从上到下`， `从右到左` 呢 ？	
    - 同样，在 `for 循环` 里做文章
