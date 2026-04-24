# 打开转盘锁

>  [752. 打开转盘锁](https://leetcode.cn/problems/open-the-lock/)


## 总结 

- 本质还是 `BFS`
- 向上拨动一个 `plusOne`
- 向下拨动一个 `minusOne`

```javascript
/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
var openLock = function (deadends, target) {
  let start = "0000";
  let q = [start];
  let step = 0;
  let visited = { start: true };
  while (q.length) {
    let size = q.length;
    for (let i = 0; i < size; i++) {
      let cur = q.shift();
      if (deadends.includes(cur)) continue;
      if (cur === target) return step;
      for (let j = 0; j < 4; j++) {
        let up = plusOne(cur, j);
        if (!visited[up]) {
          q.push(up);
          visited[up] = true;
        }
        let down = minusOne(cur, j);
        if (!visited[down]) {
          q.push(down);
          visited[down] = true;
        }
      }
    }
    step++;
  }
  return -1;
};

function plusOne(s, j) {
  let str = Array.from(s);
  str[j] = str[j] === "9" ? "0" : Number(str[j]) + 1 + "";
  return str.join("");
}
function minusOne(s, j) {
  let str = Array.from(s);
  str[j] = str[j] === "0" ? "9" : Number(str[j]) - 1 + "";
  return str.join("");
}

```


## 分析：画图


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250112-3.png)
