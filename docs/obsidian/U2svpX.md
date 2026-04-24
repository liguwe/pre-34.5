# TCP 粘包

`#nodejs` 

## 1. TCP 粘包问题

>  多个数据包重组时发生

TCP 粘包是因为 TCP 是`面向流`的协议，传输数据时会将数据拆分成**多个数据包**进行传输，`接收方`收到数据后会按序`重组`。这可能导致两种情况：

1. **多个小数据包合并成一个大数据包**
2. **一个大数据包被分割成多个小数据包**

```ascii
发送数据：
包1: "Hello" | 包2: "World"

可能的接收情况：
情况1（粘包）: "HelloWorld"
情况2（拆包）: "Hel" "loWorld"
```

## 2. TCP 粘包解决方案

### 2.1. 固定长度

```javascript
// 固定长度方案
const net = require('net');

const server = net.createServer((socket) => {
    const FIXED_LENGTH = 10;
    let buffer = Buffer.alloc(0);

    socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        
        // 当数据足够时，按固定长度解析
        while (buffer.length >= FIXED_LENGTH) {
            const message = buffer.slice(0, FIXED_LENGTH);
            buffer = buffer.slice(FIXED_LENGTH);
            console.log('收到消息:', message.toString());
        }
    });
});
```

### 2.2. 分隔符

```javascript
// 使用分隔符方案
const net = require('net');

const server = net.createServer((socket) => {
    let buffer = '';
    const DELIMITER = '\n';

    socket.on('data', (data) => {
        buffer += data;
        
        let index;
        while ((index = buffer.indexOf(DELIMITER)) !== -1) {
            const message = buffer.slice(0, index);
            buffer = buffer.slice(index + 1);
            console.log('收到消息:', message);
        }
    });
});
```

### 2.3. 消息头标识长度

```javascript
// 消息头标识长度方案
const net = require('net');

class Protocol {
    static pack(message) {
        const body = Buffer.from(message);
        const header = Buffer.alloc(4);
        header.writeUInt32BE(body.length);
        return Buffer.concat([header, body]);
    }

    static unpack(buffer) {
        if (buffer.length < 4) return null;
        
        const length = buffer.readUInt32BE(0);
        if (buffer.length < length + 4) return null;
        
        const body = buffer.slice(4, length + 4);
        const remaining = buffer.slice(length + 4);
        
        return {
            message: body.toString(),
            remaining: remaining
        };
    }
}

// 服务端示例
const server = net.createServer((socket) => {
    let buffer = Buffer.alloc(0);

    socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        
        let result;
        while ((result = Protocol.unpack(buffer))) {
            console.log('收到消息:', result.message);
            buffer = result.remaining;
        }
    });
});

// 客户端示例
const client = new net.Socket();
client.connect(3000, '127.0.0.1', () => {
    const message = Protocol.pack('Hello World');
    client.write(message);
});
```

## 3. UDP 粘包问题 → 每个数据包都是独立

UDP 不存在粘包问题，因为：

1. UDP 是基于消息的协议，**每个数据包都是独立的**
2. UDP 不保证数据包的顺序和可靠性
3. 每个 UDP 数据包都有明确的界限

```javascript
// UDP 示例
const dgram = require('dgram');

// UDP 服务器
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    // UDP 每个消息都是完整的，不会粘包
    console.log(`收到消息: ${msg} 来自 ${rinfo.address}:${rinfo.port}`);
});

server.bind(3000);

// UDP 客户端
const client = dgram.createSocket('udp4');

// 发送多个消息
client.send('Hello', 3000, 'localhost');
client.send('World', 3000, 'localhost');
```

## 4. 总结比较

1. TCP 粘包原因：
	- TCP 是`流式`协议
	- TCP 有缓冲区机制
	- **数据包的发送和接收**不一定一一对应
2. UDP 无粘包原因：
	- UDP 是消息边界协议
	- 每个数据包都是**独立**的
	- 一次接收一个完整的数据包
3. TCP 粘包解决方案：
	- 固定长度
	- 分隔符
	- 消息头+消息体
	- 自定义协议

## 5. 建议

   - TCP 应用建议使用**消息头+消息体**方案
   - 对于简单应用可以使用**分隔符**方案
   - UDP 应用需要考虑数据包大小限制和丢包处理
