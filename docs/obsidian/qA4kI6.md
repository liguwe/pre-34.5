# 电影评论的情感分析

`#2025/12/30` `#ai` 

> 这一节要做的事情很简单：`用计算机判断一条电影评论是"好评"还是"差评"`

---

## 一、任务目标：给评论打标签

想象你是`豆瓣或烂番茄`的产品经理，每天有成`千上万条影评`，你想：
- 自动统计有多少好评、多少差评
- 把差评推送给客服部门处理
- 分析哪些电影最受欢迎

手动一条条看？ 累死人！  
让计算机自动分类？ 这就是我们要做的——`情感分析（Sentiment Analysis）`。

如下所示，输入一条评论，模型输出"正面"或"负面"：

```
输入："Best movie ever!"（史上最佳电影！）  
     ↓  
  [模型]  
     ↓  
输出：正面（标签=1）  
```

## 二、数据从哪来？用烂番茄数据集

本章用的是 `rotten_tomatoes（烂番茄）`数据集，可以从 Hugging Face 直接下载。

### 数据集长什么样？

一共有 10,662 条电影评论，分成三部分：

- 训练集：
	- 8,530 条（用来教模型学习）
	- 使用`训练集`来训练模型
- 测试集：
	- 1,066 条（用来检验模型效果）
	- 使用`测试集`来验证结果
- 验证集：
	- 1,066 条（可选，用来调参数）
	- 如果你使用训练集和测试集进行超参数调优
		- 那么附加的`验证集`可以用来进一步验证模型的泛化能力

每条评论包含两个字段：

1. text：评论文字
2. label：标签（0=负面，1=正面）

---

## 三、加载数据：3行代码搞定

用 Python 的 `datasets` 库（这个库会贯穿全书）：

```python
from datasets import load_dataset  

# 下载并加载数据  
data = load_dataset("rotten_tomatoes")  
data  
```

输出：

```python
DatasetDict({  
	# 训练集
    train: Dataset({  
        features: ['text', 'label'],  
        num_rows: 8530  
    })  
    # 验证集
    test: Dataset({  
        features: ['text', 'label'],  
        num_rows: 1066  
    })  
    # 测试集
    validation: Dataset({  
        features: ['text', 'label'],  
        num_rows: 1066  
    })  
})  
```

## 四、看看数据长啥样

取出第一条和最后一条评论看看：

```python
data["train"][0, -1]  
```

输出：

```python
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

解读：

- 第一条：
	- 夸赞巨石强森的评论 → 正面（label=1）
- 第二条：
	- 吐槽电影"徒有其表" → 负面（label=0）

>  这些简短的评论被标记为正例（1）或负例（0）。这意味着我们将专注于二元情感分类。

---

## 五、任务拆解：两种思路

要让计算机自动分类评论，有两大类方法（全书都围绕这两类展开）：

### 方法1：表示模型（Representation Model）

- 核心思想：
	- 把文字变成数字向量（嵌入向量），再用分类器判断
- 代表：
	- BERT、DistilBERT 等
- 特点：
	- 不会"说人话"，只会输出分类结果（0或1）

### 方法2：生成模型（Generative Model）

- 核心思想：
	- 直接问模型"这是好评还是差评？"，它回答"positive"或"negative"
- 代表：
	- GPT-3.5、T5 等
- 特点：
	- 会"对话"，输出完整句子

对比图：

```
表示模型：  
输入文本 → 模型 → 输出数字类别（0或1）  

生成模型：  
输入文本 + 提示词 → 模型 → 输出文字（"positive"/"negative"）  
```

---

## 六、为什么选这个数据集？

1. 大小适中：1万多条数据，既不少（模型能学到东西），也不多（不需要超级计算机）
2. 标签平衡：正面和负面各占一半（5,331条），避免模型偏向某一类
3. 真实场景：来自烂番茄真实用户评论，不是实验室编的假数据

---

## 七、接下来要干嘛？

从 4.2 节开始，我们会分别尝试：

1. 用特定任务模型（已经训练好的情感分析专用模型）直接分类
2. 用嵌入模型（通用的文本表示模型）+ 传统分类器（如逻辑回归）
3. 用生成模型（如 GPT）通过提示词让它分类

每种方法都有优缺点，我们会一一实践对比！

---

## 八、核心要点总结

|概念|通俗解释|技术术语|
|---|---|---|
|情感分析|判断一句话是好话还是坏话|Sentiment Analysis|
|二元分类|只分两类（好/坏、正/负）|Binary Classification|
|标签|正面=1，负面=0|Label|
|训练集|给模型学习用的例子|Training Set|
|测试集|检验模型学得怎么样|Test Set|

---

## 九、这一节干了啥？

> 下载了烂番茄的1万条影评数据，每条评论标注了"好评"或"差评"，接下来我们要教计算机自动判断新评论属于哪一类。
