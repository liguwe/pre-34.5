# 二叉树的垂序遍历

>  [987. 二叉树的垂序遍历](https://leetcode.cn/problems/vertical-order-traversal-of-a-binary-tree/)

- ① 坐标收集：`[row,col,val]`
	- 左子树：列号减1，行号加1
	- 右子树：列号加1，行号加1
- ② 基于 `[row,col,val](#)` 的二维数组做排序操作即可
	- 按列号升序
	- 同列按行号升序
	- 同行同列按节点值升序
- ③ 整理结果
	- 如果当前列号和前一个不同，创建新数组
	- 否则添加到当前数组


```javascript
var verticalTraversal = function (root) {
    let res = [];
    let grid = [];
    // ① 坐标收集：[row,col,val]
    function traverse(root, row, col) {
        if (!root) return;
        grid.push([row, col, root.val]);
        traverse(root.left, row + 1, col - 1);
        traverse(root.right, row + 1, col + 1);
    }
    traverse(root, 0, 0);

    // ② 基于 [row,col,val](#) 的二维数组做排序操作
    grid.sort((a, b) => {
        if (a[1] !== b[1]) return a[1] - b[1]; // 按列排序
        if (a[0] !== b[0]) return a[0] - b[0]; // 按行排序
        return a[2] - b[2]; // 按节点值排序
    });

    // ③ 整理结果
    if (grid.length === 0) return res;
    let currentCol = grid[0][1];
    let currentColNodes = [grid[0][2]];
    for (let i = 1; i < grid.length; i++) {
        if (grid[i][1] === currentCol) {
            // 同一列，继续添加节点值
            currentColNodes.push(grid[i][2]);
        } else {
            // 新的一列，保存之前的结果，开始新的数组
            res.push(currentColNodes);
            currentCol = grid[i][1];
            currentColNodes = [grid[i][2]];
        }
    }
    // 添加最后一列
    res.push(currentColNodes);
    return res;
};
```
