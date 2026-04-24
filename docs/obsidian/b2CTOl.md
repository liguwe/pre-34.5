# 翻转对

>  [493. 翻转对](https://leetcode.cn/problems/reverse-pairs/)



给定一个数组 `nums` ，如果 `i < j` 且 `nums[i] > 2 * nums[j]` 
- 我们就将 `(i, j)` 称作一个**重要翻转对**


- **不能使用滑动窗口**
	- 需要比较的两个元素可能相距很远
	- 不要求元素的连续性，该数组也没有有序性
	- 涉及到的是全局的比较关系
	- 条件 `nums[i] > 2 * nums[j]` 不具有滑动窗口所需的单调性
- **也不能使用双指针**，因为
	1. 双指针通常要求数组有序或者具有某种单调性
	2. 这题需要考虑所有可能的 i,j 对，而且 `nums[i] > 2 * nums[j]` 这个条件不具有单调性


## 思路

同 [315. 计算右侧小于当前元素的个数](/7CT748) ，只不过上一题求的是 `nums[i] > nums[j]`，这里求的是 `nums[i] > 2*nums[j]` 罢了
- 主要区别在于统计条件从 "右侧小于当前元素" 变成了 "右侧元素的两倍小于当前元素"。


所以可以写出代码如下：

```javascript
var reversePairs = function (nums) {
    // 修改：不需要记录索引，只需要记录总数
    let count = 0;
    function sort(nums) {
        let n = nums.length;
        if (n < 2) return nums;
        // 递归划分阶段
        const mid = Math.floor(n / 2);
        let leftArr = nums.slice(0, mid);
        let rightArr = nums.slice(mid);
        let left = sort(leftArr);
        let right = sort(rightArr);
        // 修改：在合并前统计翻转对
        countReversePairs(left, right);
        // 后序位置：合并阶段
        return mergeSortArr(left, right);
    }

    // 新增：统计翻转对的函数
    function countReversePairs(left, right) {
        let i = 0,
            j = 0;
        // 对于左边的每个数，找右边有多少个数满足条件
        while (i < left.length) {
            // 注意这里使用while循环，因为可能有多个右边元素满足条件
            while (j < right.length && left[i] > 2 * right[j]) {
                j++;
            }
            count += j;
            i++;
        }
    }

    function mergeSortArr(arr1, arr2) {
        let m = arr1.length;
        let n = arr2.length;
        let left = 0;
        let right = 0;
        let res = [];

        // 正常合并两个有序数组
        while (left < m && right < n) {
            if (arr1[left] <= arr2[right]) {
                res.push(arr1[left]);
                left++;
            } else {
                res.push(arr2[right]);
                right++;
            }
        }

        // 处理剩余部分
        while (left < m) {
            res.push(arr1[left]);
            left++;
        }

        while (right < n) {
            res.push(arr2[right]);
            right++;
        }
        return res;
    }

    // 开始归并排序，返回翻转对的数量
    sort(nums);
    return count;
};

```
