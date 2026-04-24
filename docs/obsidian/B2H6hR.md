# 使用特定任务模型

`#2025/12/30` `#ai` 

> [!info]  
> 核心问题是：
> - ① 如何直接使用一个`已经训练好的专用模型`来给电影评论分类？
> - ② 与其自己从头训练一个模型，不如直接找一个已经学会这项技能的`“专家”模型`拿来用

## 一、什么是"特定任务模型"？

想象你要做情感分析（判断评论是好评还是差评），有两种选择：

### 选择1：特定任务模型（专家）

- 就像请一个专门做情感分析的专家
- 这个专家已经在类似任务上训练了很久
- 你直接把评论给他，他马上告诉你"正面"或"负面"

### 选择2：通用模型（多面手）

- 就像请一个什么都懂一点的通才
- 他可以做很多事情，但需要你额外训练他做情感分析
- 需要更多工作量

> 本节讲的就是第一种：直接用专家模型！

---

## 二、加载模型：3步搞定

### 步骤1：导入工具

```python
from transformers import pipeline  
```

这个`pipeline`就像一个"魔法管道"，把复杂的模型操作都封装好了。

---

### 步骤2：选择模型并加载

选择的模型叫做 `twitter-roberta-base-sentiment-latest`。
- 为什么要选它？ 
	- 这个模型虽然是读推特（Twitter）长大的，但它专门被训练用来识别一段话的情绪是正面的、负面的还是中性的。
	- 我们想测试一下，这位“推特情感专家”能不能看懂“电影评论”。

```python
# 模型的路径（就像模型的"地址"）  
model_path = "cardiffnlp/twitter-roberta-base-sentiment-latest"  

# 加载模型到"管道"中  
pipe = pipeline(   
    model=model_path,              # 指定模型  
    tokenizer=model_path,          # 指定分词器  
    return_all_scores=True,        # 返回所有类别的分数  
    device="cuda:0"                # 用GPU加速（如果有的话）  
)  
```

关键参数解释：

|参数|作用|类比|
|---|---|---|
|`model`|指定使用哪个模型|选择哪位专家|
|`tokenizer`|把句子切成词元|把句子切成词|
|`return_all_scores`|返回所有类别的概率|不只告诉你答案，还告诉你有多确定|
|`device`|用GPU还是CPU|用跑车还是自行车|

---

### 步骤3：使用模型预测

```python
# 输入一条评论  
review = "Best movie ever!"  

# 让模型预测  
result = pipe(review)  

# 输出结果  
print(result)  
# 可能输出：[{'label': 'positive', 'score': 0.98}]  
```

就这么简单！ 模型直接告诉你：这是正面评论，置信度98%。

---

## 三、分词器的作用：把句子"切碎"

在模型处理之前，需要先用分词器把句子切成小块（词元）。

### 完整流程图

```
输入："Best movie ever!"  
    ↓  
[分词器]把句子切成词元  
    ↓  
词元：[Best] [movie] [ever] [!]  
    ↓  
[特定任务模型]处理这些词元  
    ↓  
输出：正面（标签=1，置信度=0.98）  
```

### 为什么要切成词元？

例子：处理罕见词

```
输入："Her vocalization was melodic"  
     ↓  
分词器处理：  
[Her] [vocal] [##ization] [was] [melodic]  
```

![{%}|464](https://www.ituring.com.cn/figures/2025/HandsonLLM/090.jpg)

> 输入句子首先被送入分词器，然后才能被特定任务模型处理

注意`vocalization`被切成了`vocal`和`##ization`两部分！

好处：
- 模型不需要认识所有单词
- 只要认识常见的"词根"就行
- 就像汉字的偏旁部首，认识偏旁就能猜出字的意思

---

## 四、实战：给整个测试集打分

### 加载测试数据

```python
from datasets import load_dataset  

# 加载烂番茄数据集  
data = load_dataset("rotten_tomatoes")  

# 取出测试集  
test_data = data["test"]  
```

---

### 批量预测

```python
# 提取所有评论文本  
texts = test_data["text"]  

# 批量预测（一次处理多条）  
predictions = pipe(texts, batch_size=16)  # 每次处理16条  

# 查看第一条预测结果  
print(predictions[0])  
# 输出：[{'label': 'positive', 'score': 0.95},   
#        {'label': 'negative', 'score': 0.05}]  
```

关键点：

- `batch_size=16`：一次处理16条评论，提高效率
- 如果一条条处理，会很慢！

---

### 提取预测标签

```python
# 把预测结果转换成标签（0或1）  
predicted_labels = []  

for pred in predictions:  
    # 找到分数最高的类别  
    best = max(pred, key=lambda x: x['score'])  
    
    # 如果是positive，标签=1；否则=0  
    label = 1 if best['label'] == 'positive' else 0  
    predicted_labels.append(label)  
```

---

## 五、评估模型效果

### 计算准确率

```python
from sklearn.metrics import classification_report  

# 真实标签  
true_labels = test_data["label"]  

# 打印分类报告  
print(classification_report(true_labels, predicted_labels))  
```

输出示例：

```
              precision    recall  f1-score   support  

   负面评论       0.87      0.97      0.92       533  
   正面评论       0.96      0.86      0.91       533  

    accuracy                         0.91      1066  
```

解读：
- 准确率（accuracy）：91%的评论分类正确
- F1分数：综合考虑准确率和召回率的指标
- 说明这个模型效果不错！

### 分类报告

要理解生成的分类报告，我们首先探讨如何识别正确和错误的预测。
- 根据预测结果是正确（True）还是错误（False）
- 预测的分类是正例（Positive，此处即正面评论）还是负例（Negative，此处即负面评论），
- 有四种组合
	- 我们可以将这些组合用`矩阵形式`表示，通常称为 `混淆矩阵 （confusion matrix）`

![{%}|632](https://www.ituring.com.cn/figures/2025/HandsonLLM/092.jpg)

> 混淆矩阵描述了我们可以做出的四种类型的预测

使用混淆矩阵，我们可以推导出几个评估指标的计算公式来描述模型的质量。  
在上述分类报告中，我们可以看到四个常用的指标： 精确率 、 召回率 、 准确率 和 F1 分数 。
- 精确率 （precision）：衡量模型识别出的结果中有多少是相关的，用来评估相关结果的准确性。
- 召回率 （recall）：指的是所有相关类别中有多少被成功识别出来，用来评估模型找到所有相关结果的能力。
- 准确率 （accuracy）：指的是模型在所有预测中做出正确预测的比例，用来评估模型的整体准确性。
- F1 分数 （F1 score）：平衡了精确率和召回率，用于衡量模型的整体性能。

![{%}|664](https://www.ituring.com.cn/figures/2025/HandsonLLM/093.jpg)

> 分类报告描述了评估模型性能的几个指标

---

## 六、核心要点总结

|概念|通俗解释|技术术语|
|---|---|---|
|特定任务模型|专门做某件事的专家模型|Task-Specific Model|
|pipeline|一键操作的"魔法管道"|Hugging Face Pipeline|
|分词器|把句子切成词元的工具|Tokenizer|
|词元|切分后的文本小块|Token|
|batch_size|一次处理多少条数据|批处理大小|
|冻结|模型参数不改变|Frozen|

---

## 七、特定任务模型的优缺点

### 优点 ✅

1. 开箱即用：下载就能用，不用训练
2. 效果好：专门训练过，性能通常不错
3. 省资源：不需要自己准备训练数据
4. 速度快：直接预测，无需额外步骤

### 缺点 ❌

1. 不够灵活：只能做特定任务（如情感分析）
2. 依赖现有模型：如果找不到合适的模型就没办法
3. 无法定制：不能针对自己的数据优化

---

## 八、完整代码示例（可直接运行）

```python
from transformers import pipeline  
from datasets import load_dataset  
from sklearn.metrics import accuracy_score  

# 1. 加载模型  
pipe = pipeline(  
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",  
    device="cuda:0"  # 如果没有GPU，改成"cpu"  
)  

# 2. 加载数据  
data = load_dataset("rotten_tomatoes")  
test_texts = data["test"]["text"][:10]  # 先测试10条  
test_labels = data["test"]["label"][:10]  

# 3. 预测  
predictions = pipe(test_texts)  

# 4. 转换标签  
pred_labels = []  
for pred in predictions:  
    best = max(pred, key=lambda x: x['score'])  
    pred_labels.append(1 if best['label'] == 'positive' else 0)  

# 5. 计算准确率  
accuracy = accuracy_score(test_labels, pred_labels)  
print(f"准确率: {accuracy:%}")  
```

---

## 九、一句话

> 使用特定任务模型就像请专家帮忙：下载模型 → 输入数据 → 直接得到结果，无需任何训练，简单高效！
