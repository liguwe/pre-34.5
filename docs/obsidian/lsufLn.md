# 有效的括号：判断括号字符串是否合法的

`#算法/栈`  `#done` 

> [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)

## 1. 方法 1：字符串替换

总结：
- base case：如果字符串长度为奇数，直接返回 false
- while 替换

```javascript
var isValid = function (s) {
  // 如果字符串长度为奇数，直接返回 false
  if (s.length % 2 === 1) return false;

  // 当字符串中还有括号对时，继续替换
  while (s.includes("()") || s.includes("[]") || s.includes("{}")) {
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }

  // 如果最后字符串为空，说明所有括号都匹配成功
  return s === "";
};

```

>  使用栈，要点时间，建议先用这个方法实现

## 2. 方法 2：栈

### 2.1. 总结

-  base case ：必须为偶数
- map：括号映射表
- 遍历字符串时尽量使用 `let item of str` 的方式
- 最终返回值：
	- 判断 stack 是否为空

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  // 如果字符串长度为奇数，直接返回 false
  if (s.length % 2 === 1) return false;

  let stack = [];

  let map = {
    "(": ")",
    "{": "}",
    "[": "]",
  };

  // 判断两个字符串是否匹配成括号
  function fn(c1, c2) {
    return c2 === map[c1];
  }

  for (let item of s) {
    // 入栈
    if (["(", "{", "["].includes(item)) {
      stack.push(item);
      // 出栈
    } else {
      let c = stack.pop();
      if (!fn(c, item)) {
        return false;
      }
    }
  }

  return stack.length === 0;
};

```
