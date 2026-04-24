# 常见工作流程

`#claude-code` 

> 源于 Claude Code 官方文档“常见工作流程”页面整理的标准 Markdown 文件。  
> 地址： https://code.claude.com/docs/zh-CN/common-workflows 

## 常见工作流程

> 了解 Claude Code 的常见工作流程。

本文档中的每项任务都包含清晰的说明、示例命令和最佳实践，帮助您充分利用 Claude Code。

### 理解新代码库

#### 快速获取代码库概览

假设您刚加入一个新项目，需要快速了解其结构

```bash
cd /path/to/project  # 导航到项目根目录
```

```bash
claude  # 启动 Claude Code
```

```bash
> give me an overview of this codebase  # 获取代码库概览
```

```bash
> explain the main architecture patterns used here  # 解释主要架构模式
```

```bash
> what are the key data models?  # 关键数据模型是什么？
```

```bash
> how is authentication handled?  # 如何处理身份验证？
```

> **提示：**
>
> - 从广泛的问题开始，然后缩小到特定领域
> - 询问项目中使用的编码约定和模式
> - 请求项目`特定术语`的词汇表

#### 查找相关代码

假设您需要`定位与特定功能`相关的代码。

```bash
> find the files that handle user authentication  # 查找处理用户身份验证的文件
```

```bash
> how do these authentication files work together?  # 这些身份验证文件如何协同工作？
```

```bash
> trace the login process from front-end to database  # 跟踪从前端到数据库的登录流程
```

> **提示：**
>
> - 明确说明您要查找的内容
> - 使用项目中的领域语言

***

### 高效修复错误

假设您遇到了错误消息，需要找到并修复其源头。

```bash
> I'm seeing an error when I run npm test  # 运行 npm test 时出现错误
```

```bash
> suggest a few ways to fix the @ts-ignore in user.ts  # 建议修复 user.ts 中 @ts-ignore 的几种方法
```

```bash
> update user.ts to add the null check you suggested  # 更新 user.ts 添加您建议的空值检查
```

> **提示：**
>
> - 告诉 Claude 用于重现问题的命令并获取堆栈跟踪
> - 提及重现错误的任何步骤
> - 让 Claude 知道错误是间歇性的还是持续的

***

### 重构代码

假设您需要更新旧代码以使用现代模式和实践。

```bash
> find deprecated API usage in our codebase  # 查找代码库中已弃用的 API 使用
```

```bash
> suggest how to refactor utils.js to use modern JavaScript features  # 建议如何重构 utils.js 以使用现代 JavaScript 特性
```

```bash
> refactor utils.js to use ES2024 features while maintaining the same behavior  # 重构 utils.js 以使用 ES2024 特性，同时保持相同的行为
```

```bash
> run tests for the refactored code  # 运行重构代码的测试
```

> **提示：**
>
> - 要求 Claude 解释现代方法的优势
> - 请求在需要时保持向后兼容性的更改
> - 以小的、可测试的增量进行重构

***

### 使用专门的子代理

假设您想使用专门的 AI 子代理来更有效地处理特定任务。

```bash
> /agents  # 查看可用的子代理
```

这显示所有可用的子代理，并让您创建新的子代理。

Claude Code 将自动将适当的任务委派给专门的子代理：

```bash
> review my recent code changes for security issues  # 审查我最近的代码更改是否存在安全问题
```

```bash
> run all tests and fix any failures  # 运行所有测试并修复任何失败
```

```bash
> use the code-reviewer subagent to check the auth module  # 使用 code-reviewer 子代理检查身份验证模块
```

```bash
> have the debugger subagent investigate why users can't log in  # 让 debugger 子代理调查为什么用户无法登录
```

```bash
> /agents  # 打开子代理配置
```

然后选择"创建新子代理"并按照提示定义：

- 子代理类型（例如 `api-designer`、`performance-optimizer`）
- 何时使用它
- 它可以访问哪些工具
- 其专门的系统提示

> **提示：**
>
> - 在 `.claude/agents/` 中创建项目特定的子代理以供团队共享
> - 使用描述性的 `description` 字段来**启用自动委派**
> - 限制工具访问权限为每个子代理实际需要的内容
> - 查看[子代理文档](/zh-CN/sub-agents)了解详细示例

***

### 使用计划模式进行安全的代码分析

`计划模式`指示 Claude 通过使用只读操作分析代码库来创建计划，非常适合探索代码库、规划复杂更改或安全地审查代码。

#### 何时使用计划模式

- **多步实现**：
	- 当您的功能需要编辑许多文件时
- **代码探索**：
	- 当您想在更改任何内容之前`彻底研究代码库`时
- **交互式开发**：
	- 当您想与 Claude 迭代方向

#### 如何使用计划模式

**在会话期间打开计划模式**

- 您可以在会话期间使用 **Shift+Tab** 循环切换权限模式来切换到计划模式。
- 如果您处于正常模式，**Shift+Tab** 将首先切换到自动接受模式，在终端底部显示 `⏵⏵ accept edits on`。
	- 随后的 **Shift+Tab** 将切换到计划模式，显示 `⏸ plan mode on`。

**在计划模式下启动新会话**

要在计划模式下启动新会话，请使用 `--permission-mode plan` 标志：

```bash
claude --permission-mode plan  # 以计划模式启动 Claude Code
```

**在计划模式下运行"无头"查询**

您也可以使用 `-p` 在计划模式下直接运行查询（即在["无头模式"](/zh-CN/headless)中）：

```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"  # 分析身份验证系统并建议改进
```

#### 示例：规划复杂重构

```bash
claude --permission-mode plan  # 启动计划模式
```

> 创建计划后，你一定要检查！

```bash
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.  # 我需要重构我们的身份验证系统以使用 OAuth2。创建详细的迁移计划。
```

Claude 将分析当前实现并创建全面的计划。通过后续问题进行细化：

```bash
> What about backward compatibility?  # 向后兼容性如何处理？
```

```bash
> How should we handle database migration?  # 应该如何处理数据库迁移？
```

#### 将计划模式配置为默认值

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

有关更多配置选项，请参阅[设置文档](/zh-CN/settings#available-settings)。

***

### 使用测试

假设您需要为未覆盖的代码添加测试。

```bash
> find functions in NotificationsService.swift that are not covered by tests  # 查找 NotificationsService.swift 中未被测试覆盖的函数
```

```bash
> add tests for the notification service  # 为通知服务添加测试
```

```bash
> add test cases for edge conditions in the notification service  # 为通知服务中的边界条件添加测试用例
```

```bash
> run the new tests and fix any failures  # 运行新测试并修复任何失败
```

> **提示：**
>
> - 请求涵盖边界情况和错误条件的测试
> - 在适当时请求单元测试和集成测试
> - 让 Claude 解释测试策略

***

### 创建拉取请求

假设您需要为您的更改创建一个文档完善的拉取请求。

```bash
> summarize the changes I've made to the authentication module  # 总结我对身份验证模块所做的更改
```

```bash
> create a pr  # 创建拉取请求
```

```bash
> enhance the PR description with more context about the security improvements  # 增强拉取请求描述，添加更多有关安全改进的上下文
```

```bash
> add information about how these changes were tested  # 添加有关如何测试这些更改的信息
```

> **提示：**
>
> - 直接要求 Claude 为您创建 PR
> - 在提交前审查 Claude 生成的 PR
> - 要求 Claude 突出显示潜在风险或注意事项

### 处理文档

假设您需要为代码添加或更新文档。

```bash
> find functions without proper JSDoc comments in the auth module  # 查找身份验证模块中没有适当 JSDoc 注释的函数
```

```bash
> add JSDoc comments to the undocumented functions in auth.js  # 为 auth.js 中未记录的函数添加 JSDoc 注释
```

```bash
> improve the generated documentation with more context and examples  # 改进生成的文档，添加更多上下文和示例
```

```bash
> check if the documentation follows our project standards  # 检查文档是否符合我们的项目标准
```

> **提示：**
>
> - 指定您想要的文档风格（`JSDoc`、文档字符串等）
> - 请求文档中的示例
> - 请求公共 API、接口和复杂逻辑的文档

***

### 使用图像

假设您需要在代码库中使用图像，并希望 Claude 帮助分析图像内容。

您可以使用以下任何方法：

1. 将图像拖放到 Claude Code 窗口中
2. 复制图像并使用 ctrl+v 将其粘贴到 CLI 中（不要使用 `cmd+v`）
3. 向 Claude 提供图像路径。例如，"分析此图像：/path/to/your/image.png" 

```bash
> What does this image show?  # 这张图片显示了什么？
```

```bash
> Describe the UI elements in this screenshot  # 描述此屏幕截图中的 UI 元素
```

```bash
> Are there any problematic elements in this diagram?  # 此图中是否有任何有问题的元素？
```

> [!question]  
> 这是错误的屏幕截图。是什么原因导致的？ 

```bash hl:1
# 这是错误的屏幕截图。是什么原因导致的？
> Here's a screenshot of the error. What's causing it?  
```

```bash
> This is our current database schema. How should we modify it for the new feature?  # 这是我们当前的数据库架构。我们应该如何为新功能修改它？
```

```bash
> Generate CSS to match this design mockup  # 生成与此设计模型匹配的 CSS
```

```bash
> What HTML structure would recreate this component?  # 什么 HTML 结构可以重新创建此组件？
```

> **提示：**
>
> - 当文本描述不清楚或繁琐时使用图像
> - 包含错误、UI 设计或图表的屏幕截图以获得更好的上下文
> - 您可以在对话中使用多个图像
> - 图像分析适用于图表、屏幕截图、模型等

***

### 引用文件和目录

使用 `@` 快速包含`文件或目录`，无需等待 Claude 读取它们

```bash
> Explain the logic in @src/utils/auth.js  # 解释 @src/utils/auth.js 中的逻辑
```

这将文件的完整内容包含在对话中

```bash
> What's the structure of @src/components?  # @src/components 的结构是什么？
```

这提供了带有文件信息的目录列表

```bash
> Show me the data from @github:repos/owner/repo/issues  # 显示来自 @github:repos/owner/repo/issues 的数据
```

这使用 `@server:resource` 格式从连接的 MCP 服务器获取数据。有关详细信息，请参阅 [MCP 资源](/zh-CN/mcp#use-mcp-resources)。

> **提示：**
>
> - 文件路径可以是相对的或绝对的
> - @ 文件引用在文件的目录和父目录中添加 `CLAUDE.md` 到上下文
> - 目录引用显示文件列表，而不是内容
> - 您可以在单个消息中引用多个文件（例如"@file1.js and @file2.js"）

***

### 使用扩展思考

假设您正在处理复杂的架构决策、具有挑战性的错误或规划需要深度推理的多步实现。

> **注意：**
>
> [扩展思考](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)在 Claude Code 中默认禁用。您可以通过使用 `Tab` 切换思考功能或使用"`think`"或"`think hard`"之类的提示来按需启用它。您也可以通过在设置中设置 [`MAX_THINKING_TOKENS` 环境变量](/zh-CN/settings#environment-variables)来永久启用它。

```bash
> I need to implement a new authentication system using OAuth2 for our API. Think deeply about the best approach for implementing this in our codebase.  # 我需要为我们的 API 实现一个使用 OAuth2 的新身份验证系统。深入思考在代码库中实现它的最佳方法。
```

Claude 将从您的代码库中收集相关信息并使用扩展思考，这将在界面中可见。

```bash
> think about potential security vulnerabilities in this approach  # 思考这种方法中的潜在安全漏洞
```

```bash
> think hard about edge cases we should handle  # 深入思考我们应该处理的边界情况
```

> **提示：**
>
> [扩展思考](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)对于复杂任务最有价值，例如：
>
> - 规划复杂的架构更改
> - 调试复杂问题
> - 为新功能创建实现计划
> - 理解复杂的代码库
> - 评估不同方法之间的权衡
>
> 在会话期间使用 `Tab` 切换思考功能的开启和关闭。
>
> 您提示思考结果的方式会导致不同的思考深度：
>
> - "think"触发基本扩展思考
> - 加强短语如"think hard"、"think more"、"think a lot"或"think longer"触发更深层的思考
>
> 有关更多扩展思考提示技巧，请参阅[扩展思考提示](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips)。
>
> Claude 将其思考过程显示为响应上方的斜体灰色文本。

***

### 恢复之前的对话

假设您一直在使用 Claude Code 处理任务，需要在稍后的会话中继续之前的工作。

Claude Code 提供两个选项来恢复之前的对话：

- `--continue` 自动继续最近的对话
- `--resume` 显示对话选择器

```bash
claude --continue  # 继续最近的对话
```

这立即恢复您最近的对话，无需任何提示。

```bash
claude --continue --print "Continue with my task"  # 使用特定提示继续最近的对话
```

使用 `--print` 与 `--continue` 在非交互模式下恢复最近的对话，非常适合脚本或自动化。

```bash
claude --resume  # 显示对话选择器
```

这显示一个交互式对话选择器，具有清晰的列表视图，显示：

- 会话摘要（或初始提示）
- 元数据：经过的时间、消息计数和 git 分支

使用箭头键导航，按 `Enter` 选择对话。按 `Esc` 退出。

**提示：**

- 对话历史存储在您的本地机器上
- 使用 `--continue` 快速访问您最近的对话
- 当您需要选择特定的过去对话时使用 `--resume`
- 恢复时，您将看到整个对话历史，然后继续
- 恢复的对话以与原始对话相同的模型和配置开始

**工作原理：**

1. **对话存储**：所有对话都自动保存在本地，包含其完整的消息历史
2. **消息反序列化**：恢复时，整个消息历史被恢复以维护上下文
3. **工具状态**：来自之前对话的工具使用和结果被保留
4. **上下文恢复**：对话以所有之前的上下文完整恢复

**示例：**

```bash
# 继续最近的对话
claude --continue
# 使用特定提示继续最近的对话
claude --continue --print "Show me our progress"
# 显示对话选择器
claude --resume
# 在非交互模式下继续最近的对话
claude --continue --print "Run the tests again"
```

***

### 使用 Git worktrees 运行并行 Claude Code 会话

假设您需要同时处理多个任务，并在 Claude Code 实例之间完全隔离代码。

`Git worktrees` 允许您从同一存储库中检出多个分支到单独的目录中。每个 worktree 都有自己的工作目录，文件隔离，同时共享相同的 Git 历史。在[官方 Git worktree 文档](https://git-scm.com/docs/git-worktree)中了解更多信息。

```bash
# 使用新分支创建新的 worktree
git worktree add ../project-feature-a -b feature-a
# 或使用现有分支创建 worktree
git worktree add ../project-bugfix bugfix-123
```

这创建了一个新目录，其中包含存储库的单独工作副本。

```bash
# 导航到您的 worktree
cd ../project-feature-a
# 在此隔离环境中运行 Claude Code
claude
```

```bash
cd ../project-bugfix  # 切换到另一个 worktree
claude  # 运行 Claude Code
```

```bash
# 列出所有 worktrees
git worktree list
# 完成后删除 worktree
git worktree remove ../project-feature-a
```

**提示：**
- 每个 worktree 都有自己独立的文件状态，非常适合并行 Claude Code 会话
- 在一个 worktree 中所做的更改不会影响其他 worktree，防止 Claude 实例相互干扰
- 所有 worktrees 共享相同的 Git 历史和远程连接
- 对于长期运行的任务，您可以在一个 worktree 中让 Claude 工作，同时在另一个 worktree 中继续开发
- 使用描述性目录名称轻松识别每个 worktree 用于哪个任务
- 记住根据您的项目设置在每个新 worktree 中初始化您的开发环境。根据您的堆栈，这可能包括：
	- JavaScript 项目：运行依赖安装（`npm install`、`yarn`）
	- Python 项目：设置虚拟环境或使用包管理器安装
	- 其他语言：遵循您的项目标准设置流程

***

### 将 Claude 用作 unix 风格的实用程序

#### 将 Claude 添加到您的验证流程

假设您想将 Claude Code 用作 linter 或代码审查工具。

**将 Claude 添加到您的构建脚本：**

```json
// package.json
{
  ...
  "scripts": {
    ...
    "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
  }
}
```

**提示：**
- 在 CI/CD 管道中使用 `Claude` 进行自动代码审查
- 自定义提示以检查与您的项目相关的特定问题
- 考虑为不同类型的验证创建多个脚本

#### 管道进入，管道输出

假设您想将数据管道输入到 Claude，并以结构化格式获取数据。

**通过 Claude 管道数据：**

```bash
# 简洁解释此构建错误的根本原因
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt  
```

**提示：**

- 使用管道将 Claude 集成到现有 shell 脚本中
- 与其他 Unix 工具结合以实现强大的工作流
- 考虑使用 `--output-format` 获得结构化输出

#### 控制输出格式

假设您需要 Claude 的输出采用特定格式，特别是在将 Claude Code 集成到脚本或其他工具时。

```bash
# 总结数据
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt  
```

这仅输出 Claude 的纯文本响应（默认行为）

```bash
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json  # 分析代码中的错误
```

这输出包含元数据（包括成本和持续时间）的消息的 JSON 数组。

```bash
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json  # 解析日志文件中的错误
```

这在 Claude 处理请求时实时输出一系列 JSON 对象。每条消息都是有效的 JSON 对象，但如果连接，整个输出不是有效的 JSON。

**提示：**

- 对于简单集成（您只需要 Claude 的响应）使用 `--output-format text`
- 当您需要完整的对话日志时使用 `--output-format json`
- 对于每个对话轮次的实时输出使用 `--output-format stream-json`

***

### 创建自定义斜杠命令

Claude Code 支持`自定义斜杠命令`，您可以创建这些命令来快速执行特定的提示或任务。

有关更多详细信息，请参阅[斜杠命令](/zh-CN/slash-commands)参考页面。

#### 创建项目特定的命令

> [!info]  
> 创建命令，其实就是创建一个优化命令的 `.md` 文件而已

假设您想为您的项目创建可重用的斜杠命令，所有团队成员都可以使用。

```bash
mkdir -p .claude/commands  # 创建命令目录
```

```bash
echo "Analyze the performance of this code and suggest three specific optimizations:" > .claude/commands/optimize.md  # 创建优化命令
```

```bash
> /optimize  # 使用自定义优化命令
```

**提示：**

- 命令名称来自文件名（例如，`optimize.md` 变成 `/optimize`）
- 您可以在子目录中组织命令（例如，`.claude/commands/frontend/component.md` 创建 `/component`，在描述中显示"(project:frontend)"）
- 项目命令对克隆存储库的每个人都可用
- Markdown 文件内容成为调用命令时发送给 Claude 的提示

#### 使用 $ARGUMENTS 添加命令参数

假设您想创建灵活的斜杠命令，可以接受来自用户的其他输入。

```bash
echo 'Find and fix issue `#$ARGUMENTS.` Follow these steps: 1.
Understand the issue described in the ticket 2. Locate the relevant code in
our codebase 3. Implement a solution that addresses the root cause 4. Add
appropriate tests 5. Prepare a concise PR description' >
.claude/commands/fix-issue.md  # 创建带参数的修复命令
```

在您的 Claude 会话中，使用带参数的命令。

```bash
> /fix-issue 123  # 修复问题 `#123`
```

这将用"123"替换提示中的 $ARGUMENTS。

**提示：**

- $ARGUMENTS 占位符被替换为命令后面的任何文本
- 您可以在命令模板中的任何位置放置 $ARGUMENTS
- 其他有用的应用：为特定函数生成测试用例、为组件创建文档、审查特定文件中的代码或将内容翻译为指定的语言

#### 创建个人斜杠命令

假设您想创建在所有项目中工作的个人斜杠命令。

```bash
mkdir -p ~/.claude/commands  # 创建个人命令目录
```

```bash
echo "Review this code for security vulnerabilities, focusing on:" >
~/.claude/commands/security-review.md  # 创建安全审查命令
```

```bash
> /security-review  # 使用安全审查命令
```

**提示：**

- 个人命令在使用 `/help` 列出时在描述中显示"(user)"
- 个人命令仅对您可用，不与您的团队共享
- 个人命令在所有项目中工作
- 您可以使用这些在不同代码库中实现一致的工作流

***

### 询问 Claude 其功能

Claude 内置访问其文档，可以回答有关其自身功能和限制的问题。

#### 示例问题

```bash
> can Claude Code create pull requests?  # Claude Code 可以创建拉取请求吗？
```

```bash
> how does Claude Code handle permissions?  # Claude Code 如何处理权限？
```

```bash
> what slash commands are available?  # 有哪些可用的斜杠命令？
```

```bash
> how do I use MCP with Claude Code?  # 我如何在 Claude Code 中使用 MCP？
```

```bash
> how do I configure Claude Code for Amazon Bedrock?  # 我如何为 Amazon Bedrock 配置 Claude Code？
```

```bash
> what are the limitations of Claude Code?  # Claude Code 的限制是什么？
```

> **注意：**
>
> Claude 提供基于文档的答案来回答这些问题。有关可执行示例和实际演示，请参阅上面的特定工作流部分。

> **提示：**
>
> - Claude 始终可以访问最新的 Claude Code 文档，无论您使用的版本如何
> - 提出具体问题以获得详细答案
> - Claude 可以解释复杂功能，如 MCP 集成、企业配置和高级工作流
