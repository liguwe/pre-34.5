# 二叉搜索树：Python 描述

`#BST` `#数据结构` 

## 1. 总结

- 左小右大
	- 因为这个特性，它可以提供 `logN` 级别的增删查改效率
	- 直接基于 BST 的数据结构有 **AVL 树，红黑树**等
- 它的**每个子节点**的左侧子树和右侧子树**都是 BST**
- BST 的**中序**遍历结果是**升序**的

## 2. 二叉搜索树（BST）

- 一种特殊的二叉树，`较小`的值保存在`左节点`中，`较大`的值保存在`右节点`中
   - `根节点的左子树`都比`根节点的值`小，`右子树的值`都比`根节点的值`大。
   - `二叉查找树`是一种`有序的树`，所以支持`快速查找、快速插入、删除`一个数据

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/26939446c9517db965095fb586848172.png)

## 3. 二叉树效率：都是 O(n)

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922204133.png)

## 4. 二叉树的查找：复杂度 O(logn)

```python
# BST的搜索
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

# BST的搜索
def search(root:TreeNode, val:int) -> TreeNode | None:
    # 如果根节点为空，返回空
    if root is None:
        return None
    # 如果根节点的值等于 val，返回根节点
    if root.val == val:
        return root
    # 如果根节点的值大于 val，递归搜索左子树
    if root.val > val:
        if root.left is None:
            return None
        return search(root.left, val)
    # 如果根节点的值小于 val，递归搜索右子树
    if root.val < val:
        if root.right is None:
            return None
        return search(root.right, val)

```

## 5. BST 的遍历：中序遍历升序

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922194611.png)

## 6. 插入节点：复杂度 O(logn)

> [!danger]
> 二叉搜索树**不允许存在重复节点**，否则将违反其定义
> 
> 因为BST的特性，所以插入的节点**肯定会到叶子结点**

1. **查找插入位置**
	- 与查找操作相似，从根节点出发，根据当前节点值和 `num` 的大小关系循环向下搜索，直到越过叶节点（遍历至 `None` ）时跳出循环。
2. **在该位置插入节点**
	- 初始化节点 `num` ，将该节点置于 `None` 的位置

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922195422.png)

或者看下面一张图，在下图的树中插入健值为 `6` 的节点，一定是叶子节点对吧

![|399](https://832-1310531898.cos.ap-beijing.myqcloud.com/8963bb8f3b7b3a6a1fa71319e058bde3.png)

代码：

```python
# TreeNode 类型的定义
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

# BST的插入，复杂度 O(logn)
def insert(root:TreeNode, val:int) -> TreeNode:
    # 如果根节点为空，返回一个新节点
    if root is None:
        return TreeNode(val)

    # 如果根节点的值大于 val，递归插入左子树
    if root.val > val:
        if root.left is None:
            root.left = TreeNode(val)
        root.left = insert(root.left, val)

    # 如果根节点的值小于 val，递归插入右子树
    if root.val < val:
        if root.right is None:
            root.right = TreeNode(val)
        root.right = insert(root.right, val)

return root
```

## 7. 移除节点

### 7.1. 第一种情况：叶子结点

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922200912.png)

### 7.2. 第二种情况：有一个节点

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922201130.png)

### 7.3. 第三种情况：`两个子节点`的节点

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922203639.png)

1. 找到 `4`
2. 找到 `4` 的**右边**最小的节点 `5`
3. 把 `4 的位置`替换成 `5`
4. 递归从从**右侧子树**中移除**最小节点**
	- 这个最小值一定是 5，并且是满足**第一种情况：是叶子结点**

### 7.4. 最终代码

```python
# TreeNode 类型的定义
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

# BST的删除
def deleteNode(root:TreeNode, key:int) -> TreeNode | None:

    # 如果根节点为空，直接返回
    if root is None:
        return None

    # 如果根节点的值等于 key
    if root.val == key:

        """第一种情况：叶子结点直接删除"""
        # 如果左右孩子都为空，直接删除
        if root.left is None and root.right is None:
            return None

        """第二种情况：左孩子或者右孩子为空"""
        # 如果左孩子为空，返回右孩子
        if root.left is None:
            return root.right
        # 如果右孩子为空，返回左孩子
        if root.right is None:
            return root.left

        """走到这里说明是第三种情况：左右孩子都不为空"""
        # 如果左右孩子都不为空
        # 找到右子树的最小值
        minNode = getMin(root.right)
        # 将 root 的值替换为 minNode 的值
        root.val = minNode.val
        # 删除 minNode
        root.right = deleteNode(root.right, minNode.val)
    
    # 如果根节点的值小于 key
    elif root.val < key:
        if root.right is None:
            return root
        # 递归删除右子树
        root.right = deleteNode(root.right, key)
    # 如果根节点的值大于 key
    else:
        if root.left is None:
            return root
        # 递归删除左子树
        root.left = deleteNode(root.left, key)

    # 返回根节点
    return root

# 找到最小值
def getMin(node:TreeNode) -> TreeNode:
    # 找到最左边的节点，因为最左边的节点是最小的
    while node.left is not None:
        node = node.left
    return node

```

## 8. BST 的使用场景

- 用作系统中的**多级索引**，实现高效的查找、插入、删除操作。
- 作为**某些搜索算法**的底层数据结构。
- 用于存储数据流，以保持其有序状态。
