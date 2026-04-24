# LLM 的内部机制

`#2025/12/29` `#ai` 

我们将探讨 Transformer LLM 的主要工作原理。我们将重点关注`文本生成模型`，以便更深入地理解`生成式 LLM`。

我们将探讨相关概念并通过一些代码示例来演示这些概念。
- 我们先加载一个语言模型，并定义流水线，以备生成文本。
- 在第一次阅读时，你可以跳过代码部分，专注于理解概念。
- 然后在第二次阅读时，通过代码来动手应用这些概念。

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# 加载模型和分词器
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")

model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3-mini-4k-instruct",
    device_map="cuda",
    torch_dtype="auto",
    trust_remote_code=True,
)

# 创建流水线
generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    return_full_text=False,
    max_new_tokens=50,
    do_sample=False,
)
```

## 1. Transformer 模型概述

### 1.1. 已训练 Transformer LLM 的输入和输出

> [!abstract]
>
> > 更直观简洁版本详见
>  - [1. 已训练 Transformer LLM 的输入和输出：篇一](/IlZ0oI)
>
>  - [2. 已训练 Transformer LLM 的输入和输出：篇二](/R1NRNF)

### 1.2. 前向传播的组成

除了循环之外，前向传播还有两个关键的`内部组件`：`分词器`和`语言建模头（language modeling head，LM head）`。

图 3-4 展示了这些组件在系统中的位置。在上一章中，我们看到了`分词器`如何将`文本`分解成`词元 ID 序列`，然后用作模型的输入。

分词器之后是`神经网络`，由`一系列 Transformer 块堆叠`而成，负责执行所有的处理工作。在这些堆叠的块之后是语言建模头，它将 Transformer 块的输出转换为预测下一个词元的概率分数。

![{%}|856](https://www.ituring.com.cn/figures/2025/HandsonLLM/055.jpg)

> 图 3-4：Transformer LLM 由分词器、堆叠的 Transformer 块和语言建模头组成

回顾第 2 章的内容，`分词器`包含一个词元表，即分词器的 词表 。模型为词表中的每个词元都关联了一个向量表示（词元嵌入）。

> 图 3-5 展示了一个拥有 50 000 个词元的词表及其对应的词元嵌入。

![{%}|680](https://www.ituring.com.cn/figures/2025/HandsonLLM/056.jpg)

> 图 3-5：分词器拥有 50 000 个词元的词表，模型为这些词元关联了词元嵌入

计算流按照箭头方向从上到下进行。对于每个生成的词元，处理过程会按顺序依次`经过堆叠成一列的所有 Transformer 块`，然后到达`语言建模头`，最后输出`下一个词元的概率分布`，如图 3-6 所示。

![{%}|672](https://www.ituring.com.cn/figures/2025/HandsonLLM/057.jpg)

> 图 3-6：在前向传播结束时，模型为词表中的每个词元预测一个概率分数

`语言建模头`本身是一个`简单的神经网络层`。

它可以连接到堆叠的 Transformer 块上的多种可能的“头”之一，用于构建不同类型的系统。其他类型的 Transformer 头包括序列分类头和词元分类头。

我们只需打印模型变量，就可以按顺序显示所有层。对于这个模型，我们得到：

```python
Phi3ForCausalLM(
  (model): Phi3Model(
    (embed_tokens): Embedding(32064, 3072, padding_idx=32000)
    (embed_dropout): Dropout(p=0.0, inplace=False)
    (layers): ModuleList(
      (0-31): 32 x Phi3DecoderLayer(
        (self_attn): Phi3Attention(
          (o_proj): Linear(in_features=3072, out_features=3072, bias=False)
          (qkv_proj): Linear(in_features=3072, out_features=9216, bias=False)
          (rotary_emb): Phi3RotaryEmbedding()
        )
        (mlp): Phi3MLP(
          (gate_up_proj): Linear(in_features=3072, out_features=16384, bias=False)
          (down_proj): Linear(in_features=8192, out_features=3072, bias=False)
          (activation_fn): SiLU()
        )
        (input_layernorm): Phi3RMSNorm()
        (resid_attn_dropout): Dropout(p=0.0, inplace=False)
        (resid_mlp_dropout): Dropout(p=0.0, inplace=False)
        (post_attention_layernorm): Phi3RMSNorm()
      )
    )
    (norm): Phi3RMSNorm()
  )
  (lm_head): Linear(in_features=3072, out_features=32064, bias=False)
)
```

观察这个结构，我们可以注意到以下几个重点。

- 这个结构展示了模型的`各种嵌套层`。
	- 模型的主要部分标记为 `model` ，随后是 `lm_head` 。
- 在 `Phi3Model` 内部，我们可以看到嵌入矩阵 `embed_tokens` 及其维度。它有 32 064 个词元，每个词元的向量大小为 3072。
- 暂时跳过 dropout 层，我们可以看到下一个主要组件是堆叠的 Transformer 解码器层。它包含 32 个 `Phi3DecoderLayer` 类型的块。
- 这些 Transformer 块中的每一个都包含一个注意力层和一个前馈神经网络（也称为 MLP 或多层感知器）。我们将在本章后面详细介绍这些内容。
- 最后，我们看到 `lm_head` 接收一个大小为 3072 的向量，并输出一个大小等于模型所知词元数量的向量。
	- 该输出是每个词元的`概率分数`，帮助我们选择输出词元。

### 1.3. 从概率分布中选择单个词元（采样/解码） → 采样和解码策略

> 参考  
>  [5. 从概率分布中选择单个词元（采样、解码）：中学生版](/B9YDqu)  
>  [6. 从概率分布中选择单个词元（采样、解码）： AI 是怎么做选择题的？](/4Jdxbj)

![{%}|800](https://www.ituring.com.cn/figures/2025/HandsonLLM/058.jpg)

### 1.4. 并行词元处理和上下文长度

> 详见 [7.  并行处理与上下文长度：AI 的架构是如何处理输入的 →  超强多线程](/EqqLZi)

### 1.5. 通过缓存`键-值`加速生成过程

> 详见 [8. 通过缓存键-值加速生成过程](/lhlsXf)

### 1.6. Transformer 块的内部结构

> 详见 [9. Transformer 块的内部结构](/VwOqYl)

> [!danger]  
> 一些具体的计算逻辑，我省略掉了，以后有必要再深入阅读吧

## 2. Transformer 架构的最新改进

> 详见 [10.  Transformer 架构的最新改进](/LRFSJc)

> [!danger]  
> 说实话，有一些没能读懂，但是，现阶段也没必要完全死磕到底，必要时再深入学习吧

## 3. 小结

- Transformer LLM 每次生成一个词元 。
- 生成的词元会被追加到提示词中 ，然后，这个更新后的提示词会再次被输入模型进行下一次前向传播，以生成下一个词元。
- Transformer LLM 的 三个主要组件
-  分词器
- 一系列 Transformer 块
- 语言建模头。
- 分词器包含模型的 词元词表 。模型中包含与这些词元相关联的 词元嵌入 。将文本分解成词元，然后使用这些词元的嵌入向量，是词元生成过程的第一步。
- 前向传播会 依次 经过所有阶段。
- 在处理接近尾声时，语言建模头会对 下一个可能的词元进行概率评分 。解码策略决定了在这一生成步骤中选择哪个实际词元作为输出（有时是概率最高的下一个词元，但并非总是如此）。
- Transformer 表现出色的原因之一是它能够并行处理词元。每个输入词元都流入其 独立的计算流 （也称为处理路径）。这些流的数量就是模型的“上下文长度”，代表模型可以处理的最大词元数量。
- 由于 Transformer LLM 通过循环来一次生成一个词元的文本，因此 缓存 每个步骤的处理结果是一种很好的策略，这样可以避免重复处理工作（这些结果以各种矩阵的形式存储在层中）。
- 大部分处理发生在 Transformer 块 中。这些块由两个组件组成，其中一个是 前馈神经网络 ，它能够存储信息，并根据训练数据进行预测和插值。
- Transformer 块的另一个主要组件是 自注意力 。自注意力整合了上下文信息，使模型能够更好地捕捉语言的细微差别。
- 注意力过程分为两个主要步骤：相关性评分；信息组合。
- Transformer 的自注意力层并行执行多个注意力操作，每个操作都发生在 注意力头 内，它们的输出被聚合成自注意力层的输出。
- 通过在所有注意力头或一组注意力头（ 分组查询注意力 ）之间共享键矩阵和值矩阵，可以加速注意力计算。
- Flash Attention 等方法通过优化在 GPU 不同显存系统上的操作方式来加速注意力计算。
- Transformer 架构在不断发展和创新，
