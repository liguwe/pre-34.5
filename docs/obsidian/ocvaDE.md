# OpenClaw 配置经验总结

`#年轮` `#log` `#日记`  

> 配置日期：2026-03-15  
> OpenClaw 版本：2026.3.13  
> 系统：macOS 15.7.4

---

## 📋 配置概览

本次配置实现了：
- ✅ 飞书（Feishu）渠道接入
- ✅ 钉钉（DingTalk）渠道接入
- ✅ 浏览器自动化（截图、网页操作）
- ✅ 多模型支持（百炼/bailian 平台）

---

## 🚀 快速开始（核心配置）

### 1. 飞书配置

#### 关键配置项（~/.openclaw/openclaw.json）

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "accounts": {
        "main": {
          "appId": "cli_xxx",          // 飞书应用 App ID
          "appSecret": "xxx",          // 飞书应用 App Secret
          "botName": "Claude助手"      // 机器人名称
        },
        "default": {
          "dmPolicy": "open",          // 私聊策略：open/pairing/allowlist
          "allowFrom": ["*"]           // 允许所有人访问
        }
      }
    }
  }
}
```

#### dmPolicy 策略详解

| 值             | 行为                            | 适用场景     |
| ------------- | ----------------------------- | -------- |
| `"pairing"`   | 新用户需配对码，管理员批准后可用              | 企业内部需要审核 |
| `"open"`      | 所有人直接可用（需 `allowFrom: ["*"]`） | 企业内部无需审核 |
| `"allowlist"` | 仅白名单用户可用                      | 仅限特定人员   |
| `"disabled"`  | 禁止私聊                          | 仅群聊      |

#### 飞书开放平台配置要点

1. **创建企业自建应用**
2. **获取凭证**：App ID + App Secret
3. **配置权限**：批量导入 JSON 权限配置（文档中有完整配置）
4. **启用机器人能力**
5. **事件订阅**：选择「使用长连接接收事件」（WebSocket 模式）
6. **发布应用**：版本管理 → 创建版本 → 提交审核

> ⚠️ **坑点**：必须先添加飞书渠道配置并启动网关，再去配置飞书平台的事件订阅，否则长连接设置会失败。

---

### 2. 钉钉配置

```json
{
  "channels": {
    "dingtalk": {
      "clientId": "dingxxx",           // 钉钉应用 Client ID
      "clientSecret": "xxx"            // 钉钉应用 Client Secret
    }
  }
}
```

---

### 3. AI 模型配置（百炼平台）

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "apiKey": "sk-xxx",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3.5-plus",
            "name": "qwen3.5-plus",
            "input": ["text", "image"],    // 支持图像输入
            "contextWindow": 1000000,
            "maxTokens": 65536
          }
        ]
      }
    }
  }
}
```

> 💡 **经验**：百炼平台支持多个模型，推荐 `qwen3.5-plus` 支持图文，适合截图分析场景。

---

## 🔧 常用命令速查

### 网关管理

```bash
openclaw gateway status          # 查看网关状态
openclaw gateway restart         # 重启网关
openclaw gateway stop            # 停止网关
openclaw logs --follow           # 实时查看日志
```

### 渠道管理

```bash
openclaw channels add            # 交互式添加渠道
openclaw pairing list feishu     # 查看飞书待配对列表
openclaw pairing approve feishu CODE  # 批准配对码
```

### 浏览器自动化

```bash
openclaw browser start           # 启动浏览器
openclaw browser status          # 查看浏览器状态
openclaw browser open <url>      # 打开网页
openclaw browser snapshot        # 截图当前页面
openclaw browser close           # 关闭浏览器
```

### 诊断修复

```bash
openclaw doctor                  # 诊断问题
openclaw doctor --fix            # 自动修复问题
openclaw doctor --repair         # 修复服务配置
```

---

## 🕳️ 踩坑记录

### 坑 1：飞书显示 "not configured"

**现象**：`openclaw doctor` 显示 Feishu: not configured，但配置文件中已配置。

**原因**：配置格式问题，单账号配置需要放在 `accounts.default` 下。

**解决**：运行 `openclaw doctor --fix` 自动修正配置格式。

---

### 坑 2：节点连接显示 "Paired: 0"

**现象**：macOS 桌面端已安装，设备已配对，但 `openclaw nodes list` 显示 Paired: 0。

**原因**：WebSocket 握手超时，可能与网络、防火墙或权限有关。

**影响**：
- ❌ 无法使用相机拍照
- ❌ 无法屏幕录制
- ❌ 无法执行系统命令

**解决**：
- 如果不需要这些功能，可以**卸载桌面端**，不影响核心功能
- 浏览器自动化完全可以替代网页截图需求

---

### 坑 3：钉钉 dmPolicy "open" 配置无效

**现象**：设置了 `"dmPolicy": "open"` 但 doctor 提示配置无效。

**原因**："open" 策略需要配合 `allowFrom: ["*"]` 使用。

**正确配置**：

```json
{
  "dmPolicy": "open",
  "allowFrom": ["*"]
}
```

---

### 坑 4：飞书事件订阅配置失败

**现象**：在飞书平台配置事件订阅时长连接设置保存失败。

**原因**：
1. 网关未启动
2. 飞书渠道未在 OpenClaw 中配置

**解决步骤**：
1. 先配置 `openclaw.json` 添加飞书渠道
2. 启动网关 `openclaw gateway restart`
3. 确认网关运行 `openclaw gateway status`
4. 再去飞书平台配置事件订阅

---

### 坑 5：OpenClaw macOS 桌面端的必要性

**误解**：以为桌面端是必需的。

**实际**：
- ❌ 桌面端**不是**必需的
- ✅ 网关（Gateway）是必需的（通过 CLI 运行）
- ✅ 浏览器自动化不需要桌面端
- ✅ 飞书/钉钉渠道不需要桌面端

**桌面端唯一用途**：
- 相机拍照/录像
- 系统屏幕录制
- 执行本地系统命令（`system.run`）

**结论**：如果只需要 IM 机器人和网页截图，**完全可以不装桌面端**。

---

## 💡 最佳实践

### 1. 配置备份

```bash
# 定期备份配置文件
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak.$(date +%Y%m%d)
```

### 2. 敏感信息处理

- App Secret 等凭证存储在 `~/.openclaw/openclaw.json`
- 不要将配置文件提交到 Git
- 可以配合环境变量使用（`FEISHU_APP_ID` 等）

### 3. 浏览器自动化

- 浏览器服务绑定在 `127.0.0.1:18800`
- 使用 Chrome/Brave/Edge（自动检测）
- 截图功能已满足大部分需求，无需桌面端

### 4. 日志排查

```bash
# 查看日志
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log

# 搜索错误
grep -i "error" /tmp/openclaw/openclaw-*.log
```

### 5. 模型选择建议

| 场景 | 推荐模型 |
|------|---------|
| 通用对话 | `qwen3.5-plus` |
| 代码生成 | `qwen3-coder-plus` |
| 图像分析 | `qwen3.5-plus` 或 `kimi-k2.5` |
| 长文本处理 | `qwen3.5-plus` (100万上下文) |

---

## 📁 关键文件位置

| 文件/目录 | 用途 |
|----------|------|
| `~/.openclaw/openclaw.json` | 主配置文件 |
| `~/.openclaw/agents/` | Agent 配置和会话 |
| `~/.openclaw/devices/` | 设备配对信息 |
| `~/.openclaw/extensions/` | 插件安装目录 |
| `~/.openclaw/browser/` | 浏览器数据目录 |
| `/tmp/openclaw/` | 日志文件 |
| `~/Library/LaunchAgents/ai.openclaw.gateway.plist` | 网关服务配置 |

---

## 🎯 功能清单（最终可用）

### ✅ 已启用功能

- 飞书消息收发（文字、图片、文件）
- 钉钉消息收发
- 浏览器自动化（打开网页、截图、点击、输入）
- 飞书工具（文档、知识库、多维表格、云文档）
- 多模型切换（8个模型）

### ❌ 未启用/已移除功能

- ~~相机拍照/录像~~（需要桌面端，已卸载）
- ~~屏幕录制~~（需要桌面端，已卸载）
- ~~本地系统命令执行~~（需要桌面端，已卸载）
- 语义搜索（缺少嵌入模型配置）

---

## 🔗 参考链接

- 飞书配置文档：https://docs.openclaw.ai/zh-CN/channels/feishu
- OpenClaw 文档：https://docs.openclaw.ai/
- 飞书开放平台：https://open.feishu.cn/app

---

## 📝 总结

OpenClaw 的核心价值是**AI + IM 渠道集成**。对于程序员来说：

1. **最小化安装**：只需要 CLI + 网关 + 浏览器
2. **无需桌面端**：浏览器自动化已满足截图需求
3. **配置即代码**：所有配置在 JSON 文件中，可版本控制
4. **插件化架构**：需要哪个渠道就装哪个插件

**一句话建议**：如果你只需要「在飞书里跟 Claude 对话 + 让 Claude 截图网页」，那么不需要安装 macOS 桌面端，CLI 版本完全够用。
