# 二叉树中的伪回文路径

>  [1457. 二叉树中的伪回文路径](https://leetcode.cn/problems/pseudo-palindromic-paths-in-a-binary-tree/)

## 1. 题意

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250122-2.png)


关键点：如果一组数字中，只有最多一个数字出现的次数为`奇数`，剩余数字的出现次数均为`偶数`，那么这组数字可以组成一个回文串

## 2. 思路一

- 找到所有的路径，挨个判断是否是回文路径
- 这种解法会超时

```javascript
var pseudoPalindromicPaths = function (root) {
    let res = 0;
    function traverse(root, path) {
        if (!root) return;
        path.push(root.val);
        if (root.left === null && root.right === null) {
            if (isOk(path)) res++;
        } else {
            traverse(root.left, path);
            traverse(root.right, path);
        }
        path.pop();
    }

    traverse(root, []);
    function isOk(item) {
        let map = {};
        for (it of item) {
            map[it] = (map[it] || 0) + 1;
        }
        let count = Object.values(map);
        let oddNum = 0;
        for (let c of count) {
            if (c % 2 === 1) {
                oddNum++;
            }
        }
        return oddNum <= 1;
    }
    return res;
};

```

## 3. 思路二

1. 使用`固定大小的数组`而不是 `map`，因为`节点值范围是已知的（1-9）`
2. 直接在遍历过程中维护计数数组，而不是每次都创建新的
3. 在 `isOk` 函数中增加提前返回的判断
4. 简化了参数传递，不再需要传递 path 数组

```javascript
var pseudoPalindromicPaths = function (root) {
    let res = 0;
    // 使用数字数组代替 map，因为题目节点值在 1-9 之间
    let count = new Array(10).fill(0);

    function traverse(root) {
        if (!root) return;

        // 记录当前节点的值
        count[root.val]++;

        // 如果是叶子节点，检查路径
        if (!root.left && !root.right) {
            if (isOk(count)) res++;
        } else {
            traverse(root.left);
            traverse(root.right);
        }

        // 回溯，移除当前节点的值
        count[root.val]--;
    }

    function isOk(count) {
        let oddNum = 0;
        // 只需要检查 1-9
        for (let i = 1; i <= 9; i++) {
            if (count[i] % 2 === 1) {
                oddNum++;
            }
            // 如果奇数个数超过1，可以提前返回false
            if (oddNum > 1) return false;
        }
        return true;
    }

    traverse(root);
    return res;
};

```
