# 开发环境搭建指南

`#2026/01/02`

>  https://www.bilibili.com/video/BV16AKAzzECq?spm_id_from=333.788.videopod.sections&vd_source=e507242a02e4c9fdb6386bb791e1c08f

提示词：

```markdown
我是一个正在阅读 Sebastian Raschka 的《从零构建大模型》（Build a Large Language Model from Scratch）的全栈工程师，我发现作者在 youtebe 上发布一些导学视频，但我没时间的看完整视频，所以我会把字幕都给你，你帮我整理一份博客文章出来，要求如下
- 结构化表达（比如 markdown 的层级很重要）
- 尽量不丢失原文，并且不重不漏
- 方便用于分享，所以阅读性应该很强，深入浅出的讲解
- 补充必要的信息，比如作者提到的 Github 仓库，你需要补全真实的地址
- 补充信息：我的电脑是 mac pro M4 ，所以你不用考虑其他机型比如 windows 
以下字幕内容：
xxx
```

> 旨在帮助您快速、专业地搭建起《从零构建大模型》（_Build a Large Language Model from Scratch_）的学习环境。  
> 虽然第一章主要聚焦于理论，没有代码，但它是后续所有实战的基石。今天，我们将重点解决一个核心问题：**如何在你的电脑上搭建一个理想的、现代化的 Python 编程环境？**

## 🛠️ 核心资源准备

在开始搭建之前，建议你收藏本书的官方代码仓库。这里包含了所有章节的 Jupyter Notebook 示例：

- **GitHub 仓库地址**：[https://github.com/rasbt/LLM-from-scratch](https://www.google.com/search?q=https://github.com/rasbt/LLM-from-scratch)
- **补充设置指南**：仓库中的 `setup` 文件夹包含了针对不同环境的详细说明。

---

## 💻 硬件与兼容性说明

即使你没有顶配的 GPU，也不必担心。
- **多设备支持**：
	- 本书代码在 MacBook Air（5 年老机型）、Linux 和 Windows 上均经过测试。
- **硬件自适应**：
	- 如果你有 GPU，PyTorch 会自动调用它；如果没有，代码在 CPU 上也能良好运行。
- **云端方案**：
	- 如果本地配置遇到困难，推荐使用 **Lightning Studio** 或 **Google Colab**。书中所有 Notebook 均可直接上传至云端运行。

---

## 🐍 Python 版本的选择策略

> **黄金法则：千万不要动操作系统自带的 Python。**

### 1. 为什么不推荐最新的 Python 3.13？

虽然截止视频录制时 Python 3.13 已经发布，但我强烈建议安装稍旧的版本（如 **Python 3.11 或 3.12**）。

- **生态滞后性**：
	- 像 PyTorch 这样的深度学习核心库，通常需要几个月的时间才能完美适配最新的 Python 版本。
- **科学计算需求**：
	- 最新的 Python 特性在科学计算中很少用到，而稳定性远比追新更重要。

### 2. 安装方式

- **官方渠道**：前往 [Python.org](https://www.python.org/) 下载。
- **包管理器（推荐）**：macOS 用户可以使用 Homebrew：

```bash
brew install python@3.11
```

---

## ⚡ 现代化包管理工具：UV

过去我长期使用 Conda 和 Pip，但现在我的**个人首选是 [UV](https://github.com/astral-sh/uv)**。

### 为什么选择 UV？

- **极致性能**：它比传统的 Pip 快得多（由 Rust 编写）。
- **兼容性高**：它提供了 `uv pip` 接口，语法与 Pip 几乎完全一致。
- **安装简单**：

```bash
pip install uv
```

---

## 📝 实战：几步完成本地环境搭建

假设你已经下载了 GitHub 仓库并进入了项目目录，请按照以下步骤操作：

### 第一步：创建虚拟环境

`虚拟环境`是独立的文件夹，可以防止不同项目间的依赖冲突。

```bash
# 创建一个名为 .venv 的环境，并指定使用 Python 3.11
uv venv --python 3.11
```

### 第二步：激活环境

- **macOS / Linux**: `source .venv/bin/activate`
- **Windows**: `.venv\Scripts\activate`

```bash
# 一定要激活，已
source .venv/bin/activate
```

激活后，你可以通过 `which python` (Mac) 确认当前正在使用的是虚拟环境中的 Python。

### 第三步：安装核心依赖

书中最重要的库是 **PyTorch**（安装名为 `torch`）。

```bash
# 安装所有依赖（推荐）
uv pip install -r requirements.txt
```

### 第五步：启动 Jupyter Lab

```Bash
uv run jupyter lab
```

---

## ☁️ 备选：Google Colab 设置技巧

如果你更喜欢在云端运行，可以利用 UV 快速配置 Colab 环境：

1. 在 Notebook 单元格中输入：

    ```Python
    !pip install uv
    !uv pip install --system -r https://raw.githubusercontent.com/rasbt/LLM-from-scratch/main/requirements.txt
    ```

2. 注意：在 `Colab` 中无需创建虚拟环境，直接使用 `--system` 参数安装即可。

---

## 💡 给开发者的学习建议

1. **“手动挡”学习法**：
	- 虽然可以直接运行现有的 `Notebook`，但我强烈建议你**新建一个空白 Notebook，亲手敲入每一行代码**。**这种肌肉记忆对于理解大模型的架构至关重要**。
2. **拒绝剧透**：
	- 在打开现有 `Notebook` 时，建议先点击 `Cell -> All Output -> Clear` 清除所有输出，带着悬念去运行代码。
