# 找到最高海拔

`#算法` `#2024/07/28` `#leetcode` 

## 题目及理解

![image.png|672](https://832-1310531898.cos.ap-beijing.myqcloud.com/0b67ca13731e85886bdfa6b3502dd319.png)

## 解题思路

1. 初始化一个变量 `max` 来记录最高海拔，初始值为 0。
2. 初始化一个变量 `current` 来记录当前海拔，初始值为 0。
3. 遍历 `gain` 数组：
   - 将当前的高度变化加到 `current` 上。
   - 比较 `current` 和 `max`，更新 `max` 如果需要。
4. 返回 `max`。

## 代码实现

```javascript
/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function (gain) {
  let max = 0; // 最大高度
  let current = 0; // 当前高度，因为自行车手从海拔为 0 的地方开始骑行，所以当前高度为 0
  for (let i = 0; i < gain.length; i++) {
    //  gain[i] 是点 i 和点 i + 1 的 净海拔高度差（
    //  当前高度 = 当前高度 + gain[i]
    current += gain[i];
    max = Math.max(max, current);
  }

  return max;
};

```

### 复杂度分析

- 时间复杂度是 O(n)，其中 n 是 `gain` 数组的长度，因为我们只需要遍历一次数组。
- 空间复杂度是 O(1)，因为我们只使用了常数级的额外空间

## 错误记录

- let 和 const 用混了
