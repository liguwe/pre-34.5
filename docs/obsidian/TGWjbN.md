# TIME_WAIT 过多的原因以及解决方案

`#nodejs` 

## 1. TIME_WAIT 过多的原因

### 1.1. 短连接过多

```javascript
// 不良示例：频繁创建短连接
const http = require('http');

setInterval(() => {
    http.get('http://example.com', (res) => {
        // 处理完立即关闭
        res.on('end', () => {
            // 连接关闭，进入 TIME_WAIT
        });
    });
}, 100);
```

### 1.2. 客户端主动关闭连接

```javascript
// 不良示例：客户端频繁主动关闭连接
const net = require('net');
const client = new net.Socket();

client.connect(3000, '127.0.0.1', () => {
    client.end(); // 客户端主动关闭，将产生 TIME_WAIT
});
```

### 1.3. 高并发下的**连接复用不足**

## 2. 解决方案

### 2.1. 启用 TCP keepalive 保持长连接

```javascript hl:2
// 服务端启用 keepalive
const server = net.createServer((socket) => {
    socket.setKeepAlive(true, 60000); // 60秒
});

// 或在 HTTP 服务中
const server = http.createServer((req, res) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=5'); // 5秒超时
});
```

### 2.2. 使用**连接池**

```javascript
// 使用连接池示例
const generic_pool = require('generic-pool');

const factory = {
    create: async () => {
        const client = new net.Socket();
        await new Promise((resolve) => {
            client.connect(3000, '127.0.0.1', resolve);
        });
        return client;
    },
    destroy: (client) => {
        return new Promise((resolve) => {
            client.end();
            client.on('close', resolve);
        });
    }
};

const pool = generic_pool.createPool(factory, {
    max: 10, // 最大连接数
    min: 2   // 最小连接数
});
```

### 2.3. 系统层面优化

```bash
# 修改 TIME_WAIT 超时时间
sysctl -w net.ipv4.tcp_fin_timeout=30

# 允许 TIME_WAIT 状态的 socket 重用
sysctl -w net.ipv4.tcp_tw_reuse=1

# 快速回收 TIME_WAIT 连接
sysctl -w net.ipv4.tcp_tw_recycle=1  # 注意：在 Linux 4.12+ 已被移除
```

### 2.4. 负载均衡 →  使用 Node.js cluster 模块做负载均衡

```javascript
// 使用 Node.js cluster 模块做负载均衡
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // 启动多个工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // 工作进程创建服务器
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
}
```

## 3. 最佳实践建议

### 3.1. 服务端设计

   - 尽量使用**长连接**
   - 实现**连接池**机制
   - 合理配置 keepalive 参数

### 3.2. 客户端设计

   - 使用**连接池**
   - **避免频繁创建短连接**
   - 适当使用**长连接**

### 3.3. 系统配置

   - 适当调整系统参数
   - 配置负载均衡
   - 监控 `TIME_WAIT` 状态

### 3.4. 架构优化

   - 使用反向代理
   - 实现服务端负载均衡
   - 合理设置超时时间
