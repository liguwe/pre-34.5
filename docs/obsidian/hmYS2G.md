# 字符串的排列

`#leetcode` `#算法/滑动窗口` `#算法/左右指针`  `#R2` 

>  [567. 字符串的排列](https://leetcode.cn/problems/permutation-in-string/)

## 1. 总结

- 定义 **6 个变量**
	- left right 
	- win need
	- `s1_len` 和 `s2_len`
- 收缩条件是：
	- **窗口的大小 与 s1 的长度比较**
- `win[c] === 0` 时最好 `delete` ，不然会导致下面遍历函数出问题
- 外层 `while` 循环里，最后添加这一行
	- `right - left === s1_len && fn(win, need)`

## 2. 解释

 `s2` 中是否存在一个**子串**，包含 `s1` 中**所有字符且不包含其他字符**

```javascript hl:26
var checkInclusion = function (s1, s2) {
  let left = 0;
  let right = 0;
  let win = {};
  let need = {};
  let s1_len = s1.length;
  let s2_len = s2.length;

  for (let item of s1) {
    need[item] = (need[item] || 0) + 1;
  }

  while (right < s2_len) {
    let c = s2[right];
    win[c] = (win[c] || 0) + 1;
    right++;
    // 说明需要收缩了
    while (right - left > s1_len) {
      if (fn(win, need)) {
        return true;
      }
      let c = s2[left];
      win[c] = win[c] - 1;
      // 应该添加
      if (win[c] === 0) {
        delete win[c];
      }
      left++;
    }
    // 当窗口大小等于 s1 长度时才检查是否匹配
    if (right - left === s1_len && fn(win, need)) {
      return true;
    }
  }

  return false;

  function fn(win, need) {
    for (k of Object.keys(need)) {
      if (win[k] !== need[k]) {
        return false;
      }
    }
    for (k of Object.keys(win)) {
      if (win[k] !== need[k]) {
        return false;
      }
    }
    return true;
  }

  return res;
};

```
