# 回溯算法解括号生成

`#回溯算法` 

> 力扣第 22 题「[括号生成](https://leetcode.cn/problems/generate-parentheses)」


输入是一个正整数 `n`，输出是 `n` 对儿括号的**所有合法组合**
- `n` 代表 `括号的对数`

比如说，输入 `n=3`，输出为如下 5 个字符串：

```bash
"((()))",
"(()())",
"(())()",
"()(())",
"()()()"
```

代码如下：

```javascript
var generateParenthesis = function (n) {
  let track = "";
  let res = [];

  const backtrack = (left, right) => {
    // 若左括号剩下的多，说明不合法
    if (right < left) return;
    // 数量小于 0 肯定是不合法的
    if (left < 0 || right < 0) return;
    // 当所有括号都恰好用完时，得到一个合法的括号组合
    if (left === 0 && right === 0) {
      res.push(track);
      return;
    }

    // 做选择，尝试放一个左括号
    track += "(";
    backtrack(left - 1, right);
    // 撤销选择
    track = track.slice(0, -1);

    // 做选择，尝试放一个右括号
    track += ")";
    backtrack(left, right - 1);
    // 撤销选择
    track = track.slice(0, -1);
  };

  backtrack(n, n);
  return res;
};

```
