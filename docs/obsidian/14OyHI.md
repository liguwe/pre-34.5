# LCR.点名：从一个升序数组中找出缺失的数字

> [LCR 173. 点名](https://leetcode.cn/problems/que-shi-de-shu-zi-lcof/)

## 1. 题目

即：从一个升序数组中找出缺失的数字

## 2. 二分法

```javascript
var missingNumber = function(records) {
    let left = 0;
    let right = records.length;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (records[mid] > mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
};
```

## 3. 线性扫描

```javascript
var missingNumber = function(records) {
    for (let i = 0; i < records.length; i++) {
        if (records[i] !== i) {
            return i;
        }
    }
    return records.length;
};

```

## 4. 异或

1. 利用异或运算的特性：
	- `a^a=0，a^0=a`
2. 把 `0~n` 的所有数字和`数组中的所有数字`都异或起来
3. 最后剩下的就是缺失的数字

```javascript
var missingNumber = function(records) {
    let missing = records.length;
    for (let i = 0; i < records.length; i++) {
        missing ^= i ^ records[i];
    }
    return missing;
};
```
