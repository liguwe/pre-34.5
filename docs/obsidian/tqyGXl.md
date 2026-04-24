# 文本聚类和主题建模

`#2025/12/30` `#ai` 

## 文本聚类和主题建模的定义

> 尽管`监督技术（如分类`）过去几年在业界占据主导地位，但像`文本聚类`这样的`无监督技术`的潜力也不容小觑。

文本聚类：旨在基于文本的语义内容、含义和关系对相似文本进行分组。

如图所示，将语义相似的文档聚类成簇，不仅可以高效地分类`大量非结构化文本`，还能实现快速的探索性数据分析。

![{%}|512](https://www.ituring.com.cn/figures/2025/HandsonLLM/108.jpg)

> **非结构化文本数据聚类**

`文本聚类`也在主题`建模领域`，即我们希望在大量文本数据集合中发现（抽象的）主题时发挥作用。

如图所示，我们通常使用关键词或关键短语来描述主题，理想情况下会有一个总体的概括性标签。

![{%}|536](https://www.ituring.com.cn/figures/2025/HandsonLLM/109.jpg)

> **主题建模是一种为文本文档簇赋予含义的方法**

## 我们需要的数据源

我们将在 ArXiv 文章（**真实的学术文章数据**）上运行`聚类`和`主题建模`算法。

> ArXiv 是一个主要面向计算机科学、数学和物理领域的开放的学术文章平台。`学术界的GitHub`

**数据集名称**：`arxiv_nlp`

**数据内容**：
- **时间跨度**：1991年到2024年
- **论文数量**：44,949篇
- **领域**：ArXiv cs.CL（计算与语言，Computational Linguistics）板块
- **包含内容**：每篇论文的摘要、标题和发表年份

我们加载数据，并为每篇文章的`摘要、标题和年份`创建单独的变量：

```python
# 第一步：从Hugging Face加载数据集
from datasets import load_dataset

dataset = load_dataset("maartengr/arxiv_nlp")["train"]

# 第二步：提取我们需要的信息
abstracts = dataset["Abstracts"]  # 论文摘要（主要分析对象）
titles = dataset["Titles"]  # 论文标题
years = dataset["Years"]  # 发表年份
```

**数据示例：**

```json
{
  "Abstracts": [
    "本文提出了一种新的注意力机制...",
    "我们设计了一个用于情感分析的模型...",
    ...
  ],
  "Titles": [
    "Attention Is All You Need",
    "Sentiment Analysis with BERT",
    ...
  ],
  "Years": [2017, 2019, ...]
}
```

## 文本聚类的通用流程

>  [2. 文本聚类的通用流程](/pZhD8h)

## 从文本聚类到主题建模

> 详见 [3. 从文本聚类到主题建模：给数据“贴标签”的艺术](/rkcNVe)
