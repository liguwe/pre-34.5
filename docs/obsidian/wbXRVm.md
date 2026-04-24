# 前向传播的组成：大模型的“流水线”架构

`#2025/12/29` `#ai` 

## 一个类比

- 如果把`大模型`看作一个处理数据的工厂
	- `前向传播（Forward Pass）` 就是原材料（用户输入的文字）进入工厂，经过一道道工序，最终变成成品（预测的下一个词）的全过程
- 作为软件工程师
	- 你可以把它理解为一个`链式函数调用`（Chained Function Calls） 或者一个 `Pipe 管道`。

整个过程主要由`三个核心组件`串联而成：

## 1. 分词器 (Tokenizer)：把“人话”翻译成“机器码”

模型听不懂英语或中文，它只认数字。  
`分词器` 就像是一个巨大的查字典程序。
- 输入：`"Write an email"`
- 处理：
    1. 切分：`["Write", "an", "email"]`
    2. 查表（Vocab Lookup）：
        - 在词表中找到对应的 ID。
- 输出：`[1102, 34, 9921]` （一串整数 ID 列表）

> 工程师视角的真相：  
> 分词器通常是`独立于`模型之外的预处理工具。它不涉及神经网络计算，就是`纯粹的字符串匹配和哈希查找`。

## 2. 嵌入层 (Embedding)：ID 的“变身”

拿到 ID `1102` 后，模型不能直接做数学运算（你不能把 ID 1102 乘以 0.5）。  

`嵌入层` 是模型的`第一层`，它本质上是一个巨大的查找表（Lookup Table） 或者数据库。

- 逻辑：
	- 模型内部有一个巨大的矩阵，每一行对应一个词的`“档案”（向量）`
- 操作：
    - ID `1102` -> `SELECT vector FROM embeddings WHERE id = 1102`
    - 结果 -> `[0.1, -0.5, 0.03, ...]` （一个高维浮点数向量）
- 意义：
	- 这一步把离散的整数变成了连续的数学空间里的点，让`“语义”`有了数值表示。

---

## 3. 堆叠的 Transformer 块 (Stacked Transformer Blocks)：核心“大脑”

这是模型最厚、最复杂的部分。  
想象一下，你有 32 层（甚至更多）一模一样的滤镜，每一层都在对图像进行一次精修
在 LLM 中，这些层叫 `Transformer 块`。

- 结构：
	- 这些块是首尾相接的。
- 数据流：
    - 第 1 层的输入是嵌入向量
    - 第 1 层的输出传给第 2 层。
    - 第 2 层的输出传给第 3 层……
    - 一直传到第 N 层。
- 作用：
	- 每一层都在结合`上下文`（Self-Attention）和`记忆`（Feed-Forward）来“理解”这句话。
	- 输入进去的是原始的词向量，输出出来的是带有丰富上下文信息的`特征向量`。

```python
# 伪代码：堆叠的处理过程  
hidden_states = embeddings  # 初始状态  

for block in model.transformer_blocks:  
    # 每一层都在修改 hidden_states
    hidden_states = block(hidden_states)  
```

---

## 4. `语言建模头 (LM Head)`：最终的“投票箱”

经过 N 层 Transformer 块的处理，我们得到了一个包含深刻语义的向量（比如对应 "Sarah" 这个位置的向量）。  
现在的任务是：这个`向量`代表字典里的哪一个词？

LM Head 通常就是一个简单的全连接线性层 (Linear Layer)。
- 操作：
	- 把 hidden_states 映射回词表大小（例如 50,000 个词）。
- 输出 (Logits)：
	- 一个长度为 50,000 的数组，每个数字代表该词成为“下一个词”的得分。
- Softmax：
	- 把得分转换成概率（总和为 1）。

```python
# 假设 hidden_states 是 [0.5, 0.1, ...] (维度 4096)  
# 词表大小是 50000  

logits = lm_head(hidden_states)   
# logits 变成 [12.5, -3.2, 5.1, ...] (维度 50000)  
# 分数越高，概率越大  
```

---

## 💻 总结：工程师视角的 Python 实现

把上面所有步骤串起来，一个 LLM 的前向传播代码大概长这样：

```python
class SimpleLLM(nn.Module):  
    def __init__(self):  
        # 1. 嵌入层 (数据库)  
        self.embedding = nn.Embedding(vocab_size=50000, dim=4096)  
        
        # 2. 堆叠的块 (核心逻辑)  
        self.blocks = nn.ModuleList([  
            TransformerBlock() for _ in range(32)  
        ])  
        
        # 3. 语言建模头 (输出适配器)  
        self.lm_head = nn.Linear(in_features=4096, out_features=50000)  

    def forward_pass(self, input_ids):  
        # Step 1: ID -> 向量  
        x = self.embedding(input_ids)  
        
        # Step 2: 通过 32 层处理  
        for block in self.blocks:  
            x = block(x)  
            
        # Step 3: 向量 -> 词表分数  
        logits = self.lm_head(x)  
        
        return logits  
```

## 一句话总结：  

前向传播就是把一串 ID 扔进模型，经过 Embedding 查表 变成向量，再通过几十层 Transformer 块 的反复揉捏，最后通过 `LM Head` 算出一堆分数的流水线过程。
