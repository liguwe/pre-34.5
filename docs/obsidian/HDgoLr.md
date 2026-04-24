# 使用 Phi-3 模型生成第一段文本

`#2025/12/27` `#ai` 

> 但你知道如何在自己的电脑上运行一个开源的 `LLM` 吗？本文将手把手教你使用 Phi-3 模型生成你的第一段 AI 文本。

## 为什么选择 `Phi-3` ？

- 小而强：只有 38 亿参数，但性能相当不错
- 硬件友好：可以在显存小于 8GB 的设备上运行（如果量化，甚至小于 6GB）
- 开源免费：采用 MIT 许可证，可以随意用于商业用途

>  体积小但性能够用，非常适合个人学习和开发。

## 准备工作：Hugging Face 平台

在下载模型之前，你需要了解 Hugging Face：
- 这是一个开源 AI 模型的"应用商店"，拥有超过 80 万个模型
- 你可以在这里找到几乎所有开源的 LLM、计算机视觉模型、音频处理模型等
- Hugging Face 还提供了 `Transformers` 这个强大的 Python 库，让加载模型变得非常简单

## 核心架构：模型生成的“双子星”

在代码加载时，你会发现我们加载了两个东西。这对于初学者来说是第一个“坑”：
1. 分词器（Tokenizer）： 
	- 预处理器。 
		- 模型看不懂汉字或英文，它只能看懂数字。
		- Tokenizer 的作用就是把字符串 `Hello` 转换成 ID 数组 `[15496]`。
2. 模型本身（Model）： 
	- 核心算力。
		-  负责接收 `ID 数组`，进行复杂的数学计算（还记得我们聊过的向量吗？），然后预测下一个最可能的数字。

## 动手实践：三步生成文本

### 第一步：加载模型和分词器

使用 LLM 时，你需要加载两个组件：
1. 生成模型本身：负责生成文本
2. 分词器（Tokenizer）：负责将文本切分成模型能理解的"词元"

```python
from transformers import AutoModelForCausalLM, AutoTokenizer  

# 加载模型和分词器  
# 加载模型：注意 device_map="cuda" 意味着我们把模型丢进 NVIDIA 显卡里
model = AutoModelForCausalLM.from_pretrained(  
    "microsoft/Phi-3-mini-4k-instruct",  
    device_map="cuda",  # 使用 GPU，如果没有可以改为 "cpu"  
    torch_dtype="auto",  
    trust_remote_code=True,  
)  
tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-4k-instruct")  
```

> 小贴士：第一次运行时会自动下载模型文件（约几个 GB），需要等待几分钟。

### 第二步：创建文本生成流水线

Hugging Face 提供了一个超级方便的工具——`pipeline`，它把模型、分词器和生成过程打包成一个函数，用起来非常简单：

>  `pipeline` 是最友好的 API。它把加载、输入转换、生成、输出解码全部封装在了一起。

```python
from transformers import pipeline  

# 创建流水线  
generator = pipeline(  
    "text-generation",  
    model=model,  
    tokenizer=tokenizer,  
    return_full_text=False,  # 只返回生成的内容，不包含提示词 即只拿答案，不要复读我的问题
    max_new_tokens=500,      # 最多生成 500 个词元，限制生成长度，防止模型“废话”停不下来
    do_sample=False          # 不使用随机采样，保证结果稳定，贪婪搜索：永远选概率最高的那个词，保证输出稳定 
)  
```

参数说明：

- `return_full_text=False`：只输出 AI 生成的内容，不重复你输入的提示词
- `max_new_tokens=500`：限制生成长度，避免模型"停不下来"
- `do_sample=False`：每次都选择概率最高的词，保证输出稳定（设为 `True` 可以增加创造性）

### 第三步：生成你的第一段文本

现在，让我们让 AI 讲一个关于鸡的笑话：

```python
# 提示词（用户输入）  
# 定义对话结构：LLM 习惯用这种“角色/内容”的字典列表
messages = [  
    {"role": "user", "content": "Create a funny joke about chickens."}  
]  

# 生成输出  
output = generator(messages)  
print(output[0]["generated_text"])  
```

输出结果：

```
Why don't chickens like to go to the gym?   
Because they can't crack the egg-sistence of it!  
```

>  （翻译：为什么鸡不喜欢去健身房？因为它们无法突破“蛋”生（存在）的真谛！）

恭喜！你已经成功使用 Phi-3 生成了第一段 AI 文本！

## 理解背后的原理

### 分词器的作用

分词器就像一个"翻译官"，它负责：

1. 把你输入的文本（比如 "Hello world"）切分成模型能理解的"词元"
2. 将这些词元转换成数字 ID
3. 把这些 ID 喂给模型

### 提示词模板

注意到 `messages` 的格式了吗？这是一个对话模板：

- `role: "user"` 表示这是用户说的话
- `content` 是具体的内容

Phi-3 在训练时使用了特殊的对话格式，底层会自动转换成类似这样的模板：

```
<s><|user|>  
Create a funny joke about chickens.<|end|>  
<|assistant|>  
```

这些特殊标记帮助模型区分"谁在说话"。

## 硬件要求

要在本地运行 Phi-3，建议的最低配置是：
- GPU 显存：至少 8GB（如 NVIDIA T4）
- 内存：16GB 以上
- 存储空间：约 10GB（用于存储模型文件）

如果你的电脑配置不够，可以使用 Google Colab 提供的免费 GPU 环境。

## 下一步学习

现在你已经掌握了基础用法，可以尝试：

1. 修改提示词，让模型做其他任务（翻译、写代码、总结文本等）
2. 调整 `temperature` 和 `top_p` 参数，探索更有创意的输出
3. 尝试其他开源模型（如 Llama 3、Mistral 等）

## 总结

通过本文，你学会了：

- ✅ 使用 Hugging Face 下载和加载开源 LLM
- ✅ 理解模型和分词器的作用
- ✅ 使用 `pipeline` 简化文本生成流程
- ✅ 成功运行 `Phi-3` 并生成你的第一段 AI 文本

大语言模型的世界远不止于此，这只是一个开始。随着你对模型原理的深入理解，你将能够构建更复杂、更强大的 AI 应用。
