# 判断二分图：判断一幅图是否是二分图

>  [785. 判断二分图](https://leetcode.cn/problems/is-graph-bipartite/)


- 思路：
	- 遍历一遍图，一边遍历一边染色，看看能不能用两种颜色给所有节点染色，且相邻节点的颜色都不相同

```javascript hl:15,26
var isBipartite = function (graph) {
    let n = graph.length;
    let res = true;
    // 记录图中节点的颜色，false 和 true 代表两种不同颜色
    let color = new Array(n).fill(false);
    let visited = new Array(n).fill(false);  // 记录图中节点是否被访问过
    function traverse(src) {
        if (!res) return;  // 已经确定不是二分图了
        visited[src] = true;
        for (let g of graph[src]) {
            if (!visited[g]) {
                // 因为相邻，所以需要涂不同的色
                color[g] = !color[src];
                // 继续遍历相邻节点
                traverse(g);
            } else {
                // 相邻节点的颜色相同
                if (color[g] === color[src]) {
                    res = false;
                }
            }
        }
    }
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            traverse(i);
        }
    }
    return res;
};
```
