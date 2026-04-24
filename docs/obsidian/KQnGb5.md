# 内容安全策略（Content Security Policy，简称 CSP）

`#前端安全` 

## 总结

- CSP 通过声明一系列内容限制来**告诉浏览器从哪些源加载内容是安全的**
	- 这些限制通常通过 **HTTP 头部或 meta 标签**来实现
- CSP 对 CSRF 的防护能力有限，对 XSS 更有效
- CPS 指令
	- 控制 JavaScript、CSS、字体、音视频、iframe 的**源**
- 其他
	- CSP 可以配置为**仅报告违规**，而不实际阻止内容
	- 可配置不准使用 `eval()` 等动态代码执行方法
	- 也可配置：控制 Web Worker 的行为


## 1. 定义

CSP 是一种额外的安全层，用于**检测和缓解某些类型的攻击**，包括跨站脚本（XSS）和数据注入攻击。

> - CSP 对 CSRF 的防护能力有限

## 2. CSP 的工作原理

CSP 通过声明一系列内容限制来告诉**浏览器从哪些源加载内容是安全的**。这些限制通常通过 **HTTP 头部或 meta 标签**来实现。

## 3. CSP 的主要目标

- 缓解 XSS 攻击
- 防止未经授权的数据注入
- 控制资源加载
- 报告违规行为

## 4. CSP 指令

CSP 使用多种指令来控制不同类型的资源。以下是一些常见的指令：

- `default-src`: 
	- 为其他 CSP 指令提供一个默认值
- `script-src`:
	- 控制 JavaScript 源
- `style-src`: 
	- 控制 CSS 源
- `img-src`: 
	- 控制图片源
- `connect-src`: 
	- 控制可以通过脚本接口加载的 URL
- `font-src`: 
	- 控制字体文件源
- `object-src`: 
	- 控制插件源（如 Flash）
- `media-src`:
	- 控制音频和视频源
- `frame-src`:
	- 控制框架源

## 5. CSP 实现示例

### 5.1. 通过 HTTP 头部

>  使用 `;` 分隔开了

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://img.example.com; style-src 'self' 'unsafe-inline';
```

### 5.2. 通过 HTML meta 标签

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://img.example.com; style-src 'self' 'unsafe-inline';">
```

## 6. CSP 的特殊关键字

- `'self'`: 
	- 允许来自同一源的内容
- `'unsafe-inline'`: 
	- **允许内联脚本和样式**
- `'unsafe-eval'`: 
	- 允许使用 `eval()` 等动态代码执行方法
- `'none'`: 
	- 不允许任何内容

## 7. CSP 报告

CSP 可以配置为**仅报告违规**，而不实际阻止内容：

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-violation-report-endpoint/
```

## 8. CSP 的优势

- 减少 XSS 攻击面
- 控制资源加载，提高安全性
- 提供违规报告机制
- 强制执行最佳安全实践

## 9. CSP 的挑战

- 可能需要大量的**初始配置**
- 可能影响**某些遗留代码或第三方脚本**
- 需要持续维护和更新

## 10. CSP 与其他安全措施的结合

- 结合 HTTPS 使用以确保策略的完整性
- 与 `X-XSS-Protection 头部`一起使用
- 配合 `Subresource Integrity (SRI)` 使用，进一步验证外部资源

> 后文有介绍

## 11. CSP 3 的新特性

- 严格动态代码执行：`'strict-dynamic'`
- 外部脚本散列：
	- 允许特定的外部脚本
- Worker 支持：
	- 控制 Web Worker 的行为

示例代码（使用 Express.js 设置 CSP）：

```javascript hl:2
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'https://trusted.cdn.com'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://img.example.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    }
}));

// 其他应用程序代码...

app.listen(3000, () => console.log('Server running on port 3000'));
```
