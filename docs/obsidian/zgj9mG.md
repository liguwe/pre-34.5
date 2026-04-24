# 工具、插件与智能体： GPT-4 Plugins、GPTs、Assistants API

`#ai` `#2025/12/25`

>  从 GPT-4 Plugins，到如今的 GPTs 与 Assistants API ，其他厂商呢？

## 一、 核心三杰：OpenAI 能力封装演进史

> 为了方便理解，我们可以将这三者类比为电脑软件的不同形态

### 1. GPT-4 Plugins：过时的“浏览器插件”

- 状态：
	- 已废弃 (Deprecated)。
- 本质：
	- 它是 OpenAI 早期的尝试，旨在让 ChatGPT 能够调用第三方 Web API（如`查航班、定外卖`）。
- 现状：
	- 由于开发门槛高且体验割裂，它已被 `GPT Actions` 完整取代。
- 金句总结：
	- 它是 AI 连接外部世界的 “`初稿`”。

### 2. GPTs：面向大众的“无代码定制 App”

- 本质：
	- 在 ChatGPT 网页端内，通过`对话就能配置出来`的专属版 ChatGPT。
- 核心组件：
    - 指令 (Instructions)：
        - 预设角色和任务
            - （如：`你是一个专业翻译`）
    - 知识库 (Knowledge)：
        - 上传 PDF/文档，AI `自动进行 RAG`（检索增强生成）
    - 能力 (Capabilities)：
        - 开启联网、DALL-E 绘图、代码解释器
    - 行动 (Actions)：
        - 原插件能力的升级版，允许 AI 调用你定义的 API。
- 局限：
	- 只能在 ChatGPT 网页/App 内使用，无法集成到你自己的产品中。
- 金句总结：
	- `GPTs = 指令 + 私有文件 + 外部工具`，它是人人皆可上手的“傻瓜式智能体”。

### 3. Assistants API：面向开发者的“智能助手后端”

- 本质：BaaS
	- 一套完整的后端服务接口（Backend-as-a-Service）。
- 痛点解决：
    - 状态管理 (Threads)：
        - 传统 API 是无状态的，开发者要自己存数据库。Assistants API 帮你在云端管理聊天历史。
    - 工具集成：
        - 原生支持代码解释器（跑 Python）、文件检索、函数调用（Function Calling）。
- 适用场景：
	- 在你的自有网站、App 中嵌入一个具备专业知识的 AI 客服或助理。
- 金句总结：
	- Assistants API = 开发者版的 GPTs，它是有状态、可编程的 AI 后端。

---

## 二、 核心差异一览表

|特性|GPTs|Assistants API|
|---|---|---|
|目标人群|普通用户、产品运营|程序员、企业开发者|
|创建方式|可视化界面点选 / 自然语言对话|编写代码调用 API|
|状态维护|官方处理，用户无感|自动管理 Threads（对话线程）|
|使用限制|仅限 ChatGPT 平台|可嵌入任何自有应用、网站|
|灵活性|低（受限于平台框架）|极高（可自由组合业务逻辑）|

## 三、 全球大模型对标方案

### 1. 国内领跑者：字节跳动 (Coze/扣子)

- 对应方案：Coze（对标 `GPTs`）+ Coze API。
- 独特优势：
	- 它是目前全球最强的 GPTs 竞品。相比 OpenAI，它的`工作流编排能力极强`，且支持一键发布到微信、飞书、甚至通过 API 嵌入，打破了“只能在自家平台用”的限制。

### 2. 工程化之王：Google (Gemini)

- 对应方案：
	- Gems（对标 GPTs）+ Vertex AI Agent Builder。
- 独特优势：
	- 拥有 1M 甚至 2M 的超长上下文窗，在处理海量文档时，不需要频繁做 RAG 检索，直接全读进去。

### 3. 极客首选：Anthropic (Claude)

- 对应方案：Projects（对标 GPTs）+ Tool Use API + MCP 。
- 独特优势：
	- Claude 3.5 Sonnet 的逻辑推理和编程能力目前公认第一。
	- 其 `Artifacts` 功能让代码执行和 UI 预览体验远超 OpenAI。

---

## 四、 快速决策：你该怎么选？

- 场景 A： 我想给公司做一个内部用的“PPT 润色助手”，不涉及隐私，图个省事。  
    👉 选 GPTs。
- 场景 B： 我在做一个电商 App，要在 App 里加一个能查订单、能推产品的“智能导购”。  
    👉 选 Assistants API。
- 场景 C： 我想做一个复杂的工作流（比如抓取新闻、总结、发邮件），且希望发到微信上用。  
    👉 选 字节扣子 (Coze)。
- 场景 D： 这里的方案我都不满意，我要自己掌控一切，且支持多模型切换。  
    👉 选开源框架 `Dify` 或 `LangChain/LangGraph`。

## 一句话总结

- GPTs 让你在别人的地盘快速“捏人”；
- Assistants API 让你在自己的地盘打造“灵魂助手”；
- 而 Coze 等国产工具 正在尝试模糊这两者的界限。
