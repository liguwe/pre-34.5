# 压缩字符串：b12 => b,1,2 代替

`#算法/双指针`  `#leetcode`  

## 题目及理解

![image.png|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/b269dbb6ca9b010349e814b8bfbfb370.png)

## 解题思路

- 快慢指针
	- `write` 代表`原地`写入
		- write 需要正常写入字母 + 出现的次数
	- `read` 代表往后面`读`

## 代码实现

```javascript
/**
 * @param {character[]} chars
 * @return {number}
 */
var compress = function (chars) {
  // 快慢指针,都从0开始
  // write 为慢指针，read 为快指针
  let write = 0;
  let read = 0;
  let n = chars.length;
  // 快指针遍历数组
  while (read < n) {
    // 当前字符
    let c = chars[read];
    // 计数器，用于记录当前字符出现的次数
    let count = 0;
    // 当快指针对应的元素等于快指针对应的元素时，快指针向后移动一位，计数器加一
    while (read < n && chars[read] === c) {
      read++;
      count++;
    }
    // 将当前字符及其出现次数写入数组
    chars[write++] = c;
    // 仅在出现次数大于 1 时，才将次数写入数组
    if (count > 1) {
      // String(count).split("") 将数字转换为字符串，再转换为字符数组,比如 b12 -> ['b','1', '2']
      for (let i of String(count).split("")) {
        chars[write++] = i;
      }
    }
  }
  return write;
};

```

> - 严格说还需要把数组后面的元素干掉
> - `String(count).split("")` 用于处理 `count = 12` 这种场景

### 复杂度分析

## 错误记录
