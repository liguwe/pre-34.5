# 最低成本连通所有城市

>  [1135. 最低成本连通所有城市](https://leetcode.cn/problems/connecting-cities-with-minimum-cost/)


`connections[i] = [x, y, cost]`


- 每座城市相当于图中的节点
- 连通城市的成本相当于边的权重
- 连通所有城市的最小成本即是`最小生成树的权重之和`

```javascript
var minimumCost = function (n, connections) {
    // 城市编号为 1...n，所以初始化大小为 n + 1
    let uf = new UF(n + 1);
    // 对所有边按照权重从小到大排序
    connections.sort((a, b) => a[2] - b[2]);
    // 记录最小生成树的权重之和
    let mst = 0;
    for (let item of connections) {
        let [u, v, w] = item;
        // 若这条边会产生环，则不能加入 mst
        if (uf.connected(u, v)) continue;
        // 若这条边不会产生环，则属于最小生成树
        mst += w;
        uf.union(u, v)
    }
    // 保证所有节点都被连通
    // 按理说 uf.count() == 1 说明所有节点被连通
    // 但因为节点 0 没有被使用，所以 0 会额外占用一个连通分量
    return uf.getCount() == 2 ? mst : -1;

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
