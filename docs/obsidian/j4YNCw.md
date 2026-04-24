# LlamaIndex 框架： 几行代码就能实现完整文档检索系统

`#2025/12/25`  

**LlamaIndex 的核心价值**：用最少的代码，实现最专业的文档检索系统。  
如果你的主要需求是 **"让 AI 理解并回答关于文档的问题"**，LlamaIndex 是最佳选择。

## 一、LlamaIndex vs LangChain

### 核心区别

| 特性   | LangChain      | LlamaIndex      |
| ---- | -------------- | --------------- |
| 设计理念 | 围绕"链"（Chain）概念 | `专注于上下文增强（RAG`） |
| 核心优势 | 全能框架，覆盖各类场景    | `数据处理和检索优化`     |
| 代码风格 | 灵活、模块多         | 极简、开箱即用         |
| 适用场景 | 通用 LLM 应用开发    | 企业文档深度检索        |

### LlamaIndex 的核心价值

LlamaIndex 的核心价值：用最少的代码，实现最专业的文档检索系统。

- ✅ 极简代码：通常只需几行代码就能实现完整的 RAG 系统  
- ✅ 专注检索：为文档检索场景深度优化  
- ✅ 默认方案：提供开箱即用的最佳实践配置

> 　LlamaIndex 即使不使用该框架，也值得阅读，以深入了解 RAG 系统

---

## 二、`10 行`代码实现 RAG：

### 安装依赖

```bash
pip install llama-index
```

### 完整代码

```python hl:11,13,21
# ============================================
# LlamaIndex RAG 示例：极简实现
# ============================================

from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

# 加载环境变量（OpenAI API Key）
load_dotenv()

# 1. 加载文档
# ------------------------------------------
# SimpleDirectoryReader 会自动：
#   - 读取 data 文件夹中的所有文件
#   - 支持 PDF、TXT、Markdown 等多种格式
#   - 返回文档列表
documents = SimpleDirectoryReader("data").load_data()

# 2. 创建向量索引
# ------------------------------------------
# from_documents() 自动完成：
#   1. 文档切分
#   2. 生成嵌入向量（默认使用 OpenAI Embedding）
#   3. 构建索引
index = VectorStoreIndex.from_documents(documents)

# 3. 创建查询引擎
# ------------------------------------------
# 查询引擎负责：检索相关文档 + 生成答案
query_engine = index.as_query_engine()

# 4. 执行查询
# ------------------------------------------
response = query_engine.query("What color is Link's outfit?")
print(response)

# 输出：The color of Link's outfit is green.
```

### 与 LangChain 对比

|步骤|LangChain|LlamaIndex|
|---|---|---|
|加载文档|`PyPDFLoader().load_and_split()`|`SimpleDirectoryReader().load_data()`|
|生成嵌入|`OpenAIEmbeddings()`|自动处理|
|创建索引|`FAISS.from_documents()`|`VectorStoreIndex.from_documents()`|
|查询问答|`RetrievalQA.from_llm()`|`index.as_query_engine()`|

LlamaIndex 的优势：更少的代码，更直观的 API

---

## 三、RAG 管道详解：数据加载 → 索引 → 存储 → 查询 → 评估

### RAG 管道的 5 个核心步骤

RAG 设计也被称为 RAG 管道

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/086.jpg)

```
数据加载 → 索引 → 存储 → 查询 → 评估
Loading → Indexing → Storing → Querying → Evaluating
```

### 1. 数据加载（Loading）

功能：从多种数据源摄取数据，并支持多种数据源和格式（API、PDF、文档、SQL 等

```python
# 本地文件
from llama_index.core import SimpleDirectoryReader
documents = SimpleDirectoryReader("data").load_data()

# 网页
from llama_index.readers.web import SimpleWebPageReader
documents = SimpleWebPageReader().load_data(["https://example.com"])

# 数据库
from llama_index.readers.database import DatabaseReader
documents = DatabaseReader().load_data("SELECT * FROM articles")
```

支持的数据源：API、PDF、Word、`SQL`、Notion、Google Docs 等

---

### 2. 索引（Indexing）

功能：创建向量嵌入 + 元数据

```python
# 自动生成向量嵌入
index = VectorStoreIndex.from_documents(documents)

# 等价于：
# 1. 文档切分成小块（chunking）
# 2. 每块生成向量表示（embedding）
# 3. 构建索引结构
```

---

### 3. 存储（Storing）

功能：持久化嵌入向量，支持增量更新，LlamaIndex 提供多种存储解决方案。

```python hl:1,4
# 保存索引到磁盘
index.storage_context.persist(persist_dir="./storage")

# 从磁盘加载索引
from llama_index.core import StorageContext, load_index_from_storage
storage_context = StorageContext.from_defaults(persist_dir="./storage")
index = load_index_from_storage(storage_context)
```

---

### 4. 查询（Querying）

功能：检索相关上下文 + 生成答案

支持复杂查询策略，如子问题查询（subqueries）、多步查询（multistep queries）、混合搜索等。

```python
# 基础查询
query_engine = index.as_query_engine()
response = query_engine.query("问题")

# 高级查询策略
# 1. 子问题查询：拆解复杂问题
# 2. 多步查询：迭代优化检索
# 3. 混合搜索：向量搜索 + 关键词搜索
```

---

### 5. 评估（Evaluating）

功能：优化 RAG 性能

- 评估检索质量（Retrieval Metrics）
- 评估回答准确性（Answer Quality）
- 迭代优化参数

---

## 四、模块化设计

![{%}|456](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/087.jpg)

LlamaIndex 的模块化架构：

```
┌─────────────────────────────────────────┐
│         LlamaIndex 核心模块              │
├─────────────────────────────────────────┤
│ 📄 Data Loaders  │ 加载各种数据源        │
│ 🔍 Embeddings    │ 文本向量化           │
│ 💾 Vector Stores │ 向量数据库集成       │
│ 🤖 LLMs           │ 大语言模型集成       │
│ 🔧 Query Engines │ 查询与检索策略       │
│ 📊 Evaluators    │ 性能评估工具         │
└─────────────────────────────────────────┘
```

所有模块都可以自定义和扩展

---

## 五、定制化示例

### 示例 1：更改 LLM 和嵌入模型

```python hl:5
from llama_index.core.settings import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

# 全局配置：使用 GPT-4 和 OpenAI Embedding
Settings.llm = OpenAI(model="gpt-4")
Settings.embed_model = OpenAIEmbedding()

# 之后创建的所有索引都会使用这些配置
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
```

---

### 示例 2：使用 Weaviate 向量数据库

```python hl:1,12,16,24,30
import weaviate
from dotenv import load_dotenv
from llama_index.core import (
    SimpleDirectoryReader, 
    StorageContext, 
    VectorStoreIndex
)
from llama_index.vector_stores.weaviate import WeaviateVectorStore

load_dotenv()

# 1. 连接 Weaviate（本地 Docker）
# ------------------------------------------
client = weaviate.Client(url="http://localhost:8080")

# 2. 创建 Weaviate 向量存储
# ------------------------------------------
vector_store = WeaviateVectorStore(
    weaviate_client=client, 
    index_name="BlogPost",      # 索引名称
    text_key="content"          # 文本字段名
)

# 3. 构建存储上下文
# ------------------------------------------
storage_context = StorageContext.from_defaults(
    vector_store=vector_store
)

# 4. 加载文档并创建索引
# ------------------------------------------
documents = SimpleDirectoryReader("files").load_data()
index = VectorStoreIndex.from_documents(
    documents, 
    storage_context=storage_context
)

# 5. 查询（与默认方式完全相同）
# ------------------------------------------
query_engine = index.as_query_engine()
response = query_engine.query("What color is Link's outfit?")
print(response)
```

> 关键点：只需更改存储上下文，查询方式保持不变

---

## 六、核心理念总结

### 1. `默认`即最佳实践

- 不指定 LLM？默认使用 OpenAI GPT-3.5
- 不指定 Embedding？默认使用 OpenAI Embedding
- 不指定`向量库`？默认使用`内存索引`

### 2. 几乎所有内容都可定制

- LLM：GPT-4、Claude、Llama、本地模型
- Embedding：OpenAI、Cohere、HuggingFace
- 向量存储：Weaviate、Pinecone、Chroma、Faiss
- 加载器：`200+ 数据源连接器`

### 3. 简洁的 API 设计

```python hl:1
# 3 步完成 RAG
documents = SimpleDirectoryReader("data").load_data()
index = VectorStoreIndex.from_documents(documents)
response = index.as_query_engine().query("问题")
```

---

## 七、LlamaHub 资源中心

访问 [LlamaHub](https://llamahub.ai/) 获取：

- 📦 数据加载器：
	- `200+ 集成`（Google Drive、`Notion`、Slack...）
- 🗄️ 向量存储：
	- Pinecone、Weaviate、Qdrant...
- 🤖 LLM 集成：
	- OpenAI、Anthropic、HuggingFace...
- 🔧 工具和智能体：
	- 预构建的 AI 工具

---

## 八、其他推荐工具

### LLM 开发生态

| 工具          | 用途                     |
| ----------- | ---------------------- |
| Langfuse    | LLM 可观测性（类似 LangSmith） |
| Spring AI   | Java 生态的 `LLM 框架`      |
| LangChain4j | `Java 版 LangChain`     |

### 选择建议

- 快速原型 + `文档检索`：LlamaIndex ⭐
- 复杂应用 + 多样化需求：LangChain
- 可观测性监控：`Langfuse` + LangSmith
- Java 开发：
	- Spring AI / LangChain4j

---

> Python 是 AI/ML 的主流语言，但 OpenAI 是 API 服务，任何语言都可以调用，根据团队技术栈选择合适的框架

---

## 十、快速对比表

### 何时选择 LlamaIndex？

✅ 主要做文档检索问答（RAG）  
✅ 需要快速搭建原型  
✅ 团队对 AI 不太熟悉，需要开箱即用  
✅ 企业知识库、技术文档助手

### 何时选择 LangChain？

✅ 需要构建`复杂的 Agent 系统`  
✅ 需要精细控制每个环节  
✅ 多样化的应用场景（不只是检索）  
✅ 需要丰富的工具生态
