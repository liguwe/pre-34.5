# 最长连续序列

`#2024/07/28` `#leetcode` `#算法/哈希`  

## 1. 题目及理解

![iShot_2024-07-20_09.28.52.png600|552](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407281623327.png?imageSlim)

## 2. 解题思路

- 使用 `Set` 来，空间复杂度换时间复杂度
- 去重了也没关系，因为这里需要找连续的个数

## 3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  // 使用集合存储数组中的元素，方便查找，判断是否存在
  const set = new Set(nums);
  // 用于记录最长连续序列的长度
  let longest = 0;
  // 遍历数组中的元素
  // 直接遍历 set 集合，去重也没关系
  for (const num of set) {
    // 当前元素的前一个元素不存在时，才开始计算连续序列的长度
    // 这样可以避免重复计算
    if (!set.has(num - 1)) {
      // 当前元素
      let currentNum = num;
      // 当前连续序列的长度
      let currentStreak = 1;
      // 当前元素的后一个元素存在时，就继续计算连续序列的长度
      while (set.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }
      // 更新最长连续序列的长度
      longest = Math.max(longest, currentStreak);
    }
  }
  return longest;
};
```

### 3.1. 复杂度分析

- 时间复杂度： `O(n)`
   - 遍历：`for (const num of set) { `  ，这个复杂度是 `O(n)`
   - `while` 查找
      - **每个元素最多会经历一次查找前一个元素和若干次查找后续元素的操作**。而查找操作在集合中平均时间复杂度为 `O(1)`，因此对于每个元素，整个查找操作的时间复杂度可以视为 `O(1)`
- 空间复杂度： O(n)

## 4. 错误记录
