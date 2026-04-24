# Phi-3 模型的完整指令说明

`#2025/12/27` `#ai` 

下面 `prompt` 是给 LLM（Phi-3 模型）的**完整输入指令**，让我来拆解它的各个部分：

## 关键要点总结

1. **这是一个完整的输入提示词**，不是代码注释
2. **`<|assistant|>`** 是必需的`特殊词元`，训练时模型学会了识别它
3. **模型会在这个标记后面开始生成**道歉邮件的内容
4. **不同模型有不同的模板格式**——Phi-3 用 `<|assistant|>`，GPT 用其他格式

---

**开发建议**：使用 Phi-3 时，始终记得在提示词末尾加上 `<|assistant|>`，就像告诉模型"`该你说话了`！"

## 一、整体结构

```python
prompt = "Write an email apologizing to Sarah for the tragic gardening mishap. Explain how it happened.<|assistant|>"  
```

这个提示词由**两部分**组成：

### 1. 用户指令部分（人类可读）

```
Write an email apologizing to Sarah for the tragic gardening mishap.   
Explain how it happened.  
```

**中文翻译**：写一封向 Sarah 道歉的电子邮件，关于那次悲剧性的园艺事故。解释一下是怎么发生的。

**作用**：告诉模型要完成什么任务（写道歉邮件）

### 2. 特殊词元部分（模型控制符）

```
<|assistant|>  
```

**作用**：告诉模型"**现在轮到你输出了**"

## 二、特殊词元 `<|assistant|>` 的含义

这是 **Phi-3 聊天模板的核心组成部分**：

```
<s>                    # 文本开始标记  
<|user|>               # 用户消息开始  
[用户的提示词内容]  
<|end|>                # 用户消息结束  

<|assistant|>          # 👈 模型输出开始  
[模型生成的内容]  
<|end|>                # 模型输出结束  
```

### 为什么需要 `<|assistant|>`？

| 作用       | 说明                       |
| -------- | ------------------------ |
| **角色切换** | 明确告诉模型"这里开始是你的回答区域"      |
| **训练对齐** | Phi-3 在训练时就使用这个格式，必须保持一致 |
| **输出触发** | 就像编程中的"开始执行"信号           |

## 三、完整的模板对比

### 标准完整模板

```python
# 完整的 Phi-3 模板格式  
"""  
<s><|user|>  
Write an email apologizing to Sarah for the tragic gardening mishap.   
Explain how it happened.<|end|>  
<|assistant|>  
"""  
```

### `示例中的简化版本`

```python
# 代码示例中的版本（省略了部分标记）  
prompt = "Write an email apologizing to Sarah for the tragic gardening mishap. Explain how it happened.<|assistant|>"  
```

**区别**：示例省略了 `<s>`、`<|user|>` 和 `<|end|>` 标记，但保留了关键的 `<|assistant|>`

## 四、实际运行效果

当你把这个 prompt 送入模型时：

```python
# 输入这个 prompt  
input_ids = tokenizer(prompt, return_tensors="pt").input_ids  

# 模型会在 <|assistant|> 后面生成内容  
generation_output = model.generate(input_ids=input_ids, max_new_tokens=20)  
```

**模型输出**（示例）：

```
Subject: My Sincere Apologies for the Gardening Mishap  

Dear Sarah,  
```

## 五、类比理解

你可以把这个提示词想象成：

### 1. 对话脚本

```
用户: "写一封道歉邮件..."  
助手: [开始回答]  👈 <|assistant|> 就是这个位置  
```

### 2. 函数调用

```javascript
function generateEmail(instruction) {  
  // instruction: "Write an email..."  
  // <|assistant|> 相当于 return 的位置  
  return modelOutput;  
}  
```

### 3. HTML 标签

```html
<user>写一封道歉邮件...</user>  
<assistant>  
  Subject: My Sincere Apologies...  👈 模型在这里生成内容  
</assistant>  
```
