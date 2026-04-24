# 三数之和

`#leetcode`   `#2024/07/31`  `#双指针` `#算法/双指针`   `#算法/Nsum` 

## 1. 题目及理解

![image.png600600|476](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407310756023.png?imageSlim)

## 2. 解题思路

### 2.1. 先看二数之和

思路：先对 `nums` 排序，然后使用`左右双指针技巧`，从两端相向而行即可，如下代码：

```javascript
var twoSum = function (nums, target) {  
    // ① 先排序  
    nums.sort((a, b) => a - b);  
    let res = [];  
      
    // ② 定义左右指针，分别指向数组的头和尾  
    let lo = 0, hi = nums.length - 1;  
      
    // ③ 循环条件，从两端向中间靠拢  
    while (lo < hi) {  
        let sum = nums[lo] + nums[hi];  
        // 根据 sum 和 target 的比较，移动左右指针  
        if (sum < target) {  
            lo++;  
        } else if (sum > target) {  
            hi--;  
        } else {  
            res.push([nums[lo], nums[hi]]);  
            lo++;  
            hi--;  
        }  
    }  
    return res;  
};
```

`nums` 中可能有多对儿元素之和都等于 `target`，请你的算法返回所有和为 `target` 的元素对儿，其中不能出现重复，上面代码有点问题，比如：

![image.png600|432](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407310806671.png?imageSlim)

所以我们遍历时需要 `跳过相同的元素`，如下代码：

```javascript
/**  
 * @param {number[]} nums  
 * @param {number} target  
 * @return {number[][]}  
 */  
var twoSumTarget = function (nums, target) {  
    // nums 数组必须有序  
    nums.sort((a, b) => a - b);  
    let lo = 0, hi = nums.length - 1;  
    let res = [];  
    while (lo < hi) {  
        let sum = nums[lo] + nums[hi];  
        let left = nums[lo];  
        let right = nums[hi];  
        // 根据 sum 和 target 的比较，移动左右指针  
        if (sum < target) {  
            // ① 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] == left) lo++;  
        } else if (sum > target) {  
            // ② 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] == right) hi--;  
        } else {  
            res.push([left, right]);  
            // ③ 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] == left) lo++;  
            // ④ 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] == right) hi--;  
        }  
    }  
    return res;  
};
```

### 2.2. 三数之和等 `0`

#### 2.2.1.   泛化：`target` 不为 `0` 呢？

```javascript
/**  
 * @param {number[]} nums  
 * @return {number[][]}  
 */  
var threeSum = function (nums) {  
    // 求和为 0 的三元组  
    return threeSumTarget(nums, 0);  
};

/**  
 * @param {number[]} nums  
 * @param {number} target  
 * @return {number[][]}  
 */  
var threeSumTarget = function (nums, target) {
	// ....
}
```

#### 2.2.2. `threeSumTarget` 思路

-  从 `nums` 中找  `[a,b,c] `  使得  `a + b + c = target` 
	- 遍历 `nums`
		-  `a = nums[i]` 时
			- 这个时候需要从 `nums` 中的下标 `i` 开始找两数之和为 `target - a`
				- 问题转化成两数之和  `threeSumTarget`

#### 2.2.3. 问题转成两数之和：`threeSumTarget`

```javascript
/**  
 * @param {number[]} nums  
 * @param {number} target  
 * @param {number} start 从 start 开始找  
 * @return {number[][]}  
 */  
var twoSumTarget = function (nums, start, target) {  
    // nums 数组必须有序  
    nums.sort((a, b) => a - b);  
    let lo = start;  
    let hi = nums.length - 1;  
    let res = [];  
    while (lo < hi) {  
        let sum = nums[lo] + nums[hi];  
        let left = nums[lo];  
        let right = nums[hi];  
        // 根据 sum 和 target 的比较，移动左右指针  
        if (sum < target) {  
            // ① 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] === left) lo++;  
        } else if (sum > target) {  
            // ② 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] === right) hi--;  
        } else {  
            res.push([left, right]);  
            // ③ 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] === left) lo++;  
            // ④ 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] === right) hi--;  
        }  
    } 
    return res;  
};
```

## 3. 代码实现

最终代码如下：

```javascript
/**  
 * @param {number[]} nums  
 * @return {number[][]}  
 */  
var threeSum = function (nums) {  
    // 求和为 0 的三元组  
    return threeSumTarget(nums, 0);  
};  
  
  
/**  
 * @param {number[]} nums  
 * @param {number} target  
 * @return {number[][]}  
 */  
var threeSumTarget = function (nums, target) {  
    // :::: ① 数组先排个序  
    nums.sort(function (a, b) {  
        return a - b  
    });  
    var n = nums.length;  
    var res = [];  
  
    // ::::③ 遍历数组，a + b + c = target 
    //        其中 a = nums[i] ，b + c =  target - nums[i]  
    for (var i = 0; i < n; i++) {  
        const a = nums[i];  
        const twoTarget = target - a;  
        // ::::③ 递归计算 b + c = target - nums[i] 的二元组  
        var twoSumArr = twoSumTarget(nums, i + 1, twoTarget);  
  
        // ::::④ 遍历二元组，将 nums[i] 加上就是结果三元组  
        // 如果存在满足条件的二元组，再加上 nums[i] 就是结果三元组  
        for (var j = 0; j < twoSumArr.length; j++) {  
            var tuple = twoSumArr[j];  
            tuple.push(nums[i]);  
            res.push(tuple);  
        }  
        // ::::⑤ 跳过后面，出现的数字重复的情况，否则会出现重复结果  
        // 跳过第一个数字重复的情况，否则会出现重复结果  
        while (i < n - 1 && nums[i] === nums[i + 1]) i++;  
    }  
  
    return res;  
}  
  
/**  
 * @param {number[]} nums  
 * @param {number} target  
 * @param {number} start 从 start 开始找  
 * @return {number[][]}  
 */  
var twoSumTarget = function (nums, start, target) {  
    // nums 数组必须有序  
    nums.sort((a, b) => a - b);  
    let lo = start;  
    let hi = nums.length - 1;  
    let res = [];  
    while (lo < hi) {  
        let sum = nums[lo] + nums[hi];  
        let left = nums[lo];  
        let right = nums[hi];  
        // 根据 sum 和 target 的比较，移动左右指针  
        if (sum < target) {  
            // ① 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] === left) lo++;  
        } else if (sum > target) {  
            // ② 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] === right) hi--;  
        } else {  
            res.push([left, right]);  
            // ③ 左边碰到相同的元素，一直向右移动，直到不相同的元素位置  
            while (lo < hi && nums[lo] === left) lo++;  
            // ④ 右边碰到相同的元素，一直向左移动，直到不相同的元素位置  
            while (lo < hi && nums[hi] === right) hi--;  
        }  
    }  
    return res;  
};
```

### 3.1. 复杂度分析

- 时间复杂度上，为 `O(n^2)`
	- 主函数 threeSum:
        -  调用 threeSumTarget，复杂度与 threeSumTarget 相同。
    - threeSumTarget 函数:
        - 排序:  `O(n log n)`
        - 外层循环： `O(n)`
            - 每次循环中调用 `twoSumTarget: O(n)`
        - 总体复杂度： `O(n^2)`
    - twoSumTarget 函数:
        - 双指针遍历: `O(n)`
    - 综合起来，整个算法的时间复杂度是 `O(n^2)`。
- 空间复杂度在最坏情况下可能达到 `O(n^2)`，主要是由于存储结果所需的空间
	- 排序可能需要 O(log n) 的空间（取决于排序算法）。
	- 结果数组 res 的大小取决于**满足条件的三元组数量**，最坏情况下可能是 O(n^2)。
	- twoSumTarget 函数中的临时结果数组也可能在最坏情况下达到 O(n)。
