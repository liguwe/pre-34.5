# 实现一个简易版的 Koa

`#nodejs` `#koa` 

## 1. 最简源码实现

### 1.1. 代码实现

```javascript hl:2
const http = require("http");
const EventEmitter = require("events");

// 实现洋葱模型的中间件组合函数
function compose(middlewares) {
  return function (context) {
    let index = -1;

    function dispatch(i) {
      // 如果在一个中间件中多次调用 next()，则抛出错误
      if (i <= index) {
        return Promise.reject(new Error("next() called multiple times"));
      }

      index = i;
      const fn = middlewares[i];

      if (i === middlewares.length) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(fn(context, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispatch(0);
  };
}

// 简化版的 Koa 框架,继承自 EventEmitter
class MiniKoa extends EventEmitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(null);
  }

  // 注册中间件
  use(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("Middleware must be a function!");
    }
    // 将中间件函数添加到 middleware 数组中
    this.middleware.push(fn);
    // 返回 this，方便链式调用
    return this;
  }

  // 创建上下文对象
  createContext(req, res) {
    const context = Object.create(this.context);

    // 简化版的请求和响应对象
    context.req = req;
    context.res = res;

    // 添加常用的请求属性
    context.method = req.method;
    context.url = req.url;
    context.path = req.url.split("?")[0];

    // 添加常用的响应方法
    context.status = 404;
    context.body = null;

    context.set = function (key, value) {
      res.setHeader(key, value);
    };

    return context;
  }

  // 处理请求
  handleRequest(ctx) {
    const fn = compose(this.middleware);

    return fn(ctx)
      .then(() => this.handleResponse(ctx))
      .catch((err) => this.handleError(err, ctx));
  }

  // 处理响应
  handleResponse(ctx) {
    const body = ctx.body;
    const res = ctx.res;

    if (body === null) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    if (typeof body === "string") {
      res.setHeader("Content-Type", "text/plain");
      res.end(body);
      return;
    }

    if (Buffer.isBuffer(body)) {
      res.setHeader("Content-Type", "application/octet-stream");
      res.end(body);
      return;
    }

    if (typeof body === "object") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
      return;
    }
  }

  // 错误处理
  handleError(err, ctx) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message || "Internal Server Error",
    };
    this.handleResponse(ctx);
  }

  // 启动服务器
  listen(...args) {
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }

  // 生成回调函数
  callback() {
    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx);
    };
  }
}

module.exports = MiniKoa;

```

### 1.2. 主要功能

1. **中间件组合函数 `compose`**：
	- 这个函数接受一个**中间件数组**，并返回一个函数，该函数会依次执行这些中间件。
	- 中间件通过调用 `next()` 来传递控制权给下一个中间件。
	- 如果在一个中间件中多次调用 `next()`，会抛出错误。
1. **`MiniKoa` 类**：
	- 继承自 `EventEmitter`，允许实例在特定事件上注册监听器。
	- 包含一个 `middleware` 数组，用于存储中间件函数。
	- 提供了 `use` 方法来注册中间件。
	- 提供了 `createContext` 方法来创建上下文对象 `context`，该对象包含请求和响应的相关信息。
	- 提供了 `handleRequest` 方法来处理请求，调用中间件组合函数，并处理响应或错误。
	- 提供了 `handleResponse` 方法来处理响应，根据 `context.body` 的类型设置响应头和响应体。
	- 提供了 `handleError` 方法来处理错误，设置错误状态码和错误信息。
	- 提供了 `listen` 方法来启动 HTTP 服务器。
	- 提供了 `callback` 方法来生成 HTTP 服务器的回调函数。

### 1.3. 为什么需要使用 `EventEmitter`

`MiniKoa` 继承自 `EventEmitter`，主要是为了**提供事件驱动**的能力。以下是一些可能的用途：

1. **错误处理**：
	- 可以在发生错误时触发特定事件，允许用户注册错误处理器。
	- 例如
		- 用户可以通过 `app.on('error', (err) => { ... })` 来处理全局错误。
2. **日志记录**：
	- 可以在特定事件（如请求开始、请求结束）时触发事件，允许用户注册日志记录器。
	- 例如，用户可以通过 `app.on('request', (ctx) => { ... })` 来记录请求日志。
3. **扩展功能**：
	- 允许用户在特定事件上注册自定义功能，增强框架的灵活性和可扩展性。

总之，`EventEmitter` 提供了一种灵活的机制来处理异步事件，使得框架更加健壮和可扩展。

## 2. 使用示例

```javascript
const MiniKoa = require("./mini-koa");
const app = new MiniKoa();

// 记录请求日志的中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`${ctx.method} ${ctx.url}`);

  await next();

  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 处理错误的中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
    };
  }
});

// 业务逻辑中间件
app.use(async (ctx) => {
  if (ctx.path === "/") {
    ctx.body = "Hello MiniKoa!";
  } else if (ctx.path === "/json") {
    ctx.body = { message: "Hello MiniKoa!" };
  } else if (ctx.path === "/error") {
    throw new Error("Oops! Something went wrong!");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

```

## 3. 继续扩展

这个实现虽然简化了很多细节，但保留了 Koa 的核心特性和设计理念。你可以基于这个基础版本继续添加更多功能，比如：
1. 添加更多的上下文方法
2. 实现请求体解析
3. 添加更多的响应类型支持
4. 实现静态文件服务
5. 添加路由功能
6. 实现 `Cookie` 支持

## 4. Koa 的源码目录结构及其功能

Koa 的源码结构非常精简，这也体现了它的设计理念：**保持核心简单，通过中间件扩展功能**。以下是主要目录和文件的分析：

### 4.1. 根目录结构

```bash
koa/
├── lib/           # 核心源码目录
├── docs/          # 文档目录
├── test/          # 测试用例目录
├── package.json   # 项目配置文件
└── History.md     # 版本更新历史
```

### 4.2. lib 目录（核心源码）

```bash
lib/
├── application.js  # 应用程序的主类
├── context.js      # 上下文对象
├── request.js      # 请求对象的封装
└── response.js     # 响应对象的封装
```

让我们详细分析每个核心文件的功能：

#### 4.2.1. `application.js`

- 框架的核心文件，导出 Koa 类
- 主要功能：
	- 中间件管理（use 方法）
	- 服务器创建和监听（listen 方法）
	- 上下文创建和处理
	- 错误处理机制

```javascript
// 核心代码示例
class Application extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  // ...
}
```

>  很多 Object.create()

#### 4.2.2. `context.js`

- 请求`上下文对象`的实现
- 主要功能：
	- 封装请求和响应对象
	- 提供便捷的访问器属性
	- 错误处理方法
	- 状态管理

```javascript 
const context = {
  get url() {
    return this.request.url;
  },
  get body() {
    return this.response.body;
  },
  set body(val) {
    this.response.body = val;
  },
  // ...
};
```

#### 4.2.3. `request.js`

- HTTP 请求对象的封装
- 主要功能：
	- 请求头解析
	- 查询字符串处理
	- 请求方法判断
	- `Content-Type` 处理

```javascript
module.exports = {
  get header() {
    return this.req.headers;
  },
  get method() {
    return this.req.method;
  },
  // ...
};
```

#### 4.2.4. `response.js`

- HTTP 响应对象的封装
- 主要功能：
	- 响应头设置
	- 状态码管理
	- 响应体处理
	- Content-Type 设置

```javascript
module.exports = {
  get status() {
    return this.res.statusCode;
  },
  set status(code) {
    this.res.statusCode = code;
  },
  // ...
};
```

#### 4.2.5. `test/` 目录

- 包含完整的单元测试
- 按功能模块划分的测试用例
- 提供了使用示例和最佳实践

#### 4.2.6. `docs/` 目录

- API 文档
- 使用指南
- 中间件开发指南
- 错误处理文档
