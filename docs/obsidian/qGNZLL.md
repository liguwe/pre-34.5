# Node.js 中提高网络传输速度的主要方法

`#nodejs` 

## 1. 总结

- 启用`压缩`
- 使用 HTTP/2
- 实现合适的`缓存`策略
- 使用`流式`传输
- 保持`长连接`
- 负载均衡
- 使用`内存缓存`

> 根据具体场景选择合适的优化方案，通常需要**多种方案组合使用**才能达到最佳效果。

## 2. 启用 Gzip 压缩

```javascript
const express = require('express');
const compression = require('compression');
const app = express();

// 启用 Gzip 压缩
app.use(compression({
    // 只压缩大于 1kb 的响应
    threshold: 1024,
    // 设置压缩级别
    level: 6,
    // 设置需要压缩的类型
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
```

## 3. 使用 HTTP/2

```javascript
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
});

server.on('stream', (stream, headers) => {
    // HTTP/2 支持多路复用
    stream.respond({
        'content-type': 'text/html',
        ':status': 200
    });
    stream.end('<h1>Hello World</h1>');
});
```

## 4. 实现缓存策略：HTTP 缓存： `Cache-Control/Etag`

```javascript
const express = require('express');
const app = express();

// 静态文件缓存
app.use(express.static('public', {
    maxAge: '1d',  // 缓存一天
    etag: true,    // 启用 ETag
    lastModified: true
}));

// API 响应缓存
app.get('/api/data', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('ETag', 'W/"123-123"');
    
    // 检查是否命中缓存
    if (req.fresh) {
        return res.status(304).end();
    }
    
    res.json({ data: 'some data' });
});
```

## 5. 使用流式传输 ： 如`fs.createReadStream`

```javascript
const fs = require('fs');

// 文件传输使用流
app.get('/download', (req, res) => {
    const fileStream = fs.createReadStream('large-file.mp4');
    fileStream.pipe(res);
});

// 大数据响应使用流
app.get('/large-data', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    
    const streamData = async function*() {
        for (let i = 0; i < 1000000; i++) {
            yield JSON.stringify({ id: i }) + '\n';
        }
    };
    
    const stream = Readable.from(streamData());
    
    stream.pipe(res);
    
});
```

## 6. 启用 Keep-Alive

```javascript hl:5,4
const http = require('http');

const server = http.createServer((req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=5');
});

// 或使用 agent
const agent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 3000,
    maxSockets: 100
});
```

## 7. 使用负载均衡  →  

> 主进程：只用于创建多个 `cluster 进程`
> 非主进程：用于创建 `express 服务`，因为任务是隔离的

```javascript hl:4,9
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // 主进程创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // 工作进程创建服务器
    const express = require('express');
    const app = express();
    app.listen(3000);
}
```

## 8. 使用**内存缓存**  →  `node-cache`

```javascript hl:1,2
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100 });

app.get('/api/data', async (req, res) => {
    const key = req.url;
    const cachedData = myCache.get(key);
    
    if (cachedData) {
        return res.json(cachedData);
    }
    
    const data = await fetchData();
    myCache.set(key, data);
    res.json(data);
});
```
