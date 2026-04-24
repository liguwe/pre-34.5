# 字符串乘法计算

|LeetCode|力扣|难度|
|---|---|---|
|[43. Multiply Strings](https://leetcode.com/problems/multiply-strings/)|[43. 字符串相乘](https://leetcode.cn/problems/multiply-strings/)|🟠|
## 题目

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241119-4.png)


## 思路：模拟手算

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241119-5.png)

```css
    1 2 3
  ×   4 5
---------
      1 5     (3 × 5)
    1 0       (2 × 5)
  5           (1 × 5)
    1 2       (3 × 4)
  8           (2 × 4)
4             (1 × 4)
---------
5 5 3 5
```

- 先计算 `3×5=15`，`1` 放在`result[3]`，`5` 放在`result[4]`
- 再计算 `2x5 = 10` 
- ....


`num1[i]` 和 `num2[j]` 的乘积对应的就是 `res[i+j]` 和 `res[i+j+1]`，如下图

- `3 * 4` 等 `12` 
	- `res[2] = 1` 
	-  `res[3] = 2`


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241119-6.png)

## 代码

```javascript
var multiply = function(num1, num2) {
    let m = num1.length, n = num2.length;
    // 结果最多为 m + n 位数
    let res = new Array(m + n).fill(0);
    // 从个位数开始逐位相乘
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            let mul = (num1[i] - '0') * (num2[j] - '0');
            // 乘积在 res 对应的索引位置
            let p1 = i + j, p2 = i + j + 1;
            // 叠加到 res 上
            let sum = mul + res[p2];
            res[p2] = sum % 10;
            res[p1] += Math.floor(sum / 10);
        }
    }
    // 结果前缀可能存的 0（未使用的位）
    let i = 0;
    while (i < res.length && res[i] == 0)
        i++;
    // 将计算结果转化成字符串
    let str = "";
    for (; i < res.length; i++)
        str += res[i];
    
    return str.length == 0 ? "0" : str;
}
```
