# 丢失的数字

> [268. 丢失的数字](https://leetcode.cn/problems/missing-number/)

## 总结

- 新补索引 `n`
- 序号与数组元素`异或运算`即可

```javascript
var missingNumber = function (nums) {
    const n = nums.length;
    let res = 0;
    // 先和新补的索引异或一下
    res ^= n;
    // 和其他的元素、索引做异或
    for (let i = 0; i < n; i++) {
        res ^= i ^ nums[i];
    }
    return res;
};
```

## 题目

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/0f220990728ea42b6b9f7c1291f438be.png)

## 常规解法

- `排序 + 遍历`：很容易找到缺失的元素
- `hashSet + 遍历` ：用一个 `HashSet` 把数组里出现的数字都储存下来，再遍历` [0,n] `之间的数字，去 `HashSet` 中查询是否存在

## 利用数学公式

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/92f9b8e0ff2e4f6be00b95011a2173b9.png)

## 位运算：使用`异或`运算

```typescript
或运算满足交换律和结合律
2 ^ 3 ^ 2 = 3 ^ (2 ^ 2) = 3 ^ 0 = 3	
```

以 `nums = [0,3,1,4]` 为例：

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/51f8067f35b21ba018d0c33887880d74.png)

如何找这个`落单的数字`呢，只要把`所有的元素和索引做异或运算`，成对儿的数字都会`消为 0`，只有这个落单的元素会剩下，也就达到了我们的目的

> 由于异或运算满足交换律和结合律，所以总是能把成对儿的数字消去，留下缺失的那个元素。

```javascript
var missingNumber = function(nums) {
    const n = nums.length;
    let res = 0;
    // 先和新补的索引异或一下
    res ^= n;
    // 和其他的元素、索引做异或
    for (let i = 0; i < n; i++)
        res ^= i ^ nums[i];
    return res;
}
```
