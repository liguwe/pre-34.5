# 词云嵌入（会编程的高中生版本）

`#2025/12/28` `#ai`

## 先讲个故事：你的音乐播放列表

假设你有1000首歌，想让电脑推荐"类似的歌"。你会怎么做？

❌ 方法1：用歌名字符串比较

```python
if song1 == "稻香":  
    recommend("七里香")  # 手动写规则，太蠢了  
```

✅ 方法2：给每首歌打分

```python
song_features = {  
    "稻香": [节奏:7, 抒情度:9, 摇滚度:2, 电子感:1],  
    "告白气球": [节奏:6, 抒情度:10, 摇滚度:1, 电子感:2],  
    "夜曲": [节奏:8, 抒情度:5, 摇滚度:7, 电子感:3]  
}  
```

现在可以算相似度了！`稻香`和`告白气球`都是`[抒情度高]`，所以相似。

`词元嵌入`就是这个思路：
- 把每个词元变成一组数字（向量），让电脑能"计算"词的含义。

---

## 核心概念：从字符串到数字数组

### 📱 类比：手机通讯录

```python
# 传统方式：只存名字  
contacts = ["张三", "李四", "王五"]  

# 智能方式：每个人有一堆属性  
contact_db = {  
    "张三": {  
        "年龄": 18,  
        "爱好": ["篮球", "游戏"],  
        "性格": "外向",  
        "成绩": 85  
    }  
}  
```

词元嵌入也一样：

```python
# 简单版本：词元只是字符串  
tokens = ["我", "爱", "编程"]  

# 嵌入版本：每个词元变成数字向量  
embeddings = {  
    "我": [0.2, 0.8, 0.1, ...],      # 768个数字  
    "爱": [0.5, 0.3, 0.9, ...],      # 768个数字  
    "编程": [0.1, 0.2, 0.7, ...]     # 768个数字  
}  
```

---

## 为什么需要这些数字？

### 🎮 游戏角色属性类比 → 算`欧几里得距离`

```python
class GameCharacter:  
    def __init__(self):  
        self.HP = 100          # 血量  
        self.ATK = 50          # 攻击力  
        self.DEF = 30          # 防御  
        self.SPEED = 80        # 速度  
        self.MAGIC = 20        # 魔法  

# 两个角色相似吗？算欧几里得距离！  
战士 = [100, 90, 80, 50, 10]  
骑士 = [120, 85, 90, 45, 15]  # 很像战士  
法师 = [60, 20, 10, 30, 95]   # 完全不同  
```

词元嵌入也一样：

```python
"king"   = [0.5, 0.8, 0.2, 0.1, ...]  
"queen"  = [0.5, 0.7, 0.3, 0.2, ...]  # 很接近  
"apple"  = [0.1, 0.2, 0.9, 0.8, ...]  # 完全不同  
```

---

## 两种嵌入：静态 vs 动态

### 🎯 静态嵌入 = 固定属性的游戏角色

```python hl:1,8
# word2vec：每个词永远是同一个向量  
word2vec = {  
    "bank": [0.2, 0.5, 0.8, ...]  # 永远不变  
}  

sentence1 = "I went to the bank to deposit money"  # 银行  
sentence2 = "I sat on the river bank"              # 河岸  
# "bank" 的向量完全一样！❌ 无法区分含义  
```

### ⚡ 动态嵌入 = 会变身的游戏角色  → 根据上下文改变向量

```python hl:1
# Transformer：根据上下文改变向量  
model = load_model("BERT")  

embedding1 = model("I went to the bank to deposit money")  
# "bank" → [0.2, 0.8, 0.3, ...]  表示"银行"  

embedding2 = model("I sat on the river bank")  
# "bank" → [0.1, 0.3, 0.9, ...]  表示"河岸" ✅  
```

就像游戏角色穿不同装备属性会变：

- 战士 + 魔法杖 → 属性偏向魔法
- 战士 + 大剑 → 属性偏向物理攻击

---

## 代码实战：亲手试试

### 🔧 Step 1：加载模型（

```python
from transformers import AutoModel, AutoTokenizer  

# 下载一个小模型（就像下载LOL客户端）  
model_name = "microsoft/deberta-v3-xsmall"  
tokenizer = AutoTokenizer.from_pretrained(model_name)  
model = AutoModel.from_pretrained(model_name)  
```

### 🔧 Step 2：输入文本，获取嵌入

```python
text = "I love Python programming"  

# 第一步：分词（像把句子拆成单词）  
tokens = tokenizer(text, return_tensors='pt')  
print(tokens['input_ids'])  
# 输出：tensor([101, 1045, 2293, 18750, 4730, 102](#))  

# 第二步：模型处理（像游戏计算角色属性）  
output = model(tokens)[0]  
print(output.shape)  
# 输出：torch.Size([1, 6, 384])  
#        ↑  ↑  ↑  
#      批次 6个词元 每个词元384维向量  
```

### 🔧 Step 3：理解输出

```python
# 一共6个词元（包括特殊词元）  
# [CLS]  I  love  Python  programming  [SEP]  

# 每个词元现在是一个384维向量：  
output[0, 0]  # [CLS] 的向量  
output[0, 1]  # "I" 的向量  
output[0, 2]  # "love" 的向量  
output[0, 3]  # "Python" 的向量  
# ...  
```

---

## 实际应用：你能做什么？

### 🎯 应用1：找相似的代码注释

```python
comments = [  
    "This function sorts the array",  
    "Sort the list in ascending order",  
    "Calculate the sum of two numbers"  
]  

# 获取每条注释的嵌入  
embeddings = [model(text)[0] for text in comments]  

# 用户查询  
query = "How to sort data?"  
query_embedding = model(query)[0]  

# 找最相似的（计算余弦相似度）  
from sklearn.metrics.pairwise import cosine_similarity  
similarities = cosine_similarity(query_embedding, embeddings)  
# 结果：前两条注释匹配度高！  
```

### 🎯 应用2：文本分类（判断是不是Bug报告）

```python
# 训练数据（已经有嵌入向量）  
bug_reports = [  
    "The app crashes when I click save",  
    "Cannot login with correct password"  
]  
feature_requests = [  
    "Add dark mode please",  
    "Support exporting to PDF"  
]  

# 新评论  
new_comment = "App freezes on startup"  
embedding = model(new_comment)[0]  

# 用机器学习分类器判断  
from sklearn.linear_model import LogisticRegression  
classifier = LogisticRegression()  
classifier.fit(train_embeddings, labels)  
prediction = classifier.predict(embedding)  
# 输出：这是一个Bug报告  
```

---

## 关键知识点（考试重点）

### 📌 知识点1：嵌入维度

```python
模型          | 词表大小 | 每个词元向量维度  
-------------|---------|----------------  
BERT-base    | 30,522  | 768  
GPT-2        | 50,257  | 768  
Phi-3-mini   | 32,000  | 3,072  
```

类比：

- 词表大小 = 游戏里有多少种装备
- 向量维度 = 每件装备有多少个属性

### 📌 知识点2：不能混用！

```python
# ❌ 错误：用BERT的分词器 + GPT的模型  
bert_tokenizer = load_tokenizer("bert")  
gpt_model = load_model("gpt2")  

token_ids = bert_tokenizer("Hello")  # [101, 7592, 102]  
embeddings = gpt_model.embed(token_ids)  # 💥 崩溃！  
# 原因：GPT模型的嵌入矩阵只有50,257行  
#      但BERT的token_id可能超过这个范围  
```

类比：就像《王者荣耀》的装备不能用在《英雄联盟》里。

### 📌 知识点3：上下文嵌入 = 智能

```python
# 同一个词在不同句子中向量不同  
sentence1 = "Python is a snake"  
sentence2 = "Python is a programming language"  

embedding1 = model(sentence1)["Python"]  # 偏向"动物"  
embedding2 = model(sentence2)["Python"]  # 偏向"编程"  

# 向量差异很大！✅  
```

---

## 常见误区（高频错误）

### ❌ 误区1：以为词元嵌入可以直接加减

```python
# 在word2vec中可以：  
king - man + woman ≈ queen  # 神奇的向量运算  

# 但在BERT/GPT中不行：  
bert("king") - bert("man") + bert("woman") ≠ bert("queen")  
# 因为这些嵌入依赖上下文，不是静态的  
```

### ❌ 误区2：以为手动修改嵌入有用

```python hl:4
# ❌ 不要这样做  
model.embedding[100] = [1, 2, 3, ...]  # 破坏训练好的权重  

# ✅ 正确方法：微调整个模型  
train_model(data, epochs=3)  
```

### ❌ 误区3：以为所有模型嵌入互通

```python
# ❌ 错误  
gpt_vector = gpt("hello")  
bert_model.use(gpt_vector)  # 两个模型的"坐标系"不同！  

# 就像：  
# 《王者荣耀》的攻击力100 ≠ 《原神》的攻击力100  
```

---

## 一句话总结

词元嵌入 = 把词变成数字向量，让电脑能"计算"词义

- 静态嵌入（word2vec）：
	- 每个词固定一个向量，简单但不够智能
- 动态嵌入（BERT/GPT）：
	- 根据上下文变化，像会变身的角色

记住三句话：

1. 🎮 词元嵌入 = 游戏角色属性表（用数字描述特征）
2. 🔧 分词器和模型必须配套（像游戏和DLC版本要匹配）
3. 🧠 动态嵌入更智能（同一个词在不同句子中向量不同）

---

## 🎁 课后挑战

试试这段代码，感受词元嵌入的魔力：

```python
from transformers import pipeline  

# 加载相似度计算流水线  
model = pipeline("feature-extraction", model="bert-base-uncased")  

# 计算两个句子的相似度  
sentences = [  
    "I love coding in Python",  
    "Python programming is fun",  
    "I like eating pizza"  
]  

# 获取嵌入  
embeddings = [model(s)[0][0] for s in sentences]  

# 问题：哪两句话最相似？  
# （提示：计算余弦相似度）  
```

试试看，你会发现前两句话的向量很接近，第三句很远——这就是嵌入的力量！🚀
