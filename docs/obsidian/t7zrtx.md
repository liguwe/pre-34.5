# 二叉树的所有路径：返回二叉树的所有路径，以a→b的方式

`#leetcode` `#二叉树` 


> [257. 二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)


## 思路一

- 关键点：
	- 叶子节点也一定要 `pop` 
	- 递归调用别忘了传参 `path`
	- 返回的是 `→` 格式

```javascript
var binaryTreePaths = function (root) {
    let res = [];
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        // 叶子节点
        if (root.left === null && root.right === null) {
            res.push(path.join("->"));
            path.pop();
            return;
        }
        traverse(root.left, path);
        traverse(root.right, path);
        path.pop();
    }
    traverse(root, []);
    return res;
};

```

## 思路二：if - else 结构，就不用对叶子结点单独 pop 了

```javascript hl:5,13
var binaryTreePaths = function (root) {
    let res = [];
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        // 叶子节点
        if (root.left === null && root.right === null) {
            res.push(path.join("->"));
        } else {
            traverse(root.left, path);
            traverse(root.right, path);
        }
        path.pop();
    }
    traverse(root, []);
    return res;
};
```
