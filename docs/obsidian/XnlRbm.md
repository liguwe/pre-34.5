# 二维矩阵遍历框架

`#算法/DFS` 

> 岛屿系列题目的核心考点就是： 用 DFS/BFS 算法遍历二维数组，本文都使用 DFS 算法

- 二维矩阵本质上是一幅「图」
- 所以遍历的过程中需要一个 `visited` 布尔数组防止走回头路

```javascript hl:7,12
// 二维矩阵遍历框架
var dfs = function (grid, i, j, visited) {
  var m = grid.length,
    n = grid[0].length;

  if (i < 0 || j < 0 || i >= m || j >= n) {
    // 超出索引边界
    return;
  }

  if (visited[i][j]) {
    // 已遍历过 (i, j)
    return;
  }

  // 进入当前节点 (i, j)
  visited[i][j] = true;

  // 进入相邻节点（四叉树）
  // 上
  dfs(grid, i - 1, j, visited);
  // 下
  dfs(grid, i + 1, j, visited);
  // 左
  dfs(grid, i, j - 1, visited);
  // 右
  dfs(grid, i, j + 1, visited);
};

```
