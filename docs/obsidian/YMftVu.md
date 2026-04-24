# 链：扩展LLM的能力

`#2025/12/31` `#ai` 

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/155.jpg)

> **图 ：单链架构将某个模块化组件（如提示词模板或外部记忆）连接到 LLM**

---

## 一、什么是"链"？为什么叫LangChain？

### 核心概念

**LangChain的名字就来源于"链"（Chain）这个核心方法**。

### 形象理解

想象一下工厂的流水线：

```
原材料 → 加工站1 → 加工站2 → 加工站3 → 成品  
```

**链就是这样的流水线**：

```
用户输入 → 提示词模板 → LLM → 输出处理 → 最终结果  
```

---

### 链的本质

|概念|解释|类比|
|---|---|---|
|**组件**|提示词模板、LLM、记忆、工具等|乐高积木块|
|**链**|把组件连接起来|用积木搭建完整作品|
|**输入输出**|组件之间传递数据|流水线传送带|

---

## 二、最简单的链：单链架构

### 问题回顾

上一节我们遇到的问题：

```python
llm.invoke("Hi! My name is Maarten. What is 1 + 1?")  
# 输出：''（空字符串！）  
```

**为什么？** 因为`Phi-3`需要`特定的提示词格式`。

### 解决方案：`提示词模板` + LLM 的链

![{%}|552](https://www.ituring.com.cn/figures/2025/HandsonLLM/156.jpg)

> **图 ：通过`链`式连接提示词模板与 LLM，只需输入基础提示词即可自动生成完整指令**

核心思路：

```
用户提示词 → 提示词模板（自动格式化）→ LLM → 输出  
```

**好处**：
- ✅ 不用每次手动写模板
- ✅ 代码更简洁
- ✅ 易于维护和复用

---

## 三、实战：构建第一个链

### 第1步：理解Phi-3的模板格式

`Phi-3`需要4个特殊标记：

```
<s>                    # 句子开始  
<|user|>              # 用户输入开始  
你的问题  
<|end|>               # 用户输入结束  
<|assistant|>         # 模型回答开始  
```
如下图：

![{%}|536](https://www.ituring.com.cn/figures/2025/HandsonLLM/157.jpg)

> **图：Phi-3 的标准提示词模板结构**

**完整示例**：

```
<s><|user|>  
What is 1 + 1?  
<|end|>  
<|assistant|>  
The answer to 1 + 1 is 2!  
<|end|>  
```

---

### 第2步：创建提示词模板

```python
from langchain import PromptTemplate  

# 创建模板（包含占位符）  
template = """<s><|user|>  
{input_prompt}<|end|>  
<|assistant|>"""  

# 创建PromptTemplate对象  
prompt = PromptTemplate(  
    template=template,  
    input_variables=["input_prompt"]  # 定义变量名  
)  
```

**关键点**：

- `{input_prompt}` 是占位符
- `input_variables` 定义了哪些变量需要填充

---

### 第3步：创建链 

```python
# 用 | 符号连接组件  
basic_chain = prompt | llm  
```

**就这么简单！** 一行代码搞定！

**`|` 符号的含义**：

- 在Python中叫 "管道操作符"
- 表示"把左边的输出传给右边"
- 类似`Linux命令`的管道：`command1 | command2`

---

### 第4步：使用链

```python
# 调用链  
response = basic_chain.invoke({  
    "input_prompt": "Hi! My name is Maarten. What is 1 + 1?"  
})  

print(response)  
# 输出：The answer to 1 + 1 is 2. It's a basic arithmetic operation...  
```

**流程可视化**：

```
用户输入："What is 1 + 1?"  
    ↓  
提示词模板自动格式化：  
<s><|user|>  
What is 1 + 1?  
<|end|>  
<|assistant|>  
    ↓  
LLM处理  
    ↓  
输出："The answer to 1 + 1 is 2!"  
```

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/158.jpg)

> **图 ：采用 Phi-3 模板的单链架构实现方案> 

但比如 OpenAI 的 GPT-3.5 模型，其 API 已封装了底层模板处理逻辑

## 四、进阶：多提示词链式架构

### 为什么需要多个提示词？

**问题场景**：生成一个复杂的故事，包括：
- 标题
- 角色描述
- 完整故事

**两种方案对比**：

| 方案     | 做法             | 优缺点        |
| ------ | -------------- | ---------- |
| ❌ 单提示词 | 一次性让模型生成所有内容   | 提示词复杂，难以控制 |
| ✅ 多提示词 | 分步骤生成，每步用简单提示词 | 易于控制，质量更高  |

---

### 多提示词链的工作原理

如图所示：

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/159.jpg)

> **图 ：序列链式架构中，前序提示词的输出将作为后续提示词的输入**

```
输入（故事梗概）  
    ↓  
提示词1：生成标题 → LLM → 标题  
    ↓  
提示词2：基于标题生成角色 → LLM → 角色描述  
    ↓  
提示词3：基于标题+角色生成故事 → LLM → 完整故事  
```

**关键特点**：

- 前一个环节的输出`是`下一个环节的输入
- 每个提示词专注一个`简单任务`
- 整体效果比单个复杂提示词更好

### 实战：生成故事的多链架构

#### 组件1：生成标题

```python
from langchain import LLMChain  

# 标题生成模板  
template = """<s><|user|>  
Create a title for a story about {summary}. Only return the title.<|end|>  
<|assistant|>"""  

title_prompt = PromptTemplate(  
    template=template,  
    input_variables=["summary"]  
)  

# 创建标题链（注意output_key）  
title = LLMChain(  
    llm=llm,  
    prompt=title_prompt,  
    output_key="title"  # 指定输出变量名  
)  
```

**测试**：

```python
title.invoke({"summary": "a girl that lost her mother"})  

# 输出：  
# {  
#   'summary': 'a girl that lost her mother',  
#   'title': '"Whispers of Loss: A Journey Through Grief"'  
# }  
```

---

#### 组件2：生成角色描述

```python
# 角色生成模板（使用summary和title两个变量）  
template = """<s><|user|>  
Describe the main character of a story about {summary} with the title {title}.   
Use only two sentences.<|end|>  
<|assistant|>"""  

character_prompt = PromptTemplate(  
    template=template,  
    input_variables=["summary", "title"]  # 需要两个输入  
)  

character = LLMChain(  
    llm=llm,  
    prompt=character_prompt,  
    output_key="character"  
)  
```

---

#### 组件3：生成完整故事

```python
# 故事生成模板（使用全部三个变量）  
template = """<s><|user|>  
Create a story about {summary} with the title {title}.   
The main character is: {character}.   
Only return the story and it cannot be longer than one paragraph.<|end|>  
<|assistant|>"""  

story_prompt = PromptTemplate(  
    template=template,  
    input_variables=["summary", "title", "character"]  
)  

story = LLMChain(  
    llm=llm,  
    prompt=story_prompt,  
    output_key="story"  
)  
```

---

#### 组装完整链

```python
# 用 | 符号连接三个组件  
complete_chain = title | character | story  

# 一次调用，自动执行全流程  
result = complete_chain.invoke("a girl that lost her mother")  

print(result['title'])  
print(result['character'])  
print(result['story'])  
```

**流程可视化**：

```
输入："a girl that lost her mother"  
    ↓  
[标题链] → "Whispers of Loss: A Journey Through Grief"  
    ↓  
[角色链] → "A young girl struggling with grief..."  
    ↓  
[故事链] → "In a small town, a young girl named..."  
```

## 五、链式架构的优势

### 1. 模块化设计

```python
# 可以单独使用任何组件  
just_title = title.invoke({"summary": "..."})  

# 或者组合使用  
title_and_character = title | character  
```

---

### 2. 易于调试

```python
# 可以查看每一步的输出  
result = title.invoke({"summary": "..."})  
print("标题:", result['title'])  

result = character.invoke(result)  
print("角色:", result['character'])  
```

---

### 3. 复用性强

```python
# 同一个标题生成器可用于不同场景  
fantasy_title = title.invoke({"summary": "a wizard's adventure"})  
scifi_title = title.invoke({"summary": "aliens invade Earth"})  
```

---

## 六、实用技巧和建议

### 技巧1：合理拆分任务

**拆分原则**：

- ✅ 每个链只做一件事
- ✅ 输出可以直接作为下一步的输入
- ✅ 避免过度拆分（增加复杂度）

**示例场景**：

|任务|是否适合拆分|建议|
|---|---|---|
|翻译单句|❌|单提示词即可|
|生成营销文案（名称+口号+广告语）|✅|拆分成3个链|
|写购物清单|✅|分析→归类→生成|

---

### 技巧2：变量命名规范

```python
# ✅ 好的命名  
input_variables=["user_input", "context", "examples"]  
output_key="generated_title"  

# ❌ 不好的命名  
input_variables=["x", "y", "z"]  
output_key="out"  
```

---

### 技巧3：处理错误

```python
try:  
    result = chain.invoke({"input": "..."})  
except Exception as e:  
    print(f"链执行失败: {e}")  
    # 可以使用默认值或重试  
```

---

## 七、常见应用场景

### 场景1：内容创作

```python
# 博客生成链  
outline_chain: 生成大纲  
    ↓  
intro_chain: 写引言  
    ↓  
body_chain: 写正文  
    ↓  
conclusion_chain: 写结论  
```

---

### 场景2：数据处理

```python
# 客户反馈分析链  
extract_chain: 提取关键信息  
    ↓  
classify_chain: 分类（问题/建议/赞扬）  
    ↓  
summarize_chain: 生成摘要  
    ↓  
action_chain: 建议处理方案  
```

---

### 场景3：代码生成

```python
# 代码助手链  
analyze_chain: 分析需求  
    ↓  
design_chain: 设计架构  
    ↓  
code_chain: 生成代码  
    ↓  
test_chain: 生成测试用例  
```

---

## 八、核心要点总结

### 1. 单链架构

```python
# 核心公式  
chain = 提示词模板 | LLM 

# 使用方法  
result = chain.invoke({"变量名": "值"})  
```

---

### 2. 多链架构

```python
# 核心公式  
chain = 组件1 | 组件2 | 组件3  

# 数据流动  
输入 → 组件1输出 → 组件2输入 → 组件2输出 → 组件3输入 → 最终输出  
```

---

### 3. 关键概念对比

|概念|单链|多链|
|---|---|---|
|**复杂度**|低|中等|
|**灵活性**|中等|高|
|**适用场景**|简单任务|复杂任务|
|**调试难度**|容易|需要分步调试|
|**模型调用次数**|1次|多次|

---

## 九、注意事项

### 1. 关于特殊词元

**不同模型有不同的模板格式**！

```python hl:5
# Phi-3  
<s><|user|>...<|end|><|assistant|>  

# GPT-3.5（通过API）  
# 不需要手动模板，API已处理  

# Llama  
<s>[INST]...[/INST]  
```

**建议**：查阅模型文档，了解其特定格式。

>  这里的 gpt-3.5 已经处理有点误解，更多参考 [3. 关于模板格式和API处理的澄清](/38H1vg)

---

### 2. 关于性能

**多链 = 多次模型调用 = 更慢**

```python
# 单链：1次LLM调用  
simple_chain = prompt | llm  

# 三链：3次LLM调用（更慢，但质量可能更好）  
complex_chain = chain1 | chain2 | chain3  
```

**权衡**：速度 vs 质量

---

### 3. 关于成本

如果使用付费API（如GPT-4）：

```python
# 每次调用都要花钱  
chain1: $0.001  
chain2: $0.001  
chain3: $0.001  
总计: $0.003（是单次的3倍）  
```

## 十、下一步

掌握链式架构后，第7.3节将介绍**记忆机制**，让LLM能够"记住"对话历史：

```python
# 未来将学习  
chain_with_memory = 提示词模板 | LLM | 记忆模块  

# 实现效果  
用户："我叫张三"  
AI："你好张三！"  
用户："我叫什么？"  
AI："你叫张三。"  # 能记住之前的对话！  
```

---

## 核心启示

**链式架构的本质**：
- 不是让模型变复杂
- 而是**把复杂任务拆解成简单步骤**
- 每个步骤都清晰可控
- 组合起来完成复杂目标

就像搭乐高：每块积木很简单，组合起来就能搭建复杂作品！

现在你已经掌握了LangChain的核心能力——链式架构。接下来让我们为它添加"记忆"功能！
