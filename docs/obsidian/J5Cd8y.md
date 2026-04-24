# HTML 技术清单

`#前端` `#HTML` 

## 1. HTML5

- 介绍：HTML的最新版本，提供了许多新特性 和 API。
- 特点：语义化标签、新的表单控件、多媒体支持（audio、video）、本地存储（localStorage、sessionStorage）

## 2. 语义化标签

- 介绍：使用具有明确含义的标签来构建页面结构。
- 特点：提高可读性和可维护性、增强SEO、改善无障碍访问。
- 示例：`<header>`, `<footer>`, `<article>`, `<section>`, `<nav>`, `<aside>`。

## 3. 表单元素和验证

- 介绍：HTML5 引入了许多新的表单控件和属性，简化了表单的创建和验证。
- 特点：新的输入类型（如`email`, `url`, `date`）、表单验证属性（如`required`, `pattern`）、增强的用户体验。

## 4. 多媒体元素

- 介绍：HTML5 引入了原生的多媒体支持。
- 特点：`<audio>`和`<video>`标签，支持嵌入音频和视频内容，无需第三方插件。

## 5. Canvas

- 介绍：用于绘制2D图形的HTML元素。
- 特点：通过JavaScript绘制图形、动画和游戏。

## 6. SVG

- 介绍：可缩放矢量图形，基于XML的图像格式。
- 特点：高质量的图形、可交互、可动画化、支持CSS样式。

## 7. 本地存储

- 介绍：HTML5 提供了两种本地存储机制：localStorage 和 sessionStorage。
- 特点：
	- 持久化存储（localStorage）、会话存储（sessionStorage）、简化客户端数据管理。
	- 还有 indexDB 

## 8. 离线支持

- 介绍：通过`<manifest>`文件 和`Service Workers`实现离线支持。
- 特点：离线访问、缓存资源、提高应用的可靠性。

## 9. Web Workers

- 介绍：在后台线程中运行JavaScript代码，避免阻塞主线程。
- 特点：并行处理、提高性能、增强用户体验。

## 10. ARIA（Accessible Rich Internet Applications）

- 介绍：一组属性，用于增强Web内容的可访问性。
- 特点：改善无障碍访问、提高屏幕阅读器支持、增强用户体验。

## 11. 自定义数据属性

- 介绍：使用`data-*`属性在HTML元素中存储自定义数据。
- 特点：灵活的数据存储、简化 JavaScript 交互。

## 12. 模板元素

- 介绍：`<template>`标签，用于定义可重用的 HTML 片段
- 特点：
	- **延迟渲染、提高性能、增强代码复用性。**

## 13. Shadow DOM

- 介绍：Web Components 的一部分，用于封装元素的内部结构和样式。
- 特点：
	- 样式隔离、避免样式冲突、提高组件化开发。

## 14. 自定义元素

- 介绍：Web Components 的一部分，允许创建自定义的HTML标签。
- 特点：增强 HTML 的可扩展性、提高代码复用性、与框架无关。

## 15. 响应式设计

- 介绍：
	- 使用HTML 和 CSS 技术创建适应不同设备和屏幕尺寸的页面。
- 特点：
	- 媒体查询、弹性布局、视口设置。

## 16. 微数据（Microdata）

- 介绍：一种嵌入 HTML 的结构化数据的方式。
- 目的: 
	- 为 HTML元素 添加机器可读的标签, 描述其含义
- 组成: 主要由 `itemscope, itemtype, 和 itemprop 属性`组成。
	- itemscope: 
		- 创建一个新的项目,表示其中包含的标记描述了一个特定的项目。
	- itemtype:
		- 指定项目的类型,通常是一个URL,指向一个词汇表或架构。
	- itemprop:  
		- 定义项目的属性
- 特点：**增强 SEO、提高搜索引擎理解页面内容的能力**。
	- 其实对于**大模型理解页面也有帮助**
- 常用词汇表：Schema.org，最广泛使用的结构化数据词汇表，由主要搜索引擎共同支持。

```html
<div itemscope itemtype="http://schema.org/Person">  
  <span itemprop="name">John Doe</span>
  <span itemprop="jobTitle">Software Developer</span>
  <a href="mailto:john@example.com" itemprop="email">john@example.com</a>
</div>  
```

>  https://developer.mozilla.org/zh-CN/docs/Web/HTML/Microdata

## 17. 内容安全策略（CSP）

- 介绍：一种Web安全策略，用于防止跨站脚本攻击（XSS）等安全威胁。
- 特点：定义允许加载的资源、提高安全性、减少攻击面。

内容安全策略（`Content Security Policy`，简称CSP）是一种重要的Web安全机制，用于防止跨站脚本攻击（XSS）、数据注入等攻击。

### 17.1. 基本概念

CSP是一种由`服务器`声明的安全策略，它告诉`浏览器`哪些资源可以被`加载和执行`。

### 17.2. 主要目标

- 防止 XSS 攻击
- 减少数据注入风险
- 报告违规行为
- 强制使用 `HTTPS`

### 17.3. 工作原理

CSP通过`HTTP 头部 或 meta 标签`来实现，指定允许加载的资源的来源。

### 17.4. 实现方式

#### 17.4.1. HTTP 头部方式

```
Content-Security-Policy: directive1 source1 source2; directive2 source3 source4
```

#### 17.4.2. Meta标签方式

```html
<meta http-equiv="Content-Security-Policy" content="directive1 source1 source2; directive2 source3 source4">
```

### 17.5. 常用指令

- `default-src`: 默认加载策略
- `script-src`: JavaScript 来源
- `style-src`: CSS 样式来源
- `img-src`: 图片来源
- `connect-src`: AJAX、WebSocket 等连接来源
- `font-src`: 字体文件来源
- `object-src`: 插件来源（如 Flash）
- `media-src`: 音视频来源
- `frame-src`: iframe 来源

> 即规定了所有可能加载资源的来源要求

### 17.6. 示例

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src *
```

这个策略允许：

- 默认只加载同源资源
- 脚本只能从自身域名和 trusted.cdn.com 加载
- 图片可以从任何源加载

### 17.7. 报告模式

可以使用`Content-Security-Policy-Report-Only`头部来测试策略，不实际阻止资源，只报告违规。

### 17.8. 违规报告

可以通过`report-uri`指令指定违规报告的接收地址。

### 17.9. 优势

- 大幅降低 XSS 风险
- 控制资源加载，提高安全性
- 强制使用 HTTPS，保护数据传输
- 提供违规报告，便于监控和调试

### 17.12. 与其他安全措施的结合： → **强制使用 HTTPS 链接**

- HSTS (HTTP Strict Transport Security)
	- HSTS 是一个重要的网络安全机制，它通过强制 HTTPS 连接来提供更好的安全保护
	- 响应头配置示例：
		- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- X-Frame-Options
- X-XSS-Protection

## 18. Web Components

- 介绍：一组Web平台API，用于创建可复用的自定义元素。
- 特点：组件化开发、样式和功能封装、与框架无关。

## 19. 媒体查询

- 介绍：用于在不同设备和屏幕尺寸上应用不同的CSS样式。
- 特点：响应式设计、提高用户体验、适应多种设备。
