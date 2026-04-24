# 有序矩阵中第 K 小的元素

`#算法/二维数组` 


>  [378. 有序矩阵中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix/)

## 1. 思路一：打平成一维 → 排序返回即可

```javascript
var kthSmallest = function (matrix, k) {
  let m = matrix.length;
  let n = matrix[0].length;
  let res = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      res.push(matrix[i][j]);
    }
  }
  res.sort((a, b) => a - b);
  return res[k - 1];
};
```

## 2. 思路二：合并 K 个有序数组的思路

- 其实 [23. 合并 K 个升序链表](/lga9R0) 的变体
- 另外也可以参考 [264. 丑数 II](/8Y2b2H)
