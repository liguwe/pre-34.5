# 拥有最多糖果的孩子

`#leetcode`  `#算法` `#2024/07/28` 
## 题目及理解

![image.png|648](https://832-1310531898.cos.ap-beijing.myqcloud.com/37d8e71190091812bedc616e3e431748.png)

## 解题思路

1. 找到最大值： 找到当前 `candies` 数组中的最大元素，这代表孩子们目前拥有的最多的糖果数量。
2. 计算每个孩子加上额外糖果后的数量： 遍历数组 `candies`，对于每个孩子，计算其拥有的糖果加上 `extraCandies` 后的总和。
3. 与最大值比较： 比较每个孩子加上额外糖果后的数量是否大于或等于第一步中找到的最大值
4. 返回结果数组： 根据比较结果，生成对应的布尔值数组 `result`

## 代码实现

```javascript
/**
 * @param {number[]} candies
 * @param {number} extraCandies
 * @return {boolean[]}
 */
var kidsWithCandies = function (candies, extraCandies) {
  // ① 找到candies中的最大值
  const max = Math.max(...candies);
  // ② 遍历candies数组，判断是否满足条件
  return candies.map((candy) => candy + extraCandies >= max);
};

```
