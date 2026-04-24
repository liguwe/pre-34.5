# 前端常见的架构思路：篇一

`#前端架构` 

## 总结

- 分层架构
	- mvc 
	- MVVM 
	- vdom
	- 前中后台
	- 语言抽象的层次越高
		- 一般运行效率可能会有所衰减
		- 看`js/ts/c/汇编/机器码`等等等
	- 前端框架的分层
		-  **表现层**
			- 用户界面
			- 路由管理
		- **业务层**
			- 业务逻辑
			- 状态管理
		- **数据层**
			- API 调用
			- 数据持久化
- 模块化结构 → 将应用分解为独立的功能模块
	- esm commonjs
- 管道和过滤器：数据流处理，每个处理单元**独立且可组合**
	- gulp pile
	- koa 中间件 
		- 洋葱模型也有`管道`的影子
	- `vue`的`filter` 
	- Node 中 `流` 的
- 事件驱动/发布-订阅 → **松耦合**
- fork 风格：复制共享状态或资源来实现并行处理的架构模式
	- nodejs
		- 比如`nodeJS`的 `Cluster 模块` 
			- `Cluster`'这个词在计算机科学中通常指的是**一组计算机或服务器**
	- web worker
	- 多线程等
- 组件化架构：
	- 将 UI 和功能封装成独立、可重用的组件
		- 高内聚、低耦合
- 微前端架构：
	- 将前端应用分解为多个独立的微前端应用
- 单向数据流：Flux/Redux 架构
- 微内核架构，又称为”插件架构”
	- 核心系统
	- 插件模块
		- 比如 `Webpack、Babel、PostCSS`以及`ESLint`
		- 比如`jQuery`插件：简单说就是`jQuery.prototype.extend`用于扩展插件
	- 实现要点：
		- 微内核
			- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250103-2.png)
		- 插件系统
			- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250103-3.png)
		- 插件间通讯
		- 事件驱动的插件系统

## 1. 分层架构

核心思想：关注点分离，每层只负责特定功能。

没有什么问题是分层解决不了，如果解决不了, 就再加一层
- 比如`网络协议`，越来高层面向`人类`，底层面向`机器`
- 又比如现在所谓的 `后台、中台、前台`
- 又比如，语言抽象的层次越高，一般运行效率可能会有所衰减，看`js/ts/c/汇编/机器码`等等等
- 又比如，mvc 、MVVM 等等

回到，前端：
- `V-dom`，就是之前DOM上的一个分层 
	- 开发方式由之前`jQuery方式` 变成了`view=f(state)` 方式

### 1.1. 示例：MVC 架构

- **Model (模型)**: 数据和业务逻辑
- **View (视图)**: 用户界面
- **Controller (控制器)**: 处理用户输入，协调 Model 和 View

```javascript
// Model
class UserModel {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    updateName(name) {
        this.name = name;
    }
}

// View
class UserView {
    render(user) {
        return `<div>
            <h1>${user.name}</h1>
            <p>Age: ${user.age}</p>
        </div>`;
    }
}

// Controller
class UserController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }
    
    updateUserName(name) {
        this.model.updateName(name);
        this.refreshView();
    }
    
    refreshView() {
        const html = this.view.render(this.model);
        document.body.innerHTML = html;
    }
}
```

### 1.2. 示例 2：MVVM

- **Model**: 数据模型
- **View**: 视图层
- **ViewModel**: 视图模型，处理视图逻辑

Vue.js 示例

```javascript
// MVVM 实现示例 (Vue)
const app = new Vue({
    // View Model
    data: {
        message: 'Hello MVVM'
    },
    methods: {
        updateMessage(newValue) {
            this.message = newValue;
        }
    },
    // View
    template: `
        <div>
            <h1>{{message}}</h1>
            <input v-model="message">
        </div>
    `
});
```

### 1.3. 示例 3：前端框架的分层

- **表现层**
	- 用户界面
	- 路由管理
- **业务层**
	- 业务逻辑
	- 状态管理
- **数据层**
	- API 调用
	- 数据持久化

```javascript
// 分层架构示例
// API 层
class UserAPI {
    static async getUser(id) {
        return await fetch(`/api/users/${id}`);
    }
}

// 服务层
class UserService {
    static async getUserInfo(id) {
        const user = await UserAPI.getUser(id);
        return this.formatUserData(user);
    }
    
    static formatUserData(user) {
        // 数据处理逻辑
        return {
            ...user,
            fullName: `${user.firstName} ${user.lastName}`
        };
    }
}

// 视图层
class UserComponent extends React.Component {
    async componentDidMount() {
        const user = await UserService.getUserInfo(this.props.id);
        this.setState({ user });
    }
    
    render() {
        // 渲染逻辑
    }
}
```

## 2. 模块化结构

- ES Modules
- CommonJS
- AMD/RequireJS

## 3. 管道和过滤器

核心思想：数据流处理，每个处理单元独立且可组合。
- 比如在`Angular`里就有`管道`概念
- gulp的 `pipe`
- 甚至`koa`里的洋葱模型也有`管道`的影子（中间件）
- `vue`的`filter` 如 `&#123;&#123; message | capitalize &#125;&#125;`
- Node 中 `流` 的概念

## 4. 事件驱动/发布-订阅

核心思想：
- 通过事件的发布和订阅实现**松耦合**。

## 5. 复制：fork 风格

Fork 风格是一种通过复制共享状态或资源来实现并行处理的架构模式。在前端中，主要用于：

- 状态管理
- 并行计算
- 数据隔离
- 多线程处理

### 5.1. Web Worker 中的 Fork

### 5.2. 比如`nodeJS`的 `Cluster 模块` 

- Node.js 中的**集群模块**，允许创建`多个工作进程`来处理并发请求
- '`Cluster`' 这个词在计算机科学中通常指的是一组计算机或服务器，它们一起工作以提供更高的性能和可用性

```javascript hl:5,16
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers 可以共享任意的TCP连接 
  // 比如 共享HTTP服务器 
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

## 6. 组件化架构（Component-Based Architecture）

核心思想：**将UI和功能封装成独立、可重用的组件**。

- 设计原则
	- 单一职责
	- 高内聚、低耦合
	- 可复用性

## 7. 模块化架构（Modular Architecture）

核心思想：将应用分解为独立的功能模块

## 8. 微服务前端架构（Micro-Frontend Architecture）

核心思想：将前端应用分解为多个独立的微前端应用。

- 应用独立开发、部署
- 技术栈无关
- 独立运行时

## 9. 单向数据流：Flux/Redux 架构

- **Store**: 状态容器
- **Action**: 动作描述
- **Reducer**: 状态计算
- **Dispatcher**: 分发器

## 10. 微内核架构，又称为”插件架构”

### 10.1. 基本概念

微内核架构主要包含两部分：
1. 核心系统（Microkernel）：提供最基本的功能
2. 插件模块（Plugins）：提供扩展功能

- 微内核结构的难点在于建立一套粒度合适的**插件协议**、以及对插件之间进行适当的`隔离和解耦`。
	- 从而才能保证良好的扩展性、灵活性和可迁移性。
- 前端领域比较典型的例子是`Webpack、Babel、PostCSS`以及`ESLint`,
	- 这些应用需要应对复杂的定制需求，而且这些需求时刻在变，只有微内核架构才能保证灵活和可扩展性。
- 比如`jQuery`插件：简单说就是`jQuery.prototype.extend`用于扩展插件

```javascript
// jQuery 入口函数
var jQuery = function (selector, context) {
    return new jQuery.init(selector, context);
};

// jQuery 核心原型定义，也是 jQuery plugin 的扩展接口
jQuery.fn = jQuery.prototype = {
    hello: function hello() {
        console.log("hello world");
    },
    //... 其他定义
};

// 另一种扩展 plugin 的便捷方法，接收一个对象
jQuery.extend = jQuery.fn.extend = function(targetObj) {
    // 克隆 targetObj
}

// jQuery 真正的实例化构造函数
var init = function (selector, context) {
    // init dom elements
}
init.prototype = jQuery.fn;
jQuery.init = init;
$ = jQuery;
```

下面介绍前端微内核架构（Plugin Architecture）的设计思路和实现方式：

### 10.2. 基础微内核系统实现

```javascript
// 基础微内核系统实现
class Microkernel {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
    }

    // 注册插件
    registerPlugin(name, plugin) {
        this.plugins.set(name, plugin);
        // 初始化插件
        plugin.apply(this);
    }

    // 注册钩子
    addHook(name, callback) {
        if (!this.hooks.has(name)) {
            this.hooks.set(name, []);
        }
        this.hooks.get(name).push(callback);
    }

    // 触发钩子
    async applyHooks(name, ...args) {
        const hooks = this.hooks.get(name) || [];
        for (const hook of hooks) {
            await hook(...args);
        }
    }
}
```

### 10.3. 插件系统实现

```javascript
// 插件基类
class Plugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(kernel) {
        // 由具体插件实现
    }
}

// 生命周期管理
class LifecyclePlugin extends Plugin {
    apply(kernel) {
        kernel.addHook('beforeInit', () => {
            console.log('Before initialization');
        });

        kernel.addHook('afterInit', () => {
            console.log('After initialization');
        });
    }
}

// 路由插件示例
class RouterPlugin extends Plugin {
    apply(kernel) {
        kernel.addHook('route', (path) => {
            // 路由处理逻辑
            console.log(`Routing to ${path}`);
        });
    }
}
```

### 10.4. Webpack 风格的插件系统

```javascript
// Webpack风格的编译器实现
class Compiler {
    constructor() {
        this.hooks = {
            start: new SyncHook(),
            compile: new AsyncSeriesHook(['compilation']),
            done: new SyncHook(['stats'])
        };
        this.plugins = [];
    }

    // 应用插件
    use(plugin) {
        this.plugins.push(plugin);
        plugin.apply(this);
    }

    // 运行编译
    async run() {
        this.hooks.start.call();
        
        const compilation = {};
        await this.hooks.compile.promise(compilation);
        
        this.hooks.done.call({ success: true });
    }
}

// Webpack风格的插件示例
class MyPlugin {
    apply(compiler) {
        compiler.hooks.start.tap('MyPlugin', () => {
            console.log('开始编译');
        });

        compiler.hooks.compile.tapAsync('MyPlugin', async (compilation, callback) => {
            console.log('编译中...');
            await someAsyncTask();
            callback();
        });

        compiler.hooks.done.tap('MyPlugin', (stats) => {
            console.log('编译完成');
        });
    }
}
```

### 10.5. UmiJS 风格的插件系统

```javascript
// UmiJS风格的服务实现
class UmiService {
    constructor() {
        this.plugins = [];
        this.hooks = {};
    }

    // 注册插件
    registerPlugin(plugin) {
        this.plugins.push(plugin);
    }

    // 应用插件
    applyPlugins() {
        this.plugins.forEach(plugin => {
            plugin.apply({
                api: this.getAPI(),
                service: this
            });
        });
    }

    // 获取API接口
    getAPI() {
        return {
            // 修改配置
            modifyConfig: (fn) => {
                this.hooks.modifyConfig = fn;
            },
            // 添加路由
            addRoutes: (routes) => {
                this.hooks.addRoutes = routes;
            }
        };
    }
}

// UmiJS插件示例
class UmiPlugin {
    apply({ api }) {
        // 修改配置
        api.modifyConfig((config) => {
            return {
                ...config,
                // 添加配置
            };
        });

        // 添加路由
        api.addRoutes([
            {
                path: '/custom',
                component: './CustomPage'
            }
        ]);
    }
}
```

### 10.6. 事件驱动的插件系统

```javascript
// 事件驱动的插件系统
class EventDrivenCore {
    constructor() {
        this.events = new Map();
        this.plugins = new Set();
    }

    // 注册插件
    use(plugin) {
        this.plugins.add(plugin);
        plugin.setup(this);
    }

    // 注册事件监听
    on(event, handler) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(handler);
    }

    // 触发事件
    emit(event, ...args) {
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(...args));
        }
    }
}

// 事件驱动插件示例
class LoggerPlugin {
    setup(core) {
        core.on('request', (req) => {
            console.log(`${new Date()}: ${req.url}`);
        });
    }
}
```

### 10.7. 可配置的插件系统

```javascript
// 配置系统
class Config {
    constructor(initialConfig = {}) {
        this.config = initialConfig;
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
    }

    merge(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
    }
}

// 可配置的插件核心
class ConfigurableCore {
    constructor() {
        this.config = new Config();
        this.plugins = new Map();
    }

    // 使用插件
    use(plugin, options = {}) {
        const instance = new plugin(options);
        this.plugins.set(plugin.name, instance);
        instance.apply(this);
    }

    // 获取配置
    getConfig() {
        return this.config;
    }
}

// 可配置插件示例
class ThemePlugin {
    constructor(options) {
        this.options = options;
    }

    apply(core) {
        core.getConfig().merge({
            theme: this.options.theme || 'light'
        });
    }
}
```

### 10.8. 插件通信机制

```javascript
// 插件间通信系统
class PluginMessenger {
    constructor() {
        this.channels = new Map();
    }

    // 创建通信通道
    createChannel(name) {
        if (!this.channels.has(name)) {
            this.channels.set(name, new Set());
        }
        return {
            send: (message) => this.broadcast(name, message),
            subscribe: (handler) => this.subscribe(name, handler)
        };
    }

    // 广播消息
    broadcast(channel, message) {
        const subscribers = this.channels.get(channel);
        if (subscribers) {
            subscribers.forEach(handler => handler(message));
        }
    }

    // 订阅消息
    subscribe(channel, handler) {
        if (!this.channels.has(channel)) {
            this.channels.set(channel, new Set());
        }
        this.channels.get(channel).add(handler);
    }
}

// 使用通信的插件示例
class DataPlugin {
    apply(core) {
        const channel = core.messenger.createChannel('data');
        
        // 发送数据
        channel.send({ type: 'update', data: {} });
    }
}

class UIPlugin {
    apply(core) {
        const channel = core.messenger.createChannel('data');
        
        // 接收数据
        channel.subscribe((message) => {
            if (message.type === 'update') {
                this.updateUI(message.data);
            }
        });
    }
}
```

微内核架构的优点：
1. 高度可扩展
2. 模块化程度高
3. 核心功能精简
4. 插件按需加载
5. 维护成本低
使用场景：
1. 构建工具（Webpack、Rollup）
2. 框架（UmiJS、VuePress）
3. 编辑器插件系统
4. 应用扩展系统
需要注意的问题：
1. 插件依赖管理
2. 插件加载顺序
3. 插件冲突处理
4. 性能开销控制
5. 版本兼容性

## 11. 实践建议

1. 不要过度设计
2. 保持架构的灵活性
3. 考虑未来的扩展性
4. 关注代码的可测试性
5. 注重开发效率和维护成本

## 12. 好的架构应该是

- 清晰易懂
- 易于维护
- 便于扩展
- 性能优良
- **适合团队、适合业务**
