# 删除二叉搜索树中的节点

> [450. 删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

## 总结

```javascript
var deleteNode = function (root, key) {
    if (!root) return null;
    if (root.val === key) {
        // 情况 1：没有子节点, 直接删除
        if (!root.left && !root.right) {
            return null;
        }
        // 情况 2：只有一个子节点
        if (!root.left && root.right) {
            return root.right;
        }
        if (!root.right && root.left) {
            return root.left;
        }
        // 情况 3：有两个子节点
        let minNode = getMin(root.right);
        root.val = minNode.val;
        root.right = deleteNode(root.right, minNode.val);
    } else if (root.val > key) {
        root.left = deleteNode(root.left, key);
    } else if (root.val < key) {
        root.right = deleteNode(root.right, key);
    }
    return root;
};

var getMin = function (node) {
    while (node.left != null) {
        node = node.left;
    }
    return node;
};
```

## 1. 思路

- 先「找」该节点
- 再「改」该节点

## 2. 先写出代码模板

```javascript hl:3
var deleteNode = function(root, key) {
    if (root.val === key) {
        // 找到啦， 进行删除
    } else if (root.val > key) {
        // 去左子树找
        root.left = deleteNode(root.left, key);
    } else if (root.val < key) {
        // 去右子树找
        root.right = deleteNode(root.right, key);
    }
    return root;
}
```

## 3. 找到了，有三种情况

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240908125438.png)

## 4. 代码实现

```javascript
var deleteNode = function (root, key) {
  // base case
  if (!root) {
    return null;
  }
  if (root.val === key) {
    // 情况 1：没有子节点, 直接删除
    //  删除的方式是：直接返回 null
    if (!root.left && !root.right) {
      return null;
    }

    // 情况 2：只有一个子节点
    // 删除的方式是：返回非空的子节点
    // 如果右子节点存在，返回右子节点
    // 删除的方式是：返回右子节点
    if (!root.left && root.right) {
      return root.right;
    }
    // 如果左子节点存在，返回左子节点
    // 删除的方式是：返回左子节点
    if (!root.right && root.left) {
      return root.left;
    }

    // 情况 3：有两个子节点
    // 删除的方式是：① 找到右子树中的最小节点，替换当前节点 或者 ② 找到左子树中的最大节点，替换当前节点
    // 我们这里选择 ①
    // 找到右子树中的最小节点, 替换当前节点, 然后删除右子树中的最小节点
    // ① - 1:找到右子树中的最小节点
    let minNode = getMin(root.right);
    // ① - 2:替换当前节点
    root.val = minNode.val;
    // ① - 3:然后删除右子树中的最小节点,返回值必须使用 root.right 接住
    root.right = deleteNode(root.right, minNode.val);
  } else if (root.val > key) {
    // 去左子树找
    root.left = deleteNode(root.left, key);
  } else if (root.val < key) {
    // 去右子树找
    root.right = deleteNode(root.right, key);
  }
  return root;
};
// 获得 BST 中最小的节点。
var getMin = function (node) {
  // BST 最左边的就是最小的
  while (node.left != null) {
    node = node.left;
  }
  return node;
};

```
