# 层数最深叶子节点的和：返回最后一层的和

> [1302. 层数最深叶子节点的和](https://leetcode.cn/problems/deepest-leaves-sum/)

## 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250113-7.png)

## 思路

总结：
- 使用层次遍历
- 最后一层，计算和即可
	- **记得每一层记得都需要重置为 0**

```javascript hl:8
var deepestLeavesSum = function (root) {
  if (root === null) return 0;
  const q = [];
  q.push(root);

  let sum = 0;
  while (q.length > 0) {
    // 每一层记得都需要重置为 0
    sum = 0;
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const cur = q.shift();
      // 累加一层的节点之和
      sum += cur.val;
      if (cur.left !== null) q.push(cur.left);
      if (cur.right !== null) q.push(cur.right);
    }
  }
  // 现在就是最后一层的节点值和
  return sum;
};

```

## 相关

-  [102. 二叉树的层序遍历](/EYXDXq)
