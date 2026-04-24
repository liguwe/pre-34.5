# 颜色分类

`#双指针/快慢指针`

> [75. 颜色分类](https://leetcode.cn/problems/sort-colors/)

## 1. 总结

- 把 `2` 移动到`数组的末尾`
- 把 `1` 移动到 `2 的前一位索引`
- 注意：
	- 需要考虑数组中有没有 2 的场景

## 2. 思路

- 第一次
	- 把 2 移动到数组的末尾
- 第二次
	- 把 1 移动到末尾，只不过这个末尾不是数组的末尾，而是 **2 的前面一位索引**

## 3. 代码

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
    // 第一步：将所有2移到数组末尾
    moveEnd(nums, 2, nums.length);
    
    // 第二步：确定1应该移动到的位置
    // 如果数组中没有2，则1移动到数组末尾
    // 如果数组中有2，则1移动到第一个2的位置
    let firstTwoIndex = nums.indexOf(2);
    let end2 = firstTwoIndex === -1 ? nums.length : firstTwoIndex;
    
    // 第三步：将所有1移到2的前面（或数组末尾）
    moveEnd(nums, 1, end2);
};

/**
 * 将目标数字移到指定范围的末尾
 * @param {number[]} nums - 待处理数组
 * @param {number} target - 要移动到末尾的目标数字
 * @param {number} end - 处理的终点位置
 */
function moveEnd(nums, target, end) {
    let slow = 0;    // 慢指针，指向非target数字要放置的位置
    let fast = 0;    // 快指针，用于遍历数组
    
    // 第一步：将所有非target的数移到数组前面
    for (; fast < end; fast++) {
        if (nums[fast] !== target) {
            nums[slow] = nums[fast];
            slow++;
        }
    }
    
    // 第二步：将target填充到剩余位置
    for (; slow < end; slow++) {
        nums[slow] = target;
    }
}

```
