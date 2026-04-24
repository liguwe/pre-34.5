# 子集 II：元素重复，不可复选

> [90. 子集 II](https://leetcode.cn/problems/subsets-ii/)

## 1. 总结

- 同 [78. 子集：元素不重复不可复选](/B5pn0e)
	- 但需要做两件事情
		- ① 排序
		- ② 剪枝
			- 值相同的相邻树枝，只遍历第一条
				- `if (i > start && nums[i] === nums[i - 1]) {`
					- `continue`

```javascript
var subsetsWithDup = function (nums) {
  nums.sort((a, b) => a - b);
  let res = [];
  let n = nums.length;
  function backtrack(track, start) {
    res.push([...track]);
    for (let i = start; i < n; i++) {
      if (i > start && nums[i] === nums[i - 1]) {
        continue;
      }
      track.push(nums[i]);
      backtrack(track, i + 1);
      track.pop();
    }
  }
  backtrack([], 0);
  return res;
};
```

## 2. 题目



![|640](https://832-1310531898.cos.ap-beijing.myqcloud.com/a730e5dae027ee1623d8d8863d6618d4.png)

## 3. 分析

相较于`子集`主要区别在于：
- 可能有重复元素
- 返回的子集中不能含有重复元素

- 所以，`先排序`，让相同的元素靠在一起
- 如果发现 `nums[i] == nums[i-1]`，则跳过

```javascript
var subsetsWithDup = function(nums) {
    // 定义结果数组和回溯时的路径数组
    let res = [];
    let track = [];
    // 排序，以便于剪枝算法的实现
    nums.sort((a, b) => a - b);
    // 回溯算法
    const backtrack = (nums, start) => {
        // 前序位置，每个节点的值都是一个子集
        res.push([...track]);
        // 遍历子集树枝
        for (let i = start; i < nums.length; i++) {
            // 剪枝逻辑，值相同的相邻树枝，只遍历第一条
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            // 选择当前元素，加入路径数组
            track.push(nums[i]);
            // 向子节点递归
            backtrack(nums, i + 1);
            // 回溯，撤销选择
            track.pop();
        }
    }
    backtrack(nums, 0);
    return res;
};

```
