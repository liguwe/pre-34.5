# ECONNRESET

`#nodejs` 

## 1. 定义

ECONNRESET（`Connection Reset`）错误表示连接被对方强制关闭。
- 简单来说就是：
	- TCP 连接中，一方突然收到了 RST 包，连接被重置
- `ECONNRESET`是因为TCP连接的**对端(通常是server)突然断开了连接**。
- `server` 一般都设置了`keepalive`，对于不活动的连接会超时断开

## 2. 常见原因

### 2.1. 服务端主动关闭连接

```javascript
// 服务端突然关闭
socket.destroy();
```

### 2.2. 防火墙干扰

- 连接空闲被防火墙切断
- 某些包被防火墙拦截

### 2.3. 客户端继续发送数据，但服务端已关闭

```javascript
// 错误示例
socket.on('end', () => {
    // 服务端已关闭，但还在写数据
    socket.write('data');  // 可能触发 ECONNRESET
});
```

## 3. 解决方案

### 3.1. 使用 keep-alive 保持连接活跃

```javascript
socket.setKeepAlive(true, 1000);
```

### 3.2. 优雅关闭连接

```javascript
socket.end(() => {
    // 确保数据发送完毕后再关闭
    socket.destroy();
});
```

### 3.3. 添加错误处理

```javascript
socket.on('error', (err) => {
    if (err.code === 'ECONNRESET') {
        // 处理连接重置
        console.log('连接被重置');
    }
});
```

### 3.4. 实现重连机制

```javascript
function connect() {
    const socket = new net.Socket();
    socket.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
            setTimeout(() => connect(), 1000);
        }
    });
}
```
