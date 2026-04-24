# HTML 技术关键词

`#前端` `#HTML` `#R2`  

## 1. HTML 技术

1. 语义化标签：如header, nav, main, article, section, aside, footer等
2. 表单元素：input, select, textarea, button等
3. 多媒体标签：audio, video, canvas, svg
4. 元数据：meta标签，用于定义页面的各种元数据
5. 响应式设计：使用viewport meta标签和媒体查询
6. 无障碍性（Accessibility）：使用aria属性，alt文本等
7. 结构化数据：使用microdata, RDFa, JSON-LD等
8. 离线Web应用：使用manifest文件（现在更多使用Service Workers）
9. 本地存储：localStorage, sessionStorage
10. **拖放API：drag and drop**
11. 地理定位：Geolocation API
12. Web Workers：用于在后台运行脚本
13. WebSockets：用于实时双向通信
14. 跨文档消息传递：postMessage API
15. 内容安全策略（CSP）：用于防止XSS攻击
16. 自定义数据属性：`data-属性`
17. 模板：template标签
18. **图片响应式：srcset和sizes属性**
19. 延迟加载：使用 `loading="lazy"` 属性
	1. **标准本来就支持**
20. 表单验证：使用 pattern, required 等属性
21. 输入类型：如date, time, email, url等
22. 字符编码：使用UTF-8
23. DOCTYPE声明：
24. 语言声明：lang属性
25. 链接关系：rel 属性，如 stylesheet , icon 等
26. 跨域资源共享（CORS）：通过 HTTP头部控制
27. 内容可编辑：contenteditable 属性
28. 自动完成：autocomplete 属性
29. 页面可见性API：用于检测页面是否可见
30. 历史API：用于操作浏览历史

## 2. HTMl 技术

### 2.1. 基础知识

- **HTML (HyperText Markup Language)**: 超文本标记语言
- **DOCTYPE**: 文档类型声明
- **元素 (Element)**: HTML的基本构建块
- **标签 (Tag)**: 用于定义HTML元素的标记
- **属性 (Attribute)**: 提供元素的附加信息

### 2.2. 常用标签

- `<html>`: 定义HTML文档的根元素
- `<head>`: 包含文档的元数据
- `<title>`: 定义文档的标题
- `<meta>`: 提供文档的元数据
- `<link>`: 链接外部资源
- `<script>`: 嵌入或引用JavaScript代码
- `<style>`: 嵌入CSS样式
- `<body>`: 定义文档的主体内容
- `<header>`: 定义页面或节的头部
- `<footer>`: 定义页面或节的尾部
- `<nav>`: 定义导航链接
- `<main>`: 定义文档的主要内容
- `<section>`: 定义文档的节
- `<article>`: 定义独立的内容块
- `<aside>`: 定义侧边栏内容
- `<h1>` 到 `<h6>`: 定义标题
- `<p>`: 定义段落
- `<a>`: 定义超链接
- `<img>`: 定义图像
- `<ul>`: 定义无序列表
- `<ol>`: 定义有序列表
- `<li>`: 定义列表项
- `<table>`: 定义表格
- `<tr>`: 定义表格行
- `<td>`: 定义表格单元
- `<th>`: 定义表格头单元
- `<form>`: 定义表单
- `<input>`: 定义输入控件
- `<button>`: 定义按钮
- `<textarea>`: 定义多行文本输入控件
- `<select>`: 定义下拉列表
- `<option>`: 定义下拉列表中的选项
- `<label>`: 定义表单控件的标签
- `<div>`: 定义文档中的分区或区域
- `<span>`: 定义文档中的行内元素

### 2.3. 表单和输入类型

- `<input>` 类型:
	- `text, password, email, url, number, date, time, checkbox, radio, file, submit, reset, button, hidden, color, range, search, tel
- **表单验证属性**:
	- `required, pattern, min, max, minlength, maxlength, step`

### 2.4. 多媒体标签

- `<audio>`: 定义音频内容
- `<video>`: 定义视频内容
- `<source>`: 定义多媒体资源
- `<track>`: 定义视频和音频的文本轨道

### 2.5. 图形和绘图

- `<canvas>`: 用于绘制图形
	- 2d
	- 3d 
		- webGL
- **SVG (Scalable Vector Graphics)**: 可缩放矢量图形

### 2.6. 响应式设计

- `<meta name="viewport">`: 
	- 定义视口属性
- **媒体查询 (Media Queries)**:
	- 用于响应式设计的CSS技术

### 2.7. 本地存储

- **localStorage**:
	- 本地存储数据
- **sessionStorage**: 
	- 会话存储数据

### 2.8. Web Components

- **自定义元素 (Custom Elements)**:
	- 创建**自定义 HTML 标签**
- **Shadow DOM**:
	- 隐藏DOM树
- **HTML模板 (HTML Templates)**:
	- 定义可重用的HTML片段

### 2.9. 语义化和可访问性

- **语义化标签**: 
	- `<header>`, `<footer>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`
- **ARIA (Accessible Rich Internet Applications)**:
	- 增强可访问性的属性

### 2.10. 安全和性能

- **内容安全策略 (CSP)**: 
	- 防止XSS攻击
- **懒加载 (Lazy Loading)**:
	- 延迟加载图像和其他资源
- **预加载 (Preloading)**: 
	- 提前加载关键资源

### 2.11. 其他相关技术

- **HTML5**: 
	- HTML 的最新版本
- **CSS (Cascading Style Sheets)**: 
	- 层叠样式表，用于样式和布局
- **JavaScript**: 
	- 用于交互和动态内容的编程语言
- **DOM (Document Object Model)**: 
	- 文档对象模型
- **SEO (Search Engine Optimization)**: 
	- 搜索引擎优化
