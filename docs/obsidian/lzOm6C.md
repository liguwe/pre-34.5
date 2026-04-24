# 二维区域和检索 - 矩阵不可变

`#算法/前缀和` 

>  [304. 二维区域和检索 - 矩阵不可变](https://leetcode.cn/problems/range-sum-query-2d-immutable/)


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250123.png)


- 四个大矩阵有一个共同的特点，就是`左上角`都是 `(0, 0)` 原点，已上图为例
- 当 `i = 2 , j = 2` 时
	- `preSum[2][2] = preSum[i-1][2] + preSum[2][2-1] + mat[i-1][i-1] - preSum[i-1][j-1]` 
	- `preSum` 是 `(m + 1)  * (n + 1)` 的二维矩阵


```javascript
var NumMatrix = function (matrix) {
    let m = matrix.length;
    let n = matrix[0].length;
    let preSum = new Array(m + 1).fill(0).map(() => {
        return new Array(n + 1).fill(0);
    });
    for (let i = 1; i < m + 1; i++) {
        for (let j = 1; j < n + 1; j++) {
            // 矩阵 [0, 0, i, j] 的元素和
            preSum[i][j] =
                preSum[i - 1][j] +
                preSum[i][j - 1] +
                matrix[i - 1][j - 1] -
                preSum[i - 1][j - 1];
        }
    }
    this.preSum = preSum;
};
NumMatrix.prototype.sumRegion = function (x1, y1, x2, y2) {
    return (
        this.preSum[x2 + 1][y2 + 1] -
        this.preSum[x1][y2 + 1] -
        this.preSum[x2 + 1][y1] +
        this.preSum[x1][y1]
    );
};
```
