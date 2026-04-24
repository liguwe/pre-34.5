# 从头开始构建字节对编码 (BPE) 分词器：简单版

`#2026/01/10` `#ai` 

> 内容来源于 GitHub Jupyter Notebook 内容转换为标准 Markdown 文件的结果，详见 https://github.com/rasbt/LLMs-from-scratch/blob/main/ch02/05_bpe-from-scratch/bpe-from-scratch-simple.ipynb


这是一个独立的笔记本，出于教育目的从头实现了流行的 **字节对编码 (BPE)** 分词算法，该算法被用于 GPT-2 到 GPT-4、Llama 3 等模型中。

- 关于分词目的的更多详细信息，请参阅**第 2 章**；这里的代码是解释 BPE 算法的补充材料。
- OpenAI 为训练原始 GPT 模型而实现的原始 BPE 分词器可以在[这里](https://github.com/openai/gpt-2/blob/master/src/encoder.py)找到。
- BPE 算法最初是在 1994 年的论文《用于数据压缩的新算法》("A New Algorithm for Data Compression") 中描述的，作者是 Philip Gage。

如今，大多数项目（包括 Llama 3）都使用 OpenAI 开源的 `tiktoken` 库，因为它的计算性能更高；它允许加载预训练的 GPT-2 和 GPT-4 分词器等（Llama 3 模型也是使用 GPT-4 分词器训练的）。

上述实现与本笔记本中的实现（除了本笔记本是纯 Python 实现外）的区别在于，本实现还包含一个**训练**分词器的函数（用于教育目的）。  
还有一个名为 `minBPE` 的实现也支持训练，可能性能更好（我这里的实现专注于教育目的）；与 `minBPE` 相比，我的实现还允许加载原始的 OpenAI 分词器词汇表和合并规则。

> **注意：** 这是一个用于教育目的的非常朴素的实现。`bpe-from-scratch.ipynb` 笔记本包含一个更复杂（但也更难读懂）的实现，其行为与 `tiktoken` 相匹配。

## 1. 字节对编码 (BPE) 背后的主要思想

BPE 的主要思想是将文本转换为整数表示（Token IDs），以便进行 LLM 训练（参见第 2 章）。

### 1.1 比特和字节 (Bits and bytes)

在介绍 BPE 算法之前，让我们先介绍一下字节的概念。  
考虑将文本转换为字节数组（毕竟 BPE 代表“字节”对编码）：

```python
text = "This is some text"
byte_ary = bytearray(text, "utf-8")
print(byte_ary)
```

**输出:**

```bash
bytearray(b'This is some text')
```

当我们对 `bytearray` 对象调用 `list()` 时，每个字节都被视为一个单独的元素，结果是一个对应于字节值的整数列表：

```python
ids = list(byte_ary)
print(ids)

```

**输出:**

```bash
[84, 104, 105, 115, 32, 105, 115, 32, 115, 111, 109, 101, 32, 116, 101, 120, 116]

```

这将是将文本转换为 LLM 嵌入层所需的 Token ID 表示的有效方法。  
然而，这种方法的缺点是它为每个字符创建一个 ID（对于短文本来说 ID 太多了！）。  
也就是说，对于一个 17 个字符的输入文本，我们必须使用 17 个 Token ID 作为 LLM 的输入：

```python
print("Number of characters:", len(text))
print("Number of token IDs:", len(ids))

```

**输出:**

```bash
Number of characters: 17
Number of token IDs: 17

```

如果您以前使用过 LLM，您可能知道 BPE 分词器有一个词汇表，其中我们拥有整个单词或子词的 Token ID，而不是每个字符的 ID。  
例如，GPT-2 分词器将相同的文本（"This is some text"）分词为 4 个 Token，而不是 17 个：`1212, 318, 617, 2420`。

您可以使用交互式 `tiktoken` 应用程序或 `tiktoken` 库再次检查这一点：

```python
import tiktoken
gpt2_tokenizer = tiktoken.get_encoding("gpt2")
gpt2_tokenizer.encode("This is some text")
# 输出 [1212, 318, 617, 2420]

```

由于一个字节由 8 位组成，因此单个字节可以表示 个可能的值，范围从 0 到 255。  
您可以通过执行代码 `bytearray(range(0, 257))` 来确认这一点，它会警告您 `ValueError: byte must be in range(0, 256)`。

BPE 分词器通常使用这 256 个值作为其前 256 个单字符 Token；可以通过运行以下代码直观地检查这一点：

```python
import tiktoken
gpt2_tokenizer = tiktoken.get_encoding("gpt2")
for i in range(300):
    decoded = gpt2_tokenizer.decode([i])
    print(f"{i}: {decoded}")

"""
打印输出:
0: !
1: "
2: #
...
255:  # <---- 到这里为止是单字符 token
256: t
257: a
...
298: ent
299: n
"""

```

在上面，请注意条目 256 和 257 不是单字符值，而是双字符值（一个空格 + 一个字母），这是原始 GPT-2 BPE 分词器的一个小缺陷（这在 GPT-4 分词器中已得到改进）。

### 1.2 构建词汇表

BPE 分词算法的目标是构建一个包含常见子词（如 `298: ent`，可见于 entangle, entertain, enter, entrance, entity 等）甚至完整单词的词汇表，例如：

- `318: is`
- `617: some`
- `1212: This`
- `2420: text`

BPE 算法最初在 1994 年 Philip Gage 的论文 "A New Algorithm for Data Compression" 中描述。  
在我们进入实际的代码实现之前，如今 LLM 分词器使用的形式可以总结如下：

### 1.3 BPE 算法大纲

1. **识别频繁对 (Identify frequent pairs)**
- 在每次迭代中，扫描文本以查找最常出现的字节（或字符）对。

2. **替换并记录 (Replace and record)**
- 用一个新的占位符 ID 替换该对（一个尚未使用的 ID，例如，如果我们从 0...255 开始，第一个占位符将是 256）。
- 在查找表中记录此映射。
- 查找表的大小是一个超参数，也称为“词汇表大小”（对于 GPT-2，大小为 50,257）。

3. **重复直到没有收益 (Repeat until no gains)**
- 不断重复步骤 1 和 2，持续合并最频繁的对。
- 当无法进一步压缩时停止（例如，没有一对出现超过一次）。

**解压（解码）：**

- 要恢复原始文本，请使用查找表，通过将每个 ID 替换为其对应的对来反转该过程。

### 1.4 BPE 算法示例

#### 1.4.1 编码部分的具体示例（步骤 1 和 2）

假设我们有文本（训练数据集） `the cat in the hat`，我们想用它来构建 BPE 分词器的词汇表。

**迭代 1**

- **识别频繁对**：在该文本中，"th" 出现了两次（在开头和第二个 "e" 之前）。
- **替换并记录**：将 "th" 替换为尚未使用的 Token ID，例如 256。
- 新文本为：`<256>e cat in <256>e hat`
- 新词汇表为：
- `0: ...`
- `...`
- `256: "th"`

**迭代 2**

- **识别频繁对**：在文本 `<256>e cat in <256>e hat` 中，对 `<256>e` 出现了两次。
- **替换并记录**：将 `<256>e` 替换为尚未使用的 Token ID，例如 257。
- 新文本为：`<257> cat in <257> hat`
- 更新后的词汇表为：
- `0: ...`
- `...`
- `256: "th"`
- `257: "<256>e"`

**迭代 3**

- **识别频繁对**：在文本 `<257> cat in <257> hat` 中，对 `<257> `（注意后面有个空格）出现了两次。
- **替换并记录**：将 `<257> ` 替换为尚未使用的 Token ID，例如 258。
- 新文本为：`<258>cat in <258>hat`
- 更新后的词汇表为：
- `0: ...`
- `...`
- `256: "th"`
- `257: "<256>e"`
- `258: "<257> "`

以此类推。

#### 1.4.2 解码部分的具体示例（步骤 3）

要恢复原始文本，我们反转该过程，按照引入的相反顺序将每个 Token ID 替换为其对应的对。

- 从最终的压缩文本开始：`<258>cat in <258>hat`
- 替换 `<258> → <257> ` : `<257> cat in <257> hat`
- 替换 `<257> → <256>e` : `<256>e cat in <256>e hat`
- 替换 `<256> → "th"` : `the cat in the hat`

## 2. 一个简单的 BPE 实现

下面是上述算法的 Python 类实现，它模仿了 `tiktoken` 的 Python 用户界面。  
请注意，上面的编码部分描述了通过 `train()` 进行的原始训练步骤；但是，`encode()` 方法的工作原理类似（尽管由于特殊 Token 的处理，它看起来稍微复杂一些）：

1. 将输入文本拆分为单个字节。
2. 当相邻 Token（对）与学习到的 BPE 合并规则中的任何对匹配时（从最高“等级”到最低“等级”，即按学习顺序），重复查找并替换（合并）它们。
3. 继续合并，直到无法应用更多合并。
4. 最终的 Token ID 列表即为编码输出。

```python
from collections import Counter, deque
from functools import lru_cache

class BPETokenizerSimple:
    def __init__(self):
        # 将 token_id 映射到 token_str (例如 {11246: "some"})
        self.vocab = {}
        # 将 token_str 映射到 token_id (例如 {"some": 11246})
        self.inverse_vocab = {}
        # BPE 合并字典: {(token_id1, token_id2): merged_token_id}
        self.bpe_merges = {}

    def train(self, text, vocab_size, allowed_special={"<|endoftext|>"}):
        """
        从头开始训练 BPE 分词器。
        参数:
            text (str): 训练文本。
            vocab_size (int): 期望的词汇表大小。
            allowed_special (set): 要包含的特殊 Token 集合。
        """
        # 预处理：将空格替换为 'Ġ'
        # 注意 'Ġ' 是 GPT-2 BPE 实现的一个特性
        # 例如，"Hello world" 可能被分词为 ["Hello", "Ġworld"]
        # (GPT-4 BPE 会将其分词为 ["Hello", " world"])
        processed_text = []
        for i, char in enumerate(text):
            if char == " " and i != 0:
                processed_text.append("Ġ")
            if char != " ":
                processed_text.append(char)
        processed_text = "".join(processed_text)

        # 用唯一字符初始化词汇表，如果存在 'Ġ' 也包含在内
        # 从前 256 个 ASCII 字符开始
        unique_chars = [chr(i) for i in range(256)]
        
        # 用 processed_text 中尚未包含的字符扩展 unique_chars
        unique_chars.extend(char for char in sorted(set(processed_text)) if char not in unique_chars)
        
        # 可选：如果 'Ġ' 与您的文本处理相关，确保包含它
        if 'Ġ' not in unique_chars:
            unique_chars.append('Ġ')

        # 现在创建 vocab 和 inverse_vocab 字典
        self.vocab = {i: char for i, char in enumerate(unique_chars)}
        self.inverse_vocab = {char: i for i, char in self.vocab.items()}

        # 添加允许的特殊 Token
        if allowed_special:
            for token in allowed_special:
                if token not in self.inverse_vocab:
                    new_id = len(self.vocab)
                    self.vocab[new_id] = token
                    self.inverse_vocab[token] = new_id

        # 将 processed_text 分词为 Token ID
        token_ids = [self.inverse_vocab[char] for char in processed_text]

        # BPE 步骤 1-3：重复查找并替换频繁对
        for new_id in range(len(self.vocab), vocab_size):
            pair_id = self.find_freq_pair(token_ids, mode="most")
            if pair_id is None:
                # 没有更多可合并的对。停止训练。
                break
            token_ids = self.replace_pair(token_ids, pair_id, new_id)
            self.bpe_merges[pair_id] = new_id
            
            # 构建包含合并 Token 的词汇表
            for (p0, p1), new_id in self.bpe_merges.items():
                merged_token = self.vocab[p0] + self.vocab[p1]
                self.vocab[new_id] = merged_token
                self.inverse_vocab[merged_token] = new_id

    def encode(self, text):
        """
        将输入文本编码为 Token ID 列表。
        参数:
            text (str): 要编码的文本。
        返回:
            List[int]: Token ID 列表。
        """
        tokens = []
        # 将文本拆分为 Token，保持换行符完整
        words = text.replace("\n", " \n ").split()
        
        # 确保 '\n' 被视为单独的 Token
        for i, word in enumerate(words):
            if i > 0 and not word.startswith("\n"):
                tokens.append("Ġ" + word) # 为跟在空格或换行符后的单词添加 'Ġ'
            else:
                tokens.append(word)

        # 处理第一个单词或独立的 '\n'
        token_ids = []
        for token in tokens:
            if token in self.inverse_vocab:
                # Token 原样包含在词汇表中
                token_id = self.inverse_vocab[token]
                token_ids.append(token_id)
            else:
                # 尝试通过 BPE 处理子词分词
                sub_token_ids = self.tokenize_with_bpe(token)
                token_ids.extend(sub_token_ids)
        return token_ids

    def tokenize_with_bpe(self, token):
        """
        使用 BPE 合并规则对单个 Token 进行分词。
        参数:
            token (str): 要分词的 Token。
        返回:
            List[int]: 应用 BPE 后的 Token ID 列表。
        """
        # 将 Token 分词为单个字符（作为初始 Token ID）
        token_ids = [self.inverse_vocab.get(char, None) for char in token]
        
        if None in token_ids:
            missing_chars = [char for char, tid in zip(token, token_ids) if tid is None]
            raise ValueError(f"Characters not found in vocab: {missing_chars}")

        can_merge = True
        while can_merge and len(token_ids) > 1:
            can_merge = False
            new_tokens = []
            i = 0
            while i < len(token_ids) - 1:
                pair = (token_ids[i], token_ids[i + 1])
                if pair in self.bpe_merges:
                    merged_token_id = self.bpe_merges[pair]
                    new_tokens.append(merged_token_id)
                    # 用于教育目的可取消注释：
                    # print(f"Merged pair {pair} -> {merged_token_id} ('{self.vocab[merged_token_id]}')")
                    i += 2 # 跳过下一个 Token，因为它已被合并
                    can_merge = True
                else:
                    new_tokens.append(token_ids[i])
                    i += 1
            if i < len(token_ids):
                new_tokens.append(token_ids[i])
            token_ids = new_tokens
        return token_ids

    def decode(self, token_ids):
        """
        将 Token ID 列表解码回字符串。
        参数:
            token_ids (List[int]): 要解码的 Token ID 列表。
        返回:
            str: 解码后的字符串。
        """
        decoded_string = ""
        for token_id in token_ids:
            if token_id not in self.vocab:
                raise ValueError(f"Token ID {token_id} not found in vocab.")
            token = self.vocab[token_id]
            if token.startswith("Ġ"):
                # 将 'Ġ' 替换为空格
                decoded_string += " " + token[1:]
            else:
                decoded_string += token
        return decoded_string

    @lru_cache(maxsize=None)
    def get_special_token_id(self, token):
        return self.inverse_vocab.get(token, None)

    @staticmethod
    def find_freq_pair(token_ids, mode="most"):
        pairs = Counter(zip(token_ids, token_ids[1:]))
        if mode == "most":
            return max(pairs.items(), key=lambda x: x[1])[0]
        elif mode == "least":
            return min(pairs.items(), key=lambda x: x[1])[0]
        else:
            raise ValueError("Invalid mode. Choose 'most' or 'least'.")

    @staticmethod
    def replace_pair(token_ids, pair_id, new_id):
        dq = deque(token_ids)
        replaced = []
        while dq:
            current = dq.popleft()
            if dq and (current, dq[0]) == pair_id:
                replaced.append(new_id)
                # 移除对中的第 2 个 Token，第 1 个已被移除
                dq.popleft()
            else:
                replaced.append(current)
        return replaced

```

上面的 `BPETokenizerSimple` 类中有很多代码，详细讨论它超出了本笔记本的范围，但下一节将提供用法的简要概述，以便更好地理解类方法。

## 3. BPE 实现演练

在实践中，我强烈建议使用 `tiktoken`，因为我上面的实现侧重于可读性和教育目的，而不是性能。  
但是，用法与 `tiktoken` 或多或少相似，只是 `tiktoken` 没有训练方法。

让我们通过查看下面的一些示例来看看我上面的 `BPETokenizerSimple` Python 代码是如何工作的（详细的代码讨论超出了本笔记本的范围）。

### 3.1 训练、编码和解码

首先，让我们考虑一些示例文本作为我们的训练数据集：

```python
import os
import urllib.request

if not os.path.exists("../01_main-chapter-code/the-verdict.txt"):
    url = ("https://raw.githubusercontent.com/rasbt/"
           "LLMs-from-scratch/main/ch02/01_main-chapter-code/"
           "the-verdict.txt")
    file_path = "../01_main-chapter-code/the-verdict.txt"
    urllib.request.urlretrieve(url, file_path)

with open("../01_main-chapter-code/the-verdict.txt", "r", encoding="utf-8") as f:
    # 修改路径为 ../01_main-chapter-code/
    text = f.read()

```

接下来，让我们初始化并训练 BPE 分词器，词汇表大小为 1,000。  
请注意，由于前面讨论的字节值，词汇表大小默认已经是 255（译注：通常指 256），因此我们只“学习”了 745 个词汇条目。  
作为比较，GPT-2 词汇表是 50,257 个 Token，GPT-4 词汇表是 100,256 个 Token（`tiktoken` 中的 `cl100k_base`），而 GPT-4o 使用 199,997 个 Token（`tiktoken` 中的 `o200k_base`）；与我们上面的简单示例文本相比，它们都有大得多的训练集。

```python
tokenizer = BPETokenizerSimple()
tokenizer.train(text, vocab_size=1000, allowed_special={"<|endoftext|>"})

```

您可能想检查词汇表内容（但请注意这会创建一个很长的列表）：

```python
# print(tokenizer.vocab)
print(len(tokenizer.vocab))

```

**输出:**

```bash
1000

```

该词汇表是通过合并 742 次创建的（~ ）。

```python
print(len(tokenizer.bpe_merges))

```

**输出:**

```bash
742

```

这意味着前 256 个条目是单字符 Token。

接下来，让我们通过 `encode` 方法使用创建的合并规则来对一些文本进行编码：

```python
input_text = "Jack embraced beauty through art and life."
token_ids = tokenizer.encode(input_text)
print(token_ids)

```

**输出:**

```bash
[424, 256, 654, 531, 302, 311, 256, 296, 97, 465, 121, 595, 841, 116, 287, 466, 256, 326, 972, 46]

```

```python
print("Number of characters:", len(input_text))
print("Number of token IDs:", len(token_ids))

```

**输出:**

```bash
Number of characters: 42
Number of token IDs: 20

```

从上面的长度可以看出，一个 42 个字符的句子被编码为 20 个 Token ID，与基于字符字节的编码相比，有效地将输入长度减少了大约一半。

请注意，词汇表本身用于 `decode()` 方法，这允许我们将 Token ID 映射回文本：

```python
print(token_ids)

```

**输出:**

```bash
[424, 256, 654, 531, 302, 311, 256, 296, 97, 465, 121, 595, 841, 116, 287, 466, 256, 326, 972, 46]

```

```python
print(tokenizer.decode(token_ids))

```

**输出:**

```bash
Jack embraced beauty through art and life.

```

迭代每个 Token ID 可以让我们更好地理解 Token ID 是如何通过词汇表解码的：

```python
for token_id in token_ids:
    print(f"{token_id} -> {tokenizer.decode([token_id])}")

```

**输出:**

```bash
424 -> Jack
256 ->  
654 -> em
531 -> br
302 -> ac
311 -> ed
256 ->  
296 -> be
97 -> a
465 -> ut
121 -> y
595 ->  through
841 ->  ar
116 -> t
287 ->  a
466 -> nd
256 ->  
326 -> li
972 -> fe
46 -> .

```

我们可以看到，大多数 Token ID 代表 2 个字符的子词；这是因为训练数据文本非常短，没有那么多重复的单词，而且我们使用了相对较小的词汇表大小。

总而言之，调用 `decode(encode())` 应该能够重现任意输入文本：

```python
tokenizer.decode(tokenizer.encode("This is some text."))

```

**输出:**

```bash
'This is some text.'

```

## 4. 结论

就是这样！简而言之，这就是 BPE 的工作原理，包括用于创建新分词器的训练方法。  
希望这个简短的教程对您的教育目的有用；如果您有任何疑问，请随时在 GitHub 上开启新的讨论。

> 这是一个用于教育目的的非常朴素的实现。`bpe-from-scratch.ipynb` 笔记本包含一个更复杂（但也更难读懂）的实现，其行为与 `tiktoken` 相匹配。

---

推荐视频：[Build an LLM from Scratch 1: Set up your code environment](https://www.youtube.com/watch?v=yAcWnfsZhzo)

该视频虽然主要是关于环境搭建，但作为《Build a Large Language Model (From Scratch)》书籍作者的配套视频，能帮助你更好地运行和理解这些笔记本代码。
