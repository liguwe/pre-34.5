# 词级、子词级、字符级与字节级分词（文本的"最小处理单位"该如何选择）

`#2025/12/27` `#ai`

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/202520251227214316121.png)

> 设计一个系统的 **“数据颗粒度”** 或 **“压缩策略”**

在将自然语言（String）转换为机器能懂的 ID 列表（Int Array）时，我们有`四种不同的切分策略`。这本质上是在 “`词表大小（内存占用）`” 和 “`序列长度（计算复杂度）`”之间做权衡（Trade-off）。

## 📊 直观对比表

![{%}|808](https://www.ituring.com.cn/figures/2025/HandsonLLM/040.jpg)

> 图 2-6：四种分词方法将文本分解成不同大小的词元（词级、子词级、字符级和字节级）

| 分词级别 | 示例切分                           | 优点       | 缺点          | 类比概念                  |
| ---- | ------------------------------ | -------- | ----------- | --------------------- |
| 词级   | `["Have", "the", "bards"]`     | 直观、易理解   | 词表爆炸、无法处理新词 | `HashMap<String, ID>` |
| 子词级⭐ | `["Have", "the", "b", "ards"]` | 平衡灵活性与效率 | 需要**训练分词器** | 字节码/中间表示              |
| 字符级  | `["H", "a", "v", "e"]`         | 永不出现OOV  | 序列过长、建模难    | `char[]` 数组           |
| 字节级  | `[0x48, 0x61, 0x76, 0x65]`     | 真正通用     | 高度抽象、训练难    | UTF-8 字节流             |

---

## 1️⃣ 词级分词（Word-Level）

```python
# 类比：Python 的 split() 方法  
text = "Have the bards who preceded"  
tokens = text.split()  # ["Have", "the", "bards", "who", "preceded"]  
```

特点：
- 早期 `word2vec`、推荐系统中常用
- 每个完整单词 = `一个 Token`
	- 以`空格`为界，一个单词对应一个 ID。

致命缺陷：

```python hl:1,10
# 问题 1：词表爆炸
vocab = {  
    "apology": 1,  
    "apologize": 2,   
    "apologetic": 3,  
    "apologist": 4,  
    # ... 每个变体都要占一个位置  
}  

# 问题 2：无法处理新词（OOV - Out of Vocabulary）  
new_word = "ChatGPT"  # 训练时不存在 → [UNK]  
```

> 类比理解：就像用枚举存储所有可能的字符串，数据库会炸💣

>   **OOM（Out Of Memory）风险**：指内存或显存不足导致模型无法加载或运行的风险 —— 显存越小，模型越大，OOM 风险越高

---

## 2️⃣ 子词级分词（Subword-Level） → ⭐ 现代LLM主流 → “霍夫曼编码/压缩算法”

 **工程师视角：** 这就像 **LZW 压缩**或**霍夫曼编码**。用有限的码表（通常 3万-10万）尽可能覆盖最多的语义。

```python
# 类比：智能压缩算法  
text = "apologizing"  

# 词级分词（如果词表没有这个词）  
word_level = ["[UNK]"]  # ❌ 无法识别  

# 子词级分词  
subword_level = ["apolog", "izing"]  # ✅ 灵活组合  
```

核心优势：

1. 词表更具表达力：==一个词根 + 多个后缀 = 高效表示==  

```python
# 一个词根 + 多个后缀 = 高效表示  
vocab = {  
	"apolog": 1,  
	"-y": 2,      # apology  
	"-ize": 3,    # apologize  
	"-etic": 4,   # apologetic  
	"-ist": 5,    # apologist  
}  
```
2. 永不 `OOV`：任何新词都能拆成已知的子词
3. 上下文效率更高：
```
字符级：p-l-a-y (4个Token)  
子词级：play (1个Token)  

→ 相同上下文长度内，子词级能容纳3倍文本！  
```

技术实现：BPE、WordPiece、SentencePiece

>  **OOV（Out Of Vocabulary）**：指**词表外的词**，即分词器无法识别的新词或未知词元1——这些词会被替换为 `[UNK]`（未知词元）标记

---

## 3️⃣ 字符级分词（Character-Level）

```python
# 类比：处理 char[] 数组  
text = "play"  
tokens = list(text)  # ['p', 'l', 'a', 'y']  
```

优势：

- ✅ 永不OOV（只要26个字母 + 标点）
- ✅ 分词简单

致命缺陷：

```python
# 问题：建模负担剧增  
# 模型不仅要学"play"的含义，还要学如何拼写p-l-a-y  

# 上下文浪费  
context_length = 1024  
subword_text = "约1000个单词"  
char_text = "约300个单词"  # 效率仅为子词级的1/3  
```

---

## 4️⃣ 字节级分词（Byte-Level）

这是为了解决多语言和特殊字符（如 Emoji、生僻字）的终极方案。

```python
# 类比：直接操作 UTF-8 字节流  
text = "♫"  
bytes_tokens = text.encode('utf-8')  # b'\xe2\x99\xab'  
# → [0xe2, 0x99, 0xab]  
```

特点：

- 🌍 真正的"免分词"（Tokenization-Free）
- 🌏 完美支持多语言/emoji
- 📊 GPT-2/RoBERTa 将字节作为最终备选方案

区别说明：

```python
# ⚠️ 注意区分  

# 纯字节级分词器（CANINE、ByT5）  
all_text → bytes  # 所有内容都用字节表示  

# 混合方案（GPT-2）  
common_words → subword_tokens   # 常见词用子词  
rare_chars   → byte_fallback    # 罕见字符才用字节  
```

---

## 实际案例：同一文本的不同切分

```python
text = "Have the ♫ bards"  

# 词级  
["Have", "the", "[UNK]", "bards"]  

# 子词级（GPT风格）  
["Have", "the", "♫", "b", "ards"]  

# 字符级  
["H", "a", "v", "e", " ", "t", "h", "e", " ", "♫", " ", "b", "a", "r", "d", "s"]  

# 字节级  
[0x48, 0x61, 0x76, 0x65, 0x20, 0x74, 0x68, 0x65, 0x20, 0xe2, 0x99, 0xab, ...]  
```

---

## 开发者决策树

```js
需要处理新词/多语言？  
├─ 否 → 词级分词（简单场景）  
└─ 是   
   └─ 需要高效利用上下文？  
      ├─ 是 → 子词级分词 ⭐（推荐）  
      └─ 否  
         └─ 极致通用性？  
            ├─ 是 → 字节级分词（研究前沿）  
            └─ 否 → 字符级分词（教学/特定场景）  
```

---

## 关键要点总结

1. 现代LLM主流选择：子词级分词（GPT、BERT、T5都用这个）
2. 权衡三角：
    
    ```
          词表大小         /    \      /      \ 灵活性 ←→ 效率  
    ```
    
1. 技术演进方向：从词级 → 子词级 → 字节级（更通用）
2. 实践建议：除非有特殊需求，直接用预训练模型的分词器

---

一句话记忆：子词级 = SQL的索引优化，既不像全表扫描（字符级）那么慢，也不像固定查询（词级）那么死板！
