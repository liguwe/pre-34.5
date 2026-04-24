# 将矩阵按对角线排序

> [1329. 将矩阵按对角线排序](https://leetcode.cn/problems/sort-the-matrix-diagonally/)


> 即按照对角线排序
> ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250210.png)

## 1. 总结

- 用一个**哈希表**把每个对角线的元素存起来
	- 关键点：如何快速判断 两个元素坐标是否在同一个对角线上？
		- 右下角走一步横纵坐标都会加一，所以**在同一个对角线上的元素，其横纵坐标之差是相同的**
		- 即 `i - j` 即可
- 排好序
- 最后放回二维矩阵上即可

>  后面**都使用 obj 来代表哈希**就好了

## 2. 代码

```javascript
/**
 * 1329. 将矩阵按对角线排序
 * 将矩阵中同一条从左上到右下的对角线上的元素排序
 * 
 * @param {number[][]} mat - 输入矩阵
 * @return {number[][]} - 返回按对角线排序后的矩阵
 */
var diagonalSort = function (mat) {
    // 用对象存储每条对角线上的元素
    // key: i-j (对角线标识), value: 该对角线上的元素数组
    let obj = {};
    let m = mat.length;
    let n = mat[0].length;

    // 第一次遍历：收集每条对角线上的元素
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // 同一对角线上的元素满足 i-j 相同
            let id = i - j;
            if (obj[id]) {
                obj[id].push(mat[i][j]);
            } else {
                obj[id] = [mat[i][j]];
            }
        }
    }

    // 对每条对角线上的元素进行排序
    for (let k of Object.keys(obj)) {
        obj[k].sort((a, b) => a - b);
    }

    // 第二次遍历：将排序后的元素放回矩阵
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            let id = i - j;
            // 使用 shift() 按顺序取出排序后的元素
            mat[i][j] = obj[id].shift();
        }
    }

    return mat;
};

```
