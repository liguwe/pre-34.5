# 转置矩阵

`#算法/二维数组` 


>  https://leetcode.cn/problems/transpose-matrix/description/



> [!danger]
> 记得二维数组，**在脑子遍历一遍**，其实很好理解的

## 总结

- 初始化两个变量：m 和 n 
- 初始化 res： m 和 n 反过来
- 注意点：
	- 如何初始化，**注意对象的引用问题**
	- m 和 n 需要反过来，转置矩阵

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
  let m = matrix.length;
  let n = matrix[0].length;
  // 注意 1：如何初始化，注意对象的引用问题
  // 注意 2：m 和 n 需要反过来
  let res = new Array(n).fill().map(() => {
    return new Array(m).map(() => {
      return -1;
    });
  });
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      res[j][i] = matrix[i][j];
    }
  }
  return res;
};

```
