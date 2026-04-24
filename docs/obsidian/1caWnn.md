# 词元嵌入（代码版本说明）

`#2025/12/28` `#ai` 

> 如果不好理解，先读 [213. 词云嵌入（会编程的高中生版本）](/KJKUmV)

## 承接前文：从字符串到数字的桥梁

- 前文：
	- 我们解决了"`如何切分文本`"（分词）  
- 现在要解决"`如何用数字表示这些词元`"（嵌入）

```python
# 问题本质  
文本 = "Hello world"  
词元列表 = ["Hello", "world"]  # 2.1节：分词  
数字矩阵 = [[0.1, 0.5, ...], [0.3, 0.8, ...]]   # 2.2节：嵌入 
```

## 核心概念：词元嵌入 = 词元 ID 到 向量的映射表

### 💡 类比：HashMap in Action

```python
# 传统HashMap
user_db = {  
    "user_123": {
	    "name": "Alice", 
	    "age": 25
	},  
    "user_456": {
	    "name": "Bob", 
	    "age": 30
	}  
}  

# 词元嵌入（Token Embedding）  
embedding_matrix = {  
    0: [0.12, 0.45, 0.89, ...],    # 词元ID=0 → 向量  
    1: [0.67, 0.23, 0.11, ...],    # 词元ID=1 → 向量  
    50257: [-0.34, 0.78, ...]      # 词元ID=50257 → 向量  
}  
```

关键差异：

- `HashMap` 值是结构化数据（字符串、数字）
- 嵌入矩阵的值是`高维向量`（通常 384维、768维、1024维）
- 向量的`每个维度`捕捉词元的某种语义特征

>  [214. 为什么词元嵌入通常是 384维、768维、1024维？](/2OtwMg)

## 语言模型的静态嵌入层

一句话总结：嵌入矩阵 = 一个大表格（词表大小×向量维度），用词元ID查表得到向量，O(1)超快，就像用学号查学生信息

### 📦 存储结构：嵌入矩阵

```python
class LanguageModel:  
    def __init__(self, vocab_size=50000, embedding_dim=768):  
        # 核心：嵌入矩阵是模型的第一层  
        self.embedding_matrix = torch.randn(vocab_size, embedding_dim)  
        #                              ↑           ↑  
        #                         词表大小    每个词元的向量维度  
        
    def get_embedding(self, token_id):  
        # 本质上就是数组查询 O(1)  
        return self.embedding_matrix[token_id]  
```

| 参数              | 含义   | 游戏类比       | 实际例子          |
| --------------- | ---- | ---------- | ------------- |
| `vocab_size`    | 词表大小 | 游戏中有多少种装备  | 50,000 个不同的词元 |
| `embedding_dim` | 向量维度 | 每件装备有多少个属性 | 768 个属性值      |

生成示例：

```
                  维度0   维度1   维度2   ...  维度767  
词元ID 0 (如"the")  [0.12,  0.45,  0.89,  ...,  0.34]  
词元ID 1 (如"a")    [0.67,  0.23,  0.11,  ...,  0.78]  
词元ID 2 (如"is")   [0.34,  0.78,  0.56,  ...,  0.91]  
...  
词元ID 49999        [0.21,  0.65,  0.32,  ...,  0.44]  
```

`torch.randn` 的作用

```python
torch.randn(50000, 768)  # 生成 50000×768 的随机矩阵  
```

- ✅ **随机初始化**：刚开始向量值是随机的（不知道词的含义）
- ✅ **正态分布**：值大多在 -1 到 1 之间（防止数值过大或过小）
- ⚠️ **训练前无意义**：这些随机数没有语义，需要通过训练调整

实际例子：

```python
# GPT-2 分词器词表大小：50,257  
# 每个词元向量维度：768  

# 下载模型时你会得到：  
embedding_matrix.shape = (50257, 768)  # 约38MB的参数量  


# GPT-2 的配置  
model = LanguageModel(vocab_size=50257, embedding_dim=768)  

# 小型模型配置  
model_small = LanguageModel(vocab_size=30000, embedding_dim=384)  

# 大型模型配置  
model_large = LanguageModel(vocab_size=100000, embedding_dim=3072) 
```

训练如何改变嵌入矩阵？

```python
# 训练前（随机初始化）  
"king"  → [0.12, -0.45, 0.89, ...]  # 随机值  
"queen" → [-0.67, 0.23, -0.11, ...]  # 随机值  
# 两个向量完全不相关  

# 训练后（学习到语义）  
"king"  → [0.52, 0.83, 0.21, ...]  
"queen" → [0.48, 0.79, 0.25, ...]  
# 两个向量非常接近！✅  
```

**训练过程** = 反向传播不断调整嵌入矩阵的值，让相似词的向量靠近。

### 🔗 分词器与模型的强绑定关系

```python
# ❌ 错误：混用不同的分词器和模型  
gpt2_model = load_model("gpt2")  
bert_tokenizer = load_tokenizer("bert")  
token_ids = bert_tokenizer("Hello")  # [101, 7592, 102]  
embeddings = gpt2_model.embedding(token_ids)  # 💥 维度不匹配！  

# ✅ 正确：配套使用  
gpt2_tokenizer = load_tokenizer("gpt2")  
token_ids = gpt2_tokenizer("Hello")  # [15496]  
embeddings = gpt2_model.embedding(token_ids)  # ✅ 正常工作  
```

原因：

- BERT词表：30,522 个 词元
- GPT-2词表：50,257 个 词元
- 模型的嵌入矩阵维度`必须匹配`分词器词表大小

## 上下文相关嵌入：从static到dynamic

### 🆚 静态 vs 动态嵌入

```python
# 静态嵌入（word2vec、GloVe）  
word2vec["bank"]  # 永远返回相同的向量  
# → [0.12, 0.45, 0.89, ...]  无论上下文  

# 问题："bank"在不同句子中含义不同  
sentence1 = "I went to the bank to deposit money"  # 银行  
sentence2 = "I sat on the river bank"              # 河岸  
# 但向量完全相同 ❌  
```

```python
# 动态嵌入（Transformer LLM）  
model = AutoModel.from_pretrained("bert-base")  

sentence1 = "I went to the bank to deposit money"  
sentence2 = "I sat on the river bank"  

embedding1 = model(sentence1)["bank"]  # → [0.12, 0.45, ...]  
embedding2 = model(sentence2)["bank"]  # → [0.34, 0.78, ...]  不同！✅  
```

---

### 🧠 如何生成上下文相关嵌入

代码实战：

```python
from transformers import AutoModel, AutoTokenizer  

# 加载模型  
tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-v3-xsmall")  
model = AutoModel.from_pretrained("microsoft/deberta-v3-xsmall")  

# 输入文本  
text = "Hello world"  

# Step 1: 分词  
tokens = tokenizer(text, return_tensors='pt')  
# 输出：{'input_ids': [101, 7592, 2088, 102](#), ...}  

# Step 2: 前向传播 
output = model(tokens)[0]  
# 输出形状：[1, 4, 384]  
#          ↑  ↑  ↑  
#       batch词元数向量维度  
```

解释输出：

```python
output.shape  # torch.Size([1, 4, 384])  

# 4个词元：  
# [0] [CLS]  → [0.12, 0.45, ...] (384维)  
# [1] Hello  → [0.67, 0.23, ...] (384维)  
# [2] world  → [0.89, 0.11, ...] (384维)  
# [3] [SEP]  → [0.34, 0.78, ...] (384维)  
```

---

### 🎯 处理流程对比

#### 静态嵌入流程  

```python
# 静态嵌入流程  
text = "bank"  
    ↓  
token_id = 1234  
    ↓  
embedding = embedding_matrix[1234]  # 直接查表  
    ↓  
[0.12, 0.45, 0.89, ...]  # 完成  
```

#### 动态嵌入流程（Transformer）  

```python
# 动态嵌入流程（Transformer）  
text = "I went to the bank"  
    ↓  
token_ids = [101, 1045, 2253, 2000, 1996, 2924, 102]  # 分词  
    ↓  
static_embeddings = embedding_matrix[token_ids]  # 初始嵌入  
    ↓  
contextual_embeddings = transformer_blocks(static_embeddings)  # 经过N层处理  
    ↓  
[                                         # 每个词元都携带上下文信息  
    [0.12, ...],  # [CLS]  
    [0.34, ...],  # I  
    ...  
    [0.78, ...],  # bank ← 这个向量现在包含"银行"的语义  
    [0.91, ...]   # [SEP]  
]  
```

## 实际应用场景

### 1️⃣ 命名实体识别（NER）

```python
sentence = "Apple is looking at buying UK startup for $1 billion"  
embeddings = model(sentence)  

# 每个词元的嵌入现在包含上下文  
# "Apple" → 向量会更接近"公司"而非"水果"  
# "UK" → 向量会被识别为地理位置  
```

### 2️⃣ 抽取式文本摘要

```python
document = """  
GPT-4 is a large language model. It can generate text.  
The model was trained on internet data.  
"""  

# 获取每个句子的嵌入  
sentence_embeddings = model(document)  

# 计算每个句子的重要性分数  
scores = calculate_importance(sentence_embeddings)  

# 选择Top-K句子作为摘要  
summary = extract_top_sentences(document, scores, k=2)  
```

### 3️⃣ 语义搜索

```python
# 文档库  
docs = [  
    "Python is a programming language",  
    "Machine learning uses algorithms",  
    "Deep learning is a subset of ML"  
]  

# 生成文档嵌入  
doc_embeddings = [model(doc) for doc in docs]  

# 查询  
query = "What is Python?"  
query_embedding = model(query)  

# 找最相似的文档  
similarities = cosine_similarity(query_embedding, doc_embeddings)  
best_match = docs[argmax(similarities)]  
```

---

## 关键技术细节

### 📐 维度设计

```python
# 常见维度配置  
模型             | 词表大小 | 嵌入维度  
----------------|---------|--------  
BERT-base       | 30,522  | 768  
GPT-2           | 50,257  | 768  
GPT-3           | 50,257  | 12,288  
Phi-3-mini      | 32,000  | 3,072  
```

权衡：

- 维度越高 = 表达能力越强 = 模型越大 = 推理越慢
- 维度越低 = 模型越小 = 表达能力受限

---

### ⚡ 性能优化

```python
# 批处理嵌入  
texts = ["Hello", "World", "Python"] * 1000  # 3000个句子  

# ❌ 低效：逐个处理  
embeddings = [model(text) for text in texts]  # 3000次前向传播  

# ✅ 高效：批处理  
batch_size = 32  
embeddings = model(texts, batch_size=batch_size)  # 94次前向传播  
```

---

## 常见误区

### ❌ 误区1：词元嵌入 = 词向量

```python
# word2vec是词向量（静态）  
word2vec["king"] - word2vec["man"] + word2vec["woman"] ≈ word2vec["queen"]  

# Transformer词元嵌入是动态的，不能这样简单计算  
bert("king") 在不同上下文中向量不同  
```

### ❌ 误区2：可以直接修改嵌入矩阵

```python hl:4
# ❌ 错误  
model.embedding_matrix[100] = my_custom_vector  # 破坏训练好的权重  

# ✅ 正确：微调整个模型  
model.train()  
optimizer.step()  # 通过反向传播更新  
```

### ❌ 误区3：嵌入向量可以跨模型复用

```python
# ❌ 错误  
gpt2_embedding = gpt2_model.get_embedding("hello")  
bert_model.use_embedding(gpt2_embedding)  # 语义空间不同！  

# ✅ 正确：每个模型有自己的嵌入空间  
```

---

## 一句话总结

- 词元嵌入 = `词元ID到高维向量的映射表`，是LLM的"`第一层神经网络`"
- 静态嵌入（word2vec）：
	- 查表直接返回  
- 动态嵌入（Transformer）：
	- 查表 + N层处理 → 包含上下文的向量

开发者记住三点：
1. 嵌`入矩阵`与`分词器强`绑定，不可混用
2. `Transformer生成`的是`上下文相关嵌入`，同一词在不同句子中向量不同
3. `嵌入维度`决定了`表达能力`和`计算成本`的平衡
