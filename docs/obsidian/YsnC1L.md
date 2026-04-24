# 二叉树基本概念：Python 描述

`#二叉树`  `#数据结构` 

## 1. 定义

```python
# 二叉树的节点定义
class TreeNode:
    def __init__(self, val: int):
        self.val = x
        self.left = None
        self.right = None

# 你可以这样构建一棵二叉树：
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.right.left = TreeNode(5)
root.right.right = TreeNode(6)

# 构建出来的二叉树是这样的：
#     1
#    / \
#   2   3
#  /   / \
# 4   5   6
```

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922163210.png)
## 2. 常见术语

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922163226.png)

## 3. 完美二叉树：满二叉树

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922163758.png)

## 4. 完全二叉树：只有最底层没被填满


![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922163825.png)

这里着重说下`完全二叉树`：
- 叶子节点都在 `最底下两层`
- 最后一层叶子节都靠`左排列`
- 并且`除了最后一层`，其他层的节点个数都要达到最大

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/9a9462b0ae355f83607ec904d5df7553.png)

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/05dd6048d8688e6a58ef6e8518485942.png)


## 5. 完满二叉树

完满二叉树（full binary tree）除了叶节点之外，其余所有节点都有两个子节点

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922164014.png)

## 6. 平衡二叉树

平衡二叉树（balanced binary tree）中**任意节点的左子树和右子树的高度之差的绝对值不超过 1**

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922164058.png)


二叉树中`任意一个节点的左右子树`的`高度相差不能大于 1`

![|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/42e64492eba910a231f01894b3811630.png)

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/2130d9f3b6d123735105cd614780218d.png)

## 7. 二叉树的退化 → 单链表

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922164118.png)

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922164214.png)
