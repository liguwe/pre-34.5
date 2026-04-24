# 博客：模型上下文协议（MCP）

`#AI` 

模型上下文协议（Model Context Protocol，简称MCP）
- 为AI模型`量身定制的“USB-C接口”`，可以标准化地连接AI系统与各类外部工具和数据源
- MCP不仅仅是另一种API，而是一个强大的连接框架，让AI应用能更智能、更动态地融入丰富的上下文环境，快速实现复杂的功能互动。

## 1. 背景：为什么不是 API？

- AI系统想连接外部工具时，需要单独整合多个不同的API。
- 每个API都有独立的代码、文档、认证方式、错误处理和后续维护，极大地增加了开发复杂度。
- 传统的API要求开发者为每个服务或数据源单独编写代码和整合方案

![图片|648](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250326094129695.png)

>   API 就像不同的门，每扇门都需要自己的钥匙和特定的规则，如上图

### 1.1. MCP 与 API 的对比

![图片|584](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250327062227557.png)

## 2. 目的

**目的**是帮助AI模型（如Claude）**更容易地连接工具和数据源**。

## 3. MCP如何工作：架构原理 → C/S 架构

- • **MCP主机（Host）：** 
	- 如 `Claude桌面应用` 或 `智能开发环境（IDE）`，需要访问外部数据或工具
	- 主机？
- • **MCP 客户端（Client）：** 与MCP服务器建立一对一的稳定连接
	- 比如 `clients.py`
- • **MCP服务器（Server）：** 
	- 提供特定功能，连接本地或远程的数据源
	- 比如 Gmail、Slack或日历应用的 **OPEN API**
	- • **本地数据源：** 文件、数据库或服务
		- 他也算是一种 MCP Server
- • **远程服务：** 
	- 外部API或互联网服务

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250327063008383.png)

## 4. 参考

- https://modelcontextprotocol.io/introduction
- https://mp.weixin.qq.com/s/oyewbUXalcfjjKo6R6YOdA
	- 同 https://waytoagi.feishu.cn/wiki/EHOjwN37KiRzXak4xm6cqfBCnYC
