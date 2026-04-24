# 网络延迟时间

`#dijkstra` 

>  [743. 网络延迟时间](https://leetcode.cn/problems/network-delay-time/)

- 关键点：
	- Dijkstra 算法模板

```javascript
/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function (times, n, k) {
    let dist = dijkstra(n, times, k);
    let res = 0;
    for (let i = 1; i <= n; i++) {
        // 跳过起点
        if (i === k) continue;
        if (dist[i] === Infinity) {
            return -1;
        }
        res = Math.max(res, dist[i]);
    }
    return res;
};

/**
 * Dijkstra 算法模板
 * @param {number} n - 节点数量
 * @param {number[][]} edges - 边的信息 [from, to, weight]
 * @param {number} start - 起点
 * @returns {number[]} 从起点到所有节点的最短距离
 */
function dijkstra(n, edges, start) {
    // 1. 构建邻接表 (注意：节点编号从1开始，所以需要n+1的长度)
    const graph = Array.from({ length: n + 1 }, () => []);
    for (const [from, to, weight] of edges) {
        graph[from].push([to, weight]); // 这是有向图，不需要双向添加
    }

    // 2. 初始化距离数组 (需要n+1的长度)
    const dist = new Array(n + 1).fill(Infinity);
    dist[start] = 0;

    // 3. 优先队列
    const pq = [0, start](#);
    while (pq.length) {
        const [d, cur] = pq.shift();
        // 如果当前距离大于已知距离，跳过
        if (d > dist[cur]) continue;
        // 遍历所有相邻节点
        for (const [next, weight] of graph[cur]) {
            const newDist = dist[cur] + weight;
            if (newDist < dist[next]) {
                dist[next] = newDist;
                // 插入优先队列（保持队列按距离排序）
                let inserted = false;
                for (let i = 0; i < pq.length; i++) {
                    if (pq[i][0] > newDist) {
                        pq.splice(i, 0, [newDist, next]);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) pq.push([newDist, next]);
            }
        }
    }
    return dist;
}
```
