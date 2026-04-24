# 除自身以外数组的乘积

`#leetcode` `#算法/前缀和` `#算法/前缀积` 

>  [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)


## 1. 总结

```javascript
var productExceptSelf = function (nums) {
    let n = nums.length;

    // 求积一般都初始化为 1，求和一般都初始化为 0
    // ① 构建前缀积
    const prefix = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] * nums[i - 1];
    }

    // ② 构建后缀积
    const suffix = new Array(n).fill(1);
    for (let i = n - 2; i >= 0; i--) { // 倒着遍历
        suffix[i] = suffix[i + 1] * nums[i + 1];
    }

    const res = [];
    // 遍历数组，计算结果，即 【前缀积 * 后缀积】
    for (let i = 0; i < n; i++) {
        res.push(prefix[i] * suffix[i]);
    }
    return res;
};

```


## 2. 题目及理解

> [!danger]
> 上面截图有错别字，**除自己以外的元素的乘积 / 自己**

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/065e86225fe756d152dd30d51cee831b.png)

## 3. 解题思路

- 构造一个 `prefix` 数组记录`「前缀积」`
- 再用一个 `suffix` 记录 **「后缀积」**
- `当前元素之外其他元素的积` = `当前元素的前缀积` * `当前元素的后缀积`

> 不能先所有数的乘积（假如为` sum`），然后遍历每个元素计算 `sum/item` ，不行，见下面错误记录

## 4. 代码实现

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  // 前缀积
  const prefix = new Array(nums.length).fill(1);
  // 后缀积
  const suffix = new Array(nums.length).fill(1);

  // 初始化前缀积
  for (let i = 1; i < nums.length; i++) {
    prefix[i] = prefix[i - 1] * nums[i - 1];
  }

  // 初始化后缀积
  for (let i = nums.length - 2; i >= 0; i--) {
    suffix[i] = suffix[i + 1] * nums[i + 1];
  }

  // 结果
  const result = [];
  // 遍历数组，计算结果，即前缀积 * 后缀积
  for (let i = 0; i < nums.length; i++) {
    result.push(prefix[i] * suffix[i]);
  }
  return result;
};

```

### 4.1. 空间复杂度再压缩？

遍历的时候再动态更新`result` ，如下

```javascript
/**  
 * @param {number[]} nums  
 * @return {number[]}  
 */  
var productExceptSelf = function (nums) {  
  const length = nums.length;  
  const result = new Array(length).fill(1);  

  // 计算前缀积并存储在结果数组中  
  let prefixProduct = 1;  
  for (let i = 0; i < length; i++) {  
    result[i] = prefixProduct;  
    prefixProduct *= nums[i];  
  }  

  // 计算后缀积并更新结果数组  
  let suffixProduct = 1;  
  for (let i = length - 1; i >= 0; i--) {  
    result[i] *= suffixProduct;  
    suffixProduct *= nums[i];  
  }  

  return result;  
};
```

## 5. 错误记录

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  const sum = nums.reduce((acc, cur) => acc * cur, 1);
  return nums.map((num) => sum / num);
};

```
