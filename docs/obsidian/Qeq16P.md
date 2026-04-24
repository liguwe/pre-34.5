# Webpack 5 的 Module Federation

`#webpack` 

## 1. 总结

- Module Federation 的特点，两个
	- **动态加载**另一个应用的代码和依赖
	- 可在运行时**共享代码**
- 配置说明：
	- new ModuleFederationPlugin
		- remotes
		- exposes
		- shared：
			- 比如 React 
				- 可指定 requiredVersion 版本
				- singleton 是否单例
- 示例：
	- 使用 promise **可自定义动态远程加载**
		- 错误边界，自己写代码，可以自己实现
		- 请求时可添加**认证逻辑**
	- 共享状态管理，记得 exposes
- 其他
	- `remoteEntry.js` 是 Module Federation 中的一个**约定俗成**的命名
		- 也可
			- ① 根据环境使用不同的文件名
			- ② 添加 hash 以处理缓存
			- ③ 用版本号作为文件名的一部分
	- 端口配置有什么要求
		- 建议**不同应用分配不同端口**，比如主应用、用户管理管理
		- `[远程应用名称]@[远程入口文件URL]`
			- `app1@http://localhost:3001/remoteEntry.js`


> 关于 vite 如何使用模块联邦，可见 [11. vite 中如何使用 Module Federation](/d4V6Ed)

## 2. Module Federation 基本概念

- Module Federation 允许一个 **JavaScript 应用动态地加载另一个应用的代码和依赖**。
- 它是实现微前端的一种方式，使得不同的构建可以**在运行时共享代码**。

## 3. 使用配置说明

### 3.1. 主应用配置

```javascript hl:6,9,13,18
// webpack.config.js - 主应用配置示例
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',              // 当前应用名称
      filename: 'remoteEntry.js', // 暴露的文件名称
      remotes: {                 // 声明需要使用的远程应用
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      // 暴露给其他应用的模块
      exposes: {                
        './Header': './src/components/Header',
        './Footer': './src/components/Footer'
      },
      // 共享依赖
      shared: {                 
        react: { 
          singleton: true,      // 确保只加载一个版本
          requiredVersion: '^17.0.2'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^17.0.2'
        }
      }
    })
  ]
};
```

### 3.2. 子应用配置

```javascript hl:7
// webpack.config.js - 子应用配置示例
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Card': './src/components/Card'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

### 3.3. 使用示例：主应用中加载远程组件

```javascript hl:6
// 主应用中加载远程组件
// App.js
import React, { Suspense } from 'react';

// 使用动态导入加载远程组件
// 需要子应用配置，并且expose
const RemoteButton = React.lazy(() => import('app1/Button'));
const RemoteCard = React.lazy(() => import('app1/Card'));

function App() {
  return (
    <div>
      <h1>主应用</h1>
      <Suspense fallback="Loading Button...">
        <RemoteButton />
      </Suspense>
      <Suspense fallback="Loading Card...">
        <RemoteCard />
      </Suspense>
    </div>
  );
}

// 入口文件 index.js
import('./bootstrap').catch(err => console.error(err));
```

## 4. 示例 1：主应用和远程组件

### 4.1. 主应用：3001 端口

```javascript hl:14,26
// webpack.config.js (主应用)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    port: 3000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        remote: "remote@http://localhost:3001/remoteEntry.js",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    }),
  ],
};

// src/App.js (主应用)
import React, { Suspense } from "react";
const RemoteButton = React.lazy(() => import("remote/Button"));

function App() {
  return (
    <div>
      <h1>主应用</h1>
      <Suspense fallback="Loading Button...">
        <RemoteButton />
      </Suspense>
    </div>
  );
}
```

### 4.2. Remote Application (远程应用) 的 Button 组件，需要 exposes

```javascript hl:14
// webpack.config.js (远程应用)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    port: 3001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true }
      }
    }),
  ],
};

// src/Button.js (远程应用) 组件
import React from "react";

const Button = () => (
  <button onClick={() => alert("Hello from Remote!")}>
    Remote Button
  </button>
);

export default Button;
```

## 5. 示例 2：动态远程加载示例

### 5.1. 主应用

```javascript hl:10
// webpack.config.js (主应用)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      remotes: {
        // 动态远程配置
        remote: `promise new Promise(resolve => {
          const remoteUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3001'
            : 'https://production.com';
          const script = document.createElement('script');
          script.src = '${remoteUrl}/remoteEntry.js';
          script.onload = () => {
            resolve(window.remote);
          };
          document.head.appendChild(script);
        })`,
      },
      shared: { react: { singleton: true } }
    }),
  ],
};

// App.js
const loadComponent = async () => {
  const component = await import('remote/Component');
  return component.default;
};
```

## 6. 示例 3：共享状态管理

```javascript hl:7
/// store-app/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'store',
      filename: 'remoteEntry.js',
      exposes: {
        './store': './src/store',
        './StoreProvider': './src/StoreProvider'
      },
      shared: {
        react: { singleton: true },
        'react-redux': { singleton: true },
        '@reduxjs/toolkit': { singleton: true }
      }
    })
  ]
};

// consumer-app/webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'consumer',
      remotes: {
        store: 'store@http://localhost:3002/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-redux': { singleton: true },
        '@reduxjs/toolkit': { singleton: true }
      }
    })
  ]
};

// store-app/src/store.js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // reducers
  }
});

// consumer-app/src/App.js
import { Provider } from 'react-redux';
import { store } from 'store/store';

export default function App() {
  return (
    <Provider store={store}>
      {/* 应用内容 */}
    </Provider>
  );
}

```

## 7. 示例 4：路由集成示例（React Router）

- 多个远程应用

```jsx hl:5,6
// webpack.config.js (主应用)
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    remote1: "remote1@http://localhost:3001/remoteEntry.js",
    remote2: "remote2@http://localhost:3002/remoteEntry.js",
  },
  shared: {
    react: { singleton: true },
    "react-router-dom": { singleton: true },
  },
});

// App.js (主应用)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const RemoteApp1 = React.lazy(() => import("remote1/App"));
const RemoteApp2 = React.lazy(() => import("remote2/App"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <Routes>
          <Route path="/app1/*" element={<RemoteApp1 />} />
          <Route path="/app2/*" element={<RemoteApp2 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## 8. 示例 5：带版本控制的共享依赖示例

```javascript hl:10
// webpack.config.js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    remote: "remote@http://localhost:3001/remoteEntry.js",
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: "^18.0.0",
    },
    "react-dom": {
      singleton: true,
      requiredVersion: "^18.0.0",
    },
    "@material-ui/core": {
      singleton: true,
      requiredVersion: "^4.12.0",
    },
  },
});
```

## 9. 示例 6：错误边界

```javascript
// 主应用配置
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: `promise new Promise((resolve, reject) => {
          const remoteUrl = 'http://localhost:3001/remoteEntry.js';
          const script = document.createElement('script');
          script.src = remoteUrl;
          script.onerror = () => {
            console.error('Failed to load remote app');
            resolve({
              get: (request) => {
                return Promise.resolve(() => {
                  return () => {
                    return <div>Failed to load remote component</div>;
                  };
                });
              },
              init: () => {}
            });
          };
          script.onload = () => {
            resolve(window.remoteApp);
          };
          document.head.appendChild(script);
        })`
      }
    })
  ]
};

// 使用带错误处理的远程组件
const RemoteComponent = React.lazy(() => {
  return import('remoteApp/Component')
    .catch(err => {
      console.error('Failed to load remote component:', err);
      return { default: () => <div>Fallback UI</div> };
    });
});

```

## 10. 示例 7：错误边界

```javascript
// ErrorBoundary.js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>远程组件加载失败</h1>;
    }
    return this.props.children;
  }
}

// App.js
const RemoteComponent = React.lazy(() => import("remote/Component"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <RemoteComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 11. 示例 8：带认证的模块联邦示例

```javascript hl:9
// webpack.config.js
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    remote: `promise new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'http://localhost:3001/remoteEntry.js';
      
      // 添加认证token
      script.crossOrigin = 'anonymous';
      const token = localStorage.getItem('auth_token');
      if (token) {
        script.setAttribute('data-auth', token);
      }
      
      script.onload = () => {
        resolve(window.remote);
      };
      document.head.appendChild(script);
    })`,
  },
});
```

## 12. 常见问题

### 12.1. 为什么都叫 remoteEntry.js ?

`remoteEntry.js` 是 Module Federation 中的一个约定俗成的命名，但这个名称实际上是可以自定义的，建议可以根据需要自定义入口文件名：
- 版本管理
- 缓存控制
- 环境区分

```javascript
 // ① 根据环境使用不同的文件名
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      // 根据环境使用不同的文件名
      filename: process.env.NODE_ENV === 'production'
        ? 'remoteEntry.prod.js'
        : 'remoteEntry.dev.js',
      exposes: {
        './Component': './src/Component'
      }
    })
  ]
};

// ② 添加 hash 以处理缓存
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      // 添加 hash 以处理缓存
      filename: 'remoteEntry.[contenthash].js',
      exposes: {
        './Component': './src/Component'
      }
    })
  ]
};


// ③ 用版本号作为文件名的一部分
// webpack.config.js
const package = require('./package.json');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      // 使用版本号作为文件名的一部分
      filename: `remoteEntry.${package.version}.js`,
      exposes: {
        './Component': './src/Component'
      }
    })
  ]
};

```

### 12.2. 端口配置有什么要求？

建议提取成变量，如下代码

```javascript
// ports.config.js
module.exports = {
  host: 3000,
  remotes: {
    app1: 3001,
    app2: 3002,
    app3: 3003
  }
};

// 示例端口分配方案
const ports = {
  host: 3000,      // 主应用
  auth: 3001,      // 认证应用
  dashboard: 3002, // 仪表盘应用
  users: 3003,     // 用户管理应用
  orders: 3004     // 订单管理应用
};


// 不同环境的端口范围示例
const portRanges = {
  development: {
    start: 3000,
    end: 3999
  },
  testing: {
    start: 4000,
    end: 4999
  },
  staging: {
    start: 5000,
    end: 5999
  }
};
```

### 12.3. `app1@` ？

- 作用
	- 标识远程模块的来源
	- 确保模块正确加载
	- 维护模块间的依赖关系
- 规则：
	- `app1`: 远程应用的名称
	- `@`: 分隔符
	- `http://localhost:3001/remoteEntry.js`: 远程入口文件的URL

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        // 格式: [远程应用名称]@[远程入口文件URL]
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        // 等价于
        app1: `${remoteName}@${remoteUrl}`
      }
    })
  ]
};

```
