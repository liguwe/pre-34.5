# 连接所有点的最小费用

> [1584. 连接所有点的最小费用](https://leetcode.cn/problems/min-cost-to-connect-all-points/)


很显然这也是一个标准的最小生成树问题：
- 每个点就是无向加权图中的节点
- 边的`权重`就是曼哈顿距离
- 连接所有点的最小费用就是`最小生成树的权重和`


所以解法思路就是
- 先**生成所有的边以及权重**
- 然后对这些边执行 Kruskal 算法即可
	- 更多参考 [10. 最小生成树： Kruskal 算法](/jlmRHu)


> 这题和 [1135. 最低成本连通所有城市](/P9XMIJ) 也类似，除了这题需要自己**生成所有的边以及权重**外


```javascript
/**
 * @param {number[][]} points
 * @return {number}
 */
var minCostConnectPoints = function (points) {
    let n = points.length;
    let edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            // 这里是从 i+1 开始，只需要遍历一半
            let xi = points[i][0];
            let yi = points[i][1];
            let xj = points[j][0];
            let yj = points[j][1];
            edges.push([i, j, Math.abs(xi - xj) + Math.abs(yi - yj)]);
        }
    }
    edges.sort((a, b) => a[2] - b[2]);
    let mst = 0;
    let uf = new UF(n);
    for (let edge of edges) {
        let [u, v, w] = edge;
        if (uf.connected(u, v)) continue;
        mst += w;
        uf.union(u, v);
    }
    return mst;
};

class UF {
    constructor(n) {
        // 连通分量个数
        this.count = n;
        // 存储每个节点的父节点
        this.parent = new Array(n).fill(0).map((_, index) => index);
    }

    // 将节点 p 和节点 q 连通
    union(p, q) {
        let rootP = this.find(p);
        let rootQ = this.find(q);
        if (rootP === rootQ) {
            return;
        }
        this.parent[rootQ] = rootP;
        // 两个连通分量合并成一个连通分量
        this.count--;
    }

    // 判断节点 p 和节点 q 是否连通
    connected(p, q) {
        let rootP = this.find(p);
        let rootQ = this.find(q);
        return rootP === rootQ;
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    // 返回图中的连通分量个数
    getCount() {
        return this.count;
    }
}

```
