# 使用文本生成模型

`#2025/12/31` `#ai` 

两类模型：
- 有专注于文本表示的模型（如`BERT`）
- 也有能够生成文本的模型，如 `ChatGPT`

## 选择文本生成模型：专有 vs. 开源

### 两大阵营

当你想使用文本生成模型时，首先要做一个重要决定：**用专有模型还是开源模型？**

**专有模型**（如ChatGPT、GPT-4）：
- ✅ **优点**：
	- 性能通常更好，效果更惊艳
- ❌ **缺点**：
	- 需要付费，无法看到内部实现，数据安全性存疑

**开源模型**（如Phi-3、Llama）：
- ✅ **优点**：
	- 免费使用，可以本地部署，灵活可控
- ❌ **缺点**：
	- 性能可能稍逊一筹（但差距在缩小）

>  **本书立场**：虽然ChatGPT很强大，但我们**更关注开源模型**，因为它们提供了更大的灵活性，而且完全免费！

### 模型发展史一览

看看这些有影响力的基础模型（按时间顺序）：

```
2018 ───> GPT-1 (生成模型的起点)  
2019 ───> GPT-2  
2020 ───> GPT-3 (175B参数，震撼业界)  
2022 ───> ChatGPT (GPT-3.5，引爆全球)  
2023 ───> GPT-4、Llama 2、Phi-3 等百花齐放  
```

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/132.jpg)

> **图：基础模型通常以`多种参数`规模发布**

> **重要概念**：这些模型都经过**预训练**（在海量数据上学习语言），然后通常会进行**微调**（学习遵循指令、回答问题）。

## 加载文本生成模型：从零开始

### 方法1：使用transformers库（标准方式）

这是最常用的方法，分两步走：

#### **第1步：加载模型和分词器**

```python
from transformers import AutoModelForCausalLM, AutoTokenizer  

# 加载分词器（负责把文字切成词元）  
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")  

# 加载模型本身  
model = AutoModelForCausalLM.from_pretrained(  
    "microsoft/Phi-3-mini-4k-instruct",  
    device_map="cuda",        # 使用GPU加速  
    torch_dtype="auto",       # 自动选择数据类型  
    trust_remote_code=True    # 信任远程代码  
)  
```

**关键点解释**：

- `AutoTokenizer`：
	- 自动下载并加载分词器
- `AutoModelForCausalLM`：
	- 专门用于文本生成的模型类
- `device_map="cuda"`：
	- 如果你有NVIDIA GPU，就用它加速；没有就改成"cpu"
- **为什么需要两个组件？**
    - 分词器：
        - 将"你好吗"→ `[你, 好, 吗]`（数字ID）
    - 模型：
        - 接收数字ID，输出预测结果

#### **第2步：创建生成流水线（简化操作）**

```python
from transformers import pipeline  

# 把模型、分词器、生成策略打包成一个函数  
generator = pipeline(  
    "text-generation",           # 任务类型  
    model=model,  
    tokenizer=tokenizer,  
    return_full_text=False,      # 只返回生成的部分  
    max_new_tokens=500,          # 最多生成500个词元  
    do_sample=False              # 不使用随机采样  
)  
```

### 方法2：使用量化模型（节省内存）

如果你的显存不够（比如只有6GB），可以用**量化版本**（GGUF格式）：

```python
from langchain import LlamaCpp  

# 加载量化后的模型（体积更小，速度更快）  
llm = LlamaCpp(  
    model_path="Phi-3-mini-4k-instruct-q4.gguf",  # 量化后的文件  
    n_gpu_layers=-1,      # 使用所有GPU层  
    max_tokens=500,  
    n_ctx=2048,           # 上下文窗口  
    seed=42,              # 随机种子（保证结果可复现）  
    verbose=False  
)  
```

**什么是量化？**  

就像把一张高清照片压缩成普通画质——牺牲一点点质量，换来更小的体积和更快的速度。

```
原始模型：32位浮点数 → 3.1415927（高精度）  
量化模型：16位浮点数 → 3.141（低精度，但够用）  
```

---

## 控制模型输出：三大参数

生成文本不是一次性完成的，而是**一个词元一个词元地生成**。 我们可以通过调整参数来控制生成行为：

### 参数1：return_full_text（返回内容控制）

```python
# 设置为 False：只返回模型生成的新内容  
return_full_text=False  

# 示例  
输入："写一首诗："  
输出："春风吹拂柳枝摇..."  ✅ (只有新内容)  

# 设置为 True：返回输入+生成内容  
输出："写一首诗：春风吹拂柳枝摇..." ❌ (包含输入)  
```

### 参数2：max_new_tokens（长度控制）

```python
max_new_tokens=500  # 最多生成500个词元  
```

**为什么需要限制？**

- 防止模型"`话痨`"，一直说个不停
- 避免异常输出（有些模型可能会生成到上下文窗口的极限）
- 控制API成本（如果用的是付费模型）

### 参数3：do_sample（随机性控制）

```python
do_sample=False  # 确定性输出（总是选概率最高的词）  
```

**两种模式对比**：

|模式|do_sample=False|do_sample=True|
|---|---|---|
|**行为**|贪心选择（选最可能的词）|随机采样（按概率选词）|
|**结果**|每次运行结果相同|每次运行结果不同|
|**适用场景**|翻译、问答（需要准确性）|创意写作、头脑风暴|

**示例对比**：

```python
# do_sample=False  
输入："天空是"  
输出："蓝色的" (99%概率) → 每次都一样  

# do_sample=True  
输入："天空是"  
输出可能是：  
- "蓝色的" (60%概率)  
- "广阔的" (20%概率)  → 每次可能不同  
- "美丽的" (15%概率)  
```

### **选择 `temperature` 和 `top_p` 值的用例**  

| 示例应用场景 | `temperature` | `top_p` | 描述                                                    |
| ------ | ------------- | ------- | ----------------------------------------------------- |
| 头脑风暴会议 | 高             | 高       | 高随机性输出，且可能输出的词元集合较大。生成的结果通常高度多样化，往往富有创意和出人意料          |
| 邮件生成   | 低             | 低       | 高确定性的输出，且可能输出的词元集合较小。这会产生可预测、重点明确和保守的输出               |
| 创意写作   | 高             | 低       | 高随机性输出，但可能输出的词元集合较小。这会产生有创意的输出，但仍保持连贯性                |
| 翻译     | 低             | 高       | 高确定性的输出，但可能输出的词元集合较大。这会产生连贯的输出，并且具有更广泛的词汇范围，从而更具语言多样性 |

## 实战演示：生成你的第一段文本

### 完整代码示例

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline  

# 1. 加载模型和分词器  
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")  
model = AutoModelForCausalLM.from_pretrained(  
    "microsoft/Phi-3-mini-4k-instruct",  
    device_map="cuda",  
    torch_dtype="auto",  
    trust_remote_code=True  
)  

# 2. 创建生成器  
generator = pipeline(  
    "text-generation",  
    model=model,  
    tokenizer=tokenizer,  
    return_full_text=False,  
    max_new_tokens=50,  
    do_sample=False  
)  

# 3. 准备提示词  
messages = [  
    {"role": "user", "content": "创作一个关于鸡的笑话"}  
]  

# 4. 生成文本  
output = generator(messages)  
print(output[0]["generated_text"])  
```

**输出示例**：

```
为什么鸡不喜欢去健身房？因为它们无法打破蛋的存在！  
```

### 提示词模板的秘密

你知道吗？在底层，你的消息会被转换成特殊格式：

```python
# 你写的：  
{"role": "user", "content": "创作一个笑话"}  

# 实际传给模型的：  
<s><|user|>  
创作一个笑话<|end|>  
<|assistant|>  
```

**特殊词元的作用**：

- `<s>`：句子开始标记
- `<|user|>`：用户说的话
- `<|end|>`：结束标记
- `<|assistant|>`：模型该回答了

这些特殊词元帮助模型理解"谁在说话"以及"什么时候该停下"。

![{%}|616](https://www.ituring.com.cn/figures/2025/HandsonLLM/133.jpg)

> **图：Phi-3 与模型交互所需的模板**

## 关键概念总结

### 1. 自回归生成机制

**核心原理**：模型不是一次性生成整段文本，而是**逐词元生成**

```
步骤1: 输入 "写一封邮件" → 输出 "亲爱"  
步骤2: 输入 "写一封邮件 亲爱" → 输出 "的"  
步骤3: 输入 "写一封邮件 亲爱 的" → 输出 "朋友"  
...循环直到结束  
```

### 2. 上下文长度限制

**什么是上下文长度？**  

模型能处理的**最大词元数量**（输入+输出的总和）

``` hl:6
模型: Phi-3-mini-4k  
上下文长度: 4096个词元  

实际使用:  
- 输入提示词: 100个词元  
- 可用于生成: 4096 - 100 = 3996个词元  
```

> **注意**：每生成一个新词元，当前上下文长度就增加1！

### 3. 基座模型 vs. 指令模型

|类型|训练目标|行为特点|示例|
|---|---|---|---|
|**基座模型**|预测下一个词|自动补全文本|输入"天空是" → "蓝色的"|
|**指令模型**|遵循指令|回答问题|输入"介绍量子物理" → 详细解释|

**为什么有这个区别？**

- `基座模型`只经过预训练（语言建模）
- `指令模型`额外经过微调（学习遵循人类指令）

## 实用技巧与最佳实践

### 技巧1：模型选择建议

```python
# 小型项目（本地运行）  
推荐: Phi-3-mini (3.8B参数)  
优点: 可在8GB显存运行，性能不错  

# 中型项目（有一定资源）  
推荐: Llama 2 7B  
优点: 平衡性能与资源需求  

# 高质量需求（有API预算）  
推荐: GPT-3.5 / GPT-4  
优点: 性能最强，但需要付费  
```

### 技巧2：没有GPU怎么办？

**方案1**：使用Google Colab（本书所有代码都支持）

```python
# 免费的云端GPU环境  
# 访问 https://colab.research.google.com/  
```

**方案2**：使用CPU运行（速度慢但可行）

```python
model = AutoModelForCausalLM.from_pretrained(  
    "microsoft/Phi-3-mini-4k-instruct",  
    device_map="cpu"  # 改成CPU  
)  
```

### 技巧3：参数调优经验

```python
# 场景1：翻译、问答（需要准确）  
do_sample=False  
max_new_tokens=100  

# 场景2：创意写作（需要多样性）  
do_sample=True  
temperature=0.8        # 控制随机程度（越高越随机）  
top_p=0.9             # 核采样参数  
max_new_tokens=500  
```

---

## 本节核心要点

1. **选择模型**：专有模型性能好但收费，开源模型免费但需要自己部署
2. **加载流程**：先加载分词器和模型，再用pipeline简化调用
3. **三大参数**：
    - `return_full_text`: 控制是否返回输入
    - `max_new_tokens`: 限制生成长度
    - `do_sample`: 控制随机性
4. **自回归特性**：
	- 模型逐词元生成，每次生成都会更新上下文
5. **模型类型**：
	- 基座模型做补全，指令模型回答问题

---

> 记住：**好的提示词 = 好的输出**。就像和人对话一样，说清楚你的需求，才能得到满意的答案！🚀
