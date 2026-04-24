# 不同的二叉搜索树 II：列举 1-n 能构造出的所有BST

`#BST` 

>  [95. 不同的二叉搜索树 II](https://leetcode.cn/problems/unique-binary-search-trees-ii/)


思路类似于 [96. 不同的二叉搜索树：1-n个数字能构造出多少个 BST](/ct7sEc)


分解问题的思路：
- 1、穷举 `root` 节点的所有可能。
- 2、递归构造出左右子树的所有有效 BST → 是数组
- 3、给 `root` 节点穷举所有左右子树的组合。

```javascript hl:12,13,15,16
var generateTrees = function (n) {
    if (n === 0) return [];
    return build(1, n);
    function build(start, end) {
        let res = [];
        if (start > end) {
            res.push(null);
            return res;
        }
        for (let i = start; i <= end; i++) {
            // 这两个都是数组
            let leftTreeArr = build(start, i - 1);
            let rightTreeArr = build(i + 1, end);
            // 给 root 节点穷举所有左右子树的组合
            for (let left of leftTreeArr) {
                for (let right of rightTreeArr) {
                    let root = new TreeNode(i);
                    root.left = left;
                    root.right = right;
                    res.push(root);
                }
            }
        }
        return res;
    }
};
```


## 附：`n` 个节点能组成的所有 BST 

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
 * @param {number} n
 * @return {TreeNode[]}
 */
var generateTrees = function (n) {
  if (n === 0) {
    return [];
  }
  return build(1, n);
};

/**
 *@description 生成[lo,hi]区间的所有二叉搜索树
 *@param {*} lo
 *@param {*} hi
 */
function build(lo, hi) {
  let res = [];
  // 递归的出口,空节点
  // lo > hi 代表空节点,即没有节点的二叉树
  // 为什么是 null 而不是 [] ?
  // 因为 null 代表空节点, [] 代表空数组, 代表有一个节点的二叉树
  if (lo > hi) {
    res.push(null);
    return res;
  }
  // 穷举 root 节点的所有可能
  for (let i = lo; i <= hi; i++) {
    // 递归构造出左右子树的所有有效 BST=>递归构造左右子树
    let left = build(lo, i - 1);
    let right = build(i + 1, hi);
    // 给 root 节点穷举所有左右子树的组合
    for (let leftNode of left) {
      for (let rightNode of right) {
        let root = new TreeNode(i);
        root.left = leftNode;
        root.right = rightNode;
        res.push(root);
      }
    }
  }
  return res;
}
```
