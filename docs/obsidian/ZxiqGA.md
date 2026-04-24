# N 叉树的前序遍历

`#算法/二叉树` 

[589. N 叉树的前序遍历](https://leetcode.cn/problems/n-ary-tree-preorder-traversal/)


```javascript hl:5
var preorder = function (root) {
    let res = [];
    function traverse(root) {
        if (!root) return;
        res.push(root.val);
        for (let item of root.children) {
            traverse(item);
        }
    }
    traverse(root);
    return res;
};

```



- 多叉树没有`中序遍历` ，因为没有固定的`中序位置`
- 注意，使用 `for-of` 来遍历 `root.children` ，方便书写

`如果放到 for 循环里面，会怎么样`，看下面代码：

```javascript

/**
 * @param {Node|null} root
 * @return {number[]}
 */
var preorder = function(root) {
    const res = [];
    function traverse(root){
        if(root === null){
            return;
        }
        // ::::::前序位置
        for(let item of root.children){
            // :::: 如果放到 for 循环里面，其实这就是回溯算法
            // :::: 但这里遍历不会包含根节点
            res.push(root.val);
            traverse(item);
        }
        // ::::::后序位置
    }
    traverse(root);
    return res;
};
```

> 这里遍历不会包含`根节点`
