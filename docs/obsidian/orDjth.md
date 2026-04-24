# JavaScript Bridge（JSBridge）的原理

`#jsbridge`

## 1. JSBridge 概述

JSBridge 是一种在 Web 页面和原生应用（Native）之间进行通信的机制。
- 它允许 JavaScript 调用原生应用的功能
- 同时也允许原生应用调用网页中的 JavaScript 方法。

主要用途：
- Web 调用原生功能（如相机、GPS等）
- 原生向 Web 传递数据
- 实现**混合开发（Hybrid）架构**
- 提供统一的跨平台解决方案

## 2. JSBridge 的基本原理

JSBridge 的核心是**在 Native 和 JavaScript 两端分别建立对应的 Bridge，并维护一套统一的协议来实现通信**。

## 3. 通信方式

### 3.1. JavaScript 调用 Native（JS -> Native）

#### 3.1.1. 方式一：拦截 URL Scheme

```javascript
// JS 端
function callNative() {
    document.location = "myapp://method?param=value";
}

// Native 端拦截 URL
public boolean shouldOverrideUrlLoading(WebView view, String url) {
    if (url.startsWith("myapp://")) {
        // 处理自定义协议
        handleCustomAction(url);
        return true;
    }
    return false;
}
```

或者通过**自定义 URL Schema 协议**，让 Native 拦截并解析处理

```javascript
// JavaScript 端
function callNative(action, params) {
    const url = `myapp://action=${action}&params=${encodeURIComponent(JSON.stringify(params))}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 0);
}

// 使用示例
callNative('share', { title: '标题', content: '内容' });
```

#### 3.1.2. 方式二：注入 API →  js 调用 native

这是最直接的方式，**通过 WebView 提供的接口，Native 将对象或方法注入到 JS Context 中**。

```javascript
// Native 端注入 API
webview.addJavascriptInterface(new JSBridge(), "nativeBridge");


// Native 端注入的对象
window.nativeBridge = {
    share: function(params) {
        // 调用 Native 的分享功能
    },
    scan: function(callback) {
        // 调用 Native 的扫码功能
    }
};

// JavaScript 端调用
window.nativeBridge.share({ title: '标题', content: '内容' });

```

### 3.2. Native 调用 JavaScript（Native -> JS）

关键：`webview.evaluateJavascript`

```javascript
// Android
webview.evaluateJavascript("javascript:method('params')", null);

// iOS
[webview evaluateJavaScript:@"javascript:method('params')" completionHandler:nil];

// JS 端
window.method = function(params) {
    // 处理来自 Native 的调用
    console.log('Native called:', params);
}
```

Native 通过直接执行 JS 代码的方式调用网页中的方法。


```javascript
// JavaScript 端注册方法
window.JSBridge = {
    // 更新用户信息
    updateUserInfo: function(userInfo) {
        console.log('收到用户信息：', userInfo);
    },
    
    // 处理支付结果
    handlePayResult: function(result) {
        console.log('支付结果：', result);
    }
};
```

## 4. 完整的通信示例

```javascript  hl:4
// 定义 Bridge 类
class ModernJSBridge {
    constructor() {
        this.callbacks = {};
        this.handlers = {};
        this.callbackIndex = 0;
        
        // 初始化
        this.init();
    }

    init() {
        // 注册全局回调接收器
        window.JSBridgeCallback = (callbackId, data) => {
            this.handleCallback(callbackId, data);
        };

        // 注册全局消息接收器
        window.JSBridgeMessage = (handlerName, data) => {
            this.handleMessage(handlerName, data);
        };
    }

    // 注册 JavaScript 处理器
    registerHandler(handlerName, handler) {
        this.handlers[handlerName] = handler;
    }

    // 调用 Native 方法
    callNative(handlerName, params = {}) {
        return new Promise((resolve, reject) => {
            const callbackId = this.generateCallbackId();
            
            this.callbacks[callbackId] = {
                resolve,
                reject
            };

            const message = {
                handlerName,
                params,
                callbackId
            };

            this.sendToNative(message);
        });
    }

    // 处理 Native 回调
    handleCallback(callbackId, response) {
        const callback = this.callbacks[callbackId];
        if (callback) {
            if (response.success) {
                callback.resolve(response.data);
            } else {
                callback.reject(response.error);
            }
            delete this.callbacks[callbackId];
        }
    }

    // 处理来自 Native 的消息
    handleMessage(handlerName, data) {
        const handler = this.handlers[handlerName];
        if (handler) {
            handler(data);
        }
    }

    // 生成回调 ID
    generateCallbackId() {
        return `cb_${this.callbackIndex++}_${Date.now()}`;
    }

    // 发送消息到 Native
    sendToNative(message) {
        if (window.webkit && window.webkit.messageHandlers) {
            // iOS
            window.webkit.messageHandlers.bridge.postMessage(message);
        } else if (window.nativeBridge) {
            // Android
            window.nativeBridge.postMessage(JSON.stringify(message));
        }
    }
}

// 使用示例
const bridge = new ModernJSBridge();

// 注册处理来自 Native 的消息
bridge.registerHandler('updateUserInfo', (userInfo) => {
    console.log('用户信息更新：', userInfo);
});

// 调用 Native 方法
async function shareContent() {
    try {
        const result = await bridge.callNative('share', {
            title: '分享标题',
            content: '分享内容'
        });
        console.log('分享成功：', result);
    } catch (error) {
        console.error('分享失败：', error);
    }
}
```

## 5. 实际应用场景

### 5.1. 获取设备信息

```javascript
JSBridge.callHandler('getDeviceInfo', {}, function(result) {
    console.log('设备信息:', result);
    // {
    //     platform: 'iOS',
    //     version: '14.0',
    //     deviceId: 'XXXX'
    // }
});
```

### 5.2. 调用原生功能

```javascript
JSBridge.callHandler('openCamera', {
    maxSize: 1024,
    format: 'jpg'
}, function(result) {
    if (result.success) {
        console.log('照片地址:', result.imageUrl);
    }
});
```

### 5.3. 消息推送

```javascript
// Native 注册消息推送
JSBridge.registerHandler('onPushMessage', function(data) {
    console.log('收到推送:', data);
    showNotification(data);
});
```

## 6. 安全性考虑

### 6.1. **域名白名单**：

```javascript
const allowedDomains = ['example.com', 'trusted-domain.com'];

function isAllowedDomain(url) {
    const domain = new URL(url).hostname;
    return allowedDomains.includes(domain);
}

// 在调用 Native 方法前检查
if (!isAllowedDomain(window.location.href)) {
    throw new Error('Unauthorized domain');
}
```

#### 6.1.1. **参数校验**：

```javascript
function validateParams(params) {
    // 实现参数校验逻辑
    if (typeof params !== 'object') {
        throw new Error('Invalid params type');
    }
    // 其他验证...
}

// 在发送消息前验证
bridge.callNative = function(handlerName, params) {
    validateParams(params);
    // 继续处理...
};
```

## 7. 性能优化

## 8. 性能优化建议

1. **批量处理**：合并多个调用请求
```javascript
// 优化前
bridge.call('method1');
bridge.call('method2');
bridge.call('method3');

// 优化后
bridge.batchCall([
    { method: 'method1', data: {} },
    { method: 'method2', data: {} },
    { method: 'method3', data: {} }
]);
```

2. **消息队列**：避免并发调用
```javascript
class MessageQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    push(message) {
        this.queue.push(message);
        this.process();
    }

    process() {
        if (this.processing) return;
        this.processing = true;
        
        while (this.queue.length) {
            const message = this.queue.shift();
            // 处理消息
        }
        
        this.processing = false;
    }
}
```

这些优化措施可以显著提升 JSBridge 的性能和稳定性。

## 9. 关键点

JSBridge 的实现需要考虑以下几个关键点：
1. 双向通信机制的建立
2. 消息格式的统一
3. 回调函数的管理
4. 错误处理
5. 安全性控制
6. 性能优化

## 10. 之前的笔记

- 总结：
	- js → native
		- 注入到 js 环境中的 window 对象，直接调用
	- native → js
		- 就是再 native 中执行 window上的方法等
			- 如安卓中 `webView.loadUrl("javascript:foo()");

### 10.1. js 调用 native 的东西

- 拦截 Scheme：比较类似于`jsonp`的思路
	- js层：`a.herf=` / `locacation.href` / `iframe`
	- ios 和 Android 侧：分别做拦截即可，就类比于 `jsonp` 的思路
- 这种方法的`缺点`
	- 连续续调用 `location.href` 会出现消息丢失
	- `url`长度有限制
- 弹窗方式：
	- 安卓测：`onJsAlert`、`onJsConfirm`、`onJsPrompt`
	- ios 侧：WKWebView 支持，但 UIWebView 不支持
- 注入上下文的方式：
	- 即注入到 js 环境中的 `window`对象上，直接调用

### 10.2. native 调用 js 中的东西

- **就是再native中执行window上的方法等，如安卓中** `webView.loadUrl("javascript:foo()");`
