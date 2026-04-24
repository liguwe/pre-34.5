# 二叉树的锯齿形层序遍历：Z 字形遍历

> [103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)


同 [102. 二叉树的层序遍历](/EYXDXq)，只不过添加一个 flag ，然后切换方向即可

```javascript hl:18,20,22,27
var zigzagLevelOrder = function (root) {
  let res = [];
  if (root === null) {
    return res;
  }
  let q = [];
  q.push(root);
  // 为 true 时向右，false 时向左
  let flag = true;
  // while 循环控制从上向下一层层遍历
  while (q.length > 0) {
    let sz = q.length;
    // 记录这一层的节点值
    let level = [];
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < sz; i++) {
      let cur = q.shift();
      // 实现 z 字形遍历
      if (flag) {
        level.push(cur.val);
      } else {
        level.unshift(cur.val);
      }
      if (cur.left !== null) q.push(cur.left);
      if (cur.right !== null) q.push(cur.right);
    }
    // 切换方向
    flag = !flag;
    res.push(level);
  }
  return res;
};
```
