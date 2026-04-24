# 词元和嵌入

`#2025/12/27` `#ai` 

## 1. 概要

`词元` 和 `嵌入` 是使用 LLM 的两个核心概念。且如图 2-1 所示，如果没有对词元和嵌入的深入理解，我们就无法清楚地了解 LLM 的工作原理、构建方式及其未来的发展方向。

![{%}|560](https://www.ituring.com.cn/figures/2025/HandsonLLM/035.jpg)

> 图 2-1：语言模型处理文本时会将其分成小块，称为词元。为了理解自然语言，语言模型需要将`词元`转换为`数值`表示，即`嵌入向量`

本章我们将深入探讨
- 词元的本质以及 LLM 使用的分词方法。
- 我们将探讨著名的 `word2vec` 嵌入方法，它是现代 LLM 的先驱。
	- 我们将了解 word2vec 如何扩展 词元嵌入 （token embedding）的概念，来构建商业推荐系统，我们使用的许多互联网应用都是由推荐系统支持的。
	- 最后，我们将从词元嵌入过渡到 `句子或文本嵌入`，即`整个句子或文档`可以用`一个向量`来表示

## 2. LLM 的分词

- 模型并不是一次性生成所有输出，而是一次生成一个`词元`。
- `词元`不仅是模型的`输出单位`，也是模型查看输入的方式。
- 发送给模型的`提示词`首先被分解成`词元`

### 2.1. 分词器如何处理语言模型的输入

>  更多参考 [201.  分词器如何处理语言模型的输入](/RnNuhZ)

从外部来看，生成式 LLM 接收输入提示词并生成响应，如图 2-2 所示。

![{%}|512](https://www.ituring.com.cn/figures/2025/HandsonLLM/036.jpg)

> 图 2-2：语言模型及其输入提示词的架构图

然而，在将提示词呈现给语言模型之前，它首先要通过`分词器`将其分解成`片段`。

让我们看一个代码示例，这个是open ai 提供的工具

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/037.jpg)

> 图 2-3：在模型处理文本之前，`分词器`会将文本分解成`词或子词`。这是根据特定的方法和训练过程进行的

### 2.2. 下载和运行 LLM

>  更详细的运行说明，参考 [202.  下载和运行 LLM详细说明](/20K4O3)

加载`模型`及其`分词器`：

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# 加载模型及其分词器
model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3-mini-4k-instruct",
    device_map="cuda",
    torch_dtype="auto",
    trust_remote_code=True,
)
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")
```

然后我们就能进行实际的生成了。
- 首先声明提示词，然后对其进行分词，再将这些词元传递给模型，模型随后生成输出。

在这个例子中，我们要求模型只生成 `20 个新词元`：

```python
prompt = "Write an email apologizing to Sarah for the tragic gardening mishap.
Explain how it happened.<|assistant|>" 

# 对输入提示词进行分词
input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to("cuda")

# 生成文本
generation_output = model.generate(
  input_ids=input_ids,
  max_new_tokens=20  
)

# 打印输出
print(tokenizer.decode(generation_output[0]))
```

>  关于 prompt 的格式，参考 [203. Phi-3 模型的完整指令说明](/KNJH66)

输出：

```
<s> Write an email apologizing to Sarah for the tragic gardening mishap.
Explain how it happened.<|assistant|> Subject: My Sincere Apologies for the
Gardening Mishap

Dear
```

粗体文本是模型生成的 20 个词元。

从代码中可以看到，模型实际上并没有直接处理提示词文本。相反，输入提示词是由分词器处理的。

分词器在变量 `input_ids` 中返回了模型所需的信息，随后模型将其用作输入。

让我们打印 `input_ids` 看看它包含什么：

```
tensor(
[ 1, 14350, 385, 4876, 27746, 5281, 304, 19235, 363, 278, 25305, 293,
16423, 292, 286, 728, 481, 29889, 12027, 7420, 920, 372, 9559, 29889, 32001](#),
device='cuda:0'
)
```

这就是 LLM 输出的`响应`，如图 2-4 所示的一系列整数。每个整数都是特定词元（字符、词或词的一部分）的唯一 ID。这些 ID 是分词器内部的一张词元表的索引，该表包含了分词器能够识别的所有词元。

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/038.jpg)

图 2-4：分词器处理输入提示词，得到词元 ID 列表，这就是语言模型的实际输入。图中显示的具体词元 ID 仅作示例

如果想查看这些 ID，可以使用分词器的 `decode` 方法将 ID 转换回人类可阅读的文本：

```
for id in input_ids[0]:
    print(tokenizer.decode(id))
```

这会得到以下输出（每个词元占一行）：

```
<s>

Write

an

email

apolog

izing

to

Sarah

for

the

trag

ic

garden

ing

m

ish

ap

.

Exp

lain

how

it

happened

.

<|assistant|>
```

这就是分词器分解输入提示词的过程。需要注意以下几点：

- 第一个词元是 ID 1（ `<s>` ），这是一个表示文本开始的特殊词元；
- 一些词元是完整的单词（例如 `Write` 、 `an` 、 `email` ）；
- 一些词元是单词的部分（例如 `apolog` 、 `izing` 、 `trag` 、 `ic` ）；
- 标点符号是独立的词元。

注意空格字符不用单独的词元表示，代表词的一部分的词元（如 `izing` 和 `ic` ）在开头有一个特殊的隐藏字符，表示它们与文本中前面的词元相连。没有这个特殊字符的词元前面则都被视为有一个空格。

在输出端，我们也可以通过打印 `generation_output` 变量来查看模型生成的词元。打印的内容同时包括输入词元和输出词元（我们将新词元用粗体突出显示）：

```
tensor([ 1, 14350, 385, 4876, 27746, 5281, 304, 19235, 363, 278,

25305, 293, 16423, 292, 286, 728, 481, 29889, 12027, 7420,

920, 372, 9559, 29889, 32001, 3323, 622, 29901, 1619, 317,

3742, 406, 6225, 11763, 363, 278, 19906, 292, 341, 728,

481, 13, 13, 29928, 799 ](#), device='cuda:0')
```

在上述例子中，模型生成了词元 3323（ `Sub` ），接着是词元 622（ `ject` ）。它们一起组成了 Subject 这个词。然后是词元 29901，即冒号，等等。就像输入端一样，我们需要分词器在输出端将词元 ID 转换为实际文本。我们使用分词器的 `decode` 方法来实现这一点。我们可以传入单个词元 ID 或它们的列表：

```
print(tokenizer.decode(3323))
print(tokenizer.decode(622))
print(tokenizer.decode([3323, 622]))
print(tokenizer.decode(29901))
```

这会输出：

```
Sub

ject

Subject

:
```

### 2.3. 分词器如何分解文本：三个核心因素

>  更多细节参考 [204. 分词器如何分解文本：三个因素](/R4C7GB)

> 决定于分词器的“配置”和“训练环境”。

#### 2.3.1. 总结：核心要素：决定切分方式的“三驾马车”

分词器怎么切分文本，主要取决于以下三点：

1. **分词算法 (Method/Algorithm)**
    - 这是底层的“切分逻辑”。就像我们在编程中选择不同的排序算法一样，模型设计者会选择不同的分词算法。
    - **常见的算法：** 
        - 书中提到了 **BPE (字节对编码)** 和 **WordPiece**。
        - 它们的目标都是“**用最少的词元表示最多的文本**”，
        - 但具体的实现策略不同。有的喜欢切得更碎，有的喜欢保留更长的片段。
2. **初始化参数 (Parameters/Configuration)**
    - 选定算法后，还需要设定具体的参数。最关键的是 **词表大小 (Vocabulary Size)**。
    - **类比：** 
        - 就像你定义一个哈希表的大小。如果你允许词表很大（比如 10 万个），分词器就能记住很多生僻词（比如 "apologizing" 作为一个整体）。
        - 如果你限制词表很小（比如 3 万个），它就不得不把 "apologizing" 切碎成 "apolog" 和 "izing" 来节省空间。
    - 还包括 **特殊词元 (Special Tokens)** 的定义（比如开始标记 `<s>`、结束标记等）。
3. **训练数据 (Training Dataset)**
    - 这是最容易被忽视但影响巨大的一点。分词器是在特定数据上“训练”出来的（构建词表）。
    - **关键点：** 即使算法和参数完全一样，**在英文小说上训练的分词器**和**在 Python 代码库上训练的分词器**，切分结果会截然不同。
    - **例子：** 如果在代码数据上训练，分词器可能会把缩进的空格、`def`、`class` 这种关键词作为一个独立的词元；而在普通文本上训练，它可能根本不认识这些代码习惯。

#### 2.3.2. 总结：双向转换

最后，这一节还提醒我们，分词器的工作是**双向**的：
- **输入端 (Encoding)：** 把你的 Prompt 文本切分并查表转成 ID 列表，喂给模型。
- **输出端 (Decoding)：** 接住模型吐出来的 ID 列表，查表反向拼凑回人类能读的文本。

**一句话总结这一节：**
- 分词器不是一个简单的 `String.split(' ')` 函数，而是一个**基于特定算法、在特定数据上统计学习出来的“动态字典”**。
- 这就是为什么不同的模型（如 GPT-4 和 Llama 3）对同一句话的分词结果可能完全不同。

分词器除了把输入文本处理成语言模型的输入外，分词器还负责处理语言模型的输出，将生成的词元 ID 转换为与之关联的输出词或词元，如图 2-5 所示。

![{%}|592](https://www.ituring.com.cn/figures/2025/HandsonLLM/039.jpg)

> 图 2-5：分词器还负责处理模型的输出，将输出词元 ID 转换为与该 ID 关联的词或词元

### 2.4. 词级、子词级、字符级与字节级分词

> 另参考 [205.  词级、子词级、字符级与字节级分词（文本的"最小处理单位"该如何选择）](/EHBJOm)

### 2.5. 市面上几种训练好的 LLM 分词器对比

> [!abstract]  
> 另外可参考，换了两种更直观的方式来描述这一节  
> 1、[206.  真实分词器测评（篇一：几种真实模型的 LLM 分词器的对比）](/DSE3yX)  
> 2、[207. 真实分词器测评（篇二）](/ZOPhCk)

分词器中出现的词元是由`三个主要因素`决定的：
1. 分词方法
2. 用于初始化分词器的参数和特殊词元，
3. 以及用于训练分词器的数据集。

接下来，我们对多个已经实际训练好的分词器进行比较，看看这些因素如何影响它们的行为。

我们会看到`较新的分词器是如何改变其行为以提升模型性能的`，还会看到`专门的模型（如代码生成模型）通常需要专门的分词器`。

我们使用多个分词器来编码以下文本：

![{%}|520](https://www.ituring.com.cn/figures/2025/HandsonLLM/color001.jpg)

由此，我们能够看到每个分词器是如何处理不同类型的词元的：
- 大小写
- 英语以外的语言
- 表情符号（emoji）
- 编程代码，包括关键字和经常用于缩进的空白字符（例如在 Python 等语言中）
- 数字
- 特殊词元。这类词元具有特定的作用，而不仅仅表示文本。
	- 它们包括表示文本开始或结束的词元（模型用结束词元来向系统表明已完成生成），以及我们随后将看到的其他功能性词元

我们按照从旧到新的时间顺序考察不同的分词器 ，看看它们如何对这段文本进行分词，以及这可能反映出语言模型的哪些特点。

我们将使用以下函数对文本进行分词，并用彩色背景显示每个词元：

```python
colors_list = [
    '102;194;165', '252;141;98', '141;160;203',
    '231;138;195', '166;216;84', '255;217;47'
]

def show_tokens(sentence, tokenizer_name):
    tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
    token_ids = tokenizer(sentence).input_ids
    for idx, t in enumerate(token_ids):
        print(
            f'\x1b[0;30;48;2;{colors_list[idx % len(colors_list)]}m' +
            tokenizer.decode(t) +
            '\x1b[0m',
            end=' '
        )
```

#### 2.5.1. BERT 基座模型（大小写不敏感）（2018）  

① 分词方法：WordPiece，参见论文 “Japanese and Korean Voice Search”。  
② 词表大小：30 522。  
③ 特殊词元：
- `unk_token [UNK]`  
	-   未知词元，当分词器没有为某类字符进行特定编码时使用。  
- `sep_token [SEP]` 
	-   分隔符词元，用于支持需要为模型提供两段文本的特定任务 \[ 在这些情况下，模型被称为`交叉编码器`（cross-encoder）\]
		- 例如，我们将在第 8 章看到分隔符在重排序中的应用。  
- `pad_token [PAD]`  
	- 填充词元，用于填充模型输入中未使用的位置，因为模型通常要求输入数据具有固定的长度（也就是其上下文窗口）  
- `cls_token [CLS]`  
	- 分类词元，主要用于分类任务的特殊词元，我们将在第 4 章看到。  
- `mask_token [MASK]`  
	- 掩码词元，在训练过程中用于隐藏词元。  

分词后的文本：  
![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/color002.jpg)  

BERT 分词器有两个版本：
- 大小写敏感（保留大写字母）的版本 `和` 大小写不敏感（所有大写字母先转换为小写字母）的版本。
- 对于大小写不敏感（也是更受欢迎）的 BERT 分词器版本，我们注意到以下特点。
	- 换行符消失了，这使得模型无法识别通过换行符体现的信息（例如，每一轮对话都位于新的一行的聊天记录）。
	- 所有文本都变成小写。
- capitalization 这个词被编码为两个子词元：。
- 符号用来表示这个词元是与前面的词元相连的部分词元。这也是一种表示空格位置的方法，因为分词中约定没有 前缀的词元前面应该有一个空格。
- 表情符号和中文字符消失了，被替换成了 特殊词元，即“未知词元”。

#### 2.5.2. BERT 基座模型（大小写敏感）（2018）  

分词方法：WordPiece。  
词表大小：28 996。  
特殊词元：与大小写不敏感版本相同  
分词后的文本：  

![{%}|1072](https://www.ituring.com.cn/figures/2025/HandsonLLM/color007.jpg)  

大小写敏感版本的 BERT 分词器的主要不同之处在于包含了大写词元。
- 注意 CAPITALIZATION 现在被表示为八个词元：。
- 两种 BERT 分词器都会在输入文本前后分别添加一个起始词元和结束词元 。
-  `[CLS]` 和 `[SEP]` 是用于包裹输入文本的`功能性词`元，各有其用途。
	-  `[CLS]` 代表分类（`classification`），因为它有时被用于句子分类。
	-  `[SEP]` 代表分隔符（`separator`），用于在某些需要向模型传递两个句子的应用中分隔句子
		- （例如，在第 8 章中，我们将使用 `[SEP]` 词元来分隔查询文本和候选结果）。

#### 2.5.3. GPT-2（2019）  

**分词方法**：BPE，参见论文“Neural Machine Translation of Rare Words with Subword Units”。  
**词表大小**：50 257。  
**特殊词元**： `<|endoftext|>`  
**分词后的文本**：

![{%}|752](https://www.ituring.com.cn/figures/2025/HandsonLLM/color011.jpg)  

使用 GPT-2 分词器，我们注意到以下特点。
- 分词器保留了`换行符`。
- 保留了大小写，CAPITALIZATION 这个词被表示为四个词元。
- 表情符号和中文字符“鸟”，分别被表示为多个词元。虽然我们看到这些词元显示为字符，但它们实际上代表不同的词元。
	- 例如，这个表情符号被分解成词元 ID 为 8582、236 和 113 的词元。
	- 分词器能够成功地从这些词元中重构出原始字符。我们可以通过打印 `tokenizer.decode([8582, 236, 113])` 来验证，它会输出。
- 制表符
	- 两个制表符（tab）被表示为两个词元（在词表中的词元 ID 为 197），
	- 三个制表符被表示为三个词元（词元号为 220），
	- 最后一个空格被包含在表示闭合引号的词元中。
- 空白字符有什么意义？
	- 这类字符对于模型理解或生成代码非常重要。一个能够使用单个词元来表示连续四个空白字符的模型，更适合处理 Python 代码数据集。虽然模型也可以将其表示为四个不同的词元，但这会增加建模的难度，因为模型需要追踪缩进级别，这通常会导致性能下降。
	- 这个例子说明，合理选择分词粒度，可以帮助模型在特定任务上取得更好的表现。

#### 2.5.4. FLAN-T5（2022）  

分词方法：
- SentencePiece，参见论文  
词表大小：32 100。  
特殊词元：
- `unk_token <unk>` （未知词元）
- `pad_token <pad>` （填充词元）  

分词后的文本：  

![{%}|856](https://www.ituring.com.cn/figures/2025/HandsonLLM/color013.jpg)  

FLAN-T5 系列模型使用 SentencePiece 方法。我们注意到以下两点：
- 该方法中没有换行符或空白字符词元，这会使模型 `处理代码` 变得具有挑战性；
- 表情符号和中文字符都被替换为 `<unk>` 词元，模型完全无法识别这类字符。

#### 2.5.5. GPT-4（2023）  

分词方法：BPE  
词表大小：略多于 100 000  
特殊词元：
- `<|endoftext|>`
- 中间填充词元。以下三个词元使 LLM 能够在考虑前后文的情况下生成补全内容。这种方法在论文“Efficient Training of Language Models to Fill in the Middle”中有详细解释，具体细节不在本书的讨论范围。
	- `<|fim_prefix|>`
	- `<|fim_middle|>`
	- `<|fim_suffix|>`  

分词后的文本：  
![{%}|768](https://www.ituring.com.cn/figures/2025/HandsonLLM/color014.jpg)  

GPT-4 的分词器行为与其前身 GPT-2 分词器类似，一些区别如下。
- GPT-4 分词器将`四个空白字符`表示为单个词元。实际上，它甚至为各种长度的空白字符序列（最多 83 个）都设有特定的词元。
- Python 关键字 在 GPT-4 中有自己的词元。这一点和前一点都源于模型对代码和自然语言的关注。
- GPT-4 分词器使用更少的词元来表示大多数词，例如 `CAPITALIZATION`（用两个词元取代四个词元）和 `tokens`（用一个词元取代三个词元）。

#### 2.5.6. StarCoder2（2024）  

StarCoder2 是一个专注于生成代码的 150 亿参数模型，
- 参见论文“StarCoder2 and The Stack v2: The Next Generation”。这是对 StarCoder 的原始工作的延续，参见论文“StarCoder: May the Source be with You!”。  
分词方法：BPE  
词表大小：49 152  
特殊词元示例：
- `<|endoftext|>`
- 中间填充词元：
	- `<fim_prefix>`
	- `<fim_middle>`
	- `<fim_suffix>`
	- `<fim_pad>`
- 在表示代码时，管理上下文很重要。一个文件可能会调用定义在另一个文件中的函数。
	- 因此，模型需要某种方式来识别同一代码仓库中位于不同文件中的代码，同时也要区分不同仓库中的代码。
	- 这就是为什么 StarCoder2 使用特殊词元来表示仓库名和文件名：
		- `<filename>`
		- `<reponame>`
		- `<gh_stars>`  

分词后的文本：  

![{%}|848](https://www.ituring.com.cn/figures/2025/HandsonLLM/color016.jpg)  

这是一个专注于代码生成的编码器。
- 类似于 GPT-4，它将一系列空白字符编码为单个词元。
- 与我们之前看到的分词方法相比，此方法的主要不同之处是每个数字都被分配了词元（因此 600 变成了 ）。这种设计假设这样可以更好地表示数字和数学概念。例如，在 GPT-2 中，数字 870 用单个词元表示。但 871 用两个词元（ `8` 和 `71` ）表示。你可以直观地看到，这种表示方式可能会让模型混淆对数字的理解。

#### 2.5.7. Galactica  

Galactica 模型（参见论文“Galactica: A Large Language Model for Science”）专注于科学知识领域，是在大量的科学论文、参考资料和知识库上训练而来的。它特别注重分词方式，旨在更好地理解其所表示的数据集的细微差别。例如，它包含了用于表示引用、推理、数学、氨基酸序列和 DNA 序列的特殊词元。  
分词方法：BPE  
词表大小：50 000  
特殊词元：
- `<s>`
- `<pad>`
- `</s>`
- `<unk>`
- 引用。引用内容用以下两个特殊词元包裹：
	- `[START_REF]`
	- `[END_REF]`  
	下面是论文中的一个使用示例： `Recurrent neural networks, long short-term memory [START_REF]Long Short-Term Memory, Hochreiter[END_REF]`
- 逐步推理：
	- `<work>` 是一个有趣的词元，模型用它来进行思维链（chain-of-thought，CoT）推理。  

分词后的文本：  

![{%}|688](https://www.ituring.com.cn/figures/2025/HandsonLLM/color018.jpg)  

Galactica 分词器在设计上与 StarCoder2 类似，都考虑了处理代码的需求。两者对空白字符的编码方式相同：将不同长度的空白字符序列分别编码为单个词元。不同之处在于，Galactica 对制表符也进行了同样的处理。因此，在我们见过的所有分词器中，它是唯一一个将由两个制表符组成的字符串（ `"\t\t"` ）分配为单个词元的。

#### 2.5.8. Phi-3（和 Llama 2）  

本书中讨论的 Phi-3 模型重用了 Llama 2 的分词器，但添加了一些特殊词元。  
分词方法：BPE  
词表大小：32 000  
特殊词元：
- `<|endoftext|>`
- 对话词元。随着对话 LLM 于 2023 年流行，LLM 的对话特性开始成为其主要应用。分词器通过添加表示对话轮次和对话者角色的词元来适应这一趋势。这些特殊词元包括：
	- `<|user|>`
	- `<|assistant|>`
	- `<|system|>`  

#### 2.5.9. 总结

现在，我们集中回顾一下以上示例：  

![{%}|664](https://www.ituring.com.cn/figures/2025/HandsonLLM/table.jpg)

### 2.6. 分词器属性

> [!abstract]  
> 更多参考  
> ① [208. 分词器的三要素决定论：算法、参数与领域数据（篇一）](/Zuw7Ql)  
> ② [209. 分词器的三要素决定论：算法、参数与领域数据（篇二）](/kBhSF1)

前文简单讨论了一些训练好的分词器，展示了不同分词器之间的多种差异。是什么决定了它们的分词行为呢？
- 分词方法
- 用于初始化分词器的参数
- 以及训练分词器的目标数据所在的领域。

#### 2.6.1. 分词方法  

正如我们所见，分词方法有许多种，其中 `BPE` 是最流行的一种。

每种方法都定义了一种算法，用于选择合适的词元集来表示数据集。要想大概了解这些方法，可以参考 `Hugging Face 的分词器汇总页面`。

#### 2.6.2. 用于初始化分词器的参数  

选择分词方法后，LLM 设计者需要设置分词器的一些`关键参数`，主要包括词表大小、特殊词元和大小写处理策略。

词表大小  
- 分词器的词表中保留多少个词元？
- 常见的词表大小的值有 30K 、50K，但我们越来越多地看到像 100K 这样更大规模的词表了

特殊词元  
- 我们希望模型跟踪哪些特殊词元？我们可以根据需要添加任意数量的特殊词元，特别是要针对特定用例构建 LLM 时。常见的特殊词元包括：
	- 文本开始词元（例如 `<s>` ）
	- 文本结束词元
	- 填充词元
	- 未知词元
	- CLS 词元
	- 掩码词元  

问题领域建模
- 除此之外，LLM 设计者还可以添加有助于对所关注**问题领域建模的词元**，
- 例如 Galactica 的 `<work>` 和 `[START_REF]` 词元。

**大小写处理策略**  
- 在英语等语言中，我们如何处理大小写？是否应该将所有内容转换为小写？
- 名称的大小写通常携带有用的信息，但我们是否愿意让那些全大写版本的单词额外占用词表空间？

#### 2.6.3. 数据领域  

即使我们选择相同的方法和参数，分词器的行为也会因`其训练所用的数据集`而有所不同（这甚至发生在模型训练开始之前）。  
前文提到的分词方法通过优化词表来表示特定数据集。从我们的示例中可以看到，这对代码、多语言文本等数据集都有影响。  

例如在代码方面，我们看到，一个面向文本的分词器可能会对缩进空格进行如下分词（我们用颜色突出显示一些词元）：  

![{%}|592](https://www.ituring.com.cn/figures/2025/HandsonLLM/color019.jpg)  

这对于`面向代码`的模型来说可能并不是最优方式。通过做出不同的分词选择，面向代码的模型往往可以得到改进：  

![{%}|760](https://www.ituring.com.cn/figures/2025/HandsonLLM/color020.jpg)  

这些分词选择能够简化模型的处理过程，从而更有可能提升其性能。  

如果想更详细地了解分词器的训练，可以参考 Hugging Face 上的 NLP 课程中分词器相关的部分

## 3. 词元嵌入

> [!info]  
> 另外可参考
> - [211. 词云嵌入（精简版）](/mrFX36)
> - [210.   词元嵌入（代码版本说明）](/1caWnn)
> - [213. 词云嵌入（会编程的高中生版本）](/KJKUmV)
> - [212.  词元嵌入（高中生版）](/ITKzSD)

- 分词
	- 解决了将语言表示给语言模型这一问题。
	- 从这个意义上说，语言是`词元的序列`。
	- 如果我们在足够大的`词元集`上训练一个足够好的模型，它就会开始捕捉训练数据集中出现的复杂模式：
- 如果`训练数据`包含大量英语文本，通过这些模式，模型就能够表示和生成英语；
- 如果`训练数据`包含事实性信息（例如维基百科），模型就会具备生成一些事实性信息的能力

解决这个难题的下一步是为这些词元找到`最佳的数值`表示

这就是嵌`入的作用`。它们是用于捕捉`语言中含义`和`模式的数值表示空间`。

### 3.1. 语言模型为其`分词器`的`词表`保存嵌入

分词器经过初`始化`和`训练`，

语言模型为分词器词表中的每个词元都保存了一个嵌入向量。当我们下载预训练语言模型时，模型的一部分就是保存所有这些向量的`嵌入矩阵`。

![{%}|928](https://www.ituring.com.cn/figures/2025/HandsonLLM/041.jpg)

图 2-7：语言模型为其分词器中的`每个词元`保存一个与之关联的`嵌入向量`


在训练开始之前，这些向量会像模型的其他权重一样`被随机初始`化，但`训练过程`会为它们分配值，使其能够执行有意义的行为。

### 3.2. 使用`语言模型`创建`与上下文相关的词嵌入`

![{%}|744](https://www.ituring.com.cn/figures/2025/HandsonLLM/042.jpg)

> 图 2-8：语言模型产生的与上下文相关的词元嵌入比原始的静态词元嵌入更好

```python
from transformers import AutoModel, AutoTokenizer

# 加载分词器
tokenizer = AutoTokenizer.from_pretrained("microsoft/deberta-base")

# 加载语言模型
model = AutoModel.from_pretrained("microsoft/deberta-v3-xsmall")

# 对句子进行分词
tokens = tokenizer('Hello world', return_tensors='pt')

# 处理词元
output = model(tokens)[0]
```

这段代码下载了一个预训练的分词器和模型，并用它们来处理字符串 `"Hello world"` 。

模型的输出保存在 `output` 变量中。我们先打印它的各维度来检查这个变量（我们预计它是一个多维数组）：

```fortran
output.shape
```

输出结果为：

```
torch.Size([1, 4, 384])
```

跳过第一个维度，我们可以将这个结果理解为 `4 个词元`，每个词元都嵌入到一个包含 `384 个值的向量中`。

第一个维度是批次（batch）维度，要同时向模型发送多个输入句子（如训练时）就要用到它。此时，多个输入句子会被同时处理，从而加快处理速度。

那么，这 4 个向量是什么？是分词器将两个词拆分成了 4 个词元，还是发生了其他情况？我们可以运用已经学过的分词器知识来检查它们：

```python
for token in tokens['input_ids'][0]:
    print(tokenizer.decode(token))
```

输出结果为：

```
[CLS]
Hello
world
[SEP]
```

可见，这个分词器和模型会在字符串的开头和结尾分别添加 `[CLS]` 和 `[SEP]` 词元。

我们的语言模型现在已经处理了文本输入。其输出结果如下：

```python
tensor([[
[-3.3060, -0.0507, -0.1098, ..., -0.1704, -0.1618, 0.6932],
[ 0.8918, 0.0740, -0.1583, ..., 0.1869, 1.4760, 0.0751],
[ 0.0871, 0.6364, -0.3050, ..., 0.4729, -0.1829, 1.0157],
[-3.1624, -0.1436, -0.0941, ..., -0.0290, -0.1265, 0.7954]
]], grad_fn=<NativeLayerNormBackward0>)
```

这是语言模型的原始输出。LLM 的应用就是建立在这样的输出之上的。

我们在图 2-9 中回顾了语言模型的输入分词和输出结果。从技术上讲，将词元 ID 转换为原始嵌入向量是语言模型内部发生的第一步。

![{%}|592](https://www.ituring.com.cn/figures/2025/HandsonLLM/043.jpg)

> 图 2-9：语言模型以原始静态嵌入向量作为输入，并生成与上下文相关的文本嵌入

## 4. 文本嵌入（用于句子和整篇文档）

> [!info]  
> 另外可参考
> - [216. 文本嵌入（用于句子和整篇文档）：代码详解篇](/GWjAds)
> - [215. 文本嵌入（用于句子和整篇文档）：简洁篇](/HJrlZz)

用`单个向量`来表示`文本片段`。

我们可以这样理解文本嵌入模型：它接收一段文本，最终生成单个向量，这个向量以某种形式表示该文本并捕捉其含义。图 2-10 展示了这个过程。

![{%}|504](https://www.ituring.com.cn/figures/2025/HandsonLLM/044.jpg)

> 图 2-10：第一步，我们使用嵌入模型提取特征并将输入文本转换为嵌入向量

生成 文本 嵌入有多种方法
- 方法一：所有 词元 嵌入的值取平均值。
- 方法二：使用 `sentence-transformers` 生成文本嵌入

```python
from sentence_transformers import SentenceTransformer

# 加载模型
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

# 将文本转换为文本嵌入
vector = model.encode("Best movie ever!")

# 现在这个句子被编码成一个维度为 768 的向量
vector.shape  # (768,) 
```

## 5. LLM 之外的词嵌入

嵌入（即`为对象分配有意义的向量表示`）在许多领域都很有用，包括推荐引擎和机器人技术。

### 5.1. 使用预训练词嵌入

让我们看看如何使用 `Gensim 库`下载预训练词嵌入（如 word2vec 或 GloVe）：

```python
import gensim.downloader as api

# 下载嵌入（66 MB，glove，训练数据来自维基百科，向量大小：50）
# 其他选项包括"word2vec-google-news-300"
# 更多选项请访问gensim-data的GitHub仓库
model = api.load("glove-wiki-gigaword-50")
```

这里，我们下载了在维基百科上训练的大量词的嵌入。然后，我们可以通过查看`特定词（例如 king）`的`最近邻来探索嵌入空间`：

```python
model.most_similar([model['king']], topn=11)
```

输出结果：

```scheme
# 下面是都和 king 相近的词
[('king', 1.0000001192092896),
('prince', 0.8236179351806641),
('queen', 0.7839043140411377),
('ii', 0.7746230363845825),
('emperor', 0.7736247777938843),
('son', 0.766719400882721),
('uncle', 0.7627150416374207),
('kingdom', 0.7542161345481873),
('throne', 0.7539914846420288),
('brother', 0.7492411136627197),
('ruler', 0.7434253692626953)]
```

### 5.2. word2vec 算法与对比训练

更多参考：
- [219. word2vec 核心原理：滑动窗口、二分类欺骗（及其解决）、负采样](/dreFom)
- [219. word2vec 核心原理：滑动窗口、二分、负采样](/gL1htE)

> 本文说的太不好理解，删除

## 6. 推荐系统中的嵌入

`嵌入`被广泛应用于`推荐系统`

### 6.1. 基于嵌入的歌曲推荐

> 将使用 `word2vec 算法`，利用`人工创建的音乐播放列表`来嵌入歌曲。

想象一下，我们把`每首歌曲`都当作`一个词或词元`来处理，把`每个播放列表`当作一个`句子`，这些嵌入就可以用来推荐经常出现在同一个播放列表中的歌曲。

我们将使用的 Playlist 数据集是由康奈尔大学的 Shuo Chen 收集的。它包含了来自美国数百个广播电台的播放列表。图 2-17 展示了这个数据集的形式。

![{%}|688](https://www.ituring.com.cn/figures/2025/HandsonLLM/051.jpg)

> 图 2-17：为了获得捕捉歌曲相似性的歌曲嵌入，我们将使用由`一系列播放列表组成的数据集`，每个播放列表包含一组歌曲

我们从 Michael Jackson 的“Billie Jean”（歌曲 ID 为 3822）开始：

```bash
# 我们将在下面详细定义和探索这个函数
print_recommendations(3822)
```

![{%}|568](https://www.ituring.com.cn/figures/2025/HandsonLLM/color021.jpg)

看起来很合理，Madonna、Prince 的歌曲，以及 Michael Jackson 的其他歌曲是最近邻。

让我们从流行乐转向说唱领域，看看 2Pac 的“California Love”的近邻：

```
print_recommendations(842)
```

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/color022.jpg)

这个列表看起来也相当合理！现在我们已经看到它能工作，让我们看看如何构建这样一个系统。

### 6.2. 训练歌曲嵌入模型

首先加载包含`歌曲播放列表的数据集`，以及`每首歌曲的元数据`，如标题和艺术家：

```python
import pandas as pd
from urllib import request

# 获取播放列表数据集文件
data = request.urlopen('https://storage.googleapis.com/maps-premium/data set/yes_complete/train.txt')

# 解析播放列表数据集文件。跳过前两行，因为它们只包含元数据
lines = data.read().decode("utf-8").split('\n')[2:]

# 删除只有一首歌的播放列表
playlists = [s.rstrip().split() for s in lines if len(s.split()) > 1]

# 加载歌曲元数据
songs_file = request.urlopen('https://storage.googleapis.com/maps-premium/data
set/yes_complete/song_hash.txt')
songs_file = songs_file.read().decode("utf-8").split('\n')
songs = [s.rstrip().split('\t') for s in songs_file]
songs_df = pd.DataFrame(data=songs, columns = ['id', 'title', 'artist'])
songs_df = songs_df.set_index('id')
```

现在我们已经保存了，让我们检查一下列表 `playlists` 。其中每个元素都是一个包含一系列歌曲 ID 的播放列表：

```python
print( 'Playlist `#1:\n` ', playlists[0], '\n')
print( 'Playlist `#2:\n` ', playlists[1])
```
```
Playlist `#1:` ['0', '1', '2', '3', '4', '5', ..., '43']
Playlist `#2:` ['78', '79', '80', '3', '62', ..., '210']
```

让我们训练这个模型：

```python
from gensim.models import Word2Vec

# 训练我们的word2vec模型
model = Word2Vec(
    playlists, vector_size=32, window=20, negative=50, min_count=1, workers=4
)
```

训练需要一两分钟的时间，`最终会为每首歌曲计算出嵌入向量`。现在我们可以像之前处理词语一样，使用这些嵌入向量来寻找相似的歌曲：

```
song_id = 2172

# 让模型找出与歌曲2172相似的歌曲
model.wv.most_similar(positive=str(song_id))
```

输出结果为：

```scheme
[('2976', 0.9977465271949768),
 ('3167', 0.9977430701255798),
 ('3094', 0.9975950717926025),
 ('2640', 0.9966474175453186),
 ('2849', 0.9963167905807495)]
```

这是与`歌曲 2172` 具有最相似的嵌入表示的歌曲列表。

在这个例子中，这首歌是：

```python
print(songs_df.iloc[2172])
```
```
title Fade To Black
artist Metallica
Name: 2172, dtype: object
```

推荐给出的都属于重金属和硬摇滚风格的歌曲：

```python
import numpy as np

def print_recommendations(song_id):
    similar_songs = np.array(
        model.wv.most_similar(positive=str(song_id),topn=5)
    )[:,0]
    return songs_df.iloc[similar_songs]

# 提取推荐结果
print_recommendations(2172)
```

![{%}|592](https://www.ituring.com.cn/figures/2025/HandsonLLM/color023.jpg)

## 7. 小结

-  LLM 词元
- 分词器
- 使用词元嵌入的实用方法
- 分词器如何作为处理 LLM 输入的第一步
- 将原始文本输入转换为`词元 ID`
- 常见的`分词方案`包括将文本分解为`词、子词、字符或字节`
- 通过对现实世界预训练分词器（从 BERT 到 GPT-2、GPT-4 和其他模型）的探索
- 某些分词器在某些方面表现更好（例如，保留大小写、换行符或其他语言的词元等信息）；
- 而在其他方面，分词器之间仅存在差异（例如，它们如何分解某些词），并无优劣之分。

分词器设计中有三个主要决策点：分词器算法（如 BPE、WordPiece、SentencePiece）、分词参数（包括词表大小、特殊词元、大小写处理策略和不同语言的处理）以及用于训练分词器的数据集。

语言模型能够生成高质量与上下文相关的词元嵌入，这种嵌入改进了原始的静态嵌入。这些与上下文相关的词元嵌入可以用于命名实体识别、抽取式文本摘要和文本分类等任务。

除了生成词元嵌入，语言模型还可以生成涵盖整个句子甚至文档的文本嵌入。这为本书第二部分将要展示的众多语言模型应用提供了强大支持。

在 LLM 之前，word2vec、GloVe 和 fastText 等词嵌入方法非常流行。

在语言处理中，这些方法已经在很大程度上被语言模型产生的与上下文相关的词嵌入所取代。

word2vec 算法依赖两个主要思想：skip-gram 模型和负采样。

从根据播放列表构建音乐推荐系统的例子中我们看到，嵌入对于创建和改进推荐系统非常有用。
