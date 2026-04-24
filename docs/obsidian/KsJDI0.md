# 冒泡排序

[912. 排序数组](https://leetcode.cn/problems/sort-an-array/)


关键点：
- `sortedIndex` 变量
- 一定要倒着遍历，更能**体现冒泡的过程**
- 如何保证稳定性的，见下面代码

```javascript hl:5,6
function sortArray(nums) {
    const n = nums.length;
    let sortedIndex = 0;
    while (sortedIndex < n) {
        for (let i = n - 1; i > sortedIndex; i--) { // 倒着遍历
            if (nums[i] < nums[i - 1]) { // 保证稳定性
                [nums[i], nums[i - 1]] = [nums[i - 1], nums[i]];
            }
        }
        sortedIndex++;
    }
    return nums;
}
```
