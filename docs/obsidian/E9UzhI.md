# 构建LLM的对话回溯能力

`#2025/12/31` `#ai` 

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/161.jpg)

LLM默认是"健忘"的！

---

## 一、为什么LLM会"失忆"？

### 问题演示

```python
# 第一次对话：告诉模型我的名字  
basic_chain.invoke({"input_prompt": "Hi! My name is Maarten. What is 1 + 1?"})  
# 输出：Hello Maarten! The answer to 1 + 1 is 2.  

# 第二次对话：问模型我叫什么  
basic_chain.invoke({"input_prompt": "What is my name?"})  
# 输出：I'm sorry, but I don't have the ability to know personal information...  
```

**模型竟然忘了！**

### 原因：无状态设计

**LLM本质上是"`无状态`"的**——它们不会主动记住任何先前的对话！

```
第一次调用 LLM：  
输入："我叫张三"  
输出："你好张三"  
[调用结束，一切清空]  

第二次调用 LLM：  
输入："我叫什么？"  
LLM："？？？"（完全不记得第一次的对话）  
```

---

### 对比：有记忆 vs 无记忆

|场景|无记忆LLM|有记忆LLM|
|---|---|---|
|用户："我叫张三，1+1等于几？"|"你好张三！1+1=2"|"你好张三！1+1=2"|
|用户："我叫什么名字？"|"我无法获取个人信息"|"你叫张三"|

**显然，没有记忆的对话体验很糟糕！**

---

## 二、解决方案：三种记忆机制

文档介绍了三种让LLM"记住"对话的方法：

|记忆类型|核心思路|优点|缺点|
|---|---|---|---|
|**对话缓冲区**|保存完整对话历史|信息完整|占用大量词元|
|**窗口式缓冲区**|只保留最近k轮对话|节省词元|丢失早期信息|
|**对话摘要**|用LLM总结对话|大幅节省词元|需要额外调用LLM|

---

## 三、方法1：对话缓冲区（最简单）

### 核心思路

**把所有历史对话塞进提示词里**，如图7-10所示：

```
提示词模板：  
<s><|user|>  
对话历史：  
Human: 我叫张三，1+1等于几？  
AI: 你好张三！1+1=2。  

现在的问题：我叫什么名字？  
<|end|>  
<|assistant|>  
```

---

### 实战代码：步骤1 - 创建支持历史的模板

```python
from langchain import PromptTemplate  

# 注意：这里有两个变量！  
template = """<s><|user|>Current conversation:{chat_history}  
{input_prompt}<|end|>  
<|assistant|>"""  

prompt = PromptTemplate(  
    template=template,  
    input_variables=["input_prompt", "chat_history"]  # 两个变量  
)  
```

**关键**：

- `input_prompt`：
	- 用户当前的问题
- `chat_history`：
	- 历史对话记录

---

### 步骤2 - 创建`记忆`模块

```python
from langchain.memory import ConversationBufferMemory  

# 定义记忆类型  
memory = ConversationBufferMemory(memory_key="chat_history")  
```

---

### 步骤3 - 组装完整的链

```python
from langchain import LLMChain  

llm_chain = LLMChain(  
    prompt=prompt,  
    llm=llm,  
    memory=memory  # 加上记忆！  
)  
```

---

### 步骤4 - 测试记忆功能

```python hl:7
# 第一轮对话  
llm_chain.invoke({"input_prompt": "Hi! My name is Maarten. What is 1 + 1?"})  

# 输出：  
# {  
#   'input_prompt': 'Hi! My name is Maarten. What is 1 + 1?',  
#   'chat_history': '',  # 首次对话，历史为空  
#   'text': "Hello Maarten! The answer to 1 + 1 is 2."  
# }  
```

---

```python hl:7
# 第二轮对话  
llm_chain.invoke({"input_prompt": "What is my name?"})  

# 输出：  
# {  
#   'input_prompt': 'What is my name?',  
#   'chat_history': "Human: Hi! My name is Maarten. What is 1 + 1?\nAI: Hello Maarten! The answer to 1 + 1 is 2.",  
#   'text': 'Your name is Maarten.'  # 记住了！  
# }  
```

**成功！** 模型现在能记住之前的对话了！

---

### 工作原理图解

如图所示：

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/162.jpg)

**图 ：通过注入完整的`对话历史`实现 LLM 的记忆唤醒**

```
用户问题："我叫什么？"  
    ↓  
自动添加对话历史：  
Human: 我叫Maarten. 1+1等于几？  
AI: 你好Maarten！1+1=2。  
    ↓  
完整提示词传给LLM  
    ↓  
LLM："你叫Maarten"  
```


### 优缺点总结

✅ **优点**：
- 实现最简单
- 完整保留所有对话信息
❌ **缺点**：
- 对话越长，词元消耗越大
- 可能超出模型的上下文限制
- 生成速度随对话增长而下降

---

## 四、方法2：窗口式对话缓冲区（节省词元）

### 问题场景

对话进行了100轮，如果全部保存：
- 提示词会变得超级长
- 可能超出模型的词元限制（如2048）
- 处理速度变慢

---

### 解决方案：只保留`最近k轮`

```python hl:5
from langchain.memory import ConversationBufferWindowMemory  

# 只保留最近2轮对话  
memory = ConversationBufferWindowMemory(  
    k=2,  # 关键参数！  
    memory_key="chat_history"  
)  

llm_chain = LLMChain(  
    prompt=prompt,  
    llm=llm,  
    memory=memory  
)  
```

---

### 测试"遗忘"功能

```python
# 第1轮：告诉模型名字和年龄  
llm_chain.predict(input_prompt="Hi! My name is Maarten and I am 33 years old. What is 1 + 1?")  

# 第2轮：问个数学题  
llm_chain.predict(input_prompt="What is 3 + 3?")  

# 第3轮：问名字（还记得，因为在窗口内）  
llm_chain.predict(input_prompt="What is my name?")  
# 输出：'Your name is Maarten.'  

# 第4轮：问年龄（已经忘了，因为超出窗口k=2）  
llm_chain.invoke({"input_prompt": "What is my age?"})  
# 输出："I'm unable to determine your age..."  
```

---

### 工作原理

```
对话历史（完整）：  
1. 我叫Maarten，33岁，1+1=?  
2. 3+3=?  
3. 我叫什么？  
4. 我多大？← 当前问题  

窗口k=2，只保留：  
2. 3+3=?  
3. 我叫什么？  

所以年龄信息丢失了！  
```

---

### 优缺点

✅ **优点**：
- 不需要长上下文LLM
- 完整保存最近k轮交互
- 控制词元消耗
❌ **缺点**：
- 只能捕捉最近`k次`交互
- 早期重要信息会丢失
- 不提供内容压缩功能

---

## 五、方法3：对话摘要（最强大）

### 问题分析

- **缓冲区**：保存完整对话，但词元爆炸
- **窗口式**：节省词元，但丢失信息

**能否兼得？** → 用摘要！

---

### 核心思路

**不保存原始对话，而是保存摘要**：

```hl:7
原始对话（100个词元）：  
Human: 我叫张三，今年25岁，住在北京，喜欢编程...  
AI: 你好张三！很高兴认识你...  

↓ 摘要后（20个词元）  

摘要：  
用户张三介绍了自己的基本信息（25岁，北京，程序员）  
```

---

### 工作流程图解

如图7-12所示：

```
原始对话  
    ↓  
送给专门的摘要LLM  
    ↓  
生成简短摘要  
    ↓  
摘要 + 新问题 → 主LLM  
    ↓  
生成回答  
```

**关键**：需要**两次LLM调用**：

1. 摘要LLM：总结历史
2. 主LLM：回答问题

---

### 实战代码：步骤1 - 创建摘要模板

```python
# 摘要专用提示词  
summary_prompt_template = """<s><|user|>Summarize the conversations and update with the new lines.  

Current summary:  
{summary}  

new lines of conversation:  
{new_lines}  

New summary:<|end|>  
<|assistant|>"""  

summary_prompt = PromptTemplate(  
    input_variables=["new_lines", "summary"],  
    template=summary_prompt_template  
)  
```

---

### 步骤2 - 创建摘要记忆

```python hl:5
from langchain.memory import ConversationSummaryMemory  

memory = ConversationSummaryMemory(  
    llm=llm,  # 用于摘要的LLM  
    memory_key="chat_history",  
    prompt=summary_prompt  # 摘要提示词  
)  

llm_chain = LLMChain(  
    prompt=prompt,  
    llm=llm,  
    memory=memory  
)  
```

---

### 步骤3 - 测试摘要功能

```python
# 第1轮  
llm_chain.invoke({"input_prompt": "Hi! My name is Maarten. What is 1 + 1?"})  

# 第2轮  
llm_chain.invoke({"input_prompt": "What is my name?"})  

# 输出：  
# {  
#   'chat_history': 'Summary: Human, identified as Maarten, asked about 1 + 1, which was answered by the AI as 2...',  
#   'text': 'Your name was referred to as "Maarten".'  
# }  
```

**注意**：`chat_history`不是原始对话，而是摘要！

---

### 多轮对话后的效果

```python
# 继续对话  
llm_chain.invoke({"input_prompt": "What was the first question I asked?"})  

# 输出：  
# 'The first question you asked was "what\'s 1 + 1?"'  
```

**查看完整摘要**：

```python
memory.load_memory_variables({})  

# 输出：  
# {'chat_history': 'Maarten, identified in this conversation, initially asked   
# about the sum of 1+1 which resulted in an answer from the AI being 2.   
# Subsequently, he sought clarification on his name but the AI informed him   
# that no personal data is retained beyond a single session due to privacy   
# reasons. The AI then offered further assistance if required. Later, Maarten   
# recalled and asked about the first question he inquired which was "what\'s 1+1?"'}  
```

---

### 工作原理：双LLM架构

如图所示：

```
用户问题  
    ↓  
[摘要LLM] 总结历史对话  
    ↓  
摘要 + 问题 → [主LLM]  
    ↓  
生成回答  
    ↓  
新对话 → [摘要LLM] 更新摘要  
```

---

### 优缺点

✅ **优点**：
- 完整记录历史对话（通过摘要）
- 支持超长对话场景
- 显著降低词元占用

❌ **缺点**：
- 每次交互需额外调用LLM（慢）
- 摘要质量受限于LLM的概括能力
- 原始信息未直接保留（需推测）

---

## 六、三种方法全面对比

### 对比表格

|维度|对话缓冲区|窗口式缓冲区|对话摘要|
|---|---|---|---|
|**实现难度**|⭐ 简单|⭐⭐ 中等|⭐⭐⭐ 复杂|
|**词元消耗**|高（随对话增长）|中（固定）|低（摘要压缩）|
|**信息完整性**|100%|k轮内100%|取决于摘要质量|
|**速度**|快→慢（增长后）|快|慢（需双调用）|
|**适用场景**|短对话|中等长度对话|超长对话|
|**上下文需求**|需要长上下文LLM|中等|较小|

---

### 性能对比示例

假设每轮对话`50个`词元：

|对话轮数|缓冲区词元|窗口式(k=3)|摘要词元|
|---|---|---|---|
|5轮|250|150|~50|
|10轮|500|150|~80|
|20轮|1000|150|~120|
|50轮|2500❌|150|~200|

**摘要在长对话中优势明显！**

---

## 七、实战建议：如何选择？

### 决策树

```
问题：需要多长的对话记忆？  

├─ 短对话（<10轮）  
│   └→ 对话缓冲区（最简单）  
│  
├─ 中等对话（10-30轮）  
│   └→ 窗口式缓冲区（平衡）  
│  
└─ 长对话（>30轮）  
    └→ 对话摘要（最强）  
```

---

### 场景示例

|应用场景|推荐方案|理由|
|---|---|---|
|简单FAQ机器人|缓冲区|对话短，无需优化|
|客服咨询|窗口式(k=5)|关注最近问题|
|心理咨询AI|摘要|需要长期记忆|
|代码助手|窗口式(k=10)|关注当前代码块|
|个人AI助理|摘要|跨会话记忆|

---

## 八、注意事项和技巧

### 1. 性能权衡

```python
# 快速原型：缓冲区  
memory = ConversationBufferMemory(...)  

# 生产环境：根据实际测试选择  
if 平均对话<10轮:  
    use ConversationBufferMemory  
elif 平均对话<30轮:  
    use ConversationBufferWindowMemory(k=5)  
else:  
    use ConversationSummaryMemory  
```

---

### 2. 成本考虑

如果使用付费API（如GPT-4）：

|方案|每次调用成本|10轮对话总成本|
|---|---|---|
|缓冲区|随对话增长|高|
|窗口式|固定|中|
|摘要|双倍（两次调用）|最高|

**权衡**：成本 vs 效果

---

### 3. 调试技巧

```python
# 查看当前记忆内容  
print(memory.load_memory_variables({}))  

# 清空记忆（重新开始）  
memory.clear()  

# 手动添加对话  
memory.save_context(  
    {"input": "问题"},  
    {"output": "回答"}  
)  
```

---

## 九、核心要点总结

### 1. 为什么需要记忆？

**LLM默认无状态** → 需要主动添加记忆机制



### 2. 三种方案对比

```
对话缓冲区：全部记住（简单但费词元）  
    ↓  
窗口式缓冲区：只记最近k轮（平衡）  
    ↓  
对话摘要：智能压缩（强大但慢）  
```



### 3. 选择标准

|优先级|考虑因素|推荐方案|
|---|---|---|
|1|对话长度|核心决策因素|
|2|词元预算|限制条件|
|3|响应速度|用户体验|
|4|成本控制|商业考虑|

---

### 4. 关键代码模板

```python
# 模板1：对话缓冲区  
memory = ConversationBufferMemory(memory_key="chat_history")  

# 模板2：窗口式  
memory = ConversationBufferWindowMemory(k=3, memory_key="chat_history")  

# 模板3：摘要  
memory = ConversationSummaryMemory(  
    llm=llm,  
    memory_key="chat_history",  
    prompt=summary_prompt  
)  

# 统一用法  
llm_chain = LLMChain(prompt=prompt, llm=llm, memory=memory)  
```

---

## 十、下一步

掌握记忆机制后，将介绍**智能体（Agent）**：

```python
# 未来将学习  
agent = 链 + 记忆 + 工具调用能力  

# 实现效果  
用户："MacBook Pro多少钱？换算成欧元是多少？"  
AI：自动搜索价格 → 自动调用计算器 → 给出答案  
```

**核心提升**：从"被动回答"到"主动行动"！

---

## 核心启示

**记忆是构建真正对话系统的基础**：

1. **无记忆** = 每次都是新对话（体验差）
2. **有记忆** = 真正的交互式对话（体验好）
3. **选对方案** = 性能、成本、效果的平衡

就像人类对话：没有记忆，就无法建立有意义的交流！

现在你已经掌握了让LLM"记住"对话的三种武器，接下来让我们学习如何让它们"自主行动"——智能体技术！
