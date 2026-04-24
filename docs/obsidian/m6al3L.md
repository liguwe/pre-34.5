# 找到 K 个最接近的元素：最靠近 x 的 k 个数

>  [658. 找到 K 个最接近的元素](https://leetcode.cn/problems/find-k-closest-elements/)

## 1. 解法一：排序

- 如果距离相同，返回较小的数，即 `a - b`

```javascript
var findClosestElements = function (arr, k, x) {
  arr = arr.sort((a, b) => {
    const diff = Math.abs(a - x) - Math.abs(b - x);
    // 如果距离相同，返回较小的数
    return diff === 0 ? a - b : diff;
  });
  return arr.slice(0, k).sort((a, b) => a - b);
};
```

## 2. 解法二：二分法

- 注意两个 base cade
- 双指针
	- `left = 0`
	- `right = arr.length - k`

```javascript
var findClosestElements = function (arr, k, x) {
  // 如果x小于等于最小值，直接返回前k个
  if (x <= arr[0]) {
    return arr.slice(0, k);
  }
  // 如果x大于等于最大值，直接返回后k个
  if (x >= arr[arr.length - 1]) {
    return arr.slice(arr.length - k);
  }

  let left = 0;
  let right = arr.length - k;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    // 比较mid和mid+k位置的元素与x的距离
    if (x - arr[mid] > arr[mid + k] - x) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return arr.slice(left, left + k);
};
```



## 3. 解法三：二分查找 + 滑动窗口

- 寻找左边界
- 再配合滑动窗口

> 省略，有点复杂，要写二分查找左边界，还得写滑动窗口，麻烦了点
