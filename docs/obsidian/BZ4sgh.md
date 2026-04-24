# 文本分词：让计算机精准"切割"文本

`#2026/01/01` `#ai` 

![{%}|584](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/013.jpg)

> 图：大语言模型中文本处理步骤概览。在这一步骤图中，我们将输入文本分割成了单独的词元，这些词元既可以是`单词`，也可以是诸如`标点符号`之类的`特殊字符`

## 1. 什么是文本分词？

🔍 想象你有一段长长的文字，现在需要把它切成小块，这就是`分词`！

### 关键特点：

- 将连续的文本拆分成独立的"词元"
- 词元可以是单个单词
- 词元也可以包括标点符号

## 2. 为什么需要分词？

对于计算机来说：

- 需要将文本转换成它能理解的形式
- 每个`词元`都是处理文本的`基本单位`

## 3. 分词的实现方法

### 3.1 使用`正则`表达式分词

```python
import re  

# 示例文本  
text = "Hello, do you like tea?"  

# 使用正则表达式分割文本  
preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', text)  

# 去除空白字符  
preprocessed = [item.strip() for item in preprocessed if item.strip()]  

print(preprocessed)  
# 输出：['Hello', ',', 'do', 'you', 'like', 'tea', '?']  
```

![{%}|1120](https://www.ituring.com.cn/figures/2025/LargeLanguageModel/014.jpg)

#### 附：语法回顾

1. **列表解析结构**：`[expression for item in iterable if condition]`
    - **expression**：
        - 表示对每个元素进行的操作。
            - 在这个例子中是 `item.strip()`，即对 `item` 调用 `strip()` 方法去除首尾空白字符。
    - **iterable**：
        - 待处理的列表，这里是 `preprocessed`。
    - **condition**：
        - 过滤条件，仅保留满足条件的元素。这里是 `if item.strip()`，确保 `item` 不为空字符串（即 stripping 后的结果不为空）。
2. **`for item in preprocessed` (循环体)**：
    - 这是基础。遍历 `re.split` 产生出来的每一个原始片段。
3. **`if item.strip()` (过滤条件)**：
    - **作用**：判断这个片段是否包含有效内容。
    - **原理**：在 Python 中，空字符串 `""` 会被评估为 `False`。如果 `item` 全是空格，`item.strip()` 之后就会变成 `""`。这一步过滤掉了所有的纯空格和空字符串。
4. **`item.strip()` (结果变量)**：
    - **作用**：如果通过了上面的过滤条件，就对该片段执行最后的“修剪”，去掉两端的残余空格，并存入新列表。

 💡 等价的标准循环 (For-loop)

你可以将其理解为下面这段代码的“语法糖”缩写：

```python
# %%
# 等价的完整写法
new_list = []
for item in preprocessed:
    # 1. 检查 item.strip() 是否为非空字符串 (即 True)
    if item.strip(): 
        # 2. 将处理后的结果存入
        new_list.append(item.strip())
```

进阶写法：过滤、修剪并转小写

```python
# 复刻练习：过滤、修剪并转小写
preprocessed = [item.strip().lower() for item in preprocessed if item.strip()]
```

> 另外相关语法可参考 [5. Python 字典推导式与 enumerate 用法详解](/t5r5GW)
## 4. 分词原则

• 保留文本的原始结构  
• 区分大小写  
• 保留专有名词的大小写特征

## 5. 实际应用案例

在本书中，作者使用短篇小说"The Verdict"作为文本样本：

- 总字符数：20,479
- 分词后的词元数：4,690

## 6. 分词的挑战

• 需要处理各种`特殊字符`  
• 要正确处理标点符号  
• 保持文本的`语义完整性`

## 7. 代码实现要点

```python
def tokenize(text):  
    # 使用正则表达式分割  
    tokens = re.split(r'([,.:;?_!"()\']|--|\s)', text)  
    
    # 去除空白字符  
    tokens = [token.strip() for token in tokens if token.strip()]  
    
    return tokens  
```

## 8. 为什么这么重要？

对于大语言模型来说：
- 分词是处理文本的第一步
- 将文本转换为可计算的形式
- 为后续的词元嵌入和模型训练做准备

## 结语

文本分词就像是为计算机准备的"文本切割刀"，能够精确地将复杂的文本转换成便于处理的小块！
