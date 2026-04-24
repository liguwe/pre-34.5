# 概述与环境

`#2025/12/25` `#ai` 

## 前言

- 探索 LLM 的历史与演进，深入研究 LLM 的内部运作机制，探讨其架构、训练方法和微调技术
- LLM 在文本分类、聚类、主题建模、聊天机器人、搜索引擎等领域的各种应用

## 以直观理解为先的理念 → 有很多`图`

我们将重点放在 LLM 的基础知识上，致力于提供一个轻松、有趣的学习过程。

## 本书结构

![{%}|624](https://www.ituring.com.cn/figures/2025/HandsonLLM/001.jpg)

### 第一部分：理解语言模型

- 大、小语言模型的内部运作机制。首先概述该领域和常用技术
- 模型的两个核心组件
	- 词元（token）和嵌入（embedding）。
- 对 Jay 的大名鼎鼎的文章 “The Illustrated Transformer” 的更新和扩展，深入探讨了这些模型的架构

### 第二部分：使用预训练语言模型

- 通过常见用例探索如何使用 LLM。我们将使用`预训练模型`并展示它们的功能，`无须进行微调`
- 如何使用语言模型进行监督分类？
- 文本聚类和主题建模
- 利用嵌入模型进行文本生成
- 语义搜索
- 将`文本生成能力`扩展到`视觉领域`

### 第三部分：训练和微调语言模型

- 通过训练和微调各种语言模型来探索高级概念。
- 如何`构建和微调`嵌入模型
- 回顾如何针对分类任务微调 `BERT`，并以几种生成模型的微调方法结束本书

## 代码、硬件、软件要求

本书中的所有示例都可在在线平台 `Google Colab` 上运行。在撰写本书时，该平台允许你免费使用 `NVIDIA GPU（T4）`来运行代码。这款 GPU 有 `16 GB 显存（GPU 的内存）`，这是我们对本书示例的最低显存要求。

> 　需要注意的是，并非所有章节都需要最少 16 GB 显存，因为某些示例（如训练和微调）比其他示例（如提示工程）更消耗计算资源。在本书代码仓库中，你可以找到每章的最低 GPU 要求。

所有代码、相关要求和附加教程都可以在本书 GitHub 仓库（ [https://github.com/HandsOnLLM/Hands-On-Large-Language-Models](https://github.com/HandsOnLLM/Hands-On-Large-Language-Models) ）中找到。如果你想在本地运行示例，我们建议使用配备`至少 16 GB 显存的 NVIDIA GPU`。如需本地安装，例如使用 `conda`，你可以按照以下步骤创建环境：

```python
conda create -n thellmbook python=3.10
conda activate thellmbook
```

要安装所有必要的依赖项，首先 fork 或克隆代码仓库，然后在新创建的 `Python 3.10 环境`中运行以下命令：

```cmake
pip install -r requirements.txt
```

> 关于 `conda` ，更多可参考 [2. Conda 是什么？](/kDOYQT)
