# 二叉树的构造

## 1. 构造思路

- 二叉树的构造问题一般都是使用`「分解问题」`的思路：
	- `构造整棵树 = 根节点 + 构造左子树 + 构造右子树`

## 2. 代码模板 

```javascript
function build(/* 参数 */) {

    // 1. 基础情况处理
    if (/* 终止条件 */) {
        return null;
    }
    
    // 2. 构造根节点
    let root = new TreeNode(/* 根节点的值 */);
    
    // 3. 递归构造左子树
    root.left = build(/* 左子树参数 */);
    
    // 4. 递归构造右子树
    root.right = build(/* 右子树参数 */);
    
    return root;
}

```
