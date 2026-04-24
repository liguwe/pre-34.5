# 找到字符串中所有字母异位词

`#leetcode` `#算法/滑动窗口` `#算法/左右指针`  `#R2` 

>  https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/

## 1. 总结

- 异位词：
	- 由相同的字符组成，包括每个字符的个数
- 定义变量：
- `while (right < s.length) {`
	- `while (right - left > p.length) {` 
		- `win[c] == 0` 记得 `delete`
- 判断是否异位词
	- `fn(win,need)` 写在一个函数里，不用再传参数了 → `fn()`
	- **这样可以少些一点代码，也避免传参搞错了**


>  后面这类似的判断都可以这么搞 `fn` ，别传参数了


```js
var findAnagrams = function (s, p) {
  let left = 0;
  let right = 0;
  let win = {};
  let need = {};
  let res = [];
  for (let c of p) {
    need[c] = (need[c] || 0) + 1;
  }
  while (right < s.length) {
    let c = s[right];
    win[c] = (win[c] || 0) + 1;
    right++;
    while (right - left > p.length) {
      if (fn()) {
        res.push(left);
      }
      let c = s[left];
      win[c] = (win[c] || 0) - 1;
      if (win[c] == 0) {
        delete win[c];
      }
      left++;
    }
    if (right - left === p.length && fn()) {
      res.push(left);
    }
  }

  return res;

  function fn() {
    for (let k of Object.keys(win)) {
      if (win[k] !== need[k]) {
        return false;
      }
    }
    for (let k of Object.keys(need)) {
      if (win[k] !== need[k]) {
        return false;
      }
    }
    return true;
  }
};
```

## 2. 题目及理解

![cos-blog-832-34-20241012|624](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240810142206.png)

关于 异位词，再举几个例子
1. "listen" 和 "silent" 是异位词。 它们包含相同的字母，每个字母出现的次数也相同。
2. "debit card" 和 "bad credit" 是异位词。 忽略空格后，它们包含相同的字母集合，且每个字母的出现次数相同。
3. "aab" 和 "baa" 是异位词。 注意这里 **'a' 重复出现了两次，'b' 出现了一次**，两个词中字母出现的次数是相同的。
4. "egg" 和 "geg" 是异位词。 这里 'g' 重复出现。
5. "aaabbb" 和 "ababab" 是异位词。 尽管排列不同，但 'a' 和 'b' 都各出现了三次。

> [!danger]
>  所以要遍历所以字母，看每个字母出现了几次
>  

## 3. 解题思路

### 3.1. 思路一：滑动窗口

```javascript
int left = 0, right = 0;

while (right < nums.size()) {
    // 增大窗口
    window.addLast(nums[right]);
    right++;
    
    while (window needs shrink) {
        // 缩小窗口
        window.removeFirst(nums[left]);
        left++;
    }
}
```

使用 JavaScript 语言描述

```javascript

// 滑动窗口算法伪码框架
var slidingWindow = function(s) {
    // 用合适的数据结构记录窗口中的数据，根据具体场景变通
    // 比如说，我想记录窗口中元素出现的次数，就用 map
    // 如果我想记录窗口中的元素和，就可以只用一个 int
    var window = ...;

    var left = 0, right = 0;
    while (right < s.length) {
        // c 是将移入窗口的字符
        var c = s[right];
        window.add(c);
        // 增大窗口
        right++;
        // 进行窗口内数据的一系列更新
        ...

        // *** debug 输出的位置 ***
        // 注意在最终的解法代码中不要 print
        // 因为 IO 操作很耗时，可能导致超时
        console.log("window: [%d, %d)\n", left, right);
        // *********************

        // 判断左侧窗口是否要收缩
        while (window needs shrink) {
            // d 是将移出窗口的字符
            var d = s[left];
            window.remove(d);
            // 缩小窗口
            left++;
            // 进行窗口内数据的一系列更新
            ...
        }
    }
};
```

 *  先定义 `need` 和 `win` 两个 Map
	 * 用于记录目标字符串 p 中字符出现的次数
	 * 窗口中字符出现的次数
 * 定义 指针 `left = 0` 和 `right = 0` 
 *  遍历字符串 s，先移动右指针
	 *  当窗口中的字符满足条件时，开始移动左指针
	 *  当窗口中的字符不满足条件时，继续移动右指针
	 *  当窗口中的字符满足条件时，开始移动左指针
		 * 每次移动都需要更新 `need` 和 `win` 两个 `map`

#### 3.1.1. 代码实现

```javascript
/**
 * @description: 438. 找到字符串中所有字母异位词
 *  ① 先定义 need 和 win 两个 Map，用于记录目标字符串 p 中字符出现的次数和窗口中字符出现的次数
 *  ② 遍历字符串 s，先移动右指针，当窗口中的字符满足条件时，开始移动左指针
 *  ③ 当窗口中的字符不满足条件时，继续移动右指针
 *  ④ 当窗口中的字符满足条件时，开始移动左指针
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  // 用于存放结果
  const res = [];

  // 记录【窗口】中的字符出现的次数
  const win = new Map();
  // 记录 p 中所有字符出现的次数
  const need = new Map();

  // 看每个字符出现的次数
  for (let c of p) {
    need.set(c, (need.get(c) || 0) + 1);
  }

  let left = 0;
  let right = 0;

  // 记录窗口中已经匹配的字符个数
  // 如果 valid 和 need.size 的大小相同，则说明窗口已满足条件，已经完全匹配
  let valid = 0;

  // 遍历字符串，先移动右指针，当窗口内的字符符合要求时，再移动左指针
  while (right < s.length) {
    let c = s[right];
    right++;
    // 进行窗口内数据的一系列更新
    // 判断右侧窗口是否要扩大，need 中是否有这个字符, 有的话就加入窗口
    if (need.has(c)) {
      // 更新窗口内数据，每个字符出现的次数
      win.set(c, (win.get(c) || 0) + 1);
      // 判断窗口内的字符出现的次数是否符合要求
      // 这个时候 valid 用来记录符合要求的字符个数
      if (win.get(c) === need.get(c)) {
        valid++;
      }
    }

    // 判断左侧窗口是否要收缩
    // 当窗口大小大于 p 的长度时，就要收缩
    while (right - left >= p.length) {
      // 当窗口符合条件时，把起始索引 left 加入结果
      if (valid === need.size) {
        res.push(left);
      }
      // d 是将移出窗口的字符
      let d = s[left];
      left++;
      // 如果 d 是需要的字符，这个时候就要更新窗口，因为要移出窗口了
      // valid 用来记录符合要求的字符个数
      // 如果 d 的次数和 need 中的次数相同，说明符合要求的字符个数要减少了
      if (need.has(d)) {
        if (win.get(d) === need.get(d)) {
          valid--;
        }
        win.set(d, win.get(d) - 1);
      }
    }
  }

  return res;
};

```

#### 3.1.2. 复杂度分析

这个算法的复杂度分析如下：

- 时间复杂度：`O(n)`
	- n 是字符串 s 的长度。
	- 主循环遍历字符串 s 一次，right 指针从 0 移动到 n-1，这需要 O(n) 时间。
		- **内部的 while 循环看似可能导致二次循环**
			- 但实际上 left 指针最多也只会从 0 移动到 n-1，所以总的移动次数不会超过 n。
			- 指针 `left, right` 不会回退（它们的值只增不减）
	- Map 的操作（get, set, has）在平均情况下是 O(1) 的。
	- 因此，总的时间复杂度是 O(n)。
空间复杂度：`O(K)`
- **K 是字符集的大小**。在这个问题中，通常是固定的（例如，如果只考虑小写字母，**K = 26**）。
- win 和 need 这两个 Map 的大小不会超过字符集的大小。
- res 数组的大小最坏情况下可能接近 n，但通常会远小于 n。
- 其他变量（left, right, valid）占用常数空间。
- 因此，总的空间复杂度是 O(K)，其中 K 是常数。
