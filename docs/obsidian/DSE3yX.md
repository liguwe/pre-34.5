# 真实分词器测评（篇一：几种真实模型的 LLM 分词器的对比）

`#2025/12/28`

前面我们学习了：

- 分词器 = 算法 + 参数 + 训练数据
- 四种分词粒度的权衡

现在来看真实模型的分词器到底有什么区别。

---

## 测试用例设计

书中用一个精心设计的测试字符串来对比分词器：

```python
text = """  
English and CAPITALIZATION     # 测试大小写处理  
中文                            # 中文
🎵                              # 测试emoji支持  
show_tokens False None elif    # 测试代码关键字  
two tabs:"  " Three tabs:"   " # 测试缩进（Python等）  
12.0*50=600                    # 测试数字运算  
"""  
```

测试维度：

1. ✅ 大小写敏感性
2. ✅ 多语言支持（中文、emoji）
3. ✅ 代码语法（关键字、缩进）
4. ✅ 数字表示
5. ✅ 特殊词元

---

## 主流分词器对比实战

### 1️⃣ BERT（2018）：早期分词器

```python
# BERT Base (不区分大小写)  
[CLS] english and capital ##ization [UNK] [UNK] show _ token ##s   
false none elif = = > = else : ...  

# BERT Base (区分大小写)  
[CLS] English and CA ##PI ##TA ##L ##I ##Z ##AT ##ION [UNK] [UNK] ...  
```

特点：

- ❌ emoji → `[UNK]`（未知词元）
- ⚠️ 大写字母被拆得很碎（`CA ##PI ##TA ##L...`）
- ⚠️ 有大小写敏感和不敏感两个版本

---

### 2️⃣ GPT-2（2019）：代际跃升

```python
English and CAP ITAL IZ ATION 🎵 show _ t ok ens False None   
el if == >= else : two tabs :" " ...  
```

进步点：
- ✅ emoji 能识别了！
- ✅ 保留大小写信息
- ✅ 代码符号处理更好（`==`、`>=` 作为整体）

---

### 3️⃣ Phi-3 & Llama 2（2023-2024）：现代标准

```python
English and C AP IT AL IZ ATION 🎵 show _ to kens False None   
elif == >= else : two tabs :"  " Three tabs : "   "  
```

现代特性：

- ✅ 对话词元：`<|user|>`、`<|assistant|>`、`<|system|>`
- ✅ 更高效的编码（相同文本用更少token）
- ✅ 词表扩大到 32K-100K

---

### 4️⃣ 代码专用：StarCoder（针对性优化）

```python
def add_numbers(a, b):  
....return a + b  

# 通用分词器  
def add _ numbers ( a , b ) : \n . . . . return a + b  

# 代码分词器（更优）  
def add_numbers ( a , b ) : \n .... return a + b  
```

关键差异：

- ✅ 缩进作为单个词元（而非多个空格）
- ✅ 函数名保持完整
- ✅ 提升代码生成准确率

---

## 演进趋势总结

|维度|BERT (2018)|GPT-2 (2019)|Phi-3 (2024)|
|---|---|---|---|
|emoji|❌ `[UNK]`|✅ 支持|✅ 支持|
|大小写|可选|保留|保留|
|换行符|丢失|保留为 `\n`|保留|
|词表大小|30K|50K|32K-100K|
|对话支持|❌|❌|✅ 专用词元|
|代码优化|❌|⚠️ 基础|✅ 领域专用|

---

## 关键洞察

### 💡 洞察 1：不可互换性

```python
# ❌ 错误示范  
gpt2_model = load_model("gpt2")  
bert_tokenizer = load_tokenizer("bert")  # 会崩溃！  

# ✅ 正确做法  
model_tokenizer = load_tokenizer("gpt2")  # 绑定关系  
```

原因：模型的嵌入矩阵维度 = 分词器词表大小

---

### 💡 洞察 2：领域适配的重要性

```python
# 场景：Python 代码生成  
通用分词器：100 tokens → 缩进信息丢失  
代码分词器：80 tokens → 保留语法结构 ✅  
```

教训：专用模型配专用分词器，性能提升显著

---

### 💡 洞察 3：向后不兼容

```python
# GPT-2 分词器  
"ChatGPT" → ['Chat', 'G', 'PT']  # 6 tokens  

# GPT-4 分词器  
"ChatGPT" → ['Chat', 'GPT']      # 2 tokens（更高效）  
```

影响：不同版本分词器不能混用

---

## 实践建议

### ✅ DO（推荐做法）

① 始终使用模型配套分词器
```python
model_name = "microsoft/Phi-3-mini-4k-instruct"  
model = AutoModel.from_pretrained(model_name)  
tokenizer = AutoTokenizer.from_pretrained(model_name)  # 匹配！  
```

② 根据应用场景选型
- 📝 文本任务 → GPT-4、Llama 系列
- 💻 代码生成 → StarCoder、CodeLlama
- 🌍 多语言 → XLM-RoBERTa、Qwen

③ 测试关键场景
```python
# 用你的实际数据测试  
tokens = tokenizer("你的业务文本")  
print(f"Token数: {len(tokens)}")  # 评估成本  
```

### ❌ DON'T（避免做法）

1. ❌ 混用不同模型的分词器
2. ❌ 忽视词表大小对成本的影响
3. ❌ 用英文分词器处理中文为主的任务

---

## 一句话记忆

分词器进化史 = 从"能用"到"好用"的过程：
- 2018：BERT 证明子词分词可行
- 2019：GPT-2 加入 emoji 和更好的编码
- 2024：现代分词器支持对话、代码、100+ 语言

开发者心法：分词器 ≠ 简单的字符串切分，它是模型的"**第一层神经网络**"——选错了，后面全白费！
