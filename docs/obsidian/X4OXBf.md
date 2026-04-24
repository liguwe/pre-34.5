# 多数元素

`#leetcode`   `#2024/08/05`

## 1. 题目及理解

![image.png600|504](https://832-1310531898.cos.ap-beijing.myqcloud.com/202408050622674.png?imageSlim)

## 2. 解题思路

### 2.1. 解法 1：哈希

使用一个`哈希表`来统计每个元素的出现次数，并找到出现次数超过 `⌊ n/2 ⌋` 的元素

### 2.2. 解法 2：排序

多数元素的出现频率超过 `⌊ n/2 ⌋` ，因此排序后的数组**中间位置**的元素即为多数元素。

所以排序后，返回 `nums[midIndex]` 即可

### 2.3. 解法 3：Boyer-Moore 投票算法

- 核心思想是"对抗"或"抵消"
	- 每个候选人都有支持者。
	- 支持者之间可以互相抵消。
	- 如果一个候选人的支持者数量超过了总人数的一半，那么即使所有其他候选人的支持者联合起来，也无法完全抵消这个候选人的支持者

1. **初始化**：
    - 设置 `candidate` 为 `null`（还没有候选人）
    - 设置 `count` 为 0（计票器）
2. **遍历数组**： 对于数组中的每个元素：
    - 如果 `count` 为 0：
        - 将当前元素设为新的 `candidate`
        - 将 `count` 设为 1
    - 否则：
        - 如果当前元素等于 `candidate`，`count` 加 1
        - 如果当前元素不等于 `candidate`，`count` 减 1
3. **返回结果**： 遍历结束后，`candidate` 就是多数元素

## 3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
    // 当前遍历的候选人, 初始化为 null,
    // 刚开始，还没遍历任何元素，所以候选人是 null
    let target = null;
    // 该候选人 target 的票数
    let count = 0;

    for (const num of nums) {
        // 如果 count 为 0 ，说明之前的票数抵消完了，需要重新设置候选人
        if (count === 0) {
            target = num;
            count = 1;
        } else {
            // 如果当前的数字和候选人相同，票数 + 1
            if (num === target) {
                count++;
            } else {
                // 如果当前的数字和候选人不同，票数 - 1
                count--;
            }
        }
    }
    return target;
};

```

### 3.1. 复杂度分析

- 时间复杂度：`O(n)`，只需要遍历数组一次。
- 空间复杂度：`O(1)`，只使用了常数额外空间。

## 4. 算法应用

- 在数据流中找到`频繁项`
- 一群带正电的粒子和一群带负电的粒子，判断他们的`正负性`或者`中性`

## 5. 错误记录
