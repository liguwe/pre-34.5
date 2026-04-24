# 表现良好的最长时间段

`#算法/前缀和` 

>  [1124. 表现良好的最长时间段](https://leetcode.cn/problems/longest-well-performing-interval/)


 `hours[i]` 以 `8` 作为分界线
 - 把所有大于 8 的元素视为 `+1`
 - 把所有小于 8 的元素视为 `-1`，
 
 这样一来，这道题就改造成了：计算**数组中元素和大于 0 的子数组的最大长度**

转变成 寻找一个 `j` 使得 `preSum[i] - preSum[j] > 0` 了

要点：
- ① 构建前缀和
- ② 构建 mapping，仅仅存储前缀和第一次出现的位置，因为这里求的是【最长】
- ③ 找到最长良好时间段
	- `preSum[i]` 为正，说明 `hours[0..i-1]` 都是「表现良好的时间段」
	- `preSum[i]` 为负数
		- 因为相邻的元素差的绝对值为 `1`
			- 所以找 `只要找到 preSum[j] == preSum[i] - 1` 的位置，然后 `i - j` 就是**最长时间段**了

```javascript
var longestWPI = function (hours) {
    let n = hours.length;
    let res = 0;
    // ①  构建前缀和
    let preSum = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        preSum[i] = preSum[i - 1] + (hours[i - 1] > 8 ? 1 : -1);
    }
    // ② 构建 mapping，仅仅存储前缀和第一次出现的位置，因为这里求的是【最长】
    let mapping = new Map();
    for (let i = 0; i < n + 1; i++) {
        let val = preSum[i];
        if (!mapping.has(val)) {
            mapping.set(val, i);
        }
    }
    // ③ 找到最长良好时间端
    for (let i = 0; i < n + 1; i++) {
        let val = preSum[i];
        // preSum[i] 为正，说明 hours[0..i-1] 都是「表现良好的时间段」
        if (val > 0) {
            res = Math.max(res, i);
            //  preSum[i] 为负，需要寻找一个 j 使得 preSum[i] - preSum[j] > 0
            //  preSum 数组每两个相邻元素的差的绝对值都是 1 ，且 j 应该尽可能小
            // 只要找到 preSum[j] == preSum[i] - 1 的位置
            // nums[j+1..i] 就是一个「表现良好的时间段」
        } else {
            if (mapping.has(val - 1)) {
                let j = mapping.get(val - 1);
                res = Math.max(res, i - j);
            }
        }
    }
    return res;
};
```
