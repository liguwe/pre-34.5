# 哈希集合

`#哈希集合` `#set` `#数据结构` 

**哈希表的键，其实就是哈希集合**

哈希集合的主要使用场景是「**去重**」，因为它的特性是：**不会出现重复元素，可以在 `O(1)` 的时间增删元素，可以在 `O(1)` 的时间判断一个元素是否存在**


```python

# 实现HashSet
class Hashset:
    def __init__(self):
        self.hashset = []

    def add(self, key):
        if key not in self.hashset:
            self.hashset.append(key)

    def remove(self, key):
        if key in self.hashset:
            self.hashset.remove(key)

    def contains(self, key):
        return key in self.hashset

    def __str__(self):
        return str(self.hashset)

```
