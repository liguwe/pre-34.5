# 概率最大的路径

`#dijkstra` 

>  [1514. 概率最大的路径](https://leetcode.cn/problems/path-with-maximum-probability/)

```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} succProb
 * @param {number} start
 * @param {number} end
 * @return {number}
 */
var maxProbability = function (n, edges, succProb, start, end) {
    return dijkstra(n, edges, succProb, start, end);
};

/**
 * 修改后的 Dijkstra 算法
 * @param {number} n - 节点数量
 * @param {number[][]} edges - 边的信息 [from, to]
 * @param {number[]} succProb - 每条边对应的概率
 * @param {number} start - 起点
 * @param {number} end - 终点
 * @returns {number} 最大概率
 */
function dijkstra(n, edges, succProb, start, end) {
    // 1. 构建邻接表，存储 [相邻节点, 概率]
    const graph = Array.from({ length: n }, () => []);
    for (let i = 0; i < edges.length; i++) {
        const [from, to] = edges[i];
        const prob = succProb[i];
        // 无向图，需要双向添加
        graph[from].push([to, prob]);
        graph[to].push([from, prob]);
    }

    // 2. start 到各点的最大概率
    const probs = new Array(n).fill(0);
    // 起点到自己的概率为 1
    probs[start] = 1;

    // 3. 优先队列 [probability, node]
    // probability: 从 start 到 node 的概率
    // node: 节点编号
    const pq = [1, start](#);

    while (pq.length) {
        // 取出当前最大概率的节点
        const [prob, cur] = pq.shift();

        // 如果当前概率小于已知概率，跳过
        // 注意：这里是小于，因为我们在找最大概率
        if (prob < probs[cur]) continue;

        // 如果到达终点，直接返回概率
        if (cur === end) continue;

        // 遍历所有相邻节点
        for (const [next, pathProb] of graph[cur]) {
            // 新路径的概率 = 当前路径概率 * 这条边的概率
            const newProb = probs[cur] * pathProb;
            // 如果找到更大的概率
            if (newProb > probs[next]) {
                probs[next] = newProb;
                // 插入优先队列（保持队列按概率降序排序）
                let inserted = false;
                for (let i = 0; i < pq.length; i++) {
                    if (pq[i][0] < newProb) {
                        // 注意：这里改为 < 因为要降序
                        pq.splice(i, 0, [newProb, next]);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) pq.push([newProb, next]);
            }
        }
    }

    // 返回终点的概率
    return probs[end];
}

```
