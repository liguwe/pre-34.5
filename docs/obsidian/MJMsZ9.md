# 插入排序

>  [912. 排序数组](https://leetcode.cn/problems/sort-an-array/)


- 是 [11. 选择排序](/IhDoxs) 的优化
- 将 `nums[sortedIndex]` 插入到左侧的有序数组中
- 对于有序度较高的数组，插入排序的效率比较高


- 选择排序：
	- 在 `nums[sortedIndex...]` 中找到最小值，然后将其插入到 `nums[sortedIndex]` 的位置。
- 那么我们能不能反过来想
	- 在 `nums[0..sortedIndex-1]` 这个部分有序的数组中，找到 `nums[sortedIndex]` 应该插入的位置，然后进行插入呢？


这个算法的名字叫做**插入排序**，它的执行过程就像是打扑克牌时，将新抓到的牌插入到手中已经排好序的牌中。


```javascript hl:7,8,13
function sortArray(nums) {
    let n = nums.length;
    // 维护 [0, sortedIndex) 是有序数组
    let sortedIndex = 0;
    while (sortedIndex < n) {
        // 将 nums[sortedIndex] 插入到有序数组 [0, sortedIndex) 中
        for (let i = sortedIndex; i > 0; i--) {   // 倒着遍历
            if (nums[i] < nums[i - 1]) { // 保证有序
                let tmp = nums[i];
                nums[i] = nums[i - 1];
                nums[i - 1] = tmp;
            } else {
                break;
            }
        }
        sortedIndex++;
    }
    return nums;
}

```
