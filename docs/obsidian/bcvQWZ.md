# 跨域时请求的实际发送情况分析

`#跨域` `#bom` 

## 1. 请求发送情况分析

### 1.1. 简单请求（Simple Request）

简单请求**跨域请求的实际发送情况**，但浏览器会**拦截响应**。

```javascript
// 简单请求的条件：
// 1. 请求方法是以下之一：
// - GET
// - HEAD
// - POST

// 2. 请求头只包含以下字段：
// - Accept
// - Accept-Language
// - Content-Language
// - Content-Type (仅限于以下值)
//   - text/plain
//   - multipart/form-data
//   - application/x-www-form-urlencoded

// 简单请求示例
fetch('http://api.example.com/data', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}).catch(error => {
    console.error('跨域错误，但请求已发送到服务器', error);
});
```

### 1.2. 预检请求（Preflight Request）

- 对于非简单请求，浏览器会先发送 OPTIONS 请求进行预检。
- 服务端收到的是预检请求 options

```javascript 
// 非简单请求示例（会触发预检）
fetch('http://api.example.com/data', {
    method: 'PUT', // 非简单方法
    headers: {
        'Content-Type': 'application/json', // 非简单Content-Type
        'X-Custom-Header': 'value' // 自定义头
    },
    body: JSON.stringify({ data: 'test' })
});

// 预检请求实际发送的内容
/*
OPTIONS /data HTTP/1.1
Host: api.example.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type, X-Custom-Header
Origin: http://your-site.com
*/
```

### 1.3. 服务端日志验证

```javascript
// Node.js Express 服务器示例
const express = require('express');
const app = express();

// 记录所有请求
app.use((req, res, next) => {
    console.log(`收到请求：${req.method} ${req.url}`);
    console.log('请求头：', req.headers);
    next();
});

// 处理 OPTIONS 请求
app.options('*', (req, res) => {
    console.log('收到预检请求');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Custom-Header');
    res.sendStatus(200);
});

// 处理实际请求
app.get('/data', (req, res) => {
    console.log('收到 GET 请求');
    // 即使没有设置 CORS 头，服务器也会收到并处理请求
    res.json({ message: 'Hello' });
});
```

### 1.4. 常见场景分析

#### 1.4.1. 场景一：简单请求无 CORS 头

```javascript
// 前端代码
fetch('http://api.example.com/data')
    .then(response => response.json())
    .catch(error => {
        // 请求已发送，但浏览器拦截了响应
        console.error('跨域错误');
    });

// 服务器日志会显示
// "收到 GET 请求 /data"
```

#### 1.4.2. 场景二：非简单请求的预检失败

```javascript
// 前端代码
fetch('http://api.example.com/data', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
}).catch(error => {
    // 预检请求失败，主请求不会发送
    console.error('预检请求失败');
});

// 服务器日志只会显示
// "收到 OPTIONS 请求 /data"
```

#### 1.4.3. 场景三：预检成功但主请求失败

```javascript
// 前端代码
fetch('http://api.example.com/data', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
}).catch(error => {
    // 预检成功，主请求发送但响应被拦截
    console.error('主请求跨域错误');
});

// 服务器日志会显示
// "收到 OPTIONS 请求 /data"
// "收到 PUT 请求 /data"
```

### 1.5. 验证方法

1. **网络面板检查**
```javascript
// 打开浏览器开发者工具
// Network 面板中可以看到：
// - 请求是否发送
// - 预检请求的存在
// - 具体的错误信息
```

2. **服务器日志**
```javascript
// 服务端日志记录
app.use((req, res, next) => {
    console.log({
        method: req.method,
        url: req.url,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
    next();
});
```

3. **抓包工具验证**
```bash
# 使用 tcpdump 抓包
tcpdump -i any port 80 -w capture.pcap

# 使用 Charles 或 Fiddler 等工具查看请求
```

### 1.6. 解决方案

1. **服务端正确配置 CORS**
```javascript
// Express 示例
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

2. **使用代理服务器**
```javascript
// 开发环境 webpack 配置
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://api.example.com',
                changeOrigin: true
            }
        }
    }
};
```

3. **JSONP（仅适用于 GET 请求）**
```javascript
function jsonp(url, callback) {
    const script = document.createElement('script');
    script.src = `${url}?callback=${callback}`;
    document.body.appendChild(script);
}
```

### 1.7. 总结

- **简单请求**：
	- **确实发送到服务器**
	- 服务器会处理请求
	- **浏览器拦截响应**
- **非简单请求**：
	- 先发送预检请求
	- 预检失败则**主请求****不发送**
	- 预检成功则发送**主请求**
- **服务器视角**：
	- 总是能收到成功发送的请求
	- 可以正常处理请求
	- 返回的响应可能被浏览器拦截
- **关键点**：
	- 跨域是浏览器的安全策略
	- 拦截发生在响应阶段
	- 服务器端无法阻止请求发送


当预检请求（OPTIONS）返回不允许跨域时，浏览器**不会**发送真正的请求。让我通过代码和图解来说明这个过程：

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241207-3.png)
