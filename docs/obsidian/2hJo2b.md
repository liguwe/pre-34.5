# 最长公共前缀

`#算法/二维数组` 


> [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/)

## 1. 思路

- **不用求最大字符串长度**
	- 因为公共前缀最大长度 **一定小于等于** 任意一个字符串的长度
- 所以，完全转换为**二维数组的遍历**
	- 但是：
		- 先遍历**列**
		- 再遍历**行**
- 同样的，三个**变量&指针**
	- m
	- n
	- **p**
		- 比较每个字符串，如果相同就 `p++`
- 注意点：
	- `let s = strs[0][j];` 用它比较是否相同
	- 需要是否超出字符串长度
		- 然后直接 return 

>  for 循环里，记得应该 return 时，就 return 吧，避免无效遍历


> [!danger]
> 注意点：先列后行，但还是使用 `i 对应 行` 和 `j 对应 列`

## 2. 代码

```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) {
    return "";
  }
  if (strs.length === 1) {
    return strs[0];
  }

  let p = 0;
  let m = strs.length;
  let n = strs[0].length || 0;

  for (let j = 0; j < n; j++) {
    let isSame = true;
    let s = strs[0][j];
    for (let i = 0; i < m; i++) {
      // 检查是否超出字符串长度
      if (j >= strs[i].length) {
        return strs[0].slice(0, p);
      }
      if (strs[i][j] !== s) {
        isSame = false;
        return strs[0].slice(0, p);
      }
    }
    if (isSame) {
      p++;
    }
  }

  return strs[0].slice(0, p);
};

```
