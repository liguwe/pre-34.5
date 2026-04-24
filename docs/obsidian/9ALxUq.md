# 二叉树的遍历：Python 描述

`#二叉树` `#遍历`

## 1. 总结：

- 层次遍历
- 前后中序遍历

## 2. 层次遍历

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922184805.png)

```python
# 二叉树的层次遍历

from collections import deque

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

def level_order(root: TreeNode | None) -> list[int]:
    """层序遍历"""
    # base case
    if root is None:
        return []
    # 初始化队列，加入根节点
    queue: deque[TreeNode] = deque()
    queue.append(root)
    # 初始化一个列表，用于保存遍历序列
    res = []
    while queue:
        node: TreeNode = queue.popleft()  # 队列出队
        res.append(node.val)  # 保存节点值
        if node.left is not None:
            queue.append(node.left)  # 左子节点入队
        if node.right is not None:
            queue.append(node.right)  # 右子节点入队
    return res
```

## 3. 前后中序遍历

![图片](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240922184904.png)

```python
# 二叉树的层次遍历
from collections import deque

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left:TreeNode | None = None
        self.right:TreeNode | None = None

def pre_order(root: TreeNode | None) -> list[int]:
    """前序遍历"""
    if root is None:
        return []
    res = []
    res.append(root.val)
    # 以上是前序遍历的位置
    res.extend(pre_order(root.left))
    res.extend(pre_order(root.right))
    return res

def in_order(root: TreeNode | None) -> list[int]:
    """中序遍历"""
    if root is None:
        return []
    res = []
    res.extend(in_order(root.left))
    res.append(root.val)
    res.extend(in_order(root.right))
    return res

def post_order(root: TreeNode | None) -> list[int]:
    """后序遍历"""
    if root is None:
        return []
    res = []
    res.extend(post_order(root.left))
    res.extend(post_order(root.right))
    res.append(root.val)
    return res
```

## 4. 附：Python 中 deque（双端队列）的 `extend()` 和 `append()` 的区别

Python 中 deque（双端队列）的 `extend()` 和 `append()` 方法虽然都用于添加元素，但它们在使用方式和效果上有一些重要的区别。让我们详细比较这两个方法：

### 4.1. 定义

1. append() 方法
	- 作用：在 deque 的右端（末尾）添加一个元素。
	- 参数：接受一个单一元素作为参数。
	- 时间复杂度：O(1)，常数时间操作。
2. extend() 方法
	- 作用：在 deque 的右端（末尾）添加多个元素。
	- 参数：接受一个可迭代对象（如**列表、元组、字符串**等）作为参数。
	- 时间复杂度：O(k)，其中 k 是被添加的元素数量。

让我们通过一些示例来说明它们的区别：

```python
from collections import deque

# 创建一个 deque
d = deque([1, 2, 3])

# 使用 append()
d.append(4)
print(d)  # 输出: deque([1, 2, 3, 4])

# 使用 extend()
d.extend([5, 6, 7])
print(d)  # 输出: deque([1, 2, 3, 4, 5, 6, 7])

# append() 添加一个列表作为单一元素
d.append([8, 9])
print(d)  # 输出: deque([1, 2, 3, 4, 5, 6, 7, [8, 9]])

# extend() 使用字符串
d.extend("abc")
print(d)  # 输出: deque([1, 2, 3, 4, 5, 6, 7, [8, 9], 'a', 'b', 'c'])
```

### 4.2. 主要区别

1. 添加的元素数量：
	- `append()` 每次只添加一个元素。
	- `extend()` 可以一次添加多个元素。
2. 参数类型：
	- `append()` 将其参数作为单一元素添加，即使该参数是一个可迭代对象。
	- `extend()` 接受一个可迭代对象，并将其中的每个元素单独添加到 deque 中。
3. 处理可迭代对象：
	- 如果你用 `extend()` 添加一个列表，列表中的每个元素会被单独添加。
	- 如果你用 `append()` 添加一个列表，整个列表会作为一个元素被添加。
4. **字符串**处理：
	- `extend()` 会将字符串中的每个字符作为单独的元素添加。
	- `append()` 会将整个字符串作为一个元素添加。
5. 性能考虑：
	- 对于添加多个元素，`extend()` 通常更高效，因为它避免了多次调用 `append()`。
	- 对于添加单个元素，`append()` 通常更高效。
6. 左侧操作：
	- 注意，`extendleft()` 会反转添加的元素顺序。
	- deque 还提供了 `appendleft()` 和 `extendleft()` 方法，它们在左侧（开头）执行相应的操作。

示例：

```python
d = deque([1, 2, 3])
d.appendleft(0)
print(d)  # 输出: deque([0, 1, 2, 3])

d.extendleft([4, 5, 6])
print(d)  # 输出: deque([6, 5, 4, 0, 1, 2, 3])
```

总结：
- 使用 `append()` 当你想添加单个元素时
- 使用 `extend()` 当你想添加多个元素，或者处理可迭代对象中的每个元素时
- 理解这两个方法的区别可以帮助你更有效地使用 `deque`，并在适当的场景选择正确的方法
