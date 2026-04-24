# Python 字典推导式与 enumerate 用法详解

`#2026/01/03` `#python` 

## 📚 语法要点总结

### 1️⃣ **enumerate() 函数**

`enumerate()` 函数为可迭代对象添加索引计数器，返回 `(索引, 元素)` 的元组。

```python
# enumerate 为列表添加索引
all_words_part = ['...', 'Gisburn', 'HAD', 'I', 'Jack', 'always', 'thought']

for index, word in enumerate(all_words_part):
    print(index, word)

# 输出：
# 0 ...
# 1 Gisburn
# 2 HAD
# 3 I
# 4 Jack
# 5 always
# 6 thought
```

### 2️⃣ **字典推导式**

字典推导式是创建字典的简洁语法，类似于列表推导式。

```python
# 基本语法
{key表达式: value表达式 for 变量 in 可迭代对象}

# 等价的传统写法
result = {}
for 变量 in 可迭代对象:
    result[key表达式] = value表达式
```

**示例：**

```python
# 创建平方数字典
squares = {x: x**2 for x in range(5)}
# 结果: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 带条件的字典推导式
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
# 结果: {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}
```

### 3️⃣ **组合使用：字典推导式 + enumerate**

这是在 `NLP` 中构建词汇表的常见模式

```python hl:2,3,4
# 字典推导式 + enumerate
# token 代表 value
# interge 代表 index 
# 这就好理解了
vocab_part = {token: integer for integer, token in enumerate(all_words_part)}

# 等价于：
vocab_part = {}
for integer, token in enumerate(all_words_part):
    vocab_part[token] = integer

# 结果：
# {
#     '...': 0,
#     'Gisburn': 1,
#     'HAD': 2,
#     'I': 3,
#     'Jack': 4,
#     'always': 5,
#     'thought': 6
# }
```

### 4️⃣ **执行过程详解**

```python
all_words_part = ['...', 'Gisburn', 'HAD', 'I', 'Jack', 'always', 'thought']

# enumerate(all_words_part) 产生：
#   (0, '...'), (1, 'Gisburn'), (2, 'HAD'), (3, 'I'), ...
#   格式：(索引, 元素)

# 字典推导式执行过程：
# for integer, token in enumerate(all_words_part):
#     第1次循环: integer=0, token='...'     → 字典添加 {'...': 0}
#     第2次循环: integer=1, token='Gisburn' → 字典添加 {'Gisburn': 1}
#     第3次循环: integer=2, token='HAD'     → 字典添加 {'HAD': 2}
#     第4次循环: integer=3, token='I'       → 字典添加 {'I': 3}
#     ...依此类推
```

### 5️⃣ **关键点总结**

- ✅ `enumerate()` 返回 `(索引, 元素)` 元组
- ✅ `字典推导式`中 `{token: integer}` 将单词作为 `key`，索引作为 `value`
- ✅ 注意 `key` 和 `value` 的位置：
	- `{token: integer}` 而不是 `{integer: token}`
- ✅ 这样创建了一个**单词到ID的映射表**，用于后续的文本编码

## 🎯 实际应用场景

### 场景1：构建词汇表（NLP）

```python hl:8,12
# 文本分词后的单词列表
words = ['hello', 'world', 'hello', 'python']

# 去重并排序
unique_words = sorted(set(words))
# ['hello', 'python', 'world']

# 创建词汇表：单词 → ID
vocab = {word: idx for idx, word in enumerate(unique_words)}
# {'hello': 0, 'python': 1, 'world': 2}

# 创建反向词汇表：ID → 单词
reverse_vocab = {idx: word for idx, word in enumerate(unique_words)}
# {0: 'hello', 1: 'python', 2: 'world'}
```

### 场景2：数据转换

```python
# 将列表转换为字典
fruits = ['apple', 'banana', 'cherry']
fruit_dict = {fruit: len(fruit) for fruit in fruits}
# {'apple': 5, 'banana': 6, 'cherry': 6}

# 带索引的字典
indexed_fruits = {idx: fruit.upper() for idx, fruit in enumerate(fruits)}
# {0: 'APPLE', 1: 'BANANA', 2: 'CHERRY'}
```

### 场景3：过滤和转换

```python
# 只保留长度大于3的单词
words = ['I', 'love', 'Python', 'programming']
long_words = {idx: word for idx, word in enumerate(words) if len(word) > 3}
# {1: 'love', 2: 'Python', 3: 'programming'}
```

## 📝 对比：列表推导式 vs 字典推导式

```python
# 列表推导式
squares_list = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]

# 字典推导式
squares_dict = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 集合推导式
squares_set = {x**2 for x in range(5)}
# {0, 1, 4, 9, 16}
```

## 💡 最佳实践

1. **可读性优先**：如果逻辑复杂，使用传统 for 循环更清晰
2. **性能考虑**：推导式通常比循环稍快，但差异不大
3. **命名规范**：使用有意义的变量名，如 `word` 而不是 `w`
4. **避免过度嵌套**：不要在推导式中嵌套太多层逻辑
