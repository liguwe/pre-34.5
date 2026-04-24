# 深入了解 OpenAI API

`#2025/07/30` `#大模型开发`  `#大模型应用开发极简入门`

## 1. 基本概念：prompt 、 token

- `提示词`
	- 就是发送给模型的输入文本，用于指示模型执行特定任务
- `词元（token）`
	- 是单词或单词的一部分，100 个`词元`约等于 `75 个英文单词`。调用 OpenAI 模型的请求是基于`词元`数量收费的

![{%}|472](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/017.jpg)

## 2. 入门：OpenAI Python 库

### 2.1. OpenAI 服务访问与 API 密钥

在 API keys 页面中，单击 Create new secret key（创建新密钥），写到环境变量中

```bash
# 打开~/.zshrc
zed ~/.zshrc
# 为当前会话设置环境变量 OPENAI_API_KEY
export OPENAI_API_KEY=sk-(...)
# 确认环境变量已设置
echo $OPENAI_API_KEY
```

> 请注意，切勿将这些命令行代码推送到公共代码库中。

### 2.2. Hello World

python 环境准备

```bash
# 安装 pyenv
brew install pyenv

# 查看可安装的版本
pyenv install --list

# 安装特定版本
pyenv install 3.11.5

# 设置全局默认版本
pyenv global 3.11.5

# 设置项目本地版本
pyenv local 3.11.5
```

使用以下命令通过 pip 安装 Python 库：

```cmake hl:4
pip3 install openai

# 本地需要开启翻墙代理，所以需要安装
pip3 install "httpx[socks]"
```

接下来，在 Python 中访问 OpenAI API：

```python
from openai import OpenAI
client = OpenAI()

# 使用 gpt-3.5-turbo 模型调用 OpenAI 的 chat.completions 端点
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        { "role": "user", 
          "content": "Hello World!"
        }
    ]
)
# 输出响应内容
print(response.choices[0].message.content)
```

现在你的脚本可以正常运行了，但是遇到了 API 配额限制

```python
 Error code: 429 - {'error': {'message': 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.', 'type': 'insufficient_quota', 'param': None, 'code': 'insufficient_quota'}}
```

你将看到以下输出：

>  所以，需要找到合适的 ak 

```
Hello there! How may I assist you today?
```

## 3. 秘钥本地管理

前面的代码片段没有明确提供 `OpenAI API 密钥`。这是因为 OpenAI 库会自动查找名为 `OPENAI_API_KEY` 的环境变量。

你也可以手动在代码中设置 API 密钥，如下所示：

```bash
# 加载 API 密钥
openai.api_key = os.getenv("OPENAI_API_KEY")
```

我们建议遵循常见的环境变量约定，将密钥存储在`.env` 文件中，并确保该文件被列入`.gitignore`，从而避免其被提交到版本控制系统中。

在 Python 中，你可以使用 `load_dotenv` 函数加载`.env 文件`并导入 OpenAI 库：

```python
from dotenv import load_dotenv
load_dotenv()
from openai import OpenAI
```

加载`.env` 文件后，不要忘记 OpenAI 库的导入语句，否则 OpenAI 设置将无法正确应用。

> 　dotenv 包不是标准 Python 库的一部分，因此你需要使用 `pip install python-dotenv` 命令安装。

## 4. 使用聊天补全模型

### 4.1. 示例

```python hl:9,10,11,15,19
from openai import OpenAI
client = OpenAI()

# 对于 GPT-3.5 Turbo，使用的端点是 chat.completions
client.chat.completions.create(
    # 对于 GPT-3.5 Turbo，模型名称是"gpt-3.5-turbo"
    model="gpt-3.5-turbo",
    # 对话以消息列表的形式传递
    messages=[
        {"role": "system", "content": "You are a helpful teacher."},
        {
            "role": "user",
            "content": "Are there other measures than time complexity for an algorithm?",
        },
        {
            "role": "assistant",
            "content": "Yes, there are other measures besides time complexity for an algorithm, such as space complexity.",
        },
        {"role": "user", "content": "What is it?"},
    ],
)
```

- 输入消息采用对话格式，可以发送**多条消息**给模型
	- 如上面的 `messages` 数组
- API 并不会在上下文中存储之前的消息
	- 因此，问题`“What is it?”`（那是什么？）指代的是前一个答案中的方法，**这个问题只有在模型理解该答案时才有意义**。
- 每次请求时，**你必须重新发送完整的对话内容**，以模拟一个完整的聊天会话

### 4.2. 模型本身是无状态的，类似于 http 

因为，由于模型是**无状态的（Stateless）** ， 要保证模型理解完整上下文，关键在于**你（开发者）如何组织并回传那条 `messages` 数组**。

解决方案是：历史记录的“全量回传”，即**将之前所有的对话轮次，按照时间顺序重新发送给 API**。模型处理这串**数组**时，本质上是在处理一段超长的文本。它会看到：
1. **System**: 你是个老师。
2. **User**: 除了时间复杂度还有别的吗？
3. **Assistant**: 有，比如空间复杂度。
4. **User**: 那是什么？

当模型接收到这个完整的数组时，它通过 **Attention（注意力机制）** 发现“What is it?” 中的 “it” 与上一条消息中的 “space complexity” 相关联。

### 4.3. 如何解决这种无状态

在实际编程中，你通常需要维护一个**列表**来管理这些`历史`

```python
# 1. 初始化对话历史
history = [{"role": "system", "content": "你是一个严谨的老师。"}]

# 2. 第一轮对话
user_input_1 = "除了时间复杂度还有别的吗？"
history.append({"role": "user", "content": user_input_1})
# 调用 API ... 得到回复 response_1
history.append({"role": "assistant", "content": response_1})

# 3. 第二轮对话（此时 history 已包含前两轮，模型就能看懂了）
user_input_2 = "那是什么？"
history.append({"role": "user", "content": user_input_2})
# 再次调用 API，发送整个 history 列表
```

### 4.4. 三个关键点

- **角色顺序（Roles Consistency）：** 必须严格遵守 `user` -> `assistant` -> `user` 的交替顺序。
- **上下文长度限制（Context Window）：** 每个模型都有最大 Token 限制（比如 128k）
- **System Message 的持续引导：** 永远把 `system` 消息放在数组的第一位。它像是一个“固定的人设准则”，即使对话再长，它也会时刻提醒模型“你是谁”。

### 4.5. 聊天补全端点的输入选项：一些参数选项

讨论如何使用 `chat.completions` 端点及其 `create` 方法。

create 方法参数：  

![{%}|512](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/022.jpg)  

消息对象结构

![{%}|528](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/023.jpg)

消息的 `name` 参数似乎在 `OpenAI` 的文档中少有记录，甚至在某些模型中得不到支持

```json
"content": [{"type": "image_url", "image_url":{"url": your_url}}]
```

在这里， `your_url` 表示图像的 URL，而有些示例代码会使用：

```json
"content": [{"image": image, "resize":768}]
```

> 其中 `image` 是一个 **Base64 编码**的图像。

**对话和词元的长度**  

如前所述，对话的总长度与总词元数相关。这将对以下方面产生影响。
- 成本
- 响应用时
- 可用性  
	- 并可以通过 `max_tokens` 参数控制输出词元的数量
	- OpenAI 提供了一个名为 `tiktoken` 的库，其中包含了分词器的实现，也可以计算字符串中有多少词元

**其他可选参数**  

![{%}|536](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/024.jpg)  

### 4.6. 调整 `temperature` 和 `top_p`

 `temperature` 和 `top_p` 的作用是，在`生成连贯的文本与引入变化`和`创造性`之间调整平衡。调整这些参数可以显著影响生成文本的特征。

温度影响分布本身：提高温度使分布变得更加集中，高概率词元的可能性提高，而低概率词元的可能性降低。

下图显示了在补全句子“`The cat is`”（猫是）时，温度为 1 和温度为 0.1 的分布差异。

![{%}|408](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/025.jpg)

**图 2-6：温度对词元概率分布的影响**

`top_p` 参数指的是 `top-p` 采样，也称为核采样（nucleus sampling）。模型将只考虑一部分词元，其总概率质量加起来等于指定的 `top-p` 值，而不是考虑所有可能的词元。

在前面的例子中，0.1 的 top-p 采样和 1 的温度，将只保留前三个词元，因为“a”“still”和“not”的概率总和超过了 0.1，如图 2-7 所示。

![{%}|448](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/026.jpg)

**图 2-7：top-p 采样对词元概率分布的影响**

因此，在一致的输出和创造性的输出之间进行选择时，这两个参数非常有用。我们在这里推荐一些示例，但在你自己的项目上进行试验总是最好的。
- 对于需要保持内容和风格一致的事实性输出，请选择低 `temperature` 和低 `top_p` 。
	- 例如，在代码生成中， `temperature = 0.1, top_p = 0.1` 。
- 对于事实重要但表述方式不那么重要的输出，使用较低的 `top_p` ，但提高 `temperature` ，以获得更自然和引人入胜的输出。
	- 例如，在聊天机器人响应中， `temperature = 1, top_p = 0.1` 。
- 对于需要创造力的输出，使用高 `temperature` 和低 `top_p` 。
	- 例如，在创意写作中， `temperature = 1.2` ， `top_p = 0.5` 。

即使在最低的 top-p 和温度值下，OpenAI 也并不保证确定性，但输出更有可能高度一致。 `seed` 参数是获得确定性输出的解决方案

### 4.7. 聊天补全端点的输出结果格式

现在你已经有了查询基于聊天的模型所需的信息，让我们看看如何使用这些结果。

以下是“Hello World”示例的完整响应：

```python
ChatCompletion(
    id='chatcmpl-8qIU4dbIioE3addR1M6ofppFRlUmR',
    choices=[
        Choice(
            finish_reason='stop', index=0,
            message=ChatCompletionMessage(
                content='Hello there! How can I assist you today?',
                role='assistant', function_call=None, tool_calls=None),
            logprobs=None)],
    created=1707474799, model='gpt-3.5-turbo-0613',
    object='chat.completion', system_fingerprint=None,
    usage=CompletionUsage(
        completion_tokens=10, prompt_tokens=10, total_tokens=20))
```

生成的输出详见表 2-4。

**表 2-4：聊天补全模型输出的描述**

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/027.jpg)

> 　如果你想在多个响应间进行选择，使用了一个大于 1 的 `n` 参数，你会发现 `prompt_tokens` 值不会改变，但 `completion_tokens` 的值将大致乘以 `n` 。

### 4.8. 视觉能力:：多模态

gpt-4-turbo 支持 PNG（.png）、JPEG（.jpeg 和.jpg）、WEBP（.webp）和非动画 GIF（.gif）格式图像，每张图像最大为 `20 MB`。

以下是使用视觉能力的一个例子：

```python
url = """https://upload.wikimedia.org/wikipedia/commons/f/f0/Ophiopteris_antipodum.JPG"""
response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Give the name of the animal in the image.",
                },
                {"type": "image_url", "image_url": {"url": url}},
            ],
        }
    ],
)
response.choices[0].message.content
```

例如：给一张图片，要求 GPT-4 告诉我们这是什么动物。它正确地识别出：“这是一只海星（starfish） 

![{%}|536](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/028.jpg)

以下函数将图像文件转换为 `Base64` 格式：

```python
from base64 import b64encode

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
        base64_image = b64encode(image_data).decode("utf-8")
    return base64_image
```

这是此函数的一个用例，假设图像保存在名为 image.jpg 的文件中：

```python hl:15
base64_image = encode_image("image.jpg")
response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Give the name of the animal in this image.",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    },
                },
            ],
        }
    ],
)
```

### 4.9. 请求 JSON 输出

这个方案相当简单：将 `response_format` 参数设置为 `{"type": "json_object"}` 。此外，指示模型在消息中使用 JSON 输出格式。例如：

```python hl:5
from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(
	model="gpt-3.5-turbo-1106",
	response_format={"type": "json_object"},
	messages=[
		{
			"role": "system",
			"content": "Convert the user's query in a JSON object"
		},
		{
			"role": "user",
			"content": "I am looking for blue or red shoes, leather,
				size 7."
		},
	],
)
```
此代码片段将返回以下内容：
```json
{
	"color": ["blue", "red"],
	"material": "leather",
	"size": 7
}
```

> [!info]  
> 其他需要时查文档就好了，知道可以要求输入的格式就好

## 5. 使用其他文本补全模型

**文本补全**和**聊天补全**之间有一个重要区别：
- 二者都生成文本
- 但聊天补全是针对对话进行优化的。在下面的代码片段中， `chat.completions` 端点的主要不同在于提示词格式。基于聊天的模型必须采用对话格式，
- 而补全则使用一个单一的提示词

```python
from openai import OpenAI
client = OpenAI()

# 调用 openai 库的 completions 端点
response = client.completions.create(
    model="gpt-3.5-turbo-instruct",
    prompt="Hello World!"
)
# 输出响应
print(response.choices[0].text)
```

前面的代码片段将输出类似以下内容的补全结果：

```
"\n\nIt's a pleasure to meet you. I'm new to the world"
```

### 5.1. 文本补全端点的输入选项

`completions.create` 的输入选项集与此前提到的聊天端点的非常相似

![{%}|608](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/030.jpg)

### 5.2. 文本补全端点的输出结果格式

现在，你已拥有查询基于文本的模型所需的所有信息，你会发现结果与聊天端点的结果非常相似。以下是将其用于我们的“Hello World”示例的输出：

```python 
Completion(
    id='cmpl-8qOqLVuCC4GRuBe5XUKTXJj9EWtpv',
    choices=[
        CompletionChoice(
            finish_reason='length',
            index=0,
            logprobs=null,
            text="<br />\n\nHi there! It's great to see you.",
        )
    ],
    created=1707499245,
    model='gpt-3.5-turbo-instruct',
    object='text_completion',
    usage=CompletionUsage(
        completion_tokens=15, prompt_tokens=3, total_tokens=18
    )
)
```

> 　这个输出与我们从聊天模型中得到的非常相似。唯一的区别在于 `Choice` 对象：没有包含 `content` 和 `role` 属性的消息，而是一个简单的 `text` 属性，包含模型生成的补全内容。

## 6. 注意事项

在大规模使用 API 之前，你应该考虑两个重要因素：**成本和数据隐私**

## 7. 其他 OpenAI API 和功能

### 7.1. 嵌入 (Embedding)

- 将高维或离散数据映射到低维连续向量空间的特定技术
- 嵌入的原理是以某种方式有意义地表示文本字符串，以捕捉它们的语义相似度
- 嵌入具有这样的特性：如果两个文本具有相似的含义，它们的向量表示在向量空间中会相接近。
	- 例如，图 2-9 展示了三个句子在二维嵌入中的表现。
		- 尽管句子“The cat chased the mouse around the house”（猫在房子里追老鼠）和“Around the house, the mouse was pursued by the cat”（在房子里，老鼠被猫追）的语法结构不同，但它们传达了相同的一般含义，因此它们应该具有相近的嵌入表示。
		- 句子“The astronaut repaired the spaceship in orbit”（宇航员在轨道上修理了飞船）与前面句子的主题（猫和老鼠）无关，而是讨论了一个完全不同的主题（宇航员和飞船），因此它应该具有显著不同的嵌入表示。

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/031.jpg)

OpenAI 推出了三个嵌入模型。text-embedding-ada-002 是在 2022 年 12 月底推出的模型。最近，OpenAI 推出了两个新模型：一个更小、更便宜且高效的模型，名为 text-embedding-3-small；以及一个更大、更强但也更昂贵的模型，名为 text-embedding-3-large。

嵌入端点使用起来非常简单：

```python hl:2
result = client.embeddings.create(
    model="text-embedding-ada-002",
    input="your input text"
)
```

`嵌入`通过以下方式访问：

```haskell
result.data[0].embedding
```

### 7.2. 审核

OpenAI 提供了一个审核模型，用于检查内容是否符合使用政策，

- 仇恨
- 仇恨 / 威胁
- 骚扰
- 骚扰 / 威胁
- 自残
- 自残 / 说明
- 自残 / 意图
- 性内容
- 涉及未成年人的性内容
- 暴力
- 暴力 / 详细描绘

审核模型的端点是 `moderations.create`，只有两个可用参数：模型和输入文本。内容审核模型有两个。

默认是 text-moderation-latest 10 ，它会随时自动更新，以确保你始终使用最准确的模型。另一个模型是 text-moderation-stable

以下是使用审核模型的示例：

```python
from openai import OpenAI
client = OpenAI()

# 调用 openai 审核端点的 text-moderation-latest 模型
response = client.moderations.create(
	model="text-moderation-latest",
	input="I want to kill my neighbor."
)
```

### 7.3. 文本转语音

目前 OpenAI 有两个可用 TTS 模型：tts-1 和 tts-1-hd。tts-1 是标准模型，经过优化以提高速度

```python
from openai import OpenAI
client = OpenAI()

response = client.audio.speech.create(
    model="tts-1",
    voice="echo",
    input="I won't be home tonight. Could you please take the dog \
        for a walk?"
)
response.stream_to_file("speech.mp3")
```

详细参数如下图：  

![{%}|600](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/033.jpg)

### 7.4. 语音转文本

`Whisper` 是一个多功能的语音识别模型。有开源版本，可以搜索

这是转录 API 的一个使用示例：

```python
from openai import OpenAI
client = OpenAI()

transcript = client.audio.transcriptions.create(
    model="whisper-1",
    file=open("speech.mp3", "rb")
)
transcript.text
```

**表 2-9：转录端点输入的描述**

![{%}|416](https://www.ituring.com.cn/figures/2025/AppGPT4ChatGPT2nd/034.jpg)

### 7.5. 图像 API

OpenAI 提供的图像 API 提供了三种方法来处理文本中的图像。

> 生成

使用此方法，你可以在提示词中描述你想要实现的内容，并据此生成图像。这种方法可以通过 DALL · E 2 和 DALL · E 3 实现。

> 编辑

此方法允许根据提示词编辑现有图像。它在不改变图像核心内容的情况下对现有图像进行修改。在本书撰写时，这种方法仅在 DALL · E 2 中可用。

> 变体

此方法可以从现有图像创建变体，通过探索不同的艺术方向来增强创造力，同时保持原始图像的本质。在本书撰写时，这种方法也仅在 DALL · E 2 中提供。
