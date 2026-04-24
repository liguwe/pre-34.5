# 在每个树行中找最大值

>  [515. 在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250113-4.png)

- 层次遍历，参考[102. 二叉树的层序遍历](/EYXDXq)
	- 遍历过程中更新每一行的最大值即可
- 注意
	- 使用 `Math.max();` 和 `Infinity` 可以
	- 但使用 `Number.MIN_VALUE` 不行

```javascript hl:11,12
var largestValues = function (root) {
  let res = [];
  if (root === null) {
    return res;
  }
  let q = [];
  q.push(root);
  while (q.length > 0) {
    let sz = q.length;
    // 记录这一层的最大值
    let levelMax = -Infinity;
    // 或者 let levelMax = Math.max();
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < sz; i++) {
      let cur = q.shift();
      levelMax = Math.max(levelMax, cur.val);
      if (cur.left !== null) q.push(cur.left);
      if (cur.right !== null) q.push(cur.right);
    }
    res.push(levelMax);
  }
  return res;
};
```
