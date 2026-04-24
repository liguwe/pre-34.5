# 腐烂的橘子

`#leetcode`   `#2024/09/16`  `#算法`  `#图BFS` `#算法/图` `#迷宫问题` 


> 很类似[1926.  迷宫中离入口最近的出口](/lFoVzx) ，都是迷宫问题，BFS 问题，但这题的关键是，从哪里开始扩散？


## 题目及理解

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240916091007.png)

## 思路一

关键点：
- 并不知道应该从哪里开始向四周扩散，所以
	- 第一步需要标记烂橘子到烂橘子🍊`queue  队列`
	- 统计新鲜橘子🍊的个数



## 代码实现


关键点：17/18 行

```javascript hl:17,18,59,60
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
  let m = grid.length;
  let n = grid[0].length;
  let dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let queue = []; // 用于存放腐烂的橘子
  let visited = Array.from({ length: m }, () => Array(n).fill(false));
  let fresh = 0;
  // 初始化, 遍历，将腐烂的橘子加入队列, 并标记为已访问
  // 并统计新鲜橘子的数量
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) {
        queue.push([i, j]);
        visited[i][j] = true;
      } else if (grid[i][j] === 1) {
        fresh++;
      }
    }
  }

  let step = 0;
  while (queue.length) {
    let sz = queue.length;
    step++;
    for (let i = 0; i < sz; i++) {
      //拿出一个烂橘子
      let cur = queue.shift();
      // 将烂橘子的四周的新鲜橘子变为烂橘子
      for (let dir of dirs) {
        let x = cur[0] + dir[0];
        let y = cur[1] + dir[1];
        // 如果新坐标 (x, y) 超出边界，或者遇到墙壁，或者已经访问过，都直接跳过
        if (
          x < 0 ||
          x >= m ||
          y < 0 ||
          y >= n ||
          visited[x][y] ||
          grid[x][y] === 0
        ) {
          continue;
        }
        visited[x][y] = true;
        // 将这个新鲜橘子加入烂橘子队列
        queue.push([x, y]);
        fresh--;
      }
    }
  }
  // 如果还有新鲜橘子，返回-1
  // 如果没有新鲜橘子，返回步数
  return fresh === 0 ? Math.max(0, step - 1) : -1;
};

```
