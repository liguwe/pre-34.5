# 山脉数组的峰顶索引：开口向上的抛物线

`#算法/二分搜索` 


> [852. 山脉数组的峰顶索引](https://leetcode.cn/problems/peak-index-in-a-mountain-array/)


## 题目

- 是山脉数组（**先增后减**）
- 只有一个峰值
- **没有相等的相邻元素**


## 方法一：内置方法

```javascript
var peakIndexInMountainArray = function (arr) {
  return arr.indexOf(Math.max(...arr));
};
```

## 方法二：线性扫描：找到**第一个下坡的地方**即可

```javascript
var peakIndexInMountainArray = function(arr) {
    for (let i = 1; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return i;
        }
    }
    return -1; // 实际上永远不会执行到这里
};
```

## 方法三：二分

```javascript
var peakIndexInMountainArray = function (arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < arr[mid + 1]) {
      // 在上坡，峰值在右边
      left = mid + 1;
    } else {
      // 在下坡，峰值在左边（包括mid）
      right = mid;
    }
  }
  return left; // 或者返回right，因为循环结束时left==right
};
```
