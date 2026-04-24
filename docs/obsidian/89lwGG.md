# 数组中的第K个最大元素

>  [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)


- 倒序排序
- 然后直接返回 `nums[k - 1]` 即可

```javascript
var findKthLargest = function (nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
};
```


如果自己实现排序算法，可使用 [14. 快速排序](/toThXR) 和 [15. 归并排序](/K7418B)
