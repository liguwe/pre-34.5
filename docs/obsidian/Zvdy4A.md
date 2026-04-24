# Nodejs 的单线程与多核

`#nodejs` 

## 1. 总结

- **IO 密集**型：
	- 使用异步 I/O 即可，不需要多进程/多线程
- **CPU 密集型**应用：
	- 使用 Worker Threads
- Web 服务器：
	- 通过 **cluster 模块**实现**多进程、多核**
		- 多核 = 多线程，对于 node 而言
		- 适合任务是**隔离的** ，比如 HTTP 服务器

## 2. Node.js 中的进程和线程机制

### 2.1. 基本概念

- 进程（Process）：
	- 是操作系统分配资源的最小单位，每个进程都有自己**独立的内存空间**
- 线程（Thread）：
	- 是 CPU 调度的最小单位，同一进程内的线程**共享内存空间**

### 2.2. Node.js 的单线程特性

- Node.js 默认运行在`单线程环境`中，这个主线程被称为"事件循环"（Event Loop）
- 虽然是单线程
	- 使用**事件驱动**和**非阻塞 I/O 模型**来处理并发
	- 但通过**事件循环**可以**高效处理大量并发连接**

### 2.3. 多进程支持：child_process 模块

- Node.js 提供了 `child_process` 模块，允许`创建子进程`
	- 常用的方法包括：
		- `fork()`: 专门用于创建 Node.js 进程
		- `spawn()`: 启动一个子进程来执行命令
		- `exec()`: 启动一个 shell 并在 shell 中执行命令
- 通过 `cluster` 模块可以**创建共享服务器端口的子进程** 

### 2.4. 多线程支持：Worker Threads（工作线程） 

- Node.js 从版本 10.5.0 开始引入了 `worker_threads` 模块
- 允许在 Node.js 中运行**真正的多线程代码**
	- 特点：
		- 线程之间可以共享内存
		- 通过消息传递进行通信
		- 每个工作线程都有自己的事件循环

### 2.5. 进程 vs 工作线程

- 进程：
	- 独立的内存空间
	- 更高的资源开销
	- 适合 `CPU 密集型`任务
	- 通过 `IPC`（进程间通信）交换数据
- 工作线程：
	- 共享内存空间
	- 更低的资源开销
	- 适合并行计算
	- 通过 `postMessage()` 进行通信 

### 2.6. 最佳实践

- CPU 密集型任务：
	- 使用 Worker Threads
- I/O 密集型任务：
	- 使用异步操作即可
- 需要隔离的任务：
	- 使用`子进程`
- 需要扩展到多核：
	- 使用 `cluster 模块`

#### 2.6.1. 创建工作线程

````javascript  hl:14,6
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 这段代码运行在主线程
  const worker = new Worker(__filename);
  worker.on('message', (msg) => {
    console.log('从工作线程收到:', msg);
  });
  worker.postMessage('Hello, Worker!');
} else {
  // 这段代码运行在工作线程
  parentPort.on('message', (msg) => {
    console.log('从主线程收到:', msg);
    parentPort.postMessage('Hello, Main Thread!');
  });
}
````

#### 2.6.2. 创建子进程

````javascript hl:7,10
const { fork } = require('child_process');

// 创建子进程
const child = fork('child.js');

// 发送消息给子进程
child.send({ hello: 'world' });

// 接收子进程的消息
child.on('message', (msg) => {
  console.log('从子进程收到:', msg);
});
````

### 2.7. 注意事项

1. 不要为了使用多线程而使用多线程，Node.js 的单线程模型在大多数情况下已经足够高效
2. 在使用 Worker Threads 时要注意**内存管理**，避免过度创建线程
3. 进程间通信会有性能开销，需要根据实际场景选择合适的方案
4. 在使用**集群模式**时，要注意**状态同步问题**

## 3. nodejs是单线程的， 那么它是如何利用现代计算机的多核能力的

虽然 Node.js 的主线程是单线程的，但它提供了**多种方式**来利用多核处理器：

### 3.1. Node.js 的单线程本质

Node.js 的`单线程`主要体现在：

- 事件循环（Event Loop）运行在单个线程上
- JavaScript 代码执行在`主线程`上
- 用户代码的同步操作都在这个`主线程`上执行

```javascript
// 典型的单线程示例
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// 输出顺序：1, 3, 2
// 即使 setTimeout 为0，也会在主线程执行完后才执行
```

### 3.2. 利用多核的主要方式

#### 3.2.1. 使用 Cluster 模块来实现多进程

```javascript hl:6,11
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // 主进程
    console.log(`主进程 ${process.pid} 正在运行`);

    // 衍生工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
} else {
    // 工作进程可以共享任何 TCP 连接
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('你好世界\n');
    }).listen(8000);

    console.log(`工作进程 ${process.pid} 已启动`);
}
```

#### 3.2.2. 使用 Worker Threads 模块来实现工作线程

```javascript hl:3,8,9
const { Worker, isMainThread, parentPort } = require('worker_threads');

// 主线程
if (isMainThread) {
    // 这段代码运行在主线程

    // 创建多个工作线程
    const worker1 = new Worker(__filename);
    const worker2 = new Worker(__filename);

    // 接收工作线程的消息
    worker1.on('message', (msg) => {
        console.log('来自工作线程1的消息:', msg);
    });

    worker2.on('message', (msg) => {
        console.log('来自工作线程2的消息:', msg);
    });

    // 向工作线程发送消息
    worker1.postMessage('开始任务1');
    worker2.postMessage('开始任务2');
} else {
    // 这段代码运行在工作线程
    parentPort.on('message', (msg) => {
        // 执行CPU密集型任务
        const result = heavyComputation();
        parentPort.postMessage(result);
    });
}
```

### 3.3. 内置的异步并行处理

Node.js 通过 `libuv 库`提供的`线程池`来处理某些异步操作
- 比如`文件操作`、`加密操作`，他们都会在**另外的线程池**中操作，从而不会影响主线程

```javascript hl:4,10
const fs = require('fs');
const crypto = require('crypto');

// 文件操作会使用线程池
fs.readFile('large-file.txt', (err, data) => {
    if (err) throw err;
    console.log('文件读取完成');
});

// CPU密集型的加密操作也会使用线程池
crypto.pbkdf2('密码', '盐值', 100000, 512, 'sha512', (err, key) => {
    if (err) throw err;
    console.log('加密完成');
});

// 这些操作会并行执行
console.log('主线程继续执行');
```

### 3.4. 实际应用示例

#### 3.4.1. 使用 worker_threads 来处理 CPU密集型任务处理（多线程池）

```javascript
const { Worker } = require('worker_threads');

class WorkerPool {
    constructor(numThreads) {
        this.workers = [];
        this.freeWorkers = [];

        // 创建工作线程池
        for (let i = 0; i < numThreads; i++) {
            const worker = new Worker('./worker.js');
            this.workers.push(worker);
            this.freeWorkers.push(worker);
        }
    }

    async runTask(data) {
        return new Promise((resolve, reject) => {
            if (this.freeWorkers.length === 0) {
                reject(new Error('没有可用的工作线程'));
                return;
            }

            const worker = this.freeWorkers.pop();
            
            worker.once('message', (result) => {
                this.freeWorkers.push(worker);
                resolve(result);
            });

            worker.once('error', reject);
            worker.postMessage(data);
        });
    }
}

// 使用示例
const pool = new WorkerPool(4); // 创建4个工作线程
pool.runTask({ type: 'compute', data: [1,2,3,4] })
    .then(result => console.log('计算结果:', result))
    .catch(err => console.error('错误:', err));
```

#### 3.4.2. 使用 **cluster 模块** 来处理 Web服务器负载均衡

示例：利用计算机的多核能力启动多个 HTTP 服务器，以实现负载均衡，如下代码：

```javascript hl:33,13
const cluster = require('cluster');
const express = require('express');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`主进程 ${process.pid} 正在运行`);

    // 追踪工作进程状态
    const workers = new Map();

    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers.set(worker.id, { 
            pid: worker.process.pid,
            requests: 0 
        });
    }

    // 监控工作进程
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        workers.delete(worker.id);
        // 创建新的工作进程替代死掉的进程
        const newWorker = cluster.fork();
        workers.set(newWorker.id, {
            pid: newWorker.process.pid,
            requests: 0
        });
    });

} else {
    // 工作进程创建 HTTP 服务器
    const app = express();

    app.get('/', (req, res) => {
        res.send(`由工作进程 ${process.pid} 处理的请求`);
    });

    app.listen(3000, () => {
        console.log(`工作进程 ${process.pid} 已启动`);
    });
}
```

### 3.5. 性能优化建议

#### 3.5.1. **合理使用进程数量**

- 一般建议与 CPU 核心数相当
- 考虑预留一些系统资源
- 注意内存使用情况

#### 3.5.2. **选择合适的并行策略**

- I/O密集型任务：
	- 使用异步操作即可
- CPU密集型任务：
	- 使用 `Worker Threads`
- **需要隔离**的任务：
	- 使用 Cluster

#### 3.5.3. **监控和管理**

```javascript hl:7
// 进程监控示例
if (cluster.isMaster) {
    const workers = new Map();

    // 监控内存使用
    setInterval(() => {
        const usage = process.memoryUsage();
        console.log(`内存使用：${Math.round(usage.heapUsed / 1024 / 1024)}MB`);
        
        // 如果内存使用过高，可以重启工作进程
        if (usage.heapUsed > threshold) {
            restartWorkers();
        }
    }, 30000);
}
```

通过以上这些机制，Node.js 可以充分利用现代计算机的多核能力，在保持简单的单线程编程模型的同时，实现高效的并行处理。选择哪种方式取决于具体的应用场景和需求，通常的建议是：
- 普通的Web应用：
	- 使用 Cluster 模式就足够了，因为**任务是隔离的**
- 计算密集型应用：
	- **结合使用 Cluster 和 Worker Threads**
- I/O密集型应用：
	- 使用内置的异步机制即可

## 4.  Cluster 模块  →  创建**共享服务器端口**的子进程

### 4.1. Cluster 模块基本概念

Cluster 模块允许我们**创建共享服务器端口的子进程**。它主要用于：

- 利用多核 CPU
- 提高应用程序性能
- 实现**负载均衡**
- 提高应用可用性

### 4.2. 基本工作原理

```javascript hl:10
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
    console.log(`主进程 ${process.pid} 正在运行`);

    // 衍生工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
} else {
    // 工作进程共享同一个TCP连接
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`工作进程 ${process.pid} 响应\n`);
    }).listen(8000);

    console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 4.3. 进程间通信（IPC）

- send
- on('message')

#### 4.3.1. 主进程与工作进程通信

```javascript hl:5,13
if (cluster.isPrimary) {
    const worker = cluster.fork();
    
    // 主进程发送消息给工作进程
    worker.send({ type: 'command', data: 'hello' });
    
    // 主进程接收工作进程消息
    worker.on('message', (msg) => {
        console.log('主进程收到消息:', msg);
    });
} else {
    // 工作进程接收消息
    process.on('message', (msg) => {
        console.log('工作进程收到消息:', msg);
        // 工作进程回复消息
        process.send({ type: 'response', data: 'received' });
    });
}
```

#### 4.3.2. 工作进程之间通信

```javascript
if (cluster.isPrimary) {
    const workers = [];
    
    // 创建工作进程
    for (let i = 0; i < 2; i++) {
        workers.push(cluster.fork());
    }

    // 转发消息
    workers.forEach((worker) => {
        worker.on('message', (msg) => {
            workers.forEach((w) => {
                if (w.id !== worker.id) {
                    w.send(msg);
                }
            });
        });
    });
} else {
    // 工作进程逻辑
    process.on('message', (msg) => {
        console.log(`工作进程 ${process.pid} 收到消息:`, msg);
    });
}
```

### 4.4. 负载均衡

#### 4.4.1. 内置的轮询调度

```javascript
// Node.js 默认使用轮询调度
if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    http.createServer((req, res) => {
        res.end(`Handled by process ${process.pid}`);
    }).listen(8000);
}
```

#### 4.4.2. 自定义负载均衡

```javascript
if (cluster.isPrimary) {
    const workers = new Map();
    
    // 跟踪每个工作进程的负载
    function createWorker() {
        const worker = cluster.fork();
        workers.set(worker.id, {
            process: worker,
            load: 0
        });
        return worker;
    }

    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        createWorker();
    }

    // 监控工作进程负载
    workers.forEach((data, id) => {
        data.process.on('message', (msg) => {
            if (msg.type === 'load') {
                data.load = msg.load;
            }
        });
    });

    // 当工作进程退出时重新创建
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        workers.delete(worker.id);
        createWorker();
    });
}
```

### 4.5. 优雅退出和零停机重启

- setTimeout 
	- 给工作进程一定时间来完成当前请求
- 再配合通讯
	- 监听 `process.on` 等

```javascript hl:15,48
if (cluster.isPrimary) {
    const workers = new Set();

    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        workers.add(cluster.fork());
    }

    // 优雅退出函数
    function gracefulShutdown() {
        workers.forEach(worker => {
            worker.send('shutdown');
            
            // 给工作进程一定时间来完成当前请求
            setTimeout(() => {
                if (!worker.isDead()) {
                    worker.kill();
                }
            }, 5000);
        });
    }

    // 零停机重启
    function reload() {
        workers.forEach(worker => {
            // 创建新的工作进程
            const newWorker = cluster.fork();
            
            // 等待新进程准备就绪
            newWorker.on('listening', () => {
                // 优雅地关闭旧进程
                worker.disconnect();
                workers.delete(worker);
                workers.add(newWorker);
            });
        });
    }

    // 监听信号
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGHUP', reload);
} else {
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    });

    // 监听关闭信号
    process.on('message', (msg) => {
        if (msg === 'shutdown') {
            server.close(() => {
                process.exit(0);
            });
        }
    });

    server.listen(8000);
}
```

### 4.6. 监控和日志

```javascript
if (cluster.isPrimary) {
    const workers = new Map();

    // 监控指标
    const metrics = {
        totalRequests: 0,
        activeWorkers: 0,
        failedRequests: 0
    };

    function createWorker() {
        const worker = cluster.fork();
        workers.set(worker.id, {
            startTime: Date.now(),
            requests: 0,
            errors: 0
        });
        metrics.activeWorkers++;
        
        // 监听工作进程消息
        worker.on('message', (msg) => {
            if (msg.type === 'metric') {
                const stats = workers.get(worker.id);
                stats.requests++;
                metrics.totalRequests++;
                
                if (msg.error) {
                    stats.errors++;
                    metrics.failedRequests++;
                }
            }
        });

        return worker;
    }

    // 定期输出监控信息
    setInterval(() => {
        console.log('集群状态:', {
            activeWorkers: metrics.activeWorkers,
            totalRequests: metrics.totalRequests,
            failedRequests: metrics.failedRequests,
            workerStats: Array.from(workers.entries()).map(([id, stats]) => ({
                id,
                uptime: (Date.now() - stats.startTime) / 1000,
                requests: stats.requests,
                errors: stats.errors
            }))
        });
    }, 10000);

    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        createWorker();
    }
}
```

### 4.7. 最佳实践

#### 4.7.1. **进程数量管理**

```javascript
const WORKERS = process.env.NODE_ENV === 'production' 
    ? numCPUs 
    : Math.min(2, numCPUs);
```

#### 4.7.2. **错误处理**

```javascript hl:7
if (cluster.isPrimary) {
    cluster.on('exit', (worker, code, signal) => {
        if (signal) {
            console.log(`工作进程被信号${signal}终止`);
        } else if (code !== 0) {
            console.log(`工作进程异常退出，错误码：${code}`);
            cluster.fork(); // 重新创建工作进程
        }
    });
}
```

#### 4.7.3. **健康检查**

```javascript
if (cluster.isPrimary) {
    function healthCheck() {
        workers.forEach((worker) => {
            worker.send({ type: 'health_check' });
            
            const timeout = setTimeout(() => {
                console.log(`工作进程 ${worker.process.pid} 无响应`);
                worker.kill();
            }, 5000);

            worker.once('message', (msg) => {
                if (msg.type === 'health_check_response') {
                    clearTimeout(timeout);
                }
            });
        });
    }

    setInterval(healthCheck, 30000);
}
```

通过这些机制和最佳实践，Cluster 模块能够帮助我们构建高可用、可伸缩的 Node.js 应用。它是利用多核系统、提高应用性能的重要工具。

## 5. Node.js 应用中多核、多 CPU、多进程和多线程的区别和关系

### 5.1. 多核（Multi-Core）

多核指的是在**单个 CPU** 物理芯片上集成多个完整的计算核心

```javascript
const os = require('os');

// 获取 CPU 信息
console.log('CPU 核心数:', os.cpus().length);
console.log('CPU 详细信息:', os.cpus());

// 输出示例
/*
CPU 核心数: 8
CPU 详细信息: [
  {
    model: 'Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz',
    speed: 2600,
    times: { user: 123456, nice: 0, sys: 34567, idle: 789012, irq: 1234 }
  },
  // ... 更多核心信息
]
*/
```

### 5.2. 多 CPU（Multi-CPU）

多 CPU 指系统中安装了**多个物理 CPU 芯片**。每个 CPU 可能包含多个核心。

```javascript
const os = require('os');

// 检查系统架构和平台信息
console.log('系统架构:', os.arch());
console.log('平台:', os.platform());
console.log('总内存:', os.totalmem() / 1024 / 1024 / 1024, 'GB');
console.log('空闲内存:', os.freemem() / 1024 / 1024 / 1024, 'GB');

```

### 5.3. 多进程（Multi-Process）

进程是程序的一个独立实例，拥有独立的内存空间。**Node.js 通过 cluster 模块实现多进程**。

> cluster 模块 可 创建共享端口的多进程

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
    console.log(`主进程 ${process.pid} 正在运行`);

    // 记录进程信息
    const workers = new Map();

    // 创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        workers.set(worker.id, {
            pid: worker.process.pid,
            startTime: Date.now(),
            requests: 0
        });
    }

    // 进程间通信示例
    cluster.on('message', (worker, message) => {
        const workerInfo = workers.get(worker.id);
        if (message.type === 'request_completed') {
            workerInfo.requests++;
        }
    });

    // 监控进程状态
    setInterval(() => {
        console.log('进程状态报告:');
        for (const [id, info] of workers) {
            console.log(`工作进程 ${info.pid}:`, {
                uptime: (Date.now() - info.startTime) / 1000,
                requests: info.requests
            });
        }
    }, 10000);

} else {
    // 工作进程创建 HTTP 服务器
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`来自进程 ${process.pid} 的响应\n`);
        
        // 通知主进程请求完成
        process.send({ type: 'request_completed' });
    }).listen(8000);

    console.log(`工作进程 ${process.pid} 已启动`);
}
```

### 5.4. 多线程（Multi-Thread）

**线程**是进程中的执行单元，共享进程的内存空间。**Node.js 通过 worker_threads 模块实现多线程**。

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // 主线程代码
    const threads = new Map();
    const threadCount = 4;
    
    // 创建线程池
    class ThreadPool {
        constructor(size) {
            this.size = size;
            this.workers = new Map();
            this.queue = [];
            this.activeWorkers = 0;
        }

        addWorker() {
            const worker = new Worker(__filename, {
                workerData: { threadId: this.workers.size }
            });

            const workerInfo = {
                worker: worker,
                busy: false,
                taskCount: 0
            };

            worker.on('message', (result) => {
                workerInfo.busy = false;
                workerInfo.taskCount++;
                this.activeWorkers--;
                this.processQueue();
            });

            this.workers.set(worker.threadId, workerInfo);
        }

        async runTask(task) {
            return new Promise((resolve, reject) => {
                const queueItem = { task, resolve, reject };
                this.queue.push(queueItem);
                this.processQueue();
            });
        }

        processQueue() {
            if (this.queue.length === 0) return;

            for (const [threadId, workerInfo] of this.workers) {
                if (!workerInfo.busy && this.queue.length > 0) {
                    const { task, resolve, reject } = this.queue.shift();
                    workerInfo.busy = true;
                    this.activeWorkers++;
                    
                    workerInfo.worker.postMessage(task);
                    
                    workerInfo.worker.once('message', resolve);
                    workerInfo.worker.once('error', reject);
                }
            }
        }

        getStats() {
            const stats = {
                totalWorkers: this.workers.size,
                activeWorkers: this.activeWorkers,
                queueLength: this.queue.length,
                workerStats: []
            };

            for (const [threadId, info] of this.workers) {
                stats.workerStats.push({
                    threadId,
                    busy: info.busy,
                    taskCount: info.taskCount
                });
            }

            return stats;
        }
    }

    // 使用线程池
    const pool = new ThreadPool(threadCount);
    
    // 初始化线程池
    for (let i = 0; i < threadCount; i++) {
        pool.addWorker();
    }

    // 示例：执行CPU密集型任务
    async function runTasks() {
        const tasks = Array(10).fill().map((_, i) => ({
            type: 'compute',
            data: i
        }));

        console.log('开始执行任务...');

        const results = await Promise.all(
            tasks.map(task => pool.runTask(task))
        );

        console.log('所有任务完成:', results);
        console.log('线程池状态:', pool.getStats());
    }

    runTasks().catch(console.error);

} else {
    // 工作线程代码
    parentPort.on('message', (task) => {
        // 模拟CPU密集型操作
        let result;
        
        switch (task.type) {
            case 'compute':
                // 示例计算任务
                result = heavyComputation(task.data);
                break;
            default:
                result = null;
        }

        parentPort.postMessage({
            threadId: workerData.threadId,
            result: result
        });
    });

    function heavyComputation(n) {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(n * i);
        }
        return result;
    }
}
```

### 5.5. 各种模型的对比

#### 5.5.1. **资源占用**

```javascript
// 内存使用对比示例
const process = require('process');

function showMemoryUsage() {
    const used = process.memoryUsage();
    console.log({
        rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,    // 进程总内存
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,  // V8 总堆内存
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,    // V8 已用堆内存
        external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`,     // C++ 对象内存
    });
}
```

#### 5.5.2. **通信成本**

```javascript
// 进程间通信示例
if (cluster.isPrimary) {
    const worker = cluster.fork();
    console.time('ipc');
    worker.send('ping');
    worker.on('message', (msg) => {
        if (msg === 'pong') {
            console.timeEnd('ipc');
        }
    });
} else {
    process.on('message', (msg) => {
        if (msg === 'ping') {
            process.send('pong');
        }
    });
}

// 线程间通信示例
if (isMainThread) {
    const worker = new Worker(__filename);
    console.time('thread');
    worker.postMessage('ping');
    worker.on('message', (msg) => {
        if (msg === 'pong') {
            console.timeEnd('thread');
        }
    });
} else {
    parentPort.on('message', (msg) => {
        if (msg === 'ping') {
            parentPort.postMessage('pong');
        }
    });
}
```

### 5.6. 选择建议

#### 5.6.1. **I/O 密集型应用**

>  使用异步 I/O 即可，不需要多进程/多线程

```javascript
// 使用异步 I/O 即可，不需要多进程/多线程
const fs = require('fs').promises;

async function handleIO() {
    const file1 = fs.readFile('file1.txt');
    const file2 = fs.readFile('file2.txt');
    const [content1, content2] = await Promise.all([file1, file2]);
    // 处理文件内容
}
```

#### 5.6.2. **CPU 密集型应用**  →  worker_threads

```javascript
// 使用 Worker Threads
const { Worker } = require('worker_threads');

function runWorker(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}
```

#### 5.6.3. **Web 服务器**  → 使用 `Cluster`

```javascript hl:1
// 使用 Cluster
if (cluster.isPrimary) {
    // 根据 CPU 核心数创建工作进程
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    // Express 应用
    const express = require('express');
    const app = express();
    app.listen(3000);
}
```

#### 5.6.4. 总结

- 多核和多 CPU 是硬件层面的概念
- **多进程 = 多核** ：
	- 适合需要隔离的场景，如 Web 服务器
- 多线程：
	- 适合 **CPU 密集型**任务
- Node.js 的事件循环
	- 适合 **I/O 密集型**任务
