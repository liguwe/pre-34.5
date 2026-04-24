# 找到二叉树中最近的右侧节点：u 节点最近的右侧节点

>  [1602. 找到二叉树中最近的右侧节点](https://leetcode.cn/problems/find-nearest-right-node-in-binary-tree/)

## 层序遍历的思路

- 下一个节点都是 `q[0]` ，因为每次都 `shift`
- u 是节点，不是字符串
	- 所以：`cur === u` 或者 `cur.val === u.val`

```javascript hl:15
var findNearestRightNode = function (root, u) {
    if (!root) return null;
    let q = [root];
    while (q.length) {
        let size = q.length;
        // 遍历当前层的所有节点
        for (let i = 0; i < size; i++) {
            let cur = q.shift();
            // 如果找到目标节点
            // if (cur.val === u.val) {
            if (cur === u) {
                // 如果是当前层的最后一个节点，返回 null
                if (i === size - 1) return null;
                // 否则返回下一个节点（右侧节点）
                // 因为每次都 shift ，所以下一个节点自然就是 q[0]
                return q[0];
            }
            // 将子节点加入队列
            if (cur.left) q.push(cur.left);
            if (cur.right) q.push(cur.right);
        }
    }
    return null;
};
```

## 遍历一遍的思路

- 一定会遍历所有节点的
	- 所以判断
		- 如果找到了，且在同一层，更新 res 即可，为了性能，直接 return 即可
- 传入**两个**参数：
	- `root`
	- `depth`

```javascript hl:10,14
var findNearestRightNode = function (root, u) {
    let targetDepth = -1; //记录目标节点的深度
    let found = false; // 记录是否找到目标节点
    let res = null; // 存储结果节点

    function traverse(node, depth) {
        if (!node) return;
        if (res) return; // 已经找到结果了
        // 如果已经找到目标节点，且当前在同一层
        if (found && depth === targetDepth) {
            res = node;
            return;
        }
        // 如果找到目标节点
        if (node === u) {
            found = true;
            targetDepth = depth;
            return;
        }
        traverse(node.left, depth + 1);
        traverse(node.right, depth + 1);
    }

    traverse(root, 0);
    return res;
};
```
