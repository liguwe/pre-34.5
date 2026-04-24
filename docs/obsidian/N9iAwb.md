# 基本概念：篇二

`#算法/图` 

## 图相关的名词解释

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/611712fb7e1b34b66e3e0188ead2ff46.png)

- 顶点：
- 边：
- 相邻顶点
- 路径：
- 度：相邻顶点的个数
   - **入度**：顶点的入度是指「`指向该顶点的边`」的数量；
   - **出度**：顶点的出度是指 `该顶点指向其他点的边` **的数量。
- 环：
	- 比如ACDA
- 联通的：
	- 如果图中任何两个顶点都存在路径，那么他是联通的
- 有向图：如下图
	- ![image.png|446](https://832-1310531898.cos.ap-beijing.myqcloud.com/3b293445907f9016da14531e019173fc.png)

- **强连通**：比如上图的 CD，**双向都存在路径**
- 无向图：
- 加权图：边赋予权值，如下图
	- ![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/71ecf6cea14bb69f43cebede23923670.png)

## 图的表示

### 邻接矩阵

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/935ee7a441340946e2456b1230365ca5.png)

- 比较浪费空间
- 二维数组不够灵活

### 邻接表

![image.png|528](https://832-1310531898.cos.ap-beijing.myqcloud.com/082956fbb913d9e6d99640f1442970d6.png)

key 为有序的数字

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/766d5b7b869e04a2a86cb81f55cef3fa.png)




## BFS

 
 BFS 出现的常见场景好吧，**问题的本质就是让你在一幅「图」中找到从起点 **`**start**`** 到终点 **`**target**`** 的最近距离，这个例子听起来很枯燥，但是 BFS 算法问题其实都是在干这个事儿**

### 框架

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/8bcf3f8e6da14a73ed2332e7a436ea56.png)

### 使用JS实现

```javascript

const BFS = function (start,target) {
    let q = [start]; // 核心数据结构 // 将起点加入队列
    let visited = new Set(); // 避免走回头路
    visited.add(start);
    let step = 0; // 记录扩散的步数
    while (q.length > 0) {
        let sz = q.size();
        /* 将当前队列中的所有节点向四周扩散 */
        for (let i = 0; i < sz; i++) {
            let cur = q.unshift();
            /* 划重点：这里判断是否到达终点 */
            if (cur === target) return step;
            /* 将 cur 的相邻节点加入队列 */
            for (let x of cur.adj()) {
                if (!visited.has(x)) {
                    q.push(x);
                    visited.add(x);
                }
            }
        }
        /* 划重点：更新步数在这里 */
        step++;
    }
};
```

### 「 [二叉树的最小深度](https://leetcode.cn/problems/minimum-depth-of-binary-tree/)」

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/6656d2174a6e70f869108a874e254ccb.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
    if (root == null) {
        return 0;
    }
    let q = [root];
    // root 本身就是一层，depth 初始化为 1
    let depth = 1;
    while (q.length > 0) {
        // 一定要写在这儿！
        const sz = q.length;
        /* 将当前队列中的所有节点向四周扩散 */
        for (let i = 0; i < sz; i++) {
            let cur = q.shift();
            /* 判断是否到达终点 */
            if (cur.left == null && cur.right == null) {
                return depth;
            }

            /* 将 cur 的相邻节点加入队列 */
            if (cur.left != null) {
                q.push(cur.left);
            }
            if (cur.right != null) {
                q.push(cur.right);
            }
        }
        /* 这里增加步数 */
        depth++;
    }
    return depth;
};
```
