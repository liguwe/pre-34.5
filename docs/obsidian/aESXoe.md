# 使用 `logprobs` 参数来判断某句话是证明或负面

`#2025/12/24` `#ai` 

通过 `logprobs` ，我们不仅能够判断句子是`正面`还是`负面`，还能获取模型对这两类情感的`概率判断`

## 提示词 与 代码

```python
system_prompt = 
"""
You are an expert in sentiment analysis. You will receive a text that you have to classify:
- if the text is positive, then return "positive"
- if the text is negative, then return "negative"
Return only "positive" or "negative".
The output should have 8 characters all in lowercase. No other values are allowed! 
"""
```

随后， `system_prompt` 被用来调用端点：

```python hl:8,9
api_response = client.chat.completions.create(
    model=model,
    messages=[
        {"role": "system", "content": system_prompt}, # 提示词模板
        {"role": "user", "content": text}  # 变量 `text` 包含需要模型分类的文本
        ],
    temperature=0,
    logprobs=True,
    top_logprobs=5  # 指定了模型必须报告对数概率的前几个词元的数量
)
```

例如， `text` 变量为 `"Today, I have dinner plans."` （今天我有晚餐计划），则以下是 `api_response.choices[0].logprobs.content[0].top_logprobs` 的完整响应：

```json
[
	 TopLogprob(token="positive", bytes=[112, 111, 115, 105, 116, 105, 118, 101], logprob=-0.0005604197),
	 TopLogprob(token="negative", bytes=[110, 101, 103, 97, 116, 105, 118, 101], logprob=-8.229488),
	 TopLogprob(token="Positive", bytes=[80, 111, 115, 105, 116, 105, 118, 101], logprob=-8.813299),
	 TopLogprob(token="\`", bytes=[96], logprob=-9.621803),
	 TopLogprob(token="'", bytes=[39], logprob=-10.279497)
]
```

每个对象包含以下三个字段：词元、`词元的字节表示`和`相关对数概率`。

不太好理解？

## 假设我们给模型一段有点“阴阳怪气”的话： 

 **文本：** “这电影真‘好看’，我睡得可香了。”

### 第一步：查看模型的“内心挣扎” (Logprobs)

当你开启 `logprobs` 时，模型不会只给你一个答案，它会交出一张`候选名单`。假设模型返回的数据转换后如下：

| **候选词 (Token)** | **原始概率 (Probability)** | **解释**             |
| --------------- | ---------------------- | ------------------ |
| `negative`      | **0.60** (60%)         | 模型觉得你在讽刺，偏负面。      |
| `positive`      | **0.35** (35%)         | 模型看到“好看”这个词，有点被迷惑。 |
| `Negative`      | **0.03** (3%)          | 大写的备选词（我们不想要这个）。   |
| 其他 (标点等)        | **0.02** (2%)          | 杂音。                |

---

### 第二步：清理与“归一化” (Normalization)

我们只关心 `positive` 和 `negative` 这两个标准答案。但你会发现：$0.60 + 0.35 = 0.95$，加起来**不到 100%**。

为了得到一个确切的“情绪得分”，我们要把这两人拉出来重新分配权重，让他们两个`占满 100%`：

1. **求和：** $0.60 + 0.35 = 0.95$
2. **重新计算负面占比：** $0.60 \div 0.95 \approx 0.63$ (**63%**)
3. **重新计算正面占比：** $0.35 \div 0.95 \approx 0.37$ (**37%**)

---

### 第三步：得出结论

最后，你的系统会输出：

- **最终判定：** 负面 (Negative)
- **置信度分数：** 0.63

### 为什么这样做比直接看结果好？

我们可以对比两个不同的句子：
- **句子 A：** “太烂了，退钱！” —— 模型给 `negative` 的分数可能是 **0.99**。
- **句子 B：** “还行吧，勉强能看。” —— 模型给 `negative` 的分数可能是 **0.51**。

如果没有 `Logprobs`： 你看到的结论都是“负面”。  
有了 Logprobs： 你就能发现句子 A 是“`愤怒`”，而句子 B 只是“`无感`”。

## bytes 是啥？ token 是名字，bytes 身份证号

简单来说，**`bytes` 字段就是词元（Token）在计算机底层存储时的“数字指纹”。**

由于计算机本身不认识“`positive`”这个单词，它只能识别数字。`bytes` 数组里的每一个数字，都对应着这个单词中每个字符的 **ASCII 码** 或 **UTF-8 编码**。

---

### 1. 拆解分析示例

让我们看你之前给出的例子：

`token="positive", bytes=[112, 111, 115, 105, 116, 105, 118, 101]`

这 8 个数字分别代表：

- **112** $\rightarrow$ `p`
- **111** $\rightarrow$ `o`
- **115** $\rightarrow$ `s`
- **105** $\rightarrow$ `i`
- **116** $\rightarrow$ `t`
- **105** $\rightarrow$ `i`
- **118** $\rightarrow$ `v`
- **101** $\rightarrow$ `e`

---

### 2. 为什么需要这个字段？

你可能会问：“既然已经有 `token="positive"` 这个字符串了，为什么还要给一串数字？”

主要有三个原因：

1. 处理特殊字符：
    - 些 Token 可能是不可见字符（比如空格 、换行符 \n）或者是特殊的 Emoji 表情。直接看字符串可能看不出来，但通过 bytes 编码，程序可以 100% 准确地还原这些字符。
        - 例如：空格的 `bytes` 是 `[32]`。
2. 多语言一致性
	- 对于中文或其他非拉丁文字，一个 Token 可能由多个字节组成。通过返回字节数组，可以确保在不同的编程环境下（如 Python, Node.js），字符串的还原不会因为编码问题而产生乱码。
3. 精确还原：
	- 有些 Token 并不是完整的单词，可能只是单词的一部分（比如 ing）。`bytes` 提供了最底层的`原始数据`，方便开发者手动拼接或转换。

---

### 3. 在情感分析项目中，你需要管它吗？

**答案是：通常不需要。**

在这个项目中，我们只需要关注：
- **`token`**: 用来判断是 "`positive`" 还是 "`negative`"。
- **`logprob`**: 用来计算它是该情感的概率。

`bytes` 更多是作为一种**辅助校验**存在的。比如，如果你发现有两个 Token 看起来长得一模一样（例如一个是英文的 `A`，一个是俄文的 `А`），你可以通过对比 `bytes` 发现它们的底层数字其实是不同的。

---

### 总结

你可以把 `token` 看作是单词的**名字**，把 `bytes` 看作是单词的**身份证号**。名字可能会重名或写错，但身份证号在计算机系统里是绝对唯一的。
