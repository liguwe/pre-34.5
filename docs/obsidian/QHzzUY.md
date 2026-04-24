# 词元转换为词元ID

`#2026/01/01` `#ai`

> 这一节的核心任务是：**把文本（字符串）变成机器能读懂的数字列表（整数索引）**，并且能**把数字再变回文本**。

## 第一步：构建“词汇表” (Vocabulary)

在大模型眼里，单词就是数字。首先我们需要扫描训练数据，建立一个“`单词` -> `ID`”的映射字典。

![{%}|864](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/015.jpg)

```python
# 假设这是上一节处理好的分词结果（书中使用的是《The Verdict》这本小说）
# 这里模拟一部分数据，展示逻辑
preprocessed = ['I', 'HAD', 'always', 'thought', 'Jack', 'Gisburn', '...']

# 1. 去重：使用 set 去掉重复单词
# 2. 排序：使用 sorted 按字母顺序排列
all_words = sorted(list(set(preprocessed)))

# 3. 查看词汇表大小
vocab_size = len(all_words)
print(f"词汇表大小: {vocab_size}")

# 4. 创建字典：{单词: 整数ID}
# enumerate 会产生 (0, 'I'), (1, 'Jack')... 这样的对
vocab = {token: integer for integer, token in enumerate(all_words)}


# 打印前 5 个看看长什么样
for i, item in enumerate(vocab.items()):
    print(item)
    if i >= 5:
        break

# 输出示例（基于原文数据）：
# ('!', 0)
# ('"', 1)
# ("'", 2)
# ...
```

### 一些语法忘了

enumerate 

```python hl:4
# 假设
all_words = ['!', 'always', 'thought']

# enumerate(all_words) 会产生类似下面这样的数据对：
# (0, '!')
# (1, 'always')
# (2, 'thought')
```

`vocab = {token: integer for integer, token in enumerate(all_words)}`
- **循环体**：`for integer, token in enumerate(all_words)`（遍历带序号的单词列表）。
- **结果定义**：`token : integer`（单词作为 **Key**，序号作为 **Value**）

等价于 

```python
# %%
vocab = {} # 先建个空字典

# integer 拿的是索引（0, 1, 2...）
# token 拿的是单词（'!', 'thought'...）
for integer, token in enumerate(all_words):
    vocab[token] = integer # 存入字典：{'!': 0, 'thought': 1 ...}
```

>  另外更多可参考 [5. Python 字典推导式与 enumerate 用法详解](/t5r5GW)

## 第二步：实现分词器类 `SimpleTokenizerV1`

![{%}|728](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/016.jpg)

这是本节最核心的代码（代码清单 2-3）。这个类封装了两个功能：

- `encode`：
	- 输入文本 -> 输出 ID 列表
- `decode`：
	- 输入 ID 列表 -> 输出文本

```python hl:10,24
import re # 需要用到正则表达式库

class SimpleTokenizerV1:
    def __init__(self, vocab):
        # 正向映射：单词 -> ID
        self.str_to_int = vocab
        # 反向映射：ID -> 单词 (通过遍历 vocab 自动生成)
        self.int_to_str = {i:s for s,i in vocab.items()}

    def encode(self, text):
        # 1. 分词：使用正则表达式将文本切分为单词和标点
        # 这里的正则逻辑是：在标点、双破折号或空白处进行分割
        preprocessed = re.split(r'([,.?_!"()\']|--|\s)', text)

        # 2. 去除空白字符
        preprocessed = [
            item.strip() for item in preprocessed if item.strip()
        ]

        # 3. 映射：查字典，将单词转换为 ID
        ids = [self.str_to_int[s] for s in preprocessed]
        return ids

    def decode(self, ids):
        # 1. 映射：查反向字典，将 ID 转换为单词
        text = " ".join([self.int_to_str[i] for i in ids])

        # 2. 修复标点空格：
        # 直接 join 会导致 "Hello , world ." 这种情况
        # 下面的正则将 " ," 替换为 ","，去掉标点前的空格
        text = re.sub(r'\s+([,.?!"()\'])', r'\1', text)
        return text
```

---

## 第三步：运行与测试（以及发现致命 Bug）

现在我们实例化这个类，看看它是如何工作的，以及它在什么情况下会报错。

**1. 正常编码与解码：**

```python
# 实例化分词器
tokenizer = SimpleTokenizerV1(vocab)

# 输入书中原文的一段话
text = """"It's the last he painted, you know," Mrs. Gisburn said with pardonable pride."""

# 测试 encode (文本 -> 数字)
ids = tokenizer.encode(text)
print("编码后的 ID:", ids)
# 输出: [1, 56, 2, 850, 988, 602, 533, 746, 5, 1126, ...]

# 测试 decode (数字 -> 文本)
decoded_text = tokenizer.decode(ids)
print("解码后的文本:", decoded_text)
# 输出: '" It\' s the last he painted, you know," Mrs. Gisburn said with pardonable pride.'
```

**2. 致命 Bug 演示 (KeyError)：**

如果你输入训练数据（那本小说）里没有的词，代码会直接崩溃。

```python
# "Hello" 这个词不在《The Verdict》这本小说里
new_text = "Hello, do you like tea?"

# 运行下面这行代码会报错！
# tokenizer.encode(new_text)
```

**报错信息：**

```
KeyError: 'Hello'
```

**原因分析：** 在 `encode` 方法中，执行 `self.str_to_int[s]` 时，字典里找不到 `'Hello'` 这个键，所以 Python 抛出了 `KeyError`。

这也引出了下一节（2.4节）的解决方案：我们需要引入一个特殊的 `<|unk|>` (Unknown) 词元来代表所有没见过的词，防止程序崩溃。
