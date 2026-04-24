# 从文本聚类到主题建模：给数据“贴标签”的艺术

`#2025/12/30` `#ai` 

说上一节的“`文本聚类`”是将成千上万篇论文分成了不同的“`堆`”，

那么这一节的“主题建模”就是**给每一堆`起个名字`**，告诉你这一堆到底是讲什么的。

## 架构流程图

![RAG Pipeline with OpenAI-2025-12-30-124338.svg|1123](https://832-1310531898.cos.ap-beijing.myqcloud.com/202520251230204408245.svg)

## 为什么要从“聚类”走向“主题建模”？

做完上一节的聚类后，你手里拿到的是什么？是一堆簇 ID，比如“簇 0”、“簇 1”、“簇 15”。
- **聚类**告诉你：
	- 这 50 篇文档是相似的，属于“簇 0”。
- **问题**：
	- 但“簇 0”是啥意思？是讲“深度学习”还是“量子物理”？你不知道，除非你一篇篇去读。
- **主题建模**的作用：
	- 自动提取关键词，告诉你“簇 0”的主题是 **“手语、翻译、手势”**。

### 传统方法 vs. 新方法 (BERTopic)

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/116.jpg)

> **图：传统上，主题通过`若干关键词`来表示，但也可以采用其他形式**

- **传统方法 (如 LDA)**：
	- 只看词频（词袋模型），不看上下文。它假设一个主题就是一堆词的概率分布。
- **新方法 (BERTopic)**：
	- 这是本节的主角。它结合了**深度学习的理解能力**（嵌入向量）和**传统统计方法的直观性**（词频统计）。

## BERTopic 的核心原理（两步走）

### 1. 前半段：聚类（找圈子）

这一步完全复用上一节讲的流程：

1. **嵌入 (SBERT)**：
	- 把文章变成向量。
2. **降维 (UMAP)**：
	- 把向量变短，方便计算。
3. **聚类 (HDBSCAN)**：
	- 把相似的向量圈在一起，形成簇。

### 2. 后半段：主题表示（贴标签）— 找到主题关键词

这是 `BERTopic` 最精髓的地方。它需要从每个簇里`提取关键词`。它用了一个改良版的 TF-IDF，叫 `**c-TF-IDF (基于类的 TF-IDF)**`。

**通俗理解 c-TF-IDF：**

- **普通 TF-IDF**：
	- 统计`一个词`在一篇**文档**里`重不重要`。
- **c-TF-IDF**：
	- 把**同一个簇里的所有文档拼接成一篇“`超级巨型文档`”**。然后统计一个词在这个**簇**里重不重要。

**公式逻辑**：  
$$ 权重 = \text{词在簇内的频率} \times \log(1 + \frac{\text{所有词的平均频率&#125;&#125;{\text{词在所有簇的总频率&#125;&#125;) $$

- 如果一个词在“簇 A”里经常出现，但在其他簇里很少出现，那它就是“簇 A”的**核心关键词**。
- 如果一个词（如 "the", "paper"）在所有簇里都满天飞，那它权重就很低，会被过滤掉。

### 代码实现示例

BERTopic 的设计非常“程序员友好”，几行代码就能跑起来：

```python
from bertopic import BERTopic  

# 初始化并训练模型  
# 它会自动执行：嵌入 -> 降维 -> 聚类 -> 提取关键词  
topic_model = BERTopic(verbose=True).fit(abstracts, embeddings)  

# 查看生成了多少个主题  
print(topic_model.get_topic_info())  
```

**查看结果**：  
你会看到类似这样的表格：

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/color024.jpg)

- **Topic -1**: 
	- 离群点（无法归类的噪音数据，HDBSCAN 的特性）。
- **Topic 0**:
	-  `speech, asr, recognition` (语音识别主题)。
- **Topic 1**:
	-  `medical, clinical, patient` (医疗主题)。

### 完整的BERTopic流程图

```
┌─────────────────────────────────────────────────────────┐  
│                    聚类部分                              │  
│  文档 → SBERT嵌入 → UMAP降维 → HDBSCAN聚类 → 簇       │  
└─────────────────────────────────────────────────────────┘  
                         ↓  
┌─────────────────────────────────────────────────────────┐  
│                  主题表示部分                            │  
│  簇 → CountVectorizer词袋 → c-TF-IDF加权 → 主题关键词  │  
└─────────────────────────────────────────────────────────┘  
```

### 可视化

```python
# 可视化主题和文档
fig = topic_model.visualize_documents(
    titles,
    reduced_embeddings=reduced_embeddings,
    width=1200,
    hide_annotations=True
)

# 更新图例字体设置以便于可视化
fig.update_layout(font=dict(size=16))
```

![{%}|768](https://www.ituring.com.cn/figures/2025/HandsonLLM/125.jpg)

> **图：文档和主题的可视化输出**

BERTopic 提供了多种可视化选项，其中有三种值得探索，有助于了解主题之间的关系：

```python
# 可视化带有关键词排名的条形图
topic_model.visualize_barchart()

# 可视化主题之间的关系
topic_model.visualize_heatmap(n_clusters=30)

# 可视化主题的潜在层次结构
topic_model.visualize_hierarchy()
```

## BERTopic 的“乐高”特性（模块化）

BERTopic 最酷的地方在于它是**模块化**的。你可以像换乐高积木一样替换它的任何组件。
- 不喜欢默认的嵌入模型？换！
- 不喜欢 UMAP 降维？换 PCA！
- 不喜欢 HDBSCAN 聚类？换 K-Means！

这种设计让你可以根据需求定制自己的主题模型。

---

## 优化主题词（让关键词更精准）

默认的 c-TF-IDF 提取出的关键词虽然不错，但有时候不够完美。  
比如它可能提取出 `["summary", "summaries", "summarization"]` 这种重复的词，或者提取出不够准确的词。

BERTopic 提供了**重排器 (Representation Models)** 来“精修”这些关键词。这就像在搜索结果出来后，再进行一次精选。

### 1. 方案 A：KeyBERTInspired (语义优化)

- **原理**：
	- 计算关键词与簇中心向量的**语义相似度**（余弦相似度）。
- **效果**：
	- 它能把那些虽然频率高但没啥实际意义的停用词剔除，保留语义最相关的词。
- **对比**：
    - 原结果：`speech, asr, recognition, end, acoustic`
    - 优化后：`speech, encoder, phonetic, language` (更专业了)

### 2. 方案 B：MMR (最大边际相关性 - 去重)

- **痛点**：
	- 解决关键词同义反复的问题（如 `run`, `running`, `runner`）。
- **原理**：
	- 它在选择关键词时，不仅要求词要**相关**，还要求新选的词要和已选的词**不一样**。
- **参数**：
	- `diversity`（多样性）。设得越高，选出来的词差异越大。
- **效果**：
	- 关键词列表会变得丰富多彩，覆盖主题的多个方面。

### 3. 方案 C：使用大模型 (GPT/T5) 生成标签

这是最接近人类直觉的方法。与其看一堆关键词自己猜，不如直接让 ChatGPT 读一下关键词和代表性文章，然后写个总结。

**流程**：
1. BERTopic 找出簇里的几篇核心文章。
2. 把文章和关键词塞给 LLM（如 GPT-3.5 或 FLAN-T5）。
3. **Prompt 示例**：“我有以下关键词和文档，请给这个主题起个简短的标签。”
4. LLM 输出：**"Automatic Speech Recognition"** (代替了原来的 `speech, asr, recognition...`)。

**代码示例**：

```python
import openai  
from bertopic.representation import OpenAI  

# 定义 Prompt  
prompt = "..."   

# 用 OpenAI 的 GPT 模型作为表示层  
representation_model = OpenAI(client, model="gpt-3.5-turbo", prompt=prompt)  

# 更新主题模型  
topic_model.update_topics(abstracts, representation_model=representation_model)  
```

## 完整流程总结图

```
┌───────────────────────────────────────────────────────────────┐  
│                      基础流程（必需）                          │  
│  1.嵌入(SBERT) → 2.降维(UMAP) → 3.聚类(HDBSCAN)              │  
│  4.词袋(CountVectorizer) → 5.加权(c-TF-IDF)                  │  
└───────────────────────────────────────────────────────────────┘  
                            ↓  
┌───────────────────────────────────────────────────────────────┐  
│                   可选的表示模块（堆叠使用）                    │  
│  6-1. KeyBERTInspired（去停用词，语义优化）                    │  
│  6-2. MMR（增加多样性，去冗余）                                 │  
│  6-3. LLM生成（创建标签）                                       │  
└───────────────────────────────────────────────────────────────┘  
                            ↓  
                    多视角主题表示  
```

## 可视化

![{%}|528](https://www.ituring.com.cn/figures/2025/HandsonLLM/131.jpg)

**图：可视化的前 20 个主题**

通过这套流程，你就能把成千上万篇枯燥的论文，变成一张带有清晰标签和结构的主题地图，让你瞬间看懂整个领域在研究什么。这就是大模型时代“计算与语言”结合的魅力。

## 总结

这一节的核心逻辑就是：

1. **聚类**（分堆）。
2. **c-TF-IDF**（提取原始关键词）。
3. **微调表示**（用 KeyBERT 提纯，用 MMR 去重，用 LLM 生成人话标签）。
