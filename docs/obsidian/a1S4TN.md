# 构建文本嵌入模型

`#2026/01/01` `#ai` 

`文本嵌入模型`是许多强大的自然语言处理应用的基础，为增强文本生成模型等现有的强大技术奠定了基础。

在自然语言处理领域，`嵌入模型`的重要性无论怎么强调都不为过，因为它们是众多应用背后的驱动力。

因此，在本章中，我们将讨论多种构建和微调嵌入模型的方法，以提高其表征能力和语义能力。

## 嵌入模型

>  详见 [1. 嵌入模型](/Dtp0PF) 

## 什么是对比学习

>  详见 [2. 对比学习](/7QEHfq)

## SBERT

> 详见 [3. SBERT](/77H8S3)

## 构建嵌入模型

> 详见 [5. 构建嵌入模型](/kPseyu)

## 10.5　微调嵌入模型

在 10.4 节中，我们介绍了从头开始训练嵌入模型的基础知识，并了解了如何利用损失函数来进一步优化其性能。这种方法虽然相当强大，但需要从头创建嵌入模型。这个过程可能相当耗费资源和时间。

相反，sentence-transformers 框架允许几乎所有嵌入模型作为微调的基础。我们可以选择一个已经在大量数据上训练好的嵌入模型，并针对特定的数据或目的进行微调。

根据数据可用性和领域的不同，有多种微调模型的方法。我们将介绍其中的两种，并展示利用预训练嵌入模型的优势。

### 10.5.1　监督学习

微调嵌入模型最直接的方法是重复之前的模型训练过程，但要将 bert-base-uncased 替换为预训练的 sentence-transformers 模型。有很多模型可供选择，但通常来说，all-MiniLM-L6-v2 在许多用例中表现良好，而且由于规模较小，其运行速度非常快。

我们使用与 MNR 损失函数示例中相同的数据来训练模型，但这次使用预训练的嵌入模型进行微调。和之前一样，我们先加载数据并创建评估器：

```
from datasets import load_dataset
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator

# 从GLUE加载MNLI数据集
# 0 = 蕴含, 1 = 中性, 2 = 矛盾
train_dataset = load_dataset(
    "glue", "mnli", split="train"
).select(range(50_000))
train_dataset = train_dataset.remove_columns("idx")

# 为STSB创建嵌入相似度评估器
val_sts = load_dataset("glue", "stsb", split="validation")
evaluator = EmbeddingSimilarityEvaluator(
    sentences1=val_sts["sentence1"],
    sentences2=val_sts["sentence2"],
    scores=[score/5 for score in val_sts["label"]],
    main_similarity="cosine"
)
```

训练步骤与之前示例中的训练步骤类似，但我们可以使用预训练的嵌入模型来替代 bert-base-uncased：

```
from sentence_transformers import losses, SentenceTransformer
from sentence_transformers.trainer import SentenceTransformerTrainer
from sentence_transformers.training_args import SentenceTransformerTrainingArguments

# 定义模型
embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# 损失函数
train_loss = losses.MultipleNegativesRankingLoss(model=embedding_model)

# 定义训练参数
args = SentenceTransformerTrainingArguments(
    output_dir="finetuned_embedding_model",
    num_train_epochs=1,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    warmup_steps=100,
    fp16=True,
    eval_steps=100,
    logging_steps=100,
)

# 训练模型
trainer = SentenceTransformerTrainer(
    model=embedding_model,
    args=args,
    train_dataset=train_dataset,
    loss=train_loss,
    evaluator=evaluator
)
trainer.train()
```

对这个模型进行评估，我们得到以下分数：

```
# 评估我们训练的模型
evaluator(embedding_model)
```
```
{'pearson_cosine': 0.8509553350510896,
 'spearman_cosine': 0.8484676559567688,
 'pearson_manhattan': 0.8503896832470704,
 'spearman_manhattan': 0.8475760325664419,
 'pearson_euclidean': 0.8513115442079158,
 'spearman_euclidean': 0.8484676559567688,
 'pearson_dot': 0.8489553386816947,
 'spearman_dot': 0.8484676559567688,
 'pearson_max': 0.8513115442079158,
 'spearman_max': 0.8484676559567688}
```

0.85 的分数是我们目前看到的最高分，但别忘了我们用于微调的预训练模型已经在完整的 MNLI 数据集上进行了训练，而我们只使用了 50 000 个样本。这可能看起来有些多余，但这个示例演示了如何在自己的数据上微调预训练的嵌入模型。

> 　除了使用预训练的 BERT 模型（如 bert-base-uncased）或可能的领域外模型（如 all-mpnet-base-v2），你也可以在预训练的 BERT 模型上执行掩码语言建模，将其适配到自己的目标领域，然后将这个经过微调的 BERT 模型作为基础训练嵌入模型。这是一种领域适配方法。在第 11 章中，我们将在预训练模型上应用掩码语言建模。

请注意，训练或微调模型的主要难点在于找到合适的数据。对于这些模型，我们不仅需要庞大的数据集，数据本身的质量也必须很高。开发正例对通常比较直接，但增加难负例对会显著加大创建高质量数据的难度。

和之前一样，请重启 Python 环境，为接下来的示例释放显存。

### 10.5.2　增强型 SBERT

训练或微调这些嵌入模型的一个缺点是它们通常需要大量的训练数据。许多这类模型是用超过十亿个句子对训练的。对于我们的用例而言，提取如此多的句子对通常是不可能的，因为在许多情况下，只有几千个标注数据点可用。

幸运的是，有一种方法可以增强数据，使得我们在只有少量标注数据的情况下也能微调嵌入模型。这个过程被称为 **增强型 SBERT** 10 。

10 Nandan Thakur et al.“Augmented SBERT: Data Augmentation Method for Improving Bi-Encoders for Pairwise Sentence Scoring Tasks.” *arXiv preprint arXiv:2010.08240* (2020).

在这个过程中，我们的目标是增强少量的标注数据，使其可用于常规训练。增强型 SBERT 利用速度较慢但更精准的交叉编码器架构（BERT）来增强和标注更大的输入对集合。这些新标注的数据对随后被用于微调双编码器（SBERT）。

如图 10-12 所示，增强型 SBERT 包含以下步骤：

步骤 1，使用小型标注数据集（黄金数据集）微调交叉编码器（BERT）；  
步骤 2，创建新的句子对；  
步骤 3，使用微调后的交叉编码器标注新的句子对（白银数据集）；  
步骤 4，在扩展数据集（黄金数据集 + 白银数据集）上训练双编码器（SBERT）。

这里，黄金数据集是一个规模较小但完全标注的数据集，包含真实标注。白银数据集也是完全标注的，但不一定是真实标注，因为它是通过交叉编码器的预测生成的。

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/231.jpg)

**图 10-12：增强型 SBERT 的工作原理是：先在小型黄金数据集上训练交叉编码器，然后用它来标注未标注数据集以生成更大的白银数据集。最后，同时使用黄金数据集和白银数据集来训练双编码器**

在执行上述步骤之前，我们先准备数据。在原始的 50 000 个文档中选取 10 000 个文档组成小数据集，以模拟只有有限标注数据的情况。就像在余弦相似度损失函数的示例中那样，我们将蕴含的相似度分数设为 1，而将中性和矛盾的相似度分数设为 0。

```
import pandas as pd
from tqdm import tqdm
from datasets import load_dataset, Dataset
from sentence_transformers import InputExample
from sentence_transformers.datasets import NoDuplicatesDataLoader

# 为交叉编码器准备具有10 000个文档的小数据集
dataset = load_dataset("glue", "mnli", split="train").select(range(10_000))
mapping = {2: 0, 1: 0, 0:1}

# 数据加载器
gold_examples = [
    InputExample(texts=[row["premise"], row["hypothesis"]], label=map
ping[row["label"]])
    for row in tqdm(dataset)
]
gold_dataloader = NoDuplicatesDataLoader(gold_examples, batch_size=32)

# 使用pandas DataFrame，以更方便地处理数据
gold = pd.DataFrame(
    {
    "sentence1": dataset["premise"],
    "sentence2": dataset["hypothesis"],
    "label": [mapping[label] for label in dataset["label"]]
    }
)
```

这就是黄金数据集，因为它是有标注的，且代表了我们的真实标注。

使用这个黄金数据集训练交叉编码器（步骤 1）。

```
from sentence_transformers.cross_encoder import CrossEncoder

# 在黄金数据集上训练交叉编码器
cross_encoder = CrossEncoder("bert-base-uncased", num_labels=2)
cross_encoder.fit(
    train_dataloader=gold_dataloader,
    epochs=1,
    show_progress_bar=True,
    warmup_steps=100,
    use_amp=False
)
```

在训练完交叉编码器后，我们使用剩余的 40 000 个句子对（来自包含 50 000 个句子对的原始数据集）作为白银数据集（步骤 2）。

```makefile
# 通过使用交叉编码器预测标注来准备白银数据集
silver = load_dataset(
    "glue", "mnli", split="train"
).select(range(10_000, 50_000))
pairs = list(zip(silver["premise"], silver["hypothesis"]))
```

> 　如果你没有额外的未标注句子对，也可以从原始的黄金数据集中随机采样。例如，你可以从一行中取 `premise` ，从另一行中取 `hypothesis` 来创建新的句子对。这样你就可以轻松地生成 10 倍于原始数据的句子对，并用交叉编码器对其进行标注。
> 
> 然而，这种策略可能生成明显更多的不相似的句子对而非相似的句子对。作为替代方案，我们可以使用预训练的嵌入模型来嵌入所有候选句子对，并通过语义搜索为每个输入句子检索排名前 *k* 的句子。这种粗略的重排序过程让我们能够关注那些可能更相似的句子对。尽管由于预训练的嵌入模型并未在我们的数据上训练过，这些句子的选择仍然基于近似，但这种方法比随机采样要好得多。

请注意，在这个示例中，我们假设这些句子对是未标注的。我们将使用经过微调的交叉编码器来标注这些句子对（步骤 3）。

```
import numpy as np

# 使用经过微调的交叉编码器标注句子对
output = cross_encoder.predict(
    pairs, apply_softmax=True,
show_progress_bar=True
)
silver = pd.DataFrame(
    {
        "sentence1": silver["premise"],
        "sentence2": silver["hypothesis"],
        "label": np.argmax(output, axis=1)
    }
)
```

现在我们有了黄金数据集和白银数据集，只需要将它们组合，然后像之前那样训练我们的嵌入模型：

```
# 组合黄金数据集和白银数据集
data = pd.concat([gold, silver], ignore_index=True, axis=0)
data = data.drop_duplicates(subset=["sentence1", "sentence2"], keep="first")
train_dataset = Dataset.from_pandas(data, preserve_index=False)
```

和之前一样，我们需要定义一个评估器：

```
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator

# 为STSB创建嵌入相似度评估器
val_sts = load_dataset("glue", "stsb", split="validation")
evaluator = EmbeddingSimilarityEvaluator(
    sentences1=val_sts["sentence1"],
    sentences2=val_sts["sentence2"],
    scores=[score/5 for score in val_sts["label"]],
    main_similarity="cosine"
)
```

我们像之前一样训练模型，只是现在使用增强后的数据集：

```
from sentence_transformers import losses, SentenceTransformer
from sentence_transformers.trainer import SentenceTransformerTrainer
from sentence_transformers.training_args import SentenceTransformerTrainingArguments

# 定义模型
embedding_model = SentenceTransformer("bert-base-uncased")

# 损失函数
train_loss = losses.CosineSimilarityLoss(model=embedding_model)

# 定义训练参数
args = SentenceTransformerTrainingArguments(
    output_dir="augmented_embedding_model",
    num_train_epochs=1,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    warmup_steps=100,
    fp16=True,
    eval_steps=100,
    logging_steps=100,
)

# 训练模型
trainer = SentenceTransformerTrainer(
    model=embedding_model,
    args=args,
    train_dataset=train_dataset,
    loss=train_loss,
    evaluator=evaluator
)
trainer.train()
```

最后，我们对模型进行评估：

```
evaluator(embedding_model)
```
```
{'pearson_cosine': 0.7101597020018693,
 'spearman_cosine': 0.7210536464320728,
 'pearson_manhattan': 0.7296749443525249,
 'spearman_manhattan': 0.7284184255293913,
 'pearson_euclidean': 0.7293097297208753,
 'spearman_euclidean': 0.7282830906742256,
 'pearson_dot': 0.6746605824703588,
 'spearman_dot': 0.6754486790570754,
 'pearson_max': 0.7296749443525249,
 'spearman_max': 0.7284184255293913}
```

余弦相似度损失函数示例的原始版本在使用完整数据集时得分为 0.72，而我们仅使用其中 20% 的数据，就获得了 0.71 的分数！

这种方法能够扩展现有数据集的规模，而无须人工标注成千上万的句子对。你可以通过仅在黄金数据集上训练嵌入模型来测试白银数据集的质量。性能差异反映了白银数据集在提升模型质量方面具有多大的潜在作用。

请再次重启 Python 环境，我们将进入最后一个示例，即无监督学习。

## 10.6　无监督学习

要创建嵌入模型，我们通常需要标注数据。然而，并非所有现实世界的数据集都带可用的标注集。因此，我们转而寻找无须预定义标注就能训练模型的技术——无监督学习。目前存在许多方法，如 SimCSE（Simple Contrastive Learning of Sentence Embeddings，句子嵌入的简单对比学习） 11 、CT（Contrastive Tension，对比张力） 12 、TSDAE（Transformer-based Sequential Denoising Auto-Encoder，基于 Transformer 的序列去噪自编码器） 13 和 GPL（Generative Pseudo-Labeling，生成式伪标签） 14 。

11 Tianyu Gao, Xingcheng Yao, and Danqi Chen.“SimCSE: Simple Contrastive Learning of Sentence Embeddings.” *arXiv preprint arXiv:2104.08821* (2021).

12 Fredrik Carlsson et al.“Semantic Re-tuning with Contrastive Tension.” *International Conference on Learning Representations,* 2021.

13 Kexin Wang, Nils Reimers, and Iryna Gurevych.“TSDAE: Using Transformer-based Sequential Denoising Auto-Encoder for Unsupervised Sentence Embedding Learning.” *arXiv preprint arXiv:2104.06979* (2021).

14 Kexin Wang et al.“GPL: Generative Pseudo Labeling for Unsupervised Domain Adaptation of Dense Retrieval.” *arXiv preprint arXiv:2112.07577* (2021).

在本节中，我们将重点介绍 TSDAE，因为它在无监督任务和领域适配方面都表现出色。

### 10.6.1　TSDAE

TSDAE 是一种非常优雅的通过无监督学习创建嵌入模型的方法。该方法假设我们完全没有标注数据，也不要求我们人为创建标签。

TSDAE 的基本思想是通过删除输入句子中一定比例的词来为其添加噪声。这个“受损”的句子被输入编码器中，编码器的上方有一个池化层，将其映射为句子嵌入。基于这个句子嵌入，解码器尝试重建原始句子，但不包含人为添加的噪声。这里的核心概念是：句子嵌入越准确，重建的句子就越准确。

这种方法与掩码语言建模非常相似。在掩码语言建模中，我们试图重建和学习某些被掩码的词。这里，我们不是重建被掩码的词，而是尝试重建整个句子。

训练完成后，我们可以使用编码器从文本生成嵌入向量，因为解码器仅用于判断嵌入向量是否能准确地重建原始句子（见图 10-13）。

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/232.jpg)

**图 10-13：TSDAE 随机删除输入句子中的词，然后将这个句子传入编码器生成句子嵌入，再基于这个句子嵌入重建原始句子**

由于我们只需要一组不带任何标注的句子，因此训练这个模型非常简单直接。首先，下载一个外部分词器，用于去噪过程：

```haskell
# 下载额外的分词器
import nltk
nltk.download("punkt")
```

然后，从数据中创建普通的句子，并移除所有标签以模拟无监督的设置：

```haskell
from tqdm import tqdm
from datasets import Dataset, load_dataset
from sentence_transformers.datasets import DenoisingAutoEncoderDataset

# 创建一个一维的句子列表
mnli = load_dataset("glue", "mnli", split="train").select(range(25_000))
flat_sentences = mnli["premise"] + mnli["hypothesis"]

# 为输入数据添加噪声
damaged_data = DenoisingAutoEncoderDataset(list(set(flat_sentences)))

# 创建数据集
train_dataset = {"damaged_sentence": [], "original_sentence": []}
for data in tqdm(damaged_data):
    train_dataset["damaged_sentence"].append(data.texts[0])
    train_dataset["original_sentence"].append(data.texts[1])
train_dataset = Dataset.from_dict(train_dataset)
```

这将创建一个包含 50 000 个句子的数据集。当我们检查数据时，可以发现第一个句子是损坏的句子，第二个句子是原始句子。

```
train_dataset[0]
```
```
{'damaged_sentence': 'Grim jaws are.',
 'original_sentence': 'Grim faces and hardened jaws are not people-friendly.'}
```

第一个句子展示了带噪声的数据，而第二个句子展示了原始句子。创建数据后，我们像之前一样定义一个评估器：

```
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator

# 为STSB创建嵌入相似度评估器
val_sts = load_dataset("glue", "stsb", split="validation")
evaluator = EmbeddingSimilarityEvaluator(
    sentences1=val_sts["sentence1"],
    sentences2=val_sts["sentence2"],
    scores=[score/5 for score in val_sts["label"]],
    main_similarity="cosine"
)
```

接下来，我们像之前一样进行训练，但使用 `[CLS]` 词元作为池化策略，而不是对词元嵌入进行平均池化。在关于 TSDAE 的论文中，这被证明更有效，因为平均池化会丢失位置信息，而使用 `[CLS]` 词元则不会。

```
from sentence_transformers import models, SentenceTransformer

# 创建嵌入模型
word_embedding_model = models.Transformer("bert-base-uncased")
pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension(), "cls")
embedding_model = SentenceTransformer(modules=[word_embedding_model, pooling_model])
```

使用我们的句子对，我们需要一个损失函数来尝试使用噪声句子重构原始句子，这个损失函数即 `DenoisingAutoEncoderLoss` （去噪自编码器损失函数）。这样，模型将学习如何准确地表示数据。这类似于掩码操作，但不需要知道实际掩码的位置。

此外，我们绑定了两个模型的参数。编码器的嵌入层和解码器的输出层不使用单独的权重，而是共享权重。这意味着一个层的权重更新也会反映在另一个层中。

```nix
from sentence_transformers import losses

# 使用去噪自编码器损失函数
train_loss = losses.DenoisingAutoEncoderLoss(
    embedding_model, tie_encoder_decoder=True
)
train_loss.decoder = train_loss.decoder.to("cuda")
```

最后，与之前一样训练模型，但我们减小了批量大小，因为使用这个损失函数会增加内存使用量：

```
from sentence_transformers.trainer import SentenceTransformerTrainer
from sentence_transformers.training_args import SentenceTransformerTrainingArguments

# 定义训练参数
args = SentenceTransformerTrainingArguments(
    output_dir="tsdae_embedding_model",
    num_train_epochs=1,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    warmup_steps=100,
    fp16=True,
    eval_steps=100,
    logging_steps=100,
)

# 训练模型
trainer = SentenceTransformerTrainer(
    model=embedding_model,
    args=args,
    train_dataset=train_dataset,
    loss=train_loss,
    evaluator=evaluator
)
trainer.train()
```

训练完成后，我们评估模型，以探索这种无监督技术的表现如何：

```
# 评估训练好的模型
evaluator(embedding_model)
```
```
{'pearson_cosine': 0.6991809700971775,
 'spearman_cosine': 0.713693213167873,
 'pearson_manhattan': 0.7152343356643568,
 'spearman_manhattan': 0.7201441944880915,
 'pearson_euclidean': 0.7151142243297436,
 'spearman_euclidean': 0.7202291660769805,
 'pearson_dot': 0.5198066451871277,
 'spearman_dot': 0.5104025515225046,
 'pearson_max': 0.7152343356643568,
 'spearman_max': 0.7202291660769805}
```

在拟合模型后，我们获得了 0.70 的分数。考虑到我们是使用无标注数据完成所有训练的，这个分数着实令人赞叹。

### 10.6.2　使用 TSDAE 进行领域适配

当我们只有很少或完全没有标注数据时，通常使用无监督学习的方法来创建文本嵌入模型。然而，无监督学习技术的表现通常不如监督学习技术，而且难以学习特定领域的概念。

这时 **领域适配** （domain adaptation）就派上用场了。它的目标是将现有的嵌入模型更新到一个包含不同于源领域主题的特定文本领域。图 10-14 展示了不同领域在内容上的差异。目标领域（域外）通常包含未在源领域（域内）中出现的词语和主题。

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/233.jpg)

**图 10-14：领域适配的目标是创建一个嵌入模型，并使其从一个领域泛化到另一个领域**

领域适配的一种方法称为自适应预训练。首先，使用无监督学习技术（如前面讨论的 TSDAE 或掩码语言建模）对特定领域的语料库进行预训练。然后，如图 10-15 所示，使用域内或域外的训练数据集对该模型进行微调。虽然目标领域的数据是首选，但由于我们从目标领域的无监督训练开始，域外数据也同样有效。

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/234.jpg)

**图 10-15：领域适配可以通过自适应预训练和自适应微调来实现**

运用本章所学的所有知识，你应该能够复现这个流程。首先，可以使用 TSDAE 在目标领域训练嵌入模型，然后使用常规监督训练或增强版 SBERT 进行微调。

## 10.7　小结

在本章中，我们探讨了通过多种任务创建和微调嵌入模型的方法。我们首先讨论了嵌入的概念及其在将文本数据表示为数值格式中的作用，然后探索了许多嵌入模型的基础技术，即对比学习，它主要从文档的相似 / 不相似对中学习。

基于流行的嵌入框架 sentence-transformers，我们使用预训练的 BERT 模型创建了嵌入模型，并探索了多种损失函数，如余弦相似度损失函数和 MNR 损失函数。我们还讨论了收集文档的相似 / 不相似对或三元组对最终模型性能的重要性。

随后，我们研究了微调嵌入模型的技术。我们讨论了监督学习技术和无监督学习技术，如用于领域适配的增强版 SBERT 和 TSDAE。与创建嵌入模型相比，微调通常需要较少的数据，是将现有嵌入模型适配到所需领域的一个很好的方法。

在第 11 章中，我们将讨论微调用于分类的表示模型的方法，涉及 BERT 模型和嵌入模型，还将介绍各种微调技术。
