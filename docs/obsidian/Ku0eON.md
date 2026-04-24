# Node.js 中的通信方式都有哪些

`#nodejs` 

## 1. 总结

- child_process：
	- 适用于`父子进程`通信
- cluster：
	- 适用于`主从架构的多进程应用`
- Socket：
	- 适用于`跨机器`的进程通信 
- 消息队列：
	- 适用于解耦的异步通信 （redis）
- 共享**内存**：
	- 适用于高性能数据共享（`worker_threads`）
- HTTP / HTTPS：
	- 适用于 `RESTful` 服务通信
- WebSocket：
	- 适用于实时**双向通信**
- 进程管理：
	- 适用于复杂的多进程应用

> 下面展开聊

## 2. child_process 子进程通信

- `spawn` 方式
- `fork` 方式

```javascript hl:1,19
// 1.1 spawn 方式
const { spawn } = require('child_process');

// 父进程
const child = spawn('node', ['child.js']);

child.stdout.on('data', (data) => {
    console.log('子进程输出：', data.toString());
});

child.stderr.on('data', (data) => {
    console.error('子进程错误：', data.toString());
});

child.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
});

// 1.2 fork 方式
const { fork } = require('child_process');

// 父进程 (parent.js)
const child = fork('./child.js');

// 发送消息给子进程
child.send({ hello: 'world' });

// 接收子进程消息
child.on('message', (message) => {
    console.log('收到子进程消息:', message);
});

// 子进程 (child.js)
process.on('message', (message) => {
    console.log('收到父进程消息:', message);
    // 回复父进程
    process.send({ received: true });
});
```

## 3. cluster **集群模式**通信

```javascript hl:34,39
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // 主进程代码
    console.log(`主进程 ${process.pid} 正在运行`);

    // 生成工作进程
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();

        // 主进程发送消息给工作进程
        worker.send({ type: 'hello', from: 'master' });

        // 接收工作进程消息
        worker.on('message', (message) => {
            console.log(`主进程收到来自工作进程 ${worker.id} 的消息:`, message);
        });
    }

    // 监听工作进程退出
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
} else {
    // 工作进程代码
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('你好，世界\n');
    }).listen(8000);

    // 工作进程接收消息
    process.on('message', (message) => {
        console.log(`工作进程 ${process.pid} 收到消息:`, message);
    });

    // 工作进程发送消息给主进程
    process.send({ type: 'ready', pid: process.pid });
}
```

## 4. Socket 通信

```javascript
// 3.1 TCP Socket
const net = require('net');

// TCP 服务器
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log('收到数据:', data.toString());
        socket.write('服务器已收到消息');
    });
});

server.listen(8080, () => {
    console.log('TCP 服务器启动在端口 8080');
});

// TCP 客户端
const client = new net.Socket();
client.connect(8080, 'localhost', () => {
    client.write('你好，服务器');
});

// 3.2 Unix Domain Socket
const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log('收到数据:', data.toString());
    });
});

server.listen('/tmp/node.sock');
```

## 5. 消息队列（使用 Redis）

```javascript
const Redis = require('ioredis');
const redis = new Redis();

// 发布者
class Publisher {
    constructor() {
        this.redis = new Redis();
    }

    publish(channel, message) {
        return this.redis.publish(channel, JSON.stringify(message));
    }
}

// 订阅者
class Subscriber {
    constructor() {
        this.redis = new Redis();
    }

    subscribe(channel, callback) {
        this.redis.subscribe(channel, (err, count) => {
            if (err) {
                console.error('订阅错误:', err);
                return;
            }
            console.log(`订阅了 ${count} 个频道`);
        });

        this.redis.on('message', (channel, message) => {
            callback(channel, JSON.parse(message));
        });
    }
}

// 使用示例
const publisher = new Publisher();
const subscriber = new Subscriber();

subscriber.subscribe('news', (channel, message) => {
    console.log(`收到来自 ${channel} 的消息:`, message);
});

publisher.publish('news', { title: '重要通知', content: '系统更新' });
```

## 6. 共享内存（使用 Node.js worker_threads）

```javascript
const { Worker, isMainThread, parentPort, workerData, SharedArrayBuffer } = require('worker_threads');

if (isMainThread) {
    // 主线程代码
    const sharedBuffer = new SharedArrayBuffer(1024);
    const sharedArray = new Int32Array(sharedBuffer);

    const worker = new Worker(__filename, {
        workerData: { sharedBuffer }
    });

    worker.on('message', (message) => {
        console.log('主线程收到消息:', message);
        console.log('共享内存数据:', sharedArray[0]);
    });

    // 修改共享内存
    sharedArray[0] = 100;
    worker.postMessage('已更新共享内存');
} else {
    // 工作线程代码
    const sharedArray = new Int32Array(workerData.sharedBuffer);

    parentPort.on('message', (message) => {
        console.log('工作线程收到消息:', message);
        console.log('共享内存数据:', sharedArray[0]);
        
        // 修改共享内存
        sharedArray[0] += 1;
        parentPort.postMessage('工作线程已修改共享内存');
    });
}
```

## 7. HTTP/HTTPS 通信

```javascript
const http = require('http');
const axios = require('axios');

// HTTP 服务器
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('收到数据:', JSON.parse(body));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
        });
    }
});

server.listen(3000, () => {
    console.log('HTTP 服务器运行在端口 3000');
});

// HTTP 客户端
async function sendRequest() {
    try {
        const response = await axios.post('http://localhost:3000', {
            message: '你好，服务器'
        });
        console.log('服务器响应:', response.data);
    } catch (error) {
        console.error('请求错误:', error);
    }
}
```

## 8. WebSocket 通信

```javascript
const WebSocket = require('ws');

// WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('新的连接建立');

    ws.on('message', (message) => {
        console.log('收到消息:', message.toString());
        // 广播消息给所有客户端
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

// WebSocket 客户端
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    ws.send('客户端连接成功');
});

ws.on('message', (data) => {
    console.log('收到服务器消息:', data.toString());
});
```

## 9. 进程管理和监控

```javascript
class ProcessManager {
    constructor() {
        this.workers = new Map();
        this.setupMaster();
    }

    setupMaster() {
        cluster.setupMaster({
            exec: 'worker.js',
            args: ['--use', 'http']
        });

        cluster.on('online', (worker) => {
            console.log(`工作进程 ${worker.process.pid} 已启动`);
            this.workers.set(worker.id, worker);
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log(`工作进程 ${worker.process.pid} 退出`);
            this.workers.delete(worker.id);
            
            // 自动重启进程
            if (signal !== 'SIGTERM') {
                this.createWorker();
            }
        });
    }

    createWorker() {
        const worker = cluster.fork();
        return worker;
    }

    broadcastMessage(message) {
        for (const worker of this.workers.values()) {
            worker.send(message);
        }
    }

    shutdown() {
        for (const worker of this.workers.values()) {
            worker.kill('SIGTERM');
        }
    }
}

// 使用示例
const manager = new ProcessManager();
// 创建工作进程
for (let i = 0; i < require('os').cpus().length; i++) {
    manager.createWorker();
}

// 广播消息
manager.broadcastMessage({ type: 'config', data: { port: 8000 } });
```
