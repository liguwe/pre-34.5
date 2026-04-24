# Koa 与 express  对比

`#nodejs` `#koa` `#express` 

## 1. 先说主要区别

- 是否集成了 `router/static` 中间件
- 中间件实现基于回调还是 `promise`
	- 导致捕获错误的的方式不一致

## 2. 核心理念

- Express:
	- "**增强** Node.js"的理念
	- 提供了完整的应用程序功能
	- 包含了**路由、模板**等功能在框架内
	- 更像是一个全能型的框架
- Koa:
	- "**修复并替代** Node.js"的理念
	- 极简主义，核心功能非常精简
	- 通过中间件扩展功能
	- 更像是一个中间件框架

## 3. 中间件系统

### 3.1. Express  

- 基于`回调`函数（Callback）
- 中间件**按线性方式**执行
	- 三个参数
		- req
		- res
		- next
- 错误处理需要特殊的**错误处理中间件**


```javascript hl:2
// Express 中间件示例
app.use((req, res, next) => {
    console.log('Start');
    next();
    console.log('End');
});
```

## 4. Koa 2 

- 基于 async/await
- **洋葱模型**（Onion model）中间件
	- 两个参数
		- ctx 
		- next
- 更优雅的错误处理机制

```javascript hl:2
// Koa 中间件示例
app.use(async (ctx, next) => {
    console.log('Start');
    await next();
    console.log('End');
});
```

## 5. 异步处理

### 5.1. Express

- 使用回调处理异步
- 容易陷入`回调地狱`
- 错误处理相对复杂

```javascript
// Express 异步处理
app.get('/users', (req, res, next) => {
    db.users.find()
        .then(users => res.json(users))
        .catch(next);
});
```

### 5.2. Koa

- 原生支持 `async/await`
- 更清晰的异步流程
- 统一的错误处理

```javascript
// Koa 异步处理
app.use(async ctx => {
    const users = await db.users.find();
    ctx.body = users;
});
```

## 6. 上下文处理

### 6.1. Express

- 分离的 req 和 res 对象
- 需要手动处理请求和响应

```javascript
// Express
app.use((req, res) => {
    res.send(req.query.name);
});
```

### 6.2. Koa

- 统一的 **context 对象**
- 封装了 request 和 response

```javascript
// Koa
app.use(ctx => {
    ctx.body = ctx.query.name;
});
```

## 7. 性能比较

### 7.1. Express

- 更多的内置功能意味着更大的开销
- 处理简单请求的性能很好
- 大量中间件可能影响性能

### 7.2. Koa

- 更轻量级
- 更少的内存占用
- 在处理大量并发请求时表现更好

## 8. 是否内置了路由

### 8.1. Express 路由处理: 已经内置路由能力

```javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
```

### 8.2. Koa 路由处理

需要引入 `@koa/router`

```javascript hl:2
const Koa = require('koa');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();

router.get('/api/users', async (ctx) => {
    ctx.body = { users: [] };
});

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
});
```
