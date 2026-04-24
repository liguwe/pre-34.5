# 课程表 II：返回你为了学完所有课程所安排的学习顺序

>  [210. 课程表 II](https://leetcode.cn/problems/course-schedule-ii/)



这道题就是 [7. 拓扑排序](/qIArao) 的应用
- 如果把课程抽象成节点，课程之间的依赖关系抽象成有向边，那么**图的拓扑排序结果就是上课顺序**
- 首先，我们先判断一下题目输入的课程依赖是否成环，成环的话是无法进行拓扑排序的

## 1. DFS 思路

这题就是基于 [207. 课程表：是否可能完成所有课程的学习](/aVHWX5) 的 DFS 改造下即可


```javascript
var findOrder = function (numCourses, prerequisites) {
    let n = numCourses;
    let res = [];
    let hasCycle = false;
    let visited = new Array(n).fill(false);
    let onPath = new Array(n).fill(false);
    let graph = buildGraph();
    function traverse(graph, src) {
        if (onPath[src]) {
            hasCycle = true;
        }
        if (visited[src] || hasCycle) {
            return;
        }
        onPath[src] = true;
        visited[src] = true;
        for (let item of graph[src]) {
            traverse(graph, item);
        }
        res.push(src);
        onPath[src] = false;
    }

    for (let i = 0; i < n; i++) {
        traverse(graph, i);
    }
    if (hasCycle) {
        return [];
    }
    return res.reverse();

    function buildGraph() {
        let graph = new Array(n).fill().map(() => []);
        for (let item of prerequisites) {
            let from = item[1];
            let to = item[0];
            graph[from].push(to);
        }
        return graph;
    }
};

```

## 2. BFS 思路：配合入度

> [!danger]
> 知道有这思路即可，不用深究了
