# 航班预订统计

`#算法/差分数组` 

>  [1109. 航班预订统计](https://leetcode.cn/problems/corporate-flight-bookings/)


 `bookings[i] = [first, last, seats]` 
 - 从 `first` 到 `last` 的 **每个航班** 上预订了 `seats` 个座位


- 使用 [3. 差分数组](/haLES5)  
- 基本和 [370. 区间加法](/FPgjsq) 一样，只是航班索引需要从 1 开始，需要特殊处理下


```javascript hl:5
var corpFlightBookings = function (bookings, n) {
    let arr = new Array(n).fill(0);
    let diff = getDiff(arr);
    for ([i, j, c] of bookings) {
        // 航班编号从1开始，转换为数组索引
        i--;
        j--;
        diff[i] += c;
        if (j + 1 < n) {
            diff[j + 1] -= c;
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
