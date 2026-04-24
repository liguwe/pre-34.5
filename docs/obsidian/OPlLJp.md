# 找出克隆二叉树中的相同节点：使用 A 中的 target 去找 B 中对应节点

>  [1379. 找出克隆二叉树中的相同节点](https://leetcode.cn/problems/find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree/)


关键点：
- ` traverse(A.left, B.left);` 传两个参数，对应上

```javascript
var getTargetCopy = function (original, cloned, target) {
    let res = null;
    function traverse(A, B) {
        if (!A) return;
        if (res) return; // 已经找到了,返回
        // 找到了
        if (A === target) {
            res = B;
            return;
        }
        traverse(A.left, B.left);
        traverse(A.right, B.right);
    }
    traverse(original, cloned);
    return res;
};
```
