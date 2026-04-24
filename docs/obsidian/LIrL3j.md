# 二叉搜索树中第 K 小的元素

>  [230. 二叉搜索树中第 K 小的元素](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

- 思路：
	- 中序遍历有序的，存到 res ，然后返回 `res[k-1]` 即可

```javascript
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
  // 因为  0 <= Node.val <= 104
  let res = [];
  function traverse(root) {
    if (!root) return;
    traverse(root.left);
    res.push(root.val);
    traverse(root.right);
  }
  traverse(root);
  return res[k - 1];
};
```

> 当然也可以匹配到就 return 了，不用全部遍历一遍

## 1. 附：二叉搜索树中第K小的元素

### 1.1. 题意

![cos-blog-832-34-20241012|552](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240908112644.png)

### 1.2. 代码实现

```javascript
var kthSmallest = function (root, k) {
  let res = 0;
  function traverse(node) {
    if (!node) return;

    traverse(node.left);
    /*********************************
     ********** 中序位置 **************
     **********************************/
    k--;
    // k === 0 时，表示已经找到第 k 小的元素
    if (k === 0) {
      res = node.val;
      return;
    }
    traverse(node.right);
  }

  traverse(root);

  return res;
};
```

### 1.3. 复杂度分析

时间复杂度：
1. 最佳情况：`O(k)`
   - 如果第 k 小的元素在树的左侧较浅的位置，我们可能只需要访问 k 个节点就能找到它。
2. 最坏情况：`O(n)`
   - 如果 k 等于节点总数，或者第 k 小的元素在树的右侧较深的位置，我们可能需要遍历整棵树。
   - n 是树中节点的总数。
3. 平均情况：`O(n)`
   - 在平均情况下，我们可能需要遍历大部分节点才能找到第 k 小的元素。

空间复杂度：`O(h)`，其中 h 是**树的高度**
4. 主要的空间消耗来自于递归调用栈。
5. 在最坏情况下（树完全不平衡，呈现为一条链），高度 h 可能等于节点数 n，此时空间复杂度为 O(n)。
6. 在最佳情况下（完全平衡二叉树），高度 h 约等于 log(n)，此时空间复杂度为 `O(log n)`。

额外说明：
- 这个解法没有使用任何额外的数据结构来存储节点，这有助于保持较低的空间复杂度。
- 虽然我们定义了几个变量（count, result），但它们占用的空间是常数级的，不随输入规模变化，因此在分析空间复杂度时可以忽略不计。

总结：
- 时间复杂度：
	- 最佳 `O(k)`
	- 最坏和平均 `O(n)`
- 空间复杂度：`O(h)`，其中 h 是树的高度，最坏情况下可能达到 `O(n)`

这个解法在时间和空间效率上都是相当不错的，特别是对于平衡的二叉搜索树，它的性能表现会更好。

### 1.4. 优化：中序遍历 + 数组缓存

这种方法适用于树不经常变动，但频繁查询不同 k 值的情况
