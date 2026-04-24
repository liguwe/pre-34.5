# 从字符串生成二叉树：由包含括号的字符串生成二叉树

> [536. 从字符串生成二叉树](https://leetcode.cn/problems/construct-binary-tree-from-string/)

## 思路

1. 使用全局指针 `p` 来追踪当前处理的字符位置
2. 通过`括号`来识别子树的`边界`
3. `递归`处理左右子树

## 代码

```javascript
function str2tree(s) {
    if (!s) return null;
    let n = s.length;
    let p = 0; // 指针
    function dfs() {
        if (p >= n) return null;
        // 解析节点值
        let num = "";
        while (p < n && s[p] !== "(" && s[p] !== ")") {
            num += s[p];
            p++;
        }
        if (!num) return null;
        const node = new TreeNode(parseInt(num));
        // 处理左子树
        if (p < n && s[p] === "(") {
            p++; // 跳过左括号
            node.left = dfs(); // 递归处理左子树
            p++; // 跳过右括号
        }
        // 处理右子树
        if (p < s.length && s[p] === "(") {
            p++; // 跳过左括号
            node.right = dfs(); // 递归处理右子树
            p++; // 跳过右括号
        }
        return node;
    }
    return dfs();
}
```

## 示例执行过程

以输入字符串 `"4(2(3)(1))(6(5))"` 为例：

1. **第一层递归**：
   ```
   p = 0: 读取 "4" → 创建根节点 4
   p = 1: 遇到 "(" → 处理左子树
   ```

2. **处理左子树**：
   ```
   p = 2: 读取 "2" → 创建节点 2
   p = 3: 遇到 "(" → 处理 2 的左子树
   p = 4: 读取 "3" → 创建节点 3
   p = 6: 遇到 "(" → 处理 2 的右子树
   p = 7: 读取 "1" → 创建节点 1
   ```

3. **处理右子树**：
   ```
   p = 11: 遇到 "(" → 处理根节点的右子树
   p = 12: 读取 "6" → 创建节点 6
   p = 13: 遇到 "(" → 处理 6 的左子树
   p = 14: 读取 "5" → 创建节点 5
   ```
