# 统计封闭岛屿的数目：全岛的数量

>  [1254. 统计封闭岛屿的数目](https://leetcode.cn/problems/number-of-closed-islands/)

## 1. 总结

- 先要把靠边的都淹掉
- 之后就和 [200. 岛屿数量](/yPfGhS)一样了
- 注意： `0` 代表`陆地`，`1` 代表`海水`
	- 是数字不是字符串


```javascript
var closedIsland = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let res = 0;

  for (let i = 0; i < m; i++) {
    dfs(i, 0);
    dfs(i, n - 1);
  }

  for (let j = 0; j < n; j++) {
    dfs(0, j);
    dfs(m - 1, j);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 0) {
        res++;
        dfs(i, j);
      }
    }
  }
  return res;
  function dfs(i, j) {
    if (i < 0 || j < 0 || i >= m || j >= n) {
      return;
    }
    if (grid[i][j] === 1) return;
    grid[i][j] = 1;
    dfs(i, j - 1);
    dfs(i, j + 1);
    dfs(i - 1, j);
    dfs(i + 1, j);
  }
};

```

## 2. 题目

- `0` 代表`陆地`，`1` 代表`海水`
- 封闭岛屿，即`全岛`
	- 就是上下左右全部被  `海水 1` 包围的 `陆地 0`
	- 也就是说`靠边的陆地不算作「封闭岛屿」`
	- 即`半岛`不算，`全岛`才算

## 3. 思路

- 先把**靠边的**都淹掉
	- 把靠上边的岛屿淹掉
	- 把靠下边的岛屿淹掉
	- 把靠左边的岛屿淹掉
	- 把靠右边的岛屿淹掉
- 然后再遍历，思路就和上题一样了
	- 从 `(i, j)` 开始，将与之相邻的陆地都变成海水

## 4. 代码

```javascript hl:6,12,8,14
var closedIsland = function (grid) {
  var m = grid.length,
    n = grid[0].length;
  // 主函数：计算封闭岛屿的数量
  for (let j = 0; j < n; j++) {
    // 把靠上边的岛屿淹掉
    dfs(grid, 0, j);
    // 把靠下边的岛屿淹掉
    dfs(grid, m - 1, j);
  }
  for (let i = 0; i < m; i++) {
    // 把靠左边的岛屿淹掉
    dfs(grid, i, 0);
    // 把靠右边的岛屿淹掉
    dfs(grid, i, n - 1);
  }
  // 遍历 grid，剩下的岛屿都是封闭岛屿
  let res = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] == 0) {
        res++;
        dfs(grid, i, j);
      }
    }
  }
  return res;

  // 从 (i, j) 开始，将与之相邻的陆地都变成海水
  function dfs(grid, i, j) {
    let m = grid.length,
      n = grid[0].length;
    if (i < 0 || j < 0 || i >= m || j >= n) {
      return;
    }
    if (grid[i][j] == 1) {
      // 已经是海水了
      return;
    }
    // 将 (i, j) 变成海水
    grid[i][j] = 1;
    // 淹没上下左右的陆地
    dfs(grid, i + 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i - 1, j);
    dfs(grid, i, j - 1);
  }
};

```
