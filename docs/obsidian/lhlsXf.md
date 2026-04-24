# 通过缓存键-值加速生成过程

`#2025/12/29` `#ai` 

![{%}|632](https://www.ituring.com.cn/figures/2025/HandsonLLM/061.jpg)

## 1. 没有缓存时

### 问题场景

回想一下 `LLM` 生成文字的过程：

```python
# 第 1 轮生成  
输入: "Write an email"  
输出: "Dear"  

# 第 2 轮生成（追加上一轮的输出）  
输入: "Write an email Dear"  # ← 又要重新处理 "Write an email"  
输出: "Sarah"  

# 第 3 轮生成  
输入: "Write an email Dear Sarah"  # ← 又要重新处理前面所有词！  
输出: ","  
```

- 每生成一个新词，模型都要把**之前所有的词重新计算一遍** 
- 其实就像`递归`一样

## 2. 缓存：记忆

即编程中的 `memo` 或者记忆

---

## 4. 缓存的工作流程（可视化）

```
[第 1 轮]生成 "Dear"  
┌─────────────────────────────┐  
│ 输入: Write an email        │  
│                             │  
│ 计算流 1: Write             │  
│   ├─ Key₁, Value₁  ← 存入缓存  
│                             │  
│ 计算流 2: an                │  
│   ├─ Key₂, Value₂  ← 存入缓存  
│                             │  
│ 计算流 3: email             │  
│   ├─ Key₃, Value₃  ← 存入缓存  
└─────────────────────────────┘  
        ↓  
    输出: "Dear"  

[第 2 轮]生成 "Sarah"  
┌─────────────────────────────┐  
│ 输入: Write an email Dear   │  
│                             │  
│ 计算流 1-3: 从缓存读取 ✓    │ ← 不用重新计算！  
│                             │  
│ 计算流 4: Dear（新增）      │  
│   ├─ Key₄, Value₄  ← 存入缓存  
└─────────────────────────────┘  
        ↓  
    输出: "Sarah"  
```

## 5. 实战对比：速度差异惊人

### 代码示例

```python hl:9
prompt = "Write a very long email apologizing to Sarah..."  
input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to("cuda")  

# 测试 1：启用缓存  
%%timeit -n 1  
generation_output = model.generate(  
    input_ids=input_ids,  
    max_new_tokens=100,  
    use_cache=True  # ← 开启缓存  
)  
# 结果：4.5 秒  

# 测试 2：禁用缓存  
%%timeit -n 1  
generation_output = model.generate(  
    input_ids=input_ids,  
    max_new_tokens=100,  
    use_cache=False  # ← 关闭缓存  
)  
# 结果：21.8 秒（慢了将近 5 倍！）  
```

**结论**：

- 缓存能让生成速度提升 **4-5 倍**
- 这就是为什么 Hugging Face Transformers 默认开启缓存的原因

## 6. 用户体验 → "流式输出"？

即使有缓存优化，生成 100 个词元仍需要 `4.5 秒`。对于盯着屏幕等待的用户来说，这已经很长了。

**解决方案**：流式输出（Streaming）

```python
# 传统方式（用户等 4.5 秒才看到结果）  
Wait... Wait... Wait... → "Dear Sarah, I am writing to..."  

# 流式输出（用户边生成边看到）  
"Dear" → "Sarah" → "," → "I" → "am" → "writing" → ...  
```

## 8. 时间复杂度

```
没有缓存：  
每轮生成 = 重新计算所有词元 = O(N²) 复杂度 = 超级慢 ❌  

有缓存：  
每轮生成 = 只计算新词元 + 读取缓存 = O(N) 复杂度 = 飞快 ✅  
```

类比到编程：

- 没有缓存 = 每次都重新编译整个项目
- 有缓存 = 只编译修改的文件（增量编译）
