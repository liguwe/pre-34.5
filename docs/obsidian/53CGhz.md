# 可能的二分法：将互相讨厌的人分成两个组

> [886. 可能的二分法](https://leetcode.cn/problems/possible-bipartition/)



分析：
- 本质还是 [785. 判断二分图：判断一幅图是否是二分图](/GC2mJG)
- 两个区别
	- ① 需要多一步**构建邻接表**
	- ② 图是从 `1` 开始编号的

```javascript hl:4,32
var possibleBipartition = function (n, dislikes) {
    // 1. 构建图
    let graph = new Array(n + 1).fill().map(() => []); // 图节点编号为 1...n
    for (let [from, to] of dislikes) {
        // 使用解构赋值
        graph[from].push(to);
        graph[to].push(from);
    }

    // 2. 判断是否二分图
    let color = new Array(n + 1).fill(false); // 记录图中节点的颜色
    let visited = new Array(n + 1).fill(false); // 记录图中节点是否被访问过
    let res = true;

    function traverse(src) {
        if (!res) return;
        visited[src] = true;
        for (let g of graph[src]) {
            if (!visited[g]) {
                color[g] = !color[src];
                traverse(g);
            } else {
                if (color[g] === color[src]) {
                    res = false;
                }
            }
        }
    }
    // 因为图可能不是连通的，需要遍历所有节点
    for (let i = 1; i <= n; i++) {
        // 从 1 开始遍历，因为从 1 开始编号
        if (!visited[i]) {
            traverse(i);
        }
    }
    return res;
};
```
