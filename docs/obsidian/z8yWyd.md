# LLM之外的词嵌入：代码详解篇

`#2025/12/28` `#ai` 

## 核心观点：嵌入 = 通用的特征工程框架

你可能以为"词嵌入"只能用在 NLP 领域，但实际上嵌入是一个通用的机器学习模式——`给任何对象分配有意义的向量表示`。

```python
# 嵌入的本质：对象 → 向量映射  
词嵌入:    "Python"        → [0.1, 0.5, 0.8, ...]  
用户嵌入:   user_12345      → [0.3, 0.7, 0.2, ...]  
商品嵌入:   product_789     → [0.6, 0.2, 0.9, ...]  
歌曲嵌入:   "Shape of You"  → [0.4, 0.8, 0.1, ...]  
```

为什么这很强大？ 一旦你把对象变成向量，就可以用简单的数学运算来：
- 计算相似度（推荐系统）
- 做聚类分析（用户分群）
- 可视化分析（降维展示）

## 使用预训练词嵌入

### 🎯 场景：快速启动NLP项目

假设你要做情感分析，但没有GPU训练复杂模型。`预训练词嵌入`就是你的救星。

```python
import gensim.downloader as api  

# 下载预训练嵌入（66 MB，训练自维基百科）  
model = api.load("glove-wiki-gigaword-50")  

# 立即使用！  
similar_words = model.most_similar([model['king']], topn=5)  
print(similar_words)  
# 输出：  
# [('prince', 0.82), ('queen', 0.78), ('emperor', 0.77), ...]  
```

### 📦 可用的预训练模型

```python
# word2vec（Google训练，新闻语料）  
model = api.load("word2vec-google-news-300")  # 300维，1.7GB  

# GloVe（斯坦福训练，维基百科+新闻）  
model = api.load("glove-wiki-gigaword-50")    # 50维，66MB  
model = api.load("glove-wiki-gigaword-100")   # 100维，128MB  
model = api.load("glove-wiki-gigaword-200")   # 200维，252MB  
```

### 🔍 实际应用示例

```python
# 场景1：词语相似度搜索  
query = "programming"  
similar = model.most_similar(query, topn=10)  
# 结果：coding, software, development, algorithm...  

# 场景2：类比推理（经典案例）  
result = model.most_similar(  
    positive=['king', 'woman'],   
    negative=['man'],   
    topn=1  
)  
# king - man + woman ≈ queen  

# 场景3：词语关系判断  
similarity = model.similarity('cat', 'dog')      # 0.76 高相似  
similarity = model.similarity('cat', 'laptop')   # 0.12 低相似  
```

### ⚠️ 预训练嵌入的局限性

- 问题1：词表外词汇（OOV）  
- 问题2：静态表示（无上下文） 
- 问题3：训练数据偏见  

```python hl:1,7,12
# 问题1：词表外词汇（OOV）  
try:  
    vec = model['ChatGPT']  # 💥 KeyError!  
except KeyError:  
    print("词不在词表中")  

# 问题2：静态表示（无上下文）  
bank_vec = model['bank']  # 永远相同  
# 无法区分：  
# "river bank"（河岸） vs "money bank"（银行）  

# 问题3：训练数据偏见  
# 如果训练数据有偏见，嵌入也会有偏见  
# 例如：某些职业词与性别的不当关联  
```

## word2vec算法与对比训练

### 💡 核心思想：You shall know a word by the company it keeps

Distributional Hypothesis（分布假设）：意思相近的词，上下文也相近。

```python
# 例子：  
句子A: "The dog chased the cat"  
句子B: "The puppy chased the mouse"  

# "dog" 和 "puppy" 上下文相似 → 嵌入向量应该接近  
# "cat" 和 "mouse" 上下文相似 → 嵌入向量应该接近  
```

---

### 🛠️ word2vec训练流程详解

#### Step 1：滑动窗口生成训练样本

```python
text = "Thou shalt not make a machine in the likeness"  
window_size = 2  # 左右各看2个词  

# 滑动窗口示例  
# 中心词: "make"  
# 上下文: ["not", "shalt", "a", "machine"]  

# 生成正例样本（实际相邻的词对）  
positive_pairs = [  
    ("make", "not"),      # label = 1  
    ("make", "shalt"),    # label = 1  
    ("make", "a"),        # label = 1  
    ("make", "machine"),  # label = 1  
]  
```

#### Step 2：负采样（Negative Sampling）

```python
# 问题：如果只有正例，模型会作弊（永远输出1）  

# 解决：添加负例（随机选择不相邻的词）  
negative_pairs = [  
    ("make", "playback"),    # label = 0（随机选的）  
    ("make", "sublime"),     # label = 0  
    ("make", "apothecary"),  # label = 0  
]  

# 训练数据集  
training_data = [  
    # 正例  
    ("make", "not", 1),  
    ("make", "shalt", 1),  
    # 负例  
    ("make", "playback", 0),  
    ("make", "sublime", 0),  
]  
```

#### Step 3：神经网络训练

```python
import torch  
import torch.nn as nn  

class Word2VecModel(nn.Module):  
    def __init__(self, vocab_size, embedding_dim):  
        super().__init__()  
        # 核心：嵌入矩阵（就像2.2节讲的）  
        self.embeddings = nn.Embedding(vocab_size, embedding_dim)  
        # 输出层：预测是否相邻  
        self.output = nn.Linear(embedding_dim * 2, 1)  
        
    def forward(self, word1_id, word2_id):  
        # 查询两个词的嵌入  
        vec1 = self.embeddings(word1_id)  
        vec2 = self.embeddings(word2_id)  
        
        # 拼接后预测  
        combined = torch.cat([vec1, vec2], dim=-1)  
        score = self.output(combined)  
        return torch.sigmoid(score)  # 输出0-1之间的概率  

# 训练过程（伪代码）  
model = Word2VecModel(vocab_size=50000, embedding_dim=300)  
optimizer = torch.optim.Adam(model.parameters())  
loss_fn = nn.BCELoss()  

for word1, word2, label in training_data:  
    prediction = model(word1, word2)  
    loss = loss_fn(prediction, label)  
    loss.backward()  # 反向传播更新嵌入矩阵  
    optimizer.step()  
```

训练后的效果：

- 经常一起出现的词 → 嵌入向量接近
- 很少一起出现的词 → 嵌入向量远离

---

### 🎨 可视化word2vec的训练过程

```
训练前（随机初始化）：  
"king"  → [0.12, -0.45, 0.89]  
"queen" → [-0.67, 0.23, -0.11]  
余弦相似度：0.03（几乎不相关）  

训练后（学习到语义）：  
"king"  → [0.52, 0.83, 0.21]  
"queen" → [0.48, 0.79, 0.25]  
余弦相似度：0.95（非常相似）✅  
```

---

## 🔗 word2vec 与 现代LLM的联系

### 对比学习（Contrastive Learning）的普适性

```python
# word2vec的思想（2013）  
任务：判断两个词是否相邻  
输入：(word1, word2)  
输出：相邻=1，不相邻=0  

# CLIP的思想（2021）  
任务：判断图像和文本是否匹配  
输入：(image, text)  
输出：匹配=1，不匹配=0  

# 句子嵌入的思想（SBERT）  
任务：判断两个句子是否相似  
输入：(sentence1, sentence2)  
输出：相似=1，不相似=0  
```

核心模式：

1. 构造正例对（相关的）和负例对（不相关的）
2. 训练模型拉近正例、推远负例
3. 副产品：学到有意义的嵌入向量

---

## 实战案例：从词嵌入到推荐系统

### 🎵 歌曲推荐系统（预告2.5节）

```python
# 核心思想：用word2vec的方法训练歌曲嵌入  
# 把播放列表当作"句子"，歌曲当作"词"  

# 示例播放列表（用户的听歌记录）  
playlists = [  
    ["Shape of You", "Perfect", "Thinking Out Loud"],  # Ed Sheeran风格  
    ["Bohemian Rhapsody", "We Will Rock You", "Radio Ga Ga"],  # Queen  
    ["Perfect", "Photograph", "Lego House"],  # 抒情歌  
]  

# 训练word2vec（代码完全一样！）  
from gensim.models import Word2Vec  
model = Word2Vec(sentences=playlists, vector_size=100, window=3)  

# 推荐功能  
similar_songs = model.wv.most_similar("Perfect", topn=5)  
# 输出：Thinking Out Loud, Photograph, Shape of You...  
```

为什么这能工作？

- 经常在同一播放列表出现的歌 → 风格相似
- 滑动窗口 = 用户听歌的连续性
- 嵌入向量 = 歌曲的"风格特征"

---

## 🚀 工程实践建议

### 何时使用预训练词嵌入？

✅ 适合场景：

```python
# 1. 快速原型验证  
# 2. 计算资源有限  
# 3. 数据量较小（<10k样本）  
# 4. 任务对上下文要求不高（如关键词匹配）  

from gensim.downloader import api  
model = api.load("glove-wiki-gigaword-50")  # 即插即用  
```

❌ 不适合场景：

```python
# 1. 需要上下文理解（如情感分析）  
# 2. 领域特定词汇（如医疗、法律）  
# 3. 多义词处理（bank的不同含义）  
# 4. 2013年后的新词（ChatGPT、Bitcoin等）  

# 此时应该用：BERT、RoBERTa等上下文嵌入  
```

### 性能对比

|方法|训练成本|推理速度|准确度|适用场景|
|---|---|---|---|---|
|word2vec|⭐ 低|🚀🚀🚀 极快|⭐⭐ 中等|关键词搜索、快速原型|
|BERT|⭐⭐⭐ 高|🚀 较慢|⭐⭐⭐⭐ 高|语义理解、分类任务|
|sentence-transformers|⭐⭐ 中|🚀🚀 快|⭐⭐⭐⭐ 高|语义搜索、RAG系统|

---

## 一句话总结

`词嵌入`的思想超越了NLP领域——`任何可以表示成"序列"的数据`（播放列表、用户行为、商品浏览记录）都可以用word2vec的方法训练嵌入，从而实现推荐、搜索、聚类等功能。

开发者记住三点：
1. 🎯 预训练嵌入：下载即用，适合快速验证想法
2. 🧠 word2vec原理：对比学习（正负例）是现代AI的基石
3. 🔄 通用模式：词→歌曲→商品→用户，同一套算法解决不同问题
