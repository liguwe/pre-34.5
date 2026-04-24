# 二叉树遍历的迭代解法

## 1. 使用 `栈` 来模拟 `递归调用`

```javascript
/**
 * @description 二叉树遍历递归解法
 * */

// 使用栈来模拟递归的调用
const stack = [];

function traverse(root) {

    if (root === null) {
        return;
    }

    // ::::::前序位置
    stack.push(root);
    traverse(root.left);

    // ::::::中序位置
    traverse(root.right);

    // ::::::后序位置
    stack.pop();

    return stack;
}
```

> - 上面代码清晰，好理解
> - 但 **如果将上面的递归解法，改成迭代解法呢？**

## 2. [ 二叉树的前序遍历](https://leetcode.cn/problems/binary-tree-preorder-traversal/)
```javascript

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {

    // ::::如果根节点为空，直接返回空数组
    if (root === null) return [];

    // ::::::返回的结果
    let res = [];

    // ::::::::辅助栈,默认放入根节点
    const stack = [root];

    // ::::::::迭代
    while (stack.length) {
        
        // :::::弹出栈顶元素
        const node = stack.pop();
        
        // ::::前序位置
        res.push(node.val);

        /*************************************************
         * :::::右节点先入栈，左节点后入栈,保证左子树先遍历
         ************************************************/
        if (node.right) {
            stack.push(node.right);
        }
        if (node.left){
            stack.push(node.left);
        }
    }

    return res;
};

```

两个重点说明：
- 这里有确定的 `前序位置` ，如上代码 `30` 行，这个时候 `res.push()`
	- 但 `其他位置` ，并不确定
	- 真正遍历不可能这么搞，递归调用即可，不用这么麻烦，还不理解
- **右节点先入栈，左节点后入栈，保证左子树先遍历**

## 3. [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
```javascript

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    // ::::返回的结果
    const res = [];

    // ::::::::辅助栈
    const stack = [];

    // ::::::::迭代
    while (root || stack.length) {
        
        // :::::左节点全部入栈,直到没有左节点
        while (root) {
            stack.push(root);
            root = root.left;
        }
        
        /*************************************************
         * ::::::::中序位置,只有在弹出栈顶元素的时候才会访问
         ************************************************/
        // :::::弹出栈顶元素
        root = stack.pop();
        res.push(root.val);

        // :::::右节点
        root = root.right;
    }
    return res;
};

```

> - 只有`中序位置` 是确定的，其他没试过
> - 左侧节点，需要全部入栈，然后才是根节点，然后再试右节点，这里都使用一个变量 `root` 来维护，标识当前遍历的 `子节点的根节点`

## 4. [ 二叉树的后序遍历](https://leetcode.cn/problems/binary-tree-postorder-traversal/)
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
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {

    if (root === null) return [];

    // ::::返回的结果
    const res = [];

    // ::::::::辅助栈
    const stack = [root];

    while (stack.length) {
        const node = stack.pop();
        // ::::【逆序】添加节点值
        res.unshift(node.val);
        /*************************************************
         * ::::::::左节点先入栈，右节点后入栈, 保证右子树先遍历
         ************************************************/
        if (node.left) {
            stack.push(node.left);
        }
        if (node.right) {
            stack.push(node.right);
        }
    }

    return res;
};

```

> - 这里根本没有什么`后序位置`吧？只是为了遍历而遍历，使用` unshift` 的能力
> - 左节点先入栈，右节点后入栈, 保证右子树先遍历

## 5. 二叉树遍历的`迭代模板`

### 5.1. 代码
> - 请注意以下前中后序的 `位置`
> - 注意下面的图示，根据图来理解代码为什么这么写
> - 一般来讲，有空就去了解吧

```javascript
// 使用栈来模拟递归的调用
const stack = [];
// 左侧节点入栈，一直到左侧节点为空
function pushLeftBranch(p) {
    while (p) {
        /*************************************************
         * ::::前序位置，进入一个节点时，就把它放入栈中
         ************************************************/
        stack.push(p);
        p = p.left;
    }
}

function traverse(root) {
    // ::::指向上一次遍历完的根节点
    let visited = new TreeNode(-1);
    // ::::开始遍历整个树
    pushLeftBranch(root);
    while (stack.length) {
        // 取出栈顶元素，但不出栈
        const p = stack[stack.length - 1];
        // p 的左侧节点已经全部入栈 或者 上次遍历完的根节点是 p 的左侧节点
        // 并且 p 的右侧节点还没有遍历
        if ((p.left === null || p.left === visited)
            && p.right !== visited) {
            /*************************************************
             * ::::::::中序位置
             ************************************************/
            pushLeftBranch(p.right);
        }
        // ::::p的右侧节点已经遍历完了，或者p的右侧节点是上次遍历完的根节点
        if (p.right === null || p.right === visited) {
            /*************************************************
             * ::::::::后序位置
             ************************************************/
            visited = stack.pop();
        }
    }
}

```

### 5.2. 画图

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/fa209ce75d2943a79a4a46f958810e17.png)
