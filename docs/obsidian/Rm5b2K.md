# 从二叉树一个节点到另一个节点每一步的方向

> [2096. 从二叉树一个节点到另一个节点每一步的方向](https://leetcode.cn/problems/step-by-step-directions-from-a-binary-tree-node-to-another/)

## 1. 题目

### 1.1. 实例一：有经过根节点 5

```javascript
例如这样一棵树：
        5
       / \
      1   2
     /   / \
    3   6   4

startValue = 3
destValue = 6

路径应该是：
3 -> 1 -> 5 -> 2 -> 6

返回的字符串应该是：
"UURL"

解释：
- U：从3上到1
- U：从1上到5
- R：从5右到2
- L：从2左到6

```

### 1.2. 实例二：没有经过根节点

```javascript
例如这样一棵树：
        5
       / \
      1   2
     / \   \
    3   7   6
       /
      4

startValue = 3
destValue = 4

路径应该是：
3 -> 1 -> 7 -> 4

返回的字符串应该是：
"URL"

解释：
- U：从3上到1
- R：从1右到7
- L：从7左到4

```
## 2. 代码

```javascript
var getDirections = function (root, startValue, destValue) {
    let startPath = []; // 根节点到起点
    let destPath = []; // 根节点到目的点
    // 找到两条路径
    findPath(root, startValue, startPath);
    findPath(root, destValue, destPath);
    function findPath(node, target, path) {
        if (!node) return false;
        // 找到目标节点
        if (node.val === target) {
            return true;
        }
        // 尝试左子树
        if (findPath(node.left, target, path)) {
            path.unshift("L"); // 路径是从节点到根的，使用 unshift
            return true;
        }
        // 尝试右子树
        if (findPath(node.right, target, path)) {
            path.unshift("R"); // 路径是从节点到根的，使用 unshift
            return true;
        }
        return false;
    }
    // 跳过公共前缀
    let i = 0;
    while (
        i < startPath.length &&
        i < destPath.length &&
        startPath[i] === destPath[i]
    ) {
        i++;
    }
    // 构造最终路径
    // 从起点到公共祖先需要向上走
    let result = "U".repeat(startPath.length - i);
    // 从公共祖先到终点需要按照destPath走
    result += destPath.slice(i).join("");
    return result;
};
```
