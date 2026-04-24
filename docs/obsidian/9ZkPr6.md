# 排序算法基础：篇一

`#算法` `#排序`  

## 1. 排序算法的几个重要指标

- 复杂度
- 是否是**原地**排序
- 是否是**稳定**的
- 是否**自适应**的
	- 即能够利用输入数据**已有的顺序信息**来减少计算量

## 2. 利用语言本身的 API 排序

### 2.1. Python 排序方法

Python 提供了两种主要的排序方法：`sort()` 和 `sorted()`。

#### 2.1.1. `sort()` 方法

   - 这是列表（list）对象的一个方法。
   - 它**会直接修改原列表**，不返回新的对象。
   - 默认按升序排列。

示例：
```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
numbers.sort()
print(numbers)  # 输出: [1, 1, 2, 3, 4, 5, 6, 9]

# 降序排列
numbers.sort(reverse=True)
print(numbers)  # 输出: [9, 6, 5, 4, 3, 2, 1, 1]
```

#### 2.1.2. `sorted()` 函数

   - 这是一个内置函数，可以对任何可迭代对象进行排序。
   - 它返回一个新的排序后的列表，不修改原对象。
   - 默认按升序排列。

示例：

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_numbers = sorted(numbers)
print(sorted_numbers)  # 输出: [1, 1, 2, 3, 4, 5, 6, 9]
print(numbers)  # 原列表不变，输出: [3, 1, 4, 1, 5, 9, 2, 6]

# 降序排列
sorted_numbers_desc = sorted(numbers, reverse=True)
print(sorted_numbers_desc)  # 输出: [9, 6, 5, 4, 3, 2, 1, 1]
```

### 2.2. JavaScript 排序方法

JavaScript 主要使用 `Array.prototype.sort()` 方法进行排序。

- 这个方法会直接修改原数组。
- 默认情况下，`sort()` 方法按**字符串顺序排序**，这可能导致数字排序出现问题。

示例：

```javascript
// 简单使用
let fruits = ['banana', 'apple', 'orange', 'mango'];
fruits.sort();
console.log(fruits); // 输出: ['apple', 'banana', 'mango', 'orange']

// 数字排序（升序）
let numbers = [3, 1, 4, 1, 5, 9, 2, 6];
numbers.sort((a, b) => a - b);
console.log(numbers); // 输出: [1, 1, 2, 3, 4, 5, 6, 9]

// 数字排序（降序）
numbers.sort((a, b) => b - a);
console.log(numbers); // 输出: [9, 6, 5, 4, 3, 2, 1, 1]
```

在 JavaScript 中，`sort()` 方法可以接受一个比较函数作为参数，这使得我们可以自定义排序逻辑。

#### 2.2.1. 总结

- `a-b` 升序
- `b-a` 降序

## 3. 选择排序

```javascript hl:26
/**
 * @param {*} arr  待排序数组
 * @returns arr 排序后的数组
 * 选择排序步骤：
 * 1. 选取区间 [0,len-1] 中的最小元素，将其与 索引 0 处的元素交换。
 *    完成后，数组前 1 个元素已排序
 * 2. 选取区间 [1,len-1] 中的最小元素，将其与 索引 1 处的元素交换。
 *    完成后，数组前 2 个元素已排序
 * 3. 重复上述步骤，直到区间 [len-2,len-1] 中的最小元素与 索引 len-2 处的元素交换。
 *    完成后，数组前 len-1 个元素已排序
 */
function selectSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    // 假设当前下标为最小值, 与后面的元素比较, 如果有更小的, 则交换
    let minIndex = i;
    // j = i + 1, 从当前元素的下一个元素开始比较
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 如果最小值不是当前元素, 则交换
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
```

### 3.1. 分析

- 原地排序
- 非稳定排序，如下图

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240927082355.png)

## 4. 冒泡排序

1. 首先，对 n 个元素执行“冒泡”，将数组的`最大元素`交换至正确位置。
2. 接下来，对剩余 n−1 个元素执行“冒泡”，将`第二大元素`交换至正确位置。
3. 以此类推，经过 n−1 轮“冒泡”后，`前 n−1 大的元素`都被交换至正确位置。
4. 仅剩的一个元素必定是最小元素，无须排序，因此数组排序完成。

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240927083448.png)

```javascript
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    // j < len - 1 - i 是因为每次冒泡都会将最大的数冒泡到最后
    // 所以每次冒泡都会将一个数排好序，所以不需要再次比较
    // 所以 -i
    for (let j = 0; j < len - 1 - i; j++) {
      // 如果前一个数比后一个数大，则交换位置
      // 否则，不做任何操作
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

```

### 4.1. 注意点

- `i < len`
- `i < len - 1  - i `
	- 其实直接 `j < len` 也行啊
	- `len - 1` 是因为我们比较相邻元素，所以最后一个元素 (index `len - 1`) 会和它前面的元素比较，不需要单独比较
- 最里层的循环，都使用 `j` 

### 4.2. 分析

- 冒泡是
	- 稳定的
	- 原地的

## 5. 插入排序

1. 初始状态下，数组的**第 1 个**元素已完成排序。
2. 选取数组的**第 2 个**元素作为 `base` ，将其插入到正确位置后，**数组的前 2 个元素已排序**。
3. 选取**第 3 个**元素作为 `base` ，将其插入到正确位置后，**数组的前 3 个元素已排序**。
4. 以此类推，在最后一轮中，选取最后一个元素作为 `base` ，将其插入到正确位置后，**所有元素均已排序**。

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240927211304.png)

```javascript
function insertSort(arr) {
  let len = arr.length;
  for (let i = 1; i < len; i++) {
    // 从第二个元素开始
    let base = arr[i];
    // 需要遍历已排序的部分，找到合适的位置插入
    // 从后往前遍历
    // j 为已排序部分的最后一个元素
    let j = i - 1;
    // 如果已排序部分的元素大于 base，则将元素后移
    while (j >= 0 && arr[j] > base) {
      arr[j + 1] = arr[j];
      j--;
    }
    // 移动完毕，插入 base即可
    arr[j + 1] = base;
  }
}

```

### 5.1. 注意点

- ① for 外层， while 内层
	- `j = i - 1`  
		- 因为 `j` 为已排序的最后一个数的下标
		- 而 `i` 代表最后第几个元素之前已经排号序了
- ② 从后向前遍历已经排序的数组，如果发现需要插入，整体后移
- ③ 移动完毕，然后插入当前的 `base` 即可

### 5.2. 分析

- 稳定的，因为整体移动，不会改变相对顺序
- 原地的

## 6. 快排

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240927212535.png)

```javascript hl:7
function quickSort(arr) {
  // base case: 数组为空或只包含一个元素时
  if (arr.length <= 1) {
    return arr;
  }
  var midIndex = Math.floor(arr.length / 2);
  var mid = arr.splice(midIndex, 1)[0];
  
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([mid], quickSort(right));
}
```

### 6.1. 注意点

- 没有洗牌
- 使用数组的 `splice` 方法，
- 使用数组的 `concat` 方法
- 非原地排序
- 非稳定算法

## 7. 归并排序

![cos-blog-832-34-20241012](https://blog-1310531898.cos.ap-beijing.myqcloud.com/832-34-20241012/Pasted%20image%2020240928110206.png)

```javascript
function mergeSort(arr) {
  // base case: 数组为空或只包含一个元素时
  if (arr.length < 2) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

/**
 * @description: 合并两个有序数组
 * @param {Array} left 左数组，有序
 * @param {Array} right 右数组，有序
 */
function merge(left, right) {
  const result = [];
  // 两个数组都有值
  while (left.length && right.length) {
    // 两个数组的第一个元素进行比较
    // 小的元素出队列，放入结果数组
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  // 两个数组有一个为空, 另一个不为空
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}

```

### 7.1. 注意点

- 合并两个有序数组，所谓有序，只有一个数组那肯定是有序的
- 注意是使用 `shift` ，队首出队
- 曾几何时，使用各种 `while` 把直接绕进去了，现在绕进去了吗？
- 稳定的
- 非原地的
