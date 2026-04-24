# 差分数组

`#算法/差分数组`

## 1. 使用场景

我给你输入一个数组 `nums`，然后又要求给区间 `nums[2...]` 全部加 1，再给 `nums[3...]` 全部减 3，再给 `nums[0...]` 全部加 2 

## 2. 原理

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250123-1.png)


如果你想对区间 `nums[i..j]` 的元素全部加 3，
- 那么只需要让 `diff[i] += 3`
- 然后再让 `diff[j+1] -= 3` 即可

```javascript
原始数组：[8, 5, 9, 6, 1]


diff[0] = nums[0] = 8
diff[1] = nums[1] - nums[0] = 5 - 8 = -3
diff[2] = nums[2] - nums[1] = 9 - 5 =  4
diff[3] = nums[3] - nums[2] = 6 - 9 = -3
diff[4] = nums[4] - nums[3] = 1 - 6 = -5

所以 diff = [8, -3, 4, -3, -5]

diff[i] += 3; // diff[1] += 3
diff[j + 1] -= 3; // diff[4] -= 3

       [8, -3+3, 4, -3, -5-3]
			 ↓ 
diff = [8, 0, 4, -3, -8] 

------------------------------------

差分 ===>  还原
result[0] = diff[0] = 8
result[1] = result[0] + diff[1] = 8 + 0 = 8
result[2] = result[1] + diff[2] = 8 + 4 = 12
result[3] = result[2] + diff[3] = 12 + (-3) = 9
result[4] = result[3] + diff[4] = 9 + (-8) = 1

最终结果：[8, 8, 12, 9, 1]

------------------------------------

原始数组：[8,  5,  9,  6, 1]
操作后：  [8,  8, 12,  9, 1]
差值：    [0, +3, +3, +3, 0]


```

### 2.1. 差分数组的优势

1. 只需要修改两个位置就能完成区间操作
2. 无论区间多长，操作的时间复杂度都是 O(1)
3. 多次操作可以在差分数组上累积，最后统一还原

## 3. 实现

```js
// 原始数组
const nums = [8, 2, 6, 3, 1];
// 构造差分数组
function getDiff(nums) {
    const diff = new Array(nums.length).fill(0);
    diff[0] = nums[0];
    for(let i = 1; i < nums.length; i++) {
        diff[i] = nums[i] - nums[i-1];
    }
    return diff;
}
// 从差分数组还原原始数组
function restore(diff) {
    const res = new Array(diff.length).fill(0);
    res[0] = diff[0];
    for(let i = 1; i < diff.length; i++) {
        res[i] = res[i-1] + diff[i];
    }
    return res;
}
const diff = getDiff(nums);
console.log("原始数组：", nums);        // [8, 2, 6, 3, 1]
console.log("差分数组：", diff);        // [8, -6, 4, -3, -2]
console.log("还原数组：", restore(diff)); // [8, 2, 6, 3, 1]
```
