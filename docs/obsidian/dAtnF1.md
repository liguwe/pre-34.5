# 小行星碰撞

`#算法/栈` `#leetcode` 

## 题目及理解

![image.png600|744](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407271746254.png?imageSlim)

## 解题思路

1. 初始化一个`空栈`，用于存储当前状态的“小行星”。
2. 遍历输入的小行星数组：
    - ① 定义一个变量`destroyed` ，标识当前元素是否被摧毁
    - ② **while循环**：如果栈不为空，且当前元素为负数 `向左移动`，且栈顶元素为正数，向右移动
		- 如果栈顶小行星更小，则`栈顶小行星`被摧毁，`continue` while 遍历
		- 如果栈顶小行星更大，则`当前小行星`被摧毁，`break` while 遍历
		- 若两者质量相等，则它们相互抵消，`都被摧毁`，`break` while 遍历
    - ③ 如果当前元素`没有被摧毁`，入栈
3. 最后 `res`

>  栈顶元素被销毁，代表 `出栈`
>  当前元素被销毁，代表 `不入栈`

## 代码实现

```javascript
/**
 * @param {number[]} items
 * @return {number[]}
 */
var itemCollision = function (items) {
  const stack = [];

  // 遍历数组
  for (let item of items) {
    // ① 定义一个变量`destroyed` ，标识当前元素是否被摧毁
    let destroyed = false;

    // 如果栈不为空，且当前元素为负数，且栈顶元素为正数
    while (stack.length > 0 && item < 0 && stack[stack.length - 1] > 0) {
      let top = stack[stack.length - 1];
      // 如果栈顶元素的绝对值小于当前元素的绝对值，则栈顶元素被销毁
      if (top < -item) {
        stack.pop();
        continue;
      }
      // 如果栈顶元素的绝对值大于当前元素的绝对值，则当前元素被销毁
      else if (top > -item) {
        destroyed = true;
        break;
      }
      // 如果栈顶元素的绝对值等于当前元素的绝对值，则栈顶元素和当前元素都被销毁
      else if (top === -item) {
        stack.pop();
        destroyed = true;
        break;
      }
    }

    // 如果当前元素没有被销毁，则入栈
    if (!destroyed) {
      stack.push(item);
    }
  }

  return stack;
};

```

### 复杂度分析

#### 时间复杂度

遍历数组是 `O(n)`，而内部的 `while` 循环在整个算法过程中也为 `O(2)`（每个元素最多只会进出栈一次），所以整体时间复杂度为 `O(n)`

#### 空间复杂度

1. **栈的使用**：
    - 由于算法使用了一个栈 `stack` 来存储未被摧毁的元素。
    - 最坏情况下，所有元素都不会相互碰撞（例如，全为正数或全为负数），则栈的大小为 `n`。
2. **额外空间**：
    - 除了栈之外，没有使用额外的显著空间。

因此，空间复杂度也是 `O(n)`。

## 错误记录

![image.png600](https://832-1310531898.cos.ap-beijing.myqcloud.com/202407280720119.png?imageSlim)
