# 查找两棵二叉搜索树之和：从两棵BST中各找出一个节点， 满足 2sum = target

>  [1214. 查找两棵二叉搜索树之和](https://leetcode.cn/problems/two-sum-bsts/)


- 思路
	- ① 将两个 BST 转化成两个有序数组
	- ② 对两个有序数组执行两数之和问题

注意点：
- `traverse` 函数里的 `traverse` 也需要记得传参数啊，相等于有 5 个地方需要传参
- 这同`合并两个有序数组`不一样，但是可以参考其写法
	- 四个变量：`m n i  j` 

```javascript
var twoSumBSTs = function (root1, root2, target) {
    let arr1 = [];
    let arr2 = [];
    function traverse(root, res) {
        if (!root) return;
        traverse(root.left, res);
        res.push(root.val);
        traverse(root.right, res);
    }
    traverse(root1, arr1);
    traverse(root2, arr2);
    let m = arr1.length;
    let n = arr2.length;
    let i = 0;
    let j = n - 1;
    while (i < m && j >= 0) {
        let sum = arr1[i] + arr2[j];
        if (sum < target) {
            i++;
        } else if (sum > target) {
            j--;
        } else {
            return true;
        }
    }
    return false;
};
```
