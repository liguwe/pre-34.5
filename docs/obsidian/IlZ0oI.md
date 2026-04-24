# 已训练 Transformer LLM 的输入和输出：篇一

`#2025/12/29`

## 核心概念：超级“自动补全”函数

如果把已经训练好的 `LLM` 看作一个 `Python 函数`，它`不是`一个直接把“问题”映射到“答案”的魔法转换器。

本质上，它是一个通过`无限循环调用`的 `next_token_predictor`（下一个词元预测器）。

## 宏观视角：它是个生成器 (Generator)

在应用层（API 调用）看，它像是一个接收字符串并返回字符串的函数：

```python
prompt = "给 Sarah 写封邮件道歉..."  
response = model.generate(prompt)  
# 输出: "Dear Sarah, I'm writing to..."  
```


但在底层实现逻辑上，它其实是一个循环（Loop），每次只吐出一个词。

### 💻 伪代码逻辑

```python hl:12
def generate_text(prompt):  
    current_text = prompt  
    
    while True:  
        # 1. 核心步骤：模型接收当前所有文本，预测下一个最可能的词  
        # 注意：模型每次只能预测 1 个词元！  
        next_token = model.predict_next_token(current_text)  
        
        # 2. 拼接：把生成的词加到输入后面，作为下一次的输入  
        current_text += next_token  
        
        # 3. 终止条件：遇到特殊的“结束符”或达到最大长度  
        if next_token == "<|endoftext|>":  
            break  
            
        yield next_token  # 流式输出给用户看  
```



## 2. 微观视角：前向传播 (Forward Pass)

文档中的 图3-2 描述了“一次生成一个词元”的过程。我们可以用 Python 的 List 操作来直观理解这个状态变化。

假设用户输入是 `"Hello"`，模型要补全 `"world!"`。

### Step 1: 第一次前向传播

- 输入 (Input):
	-  `["Hello"]`
- 模型内部: 
	- 经过几十层神经网络计算...
- 输出 (Output): 
	- 模型计算出词表中所有词的概率，发现 `" world"` 的概率最高。
- 结果: 
	- 生成词元 `" world"`

### Step 2: 第二次前向传播 (注意：输入变长了！)

- 输入 (Input): 
	- `["Hello", " world"]`  <--   看这里，上一步的输出变成了这一步的输入  →  这就是自回归
- 模型内部: 
	- 再次经过几十层神经网络计算...
- 输出 (Output): 
	- 预测下一个词，发现 `"!"` 概率最高。
- 结果: 
	- 生成词元 `"!"`

### Step 3: 第三次前向传播

- 输入 (Input): 
	- `["Hello", " world", "!"]`
- 输出 (Output):
	-  `"<EOS>"` (End of Sequence，结束标记)
- 结果: 
	- 循环终止。

---

## 3. 数据结构视角：输入输出到底是什么？

作为工程师，你可能关心数据的 `Shape`（形状）和 `Type`（类型）

### 📥 输入 (Input)

并不是直接吃 String，而是吃 `Token IDs`（整数列表）。

- 形式:
	-  `Tensor(Batch_Size, Sequence_Length)`
- 例子:
	-  `[101, 7592, 2088, ...](#)` (对应 "Write an email...")

### 📤 输出 (Output)

模型输出的不是直接的“词”，而是概率分布（Logits）。

- 形式:
	-  `Tensor(Batch_Size, Sequence_Length, Vocabulary_Size)`
- 含义:
	-  对于序列中的每一个位置，模型都会输出一个它是词表中任意一个词的概率。
- 关键点:
	-  在生成文本时，我们只关心最后一个位置的概率分布，因为那代表了“下一个词”是谁。

```python
# 假设词表大小是 50000  
# 输入是 5 个词  
logits = model(input_ids)   
# logits.shape 是 [1, 5, 50000]  

# 我们只取最后一个词的预测向量  
next_token_logits = logits[0, -1, :]  # shape: [50000]  

# 从这 50000 个分数里选最高的（或采样），得到下一个词的 ID  
next_token_id = argmax(next_token_logits)  
```

---

## 4. 总结

三点：
1. 无状态变有状态：
	- 虽然模型架构本身是无状态函数（`y = f(x)`），
		- 但在生成过程中，我们通过把 `y` 拼回到 `x` 后面，手动维护了一个“状态”，构成了`自回归（Autoregressive） 循环`。
2. Append 操作：
	- LLM 生成文本的过程，本质上就是不断的 `List.append()` 操作。
3. 计算量：
	- 生成 100 个词，意味着模型要运行 100 次完整的`前向传播`（虽然有 KV Cache 等优化，但逻辑上是`运行了 100 次`）。
	- 这就是为什么生成长文比读取长文要慢得多的原因。
