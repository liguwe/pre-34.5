# BroadcastChannel

## 1. 简介

- BroadcastChannel 是一个用于**同源页面**之间进行通信的 Web API。
- 它允许同源的不同浏览器窗口、标签页、iframe 之间发送和接收消息。

## 2. 基本使用

```javascript
// 创建或连接到一个广播频道
const channel = new BroadcastChannel('channel-name');

// 发送消息
channel.postMessage('Hello from page A!');

// 接收消息
channel.onmessage = (event) => {
    console.log('Received:', event.data);
};

// 关闭连接
channel.close();
```

## BroadcastChannel 的 name 参数说明

> [!danger]
> 只要使用相同的 channel name，就会连接到同一个广播频道


BroadcastChannel 不需要在不同 Tab 之间`共享变量`。
- 每个 Tab 只需要使用相同的 channel name 创建自己的 BroadcastChannel 实例即可。


```javascript
// 在任意 Tab 中，只要使用相同的 channel name ('my-channel')，
// 就可以创建一个连接到同一广播频道的实例
const channel = new BroadcastChannel('my-channel');
```

### 演示

假设我们有三个 HTML 文件，分别在不同的 Tab 中打开：

#### page1.html

```html hl:10
<!-- page1.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>Page 1</h1>
    <button onclick="sendMessage()">Send Message from Page 1</button>
    <div id="messages"></div>

    <script>
        // 每个页面创建自己的 channel 实例
        const channel = new BroadcastChannel('my-channel');

        function sendMessage() {
            channel.postMessage({
                from: 'Page 1',
                content: 'Hello from Page 1!',
                time: new Date().toLocaleTimeString()
            });
        }

        // 监听消息
        channel.onmessage = (event) => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += `
                <p>Received: ${event.data.content} (from ${event.data.from} at ${event.data.time})</p>
            `;
        }
    </script>
</body>
</html>
```

#### page2.html

```html hl:11,10
<!-- page2.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>Page 2</h1>
    <button onclick="sendMessage()">Send Message from Page 2</button>
    <div id="messages"></div>

    <script>
        // 在另一个页面创建一个新的 channel 实例，使用相同的名称
        const channel = new BroadcastChannel('my-channel');

        function sendMessage() {
            channel.postMessage({
                from: 'Page 2',
                content: 'Hello from Page 2!',
                time: new Date().toLocaleTimeString()
            });
        }

        channel.onmessage = (event) => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += `
                <p>Received: ${event.data.content} (from ${event.data.from} at ${event.data.time})</p>
            `;
        }
    </script>
</body>
</html>
```

#### page3.html

```html hl:10
<!-- page3.html -->
<!DOCTYPE html>
<html>
<body>
    <h1>Page 3</h1>
    <button onclick="sendMessage()">Send Message from Page 3</button>
    <div id="messages"></div>

    <script>
        // 在第三个页面同样创建一个 channel 实例
        const channel = new BroadcastChannel('my-channel');

        function sendMessage() {
            channel.postMessage({
                from: 'Page 3',
                content: 'Hello from Page 3!',
                time: new Date().toLocaleTimeString()
            });
        }

        channel.onmessage = (event) => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += `
                <p>Received: ${event.data.content} (from ${event.data.from} at ${event.data.time})</p>
            `;
        }
    </script>
</body>
</html>
```

### 关键点说明

1. **独立实例**
   - 每个 Tab 都创建自己的 BroadcastChannel 实例
   - 实例之间是相互独立的
   - 不需要共享变量

2. **连接机制**
   ```javascript
   // 只要使用相同的 channel name，就会连接到同一个广播频道
   const channel = new BroadcastChannel('my-channel');
   ```

3. **自动连接**
   - **浏览器会自动处理**不同 Tab 之间的连接
   - 不需要手动建立连接
   - 不需要共享任何变量

4. **生命周期**
   ```javascript
   // 页面关闭时自动断开连接
   // 也可以手动关闭
   window.addEventListener('unload', () => {
       channel.close();
   });
   ```

5. **实际应用示例**
   ```javascript
   // 可以封装成一个通用的消息系统
   class TabCommunication {
       constructor(channelName = 'app-channel') {
           this.channel = new BroadcastChannel(channelName);
           this.handlers = new Map();
           
           this.channel.onmessage = (event) => {
               const { type, data } = event.data;
               if (this.handlers.has(type)) {
                   this.handlers.get(type)(data);
               }
           };
       }

       send(type, data) {
           this.channel.postMessage({ type, data });
       }

       on(type, handler) {
           this.handlers.set(type, handler);
       }

       close() {
           this.channel.close();
           this.handlers.clear();
       }
   }

   // 使用示例
   const communication = new TabCommunication();

   // 注册消息处理器
   communication.on('userLogin', (userData) => {
       console.log('User logged in:', userData);
   });

   // 发送消息
   communication.send('userLogin', { id: 1, name: 'John' });
   ```

>  BroadcastChannel API 的设计就是基于 channel name 来建立通信的。
>  只要在不同的 Tab 中使用相同的 channel name 创建实例，它们就能相互通信。
>  这是浏览器内部实现的机制，对开发者来说是透明的。

## 3. 完整示例：使用相同的 name → test-channel

### 页面 A 

```javascript
// 页面 A
const channelA = new BroadcastChannel('test-channel');

// 发送消息
channelA.postMessage({
    type: 'greeting',
    content: 'Hello from Page A',
    timestamp: Date.now()
});

// 监听消息
channelA.onmessage = (event) => {
    console.log('Page A received:', event.data);
};

// 错误处理
channelA.onmessageerror = (event) => {
    console.error('Error receiving message:', event);
};

// 当不再需要时关闭
// channelA.close();
```

### 页面 B 

```javascript
// 页面 B
const channelB = new BroadcastChannel('test-channel');

// 发送消息
channelB.postMessage({
    type: 'response',
    content: 'Hello back from Page B',
    timestamp: Date.now()
});

// 监听消息
channelB.onmessage = (event) => {
    console.log('Page B received:', event.data);
};
```

## 4. 主要特点

### 1. **同源策略**

   - 只能在同源（相同的协议、域名和端口）的页面间通信
   ```javascript
   // 只有相同源的页面才能接收到消息
   // https://example.com 和 https://example.com/page2.html 可以通信
   // https://example.com 和 https://other-domain.com 不能通信
   ```

### 2. **广播性质**

   - 消息会广播给所有订阅了该频道的页面
   ```javascript
   // 所有订阅了 'news-channel' 的页面都会收到消息
   const newsChannel = new BroadcastChannel('news-channel');
   newsChannel.postMessage('Breaking news!');
   ```

### 3. **支持多种数据类型**

   ```javascript hl:7
   // 可以发送各种类型的数据
   channel.postMessage({
       text: 'Hello',
       number: 123,
       array: [1, 2, 3],
       date: new Date(),
       // 注意：不能发送函数或DOM节点
   });
   ```

## 5. 实际应用场景

### 1. **多标签页数据同步**

```javascript
// 用户登录状态同步
const authChannel = new BroadcastChannel('auth');

// 登录成功后广播
function onLogin(userData) {
    authChannel.postMessage({
        type: 'login',
        user: userData
    });
}

// 其他标签页监听登录状态
authChannel.onmessage = (event) => {
    if (event.data.type === 'login') {
        updateUIWithUserData(event.data.user);
    }
};
```

### 2. **主题切换同步**

```javascript
const themeChannel = new BroadcastChannel('theme');

// 切换主题时广播
function toggleTheme(theme) {
    document.body.className = theme;
    themeChannel.postMessage({ theme });
}

// 其他页面同步主题
themeChannel.onmessage = (event) => {
    document.body.className = event.data.theme;
};
```

### 3. **购物车数据同步**

```javascript
const cartChannel = new BroadcastChannel('shopping-cart');

// 添加商品时广播
function addToCart(product) {
    cart.push(product);
    cartChannel.postMessage({
        type: 'add',
        product
    });
}

// 其他标签页同步购物车
cartChannel.onmessage = (event) => {
    if (event.data.type === 'add') {
        updateCartUI(event.data.product);
    }
};
```

## 6. 注意事项

### 1. **内存管理**

```javascript
// 在不需要时记得关闭连接
window.addEventListener('unload', () => {
    channel.close();
});
```

### 2. **错误处理**

```javascript
channel.onmessageerror = (event) => {
    console.error('消息接收错误:', event);
};
```

### 3. **兼容性检查**

```javascript
if ('BroadcastChannel' in window) {
    // 支持 BroadcastChannel
    const channel = new BroadcastChannel('test');
} else {
    // 降级处理，可以使用 localStorage 等其他方式
    console.log('Browser does not support BroadcastChannel');
}
```

BroadcastChannel 是一个强大的 API，特别适合用于需要在多个同源页面间同步数据的场景。它的使用简单直接，但要注意同源限制和适当的资源管理。
