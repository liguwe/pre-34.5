# 利用嵌入向量的分类任务

`#2025/12/30` `#ai` 

> 的核心问题是：当找不到专门的分类模型时，如何用通用`嵌入模型`来完成分类任务？

---

## 一、为什么？

在上一节 [4. 使用特定任务模型](/B2H6hR) 我们用了"专家模型"直接分类，但现实中会遇到两个问题：

- 找不到专门的模型：
	- 可能没人训练过"电影评论情感分析"专用模型
- 计算资源有限：
	- 自己微调一个完整的大模型太贵、太耗时
- 解决方案： 
	- 把任务拆成`两步`
		- 先用通用`嵌入模型提取特征`
		- 再用`轻量级分类器`判断。

---

## 二、核心思路：两步法

### 完整流程图

```
① 步骤1：特征提取   
输入评论 → 嵌入模型（冻结） → 768维向量  

② 步骤2：分类判断  
768维向量 → 分类器（可训练） → 输出类别（0或1）  
```

![{%}|608](https://www.ituring.com.cn/figures/2025/HandsonLLM/094.jpg)

>  `特征提取步骤`和`分类步骤`是分离的

关键优势：
- 嵌入模型保持冻结（不需要训练，省资源）
- 只训练轻量级分类器（在CPU上几秒钟就能完成）

---

## 三、方法1：`有标注数据`的`监督分类`

### 3.1 步骤1：用嵌入模型提取特征

![{%}|488](https://www.ituring.com.cn/figures/2025/HandsonLLM/095.jpg)

在第一步中，我们使用`嵌入模型`提取特征并将输入文本转换为嵌入向量

我们可以使用 `sentence-transformers` 这个流行的包来`调用预训练的嵌入模型`

```python
from sentence_transformers import SentenceTransformer  

# 1. 加载嵌入模型（通用型，不是专门做分类的）  
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")  

# 2. 把所有评论转换成768维向量  
train_embeddings = model.encode(data["train"]["text"])  
test_embeddings = model.encode(data["test"]["text"])  

# 3. 查看向量维度  
train_embeddings.shape  
# 输出：(8530, 768) ← 8530条评论，每条768个数字  
# 这表明 8530 个输入文档中的每一个文档都有一个 768 维的嵌入向量，因此每个嵌入向量包含 768 个数值。
```

- 这 `768个数字`代表什么？  
	- 它们是评论的"`数字指纹`"，包含了句子的语义信息。
- 形象理解：  
	- 就像把每条评论"翻译"成一串数字，语义相似的评论会有相似的数字组合。

---

### 3.2 步骤2：训练分类器

在第二步中，这些`嵌入向量`将作为`分类器`的输入特征，

如图下图所示。分类器是可训练的，不限于逻辑回归，可以采用任何形式，只要它能执行分类任务即可。

![{%}|542](https://www.ituring.com.cn/figures/2025/HandsonLLM/096.jpg)

> 使用`嵌入向量`作为特征，在训练数据上训练`逻辑回归模型`

训练过程只需要使用生成的嵌入向量和对应的标签：

```python
from sklearn.linear_model import LogisticRegression  

# 基于嵌入向量训练逻辑回归  
# 基于训练嵌入向量构建逻辑回归模型
clf = LogisticRegression(random_state=42)  
clf.fit(train_embeddings, data["train"]["label"])  

# 预测测试集
y_pred = clf.predict(test_embeddings)  
```

> 还记得训练的数据是什么吗？类似于下面：

```json
# data["train"][0, -1]  
 {  
  'text': [
      // 第 1 条
     'the rock is destined to be the 21st century\'s new "conan" and that he\'s going to make a splash even greater than arnold schwarzenegger, jean-claud van damme or steven segal.',  
     
     // 第 2 条
    'things really get weird, though not particularly scary: the movie is all portent and no content.'  
  ],  
  'label': [1, 0]  # 第一条是正面（1），第二条是负面（0）  
} 

```

为什么用逻辑回归？
- 简单、快速、效果不错
- 可以在普通CPU上训练（不需要GPU）

---

### 3.3 评估效果

```python
from sklearn.metrics import classification_report  

print(classification_report(data["test"]["label"], y_pred))  
```

输出示例：

```
                    precision  recall  f1-score   support  
Negative review       0.85      0.86      0.85       533  
Positive review       0.86      0.85      0.85       533  

    accuracy                           0.85      1066  
```

解读： F1 分数达到 0.85，效果相当不错！

---

## 四、方法2：

>  一句话总结：用"计算相似度"代替"训练模型"，让机器自己判断文本属于哪个类别

### 4.1 问题场景

收集标注数据很贵（需要人工标注成千上万条评论）。

能不能不用标注数据？ 可以！`用零样本分类`。

---

### 4.2 核心思路：用标签描述代替标注数据

```
不需要标注的8530条训练数据  
只需要给两个标签写描述！  

标签0（负面）→ "A negative movie review"  
标签1（正面）→ "A positive movie review"  
```

![{%}|528](https://www.ituring.com.cn/figures/2025/HandsonLLM/098.jpg)

> 要嵌入标签，我们首先需要给它们一个描述，比如“一条负面影评”，然后可以通过 sentence-transformers 生成嵌入向量

原理：  

如果评论的向量和"正面评论描述"的向量更接近，就判断为正面。

---

### 4.3 完整代码

```python
from sentence_transformers import SentenceTransformer  
from sklearn.metrics.pairwise import cosine_similarity  
import numpy as np  

# 1. 加载嵌入模型  
model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")  

# 2. 为标签写描述并生成向量  
label_descriptions = [  
    "A negative movie review",  # 负面评论的描述  
    "A positive movie review"   # 正面评论的描述  
]  
label_embeddings = model.encode(label_descriptions)  

# 3. 为测试评论生成向量  
test_embeddings = model.encode(data["test"]["text"])  

# 4. 计算相似度，选最像的标签  
similarities = cosine_similarity(test_embeddings, label_embeddings)  
y_pred = np.argmax(similarities, axis=1)  # 选分数最高的标签  
```

因为模型 `"sentence-transformers/all-mpnet-base-v2"` 已经"理解"了"正面评论"和"Best movie ever!"的语义是接近的

它训练时，就见过了海量数据，预训练过程让模型的`768维`向量**有意义** ，`有语义`

### 4.4 相似度计算详解

余弦相似度是什么？ 这个知识点忘了，可参考 [6. 余弦相似度如何衡量高维向量的接近度](/Z3yYcp)

衡量两个向量方向的接近程度，值在`-1`到`1`之间：

- 1：完全相同方向（非常相似）
- 0：垂直（不相关）
- -1：完全相反方向（完全不同）

可视化理解：

```
向量空间中的位置：  

"Best movie ever!" ──────► [向量1]  
                          ↓ 夹角小（相似度高）  
"A positive review" ─────► [向量2]  

"Best movie ever!" ──────► [向量1]  
                          ↓ 夹角大（相似度低）  
"A negative review" ─────► [向量3]  
```

![{%}|528](https://www.ituring.com.cn/figures/2025/HandsonLLM/099.jpg)

>  余弦相似度是两个嵌入向量夹角的余弦值。在这个例子中，我们计算`一个文档`与`两个候选标签`（正例和负例）之间的`余弦相似度`

### 4.5 效果如何？

测试结果： F1分数=0.78

虽然比`监督学习`稍差（0.85），但完全不需要标注数据！

![{%}](https://www.ituring.com.cn/figures/2025/HandsonLLM/100.jpg)

> 在为标签描述和文档分别创建嵌入向量之后，计算每个标签 - 文档对的余弦相似度

---

## 五、优化技巧：改进标签描述

原始描述：

```python
"A negative review"  
"A positive review"  
```

优化后描述：

```python
"A very negative movie review"  # 更具体  
"A very positive movie review"  # 强调极端性  
```

效果： 更精确的描述能提升分类准确率！

---

## 六、两种方法对比

| 对比项     | 监督分类      | 零样本分类   |
| ------- | --------- | ------- |
| 需要标注数据？ | 需要（8530条） | 不需要     |
| 准确率     | F1=0.85   | F1=0.78 |
| 训练时间    | 几秒钟（CPU）  | 无需训练    |
| 灵活性     | 需要重新训练    | 改描述即可   |
| 适用场景    | 有标注数据     | 快速验证想法  |

## 七、完整对比：三种分类方法

|方法|需要的资源|效果|适用场景|
|---|---|---|---|
|特定任务模型（4.4节）|现成模型|最好（F1≈0.91）|有现成模型|
|嵌入模型+分类器|标注数据+CPU|很好（F1=0.85）|有标注数据但没GPU|
|零样本分类|只需要标签描述|还行（F1=0.78）|没有标注数据|

## 八、为什么选嵌入模型而不是其他方法？

`嵌入模型`的独特优势：
1. 通用性强：不仅能分类，还能做搜索、聚类等任务
2. 省资源：完全在CPU上运行，不需要GPU
3. 灵活：换个分类器就能适配新任务

示例应用：
- 今天用于情感分析（分类任务）
- 明天用于相似评论查找（搜索任务）
- 后天用于评论主题聚类（聚类任务）

完全不需要重新训练嵌入模型！

---

## 九、核心要点总结

|概念|通俗解释|关键词|
|---|---|---|
|嵌入模型|把文本变成数字向量的通用工具|768维向量|
|特征提取|把评论"翻译"成数字|保持冻结|
|监督分类|用标注数据训练分类器|F1=0.85|
|零样本分类|不用标注数据的分类方法|相似度计算|
|余弦相似度|衡量向量方向的接近程度|-1到1|

## 十、一句话总结

嵌入模型做分类有两种方式：
1. 有标注数据：嵌入向量 + 分类器（F1=0.85）
2. 没有标注数据：用标签描述计算相似度（F1=0.78）

虽然效果比专用模型稍差，但超级灵活，而且可以在CPU上完成！

---

实战建议：

1. 先试零样本分类（快速验证想法）
2. 如果效果不够，收集少量标注数据（几百条）
3. 训练分类器，通常就能达到不错的效果
4. 如果还不够，再考虑用专用模型或微调（见第11章）
