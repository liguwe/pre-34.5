# 只出现一次的数字

`#算法/位运算` 


> [136. 只出现一次的数字](https://leetcode.cn/problems/single-number/)

## 1. 总结

```javascript
var singleNumber = function (nums) {
    let res = 0;
    for (let num of nums) {
        res ^= num;
    }
    return res;
};
```

## 2. 题目

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/90bcb8d27786de417a6b258383b69831.png)

## 3. `a ^ a = 0 ; a ^ 0 = a` 的运用

`异或运算`的性质是需要我们牢记的：
- 一个数和它本身做`异或`运算结果为 `0`，即` a ^ a = 0`；
- 一个数和 0 做`异或`运算的结果为它`本身`，即 `a ^ 0 = a`



```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let res = 0;
    nums.forEach((num)=>{
        console.log(res,num);
        res = res ^ num; 
    
    })
    return res;
};


singleNumber([4,1,2,2,1,4,5])
0 4
4 1
5 2
7 2
5 1
4 4
0 5
```
