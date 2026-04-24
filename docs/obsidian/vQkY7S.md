# 具有所有最深节点的最小子树

> [865. 具有所有最深节点的最小子树](https://leetcode.cn/problems/smallest-subtree-with-all-the-deepest-nodes/)



![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250120-9.png)

## 返回

- 返回 `[最大深度, 包含最深节点的最小子树根节点]`
- 记得传参数：root 和 depth 


```javascript hl:8
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var subtreeWithAllDeepest = function (root) {
    // 返回 `[最大深度, 包含最深节点的最小子树根节点]`
    function getDepth(root, depth) {
        if (!root) return [depth, null];
        let left = getDepth(root.left, depth + 1);
        let right = getDepth(root.right, depth + 1);
        let [leftDepth, leftNode] = left;
        let [rightDepth, rightNode] = right;
        // 比较左右子树的深度
        if (leftDepth > rightDepth) {
            // 左子树更深，返回左子树的结果
            return [leftDepth, leftNode];
        }
        if (rightDepth > leftDepth) {
            // 右子树更深，返回右子树的结果
            return [rightDepth, rightNode];
        }
        // 左右子树深度相同，当前节点就是要找的根节点
        return [leftDepth, root];
    }

    return getDepth(root, 0)[1];
};
```
