# 示例：通过语音和大模型对话

`#2025/12/23` `#ai` 

> 由 LLM 驱动的“语音输入 -> 状态机处理 -> 外部 API 调用”的闭环架构

## 1. 流程图

![RAG Pipeline with OpenAI-2025-12-23-053211.svg|826](https://832-1310531898.cos.ap-beijing.myqcloud.com/202520251223133221705.svg)

## 2. 核心架构：语音 AI 助理

该项目利用 **Whisper (STT)** + **GPT-3.5 (逻辑大脑)** + **Gradio (UI)** 构建了一个可以理解意图并执行任务（如发邮件）的状态机系统。

### 2.1. A. 语音转文本 (Whisper)

利用 OpenAI 开源的 Whisper 模型，将用户的语音实时解析为字符串。

```Python
import whisper
model = whisper.load_model("base")

def transcribe(file_path):
    return model.transcribe(file_path)["text"]
```

### 2.2. B. 逻辑核心：确定性状态机 (FSM)

不同于普通的对话，这里将 GPT-3.5 作为**状态跳转的发动器**。通过 Prompt 约束模型仅输出特定的“状态词”。

- **状态池 (`prompts`)**:
    - `START`: 意图识别（分类为：写邮件、提问或其他）。
    - `QUESTION`: 判断信息是否足以回答。
    - `WRITE_EMAIL`: 检查要素（收件人、主题、正文）是否齐全。
- **动作池 (`actions`)**: 触发实际业务逻辑（如调用 Gmail API）。

### 2.3. C. 递归处理流程 (`discussion` 函数)

1. **输入**: 用户文本 + 当前 Prompt。
2. **判断**:
    - 若返回的是**新状态**：
        - 递归调用，继续细化意图。
    - 若返回的是**动作(Action)**：
        - 执行代码逻辑（如发送邮件）。
    - 若返回的是**内容**:
        -  直接展示给用户。

---

## 3. 代码实现关键点

### 3.1. 状态定义示例

```json
prompts = {  
	 "START": "Classify intent: WRITE_EMAIL, QUESTION, OTHER? Answer one word.",     
	 "WRITE_EMAIL": "If subject/recipient/message is missing, answer 'MORE'. Else answer 'ACTION_WRITE_EMAIL | ...'." 
}`
```

### 3.2. UI 层 (Gradio)

前端工程师可以将其类比为简单的 HTML `Form` 提交，但输入源是麦克风。

## 4. 工程师视角总结

|**维度**|**说明**|
|---|---|
|**交互模型**|**Speech -> Text -> Intent -> Action -> Text**|
|**相比 Agent 的优势**|成本更低（3.5 即可）、可控性强、流程封闭安全。|
|**核心技巧**|**少样本提示 (Few-shot)**：约束 LLM 只输出状态词，避免其“闲聊”。|
|**前端关注点**|状态机的 `MORE` 状态实际上是在做**多轮会话的数据补全**。|
