# vite 中如何使用 Module Federation

`#前端工程化` 

## 1. 总结

- vite 中使用 `@originjs/vite-plugin-federation` 插件来实现模块联邦功能
- 使用远程组件：`defineAsyncComponent`
- 使用 `defineAsyncComponent` 错误处理和降级策略
	- 建议好好实现
- 如何在 Vite 的 Module Federation 中共享 Pinia 状态
	- 在`主应用和远程应用`中都配置 Pinia 作为共享依赖
	- `远程应用`中定义 Store ，并暴露 Store
- 共享实例
	- 建议：vue 和 pinia 、 vue-router **必须单例**

## 2. 定义

在 Vite 中，我们可以使用 `@originjs/vite-plugin-federation` 插件来实现模块联邦功能。

> webpack 中使用模块联邦可参考 [10. Webpack 5 的 Module Federation](/Qeq16P)

## 3. 基本配置示例

### 3.1. 主应用（Host）配置

```typescript hl:10,15
// vite.config.ts
import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'host-app',
      remotes: {
        remoteApp: {
          external: 'http://localhost:5001/assets/remoteEntry.js',
          format: 'esm'
        }
      },
      shared: ['vue', 'pinia'] // 共享依赖
    })
  ]
})
```

### 3.2. 远程应用（Remote）配置

```typescript hl:10
// vite.config.ts
import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.vue',
        './Header': './src/components/Header.vue'
      },
      shared: ['vue', 'pinia']
    })
  ],
  build: {
    target: 'esnext'
  }
})
```

## 4. 使用远程组件

```vue hl:15
<!-- 主应用中使用远程组件 -->
<template>
  <div>
    <h1>Host Application</h1>
    <Suspense>
      <RemoteButton />
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const RemoteButton = defineAsyncComponent(() => 
  import('remoteApp/Button')
)
</script>
```

## 5. 带版本控制的共享依赖

```typescript hl:15
// vite.config.ts
export default defineConfig({
  plugins: [
    federation({
      name: 'host-app',
      remotes: {
        remoteApp: 'http://localhost:5001/assets/remoteEntry.js'
      },
      shared: {
        vue: { 
          requiredVersion: '^3.2.0',
          singleton: true 
        },
        'vue-router': {
          requiredVersion: '^4.0.0',
          singleton: true
        }
      }
    })
  ]
})
```

## 6. 动态远程加载

```typescript hl:8
// vite.config.ts
export default defineConfig({
  plugins: [
    federation({
      name: 'host-app',
      remotes: {
        remoteApp: {
          external: `Promise.resolve('http://localhost:5001/assets/remoteEntry.js')`,
          format: 'esm'
        }
      }
    })
  ]
})
```

## 7. 开发模式配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      exposes: {
        './components': './src/components/index.ts'
      },
      shared: ['vue']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    sourcemap: true
  }
})
```

## 8. 错误处理和降级策略

下面是一个包装后的 `RemoteComponent` 组件

```vue
<template>
  <Suspense>
    <template `#default>`
      <RemoteComponent />
    </template>
    <template `#fallback>`
      <div>Loading remote component...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent, h } from 'vue'

const RemoteComponent = defineAsyncComponent({
  loader: () => import('remoteApp/Component'),
  loadingComponent: () => h('div', 'Loading...'),
  errorComponent: () => h('div', 'Failed to load component'),
  delay: 200,
  timeout: 3000
})
</script>
```

## 9. 示例：如何在 Vite 的 Module Federation 中共享 Pinia 状态

### 9.1. 首先需要在`主应用和远程应用`中都配置 Pinia 作为共享依赖

```typescript
// vite.config.ts (主应用和远程应用都需要配置)
import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      // ... 其他配置
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.0.0'
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.0.0'
        }
      }
    })
  ]
})
```

> 创建共享 Store

### 9.2. `远程应用`中定义 Store ，并暴露 Store

#### 9.2.1. 定义 Store 

```typescript
// remote-app/src/stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    message: 'Hello from Remote App'
  }),
  
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    setMessage(msg: string) {
      this.message = msg
    }
  },
  
  getters: {
    doubleCount(): number {
      return this.count * 2
    }
  }
})

// 导出 store 定义
export type CounterStore = ReturnType<typeof useCounterStore>
```

#### 9.2.2. 暴露 Store

```typescript
// remote-app/src/stores/index.ts
export { useCounterStore } from './counter'

// vite.config.ts (远程应用)
export default defineConfig({
  plugins: [
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      exposes: {
        './stores': './src/stores/index.ts'
      },
      shared: {
        vue: { singleton: true },
        pinia: { singleton: true }
      }
    })
  ]
})
```

### 9.3. 主应用创建 Pinia 实例，并使用远程 Store

#### 9.3.1. 主应用中创建 Pinia 实例

```typescript
// host-app/src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

#### 9.3.2. 主应用中使用远程 Store

```typescript hl:17
// host-app/src/components/Counter.vue
<template>
  <div>
    <h2>Counter from Remote Store</h2>
    <p>Count: {{ counter.count }}</p>
    <p>Double Count: {{ counter.doubleCount }}</p>
    <p>Message: {{ counter.message }}</p>
    
    <button @click="counter.increment()">Increment</button>
    <button @click="counter.decrement()">Decrement</button>
    <button @click="updateMessage">Update Message</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCounterStore } from 'remoteApp/stores'

const counter = useCounterStore()

const updateMessage = () => {
  counter.setMessage('Updated from Host App')
}

onMounted(() => {
  // 初始化操作
  console.log('Store mounted in host app')
})
</script>
```

#### 9.3.3. 在主应用中扩展远程 Store

```typescript
// host-app/src/stores/enhancedCounter.ts
import { defineStore } from 'pinia'
import { useCounterStore } from 'remoteApp/stores'

export const useEnhancedCounterStore = defineStore('enhancedCounter', {
  state: () => ({
    localData: 'Host App Data'
  }),
  
  actions: {
    async complexAction() {
      const remoteCounter = useCounterStore()
      remoteCounter.increment()
      this.localData = `Updated after remote count: ${remoteCounter.count}`
    }
  },
  
  getters: {
    combinedInfo(): string {
      const remoteCounter = useCounterStore()
      return `${this.localData} - Remote Count: ${remoteCounter.count}`
    }
  }
})
```

## 10. 配置建议参考

### 10.1. 基础配置建议：vue 和 pinia 、 vue-router 必须单例

```javascript hl:8,15
// vite.config.js
export default defineConfig({
  plugins: [
    federation({
      shared: {
        // Vue 核心运行时
        vue: {
          singleton: true,       // 确保整个应用只有一个 Vue 实例
          requiredVersion: '^3.3.0', // 指定 Vue 版本范围
          strictVersion: true,   // 强制版本匹配，防止运行时错误
          eager: true           // 立即加载 Vue，而不是按需加载
        },
        // Pinia 状态管理
        pinia: {
          singleton: true,       // 必须单例！确保状态管理的一致性
          requiredVersion: '^2.1.0',
          strictVersion: true,   // 严格版本控制，避免状态管理异常
          eager: true           // 预加载，因为状态管理是核心功能
        },
        // Vue Router 路由管理
        'vue-router': {
          singleton: true,       // 路由实例必须唯一
          requiredVersion: '^4.2.0',
          strictVersion: true,   // 严格版本控制，避免路由冲突
          eager: true           // 预加载路由，避免首次加载延迟
        }
      }
    })
  ]
})
```

### 10.2. 主应用配置

```javascript
// host-app/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host',           // 主应用名称
      remotes: {
        // 配置远程应用的入口
        remote_app: 'http://localhost:5001/remoteEntry.js'
      },
      shared: {
        // 核心运行时依赖
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0',
          strictVersion: true,
          eager: true
        },
        // Pinia 配置
        pinia: {
          singleton: true,     // 确保 Pinia store 全局唯一
          requiredVersion: '^2.1.0',
          strictVersion: true, // 严格控制版本，确保状态管理的稳定性
          eager: true         // 预加载 Pinia
        },
        // Vue Router 配置
        'vue-router': {
          singleton: true,     // 路由实例必须唯一
          requiredVersion: '^4.2.0',
          strictVersion: true,
          eager: true
        },
        // Element Plus UI 库配置
        'element-plus': {
          singleton: true,     // UI 库也保持单例
          requiredVersion: '^2.4.0',
          strictVersion: false, // UI 库版本可以稍微宽松一点
          eager: false         // UI 组件按需加载，优化首屏加载
        },
        // VueUse 工具库配置
        '@vueuse/core': {
          singleton: true,
          requiredVersion: '^10.5.0',
          strictVersion: false, // 工具库版本可以宽松
          eager: false         // 按需加载，优化性能
        }
      }
    })
  ]
})
```

### 10.3. 远程应用配置

```javascript
// remote-app/vite.config.js
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remote_app',    // 远程应用名称
      filename: 'remoteEntry.js', // 远程应用入口文件名
      exposes: {
        // 暴露组件和 store 给主应用使用
        './Feature': './src/components/Feature.vue',
        './store': './src/stores/feature.js'
      },
      shared: {
        // 与主应用保持一致的依赖配置
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0',
          strictVersion: true,
          eager: true
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0',
          strictVersion: true,
          eager: true
        }
      }
    })
  ]
})
```

### 10.4. 主应用 Store 设置

```typescript
// host-app/src/stores/index.ts
import { createPinia } from 'pinia'

// 创建 Pinia 实例
export const pinia = createPinia()

// 定义主应用的 store
export const useMainStore = defineStore('main', {
  state: () => ({
    // 主应用全局状态
    globalSettings: {},
    userInfo: {},
    // ... 其他状态
  }),
  actions: {
    // 主应用全局动作
    async initializeApp() {
      // 应用初始化逻辑
    }
  }
})
```

### 10.5. 远程应用 Store 设置

```typescript
// remote-app/src/stores/feature.ts
import { defineStore } from 'pinia'

export const useFeatureStore = defineStore('feature', {
  state: () => ({
    // 使用命名空间避免与主应用状态冲突
    featureData: null,
    featureStatus: 'idle',
    // ... 特性相关状态
  }),
  actions: {
    // 添加特性前缀避免方法名冲突
    async initializeFeature() {
      // 特性初始化逻辑
    },
    // 确保 action 名称具有特性标识
    featureSpecificAction() {
      // 特性特定的动作
    }
  }
})
```

## 11. 注意事项

- 确保将构建目标设置为 `esnext`，以支持动态导入
- 在生产环境中考虑启用代码分割和压缩
- 开发时建议禁用代码压缩，便于调试，并启动 sourcemap
- 使用 `singleton` 模式避免多个版本共存
	- 确保**共享依赖在整个应用中只加载一个实例**
- `eager`: 决定共享依赖的加载时机
	- true: 立即加载（同步加载）
	- false: 按需加载（异步加载）
- 明确指定共享依赖的版本要求
- 实现合适的加载状态和错误提示及降级方案
