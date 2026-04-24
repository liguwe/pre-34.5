# 多叉树的遍历：Python 描述

`#多叉树` `#数据结构` 

## 1. 多叉树的层次遍历

```python
from collections import deque

# 二叉树的节点
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

# 多叉树的节点
class Node:
    def __init__(self, val):
        self.val = val
        # 孩子节点
        self.children = []

# 多叉树的层次遍历
def level_order(root:Node):
    if root is None:
        return []
    # 用队列保存节点
    queue = deque()
    # 结果
    res = []
    # 根节点入队
    queue.append(root)
    # 遍历
    while queue:
        # 当前层的节点
        level = []
        # 当前层的节点个数
        size = len(queue)
        # 遍历当前层的节点
        for i in range(size):
            # 出队
            node = queue.popleft()
            # 节点值加入当前层
            level.append(node.val)
            # 孩子节点入队
            for child in node.children:
                queue.append(child)
        # 当前层加入结果
        res.append(level)
    return res

```


## 2. 多叉树的中序遍历

很明显，没有中序

## 3. 多叉树的前序和后序遍历

```python
from collections import deque

# 二叉树的节点
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

# 多叉树的节点
class Node:
    def __init__(self, val):
        self.val = val
        # 孩子节点
        self.children = []

# 多叉树的前序和后续遍历

# 前序遍历
def preorder(root:Node):
    if root is None:
        return
    print(root.val)
    for child in root.children:
        preorder(child)

# 后序遍历
def postorder(root:Node):
    if root is None:
        return
    ###### 前序位置  #####
    for child in root.children:
        postorder(child)
    ##### 后序位置  #####
    print(root.val)

```
