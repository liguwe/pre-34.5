# Transformer 块的内部结构

`#2025/12/29` `#ai` 

>  Transformer 块是 LLM 的"核心处理单元"

## 1. Transformer 块的位置和作用

```python
输入文本 → 分词器 
→ [Transformer 块 1] 
→ [Transformer 块 2] → ...   
→ [Transformer 块 N] → 语言建模头 → 输出词元  
```

如下图所示：

![{%}|592](https://www.ituring.com.cn/figures/2025/HandsonLLM/062.jpg)

关键信息：

- 原始 Transformer 论文约有 `6 个块`
- 现代 LLM 通常`超过 100 个块`
- 每个块处理输入，然后把结果传给下一个块

## 2. Transformer 块的"两大组件"

每个 `Transformer 块`由`两个首尾相接`的组件构成，如下图：
- ① 自注意力层
- ② 前馈神经网络

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/063.jpg)

### 2.1. 组件 1：自注意力层（Self-Attention）

作用：整合来自`其他词元`的相关信息

```python hl:3,6
# 伪代码示例  
def self_attention(current_token, all_previous_tokens):  
    # 找出哪些前面的词元与当前词元相关  
    relevance_scores = calculate_relevance(current_token, all_previous_tokens)  
    
    # 根据相关性，混合前面词元的信息  
    enhanced_token = combine_info(all_previous_tokens, relevance_scores)  
    
    return enhanced_token  
```

假设：要理解句子 "狗追松鼠，因为它"。
- `自注意力层`会判断"`它`"指的是狗还是松鼠
- 它会"回头看"前面的词元，找到相关信息
- 发现“它”跟“松鼠”的关系更紧密（或者跟狗更紧密，取决于后文）
- 把这些上下文信息融入"它"的表示中

### 2.2. 组件 2：前馈神经网络层（Feed-Forward Neural Network）

作用：包含模型的主要处理能力和记忆，他

```python
# 伪代码示例  
def feed_forward(token_vector):  
    # 两层神经网络  
    hidden = ReLU(W1 @ token_vector + b1)  # 第一层  
    output = W2 @ hidden + b2              # 第二层  
    return output  
```

![{%}|688](https://www.ituring.com.cn/figures/2025/HandsonLLM/064.jpg)  

通俗解释：

- 这是模型的"`大脑`"，存储从训练数据中学到的知识
- 比如
	- 训练时见过很多 "The Shawshank Redemption"，它就能记住这个电影名
	-  输入：“The Shawshank”（肖申克的……）
	- 前馈网络通过查阅训练好的参数（记忆），知道后面该接 “Redemption”（救赎）。
- 不仅`记忆`，还能`泛化`（处理没见过的输入）

```python
def feed_forward(token_vector):
    # 调用模型“脑子”里记住的知识（权重）进行计算
    # 比如：看到"肖申克" -> 激活"救赎"相关的数值
    return processed_vector
```

数据流向图解

```python
输入向量  x
   ⬇
[ 工序 1: 自注意力 ]  <--  "嘿，前面的词谁跟我有关？把信息借我一点！"
   ⬇
[ 工序 2: 前馈网络 ]  <--  "让我用脑子里的知识（训练数据）来处理一下这个词。"
   ⬇
输出向量 (传给下一层)
```

## 3. 结构图解

```
┌─────────────────────────────────────┐  
│      Transformer 块 1               │  
│  ┌───────────────────────────┐     │  
│  │  自注意力层                │     │ ← 整合上下文信息  
│  │  (整合其他词元的信息)      │     │  
│  └───────────────────────────┘     │  
│            ↓                        │  
│  ┌───────────────────────────┐     │  
│  │  前馈神经网络层            │     │ ← 主要处理和记忆  
│  │  (模型的记忆和计算能力)    │     │  
│  └───────────────────────────┘     │  
└─────────────────────────────────────┘  
            ↓ 输出传给下一个块  
┌─────────────────────────────────────┐  
│      Transformer 块 2               │  
│         (结构相同)                   │  
└─────────────────────────────────────┘  
            ↓  
           ...  
```

---

## 4. 完整数据流示例

以 Phi -3 模型为例：

```python
from transformers import AutoModel  

model = AutoModel.from_pretrained("microsoft/Phi-3-mini-4k-instruct")  
print(model)  
```

输出结构：

```
Phi3Model(  
  (embed_tokens): 词元嵌入 [32064 个词元 × 3072 维向量]  
  (layers): 32 个 Transformer 块，每个包含：  
    ├─ (self_attn): 自注意力层  
    └─ (mlp): 前馈神经网络（也叫 MLP）  
  (norm): 归一化层  
)  
(lm_head): 语言建模头 [3072 → 32064]  
```

数据流动过程：

```python
输入: "Write an email"  
  ↓ 分词器  
词元: ["Write", "an", "email"]  
  ↓ 词元嵌入  
向量: [3, 3072]  # 3 个词元，每个 3072 维  
  ↓  
┌─ Transformer 块 1 ─────┐  
│  自注意力 → 前馈网络    │  形状保持: [3, 3072]  
└─────────────────────────┘  
  ↓  
┌─ Transformer 块 2 ─────┐  
│  自注意力 → 前馈网络    │  形状保持: [3, 3072]  
└─────────────────────────┘  
  ↓  
  ... (重复 32 次)  
  ↓  
输出向量: [3, 3072]  # 大小相同，但内容已深度加工  
  ↓ 语言建模头  
预测: [3, 32064]  # 为每个位置预测下一个词元  
```

---

## 5. 两大组件的具体工作方式

### 5.1. 自注意力层的工作原理

```python
句子: "Sarah fed the cat because it"  

处理 "it" 时：  
1. 计算 "it" 与前面每个词的相关性分数  
   Sarah: 35%  ← 高相关性！  
   fed:   5%  
   the:   3%  
   cat:   50%  ← 最相关！  
   because: 2%  

2. 根据分数混合信息  
   output = 0.35×Sarah向量 + 0.05×fed向量 + ... + 0.50×cat向量  

结果："it" 的表示中融入了 "cat" 和 "Sarah" 的信息  
```

![{%}|528](https://www.ituring.com.cn/figures/2025/HandsonLLM/071.jpg)

>  多头注意力：每个词元看整句，收集上下文信息

### 5.2. 前馈神经网络层的工作原理

```python
# 简化版结构  
class FeedForward:  
    def __init__(self):  
        self.W1 = 权重矩阵1  # [3072, 12288]  ← 先扩大 4 倍  
        self.W2 = 权重矩阵2  # [12288, 3072]  ← 再压缩回来  
    
    def forward(self, x):  
        # x: [3072] 维向量  
        hidden = ReLU(self.W1 @ x)  # [12288] 维  
        output = self.W2 @ hidden    # [3072] 维  
        return output  
```

作用：
- 扩大维度 → 增加表达能力
- 非线性激活（ReLU）→ 捕捉复杂模式
- 压缩回原始维度 → 传给下一层

> 其实我没看懂

---

## 6. Transformer 块：原始版本（2017）vs 现代版本（如 Llama 3）

|组件|原始 Transformer|现代 Transformer (2024)|
|---|---|---|
|归一化|LayerNorm（在后面）|RMSNorm（在前面）|
|注意力|多头注意力|分组查询注意力 (GQA)|
|位置编码|静态位置嵌入|旋转位置嵌入 (RoPE)|
|激活函数|ReLU|SwiGLU|

> 改进目的：更快的训练速度 + 更好的性能

---

## 7. 实战代码：查看 Transformer 块

```python
from transformers import AutoModelForCausalLM  

# 加载模型  
model = AutoModelForCausalLM.from_pretrained("microsoft/Phi-3-mini-4k-instruct")  

# 查看第一个 Transformer 块  
first_block = model.model.layers[0]  
print(first_block)  

# 输出：  
# Phi3DecoderLayer(  
#   (self_attn): Phi3Attention(...)     ← 自注意力层  
#   (mlp): Phi3MLP(...)                 ← 前馈神经网络  
#   (input_layernorm): Phi3RMSNorm(...) ← 归一化  
# )  

# 总共有多少个块？  
print(f"Transformer 块数量: {len(model.model.layers)}")  # 输出: 32  
```

---

## 8. 关键要点总结 → 编程类比

|概念|通俗解释|编程类比|
|---|---|---|
|Transformer 块|LLM 的核心处理单元|类（Class）的实例|
|堆叠结构|多个块首尾相接|函数的链式调用|
|自注意力层|整合上下文信息|查字典找相关信息|
|前馈网络层|存储知识和计算|数据库 + 计算逻辑|
|块的数量|原始 6 个，现代 100+ 个|神经网络的"深度"|

## 9. 核心流程

```
每个词元进入一个 Transformer 块：  
1. 自注意力：问问其他词元"你们有什么相关信息？"  
2. 前馈网络：基于训练知识进行深度思考和计算  
3. 输出：传给下一个块继续加工  

重复 N 次（N = 块的数量）  

最终：每个词元的向量都包含了丰富的上下文和知识  
```

> 类比：就像写作文，每读一遍（每过一个块）就修改得更好，读 32 遍后，文章就非常精炼了！
