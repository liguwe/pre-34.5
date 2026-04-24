# 二叉树的层平均值

> [637. 二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)

- 层次遍历 [102. 二叉树的层序遍历](/EYXDXq) 
- 然后计算平均值即可

```javascript hl:19,22
var averageOfLevels = function (root) {
  let res = [];
  if (!root) return res;
  let q = [];
  q.push(root);
  while (q.length > 0) {
    let size = q.length;
    // 记录当前层所有节点之和
    let sum = 0;
    for (let i = 0; i < size; i++) {
      let cur = q.shift();
      if (cur.left) {
        q.push(cur.left);
      }
      if (cur.right) {
        q.push(cur.right);
      }
      sum += cur.val;
    }
    // 记录当前行的平均值
    res.push((1.0 * sum) / size);
  }

  return res;
};

```
