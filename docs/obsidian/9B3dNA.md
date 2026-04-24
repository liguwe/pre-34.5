# 二叉树中的最长交错路径

`#leetcode` `#算法` `#算法/二叉树` 

>  [1372. 二叉树中的最长交错路径](https://leetcode.cn/problems/longest-zigzag-path-in-a-binary-tree/)

## 1. 总结

一个节点 `x` 能够产生的交错路径就能分解到左右子树：
- `x` 的左子树的「右交错路径」+ 节点 `x` = `x` 的「左交错路径」
- `x` 的右子树的「左交错路径」+ 节点 `x` = `x` 的「右交错路径」
- 比较 `x` 的左右交错路径，即可算出以 `x` 开头的最长交错路径

```javascript hl:5,10,12
var longestZigZag = function (root) {
    let res = 0;
    // 输入二叉树的根节点 root，返回两个值
    // [从 root 开始向左走的最长交错路径长度，从 root 开始向右走的最长交错路径长度]
    var getPathLen = function (root) {
        if (root == null) return [-1, -1];
        let left = getPathLen(root.left);
        let right = getPathLen(root.right);
        // root 的左子树的「右交错路径」+ root = root 的「左交错路径」
        let len1 = left[1] + 1;
        // root 的右子树的「左交错路径」+ 节点 root = root 的「右交错路径」
        let len2 = right[0] + 1;
        // 更新全局最大值
        res = Math.max(res, Math.max(len1, len2));
        return [len1, len2];
    };
    getPathLen(root);
    return res;
};
```

## 2. 题目及理解

> https://leetcode.cn/problems/longest-zigzag-path-in-a-binary-tree/description

![cos-blog-832-34-20241012|752](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240904081336.png)

## 3. 思路：二叉树的分解问题的解题思路

说过二叉树的递归分为「遍历」和「分解问题」两种思维模式，这道题需要用到 **分解问题**的思维，而且要用到**后序位置**的妙用。

### 3.1. 递归函数定义 

```javascript
/*************************************************  
 * :::: 递归函数 getPathLen 定义：输入二叉树的根节点 root ，返回两个值  
 * ① 第一个是从 root 开始向左走的最长交错路径长度  
 * ② 第二个是从 root 开始向右走的最长交错路径长度  
 ************************************************/
```

### 3.2. 代码实现

```javascript

var longestZigZag = function(root) {  
    let res = 0;  
    /*************************************************  
     * :::: 递归函数定义：输入二叉树的根节点 root ，返回两个值  
     * ① 第一个是从 root 开始向左走的最长交错路径长度  
     * ② 第二个是从 root 开始向右走的最长交错路径长度  
     ************************************************/  
    var getPathLen = function(root) {  
        if (root == null) {  
            return [-1, -1];  
        }  
        // 代表从左子树开始的交错路径长度  
        let left = getPathLen(root.left);  
        // 代表从右子树开始的交错路径长度  
        let right = getPathLen(root.right);  
        /*************************************************  
         * ::::后序位置，根据左右子树的交错路径长度推算根节点的交错路径长度  
         ************************************************/  
        let rootPathLen1 = left[1] + 1;  
        let rootPathLen2 = right[0] + 1;  
        // 更新全局最大值  
        res = Math.max(res, Math.max(rootPathLen1, rootPathLen2));  
        return [rootPathLen1, rootPathLen2];  
    }  
    getPathLen(root);  
    return res;  
};
```

### 3.3. 时间复杂度

1. **递归遍历**：
   - 这段代码使用递归的方式遍历整棵二叉树。对于每个节点，`getPathLen` 函数会被调用一次。
   - 因此，整个树的所有节点都会被访问一次，时间复杂度为 \(O(N)\)，其中 \(N\) 是树中节点的个数。
2. **每次递归调用的操作**：
   - 在每次递归调用中，主要进行的是对左右子树的递归调用和一些常数时间的计算（如计算路径长度和更新最大值）。
   - 这些操作的时间复杂度是常数级别，即 \(O(1)\)。

综上所述，整个函数的时间复杂度是 \(O(N)\)。

### 3.4. 空间复杂度

1. **递归栈空间**：
   - 由于使用递归来遍历树，递归调用会消耗栈空间。
   - 在最坏情况下（例如树呈链状，完全不平衡），递归调用的最大深度为 \(N\)，因此空间复杂度为 \(O(N)\)。
   - 在平均情况下，对于一棵平衡二叉树，递归深度为树的高度，即 \(O(\log N)\)。
2. **额外空间**：
   - 除了递归栈空间，算法中没有使用其他额外的数据结构来存储信息，因此额外的空间复杂度为 \(O(1)\)。

综上所述，整体的空间复杂度是 \(O(N)\) 在最坏情况下，或者 \(O(\log N)\) 在平均情况下。

### 3.5. 复杂度总结

- **时间复杂度**: \(O(N)\)
- **空间复杂度**: 
	- \(O(N)\)（最坏情况）
	- \(O(\log N)\)（平均情况）
