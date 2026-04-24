# 反转字符串中的元音字母

`#leetcode`  `#算法/双指针`  
## 题目及理解

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/e0cc283efc425dcc42f1db528e1cf695.png)

## 解题思路

![image.png|544](https://832-1310531898.cos.ap-beijing.myqcloud.com/c3bf82b3e851ebcc70cdaeda2ff02021.png)

## 代码实现

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function (s) {
  // 元音字母
  const vowels = "aeiouAEIOU";
  // 将字符串转换为数组
  const arr = s.split("");
  // 左指针
  let left = 0;
  // 右指针
  let right = arr.length - 1;
  // 当左指针小于右指针时，执行循环
  while (left < right) {
    // 当左指针对应的字符不是元音字母时，左指针右移
    while (left < right && vowels.indexOf(arr[left]) === -1) {
      left++;
    }
    // 当右指针对应的字符不是元音字母时，右指针左移
    while (left < right && vowels.indexOf(arr[right]) === -1) {
      right--;
    }
    // 这时，左指针对应的字符是元音字母，右指针对应的字符也是元音字母
    // 交换左右指针对应的字符
    [arr[left], arr[right]] = [arr[right], arr[left]];
    // 左指针右移
    left++;
    // 右指针左移
    right--;
  }
  return arr.join("");
};

```

## 错误记录

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/10e8be78b37b1a4031f14dae7dcab7e5.png)
