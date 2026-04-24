# 检查两棵二叉表达式树是否等价

> [1612. 检查两棵二叉表达式树是否等价](https://leetcode.cn/problems/check-if-two-expression-trees-are-equivalent/)


## 题目：本题只需要考虑 `+` 的场景

```javascript hl:1,15
示例 1：
树 1:
    +
   / \
  4   5

树 2:
    +
   / \
  5   4

结果：true
解释：4 + 5 = 5 + 4 = 9

示例 2：
树 1:
    +
   / \
  2   *
     / \
    3   4

树 2:
    +
   / \
  *   2
 / \
3   4

结果：true
解释：2 + (3 * 4) = (3 * 4) + 2 = 14

```

## 如果 val 值为数字时

```javascript
var checkEquivalence = function(root1, root2) {
    // 获取所有叶子节点值的和
    const getSum = (root) => {
        // 如果是叶子节点（数字节点）
        if (!root.left && !root.right) {
            return Number(root.val);
        }
        // 如果是操作符节点（+），递归计算左右子树的和
        let sum = 0;
        if (root.left) {
            sum += getSum(root.left);
        }
        if (root.right) {
            sum += getSum(root.right);
        }
        return sum;
    }
    // 比较两棵树的和是否相等
    return getSum(root1) === getSum(root2);
};
```

## 如果 val 值为 `a - z` 时

只需要分别遍历两棵二叉树，判断两棵二叉树中的 `未知数 a-z 的数量` 是否相同即可

技巧：
- 用 `count` 数组当做计数器
- 对第一棵树上的元素 +1
- 对第二棵树上的元素 -1
- 这样一来，只要最终 `count` 数组中全是 0 就说明两棵树上的未知数数量相同


```javascript
var checkEquivalence = function (root1, root2) {
    var count = new Array(26).fill(0); // 记录未知数
    function traverse(root, tag) {
        if (root == null) return;
        if (root.val <= "z" && root.val >= "a") {
            count[root.val.charCodeAt(0) - "a".charCodeAt(0)] += tag;
            //or  count[root.val.charCodeAt(0) - 97] += tag;
        }
        traverse(root.left, tag);
        traverse(root.right, tag);
    }

    traverse(root1, 1);
    traverse(root2, -1);
    for (var c of count) {
        if (c != 0) {
            return false;
        }
    }
    return true;
};

```
