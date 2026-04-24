# 存在重复元素 II ：两个重复元素的距离小于等于 k

> [219. 存在重复元素 II](https://leetcode.cn/problems/contains-duplicate-ii/)


```javascript
给你一个整数数组 nums 和一个整数 k，判断是否存在两个不同的索引 i 和 j，
满足：
1. nums[i] == nums[j]
2. abs(i - j) <= k
```

1、当窗口大小小于 `k` 时，扩大窗口。
2、当窗口大小大于 `k` 时，缩小窗口。
3、当窗口大小等于 `k` 且发现窗口中存在重复元素时，返回 true。


关键点：
- 窗口 `win` 使用 `集合 Set`，来判断是否已经出现了每个元素了

```javascript
var containsNearbyDuplicate = function (nums, k) {
    let n = nums.length;
    let left = 0;
    let right = 0;
    let win = new Set();

    while (right < n) {
        let num = nums[right];
        // 如果当前元素已经在窗口中，说明找到了符合条件的重复元素
        if (win.has(num)) {
            return true;
        }
        win.add(num);
        right++;
        // 如果窗口大小超过 k，删除窗口最左边的元素
        if (right - left > k) {
            win.delete(nums[left]);
            left++;
        }
    }

    return false;
};
```
