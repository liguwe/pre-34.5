# LangChain 框架介绍

`#agi/langchain` `#2025/12/25`

> 快速理解 LangChain ，可查看[10. 以前端工程师的视角来理解 LangChain](/wgcppq)

LangChain 是一个用于**开发和部署基于 LLM 的应用程序的框架**

LangChain 不仅兼容 OpenAI，还支持其他`私有或开源`解决方案，并提供了更多扩展功能，包括组件、预构建链（或“构建模块”）以及智能体。

可以使用 `pip install langchain` 安装 LangChain，既快速又简单。

## 组成部分

![{%}|400](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/080.jpg)

**图 5-1：LangChain 模块**

### Models（模型）

即 LLM 提供商

### Prompts（提示词）

提示词正在成为 LLM 编程的新标准。该模块包括许多用于`提示词管理`的工具

### indexes（索引）

该模块允许你将 LLM 与`你的数据`结合

### Chains（链）

通过该模块，LangChain 提供了 Chain 接口，允许你创建一个`结合多个模型`或`提示词的调用序列`。

### Agents（智能体）

该模块引入了 Agent 接口。智能体是一个可以处理用户输入、做出决策并选择适当工具以完成任务的组件。它以迭代的方式工作，采取一系列行动，直到解决问题。

### Memory（记忆）

该模块允许在链或智能体调用之间`持久化`状态。默认情况下，链和智能体是`无状态`的，这意味着它们会独立处理每个请求，就像 LLM 一样，不会记住先前的交互

## LangChain 库

LangChain 库分为几个不同的包

- `langchain-core` 专注于提供核心功能，尽量减少对其他包的依赖。
- `langchain-community` 致力于第三方集成，促进与各种外部服务和平台的连接。
- `langchain` 专注于更高级的抽象和链，包含链、智能体、高级查询方法以及其他可泛化的编排组件，这些都是基本构建模块。
- `langchain-experimental` 包含可能尚不稳定的新功能，或者可能引入潜在的安全漏洞。它不应被用于你的生产级应用程序。

> 　要在 Python 中使用 LangChain，请通过 `pip install langchain langchain_community` 直接安装其社区版本。

## LangChain 基础示例：文本补全

```python hl:3
# ============================================
# LangChain 基础示例：文本补全
# 目标：询问 AI 一个需要推理的问题
# ============================================

# 1. 导入必要的模块
# ------------------------------------------
from langchain.chains import LLMChain  # 链式调用：串联提示词和模型
from langchain.prompts import PromptTemplate  # 提示词模板：类似前端的模板字符串
from langchain_openai import ChatOpenAI  # OpenAI 的 LLM 封装

# 2. 定义提示词模板（Prompt Template）
# ------------------------------------------
# 类比前端：const message = `问题：${question}，请逐步思考`
# {question} 是占位符，会在运行时被实际问题替换

template = """Question: {question} Let's think step by step.
Answer: """

# 创建提示词模板对象
# input_variables: 声明模板中有哪些变量（类似 TypeScript 的类型声明）
prompt = PromptTemplate(
    template=template,  # 模板内容
    input_variables=["question"],  # 声明变量：这个模板接收一个 question 参数
)

# 3. 初始化大语言模型（LLM）
# ------------------------------------------
# 类比前端：const api = axios.create({ baseURL: 'https://api.openai.com' })
# 这里创建一个 OpenAI 的客户端实例

llm = ChatOpenAI(
    model_name="gpt-3.5-turbo"  # 指定使用的模型版本
    # temperature=0.7,                    # 可选：控制回答的随机性（0-2，越高越随机）
    # max_tokens=500,                     # 可选：最大生成的 token 数
)

# 4. 创建 LLM 链（Chain）
# ------------------------------------------
# 类比前端：const pipeline = compose(prompt, callAPI, parseResult)
# Chain 把 "提示词模板" 和 "LLM" 串联起来，形成一个完整的处理流程

llm_chain = LLMChain(
    prompt=prompt,  # 第一步：使用我们定义的提示词模板
    llm=llm,  # 第二步：把填充好的提示词发送给 OpenAI
)

# 5. 定义问题并执行调用
# ------------------------------------------
# 这是一个需要多步推理的问题：
# - 2016 年奥运会在哪个国家举办？（巴西）
# - 巴西的首都是哪里？（巴西利亚）
# - 巴西利亚的人口是多少？

question = """What is the population of the capital of the country
where the Olympic Games were held in 2016?"""

# 执行调用
# 类比前端：await fetch('/api/chat', { body: { question } })
# invoke() 会：
#   1. 把 question 填入模板的 {question} 占位符
#   2. 将完整的提示词发送给 OpenAI
#   3. 返回 AI 的回答
result = llm_chain.invoke(question)

print(result)

# ============================================
# 数据流向图解（前端视角）
# ============================================
"""
用户输入（question）
    ↓
PromptTemplate.format()          ← 填充模板变量
    ↓
完整的提示词字符串
    ↓
ChatOpenAI.call()                ← 调用 OpenAI API
    ↓
AI 生成的回答
    ↓
返回给用户

类比前端：
Input → Template → API Call → Response → Display
"""

# ============================================
# 输出结果示例
# ============================================
"""
{
    'text': '
        Step 1: 确定2016年奥运会举办的国家
        答案：2016年奥运会在巴西举办

        Step 2: 确定巴西的首都
        答案：巴西的首都是巴西利亚（Brasília）

        Step 3: 查询巴西利亚的人口
        答案：截至2021年，巴西利亚的人口约为310万

        因此，2016年奥运会举办国的首都人口约为310万。
    '
}
"""

```

没有详细注释的代码：
```python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

template = """Question: {question} Let's think step by step.
Answer: """

prompt = PromptTemplate(template=template, input_variables=["question"])

llm = ChatOpenAI(model_name="gpt-3.5-turbo")
llm_chain = LLMChain(prompt=prompt, llm=llm)

question = """ What is the population of the capital of the country
where the Olympic Games were held in 2016? """
llm_chain.invoke(question)
```

当执行 `invoke` 时， `LLMChain` 会

(1) 格式化提示模板（ `PromptTemplate` ），将输入的键 - 值（以及可能的记忆键 - 值）填充到模板中；  
(2) 将格式化后的字符串传递给 LLM 进行推理；  
(3) 返回 LLM 生成的输出。

最终，模型会自动按照“`Let's think step by step`”的规则回答问题，实现逐步推理的效果。

## 智能体和工具

- **智能体** 就是一个能够与环境互动的软件。
	- 在 LLM 的语境下，智能体是通过使用具有`特定提示词的 LLM 创建`的，我们赋予它一个目标，并要求它通过`采取行动和执行步骤`来实现目标。
- **工具** 是一种针对某函数的特定抽象，使语言模型更容易与之互动。
	- 智能体可以使用工具与世界互动。
	- 具体来说，工具的接口有一个`文本输入`和一个`文本输出`。
	- LangChain 中有许多预定义的工具，包括
		- 谷歌搜索
		- 维基百科搜索
		- Python REPL
		- 计算器
		- 世界天气预报 API 等

在接下来的步骤中，我们将使用具有 `ReAct` 逻辑实现的智能体。你将看到，ReAct 的原理是将推理与观察和行动相结合，如图 5-2 所示。

![{%}|584](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/081.jpg)

**图 5-2：ReAct 智能体的原理**

比如前面 “`Let's think step by step`”，在某种意义上，你可以提高模型的推理能力。将这句话添加到提示词中，会使模型花更多时间来回答问题。

我们介绍一种智能体，它适用于需要执行`一系列中间步骤`的应用程序。该智能体调度这些步骤，并可以访问各种工具，决定使用哪些工具来有效地回答用户的查询。在某种程度上，就像“Let's think step by step”一样，智能体将有更多时间来`规划其行动`，从而能够完成更复杂的任务。

智能体的`高级伪代码`如下：
- (1) 接收用户输入；
- (2) 决定`是否使用工具`，确定输入该工具的文本内容；
- (3) 调用工具，使用输入文本执行操作，并接收工具返回的`输出文本`；
- (4) 将工具的`输出反馈`到智能体的`上下文中`，用于后续推理；
- (5) 重复步骤 (2) 到 (4)，**直到智能体决定不再使用工具**，此时它直接向用户提供最终响应。

![{%}|512](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/082.jpg)

**图 5-3：LangChain 中智能体与工具的交互**

### 示例：2023 年橄榄球世界杯冠军国家人口的平方根是多少？

```python hl:24,33,42,
# ============================================
# LangChain Agent 示例：智能工具调用
# 问题：2023年橄榄球世界杯冠军国家人口的平方根是多少？
#
# 挑战：
# 1. GPT-3.5 的训练数据没有 2023 年的信息
# 2. LLM 不擅长精确的数学计算
#
# 解决方案：让 Agent 自主决定使用工具
# ============================================

from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent, load_tools
from langchain_openai import ChatOpenAI

# 1. 初始化 LLM
# ------------------------------------------
llm = ChatOpenAI(model_name="gpt-3.5-turbo")

# 2. 加载工具集
# ------------------------------------------
# wikipedia: 搜索维基百科获取最新信息
# llm-math: 数学计算器，用于精确计算
# 注意：需要先安装 wikipedia 包：pip install wikipedia

tools = load_tools(
    ["wikipedia", "llm-math"],  # 工具列表
    llm=llm,  # 某些工具需要 LLM 支持
)

# 3. 创建 ReAct Agent
# ------------------------------------------
# ReAct = Reasoning + Acting（推理 + 行动）
# Agent 会自主决定：
#   - 需要调用哪个工具
#   - 调用的顺序
#   - 何时停止并给出最终答案

agent = create_react_agent(
    tools=tools,  # 可用的工具集
    llm=llm,  # 用于推理的 LLM
     # 从 LangChain Hub 拉取预设的提示词模板
    prompt=hub.pull("hwchase17/react"), 
)

# 4. 创建 Agent 执行器
# ------------------------------------------
# AgentExecutor 负责：
#   - 循环调用 Agent 直到得出最终答案
#   - 处理工具调用
#   - 管理执行流程

agent_executor = AgentExecutor(
    agent=agent,  # Agent 实例
    tools=tools,  # 工具集（必须与 Agent 的工具一致）
    verbose=True,  # 打印详细的推理过程
)

# 5. 提出问题并执行
# ------------------------------------------
question = """What is the square root of the population of the
country that won the 2023 Rugby World Cup?
"""

# 执行推理
# Agent 会自动拆解问题并调用合适的工具
result = agent_executor.invoke({"input": question})

print(result)

# ============================================
# Agent 推理流程（实际输出）
# ============================================
"""
> Entering new AgentExecutor chain...

【第1步：搜索冠军国家】
Thought: 我需要先知道谁赢得了2023年橄榄球世界杯
Action: wikipedia
Action Input: 2023 Rugby World Cup
Observation: [维基百科返回：南非赢得了2023年橄榄球世界杯]

【第2步：查询人口】
Thought: 现在知道是南非，需要查询南非的人口
Action: wikipedia
Action Input: South Africa population
Observation: [维基百科返回：南非人口约6200万]

【第3步：计算平方根】
Thought: 现在可以计算人口的平方根
Action: Calculator
Action Input: √62,000,000
Observation: 7874.007874011811

【第4步：得出结论】
Thought: 我已经知道最终答案了
Final Answer: 7874.01

> Finished chain.
"""



```

>  ① 上面我们使用来自 LangChain Hub 的提示词  
>  ② 要运行维基百科搜索工具，必须安装相应的 Python 包 wikipedia。可以通过 `pip install wikipedia` 来安装。

### 核心概念

```python
# ============================================
# 核心概念
# ============================================
"""
1. Tools（工具）
   - 扩展 LLM 的能力
   - 可以是搜索引擎、计算器、数据库、API等

2. Agent（智能体）
   - 能够自主推理的系统
   - 根据问题决定调用哪些工具
   - 类似一个"会使用工具的AI助手"

3. ReAct 模式
   - Thought（思考）：分析当前需要做什么
   - Action（行动）：选择工具并执行
   - Observation（观察）：查看工具返回的结果
   - 循环以上步骤，直到得出 Final Answer

4. verbose=True
   - 输出完整的推理过程
   - 方便调试和理解 Agent 的决策逻辑
"""
```

正如你所见，智能体展示了复杂的推理能力：它在得出最终答案之前`完成`了`三个不同的步骤`。LangChain 框架允许开发者`仅用几行代码`实现这样的推理能力。

- **GPT-4 比 GPT-3.5 更适合复杂推理** 原因是小模型容易：
	- 陷入推理死循环
	- 输出格式不符合要求
	- 无法正确选择工具
- **Agent 的智能之处**
    - 不需要你告诉它"先搜索、再计算"
    - 它会**自己推理**出需要的步骤
    - 自动选择合适的工具
- **ReAct 推理循环**： 思考 → 行动 → 观察结果 → 继续思考...

## 记忆：让大模型有记忆功能

```python hl:17
# ============================================
# LangChain Memory 示例：给 LLM 添加记忆功能
# 目标：将只能单轮补全的模型转换为多轮对话聊天机器人
# 原理：通过在提示词中保留对话历史来实现"记忆"
# ============================================
from langchain.chains import ConversationChain
from langchain_community.llms import OpenAI

# 1. 初始化基础 LLM
# ------------------------------------------
# gpt-3.5-turbo-instruct 是一个补全模型（非聊天模型）
# 它只能做单轮的文本补全，无法自己记住上下文
chatbot_llm = OpenAI(model_name="gpt-3.5-turbo-instruct")

# 2. 创建对话链
# ------------------------------------------
# ConversationChain 会：
#   - 自动管理对话历史
#   - 在每次调用时将历史记录添加到提示词中
#   - 让补全模型"看起来"具备记忆能力

chatbot = ConversationChain(
    llm=chatbot_llm,  # 使用的基础模型
    verbose=True,  # 打印完整的提示词和处理过程
)

# 3. 第一轮对话
# ------------------------------------------
# 用户说"Hello"

response1 = chatbot.invoke(input="Hello")

"""
实际发送给 LLM 的提示词：
┌─────────────────────────────────────────────────────────────┐
│ 以下是人类与 AI 之间的友好对话。AI 善于交谈，并会从上下文   │
│ 中提供大量具体细节。如果 AI 不知道问题的答案，它会如实说    │
│ 不知道。                                                     │
│                                                             │
│ 当前对话：                                                   │
│ 人类：你好                                                   │
│ AI：                                                        │
└─────────────────────────────────────────────────────────────┘

LLM 回复：" Hello! How can I help you?"
"""

# 4. 第二轮对话
# ------------------------------------------
# 继续提问，测试记忆功能

response2 = chatbot.invoke(input="Can I ask you a question? Are you an AI?")

"""
实际发送给 LLM 的提示词：
┌─────────────────────────────────────────────────────────────┐
│ The following is a friendly conversation between a human    │
│ and an AI. [...]                                            │
│                                                             │
│ Current conversation:                                       │
│ Human: Hello                                                │
│ AI:  Hello! How can I help you?          ← 上一轮的对话记录 │
│ Human: Can I ask you a question? Are you an AI?             │
│ AI:                                                         │
└─────────────────────────────────────────────────────────────┘

LLM 回复："\n\nYes, I am an AI."
"""

# 5. 继续对话
# ------------------------------------------
# 每次调用都会累积对话历史

response3 = chatbot.invoke(input="What was my first message to you?")

"""
这时提示词会包含所有历史对话：
Current conversation:
Human: Hello
AI:  Hello! How can I help you?
Human: Can I ask you a question? Are you an AI?
AI: Yes, I am an AI.
Human: What was my first message to you?     ← 新问题
AI:

LLM 能够回答："Your first message was 'Hello'."
因为对话历史都在提示词里
"""

```

### 工作原理： ConversationChain

```python hl:20
# ============================================
# 工作原理
# ============================================
"""
ConversationChain 的核心机制：

1. 内置提示词模板
   - 告诉 LLM 这是一段对话
   - 提供对话的系统指令

2. 自动记忆管理
   - 每次对话后保存 Human 和 AI 的消息
   - 下次调用时将历史记录插入提示词

3. 透明封装
   - 用户只需调用 invoke()
   - 底层自动处理提示词拼接

伪代码：
prompt = system_instruction + conversation_history + new_input
response = llm.complete(prompt)
conversation_history.append((new_input, response))
"""

```

### 记忆的本质：局限性与优势

- LLM 本身是**无状态**的，没有记忆
- "记忆"是通过在提示词中**插入历史对话**实现的
	- 比如看上面的`伪代码`
- 就像给 LLM 看一本包含完整对话的书

```python hl:11,26
# ============================================
# 记忆的本质
# ============================================
"""
LLM 本身没有记忆！

"记忆"是通过提示词工程实现的：
- 每次都把历史对话塞进提示词
- LLM 只是在处理一个很长的文本

局限性：
1. 上下文长度限制（token 限制）
2. 成本随对话轮数增加（每次都发送全部历史）
3. 不如专门的聊天模型（如 gpt-3.5-turbo）效果好

优势：
- 可以让任何补全模型具备"聊天"能力
- 开发者可以自定义记忆策略
"""


```

### 查看对话历史 + 自定义记忆策略（比如最保留最近 k 次对话）

```python hl:23,28
# ============================================
# 查看对话历史
# ============================================
# 可以手动访问保存的记忆

print(chatbot.memory.buffer)
# 输出：完整的对话历史字符串

# ============================================
# 自定义记忆策略
# ============================================
"""
LangChain 提供多种记忆类型：
1. ConversationBufferMemory
   - 保存完整对话历史（默认）
1. ConversationBufferWindowMemory
   - 只保留最近 k 轮对话
1. ConversationSummaryMemory
   - 用 LLM 总结历史对话，节省 token
1. ConversationTokenBufferMemory
   - 基于 token 数量限制记忆长度

示例：只保留最近 3 轮对话
from langchain.memory import ConversationBufferWindowMemory

chatbot = ConversationChain(
    llm=chatbot_llm,
    memory=ConversationBufferWindowMemory(k=3),
    verbose=True
)
"""
```

## 嵌入

`嵌入`是一种信息检索技术，它将非数值概念（如单词、词元、句子）转换为数值向量，使模型能够高效处理这些概念之间的关系。

一句话： 他让 LLM 能够访问外部知识

`RAG` 是一种强大的方法，可以将 LLM 与`自有文本数据`结合，从而个性化模型的知识，使其在应用程序中更符合特定需求
- **信息检索** ：接收用户查询，返回最相关的文档。
- **增强生成** ：将检索到的文档`作为模型的输入上下文`，然后让模型基于这些信息回答用户的问题。

`LangChain` 中一个重要的模块是 `document_loaders` 。通过这个模块，你可以快速将`不同来源的文本数据`加载到你的应用程序中。例如，可以加载 CSV 文件、电子邮件、PowerPoint 文档、Evernote 笔记、Facebook 聊天记录、HTML 页面、PDF 文档及许多其他格式的数据。

嵌入（Embedding）的作用
- 将文本转换为数值向量
- 相似的文本 → 相似的向量
- 支持`语义搜索`（理解含义，不只是关键词匹配）

完整数据流：两个阶段，准备阶段 → 查询阶段

```python
# 准备阶段（只做一次）
PDF → 分页 → 生成嵌入 → 存入向量库

# 查询阶段（每次提问）
问题 → 检索相关页面 → 构建增强提示 → LLM 回答
```

以 `PDF 文档` 文档为例：

> 文档 → 切分 → 向量化 → 存储 → 检索 → 增强提示 → 生成答案

### 第一步：加载 PDF 文档 → 文档及切分

```python hl:11,26,7
# ============================================
# LangChain RAG 示例：基于文档的智能问答
#
# 场景：从 PDF 文档中检索信息并回答问题
# 核心技术：RAG（Retrieval-Augmented Generation，检索增强生成）
#
# 流程：加载文档 → 生成嵌入 → 存储到向量库 → 检索 → 回答
# ============================================

# ============================================
# 第一步：加载文档
# ============================================
from langchain_community.document_loaders.pdf import PyPDFLoader

# 创建 PDF 加载器
# 注意：需要先安装依赖 pip install pypdf
loader = PyPDFLoader("ExplorersGuide.pdf")

# 加载并分割文档
# load_and_split() 会：
#   1. 读取 PDF 的每一页
#   2. 将每页作为独立的 Document 对象
#   3. 返回 Document 列表
pages = loader.load_and_split()

# 每个 Document 包含：
# - page_content: 页面文本内容
# - metadata: 元数据（来源文件、页码等）
```

>  PDF 加载器，通过 `pip install pypdf` 来安装。

### 第二步：向量化 → 生成嵌入向量：即将`文本`转成`数量向量`

```python
# ============================================
# 第二步：生成嵌入向量
# ============================================
from langchain_community.embeddings.openai import OpenAIEmbeddings

# 初始化嵌入模型
# 嵌入（Embedding）：将文本转换为数值向量
# 作用：相似的文本会有相似的向量表示
embeddings = OpenAIEmbeddings()

# 示例：
# "猫" → [0.2, 0.8, 0.1, ...]
# "狗" → [0.3, 0.7, 0.2, ...]  ← 向量相近
# "汽车" → [0.9, 0.1, 0.8, ...]  ← 向量较远

```

### 第三步：向量化 → 创建向量数据库索引

>  `Faiss` 的定位：  
>     ✅ 适合：本地实验、快速原型  
>      ❌ 不适合：生产环境（数据只在内存中）

```python hl:4,13
from langchain_community.vectorstores.faiss import FAISS

# 将文档页面转换为嵌入并存储到 Faiss 索引中
# Faiss：Meta 开发的高效相似性搜索库
# 注意：需要先安装 pip install faiss-cpu

db = FAISS.from_documents(
    pages,  # 文档列表
    embeddings,  # 嵌入模型
)

# 这一步做了什么：
# 1. 对每个页面的文本调用 embeddings.embed_documents()
# 2. 生成每个页面的向量表示
# 3. 将向量存储到 Faiss 索引中，支持快速检索

"""
可视化：
PDF 文档 → 分页 → 每页生成向量 → 存入向量数据库
Page 1: "Link's outfit..." → [0.1, 0.3, ...]  ┐
Page 2: "Hyrule kingdom..." → [0.5, 0.2, ...]  ├ →  Faiss 索引
Page 3: "Master sword..." → [0.2, 0.9, ...]   ┘
"""

```

### 第四步：相似性搜索

```python hl:5,11,15
# 定义查询问题
q = "What is Link's traditional outfit color?"

# 执行相似性搜索
# 原理：
#   1. 将问题转换为向量
#   2. 在向量数据库中找到最相似的页面
#   3. 返回最相关的文档
results = db.similarity_search(q)

# 查看第一个结果
print(results[0])

"""
输出：
Document(
    page_content="While Link's traditional green tunic is certainly
                  an iconic look, his wardrobe has expanded [...]
                  Dress for Success",
    metadata={"source": "ExplorersGuide.pdf", "page": 35}
)

注意：Python 索引从 0 开始
- metadata 中 page=35 表示索引
- 实际 PDF 文件中是第 36 页
"""

```

### 第五步：检索增强问答（RAG）

```python hl:17
# ============================================
# 第五步：检索增强问答（RAG）
# ============================================
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain_community.llms.openai import OpenAI

# 初始化 LLM
llm = OpenAI()

# 创建 RetrievalQA 链
# 它会：
#   1. 使用检索器找到相关文档
#   2. 将文档内容添加到提示词中
#   3. 让 LLM 基于检索到的信息回答问题
chain = RetrievalQA.from_llm(
    llm=llm,  # 用于生成答案的 LLM
    retriever=db.as_retriever(),  # 将向量数据库转换为检索器
)

# 提问
q = "What is Link's traditional outfit color?"
answer = chain(q, return_only_outputs=True)

print(answer)
# 输出：{"result": "Link's traditional outfit color is green."}
```

### RAG 工作流程详解

```python hl:15,17,20
# ============================================
# RAG 工作流程详解
# ============================================
"""
用户提问：What is Link's traditional outfit color?
    ↓
【检索阶段】
1. 问题转换为向量
2. 在向量数据库中搜索最相似的页面
3. 找到相关内容："Link's traditional green tunic..."
    ↓
【生成阶段】
4. 构建增强提示词：
   ┌──────────────────────────────────────────┐
   │ 基于以下上下文回答问题：                  │
   │                                          │
   │ 上下文：                                  │
   │ While Link's traditional green tunic...  │
   │                                          │
   │ 问题：What is Link's traditional outfit  │
   │       color?                             │
   └──────────────────────────────────────────┘
5. 发送给 LLM 生成答案
    ↓
最终答案：Link's traditional outfit color is green.
"""
```

### 为什么需要检索？

```python hl:11,15
# ============================================
# 为什么需要检索？
# ============================================
"""
问题：为什么不直接把整个文档发给 LLM？

原因：
1. 上下文长度限制
   - GPT-3.5: 最多 4k-16k tokens
   - GPT-4: 最多 8k-128k tokens
   - 大型 PDF 可能有几十万 tokens

2. 成本考虑
   - 输入 token 越多，成本越高
   - 检索只发送相关部分，节省成本

3. 性能优化
   - 更小的上下文让 LLM 更专注
   - 减少无关信息的干扰

未来趋势：
- 随着上下文窗口扩大（如 Gemini 1.5 支持 1M tokens）
- 某些场景可能不再需要检索
- 但目前 RAG 仍是最佳实践
"""
```

#### 附：各大模型上下文窗口对比表 (2025年12月)

| **模型名称**               | **上下文窗口上限 (Tokens)**  | **约合字数/内容量**     |
| ---------------------- | --------------------- | ---------------- |
| **Gemini 3 Pro**       | **2,000,000**         | ~150万字 / 10+小时视频 |
| **GPT-5 / GPT-4.1**    | **1,000,000**         | ~75万字 / 超大型代码库   |
| **Llama 4 Behemoth**   | **1,000,000**         | ~75万字 / 海量技术文档   |
| **Claude 4.5 Sonnet**  | **500,000**           | ~38万字 / 10余本中篇小说 |
| **DeepSeek R1 / V3.1** | **128,000 - 164,000** | ~10万字 / 深度调研报告   |

### 其他文档加载器示例：比如 csv 、word 、网页、本地文件

```python hl:7,11,15,19,23
# ============================================
# 其他文档加载器示例
# ============================================
"""
LangChain 支持多种数据源：

# CSV 文件
from langchain_community.document_loaders import CSVLoader
loader = CSVLoader("data.csv")

# Word 文档
from langchain_community.document_loaders import Docx2txtLoader
loader = Docx2txtLoader("document.docx")

# 网页
from langchain_community.document_loaders import WebBaseLoader
loader = WebBaseLoader("https://example.com")

# 本地文本文件
from langchain_community.document_loaders import TextLoader
loader = TextLoader("notes.txt")

完整列表见官方文档：
https://python.langchain.com/docs/integrations/document_loaders
"""
```

### 向量数据库选择

```python hl:7
# ============================================
# 向量数据库选择
# ============================================
"""
Faiss：
- 优点：轻量、快速、适合实验
- 缺点：仅内存存储，不适合生产环境

生产环境推荐：
- Pinecone: 云原生向量数据库
- Weaviate: 开源向量搜索引擎
- Chroma: 轻量级嵌入数据库
- Milvus: 高性能向量数据库
- PostgreSQL + pgvector: 传统数据库扩展

选择标准：
- 数据规模
- 查询性能要求
- 部署环境（云 vs 本地）
- 预算
"""
```

> 　Faiss 是一个非常适合用来进行语义搜索试验的工具，但不适合生产用途。正如第 3 章中提到的，从原生的向量存储到具有附加向量功能的数据库，替代方案很多，其中 DB-Engines 是个不错的选择。

图 5-4 直观地总结了 PDF 文档的内容是如何转换为嵌入页面并存储在 `Faiss 索引`中的。

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/083.jpg)

**图 5-4：创建和保存来自 PDF 文档的嵌入**

现在，我们很容易搜索相似内容：

```python
q = "What is Link's traditional outfit color?"
db.similarity_search(q)[0]
```

从上面的代码中，我们得到以下内容：

```
Document(page_content="While Link's traditional green
              tunic is certainly an iconic look, his
              wardrobe has expanded [...] Dress for Success",
          metadata={"source": "ExplorersGuide.pdf", "page": 35})
```

这个问题的答案是`林克的标志性服装颜色是绿色`，并且可以看到该答案存在于选定的内容中。输出结果显示答案位于 ExplorersGuide.pdf 的第 35 页。需要注意，Python 的索引从 0 开始，因此如果返回《〈塞尔达传说：旷野之息〉探索者指南》的原始 PDF 文件，实际答案应在第 36 页（而非第 35 页）。

图 5-5 显示了信息检索过程如何使用查询的嵌入和`向量数据库`来识别与`查询最相似的页面`。

![{%}|528](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/084.jpg)

**图 5-5：信息检索过程寻找与查询最相似的页面**

你可能想将你的嵌入集成到聊天机器人中，以便它在回答你的问题时使用它所检索到的信息。同样，使用 LangChain，这只需要简单的几行代码。我们使用 `RetrievalQA` ，它接收一个 LLM 和一个向量数据库作为输入。然后，我们以通常的方式向得到的对象提问：

```
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain_community.llms.openai import OpenAI
llm = OpenAI()
chain = RetrievalQA.from_llm(llm=llm, retriever=db.as_retriever())
q = "What is Link's traditional outfit color?"
chain(q, return_only_outputs=True)
```

我们得到以下回答：

```json
{"result": "Link's traditional outfit color is green."}
```

图 5-6 展示了 `RetrievalQA` 如何利用`信息检索`来回答用户的问题。从图中可以看到，“提供上下文”负责将信息检索系统找到的相关页面与用户的初始查询结合在一起，形成一个增强上下文（enriched context）。然后，这个增强上下文被传递给语言模型，使其能够利用新增的信息更准确地回答用户的问题。

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/085.jpg)

**图 5-6：为了回答用户的问题，检索到的信息被添加到 LLM 的上下文中**

> 　LangChain 团队还创建了 LangSmith，这是一个用于开发、协作、测试、部署和监控 LLM 应用程序的平台。无须依赖 LangChain，我们可以单独使用 LangSmith。
