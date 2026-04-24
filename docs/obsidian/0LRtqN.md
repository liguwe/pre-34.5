# BroadcastChannel 和 MessageChannel 对比

`#bom` `#R1` 


> 另外见 [3. MessageChannel](/llTZL4)
> [17. BroadcastChannel](/rWahKU)


> `BroadcastChannel` 和 `MessageChannel` 是两种不同的通信机制，它们有**很大的区别**
> 一个**广播**
> 一个是**点对点**

## 1. 主要区别

| 特性   | BroadcastChannel | MessageChannel    |     |
| ---- | ---------------- | ----------------- | --- |
| 通信模式 | 一对多（广播）          | 一对一（点对点）          |     |
| 端口数量 | 无限制（同一频道）        | 固定两个端口            |     |
| 作用域  | **同源**的所有标签页/窗口  | 任意两个**上下文**之间     |     |
| 使用场景 | **同源页面间的消息广播**   | **两个执行上下文间**的私密通信 |     |
|      |                  |                   |     |
|      |                  |                   |     |

## 2. 代码示例对比

### 2.1. BroadcastChannel 示例

```javascript
// 页面 A
const channelA = new BroadcastChannel('chat');

// 发送消息
channelA.postMessage('Hello from Page A');

// 接收消息
channelA.onmessage = (event) => {
    console.log('Page A received:', event.data);
};

// 页面 B
const channelB = new BroadcastChannel('chat');

// 发送消息
channelB.postMessage('Hello from Page B');

// 接收消息
channelB.onmessage = (event) => {
    console.log('Page B received:', event.data);
};

// 页面 C
const channelC = new BroadcastChannel('chat');
// 所有订阅同一频道的页面都能收到消息
```

### 2.2. MessageChannel 示例：

```javascript
// 创建通道
const channel = new MessageChannel();
const { port1, port2 } = channel;

// 设置端口1的消息处理器
port1.onmessage = (event) => {
    console.log('Port1 received:', event.data);
};

// 设置端口2的消息处理器
port2.onmessage = (event) => {
    console.log('Port2 received:', event.data);
};

// 发送消息
port1.postMessage('Hello from port1');
port2.postMessage('Hello from port2');
```

## 3. 使用场景对比

### 3.1. BroadcastChannel 适用场景：

- 多标签页同步状态
- 多窗口数据同步

```javascript hl:1,18
// 1. 多标签页同步状态
const loginChannel = new BroadcastChannel('login');

// 登录页面
function login() {
    // 用户登录成功后
    loginChannel.postMessage({ type: 'LOGIN_SUCCESS', user: 'John' });
}

// 其他标签页
loginChannel.onmessage = (event) => {
    if (event.data.type === 'LOGIN_SUCCESS') {
        // 更新所有标签页的登录状态
        updateLoginState(event.data.user);
    }
};

// 2. 多窗口数据同步
const dataChannel = new BroadcastChannel('data-sync');

// 当一个页面更新数据时
function updateData(newData) {
    saveToLocalStorage(newData);
    dataChannel.postMessage({ type: 'DATA_UPDATED', data: newData });
}

// 其他页面监听更新
dataChannel.onmessage = (event) => {
    if (event.data.type === 'DATA_UPDATED') {
        refreshUI(event.data.data);
    }
};
```

### 3.2. MessageChannel 适用场景：**同一上下文通讯**

- iframe 通信
- Web Worker 通信
- 组件间隔离通信

```javascript hl:1,15,27
// 1. iframe 通信
const iframe = document.getElementById('myIframe');
const channel = new MessageChannel();

// 主页面设置
channel.port1.onmessage = (event) => {
    console.log('Main page received:', event.data);
};

// 将 port2 传递给 iframe
iframe.onload = () => {
    iframe.contentWindow.postMessage('init', '*', [channel.port2]);
};

// 2. Web Worker 通信
const worker = new Worker('worker.js');
const channel = new MessageChannel();

// 主线程设置
channel.port1.onmessage = (event) => {
    console.log('Main thread received:', event.data);
};

// 将 port2 传递给 worker
worker.postMessage({ port: channel.port2 }, [channel.port2]);

// 3. 组件间隔离通信
class ComponentA {
    constructor(port) {
        this.port = port;
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        console.log('Component A received:', event.data);
    }

    sendMessage(data) {
        this.port.postMessage(data);
    }
}

class ComponentB {
    constructor(port) {
        this.port = port;
        this.port.onmessage = this.handleMessage.bind(this);
    }

    handleMessage(event) {
        console.log('Component B received:', event.data);
    }

    sendMessage(data) {
        this.port.postMessage(data);
    }
}

// 创建组件间的通信通道
const channel = new MessageChannel();
const componentA = new ComponentA(channel.port1);
const componentB = new ComponentB(channel.port2);
```

## 4. 关闭和清理

```javascript hl:1,6
// BroadcastChannel
const broadcastChannel = new BroadcastChannel('example');
// 使用完毕后关闭
broadcastChannel.close();

// MessageChannel
const channel = new MessageChannel();
// 使用完毕后关闭两个端口
channel.port1.close();
channel.port2.close();
```

## 5. 错误处理

```javascript
// BroadcastChannel 错误处理
const broadcastChannel = new BroadcastChannel('example');

broadcastChannel.onmessageerror = (event) => {
    console.error('Broadcast message error:', event);
};

// MessageChannel 错误处理
const channel = new MessageChannel();

channel.port1.onmessageerror = (event) => {
    console.error('Port1 message error:', event);
};

channel.port2.onmessageerror = (event) => {
    console.error('Port2 message error:', event);
};
```

## 6. 总结：

1. **BroadcastChannel**:
	- 用于同源页面间的广播通信
	- 简单易用，一对多通信
	- 适合多标签页同步状态
	- 只能在同源页面间使用

2. **MessageChannel**:
	- 用于**两个执行上下文间的点对点通信**
	- 提供更高的隔离性和安全性
	- 适合 **iframe、Web Worker** 通信
	- 可以跨源通信（需要正确设置）

选择使用哪种通道取决于你的具体需求：
- 需要广播消息给多个接收者？
	- 选择 BroadcastChannel
- 需要两个执行上下文间的私密通信？
	- 选择 MessageChannel

## 7. MessageChannel 是否支持跨域

`MessageChannel` 本身不能直接跨域通信，但它可以**配合 postMessage 在已建立跨域通信的上下文之间传递端口**，从而实现跨域通信


>  Iframe 的跨域场景：更多详见 [13. 跨域与跨页面通讯](/2HrEJ5)

## 8. 更多

- [3. MessageChannel](/llTZL4)
- [17. BroadcastChannel](/rWahKU)
