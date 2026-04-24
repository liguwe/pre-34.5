# 连续差相同的数字

`#算法/回溯算法` 

> [967. 连续差相同的数字](https://leetcode.cn/problems/numbers-with-same-consecutive-differences/)

## 题目

- 长度为 `n` 
- 满足其`每两个连续位上的数字之间的差`的绝对值为 `k` 的非负整数

比如：
- 输入：n = 3, k = 7
- 输出：`[181,292,707,818,929]`

## 代码

- 注意第 7 行，没必要再最后 map 再转成数字
- 16 行的 `-100` ，换成`非 0-9` 的数字都行

```javascript hl:13,15,7
var numsSameConsecDiff = function (n, k) {
  let res = [];
  function backtrack(track, index) {
    // 当数字长度达到n时
    if (index === n) {
      // 将数组转换为数字并添加到结果中
      res.push(parseInt(track.join("")));
      return;
    }

    for (let i = 0; i <= 9; i++) {
      // 第一个数字不能是0
      if (index === 0 && i === 0) continue;

      // 获取前一个数字
      let prev = index > 0 ? track[index - 1] : -100;
      // 如果是第一个数字，或者与前一个数字差的绝对值等于k
      if (index === 0 || Math.abs(i - prev) === k) {
        track.push(i);
        backtrack(track, index + 1);
        track.pop();
      }
    }
  }

  backtrack([], 0);
  return res;
};

```
