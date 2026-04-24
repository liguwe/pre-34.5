# 区间加法

> [370. 区间加法](https://leetcode.cn/problems/range-addition/)


`[startIndex, endIndex, inc]`

```javascript
示例:
输入: length = 5, updates = [[1,3,2],[2,4,3],[0,2,-2]]
输出: [-2,0,3,5,3]
---------------------------------------------------------------
解释:
初始状态:
[0,0,0,0,0]

进行了操作 [1,3,2] 后的状态:
[0,2,2,2,0]

进行了操作 [2,4,3] 后的状态:
[0,2,5,5,3]

进行了操作 [0,2,-2] 后的状态:
[-2,0,3,5,3]
```


- 使用 [3. 差分数组](/haLES5) ，很快就能实现
- 注意：需要判断 `j+1` 是否越界

```javascript hl:8
var getModifiedArray = function (length, updates) {
    let n = length;
    let arr = new Array(n).fill(0);

    let diff = getDiff(arr);
    for (let [i, j, inc] of updates) {
        diff[i] += inc;
        // 注意这里需要判断 j+1 是否越界
        if (j + 1 < n) {
            diff[j + 1] -= inc;
        }
    }

    return restore(diff);
};

// 构造差分数组
function getDiff(nums) {
    const diff = new Array(nums.length).fill(0);
    diff[0] = nums[0];
    for (let i = 1; i < nums.length; i++) {
        diff[i] = nums[i] - nums[i - 1];
    }
    return diff;
}

// 从差分数组还原原始数组
function restore(diff) {
    const res = new Array(diff.length).fill(0);
    res[0] = diff[0];
    for (let i = 1; i < diff.length; i++) {
        res[i] = res[i - 1] + diff[i];
    }
    return res;
}
```
