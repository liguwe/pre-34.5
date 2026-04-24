# X-XSS-Protection 头部、 Subresource Integrity (SRI)

`#前端安全`  

## 1. 总结

- X-XSS-Protection 
	- 主要针对**旧版浏览器**，提供了一个**额外的 XSS 防护层**
- `Subresource Integrity (SRI)`
	- 是一种更现代的安全特性，它通过验证资源的完整性来**防止资源被篡改**，览器可以用这个哈希来验证下载的资源
		- script 标签的 integrity 属性
		- link 标签的 integrity 属性
	- **只适用**于通过 `HTTPS` 提供的资源

## 2. 定义

`X-XSS-Protection 头部`和 `Subresource Integrity (SRI)` 都是增强 Web 应用程序安全性的重要工具
- X-XSS-Protection 主要针对**旧版浏览器**，提供了一个**额外的 XSS 防护层**
- 而 `SRI` 则是一种更现代的安全特性，它通过验证资源的完整性来**防止资源被篡改**

## 3. X-XSS-Protection 头部

- X-XSS-Protection 是一个 **HTTP 响应头**，用于启用浏览器内置的跨站脚本（XSS）过滤器。
- 这个头部主要针对旧版本的浏览器，因为现代浏览器已经内置了更先进的 XSS 防护机制。

### 3.1. 语法

```http
X-XSS-Protection: <value>
```

### 3.2. 可能的值

- 0: 禁用 XSS 过滤器
- 1: 启用 XSS 过滤器（通常是浏览器默认值）
- 1; mode=block: 启用 XSS 过滤器，并在检测到 XSS 攻击时，阻止页面加载
- 1; `report=<reporting-URI>:` 启用 XSS 过滤器，并在检测到 XSS 攻击时报告违规行为

### 3.3. 示例

```http
X-XSS-Protection: 1; mode=block
```

### 3.4. 实现（使用 Express.js）

```javascript hl:10
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet.xssFilter());

// 或者手动设置
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 其他应用程序代码...
```

### 3.5. 注意事项

- 这个头部主要针对旧版浏览器，现代浏览器可能会忽略它
- 不应该单独依赖这个头部来防御 XSS 攻击
- 应该与其他安全措施（如 CSP）结合使用

## 4. Subresource Integrity (SRI)

SRI 是一种安全特性，允许**浏览器检查获取的资源（如 JavaScript 或 CSS 文件）是否被篡改**。它通过提供一个**加密哈希**来工作，浏览器可以用这个哈希来验证下载的资源。

### 4.1. 工作原理

- 为资源生成一个加密哈希
- 在 HTML 中引用资源时包含这个哈希
	- 这个属性 **integrity**
- 浏览器下载资源并验证其完整性

### 4.2. 语法

```html hl:2
<script src="https://example.com/example-framework.js" 
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

### 4.3. 生成 SRI 哈希

可以使用在线工具或命令行工具生成 SRI 哈希。例如，使用 OpenSSL：

```bash
cat FILENAME.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### 4.4. 实现示例

```html hl:7,13
<!DOCTYPE html>
<html>
<head>
    <title>SRI Example</title>
    <link rel="stylesheet" 
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" 
          crossorigin="anonymous">
</head>
<body>
    <!-- 页面内容 -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" 
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" 
            crossorigin="anonymous"></script>
</body>
</html>
```

### 4.5. SRI 的优势

- 防止由于 CDN 遭到入侵或中间人攻击导致的资源篡改
- 增加对第三方资源的信任
- 与 CSP 结合使用可以提供更强的安全保障

### 4.6. 注意事项

- **只适用**于通过 `HTTPS` 提供的资源
- 如果资源经常更新，可能需要频繁更新完整性哈希
- 不是所有浏览器都支持 SRI

### 4.7. 服务器端实现（使用 Express.js）

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();

app.use((req, res, next) => {
  res.locals.generateSRI = (content) => {
    const hash = crypto.createHash('sha384');
    hash.update(content);
    return `sha384-${hash.digest('base64')}`;
  };
  next();
});

app.get('/', (req, res) => {
  const scriptContent = 'console.log("Hello, SRI!");';
  const integrity = res.locals.generateSRI(scriptContent);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SRI Example</title>
    </head>
    <body>
      <script integrity="${integrity}">${scriptContent}</script>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
