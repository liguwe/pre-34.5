# Vite 在开发时对 Source Map 的特殊之处

## 1. Vite 开发时的特点

### 1.1. 原生 ESM 的影响

```javascript
// 浏览器中实际请求的模块
import { createApp } from '/@modules/vue.js'
import App from '/src/App.vue'
```

特点：
- 利用浏览器原生 ESM 能力
- 无需打包，按需编译
- 模块路径重写（`/@modules/`前缀）

### 1.2. 开发时的 Source Map 处理

```javascript
// vite.config.js
export default {
  build: {
    sourcemap: true // 生产环境配置
  },
  // 开发环境默认启用 source map
  server: {
    sourcemap: 'inline' // 开发环境默认值
  }
}
```

## 2. Vite 开发时的 Source Map 特点

### 2.1. 按需生成

```javascript
// 示例：Vue 单文件组件
<script>
export default {
  data() {
    return { count: 0 }
  }
}
</script>

// 转换后（开发时）
// sourceMap 会实时生成，只针对当前被请求的模块
export default {
  data() {
    return { count: 0 }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJ...
```

特点：
1. **实时转换**：只在请求时转换代码
2. **模块级别**：每个模块独立处理
3. **内联 Source Map**：默认使用内联方式

### 2.2. 预构建的处理

```javascript
// node_modules 中的依赖预构建
import { defineComponent } from 'vue'
↓
import { defineComponent } from '/@fs/node_modules/.vite/deps/vue.js'
```

特点：
- 依赖预构建时会生成对应的 source map
- 缓存在 `node_modules/.vite/deps` 目录

## 3. 不同文件类型的处理

### 3.1. TypeScript 文件

```typescript
// 源文件 (example.ts)
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};

// Vite 开发服务器直接转换，无需 tsc
// 保留类型信息在 source map 中
```

### 3.2. Vue 单文件组件

```vue
<!-- Component.vue -->
<script setup lang="ts">
const count = ref(0)
</script>

<!-- 开发时的处理 -->
<!-- 1. SFC 解析 -->
<!-- 2. TypeScript 转换 -->
<!-- 3. 生成内联 source map -->
```

## 4. 性能优化

### 4.1. 缓存机制

```javascript
// vite 开发服务器的缓存策略
const fileCache = new Map()

function transformFile(file) {
  if (fileCache.has(file)) {
    return fileCache.get(file)
  }
  
  const result = transform(file)
  fileCache.set(file, result)
  return result
}
```

### 4.2. 按需编译

```javascript
// 只有浏览器请求的模块才会被处理
import('./dynamic-module.js').then(module => {
  // source map 在这时才生成
})
```

## 5. 开发调试体验

### 5.1. 错误追踪

```javascript
// 运行时错误
function processUser() {
  throw new Error('User not found')
}

// 错误堆栈会直接指向源代码位置
// Error: User not found
//   at processUser (src/user.ts:2:9)
```

### 5.2. HMR 更新

```javascript
// HMR 更新时的 source map 处理
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // source map 会随 HMR 更新
  })
}
```

## 6. 常见问题和解决方案

### 6.1. Source Map 不准确

```javascript
// vite.config.js
export default {
  server: {
    sourcemap: true,
    force: true // 强制生成 source map
  }
}
```

### 6.2. 性能问题

```javascript
// vite.config.js
export default {
  server: {
    sourcemap: 'inline-cheap', // 使用更快的 source map 生成
  }
}
```

## 7. 与传统构建工具的对比

```javascript hl:3,7
// Webpack 开发服务器
// 1. 需要完整构建
// 2. source map 一次性生成

// Vite 开发服务器
// 1. 无需完整构建
// 2. source map 按需生成
// 3. 利用浏览器原生能力
```

## 8. 生产环境的区别

```javascript
// 开发环境
- 内联 source map
- 按需生成
- 模块级别处理

// 生产环境
- 外部 source map 文件
- 构建时一次性生成
- 整体打包处理
```

Vite 的这种处理方式带来的好处：

1. **更快的启动时间**
   - 无需预先生成所有 source map
   - 按需编译减少资源消耗

2. **更好的开发体验**
   - 实时准确的源码映射
   - 快速的错误定位
   - 与 HMR 完美配合

3. **更高的开发效率**
   - 减少等待时间
   - 更快的模块热更新
   - 准确的调试信息
