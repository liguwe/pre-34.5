# 不同岛屿的数量：形状不同的岛屿

`#leetcode-plus` 

`#DFS` 

> [694. 不同岛屿的数量](https://leetcode.cn/problems/number-of-distinct-islands/)
> 

## 1. 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250115.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250115-1.png)

## 2. 思路

- 对于形状相同的岛屿，如果从同一起点出发，`dfs` 函数遍历的顺序肯定是一样的
	- 因为遍历顺序是写死在你的递归函数里面的，不会动态改变

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250115-2.png)

## 3. 代码

- 使用 Set 集合，方便去重
- 后续位置撤销时，不能 pop
	- 因为 不记录撤销，无法保证遍历的唯一性

```javascript
var numDistinctIslands = function (grid) {
  let m = grid.length,
    n = grid[0].length;
  // 记录所有岛屿的序列化结果
  let islands = new Set();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 发现是一个岛屿，淹掉这个岛屿，同时存储岛屿的序列化结果
      if (grid[i][j] === 1) {
        let path = [];
        dfs(i, j, path, 999); // 初始的方向可以随便写，不影响正确性，代表首尾
        console.log(path); // 类似于 [999, 2, 4, 1, -1, -4, -2, -999]
        islands.add(path.join(","));
      }
    }
  }
  // 不相同的岛屿数量
  return islands.size;

  function dfs(i, j, path, dir) {
    if (i < 0 || j < 0 || i >= m || j >= n) {
      return;
    }
    if (grid[i][j] === 0) return;
    // 前序遍历位置：进入 (i, j)
    grid[i][j] = 0;
    path.push(dir);
    dfs(i - 1, j, path, 1); // 上
    dfs(i + 1, j, path, 2); // 下
    dfs(i, j - 1, path, 3); // 左
    dfs(i, j + 1, path, 4); // 右
    // 后序遍历位置：离开 (i, j)
    path.push(-dir);
  }
};

```

## 4. 相似题目

- [200. 岛屿数量](/yPfGhS)
