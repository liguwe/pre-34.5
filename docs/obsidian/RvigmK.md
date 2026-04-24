# 统计子岛屿：grid2 被 grid1包含多少个岛屿？

> [1905. 统计子岛屿](https://leetcode.cn/problems/count-sub-islands/)

## 1. 题目

- 岛屿 B：`grid2` 的岛屿
- 岛屿 A： `grid1` 的岛屿
	- `岛屿 B` **所有陆地** 在  `岛屿 A` 中也是陆地的时候
- 如果 `岛屿 B` 中存在一片陆地，在 `岛屿 A` 的对应位置是海水，那么 `岛屿 B` 就不是`岛屿  A` 的子岛

## 2. 思路

- 遍历 `grid2` 中的所有岛屿，把那些不可能是子岛的岛屿排除掉，剩下的就是子岛

## 3. 代码

- 注意点：
	- 当 `grid1` 中是海洋，`grid2` 中是岛屿
		- 把 `grid2` 对应的 `i,j` 都淹掉
			- 即只修改 `grid2` 

```javascript
var countSubIslands = function (grid1, grid2) {
  let m = grid1.length,
    n = grid1[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // grid1 中是海洋，grid2 中是岛屿
      // 那么这个岛屿肯定不是子岛，淹掉
      if (grid1[i][j] === 0 && grid2[i][j] === 1) {
        dfs(i, j);
      }
    }
  }

  // 现在 grid2 中剩下的岛屿都是子岛，计算岛屿数量
  let res = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid2[i][j] === 1) {
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
    // 已经是海洋了
    if (grid2[i][j] === 0) return;

    grid2[i][j] = 0;
    dfs(i + 1, j);
    dfs(i, j + 1);
    dfs(i - 1, j);
    dfs(i, j - 1);
  }
};
```
