# 种花问题

`#算法` `#leetcode`  `#2024/07/28` 

## 1. 题目

![image.png|648](https://832-1310531898.cos.ap-beijing.myqcloud.com/3f1ea7b209fa83f23540a2c340ecfa50.png)

### 1.1. 重点

- 转成规则：即上图中红色文字部分

## 2. 思路

1. `遍历数组`：从头到尾遍 `flowerbed` 数组。
2. `检查位`：如果当前位置是 `0`，并且其两侧（如果存在的话）也是 `0` 或 `1`，则表示这里可以种花。
3. 种花并调整`**计数器**`：每种一朵，减少 `n` 的值。当 `n` 减到 `0` 以下时，表示可以种下 `n` 朵花，返回 `true`。
4. `最终检查`：遍历完数组后，检查 `n` 是否小或等于 `0`。

## 3. 代码实现

```javascript
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function (flowerbed, n) {
  for (let i = 0; i < flowerbed.length; i++) {
    // 检查当前位置及左、右位置是否可以种花，需要满足以下条件：
    // 条件①： 当前元素为0
    if (flowerbed[i] === 0) {
      // 条件②： 第一个元素 或者 前一个元素为0时
      if (i === 0 || flowerbed[i - 1] === 0) {
        // 条件③： 最后一个元素 或者 后一个元素为0时
        if (i === flowerbed.length - 1 || flowerbed[i + 1] === 0) {
          flowerbed[i] = 1;
          n--;
        }
      }
    }
  }
  return n <= 0;
};
```

> - 上面的写法，只是为了表达递进的关系，其实可以不这么写！
> - 注意每个条件里面是`或者`的关系

## 4. 参考

- [https://leetcode.cn/problems/can-place-flowers/submissions/548039007/?envType=study-plan-v2&envId=leetcode-75](https://leetcode.cn/problems/can-place-flowers/submissions/548039007/?envType=study-plan-v2&envId=leetcode-75)
