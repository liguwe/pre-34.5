# vue3 中实现类似于 React 高阶组件的功能？

`#vue3` 

## 1. 总结

- 使用 `h 函数` 再包装一下可以实现 HOC
- 组合式函数
- 混入 app.mixin 等
- 自定义指令
- provide & inject 

## 2. 组合式函数（Composables）

这是Vue 3中最接近React高阶组件概念的方法。组合式函数允许我们封装和重用有状态逻辑。

示例：`useLogger`

```typescript
// useLogger.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useLogger(componentName: string) {
  const mountedTime = ref<number>(0)

  onMounted(() => {
    console.log(`${componentName} mounted`)
    mountedTime.value = Date.now()
  })

  onUnmounted(() => {
    console.log(`${componentName} unmounted after ${Date.now() - mountedTime.value}ms`)
  })
}

// 使用方式
// MyComponent.vue
import { defineComponent } from 'vue'
import { useLogger } from './useLogger'

export default defineComponent({
  name: 'MyComponent',
  setup() {
    useLogger('MyComponent')
    // 组件的其他逻辑...
  }
})
```

## 3. 渲染函数 和 JSX：withLogger

Vue 3支持使用渲染函数和JSX，这让我们可以更接近 React的编程方式，包括实现类似HOC的模式。

示例：

```typescript hl:15
// withLogger.tsx
import { defineComponent, h, onMounted, onUnmounted } from 'vue'

export function withLogger(WrappedComponent: any) {
  return defineComponent({
    setup(props, { attrs, slots }) {
      onMounted(() => {
        console.log(`${WrappedComponent.name} mounted`)
      })

      onUnmounted(() => {
        console.log(`${WrappedComponent.name} unmounted`)
      })

      return () => h(WrappedComponent, { ...props, ...attrs }, slots)
    }
  })
}

// 使用方式
// MyComponent.tsx
import { defineComponent } from 'vue'
import { withLogger } from './withLogger'

const MyComponent = defineComponent({
  name: 'MyComponent',
  setup() {
    return () => <div>Hello from MyComponent</div>
  }
})

export default withLogger(MyComponent)
```

## 4. 插件和全局混入（Mixin）

虽然不如组合式函数灵活，但对于某些场景，我们可以使用Vue插件或全局混入来添加跨组件的功能。

示例：

```typescript
// logger-plugin.ts
import { Plugin } from 'vue'

export const LoggerPlugin: Plugin = {
  install(app) {
    app.mixin({
      mounted() {
        console.log(`${this.$options.name} mounted`)
      },
      unmounted() {
        console.log(`${this.$options.name} unmounted`)
      }
    })
  }
}

// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { LoggerPlugin } from './logger-plugin'

const app = createApp(App)
app.use(LoggerPlugin)
app.mount('#app')
```

## 5. 自定义指令

对于一些特定的功能，我们可以使用Vue的自定义指令来实现类似HOC的效果。

示例：

```typescript
// logger-directive.ts
import { Directive } from 'vue'

export const logger: Directive = {
  mounted(el, binding) {
    console.log(`${binding.value} mounted`)
  },
  unmounted(el, binding) {
    console.log(`${binding.value} unmounted`)
  }
}

// 使用方式
// MyComponent.vue
<template>
  <div v-logger="'MyComponent'">
    <!-- 组件内容 -->
  </div>
</template>

<script>
import { logger } from './logger-directive'

export default {
  directives: {
    logger
  }
}
</script>
```

## 6. 提供/注入（Provide/Inject）

对于需要在组件树中**共享数据或功能**的场景，我们可以使用 Vue 3的 `provide/inject` 特性。

示例：

```typescript
// LoggerProvider.vue
<script lang="ts">
import { defineComponent, provide } from 'vue'

export const loggerKey = Symbol()

export default defineComponent({
  setup() {
    const logger = {
      log: (componentName: string, message: string) => {
        console.log(`[${componentName}] ${message}`)
      }
    }

    provide(loggerKey, logger)

    return () => null
  }
})
</script>

// 使用方式
// MyComponent.vue
<script lang="ts">
import { defineComponent, inject, onMounted } from 'vue'
import { loggerKey } from './LoggerProvider.vue'

export default defineComponent({
  setup() {
    const logger = inject(loggerKey)

    onMounted(() => {
      logger?.log('MyComponent', 'Component mounted')
    })

    // 组件的其他逻辑...
  }
})
</script>
```
