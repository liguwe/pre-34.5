# 组合总和 II ：元素可重，不可复选

`#回溯算法` 


> [40. 组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)


## 1. 总结

- 只要元素可重复，则需要先排序
- 三个参数：
	- `function backtrack(track, sum, start) {`
- 剪枝逻辑：
	-  `if (sum > target) { ` 
		-  return
- 去重逻辑
	-  `if (i > start && candidates[i] === candidates[i - 1]) {`
		- continue

```javascript
var combinationSum2 = function (candidates, target) {
  candidates.sort((a, b) => a - b);
  let n = candidates.length;
  let res = [];
  function backtrack(track, sum, start) {
    if (sum === target) {
      res.push([...track]);
      return;
    }
    // 剪枝
    if (sum > target) {
      return;
    }
    for (let i = start; i < n; i++) {
      // 去重逻辑
      if (i > start && candidates[i] === candidates[i - 1]) {
        continue;
      }

      track.push(candidates[i]);
      sum += candidates[i];
      backtrack(track, sum, i + 1);
      track.pop();
      sum -= candidates[i];
    }
  }

  backtrack([], 0, 0);

  return res;
};
```

## 2. 题解

![|712](https://832-1310531898.cos.ap-beijing.myqcloud.com/dc788f87448a26142ca7354275ef6bbc.png)

> 即，换种思路理解题解：
> 从一个班中，找到体重和为 `1000kg` 的同学去，划船，因为船最大载重为 `1000 kg`

```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
    let res = [];
    let track = [];
    let trackSum = 0;
    let sortedCandidates = candidates.sort((a, b) => a - b); // 排序
    // 回溯函数
    const backtrack = (nums, start, target) => {
        // 达到目标和，找到符合条件的组合，记录结果
        if (trackSum === target) {
            res.push([...track]);
            return;
        }
        // 先剪枝，超过目标和，直接结束
        if (trackSum > target) {
            return;
        }
        // 回溯算法标准框架
        for (let i = start; i < nums.length; i++) {
            // 剪枝逻辑，值相同的树枝，只遍历第一条
            if (i > start && nums[i] === nums[i - 1]) {
                continue;
            }
            // 做选择
            track.push(nums[i]);
            trackSum += nums[i];
            // 递归遍历下一层回溯树
            backtrack(nums, i + 1, target);
            // 撤销选择
            track.pop();
            trackSum -= nums[i];
        }
    }
    backtrack(sortedCandidates, 0, target);
    return res;
};

```


> [!question]
很早很早以前刷过这题，那时候还不知道这叫 **回溯算法**，搞出来了还沾沾自喜？
