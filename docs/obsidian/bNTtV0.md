# socket hang up

`#nodejs` `#后端`

## 1. 主要原因

>  socket hang up 表示连接意外中断，通常是因为**在客户端还在等待响应时，服务器关闭了连接**

## 2. 常见场景

### 2.1. 请求超时

```javascript
// 服务端设置了超时时间，但处理时间过长
const server = http.createServer((req, res) => {
    // 长时间操作，超过了默认超时时间
    setTimeout(() => {
        res.end('done');  // 可能已经超时，触发 socket hang up
    }, 2 * 60 * 1000);
});
```

### 2.2. 服务端提前关闭

```javascript
// 服务端提前结束响应
app.get('/api', (req, res) => {
    res.socket.destroy();  // 强制关闭连接
    // 或
    res.destroy();
});
```

### 2.3. 代理超时

```javascript
// 代理请求超时
const proxy = http.request(options, (res) => {
    // 处理响应
});
// 未设置超时处理
proxy.end();
```

## 3. 解决方案

### 3.1. 设置合适的超时时间

```javascript
// 服务端
server.timeout = 120000; // 设置2分钟超时

// 客户端
const req = http.request(options);
req.setTimeout(120000);
```

### 3.2. 正确的错误处理

```javascript
const axios = require('axios');

axios.get('/api')
    .catch(error => {
        if (error.code === 'ECONNRESET') {
            console.log('连接被重置');
        }
    });
```

### 3.3. 实现重试机制

```javascript
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetch(url);
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(r => setTimeout(r, 1000 * i));
        }
    }
}
```

### 3.4. 使用 keep-alive

```javascript hl:3
const agent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 3000
});
```

### 3.5. 总结

- 设置合理的超时时间
- 添加错误处理
- 实现重试机制
- 使用长连接（适当场景）
