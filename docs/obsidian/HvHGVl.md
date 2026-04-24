# 语言模型驱动的语义搜索实践

`#2025/12/31` `#ai` 

> 这一节我们将逐一攻克稠密检索、重排序和RAG的实现细节。

## 一、稠密检索：让搜索理解语义

### 核心思想回顾

**把文本变成`向量`，通过`向量距离`找到最相关的文档**。

### 形象理解

如图所示：

```
向量空间（想象成一个地图）：  

    文本2 ●  （语义相似）  
         
查询 ★      文本1 ●  （语义相近）  

                   文本3 ●（距离远，不相关）  
```

![{%}|544](https://www.ituring.com.cn/figures/2025/HandsonLLM/173.jpg)

> **图 ：词嵌入的几何化诠释：文本在向量空间中的位置分布反映其语义相关性**

**关键洞察**：
- 语义相似的文本在向量空间中彼此靠近
- 距离近 = 内容相关
- 不需要关键词完全匹配！

---

### 工作流程详解

完整的稠密检索包含`5个步骤`：

```
[准备阶段]  
文档库 → 分块 → 嵌入模型 → 向量 → 存入向量数据库  

[检索阶段]  
用户查询 → 嵌入模型 → 查询向量 → 向量数据库搜索 → 返回最相似文档  
:::如下图：：：
```

![{%}|640](https://www.ituring.com.cn/figures/2025/HandsonLLM/174.jpg)

> **图：稠密检索依赖于查询对象与相关结果在嵌入空间中的相似性**

---

### 步骤1：文档分块

**为什么要分块？**

```python
# 问题：一篇长文档可能包含多个主题  
原始文档（5000字）：  
第1段：讲产品价格  
第2段：讲技术参数  
第3段：讲售后服务  

用户查询："这个产品多少钱？"  

# 如果整篇文档作为一个向量  
→ 向量混合了价格、参数、服务信息  
→ 相似度被稀释  

# 如果按段落分块  
段落1向量：纯粹的价格信息 ← 高度匹配！  
段落2向量：技术参数  
段落3向量：售后服务  
```

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/175.jpg)

> **图：将外部知识库转换为`向量数据库`，通过`嵌入`处理实现知识库的智能化查询*

![{%}|640](https://www.ituring.com.cn/figures/2025/HandsonLLM/176.jpg)  

> **图：虽然采用单个向量表示整个文档可行，但对篇幅较长的文档建议采用分块嵌入方案**  

### 常见分块策略

如下表：

|策略|做法|优点|缺点|
|---|---|---|---|
|**按句子**|每个句子一块|粒度细|上下文不足|
|**按段落**|每个段落一块|平衡|段落太长时效果差|
|**固定长度**|每3-8句一块|可控|可能切断语义|
|**重叠窗口**|相邻块有重复内容|保留上下文|存储空间增加|

![{%}|688](https://www.ituring.com.cn/figures/2025/HandsonLLM/178.jpg)  

> **图 ：文档分块生成嵌入向量的多种方式**  

### 重叠窗口示例

如图8-10所示：

```
原文：A B C D E F G H I J  

块1：A B C D E  
块2：    D E F G H     ← 与块1重叠D、E  
块3：        F G H I J ← 与块2重叠F、G、H  
```

> **好处**：即使关键信息在块的边界，也不会丢失上下文！

![{%}|624](https://www.ituring.com.cn/figures/2025/HandsonLLM/179.jpg)  

> **图：采用重叠式文本分块策略可有效保留不同片段间的上下文相关性**  

---

### 步骤2：生成嵌入向量

```python
from sentence_transformers import SentenceTransformer  

# 加载嵌入模型  
model = SentenceTransformer('all-mpnet-base-v2')  

# 文档分块  
texts = [  
    "MacBook Pro价格是$2,249",  
    "MacBook Pro采用M3芯片",  
    "官网有优惠活动"  
]  

# 生成嵌入向量  
embeddings = model.encode(texts)  

print(embeddings.shape)  
# 输出：(3, 768)   
# 3个文档，每个768维向量  
```

### 步骤3：选择嵌入模型

**重要考虑因素**：

|因素|说明|推荐|
|---|---|---|
|**模型大小**|影响速度和资源|小数据集用小模型|
|**向量维度**|影响精度和存储|一般384-768维|
|**训练数据**|是否包含你的领域|优先领域相关模型|
|**性能指标**|MTEB排行榜得分|参考但不盲从|

**常用模型**：

```python
# 通用场景  
'all-mpnet-base-v2'           # 平衡性能  

# 多语言  
'paraphrase-multilingual-MiniLM-L12-v2'  

# 速度优先  
'all-MiniLM-L6-v2'            # 小而快  

# 精度优先  
'BAAI/bge-large-en-v1.5'     # 大而准  
```

---

### 步骤4：向量数据库

**为什么需要专门的数据库？**

```python
# 小数据集（< 10,000个向量）  
用NumPy就够了：  
similarities = np.dot(query_vector, document_vectors.T)  

# 大数据集（> 100,000个向量）  
需要向量数据库：  
- 快速近似搜索（ANN）  
- 支持动态增删  
- 分布式扩展  
```

---

### 向量数据库选择

|方案|类型|适用场景|
|---|---|---|
|**FAISS**|库|静态数据，离线处理|
|**Annoy**|库|中等规模，内存有限|
|**Pinecone**|云服务|生产环境，托管方案|
|**Weaviate**|开源数据库|需要高级功能|
|**Chroma**|轻量数据库|快速原型|

### 实战示例：完整的稠密检索

```python
import numpy as np  
from sentence_transformers import SentenceTransformer  

# 1. 加载模型  
model = SentenceTransformer('all-mpnet-base-v2')  

# 2. 准备文档  
texts = [  
    "MacBook Pro价格$2,249，配备M3芯片",  
    "iPhone 15 Pro售价$999",  
    "iPad Air价格$599"  
]  

# 3. 生成文档嵌入  
doc_embeddings = model.encode(texts)  

# 4. 用户查询  
query = "MacBook多少钱？"  
query_embedding = model.encode([query])[0]  

# 5. 计算相似度  
similarities = np.dot(doc_embeddings, query_embedding)  

# 6. 排序并返回Top 3  
top_indices = np.argsort(similarities)[::-1][:3]  

print("搜索结果：")  
for i, idx in enumerate(top_indices, 1):  
    print(f"{i}. 相似度{similarities[idx]:f}: {texts[idx]}")  
```

**输出**：

```
搜索结果：  
1. 相似度0.856: MacBook Pro价格$2,249，配备M3芯片  
2. 相似度0.234: iPhone 15 Pro售价$999  
3. 相似度0.189: iPad Air价格$599  
```

![{%}|648](https://www.ituring.com.cn/figures/2025/HandsonLLM/180.jpg)  

> **图：通过比较向量相似度可快速定位与查询最匹配的文档**  

---

### 步骤5：微调嵌入模型

**为什么要`微调`？**

```
【通用】嵌入模型：  
查询："星际穿越上映时间"  
匹配文档："Interstellar premiered on..."  ✅  

你的领域（医疗）：  
查询："CT 扫描的辐射剂量"  
通用模型可能匹配到不太相关的文档 ❌  

微调后：  
理解医疗术语的语义关系 ✅  
```

---

### 微调的核心原理

```
训练数据：  
相关查询对：  
- "星际穿越上映" → "Interstellar premiered on Oct 26, 2014"  
- "星际穿越发布日期" → 同一文档  

不相关查询：  
- "星际穿越演员" → 不同文档  

微调目标：  
拉近相关查询与文档的距离 ←  
推远不相关查询与文档的距离 →  
```

---

## 二、精细优化排序

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/183.jpg)

> **图 ：LLM 重排器作为搜索流程组件，其目标是根据相关性对候选搜索结果重新排序**

### 为什么需要重排序？

**问题场景**：

```
第一阶段搜索（如BM25关键词搜索）：  
快速从100万文档中筛选出Top 100  
但排序可能不够精准  

第二阶段重排序：  
用更强的模型对Top 100重新排序  
计算量小，但精度高  
```

---

### 工作流程

```
查询："MacBook Pro价格"  
    ↓  
[第一阶段]快速检索  
返回候选：  
1. 文档40 （相关性：中）  
2. 文档68 （相关性：低）  
3. 文档2  （相关性：高）← 但排在第3！  
    ↓  
[第二阶段]重排器深度分析  
每个文档与查询联合编码  
    ↓  
重新排序：  
4. 文档2  （分数：0.80）← 提升到第1！  
5. 文档40 （分数：0.20）  
6. 文档68 （分数：0.15）  
```

---

### 重排序的核心机制

**monoBERT方法**：

```python
# 伪代码  
for 每个候选文档 in Top100:  
    输入 = [查询文本, 文档文本]  
    分数 = BERT模型(输入)  
    # 输出0-1之间的相关性分数  
    
# 按分数重新排序  
```

**关键区别**：

|维度|稠密检索|重排序|
|---|---|---|
|**输入方式**|查询和文档分别编码|查询+文档联合编码|
|**处理量**|百万级文档|百级候选|
|**速度**|快|慢|
|**精度**|中等|高|

---

### 实战示例：使用`Cohere`重排序

```python
from sentence_transformers import CrossEncoder  

# 加载重排序模型  
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')  

# 候选文档  
query = "MacBook Pro价格"  
candidates = [  
    "MacBook Pro价格$2,249",  
    "iPhone的摄像头很好",  
    "笔记本电脑推荐"  
]  

# 生成相关性分数  
scores = reranker.predict([  
    [query, doc] for doc in candidates  
])  

# 排序  
ranked = sorted(  
    zip(candidates, scores),  
    key=lambda x: x[1],  
    reverse=True  
)  

for doc, score in ranked:  
    print(f"分数{score:f}: {doc}")  
```

**输出**：

```
分数0.876: MacBook Pro价格$2,249  
分数0.234: 笔记本电脑推荐  
分数0.089: iPhone的摄像头很好  
```

---

## 三、 检索评估指标体系

### 为什么需要评估？

```
问题：  
你搭建了搜索系统，如何知道它好不好？  
如何对比两个系统的优劣？  

解决：  
需要标准化的评估方法  
```

---

### 评估的三大要素

```
1. 文档库：被搜索的文档集合  
2. 查询集合：测试用的查询列表  
3. 相关性判断：哪些文档是相关的（人工标注）  
```

---

### 核心指标：均值平均精确率（`mAP`）

**概念理解**：

```
单个查询的平均精确率（AP）：  

查询："MacBook价格"  
相关文档：文档2、文档5、文档7（人工标注）  

系统返回Top 5：  
位置1：文档2 ✅  精确率 = 1/1 = 1.00  
位置2：文档1 ❌  
位置3：文档5 ✅  精确率 = 2/3 = 0.67  
位置4：文档3 ❌  
位置5：文档7 ✅  精确率 = 3/5 = 0.60  

AP = (1.00 + 0.67 + 0.60) / 3 = 0.76  
```

---

### mAP计算步骤

```python
# 1. 计算每个查询的AP  
查询1的AP = 0.76  
查询2的AP = 0.85  
查询3的AP = 0.62  
...  
查询N的AP = 0.71  

# 2. 计算平均值  
mAP = (0.76 + 0.85 + 0.62 + ... + 0.71) / N  
```

---

### 实战代码示例

```python
def calculate_ap(relevant_docs, retrieved_docs):  
    """计算单个查询的平均精确率"""  
    relevant_set = set(relevant_docs)  
    precisions = []  
    relevant_count = 0  
    
    for i, doc in enumerate(retrieved_docs, 1):  
        if doc in relevant_set:  
            relevant_count += 1  
            precision = relevant_count / i  
            precisions.append(precision)  
    
    if not precisions:  
        return 0.0  
    return sum(precisions) / len(relevant_docs)  

def calculate_map(queries_relevance, queries_results):  
    """计算多个查询的mAP"""  
    aps = []  
    for query_id in queries_relevance:  
        relevant = queries_relevance[query_id]  
        retrieved = queries_results[query_id]  
        ap = calculate_ap(relevant, retrieved)  
        aps.append(ap)  
    
    return sum(aps) / len(aps)  

# 示例使用  
relevance = {  
    'q1': ['doc2', 'doc5', 'doc7'],  
    'q2': ['doc1', 'doc3']  
}  

results = {  
    'q1': ['doc2', 'doc1', 'doc5', 'doc3', 'doc7'],  
    'q2': ['doc3', 'doc1', 'doc2']  
}  

mAP = calculate_map(relevance, results)  
print(f"系统mAP: {mAP:f}")  
```

---

## 四、技术组合：最佳实践流程

### 三级流水线架构

```
用户查询："MacBook Pro 2024款的价格和配置"  
    ↓  
[级别1：粗筛]BM25关键词搜索  
从1,000,000文档 → 筛选到1,000候选  
速度：毫秒级  
    ↓  
[级别2：精筛]稠密检索（向量搜索）  
从1,000候选 → 筛选到100候选  
速度：100毫秒级  
    ↓  
[级别3：重排]交叉编码器重排序  
从100候选 → 输出Top 10  
速度：1秒级  
    ↓  
最终结果：高精度的Top 10文档  
```

---

### 为什么这样设计？

|阶段|处理量|方法|速度|精度|
|---|---|---|---|---|
|粗筛|百万级|简单快速|极快|低|
|精筛|千级|语义理解|快|中|
|重排|百级|深度分析|慢|高|

> **核心思想**：用`快速`方法过滤`大量`无关内容，用慢速方法精细优化少量候选！

## 五、实战建议和常见问题

### 建议1：选择合适的块大小

```python
# 经验法则  
场景1：FAQ问答系统  
→ 每个问题一块（小块）  

场景2：技术文档  
→ 每个小节一块（中块，3-5段）  

场景3：长篇小说  
→ 每章节一块，并添加重叠（大块+重叠）  
```

---

### 建议2：向量维度的权衡

```python
# 低维度（384维）  
优点：存储小，速度快  
缺点：精度略低  

# 高维度（1024维）  
优点：精度高  
缺点：存储大，速度慢  

# 推荐  
初期开发：384维（快速迭代）  
生产环境：768维（平衡）  
对精度要求极高：1024维  
```

---

### 建议3：评估指标的选择

|指标|适用场景|优点|
|---|---|---|
|**mAP**|综合评估|考虑排序位置|
|**Recall@K**|召回率优先|关注覆盖率|
|**MRR**|首位准确性|关注第一个结果|

---

## 六、核心要点总结

### 1. 稠密检索核心

```
文档 → 分块 → 嵌入向量 → 向量数据库  
查询 → 嵌入向量 → 相似度搜索 → 返回结果  
```

---

### 2. 重排序核心

```
候选文档 + 查询 → 联合编码 → 相关性分数 → 重新排序  
```

---

### 3. 三大技术对比

|技术|处理量|速度|精度|何时使用|
|---|---|---|---|---|
|稠密检索|大|快|中|第一阶段|
|重排序|小|慢|高|第二阶段|
|混合搜索|大|中|高|组合使用|

---

## 核心启示

**语义搜索的本质**：
- 不是简单的关键词匹配
- 而是**理解查询和文档的语义**
- 通过多阶段流水线
- 平衡速度、精度和成本

就像人类搜索信息：先快速浏览找大方向，再仔细阅读筛选答案！
