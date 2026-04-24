# 反转字符串中的单词

`#2024/07/28` `#leetcode` `#算法/反转` 

## 题目及理解

![image.png|696](https://832-1310531898.cos.ap-beijing.myqcloud.com/08a29ef8ddbb835cf3d278a38cfa500a.png)

## 解题思路

![image.png|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/8b5f7205a78d8eedaed7e17010c7aff6.png)

## 代码实现

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  // 1、去除首尾空格，并将多个空格替换为单个空格
  s = s.trim().replace(/\s+/g, " ");
  // 2、将字符串反转
  s = s.split("").reverse().join("");
  // 3、将字符串按空格分割为数组
  const words = s.split(" ");
  // 4、遍历数组，将每个单词反转
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].split("").reverse().join("");
  }
  // 5、将反转后的单词数组重新组合成字符串
  return words.join(" ");
};
```

> - 如果不能使用 `Array.reverse`，则可以使用`双指针`自己写一个`辅助函数`
