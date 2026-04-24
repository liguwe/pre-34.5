# 使用滑动窗口进行数据采样

`#2026/01/01` `#ai`

> 刷算法时，`滑动窗口`挺常见的

>  引入滑动窗口是为了解决 `如何把一本书变成大模型能吃的训练数据` 这个问题。

## 1. 为什么要用滑动窗口？

模型不能一口气读完整个互联网或一整本书，它有 “注意力上限”（上下文窗口大小，比如 256 或 1024 个词）。

我们需要把长文本切成模型能吃得下的小片段，并且要告诉模型： “看了这几个词，下一个词应该是啥”。

## 2. 什么是滑动窗口？

滑动窗口是一种从连续文本中提取训练样本的技术，通过"移动"一个固定大小的窗口来创建`输入-目标对`。这种方法让大语言模型能够学习预测序列中的下一个词。

## 3. 技术原理

### 3.1. 关键参数

- `max_length`：上下文窗口的大小
- `stride`：窗口滑动的步长
- 目标：
	- 生成`输入词元序列`和对应的`目标词元序列`

## 4. 代码实现

```python 
import tiktoken  

# 1. 读取文本并编码  
with open("the-verdict.txt", "r", encoding="utf-8") as f:  
    raw_text = f.read()  

# 使用GPT-2的BPE分词器进行编码  
tokenizer = tiktoken.get_encoding("gpt2")  
enc_text = tokenizer.encode(raw_text)  

# 打印总词元数  
print("总词元数:", len(enc_text))  
# 示例输出：总词元数: 5145  
```

### 4.1. 滑动窗口采样函数

```python
def create_dataloader_v1(  
    text,               # 编码后的词元序列  
    batch_size=4,       # 批次大小  
    max_length=4,       # 上下文窗口长度  
    stride=1,           # 窗口滑动步长  
    shuffle=False       # 是否打乱顺序  
):  
    # 存储输入和目标词元序列  
    inputs, targets = [], []  
    
    # 使用滑动窗口提取样本  
    for i in range(0, len(text) - max_length, stride):  
        # 输入：当前窗口的词元  
        input_seq = text[i:i+max_length]  
        # 目标：下一个词元序列  
        target_seq = text[i+1:i+max_length+1]  
        
        inputs.append(input_seq)  
        targets.append(target_seq)  
    
    return list(zip(inputs, targets))  

# 创建数据加载器  
dataloader = create_dataloader_v1(  
    enc_text,   
    batch_size=1,    # 批次大小为1，便于演示  
    max_length=4,    # 上下文长度为4  
    stride=1,        # 步长为1  
    shuffle=False    # 不打乱顺序  
)  

# 迭代并查看第一个批次  
data_iter = iter(dataloader)  
first_batch = next(data_iter)  
print("第一个批次:", first_batch)  
# 示例输出：第一个批次: [([40, 367, 2885, 1464], [367, 2885, 1464, 1807])]  
```

![{%}|624](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/022.jpg)

## 5. 关键概念详解

### 5.1. 窗口移动示例

- 原始序列：
	- `[40, 367, 2885, 1464, 1807, 3619]`
- `max_length=4, stride=1`
- 第一个批次：
    - 输入：`[40, 367, 2885, 1464]`
    - 目标：`[367, 2885, 1464, 1807]`
- 第二个批次：
    - 输入：`[367, 2885, 1464, 1807]`
    - 目标：`[2885, 1464, 1807, 3619]`

## 6. 不同参数的影响

```python
# 尝试不同的步长和上下文长度  
dataloader_v2 = create_dataloader_v1(  
    enc_text,   
    batch_size=8,    # 批次大小为8  
    max_length=4,    # 上下文长度为4  
    stride=4,        # 步长为4，减少重叠  
    shuffle=False  
)  

# 获取第一个批次  
data_iter_v2 = iter(dataloader_v2)  
inputs, targets = next(data_iter_v2)  

print("输入批次:\n", inputs)  
print("\n目标批次:\n", targets)  
```

比如下图中， `stride` 不一样时，表现如下：

![{%}|648](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/023.jpg)

## 7. 重要参数解释

- **上下文长度**（`max_length`）：
	- 模型一次观察的词元数量
- **步长**（`stride`）：
	- 控制窗口移动的距离
- **批次大小**：
	- 一次训练处理的样本数量

## 8. 实践建议

- 实际训练中，上下文长度通常 ≥ 256
- 批次大小影响训练效率
- 步长会影响样本的重叠程度

## 9. 结语

滑动窗口就像一个在文本上移动的"取样器"，帮助大语言模型从连续文本中学习预测下一个词的能力！
