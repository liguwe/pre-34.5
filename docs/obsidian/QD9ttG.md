# koa 的中间件机制

`#koa` `#nodejs` 

## 1. 中间件基本概念

Koa 的中间件是一个函数，它接收两个参数：
- `ctx`：上下文对象，包含请求和响应信息
- `next`：下一个中间件函数

### 1.1. 基本结构

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    // 中间件逻辑
    await next();
});
```

### 1.2. 洋葱模型

```javascript
app.use(async (ctx, next) => {
    console.log('1. 进入第一层');
    await next();
    console.log('6. 离开第一层');
});

app.use(async (ctx, next) => {
    console.log('2. 进入第二层');
    await next();
    console.log('5. 离开第二层');
});

app.use(async (ctx, next) => {
    console.log('3. 进入第三层');
    ctx.body = 'Hello World';
    console.log('4. 离开第三层');
});
```

输出顺序：
```
1. 进入第一层
2. 进入第二层
3. 进入第三层
4. 离开第三层
5. 离开第二层
6. 离开第一层
```

## 2. 常用中间件类型

### 2.1. 错误处理中间件

```javascript
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            code: ctx.status,
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        };
        // 触发应用级错误事件
        ctx.app.emit('error', err, ctx);
    }
});
```

### 2.2. 日志中间件

```javascript
app.use(async (ctx, next) => {
    const start = Date.now();
    
    // 请求日志
    console.log(`--> ${ctx.method} ${ctx.url}`);
    
    await next();
    
    // 响应日志
    const ms = Date.now() - start;
    console.log(`<-- ${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`);
});
```

### 2.3. 认证中间件

```javascript
const jwt = require('jsonwebtoken');

const auth = async (ctx, next) => {
    try {
        const token = ctx.header.authorization?.split(' ')[1];
        if (!token) {
            ctx.throw(401, '未提供认证令牌');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = decoded;
        
        await next();
    } catch (err) {
        ctx.throw(401, '认证失败');
    }
};

// 使用中间件
app.use(auth);
```

### 2.4. 响应格式化中间件

```javascript
app.use(async (ctx, next) => {
    await next();
    
    // 统一响应格式
    if (ctx.body) {
        ctx.body = {
            code: ctx.status === 200 ? 0 : ctx.status,
            data: ctx.body,
            message: ctx.message || 'success',
            timestamp: new Date().toISOString()
        };
    }
});
```

## 3. 高级中间件模式

### 3.1. 条件中间件

```javascript
const unless = require('koa-unless');

const authMiddleware = async (ctx, next) => {
    // 认证逻辑
    await next();
};

// 添加除外路径
authMiddleware.unless = unless;

app.use(authMiddleware.unless({
    path: [/^\/public/, '/login', '/register']
}));
```

### 3.2. 组合中间件

```javascript hl:1
const compose = require('koa-compose');

const middlewares = compose([
    async (ctx, next) => {
        // 中间件1
        await next();
    },
    async (ctx, next) => {
        // 中间件2
        await next();
    }
]);

app.use(middlewares);
```

### 3.3. 参数化中间件

```javascript
const rateLimit = (options = {}) => {
    const { interval = 60000, max = 100 } = options;
    const store = new Map();
    
    return async (ctx, next) => {
        const key = ctx.ip;
        const now = Date.now();
        const requests = store.get(key) || [];
        
        // 清理过期请求记录
        const validRequests = requests.filter(time => now - time < interval);
        
        if (validRequests.length >= max) {
            ctx.throw(429, '请求过于频繁');
        }
        
        validRequests.push(now);
        store.set(key, validRequests);
        
        await next();
    };
};

// 使用中间件
app.use(rateLimit({ interval: 60000, max: 100 }));
```

## 4. 常用第三方中间件

### 4.1. 请求体解析 (koa-bodyparser)

```javascript
const bodyParser = require('koa-bodyparser');

app.use(bodyParser({
    enableTypes: ['json', 'form'],
    jsonLimit: '5mb',
    formLimit: '5mb'
}));
```

### 4.2. 静态文件服务 (koa-static)

```javascript
const serve = require('koa-static');
const path = require('path');

app.use(serve(path.join(__dirname, 'public')));
```

### 4.3. 路由 (koa-router)

```javascript
const Router = require('koa-router');
const router = new Router();

router.get('/', async (ctx) => {
    ctx.body = 'Hello World';
});

router.post('/users', async (ctx) => {
    // 创建用户
});

app.use(router.routes());
app.use(router.allowedMethods());
```

### 4.4. CORS (koa-cors)

```javascript
const cors = require('@koa/cors');

app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
}));
```

## 5. 最佳实践

### 5.1. 中间件封装

```javascript
// middleware/logger.js
module.exports = (options = {}) => {
    return async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        
        if (options.console) {
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
        }
        
        if (options.headerEnabled) {
            ctx.set('X-Response-Time', `${ms}ms`);
        }
    };
};
```

### 5.2. 异步错误处理

```javascript
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.isJoi) { // 验证错误
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '参数验证失败',
                details: err.details
            };
        } else if (err.name === 'UnauthorizedError') { // JWT 错误
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '认证失败'
            };
        } else {
            // 其他错误
            ctx.status = err.status || 500;
            ctx.body = {
                code: ctx.status,
                message: err.message
            };
        }
        
        // 记录错误日志
        console.error(err);
    }
});
```

### 5.3. 中间件配置管理

```javascript
// config/middleware.js
module.exports = {
    cors: {
        enabled: true,
        options: {
            origin: '*',
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    },
    bodyParser: {
        enabled: true,
        options: {
            enableTypes: ['json', 'form'],
            jsonLimit: '5mb'
        }
    },
    // 其他中间件配置
};

// app.js
const middlewareConfig = require('./config/middleware');

if (middlewareConfig.cors.enabled) {
    app.use(cors(middlewareConfig.cors.options));
}

if (middlewareConfig.bodyParser.enabled) {
    app.use(bodyParser(middlewareConfig.bodyParser.options));
}
```

>  记住要始终考虑中间件的执行顺序，并确保正确处理异步操作和错误。

## 6. `next()` 前后代码的区别和特点：

### 6.1. 代码执行顺序示例

让我们通过一个具体的例子来说明：

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log('1. next() 之前的代码');
    const startTime = Date.now();     // next() 之前的代码
    
    await next();                     // 分界线
    
    const endTime = Date.now();       // next() 之后的代码
    console.log('4. next() 之后的代码');
    console.log(`请求耗时: ${endTime - startTime}ms`);
});

app.use(async (ctx, next) => {
    console.log('2. 第二个中间件开始');
    await next();
    console.log('3. 第二个中间件结束');
});

app.use(async (ctx) => {
    console.log('→ 到达最内层的中间件');
    ctx.body = 'Hello World';
});
```

执行顺序将会是：
```
1. next() 之前的代码
2. 第二个中间件开始
→ 到达最内层的中间件
3. 第二个中间件结束
4. next() 之后的代码
请求耗时: XXms
```

### 6.2. next() 前后代码的主要区别

#### 6.2.1. next() 之前的代码：**请求阶段**

1. **请求阶段（Downstream）特点**：
	- 按照中间件注册的顺序**从外到内**执行
	- 适合做**预处理**工作
	- 可以**阻止请求继续向下传递**
	- 常见使用场景：
     ```javascript hl:8
     app.use(async (ctx, next) => {
         // next() 之前：预处理
         ctx.state.startTime = Date.now();  // 记录开始时间
         ctx.state.requestId = generateId(); // 生成请求ID
         const token = ctx.headers.authorization;
         
         if (!token) {
             ctx.status = 401;
             return; // 如果没有token，直接返回，不调用next()
         }
         
         await next();
     });
     ```

2. **常见用途**：
   - 权限验证
   - 参数验证
   - 请求日志记录开始
   - 设置公共变量
   - 请求预处理

#### 6.2.2. next() 之后的代码：**响应阶段**

1. **响应阶段（Upstream）特点**：
	- 按照中间件注册的顺序**从内到外**执行
	- 适合做**后处理**工作
	- 可以**修改响应数据**
	- 常见使用场景：
     ```javascript
     app.use(async (ctx, next) => {
         try {
             await next();
             // next() 之后：后处理
             const duration = Date.now() - ctx.state.startTime;
             // 修改响应头
             ctx.set('X-Response-Time', `${duration}ms`);
             // 对响应进行处理
             if (ctx.body && typeof ctx.body === 'object') {
                 ctx.body = {
                     code: 0,
                     data: ctx.body,
                     requestId: ctx.state.requestId
                 };
             }
         } catch (err) {
             // 错误处理
             ctx.status = err.status || 500;
             ctx.body = { error: err.message };
         }
     });
     ```

2. **常见用途**：
	- 响应格式化
	- 响应时间统计
	- 错误处理
	- 日志记录完成
	- 清理临时资源

### 6.3. 实际应用示例

#### 6.3.1. 完整的日志中间件

```javascript
app.use(async (ctx, next) => {
    // next() 之前：记录请求信息
    const startTime = Date.now();
    console.log(`[请求开始] ${ctx.method} ${ctx.url}`);
    console.log('请求头:', ctx.headers);
    
    try {
        await next();
        
        // next() 之后：记录响应信息
        const duration = Date.now() - startTime;
        console.log(`[请求完成] ${ctx.method} ${ctx.url}`);
        console.log(`响应状态: ${ctx.status}`);
        console.log(`响应时间: ${duration}ms`);
    } catch (err) {
        // 错误处理
        const duration = Date.now() - startTime;
        console.error(`[请求错误] ${ctx.method} ${ctx.url}`);
        console.error('错误信息:', err);
        console.log(`响应时间: ${duration}ms`);
        throw err;
    }
});
```

#### 6.3.2. 响应格式化中间件

```javascript
app.use(async (ctx, next) => {
    // next() 之前：准备工作
    ctx.state.requestId = Math.random().toString(36).substring(7);
    
    await next();
    
    // next() 之后：统一响应格式
    if (ctx.body) {
        ctx.body = {
            code: ctx.status === 200 ? 0 : ctx.status,
            data: ctx.body,
            requestId: ctx.state.requestId,
            timestamp: new Date().toISOString()
        };
    }
});
```

### 6.4. 注意事项

1. **异步处理**：
	- 必须使用 `await next()` 确保异步操作按序执行
	- 不要忘记处理异步错误

2. **状态共享**：
	- 使用 `ctx.state` 在中间件之间共享数据
	- `next()` 前设置的数据在后续中间件中可用

3. **错误处理**：
	- 在外层中间件使用 `try-catch` 捕获错误
	- 可以在 `next()` 后统一处理错误响应

4. **性能考虑**：
	- next() 前后的代码都会影响请求处理时间
	- 避免在中间件中进行重复的耗时操作

## 7. 中间件的顺序

> 不同的顺序可能会导致完全不同的结果

### 7.1. 中间件顺序的基本原则

#### 7.1.1. 从外到内的顺序建议：

1. **错误处理中间件** → 最外层
2. **全局通用中间件** → 第二层
3. **第三方功能中间件** → 第三层
4. **业务相关中间件** → 最内层

让我们通过一个示例来说明：

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const app = new Koa();

// 1. 错误处理中间件 - 最外层
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = { error: err.message };
        // 触发应用级错误事件
        ctx.app.emit('error', err, ctx);
    }
});

// 2. 全局通用中间件
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    console.log(`${ctx.method} ${ctx.url} - ${Date.now() - start}ms`);
});

// 3. 第三方功能中间件
app.use(cors());         // 处理跨域
app.use(compress());     // 压缩响应
app.use(bodyParser());   // 解析请求体

// 4. 业务相关中间件
app.use(async (ctx, next) => {
    // 验证用户身份
    await auth(ctx, next);
});

// 5. 路由中间件
app.use(router.routes());
```

### 7.2. 不同类型中间件的顺序说明

#### 7.2.1. 错误处理中间件（最外层）

```javascript
// 应该放在最外层
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        // 错误处理逻辑
    }
});
```

**原因**：
- **可以捕获所有其他中间件中的错误**
- 统一的错误处理机制
- 防止错误导致应用崩溃

#### 7.2.2. 全局通用中间件（第二层）

```javascript
// 请求日志
app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url} - 开始`);
    await next();
    console.log(`${ctx.method} ${ctx.url} - 结束`);
});

// 响应时间统计
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});
```

**原因**：
- 需要记录所有请求的信息
- 不依赖于其他中间件的处理结果

#### 7.2.3. 第三方功能中间件（第三层）

```javascript
// 处理跨域
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// 解析请求体
app.use(bodyParser({
    enableTypes: ['json', 'form']
}));

// 静态文件服务
app.use(serve('./public'));
```

**原因**：
- 为后续中间件提供基础功能
- 相互之间可能有依赖关系

#### 7.2.4. 业务相关中间件（内层）

```javascript
// 用户认证
app.use(async (ctx, next) => {
    const token = ctx.headers.authorization;
    if (token) {
        ctx.state.user = await verifyToken(token);
    }
    await next();
});

// 权限检查
app.use(async (ctx, next) => {
    if (!ctx.state.user) {
        ctx.throw(401, '未授权');
    }
    await next();
});
```

**原因**：
- 依赖前面中间件的处理结果
- 针对特定业务场景

### 7.3. 特殊情况的顺序考虑

#### 7.3.1. 性能相关中间件

```javascript
// 压缩应该在返回具体内容之前
app.use(compress());

// 缓存中间件
app.use(async (ctx, next) => {
    const cacheKey = `cache:${ctx.url}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        ctx.body = cached;
        return;
    }
    await next();
    // 存储缓存
    await redis.set(cacheKey, ctx.body);
});
```

#### 7.3.2. 安全相关中间件

```javascript
// 安全头设置应该尽早
app.use(async (ctx, next) => {
    ctx.set('X-Frame-Options', 'DENY');
    ctx.set('X-Content-Type-Options', 'nosniff');
    await next();
});

// CSRF 保护
app.use(csrf());
```

### 7.4. 常见问题和解决方案

#### 7.4.1. 中间件冲突

```javascript
// 错误示例
app.use(bodyParser());  // 解析 JSON
app.use(async (ctx, next) => {
    // 直接读取原始请求体
    const raw = await getRawBody(ctx.req);  // 可能失败
    await next();
});

// 正确示例
app.use(async (ctx, next) => {
    // 需要原始请求体的处理
    const raw = await getRawBody(ctx.req);
    ctx.state.rawBody = raw;
    await next();
});
app.use(bodyParser());  // 之后再解析 JSON
```

#### 7.4.2. 条件中间件

```javascript
// 根据条件决定是否执行某个中间件
const conditionalMiddleware = (condition) => {
    return async (ctx, next) => {
        if (condition) {
            // 执行特定逻辑
            await someMiddleware(ctx, next);
        } else {
            await next();
        }
    };
};
```

## 8. 注意事项

### 8.1. **避免多次调用 next()**

   ```javascript
   app.use(async (ctx, next) => {
       await next(); // 只调用一次
       // await next(); // 错误：不要多次调用
   });
   ```

### 8.2. 正确的顺序安排

- 错误处理中间件应该放在最前面
   - 请求处理中间件按照依赖关系排序

```javascript
const Koa = require('koa');
const app = new Koa();

// 1. 错误处理放在最前面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

// 2. 通用中间件（如日志）
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.url} - ${Date.now() - start}ms`);
});

// 3. 第三方中间件
app.use(bodyParser());
app.use(cors());

// 4. 业务中间件
app.use(router.routes());
```

### 8.3. 避免顺序错误

```javascript
// ❌ 错误示例
app.use(router.routes());  // 路由放在了错误处理前面
app.use(errorHandler);     // 错误处理无法捕获路由中的错误

// ✅ 正确示例
app.use(errorHandler);     // 先注册错误处理
app.use(router.routes());  // 再注册路由
```

### 8.4. 始终使用 await

```javascript
// ❌ 错误示例
app.use(async (ctx, next) => {
  doAsyncOperation(); // 未使用 await，异步操作可能不会完成
  next(); // 未使用 await，可能导致洋葱模型失效
});

// ✅ 正确示例
app.use(async (ctx, next) => {
  await doAsyncOperation();
  await next();
});
```

### 8.5. 正确的错误处理

```javascript
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // 确保错误被正确处理
    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
    throw err; // 继续向上传递错误
  }
});
```

### 8.6. 正确使用 ctx.state →  在中间件间共享数据

```javascript
// ✅ 正确示例：使用 ctx.state 在中间件间共享数据
app.use(async (ctx, next) => {
  ctx.state.user = await getUser(ctx.header.authorization);
  await next();
});

app.use(async (ctx, next) => {
  // 在后续中间件中使用
  const user = ctx.state.user;
  await next();
});
```

### 8.7. 避免修改原始对象

```javascript
// ❌ 错误示例：直接修改原始请求对象
app.use(async (ctx, next) => {
  ctx.req.body = await parseBody(ctx.req);
  await next();
});

// ✅ 正确示例：使用 ctx 提供的属性
app.use(async (ctx, next) => {
  ctx.request.body = await parseBody(ctx.req);
  await next();
});
```

### 8.8. 避免不必要的异步操作

```javascript
app.use(async (ctx, next) => {
  // ✅ 正确示例：条件判断避免不必要的操作
  if (ctx.path === '/api' && !ctx.state.user) {
    ctx.throw(401);
    return;
  }
  await next();
});
```

### 8.9. 合理使用缓存

```javascript
app.use(async (ctx, next) => {
  const cacheKey = `cache:${ctx.url}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    ctx.body = JSON.parse(cached);
    return;
  }
  
  await next();
  
  // 缓存响应
  await redis.set(cacheKey, JSON.stringify(ctx.body), 'EX', 3600);
});
```

### 8.10. 请求验证

```javascript
app.use(async (ctx, next) => {
  // 验证请求头
  const apiKey = ctx.headers['x-api-key'];
  if (!apiKey) {
    ctx.throw(401, 'API key required');
  }
  
  // 验证请求大小
  const contentLength = parseInt(ctx.headers['content-length']);
  if (contentLength > 1024 * 1024) { // 1MB
    ctx.throw(413, 'Request entity too large');
  }
  
  await next();
});
```

### 8.11. 响应头安全

```javascript
app.use(async (ctx, next) => {
  await next();
  
  // 设置安全响应头
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
});
```

### 8.12. 确保资源释放

```javascript
app.use(async (ctx, next) => {
  const connection = await db.connect();
  try {
    ctx.state.db = connection;
    await next();
  } finally {
    // 确保资源被释放
    await connection.close();
  }
});
```

### 8.13. 超时处理

```javascript
const timeout = ms => new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('Request timeout')), ms);
});

app.use(async (ctx, next) => {
  try {
    await Promise.race([
      next(),
      timeout(5000) // 5秒超时
    ]);
  } catch (err) {
    if (err.message === 'Request timeout') {
      ctx.status = 504;
      ctx.body = 'Request timeout';
    } else {
      throw err;
    }
  }
});
```

### 8.14. 添加调试信息

```javascript
app.use(async (ctx, next) => {
  const requestId = uuid();
  ctx.state.requestId = requestId;
  
  console.log(`[${requestId}] Request started: ${ctx.method} ${ctx.url}`);
  const startTime = Date.now();
  
  try {
    await next();
  } finally {
    console.log(`[${requestId}] Request completed in ${Date.now() - startTime}ms`);
  }
});
```

### 8.15. 性能监控

```javascript
app.use(async (ctx, next) => {
  const metrics = {
    path: ctx.path,
    method: ctx.method,
    startTime: Date.now()
  };
  
  try {
    await next();
    metrics.status = ctx.status;
  } catch (err) {
    metrics.error = err.message;
    throw err;
  } finally {
    metrics.duration = Date.now() - metrics.startTime;
    // 发送指标到监控系统
    await sendMetrics(metrics);
  }
});
```

### 8.16. 集中式错误处理

```javascript
// 创建错误处理中间件
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' ? {stack: err.stack} : {})
      }
    };
    // 记录错误
    ctx.app.emit('error', err, ctx);
  }
};

// 使用错误处理中间件
app.use(errorHandler);
```
