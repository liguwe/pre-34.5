# 选择排序

>  [912. 排序数组](https://leetcode.cn/problems/sort-an-array/)


- 基本思想：从 1 开始往后找最新值，然后交换，直到交换完
- 关键点：
	- **sortedIndex** 变量
		- `索引 < sortedIndex` 的元素都是已排序的
		- `索引 >= sortedIndex` 的元素都是未排序的
	- **不稳定**，因为交换这一行，不考虑他们的相对顺序，直接交换了

```javascript hl:4,13
function sortArray(nums) {
    const n = nums.length;
    let sortedIndex = 0;
    while (sortedIndex < n) {
        let minIndex = sortedIndex;
        for (let i = sortedIndex + 1; i < n; i++) {
            if (nums[i] < nums[minIndex]) {
                minIndex = i;
            }
        }
        // 交换最小值和 sortedIndex 处的元素
        [nums[sortedIndex], nums[minIndex]] = [nums[minIndex],nums[sortedIndex]];
        sortedIndex++;
    }
    return nums;
}
```
