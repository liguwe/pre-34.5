# 矩阵区域和

`#算法/前缀和` 

>  [1314. 矩阵区域和](https://leetcode.cn/problems/matrix-block-sum/)

1. 给定一个矩阵 `mat`，和一个 `K`
2. 要求计算一个新的矩阵 `answer`
	- 其中 `answer[i][j]` 表示 `以 (i,j) 为中心` 的 `2k + 1` 区域内所有元素的和


```javascript
mat = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
] 
k = 1

比如：
- answer[1][1] = 1+2+3+4+5+6+7+8+9 = 45
- answer[0][0]  `sum = 1 + 2 + 4 + 5 = 12`

[12, 21, 16]
[27, 45, 33]
[24, 39, 28]
```


所以使用 [304. 二维区域和检索 - 矩阵不可变](/lzOm6C) 定义的类，很快能够解除此题
- 修正不能组成 `2k+1` 的矩阵

```javascript
var matrixBlockSum = function (mat, k) {
    const m = mat.length,
        n = mat[0].length;
    const numMatrix = new NumMatrix(mat);
    const res = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // 左上角的坐标
            const x1 = Math.max(i - k, 0);
            const y1 = Math.max(j - k, 0);
            // 右下角坐标
            const x2 = Math.min(i + k, m - 1);
            const y2 = Math.min(j + k, n - 1);
            res[i][j] = numMatrix.sumRegion(x1, y1, x2, y2);
        }
    }
    return res;
};

class NumMatrix {
    constructor(matrix) {
        const m = matrix.length,
            n = matrix[0].length;
        // 定义：preSum[i][j] 记录 matrix 中子矩阵 [0, 0, i-1, j-1] 的元素和
        this.preSum = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
        // 构造前缀和矩阵
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                // 计算每个矩阵 [0, 0, i, j] 的元素和
                this.preSum[i][j] =
                    this.preSum[i - 1][j] +
                    this.preSum[i][j - 1] +
                    matrix[i - 1][j - 1] -
                    this.preSum[i - 1][j - 1];
            }
        }
    }

    sumRegion(x1, y1, x2, y2) {
        // 计算子矩阵 [x1, y1, x2, y2] 的元素和
        // 目标矩阵之和由四个相邻矩阵运算获得
        return (
            this.preSum[x2 + 1][y2 + 1] -
            this.preSum[x1][y2 + 1] -
            this.preSum[x2 + 1][y1] +
            this.preSum[x1][y1]
        );
    }
}

```
