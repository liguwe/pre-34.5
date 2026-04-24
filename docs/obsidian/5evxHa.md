# 存在重复元素 III：两个数的差值不超过 t + 两个数的位置差不超过 k

`#算法/滑动窗口` 

> [220. 存在重复元素 III](https://leetcode.cn/problems/contains-duplicate-iii/)


```javascript
给你一个整数数组 nums 和两个整数 k 和 t，判断是否存在两个不同的索引 i 和 j，
满足：
1. abs(nums[i] - nums[j]) <= t
2. abs(i - j) <= k
```

和 [219. 存在重复元素 II ：两个重复元素的距离小于等于 k](/9Dgh8z) 的区别是：
- 219题：要求值完全相等 `nums[i] == nums[j]`
- 220题：要求值的差的绝对值不超过t `abs(nums[i] - nums[j]) <= t`

## 1. 滑动窗口框架

1、什么时候应该扩大窗口？
2、什么时候应该缩小窗口？
3、什么时候得到一个合法的答案？

针对本题，以上三个问题的答案是：

1、当窗口大小小于等于 `k` 时，扩大窗口，包含更多元素。
2、当窗口大小大于 `k` 时，缩小窗口，减少窗口元素。
3、窗口大小小于等于 `k`，且窗口中存在两个不同元素之差小于 `t` 时，找到一个答案


给定数组 nums，找到两个索引 i 和 j，满足：
1. `abs(nums[i] - nums[j]) <= t` （**两个数的差值不超过 t**）
2. `abs(i - j) <= k` （**两个数的位置差不超过 k**）

## 2. 代码

```javascript
var containsNearbyAlmostDuplicate = function (nums, k, t) {
    if (k <= 0 || t < 0) return false;
    let window = new Map();
    let left = 0;
    for (let right = 0; right < nums.length; right++) {
        // 查找略大于 nums[right] 的那个元素
        let num = nums[right];
        // 计算当前元素应该放入哪个桶
        let bucket = Math.floor(num / (t + 1));

        // 检查当前桶是否已有元素
        if (window.has(bucket)) {
            return true; // 同一个桶内的元素差值必定 ≤ t
        }

        // 检查相邻的桶: 检查前一个桶
        if (
            window.has(bucket - 1) &&
            Math.abs(num - window.get(bucket - 1)) <= t
        ) {
            return true;
        }
        // 检查相邻的桶: 检查后一个桶
        if (
            window.has(bucket + 1) &&
            Math.abs(num - window.get(bucket + 1)) <= t
        ) {
            return true;
        }
        // 扩大窗口
        window.set(bucket, num);
        // 缩小窗口
        if (right - left >= k) {
            window.delete(Math.floor(nums[left] / (t + 1)));
            left++;
        }
    }
    return false;
};

```

## 3. 一些疑问❓

### 3.1. 为什么要检查相邻桶？

考虑这种情况：

- t = 3
- 两个数：3和4
- 3在桶0 `[0-3]`
- 4在桶1 `[4-7]`
- 虽然它们在不同桶，但 `|4-3| = 1 ≤ t`

### 3.2. 核心思想：桶排序

#### 3.2.1. **桶的设计**

   - 桶的大小设为 `w = t + 1`
   - 每个桶存储的数字范围是 `[0,t], [t+1, 2t + 1], [2t+2,3t+2]...`
   - 这样设计保证了：**如果两个数在同一个桶内，它们的差值一定 ≤ t**

#### 3.2.2. **桶的编号计算**

   ```javascript
   // 例如 t = 3, w = t + 1 =  4 (桶大小)
   // 数字 0,1,2,3 → 桶 0
   // 数字 4,5,6,7 → 桶 1
   // 数字 8,9,10,11 → 桶 2
   ```

### 3.3. 举例说明

假设 `nums = [1,5,2,9], k = 2, t = 3`

```javascript
步骤分析：
1. i = 0, num = 1
   - w = 4 (t + 1)
   - 桶号 = floor(1/4) = 0
   - bucket: {0 => 1}

2. i = 1, num = 5
   - 桶号 = floor(5/4) = 1
   - 检查桶 0（有值1）：|5-1| > 3，不满足
   - bucket: {0 => 1, 1 => 5}

3. i = 2, num = 2
   - 桶号 = floor(2/4) = 0
   - 发现桶 0 已有元素1
   - |2-1| ≤ 3，返回 true
```
