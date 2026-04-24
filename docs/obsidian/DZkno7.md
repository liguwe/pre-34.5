# 验证回文串

> [125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)


- 验证回文串
	- 关键点：
		- `s = s.toLowerCase().replace(/[^a-z0-9]/g,"")`
			- **toLowerCase**
	- `while (left < right) {`


```javascript hl:6,8
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // 原代码
    // s = s.toLowerCase().replace(/\W+/g,"");
    // 修正后的代码
    s = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    let left = 0;
    let right = s.length - 1;
    
    while(left < right) {
        if(s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
};
```
