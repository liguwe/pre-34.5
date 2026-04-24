# 奇偶树：第 0 层递增，第 1 层递减

> [1609. 奇偶树](https://leetcode.cn/problems/even-odd-tree/)

## 题目

- 第 0 层：递增，且都是奇数
- 第 1 层：递减，且都是偶数
- 第 2 层：递增，且都是奇数
- 第 3 层：递减，且都是偶数

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250113-8.png)


## 题解

```javascript
var isEvenOddTree = function (root) {
  if (root === null) {
    return true;
  }
  let q = [];
  q.push(root);
  // 记录奇偶层数
  let even = true;
  // while 循环控制从上向下一层层遍历
  while (q.length > 0) {
    let sz = q.length;
    // 记录前一个节点，便于判断是否递增/递减
    let prev = even ? Number.MIN_VALUE : Number.MAX_VALUE;
    // for 循环控制每一层从左向右遍历
    for (let i = 0; i < sz; i++) {
      let cur = q.shift();
      if (even) {
        // 偶数层
        if (prev >= cur.val || cur.val % 2 === 0) {
          return false;
        }
      } else {
        // 奇数层
        if (prev <= cur.val || cur.val % 2 === 1) {
          return false;
        }
      }
      prev = cur.val;

      if (cur.left !== null) {
        q.push(cur.left);
      }
      if (cur.right !== null) {
        q.push(cur.right);
      }
    }
    // 奇偶层数切换
    even = !even;
  }
  return true;
};
```
