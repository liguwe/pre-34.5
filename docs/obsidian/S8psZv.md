# Vue3 异步组件的使用

`#vue` `#R1` 

## 1. 总结

- 异步组件的**优势**
	- 有效地进行代码分割，提高应用的性能和用户体验
- 要使用 `Suspense` 来包裹异步组件 → 确保应用的稳定性
	- 内置错误处理机制
	- 重试机制
- 使用 `defineAsyncComponent` 来**配置**异步组件
	- 有很多**参数**，比如
		- 加载中组件
		- 加载错误组件
		- 超时等等
- 直接使用 `import` 来引入`异步组件`
	- **路由**级别
	- 全局异步组件**注册**
	- 可带**缓存**
- 错误处理
	- 可**自定义**重试机制
	- app.handleError 
	- 组件级别错误 onErrorCaptured 

## 2. 基础异步组件定义

### 2.1. 使用 defineAsyncComponent

```vue
<template>
  <div>
    <Suspense>
      <template `#default>`
        <AsyncComp />
      </template>
      <template `#fallback>`
        <div>加载中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

// 基础异步组件定义
const AsyncComp = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)
</script>
```

### 2.2. 带配置的异步组件

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingComponent, // 加载中组件
  errorComponent: ErrorComponent,     // 错误时组件
  delay: 200,                        // 展示加载组件的延迟时间
  timeout: 3000,                     // 超时时间
  suspensible: true,                 // 是否可挂起
  onError(error, retry, fail) {      // 错误处理
    if (error.message.match(/fetch/)) {
      retry()
    } else {
      fail()
    }
  }
})
</script>
```

## 3. 异步组件的加载状态处理

### 3.1. 加载组件

```vue
<!-- LoadingComponent.vue -->
<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p>{{ loadingText }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loadingText = ref('正在加载...')
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  /* 加载动画样式 */
}
</style>
```

### 3.2. 错误组件

```vue
<!-- ErrorComponent.vue -->
<template>
  <div class="error-container">
    <h3>{{ error?.message || '加载失败' }}</h3>
    <button @click="handleRetry">重试</button>
  </div>
</template>

<script setup>
defineProps({
  error: Error,
  retry: Function
})

const handleRetry = () => {
  props.retry?.()
}
</script>
```

## 4. Suspense 的使用

### 4.1. 基本用法

```vue
<template>
  <Suspense>
    <!-- 默认插槽 -->
    <template `#default>`
      <div>
        <AsyncComponent1 />
        <AsyncComponent2 />
      </div>
    </template>

    <!-- 加载插槽 -->
    <template `#fallback>`
      <LoadingComponent />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent1 = defineAsyncComponent(() => 
  import('./components/AsyncComponent1.vue')
)
const AsyncComponent2 = defineAsyncComponent(() => 
  import('./components/AsyncComponent2.vue')
)
</script>
```

### 4.2. 异步组件嵌套

```vue
<!-- ParentComponent.vue -->
<template>
  <Suspense>
    <template `#default>`
      <div>
        <h2>父组件</h2>
        <AsyncChild />
      </div>
    </template>
    <template `#fallback>`
      <LoadingComponent />
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncChild = defineAsyncComponent(() => 
  import('./ChildComponent.vue')
)
</script>

<!-- ChildComponent.vue -->
<script setup>
// 模拟异步操作
await new Promise(resolve => setTimeout(resolve, 1000))

// 组件逻辑
</script>
```

## 5. 异步组件的数据获取

### 5.1. 使用 async setup

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)

// async setup
const loadData = async () => {
  try {
    const response = await fetch('https://api.example.com/data')
    data.value = await response.json()
  } catch (error) {
    console.error('数据加载失败:', error)
    throw error
  }
}

await loadData() // 直接在 setup 中使用 await
</script>

<template>
  <div>
    <h2>数据展示</h2>
    <pre>{{ data }}</pre>
  </div>
</template>
```

### 5.2. 组合多个异步操作

```vue
<script setup>
import { ref } from 'vue'

const userData = ref(null)
const postsData = ref(null)

const loadUserData = async () => {
  const response = await fetch('https://api.example.com/user')
  userData.value = await response.json()
}

const loadPosts = async () => {
  const response = await fetch('https://api.example.com/posts')
  postsData.value = await response.json()
}

// 并行加载数据
await Promise.all([
  loadUserData(),
  loadPosts()
])
</script>
```

## 6. 错误处理

### 6.1. 自定义重试机制

```vue
<script setup>
import { defineAsyncComponent, ref } from 'vue'

const loadingError = ref(null)
const retryCount = ref(0)

const AsyncComp = defineAsyncComponent({
  loader: () => import('./components/MyComponent.vue'),
  onError(error, retry, fail) {
    loadingError.value = error
    retryCount.value++
    
    if (retryCount.value <= 3) {
      // 自动重试
      setTimeout(retry, 1000)
    } else {
      // 超过重试次数，显示错误
      fail()
    }
  }
})
</script>

<template>
  <div>
    <AsyncComp />
    <div v-if="loadingError">
      错误信息: {{ loadingError.message }}
    </div>
  </div>
</template>

```

### 6.2. 全局错误处理

```vue hl:3
<!-- App.vue -->
<template>
  <Suspense @pending="onPending" @resolve="onResolve" @fallback="onFallback">
    <template `#default>`
      <AsyncComponent />
    </template>
    <template `#fallback>`
      <LoadingComponent />
    </template>
  </Suspense>
</template>

<script setup>
import { onErrorCaptured } from 'vue'

// 捕获异步组件错误
onErrorCaptured((error, instance, info) => {
  console.error('捕获到错误:', error)
  // 返回 false 阻止错误继续传播
  return false
})

const onPending = () => {
  console.log('组件加载中...')
}

const onResolve = () => {
  console.log('组件加载完成')
}

const onFallback = () => {
  console.log('显示 fallback 内容')
}
</script>
```

### 6.3. 组件级错误处理

```vue
<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err) => {
  error.value = err
  return false // 阻止错误继续传播
})

// 异步操作
const fetchData = async () => {
  try {
    const result = await someAsyncOperation()
    return result
  } catch (err) {
    error.value = err
    throw err
  }
}
</script>
```

## 7. 性能优化

### 7.1. 组件预加载

```vue hl:11
<script setup>
import { defineAsyncComponent, onMounted } from 'vue'

// 定义异步组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// 预加载组件
onMounted(() => {
  // 在适当的时机预加载
  const preloadComponent = () => {
    import('./HeavyComponent.vue')
  }
  
  // 例如：用户悬停时预加载
  document.addEventListener('mouseover', preloadComponent, { once: true })
})
</script>
```

### 7.2. 代码分割优化

```vue hl:2
<script setup>
// 按需加载不同版本的组件
const DesktopComponent = defineAsyncComponent(() => 
  import('./DesktopComponent.vue')
)

const MobileComponent = defineAsyncComponent(() => 
  import('./MobileComponent.vue')
)

const isMobile = ref(false)

// 根据条件动态选择组件
const DynamicComponent = computed(() => 
  isMobile.value ? MobileComponent : DesktopComponent
)
</script>
```

## 8. 实际应用示例

### 8.1. 路由级异步组件

```javascript hl:12
// router.js
import { createRouter } from 'vue-router'

const router = createRouter({
  routes: [
    {
      path: '/dashboard',
      component: () => import('./views/Dashboard.vue'),
      children: [
        {
          path: 'analytics',
          component: () => import('./views/Analytics.vue')
        }
      ]
    }
  ]
})
```

### 8.2. 全局异步组件注册

```html hl:4
<script setup>
import { defineAsyncComponent, provide } from 'vue'

// 全局异步组件注册
provide('asyncComponents', {
  'heavy-chart': defineAsyncComponent(() =>
    import('./components/HeavyChart.vue')
  ),
  'data-grid': defineAsyncComponent(() =>
    import('./components/DataGrid.vue')
  )
})
</script>

```

### 8.3. 带缓存的异步数据加载

```vue hl:4
<script setup>
import { ref, provide } from 'vue'

const cache = new Map()

const loadData = async (id) => {
  if (cache.has(id)) {
    return cache.get(id)
  }

  const data = await fetch(`https://api.example.com/data/${id}`)
  const result = await data.json()
  cache.set(id, result)
  return result
}

// 提供给子组件使用
provide('loadData', loadData)
</script>
```
