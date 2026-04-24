# 拼车

`#算法/差分数组` 

> [1094. 拼车](https://leetcode.cn/problems/car-pooling/)

## 1. 总结

- 还是 [3. 差分数组](/haLES5) 问题
- 数组长度，需要自己计算


```javascript hl:5,14
var carPooling = function (trips, capacity) {
    // 找出最远的终点站，用作数组长度
    let maxLocation = 0;
    for (let [, , to] of trips) {
        maxLocation = Math.max(maxLocation, to);
    }

    let arr = new Array(maxLocation + 1).fill(0);
    let diff = getDiff(arr);

    // 更新差分数组
    for (let [numPassengers, from, to] of trips) {
        diff[from] += numPassengers;
        // 这里不需要检查边界，因为我们已经保证了数组长度足够
        diff[to] -= numPassengers;
    }

    // 还原原始数组并检查是否超过容量
    let restored = restore(diff);
    // 检查每个时间点是否超过容量
    for (let passengers of restored) {
        if (passengers > capacity) {
            return false;
        }
    }

    return true;
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

## 2. 相关

- [370. 区间加法](/FPgjsq)
