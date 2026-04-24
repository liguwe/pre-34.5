# 统计同值子树

`#leetcode-plus` 

> [250. 统计同值子树](https://leetcode.cn/problems/count-univalue-subtrees/)


关键点：
- 后续遍历
- 遍历框架：
	- 返回 `[是否是同值子树, 子树的值]`
	- 根据返回值，计算更新 `res++`

```javascript
function countUnivalSubtrees(root) {
    let res = 0;
    // 后序遍历
    // 返回值：[是否是同值子树, 子树的值]
    function traverse(node) {
        // 空节点视为同值子树
        if (!node) return [true, null];
        // 叶子节点一定是同值子树
        if (node.left === null && node.right === null) {
            res++; // 找到一个同值子树
            return [true, node.val];
        }
        // 后序遍历获取左右子树的结果
        const [leftIsUni, leftVal] = traverse(node.left);
        const [rightIsUni, rightVal] = traverse(node.right);
        // 判断当前节点是否能构成同值子树
        let isUnival = true; // 默认为true
        // 1. 首先检查左右子树是否都是同值子树
        if (!leftIsUni || !rightIsUni) {
            isUnival = false;
        }
        // 2. 检查左子树值是否相同（如果有左子树）
        else if (node.left && leftVal !== node.val) {
            isUnival = false;
        }
        // 3. 检查右子树值是否相同（如果有右子树）
        else if (node.right && rightVal !== node.val) {
            isUnival = false;
        }
        // 如果是同值子树，计数加1
        if (isUnival) {
            res++;
        }
        return [isUnival, node.val];
    }

    traverse(root);
    return res;
}

```
