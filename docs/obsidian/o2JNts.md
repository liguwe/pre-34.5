# Claude Code 快速上手指南：从安装到实战

`#2026/01/05` `#ai` `#claude-code`

## 第一步 安装

这个不需要多说

## 第二步：登录账户

Claude Code 需要账户授权才能使用。当你首次启动时，系统会提示你登录。

```bash
claude # 启动交互式会话，首次使用会提示登录
# 或者直接使用登录命令：
/login # 按照终端提示，使用你的账户完成验证
```

---

## 第三步：启动并探索项目

在你的`项目根目录下`启动 Claude Code，开始你的第一个会话。

```bash
cd /path/to/your/project # 进入你的项目目录
claude # 启动 Claude Code
```

### 了解你的代码库

启动后，你可以直接用自然语言向 Claude 提问，`无需手动添加文件上下文`，Claude 会`自动读取文件并分析`。

尝试输入以下指令：

```bash
> what does this project do?            # 这个项目是做什么的？
> explain the folder structure          # 解释一下文件夹结构
> where is the main entry point?        # 主入口文件在哪里？
> what technologies does this project use? # 这个项目使用了哪些技术栈？
```

---

## 第四步：进行代码更改与调试

现在让 Claude Code 进行实际的编码工作。它会经历“查找文件 -> 建议更改 -> 请求批准 -> 执行编辑”的流程。

### 1. 修改代码

尝试一个简单的任务：

```bash
> add a hello world function to the main file # 在主文件中添加一个 hello world 函数
```

> 注意：Claude Code 在修改文件前总是会请求你的许可。你可以逐个批准，**也可以开启“`全部接受`”模式。**

### 2. 修复 Bug 或添加功能

你可以用`自然语言`描述需求，Claude 会定位代码、理解上下文并实现解决方案

```python
# 为用户注册表单添加输入验证
> add input validation to the user registration form 
# 修复用户可以提交空表单的 Bug
> there's a bug where users can submit empty forms - fix it  
```

---

## 第五步：Git 集成与工作流

Claude Code 将 Git 操作变得对话式，你可以直接让它帮忙管理版本控制。

```bash
> what files have I changed? # 我修改了哪些文件？
> commit my changes with a descriptive message # 用描述性信息提交我的更改
> create a new branch called feature/quickstart # 创建一个名为 feature/quickstart 的新分支
> show me the last 5 commits # 显示最近 5 次提交
```

除了基础编码，你还可以尝试更多高级工作流：

- **重构代码**：
	- `refactor the authentication module to use async/await`
	- （重构认证模块以使用 `async/await` ）
- **编写测试**：
	- `write unit tests for the calculator functions`
	- 为计算器函数编写单元测试
- **更新文档**：
	- `update the README with installation instructions`
	- 更新 `README` 中的`安装`说明

---

## 常用命令速查表

以下是日常使用中最重要的命令：

| 命令                  | 功能                       | 示例（含中文注释）                                    |
| :------------------ | :----------------------- | :------------------------------------------- |
| `claude`            | 启动交互模式                   | `claude`                                     |
| `claude "task"`     | 运行一次性任务                  | `claude "fix the build error"` # 修复构建错误      |
| `claude -p "query"` | 运行`一次性`查询并退出             | `claude -p "explain this function"` # 解释这个函数 |
| `claude -c`         | 继续`最近`的对话，`continue` 的意思 | `claude -c`                                  |
| `claude commit`     | 创建 Git 提交                | `claude commit`                              |
| `/clear`            | 清除对话历史                   | `> /clear`                                   |
| `/help`             | 显示可用命令                   | `> /help`                                    |
| `exit`              | 退出 Claude Code           | `> exit` # 或按 Ctrl+C                         |

## 给初学者的建议

为了获得最佳体验，请参考以下提示：

1. **`具体化`你的请求**：
	- 不要只说“修复 bug”，试着说：
		- “修复登录 bug，即用户输入错误凭证后看到空白屏幕的问题”。
2. **分步说明**：将复杂任务分解

    ```bash
    > 1. create a new database table for user profiles # 1. 创建用户资料数据库表
    > 2. create an API endpoint to get and update user profiles # 2. 创建获取和更新资料的 API
    > 3. build a webpage that allows users to see and edit their information # 3. 构建前端页面
    ```

1. **先探索，后修改**：在进行更改前，`先让 Claude 理解代码`。

    ```bash
    > analyze the database schema # 分析数据库模式
    ```

2. **使用快捷键**：
    - 按 `?` 查看所有快捷键。
    - 使用 `Tab` 进行命令补全。
    - 按 `↑` 查看命令历史。

如有疑问，可以在工具内输入 `/help` 获取帮助。
