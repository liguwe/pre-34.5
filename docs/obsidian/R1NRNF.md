# 已训练 Transformer LLM 的输入和输出：篇二

`#2025/12/29` `#ai` 

> 另外可见，[1. 已训练 Transformer LLM 的输入和输出：篇一](/IlZ0oI)，内容差不多

看作是一个 `“递归调用的 API”` 或者一个 `“无限追加的列表”`。

LLM 生成文本的本质：它不是一次性“写”出来的，而是像`贪吃蛇`一样，吃一个长一个。

通过以下三个工程视角来理解：

## 1. 核心逻辑：`next_token = model(current_sequence)`

不要把 LLM 想象成一个能直接返回一篇作文的函数。在最底层，它只做一件事：根据当前的输入序列，`预测下一个概率最高的 Token`。

- 输入 (Input)： 
	- 一个整数列表 `List[Int]`（即 `Prompt` 转换成的 `Token IDs`）。
- 输出 (Output)： 
	- 下一个整数的概率分布（从中采样得到 `Int`）。

## 2. 生成过程：一个巨大的 `While` 循环

大模型生成文本的过程，本质上是一个`自回归` (Autoregressive) 的循环。

- 第 1 步： 
	- 你输入 `["Write", "an", "email"]`。
- 第 2 步：
	-  模型预测下一个词是 `["to"]`。
- 第 3 步（关键）： 
	- 系统把 `["to"]` 追加 (Append) 到输入列表末尾。新的输入变成了 `["Write", "an", "email", "to"]`。
- 第 4 步： 
	- 把这个新列表再次喂给模型，模型预测出 `["Sarah"]`。
- 循环： 
	- 这个过程不断重复，直到模型生成一个特殊的 “`结束符`” (End of Sequence Token) 或者达到最大长度限制。

## 3. Python 伪代码视角

如果把这个过程写成 Python 代码，它的逻辑大概是这样的：

```python
# 1. 初始输入 (Prompt)
input_ids = # 假设代表 "Write an email"

# 2. 生成循环 (Generation Loop)
while True:
    # --- 前向传播 (Forward Pass) ---
    # 模型接收当前所有的 token，计算下一个 token 的概率
    next_token_logits = model(input_ids)

    # --- 采样/解码 (Sampling/Decoding) ---
    # 根据策略（贪婪或随机）选择一个 token ID
    new_token_id = select_best_token(next_token_logits)

    # --- 停止条件 ---
    if new_token_id == EOS_TOKEN: # 遇到结束符 <|end|>
        break

    # --- 状态更新 (Autoregression) ---
    # 关键点：把生成的 token 追加到输入中，作为下一次的上下文
    input_ids.append(new_token_id)
    # print(tokenizer.decode(new_token_id)) # 实时流式输出

# 3. 最终结果
print(tokenizer.decode(input_ids))
```

## 总结：给工程师的“太长不看版”

- 没有“生成文本”这回事：
	- LLM 实际上是在做序列补全。它只是不断地在猜“下一个整数”是什么。
- 上下文不断增长：
	- 随着生成的进行，输入给模型的列表（Context）会越来越长，
	- `包含的内容 = 你的原始 Prompt + 模型刚刚生成的所有内容`。
- 计算量累积：
	- 生成 100 个词，意味着模型要运行 100 次完整的计算流程（前向传播）。
	- 这就是为什么生成长文本比生成短文本慢得多，也是为什么流式输出（Streaming）如此重要
		- 为了让用户看到它正在一个字一个字地“蹦”出来。
