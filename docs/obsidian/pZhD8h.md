# 文本聚类的通用流程

`#2025/12/30` `#ai` 

## 为什么要做文本聚类？

想象你有成千上万篇论文或文章，手动阅读分类根本不现实。  
**文本聚类就像一个智能助手**，能自动把相似的文档归到一起，帮你：
- 快速理解数据的结构和模式
- 发现隐藏的主题和趋势
- 评估分类任务的复杂度

## 核心三步

当前最流行的文本聚类方法可以分为 **三个连续的步骤**，每步用一种算法：

```
原始文本 → ① 步骤1:嵌入模型 → ② 步骤2:降维 → ③ 步骤3:聚类 → 结果  
```

- ① 将`输入的文档`转换为`嵌入向量`
- ② 将`嵌入向量`降至`更低维度空间`
- ③ 使用 **聚类模型** （cluster model）对降维后的嵌入向量进行聚类

## 步骤1：嵌入文档（把文字变成数字）

### 要解决什么问题？

计算机不认识文字，需要把文本转换成**数字向量**（一串数字）。

![{%}|552](https://www.ituring.com.cn/figures/2025/HandsonLLM/110.jpg)

> **图：第一步，使用嵌入模型将输入文档转换为嵌入向量**

### 怎么做？

使用**嵌入模型**（Embedding Model）把每篇文档转换成一个向量。

**代码示例**：

```python
from sentence_transformers import SentenceTransformer  

# 加载嵌入模型  
embedding_model = SentenceTransformer("thenlper/gte-small")  

# 把所有摘要转成向量  
embeddings = embedding_model.encode(abstracts, show_progress_bar=True)  

# 查看结果维度  
# 检查生成的嵌入向量的维度
print(embeddings.shape)  # 输出：(44949, 384)  
```

**结果解读**：
- 每篇文档变成了**384个数字**组成的向量
- 这384个数字共同描述了文档的**语义含义**

**为什么这样做？**

- 语义相似的文档，它们的向量在空间中会**靠得很近**
- 这为后续聚类打下基础

**模型选择建议**：  
- 选择专门为**语义相似度任务**优化的模型
	- 如从MTEB排行榜选择

## 步骤2：降维（压缩数据）

### 要解决什么问题？

384维太高了！高维数据存在"**维度灾难**"问题：
- 计算复杂度呈指数级增长
- 聚类算法难以找到有意义的模式

> 其实`时间复杂度`和`空间复杂度`都很高

### 怎么做？ → 降维技术 

![{%}|536](https://www.ituring.com.cn/figures/2025/HandsonLLM/111.jpg)

> **图 ：降维是将高维空间中的数据压缩为低维表示**

使用**降维算法**（如UMAP）把384维压缩到5维或更低。

**代码示例**：

```python
from umap import UMAP  

# 将384维降到5维  
umap_model = UMAP(  
    n_components=5,        # 降到5维  
    min_dist=0.0,          # 让簇更紧密  
    metric="cosine",       # 使用余弦距离  
    random_state=42  
)  
reduced_embeddings = umap_model.fit_transform(embeddings)  
```

>  统一流形逼近和投影（Uniform Manifold Approximation and Projection，UMAP） 是一种`降维技术` ，另外还有 主成分分析（Principal Component Analysis，PCA 

![{%}|536](https://www.ituring.com.cn/figures/2025/HandsonLLM/112.jpg)

> **图 ：第二步，通过降维将嵌入向量降至更低维度空间**

**类比理解**：  

就像把一个`3D物体`拍成`2D照片`——丢失了一些信息，但保留了主要特征。

> [!info]  
**重要提醒**：  
降维会`损失信息`，结果只是**近似表示**，但对聚类效果提升很大。

**参数说明**：

- `n_components`: 5-10之间通常效果最好
- `metric="cosine"`: 因为高维数据用欧氏距离效果不好

---

## 步骤3：聚类（分组）

### 要解决什么问题？

现在数据是`5 维`的了，需要把相似的文档分到同一组。

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/113.jpg)

> **图：第三步，使用降维后的嵌入向量进行文档聚类**

### 两种主流算法对比

|特性|基于质心（如K-means）|基于密度（如HDBSCAN）|
|---|---|---|
|**簇数量**|需要预先指定|自动计算|
|**离群点**|强制分配到某个簇|可以标记为离群点|
|**形状**|偏好球形簇|可以识别任意形状|  
如下图：

![{%}|528](https://www.ituring.com.cn/figures/2025/HandsonLLM/114.jpg)

**图：聚类算法不仅影响簇的生成方式，还影响簇的呈现方式**

**推荐方案**：`HDBSCAN（基于密度）`

### 为什么选HDBSCAN？

1. **不需要预设簇数量**——你事先不知道有多少个主题
2. **能检测离群点**——ArXiv 数据中有很多小众论文
3. **处理非球形簇**——真实数据很少是完美球形

**代码示例**：

```python
from hdbscan import HDBSCAN  

# 训练聚类模型  
hdbscan_model = HDBSCAN(  
    min_cluster_size=50,               # 一个簇最少50篇文档  
    metric="euclidean",                # 距离度量  
    cluster_selection_method="eom"  
).fit(reduced_embeddings)  

# 提取簇标签  
clusters = hdbscan_model.labels_  

# 生成了多少个簇？  
print(len(set(clusters)))  # 输出：156个簇  
```

**结果解读**：

- 标签 `-1` 表示离群点（未被分到任何簇）
- 其他数字（0, 1, 2...）代表不同的`簇`

## 步骤4：检查结果（人工验证）

### 方法1：手动查看文档

```python
import numpy as np  

# 查看簇0中的前3篇文档  
cluster = 0  
for index in np.where(clusters==cluster)[0][:3]:  
    print(abstracts[index][:300] + "...\n")  
```

**实际案例**：  

`簇0`的文档都关于"手语翻译"——证明聚类成功！

### 方法2：可视化

```python
import pandas as pd  
import matplotlib.pyplot as plt  
from umap import UMAP  

# 降到2维用于可视化  
reduced_2d = UMAP(n_components=2, min_dist=0.0,   
                  metric="cosine", random_state=42).fit_transform(embeddings)  

# 创建数据框  
df = pd.DataFrame(reduced_2d, columns=["x", "y"])  
df["cluster"] = [str(c) for c in clusters]  

# 分离簇和离群点  
clusters_df = df.loc[df.cluster != "-1", :]  
outliers_df = df.loc[df.cluster == "-1", :]  

# 绘图  
plt.scatter(outliers_df.x, outliers_df.y, alpha=0.05, s=2, c="grey")  
plt.scatter(clusters_df.x, clusters_df.y,   
            c=clusters_df.cluster.astype(int),   
            alpha=0.6, s=2, cmap="tab20b")  
plt.axis("off")  
plt.show()  
```

**注意**：颜色相同的点属于同一簇。

![{%}|600](https://www.ituring.com.cn/figures/2025/HandsonLLM/115.jpg)

> **图 ：生成的簇（彩色）和离群点（灰色）以二维可视化方式表示**

---

## 完整流程代码示例

```python
# 第1步：嵌入  
from sentence_transformers import SentenceTransformer  
embedding_model = SentenceTransformer("thenlper/gte-small")  
embeddings = embedding_model.encode(abstracts)  

# 第2步：降维  
from umap import UMAP  
reduced_embeddings = UMAP(n_components=5, min_dist=0.0,   
                          metric="cosine").fit_transform(embeddings)  

# 第3步：聚类  
from hdbscan import HDBSCAN  
clusters = HDBSCAN(min_cluster_size=50).fit(reduced_embeddings).labels_  

# 第4步：查看结果  
print(f"生成了 {len(set(clusters))} 个簇")  
```



## 关键要点总结

|步骤|工具|输入|输出|核心作用|
|---|---|---|---|---|
|1. 嵌入|SentenceTransformer|文本|384维向量|把文字变成数字|
|2. 降维|UMAP|384维|5维|降低计算复杂度|
|3. 聚类|HDBSCAN|5维|簇标签|分组相似文档|

**核心理念**：  
- 这个流程的精髓在于**组合经典方法与现代技术**
	- 不是发明全新算法，而是巧妙地把现有工具串联起来，产生强大的效果！

**实际应用价值**：
- 探索未知数据集
- 发现隐藏模式
- 加速数据标注
- 检测离群点和错误数据
