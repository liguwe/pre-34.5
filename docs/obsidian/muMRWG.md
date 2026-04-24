# 完全二叉树插入器：设计一种算法，将一个新节点插入到一棵完全二叉树中，并在插入后保持其完整

> [919. 完全二叉树插入器](https://leetcode.cn/problems/complete-binary-tree-inserter/)


- 层次遍历
- 然后用`队列`维护底部可以进行插入的节点即可
- 主要插入时，尽量插到左边

```javascript
/**
 * @param {TreeNode} root
 */
var CBTInserter = function (root) {
    // 只记录完全二叉树底部可以进行插入的节点
    this.queue = [];
    this.root = root;
    let q = [root];
    while (q.length) {
        let cur = q.shift();
        if (cur.left) q.push(cur.left);
        if (cur.right) q.push(cur.right);
        if (cur.right === null || cur.left === null) {
            this.queue.push(cur);
        }
    }
};

/**
 * @param {number} val
 * @return {number}
 */
CBTInserter.prototype.insert = function (val) {
    let node = new TreeNode(val);
    let cur = this.queue[0];
    // 如果左边的节点为空，优先插入左边
    if (cur.left === null) {
        cur.left = node;
    } else if (cur.right === null) {
        cur.right = node;
        this.queue.shift();
    }
    // 新节点的左右节点也是可以插入的
    this.queue.push(node);
    return cur.val;
};

/**
 * @return {TreeNode}
 */
CBTInserter.prototype.get_root = function () {
    return this.root;
};

```
