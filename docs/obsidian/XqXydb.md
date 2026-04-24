# 相等行列对

`#leetcode`  `#算法/哈希` 

## 1. 题目及理解

![image.png600](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407260948859.png?imageSlim)

## 2. 解题思路
 
- 第一步：创建一个`哈希表（Map）`来存储每一行的信息。 
- 第二步：遍历矩阵的**每一行**
	- 将行转换为一个`唯一的字符串`表示（例如，用逗号连接元素）。
	- 在哈希表中记录这个字符串表示及其出现次数。 
- 第三步：遍历矩阵的**每一列**，重点逻辑都在这里面
	- 同样将列转换为字符串表示。
	- 检查这个字符串是否在哈希表中存在。
		- 如果存在，将`计数器`增加哈希表中记录的出现次数。 
- 最后：返回最终的计数器值。

## 3. 代码实现

```javascript
/**  
 * @param {number[][]} grid  n x n grid  
 * @return {number}  
 */  
var equalPairs = function (grid) {  
    // 结果  
    let res = 0;  
    const len = grid.length;  
    // 处理行  
    // 用于记录每一行出现的次数, key 为行字符串，value 为出现次数  
    const rowMap = new Map();  
    for (let i = 0; i < len; i++) {  
        const rowStr = grid[i].join(',');  
        rowMap.set(rowStr, (rowMap.get(rowStr) || 0) + 1);  
    }  
    // 处理列，判断是否在行中出现过  
    for (let i = 0; i < len; i++) {  
        let cols = [];  
        for (let j = 0; j < len; j++) {  
            cols.push(grid[j][i]);  
        }  
        let colStr = cols.join(',');  
        // 判断是否在行中出现过  
        if (rowMap.has(colStr)) {  
            // ::::这里不能只是+1，出现多少次就得加多少次  
            res += rowMap.get(colStr);  
        }  
    }  
    return res;  
};
```

### 3.1. 复杂度分析

- **时间复杂度**：`O(n^2)`
	- 很简单，看处理列里面，两个 for 循环
- **空间复杂度**：`O(n^2)`
	- 虽然 `cols` 看起来就是一个数组，但是每次都会处理  `cols.push(grid[j][i]);` 所以，复杂度也是 `O(n^2)`

## 4. 错误记录
