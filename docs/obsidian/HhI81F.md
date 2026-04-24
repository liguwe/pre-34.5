# 岛屿的最大面积：半岛也算

>  [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/)

## 1. 总结

- 重点：
	- 可以给 `dfs` 函数设置返回值，**记录每次淹没的陆地的个数**

```javascript
var maxAreaOfIsland = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let res = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 1) {
        res = Math.max(res, dfs(i, j));
      }
    }
  }

  return res;

  function dfs(i, j) {
    // 超出索引边界
    if (i < 0 || j < 0 || i >= m || j >= n) {
      return 0;
    }
    // 已经是海水了
    if (grid[i][j] === 0) {
      return 0;
    }
    grid[i][j] = 0;
    // 访问上下左右的陆地
    return (
      dfs(i + 1, j) + // 下
      dfs(i, j + 1) + // 右
      dfs(i - 1, j) + // 上
      dfs(i, j - 1) + // 左
      1 // 当前格子的面积
    ); 
  }
};
```

## 2. 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241113-5.png)

- 1 代表陆地
- 0 代表海洋

## 3. 思路

思路还是类似于 [200. 岛屿数量](/yPfGhS) ， 只不过 `dfs` 函数淹没岛屿的同时，还应该想办法`记录`这个岛屿的面积

所以：可以给 `dfs` 函数设置返回值，**记录每次淹没的陆地的个数**


```javascript
var maxAreaOfIsland = function (grid) {
  // 记录岛屿的最大面积
  let res = 0;
  let m = grid.length,
    n = grid[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] == 1) {
        // 淹没岛屿，并更新最大岛屿面积
        res = Math.max(res, dfs(grid, i, j));
      }
    }
  }
  return res;

  // 淹没与 (i, j) 相邻的陆地，并返回淹没的陆地面积
  function dfs(grid, i, j) {
    let m = grid.length,
      n = grid[0].length;
    if (i < 0 || j < 0 || i >= m || j >= n) {
      // 超出索引边界
      return 0;
    }
    if (grid[i][j] == 0) {
      // 已经是海水了
      return 0;
    }
    // 将 (i, j) 变成海水
    grid[i][j] = 0;

    return (
      dfs(grid, i + 1, j) +
      dfs(grid, i, j + 1) +
      dfs(grid, i - 1, j) +
      dfs(grid, i, j - 1) +
      1
    );
  }
};

```
