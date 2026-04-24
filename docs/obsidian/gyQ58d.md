# 买卖股票的最佳时机

`#leetcode`   

## 题目及理解

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241118.png)

> [!danger]
> 注意：**只能买卖一次**

## 解题思路

### 思路一

```javascript
/**  
 * @description 解题思路  
 * ① base case: 如果 prices 为空，返回 0  
 * ② 初始化买入价格 buy 为 prices[0]，初始化利润 profit 为 0  
 * ③ 遍历 prices  
 *    1、如果当前价格比买入价格低，就更新买入价格  
 *    2、否则，更新利润  
 * ④ 返回利润  
 *     
 * */
```

#### 代码实现

```javascript
var maxProfit = function(prices) {  
    // base case  
    if (prices.length === 0) {  
        return 0;  
    }  
    // 买入价格  
    let buy = prices[0];  
    // 利润  
    let profit = 0;  
    // 遍历  
    for (let i = 1; i < prices.length; i++) {  
        // 如果当前价格比买入价格低，就更新买入价格  
        if (prices[i] < buy) {  
            buy = prices[i];  
        } else {  
            // 否则，计算利润  
            profit = Math.max(profit, prices[i] - buy);  
        }  
    }  
    return profit;  
};
```

#### 复杂度分析

- 时间复杂度是 `O(n)`，其中 `n` 是价格数组的长度，因为我们只遍历了数组一次。
- 空间复杂度是 `O(1)`，因为我们只使用了`两个额外`的变量，不管输入规模如何，额外空间都是常数级的

### 思路二

买卖股票通用框架，见后文**股票类型**的题目

## 错误记录
