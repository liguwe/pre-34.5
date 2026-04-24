# 确定两个字符串是否接近

`#leetcode` 

## 题目及理解

![image.png600|550](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407260859792.png?imageSlim)

## 解题思路

需要满足以下三个条件：

- 包含的字符集需要相同
- **每种字符出现的频率排序后相同**
	- 如何理解呢？
		- `word1 = "cabbba" `  对应的频率  `[ 2, 3, 1 , 0, 0, ..., 0]`
		- `word2 = "abbccc"`    对应的频率  `[1, 2, 3, 0, 0, ..., 0]`

## 代码实现

```javascript
/**  
 * @param {string} word1  
 * @param {string} word2  
 * @return {boolean}  
 */  
var closeStrings = function (word1, word2) {  
    // 两个字符串的长度不相等，直接返回 false  
 if (word1.length !== word2.length) {  
    return false;  
  }  
  
  // 用于记录两个字符串中字符出现的次数  
  const arr1 = new Array(26).fill(0);  
  const arr2 = new Array(26).fill(0);  
  
  // 遍历两个字符串，记录字符出现的次数  
  for (let i = 0; i < word1.length; i++) {  
    arr1[word1.charCodeAt(i) - 97]++;  
  }  
  for (let i = 0; i < word2.length; i++) {  
    arr2[word2.charCodeAt(i) - 97]++;  
  }  
  
  // 包含相同字符  
  // 转成数组，排序，转成字符串，去重  
  const str1 = arr1.sort().join("");  
  const str2 = arr2.sort().join("");  
  
  return str1 === str2;  
};
```

> [!info]
> `word1.charCodeAt(i) - 97` 这个平时不怎么常用，需要能够写出来！

## 错误日志

> [!danger]
> 题意理解有误，一定是需要保证`互相更换相同的次数`后能够`互相得到`

```javascript
/**
 * @param {string} word1
 * @param {string} word2
 * @return {boolean}
 */
var closeStrings = function (word1, word2) {
  // 两个字符串的长度不相等，直接返回 false
  if (word1.length !== word2.length) {
    return false;
  }
  // 包含相同字符
  // 转成数组，排序，转成字符串，去重
  const str1 = word1.split("").sort().join("");
  const str2 = word2.split("").sort().join("");
  return str1 === str2;
};

```
