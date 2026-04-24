# 简化路径

`#栈` `#leetcode` 

> [71. 简化路径](https://leetcode.cn/problems/simplify-path/)

## 思路

- 使用栈：
	- 为 `.` 时 `continue`
	- 为 `..` 时 `pop`
- 注意
	- 栈使用变量简写：`s`
	- `.split("/")` 时，不会包含 `/`

## 代码

```javascript hl:11
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function (path) {
  let arr = path.split("/");
  console.log("arr:", arr);
  let s = [];
  for (let item of arr) {
    if (item === ".") {
      continue;
    } else if (item === "..") {
      s.pop();
    } else if (item) {
      s.push(item);
    }
  }
  return `/${s.join("/")}`;
};

```

## 技巧：记得 console.log 帮助很快写出代码

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250107-1.png)
