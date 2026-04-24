# 滑动窗口最大值

`#leetcode` `#算法/单调列队` `#算法/滑动窗口` 


> 第 239 题「[滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum)」

## 1. 思路一：直接遍历即可 →  不能通过所有用例

```javascript
var maxSlidingWindow = function (nums, k) {
    let p1 = 0;
    let p2 = k;
    let n = nums.length;
    let res = [];
    for (; p2 <= n; p2++) {
        let max = Math.max(...nums.slice(p1, p2));
        res.push(max);
        p1++;
    }
    return res;
};
```

## 2. 思路二：单调列队

所谓**单调列队**即，列队中元素是**单调递增或者单调递减**的

> 详见 [1. 单调列队算法](/N7kPa8)

## 3. 题目

![cos-blog-832-34-20241012|560](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240811080541.png)

## 4. 使用单调列队来解

![cos-blog-832-34-20241012|552](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240811101243.png)

- 解题思路
	- ① 初始化一个单调队列，用于维护**移动窗口**
	- ② 遍历数组
		- 先填满窗口，每次 `push` 时，window 都会维护一个单调递减队列
		- 填满了，每次先后移动一次，需要做以下事情
			- window.push(item)
			- res.push(window.max())
			- 删除对首元素，因为**需要保证 window 的长度为 k**

```javascript hl:55,42
// 单调递增队列的标准 API
class MonotonicQueue {
  constructor() {
    // 维护其中的元素自尾部到头部单调递增
    this.maxq = [];
  }
  // 在队尾添加元素 item
  // 在尾部添加一个元素 item，维护 maxq 的单调性质
  // 将前面小于自己的元素都删
  push(item) {
    // 将前面小于自己的元素都删除
    while (this.maxq.length > 0 && this.maxq[this.maxq.length - 1] < item) {
      this.maxq.pop();
    }
    this.maxq.push(item);
  }
  // 返回队头元素, 即 maxq 队首元素
  // 队头的元素肯定是最大的
  max() {
    return this.maxq[0];
  }

  // 删除队头元素
  pop(item) {
    // 如果要删除的元素是队头元素，就删除
    // 否则不做任何操作
    // 想删除的队头元素 item 可能已经被「压扁」了
    if (this.maxq[0] === item) {
      this.maxq.shift();
    }
  }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  // ① 初始化一个单调队列，用来维护窗口的最大值
  // 变量 window 是一个 MonotonicQueue 类型的实例
  let window = new MonotonicQueue();

  let res = [];

  // 遍历 nums
  for (let i = 0; i < nums.length; i++) {
    // ①  如果 i < k - 1，先填满窗口的前 k - 1
    if (i < k - 1) {
      window.push(nums[i]);
    } else {
      // ②  窗口向前滑动，加入最后一个元素
      // 每次 push时，window 都会维护一个单调递减队列
      window.push(nums[i]);
      // 记录当前窗口的最大值
      res.push(window.max());
      // 窗口向前滑动，删除第一个元素
      window.pop(nums[i - k + 1]);
    }
  }

  return res;
};

```

## 5. 复杂度分析

- 时间复杂度：O(n)
   - 主循环遍历整个数组 nums，这需要 `O(n)` 时间，其中 n 是数组的长度。
      - 在循环中，我们执行以下操作：
         - push(): 虽然这个操作包含一个**while循环**，看起来可能是`O(n)`
            -  但是每个元素最多被 push 和 pop 一次。
            -  所以整个数组，push操 作的均摊时间复杂度是`O(1)` 
         - max(): 这是一个`O(1)`操作，因为它只是返回队列的第一个元素。
         - pop(): 这也是一个`O(1)`操作，因为它只是检查并可能删除队列的第一个元素。
   - 综上所述，尽管有嵌套的循环，但是由于**每个元素最多被处理两次（一次入队，一次出队）**，所以总的时间复杂度是O(n)
- 空间复杂度：O(k)
	- MonotonicQueue 中的 **maxq 数组在最坏情况下可能会存储 k 个元素**，其中 k 是滑动窗口的大小。
	- 结果`数组 res` 的大小为 `n - k + 1`，但这是必要的输出空间，通常不计入空间复杂度。
