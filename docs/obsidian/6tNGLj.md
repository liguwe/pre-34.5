# 反转字符串

>  [344. 反转字符串](https://leetcode.cn/problems/reverse-string/)


- 原地反转字符串
	- `while (left < right) {`
	- **相向而行 →  遇到位置**

```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    let temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }

  return s;
};

```
