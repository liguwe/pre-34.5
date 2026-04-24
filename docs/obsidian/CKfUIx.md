# 最大二叉树：根据一个数组构建最大二叉树

> [654. 最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)

## 1. 题目

![image.png|520](https://832-1310531898.cos.ap-beijing.myqcloud.com/0c9189f5fbd177020598c0b65abf50fb.png)

>  注意上面的标注

## 2. 代码

- `l > r` ：
	- 因为还是向中间靠拢
- 注意是：`l < r`


```javascript
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  return build(nums, 0, nums.length - 1);
  function build(nums, l, r) {
    if (l > r) return null;
    let index = -1;
    let val = -1;
    for (let i = l; i <= r; i++) {
      if (nums[i] > val) {
        val = nums[i];
        index = i;
      }
    }
    let root = new TreeNode(val, null, null);
    root.left = build(nums, l, index - 1);
    root.right = build(nums, index + 1, r);
    return root;
  }
};
```

## 3. 错误记录

注意题意：不是构造二叉树搜索树，
- 规则是从数组中找最大值
	- 从最大值的左边：
		- 寻找最大值构造左树
	- 从最大值的右边：
		- 寻找最大值构造右树
