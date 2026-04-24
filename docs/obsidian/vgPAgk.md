# 二叉树中所有距离为 K 的结点：返回到目标结点 target 距离为 k 的所有结点的值组成的数组

> [863. 二叉树中所有距离为 K 的结点](https://leetcode.cn/problems/all-nodes-distance-k-in-binary-tree/)

## 1. 总结

- ① mapping 对象：让每个节点的 `parent 指针` 指向 指向改节点的`父节点`
- ② 执行 BFS 


```javascript
var distanceK = function (root, target, k) {
    let mapping = new Map();
    function traverse(root, parent) {
        if (!root) return;
        mapping.set(root.val, parent);
        traverse(root.left, root);
        traverse(root.right, root);
    }
    traverse(root, null);

    function dfs() {
        let q = [target];
        let visited = new Set([target.val]);
        let res = [];
        let dist = 0; // 离 target 的距离
        while (q.length) {
            let size = q.length;
            for (let i = 0; i < size; i++) {
                let cur = q.shift();
                if (dist === k) {
                    res.push(cur.val);
                }
                let neighbors = [cur.left, cur.right, mapping.get(cur.val)];
                for (let item of neighbors) {
                    if (item && !visited.has(item.val)) {
                        q.push(item);
                        visited.add(item.val);
                    }
                }
            }
            dist++;
        }
        return res;
    }
    return dfs();
};
```

## 2. 题目

与目标结点（值为 5）距离为 2 的结点，值分别为 7，4，以及 1

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250122-4.png)
