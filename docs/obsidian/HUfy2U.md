# 优先级队列及 TopK 问题

`#优先级队列`  `#数据结构` 


## 总结

- 为了一定能把写出来，请用 [#2.2.3. 使用 JavaScript 描述：直接使用 sort 方法](/HUfy2U#223-%E4%BD%BF%E7%94%A8-JavaScript-%E6%8F%8F%E8%BF%B0%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8-sort-%E6%96%B9%E6%B3%95)

## 1. 优先级队列

优先级队列是一种特殊的队列数据结构，举个例子：

想象一下你正在一家繁忙的急诊室工作。在这里，病人不是按照先来后到的顺序就诊，而是根据他们病情的`严重程度（优先级）`来决定谁先接受治疗。这就是一个典型的优先级队列的例子。

让我们详细描述这个场景：
1. **入队（Enqueue）**： 
	1. 当病人到达急诊室时，护士会评估他们的情况并分配一个紧急程度等级（比如1-5，1最紧急，5最不紧急）。这相当于将一个元素插入优先级队列。
2. **出队（Dequeue）**：
	1.  医生ready时，会叫下一个病人。但不是叫最早到的，而是叫当前等待中最紧急的病人。这就像从优先级队列中取出最高优先级的元素。
3. **动态调整**： 
	1. 如果一个病人的情况突然恶化，护士可能会提高他的紧急程度。这相当于在优先级队列中更新一个元素的优先级。
4. **多个相同优先级**：
	1.  如果有多个病人的紧急程度相同，通常会按照他们到达的顺序处理。这就是优先级队列处理相同优先级元素的方式。

### 1.1. 优先级队列的作用

1. 任务调度：在操作系统中，优先级队列用于管理进程或线程的执行顺序，确保高优先级的任务先执行。
2. 事件驱动编程：在事件处理系统中，优先级队列可以用来管理事件的处理顺序，确保重要事件得到及时处理。
3. 图算法：在诸如Dijkstra最短路径算法、Prim最小生成树算法等图算法中，优先级队列用于高效地选择下一个要处理的节点。
4. 数据压缩：在Huffman编码等数据压缩算法中，优先级队列用于构建Huffman树。
5. 模拟系统：在离散事件模拟中，优先级队列用于管理事件的发生顺序。
6. 网络流量控制：在网络传输中，优先级队列可以用来管理数据包的发送顺序，确保重要数据包优先传输。

## 2. 实现优先级队列的方法

优先级队列通常有两种主要的实现方式：

### 2.1. 基于堆（Heap）的实现

这是最常用和最高效的实现方式。通常使用二叉堆（Binary Heap）来实现。

   ```python
import heapq

class PriorityQueue:
   def __init__(self):
	   self._queue = []
	   self._index = 0

   def push(self, item, priority):
	   heapq.heappush(self._queue, (-priority, self._index, item))
	   self._index += 1

   def pop(self):
	   return heapq.heappop(self._queue)[-1]
   ```

这个实现利用了 Python 的heapq模块，它提供了堆队列算法的实现。我们使用负的优先级值是因为heapq实现的是最小堆，而我们通常需要最大优先级先出队。

### 2.2. 基于有序数组的实现

#### 2.2.1. 使用 python 描述

这种方法在插入时保持元素有序，出队时直接取第一个元素。

   ```python
# 优先级队列：基于有序列表的实现
class PriorityQueue:
    def __init__(self):
        # 用于存储元素的列表
        self.queue = []

    # 判断队列是否为空
    def isEmpty(self):
        return len(self.queue) == 0

    # 插入元素,需要传入两个参数，插入以后按照优先级排序
    #   item: 待插入的元素
    #   priority: 优先级
    def push(self, item, priority):
        self.queue.append((item, priority))
        self.queue.sort(key=lambda x: x[1])

    # 移除元素，返回优先级最高的元素，即返回列表的第一个元素
    def pop(self):
        # 参数 0 表示移除并返回列表的第一个元素
        return self.queue.pop(0)

   ```

这种实现方法简单直观，但在大规模数据时效率较低，因为每次插入都需要重新排序

#### 2.2.2. 使用 JavaScript 描述：遍历查找插入合适的位置

```js hl:16
// 优先级队列实现：使用有序数组实现

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element) {
    // 如果队列为空，直接插入
    if (this.isEmpty()) {
      this.queue.push(element);
      // 如果队列不为空，按照优先级插入
    } else {
      // 标识是否插入过了
      let added = false;
      // 遍历，找到合适的位置插入
      for (let i = 0; i < this.queue.length; i++) {
        if (element.priority < this.queue[i].priority) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      // 如果没有插入过，说明优先级最低，直接插入到队尾
      if (!added) {
        this.queue.push(element);
      }
    }
  }

  dequeue() {
    return this.queue.shift();
  }

  front() {
    return this.queue[0];
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }
}

```

#### 2.2.3. 使用 JavaScript 描述：直接使用 sort 方法

```javascript hl:11
// 优先级队列实现：直接使用 sort 方法

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  // 入优
  enqueue(element) {
    this.queue.push(element);
    // 最简单的实现方式，每次插入元素后，都对队列进行排序
    this.queue.sort((a, b) => {
      return a.priority - b.priority;
    });
  }

  // 出队
  dequeue() {
    return this.queue.shift();
  }

  // 返回队首元素
  front() {
    return this.queue[0];
  }

  // 是否为空
  isEmpty() {
    return this.queue.length === 0;
  }

  // 队列大小
  size() {
    return this.queue.length;
  }
}

```


### 2.3. 如何选择实现方式

选择哪种实现方法取决于具体的应用场景：

- 如果需要**频繁地插入和删除元素**，并且数据量较大，那么基于堆的实现更为合适，因为它的时间复杂度为`O(log n)`。
- 如果数据量较小，或者插入操作不频繁，而查找操作较多，那么基于有序数组的实现可能更简单且足够高效。

## 3. Tok-K 问题

### 3.1. 方法一：排序

```python

# top-k 问题：使用排序算法，时间复杂度为O(nlogn)
def topk(arr, k):
    arr.sort(reverse=True)
    return arr[:k]

```

### 3.2. 方法二：使用堆数据结构（heapq）

直接使用 `heapq.nlargest`

```python
# tok-k 问题：使用堆排序算法，时间复杂度为O(nlogk)
# 优先级队列：基于堆的实现

import heapq

def topk2(arr, k):
    return heapq.nlargest(k, arr)

```

使用堆的特性，维护 topk 的堆

```python
import heapq

def top_k_heap(nums: list[int], k: int) -> list[int]:
    """基于堆查找数组中最大的 k 个元素"""
    # 初始化小顶堆
    heap = []
    # 将数组的前 k 个元素入堆
    for i in range(k):
        heapq.heappush(heap, nums[i])
    # 从第 k+1 个元素开始，保持堆的长度为 k
    for i in range(k, len(nums)):
        # 若当前元素大于堆顶元素，则将堆顶元素出堆、当前元素入堆
        if nums[i] > heap[0]:
            heapq.heappop(heap)
            heapq.heappush(heap, nums[i])
    return heap
```
