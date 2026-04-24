# Node.js 中常见的内存泄漏场景及解决方案

`#nodejs` `#R1` 

## 1. 全局变量引起的内存泄漏

```javascript hl:1,8
// 错误示例：全局变量累积
global.dataStore = [];

function addData(data) {
    global.dataStore.push(data);
}

// 正确示例：使用局部变量或及时清理
class DataManager {
    constructor() {
        this.dataStore = new Map();
        this.maxSize = 1000;
    }

    addData(key, data) {
        // 设置容量限制
        if (this.dataStore.size >= this.maxSize) {
            const firstKey = this.dataStore.keys().next().value;
            this.dataStore.delete(firstKey);
        }
        this.dataStore.set(key, data);
    }

    clearOldData() {
        const now = Date.now();
        for (const [key, data] of this.dataStore) {
            if (now - data.timestamp > 3600000) { // 1小时前的数据
                this.dataStore.delete(key);
            }
        }
    }
}
```

## 2. 闭包导致的内存泄漏

```javascript hl:6,17
// 错误示例：闭包持有大对象引用
function createLeak() {
    const largeData = new Array(1000000);
    
    return function() {
        console.log(largeData[0]); // largeData 一直被持有
    }
}

// 正确示例：使用完即释放
function betterImplementation() {
    let result;
    {
        const largeData = new Array(1000000);
        result = largeData[0];
    }
    // largeData 在这里已经可以被垃圾回收
    return function() {
        console.log(result);
    }
}
```

## 3. 事件监听器未移除

```javascript hl:26,5
// 错误示例：事件监听器累积
class LeakyClass {
    constructor() {
        this.data = new Array(10000);
        process.on('data', this.onData.bind(this));
    }

    onData(data) {
        // 处理数据
    }
}

// 正确示例：提供移除监听器的方法
class BetterClass {
    constructor() {
        this.data = new Array(10000);
        this.boundOnData = this.onData.bind(this);
        this.setupListeners();
    }

    setupListeners() {
        process.on('data', this.boundOnData);
    }

    cleanup() {
        process.removeListener('data', this.boundOnData);
    }

    onData(data) {
        // 处理数据
    }
}

// 使用示例
const instance = new BetterClass();
// 使用完后清理
instance.cleanup();
```

## 4. 缓存未限制大小

```javascript hl:1,15
// 错误示例：无限制的缓存
const cache = {};

function addToCache(key, value) {
    cache[key] = value;
}

// 正确示例：使用 LRU 缓存
const LRU = require('lru-cache');
const cache = new LRU({
    max: 500,   // 最大项数
    maxAge: 1000 * 60 * 60 // 项的最大年龄（1小时）
});

// 或者使用 Map 实现简单的 LRU
class SimpleCache {
    constructor(limit = 1000) {
        this.limit = limit;
        this.cache = new Map();
    }

    set(key, value) {
        if (this.cache.size >= this.limit) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    get(key) {
        const value = this.cache.get(key);
        if (value) {
            // 刷新访问顺序
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }
}
```

## 5. 定时器未清理

```javascript hl:27,1
// 错误示例：定时器未清理
function startPolling() {
    setInterval(() => {
        // 执行某些操作
    }, 1000);
}

// 正确示例：可清理的定时器
class PollingManager {
    constructor() {
        this.timers = new Set();
    }

    startPolling(fn, interval) {
        const timer = setInterval(fn, interval);
        this.timers.add(timer);
        return timer;
    }

    stopPolling(timer) {
        clearInterval(timer);
        this.timers.delete(timer);
    }

    stopAll() {
        for (const timer of this.timers) {
            clearInterval(timer);
        }
        this.timers.clear();
    }
}
```

## 6. Promise 链未处理 

```javascript hl:1,15
// 错误示例：未处理的 Promise
function leakyPromise() {
    return new Promise(resolve => {
        const hugeData = new Array(1000000);
        resolve(hugeData);
    });
}

// 正确示例：确保 Promise 链正确处理和结束
async function betterPromise() {
    try {
        const hugeData = await processData();
        // 使用完数据后置为 null
        hugeData = null;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## 7. Stream 未正确处理

```javascript hl:18,22
// 错误示例：流未正确处理
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt');
readStream.on('data', (chunk) => {
    // 处理数据
});

// 正确示例：正确处理流
class StreamHandler {
    constructor() {
        this.streams = new Set();
    }

    handleStream(stream) {
        this.streams.add(stream);

        stream.on('end', () => {
            this.streams.delete(stream);
        });

        stream.on('error', (error) => {
            console.error('Stream error:', error);
            this.streams.delete(stream);
        });

        return stream;
    }

    cleanup() {
        for (const stream of this.streams) {
            stream.destroy();
        }
        this.streams.clear();
    }
}

// 使用示例
const streamHandler = new StreamHandler();
const readStream = streamHandler.handleStream(
    fs.createReadStream('large-file.txt')
);
```

## 8. 内存使用监控

```javascript hl:9
class MemoryMonitor {
    constructor(threshold = 0.8) { // 80% 阈值
        this.threshold = threshold;
        this.startMonitoring();
    }

    startMonitoring() {
        this.interval = setInterval(() => {
            const usage = process.memoryUsage();
            const heapUsed = usage.heapUsed;
            const heapTotal = usage.heapTotal;
            const usage_ratio = heapUsed / heapTotal;

            console.log('内存使用情况:', {
                heapUsed: `${Math.round(heapUsed / 1024 / 1024)} MB`,
                heapTotal: `${Math.round(heapTotal / 1024 / 1024)} MB`,
                usage: `${Math.round(usage_ratio * 100)}%`
            });

            if (usage_ratio > this.threshold) {
                this.handleHighMemoryUsage(usage);
            }
        }, 30000); // 每30秒检查一次
    }

    handleHighMemoryUsage(usage) {
        console.warn('内存使用过高警告！');
        // 这里可以添加告警逻辑
        // 例如：发送告警邮件、清理缓存等
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// 使用示例
const monitor = new MemoryMonitor();
```

## 9. WeakMap 和 WeakSet 的使用

```javascript
// 使用 WeakMap 存储对象相关的数据
class DomNodeData {
    constructor() {
        // 使用 WeakMap 存储 DOM 节点相关的数据
        this.nodeData = new WeakMap();
    }

    setData(node, data) {
        this.nodeData.set(node, data);
    }

    getData(node) {
        return this.nodeData.get(node);
    }
}

// WeakMap 会在对象被垃圾回收时自动清理相关数据
const nodeData = new DomNodeData();
```

## 10. 最后

以上 Node.js 中常见的内存泄漏场景及其解决方案。要避免内存泄漏，关键是要：

1. 及时清理不再使用的资源
2. 限制缓存大小
3. 正确处理事件监听器
4. 使用适当的数据结构（如 WeakMap）
5. 实施监控机制
6. 定期进行内存使用分析

同时，建议使用工具如 `node-heapdump`、`node --inspect` 等进行内存分析和调试。
