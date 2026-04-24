# K 和数对的最大数目

`#leetcode`  `#算法/哈希`  

## 1. 题目及理解

![image.png|552](https://832-1310531898.cos.ap-beijing.myqcloud.com/ce8d96510f9e7129cb173c644ceb5657.png)

## 2. 解题思路

- 思路一：使用 hash 正常遍历思路即可
   - 边界情况处理：如果存在两个相同的值的场景
- 思路二：先排序，然后使用双指针，这里没写代码了

## 3. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxOperations = function (nums, k) {
  // 用于记录重复元素的个数
  let map = new Map();
  // 初始化 map
  for (const num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }

  // 代表最大操作次数
  let count = 0;

  for (const num of nums) {
    // 需要的另一个数，即 num + need = k
    const need = k - num;
    // 确保 num 和 need 存在的个数都大于 0，才能进行操作
    if (map.get(need) > 0 && map.get(num) > 0) {
      // 如果 num === need，且 map 中的值小于 2，则不满足条件
      if (num === need && map.get(num) < 2) continue;

      // 更新 map 中的值
      map.set(num, map.get(num) - 1);
      map.set(need, map.get(need) - 1);
      // 更新 count
      count++;
    }
  }

  return count;
};

```

> 1. 两个 for 循环为了更好的理解

### 3.1. 复杂度分析

## 4. 代码实现二

- 先排序，然后使用双指针，这里没写代码了

## 5. 错误记录

1. 不能使用 `map.has` ，代表是否有某个属性值
