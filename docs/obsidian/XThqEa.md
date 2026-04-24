# Pinia 状态管理库文档笔记

`#pinia` `#vue` 

## 总结

- 每个命名空间下，都应该提供`清空方法` ，避免内存暴增
	- `store.$reset()`
- 某些场景可以考虑使用 WeakMap/WeakSet
- 注意 vite 拆包 pinia
- **大型应用或数据密集型应用**可以考虑搞个 pinia 插件来管理内存
	- 监控内存大小
		- `new Blob([JSON.stringify(state)]).size
	- 过期策略：多久没有访问了？
	- 最近访问的多少条数据
	- **路由切换时清理** ? 

---



>  文档地址： https://pinia.vuejs.org/zh/core-concepts/getters.html

## 1. 为什么？

- Pinia 抛弃了 `Mutation`，这意味着你可以直接更新状态，**不用再注册 Commit**
- 语法上更加贴近 Composition Api
- 数据持久化使用： `pinia-plugin-persistedstate`
- 允许构建工具自动进行**代码分割**以及 **TypeScript 推断**

## 2. 两种定义方式

>  约定：所有的 store 定义，都使用 **use 开头**

### 2.1. 方式一：Option Store

 Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个独一无二的名字

```javascript
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useCounterStore = defineStore('counter', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

`state` 是 store 的数据 (data)，`getters` 是 store 的计算属性 (computed)，而 `actions` 则是方法 (methods)

### 2.2. 方式二：Setup Store

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

- `ref()` 就是 state 属性
- `computed() `就是 getters
- `function() `就是 actions

### 2.3. 使用场景选择

- Setup store 比 Option Store 带来了更多的**灵活性**，因为你可以在一个 store 内创建侦听器，并自由地使用任何组合式函数。
- 不过，请记住，使用组合式函数会让 **SSR** 变得更加复杂

## 3. 使用 TS 定义 state，并使用它

```typescript
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

const useStore = defineStore('storeId', {
  state: (): State => {
    return {
      userList: [],
      user: null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

### 3.1. 使用 Store

```typescript
const store = useStore()

store.count++


// 重置，将 state 重置为初始值。
store.$reset()
```

### 3.2. 选项式的重置与管理

直接调用内部返回的 `$reset()` 即可

```typescript
const store = useStore()

store.$reset()
```

选项式中
- 你可以使用 `mapState` 来辅助管理状态，将 state 属性映射为**只读的计算属性**
- 可以使用 `mapWritableState()` 来修改 state 属性

### 3.3. 组合式的重置

需要自定义 `$reset()`

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

### 3.4. 变更 state ： 使用 `store.$patch` 在同一时间更改多个属性

`store.$patch` ： 同一时间更改多个属性

```typescript
① 同一时间更改多个属性
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})

② 函数来组合控制更复杂的变更操作
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### 3.5. 替换 state

```typescript
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```

### 3.6. 监听或者订阅 state

使用 `$subscribe`

```typescript
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。
  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

卸载后监听仍然保留

```typescript
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$subscribe(callback, { detached: true })
</script>
```

当然，你可以使用 `watch` 来监听，即在 pinia 实例上使用 `watch()` 函数侦听整个 state

```typescript
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

## 4. Action

### 4.1. 基本使用

- Action 相当于组件中的 `method`
- action 可以是**异步**的，也可以是 **同步**

```typescript
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
   
   同步的
   increment() {
      this.count++
    },
    异步的
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
  },
})
```

Action 可以像函数或者通常意义上的方法一样被调用，如下：

```html
<script setup>
const store = useCounterStore()
// 将 action 作为 store 的方法进行调用
store.randomizeCounter()
</script>
<template>
  <!-- 即使在模板中也可以 -->
  <button @click="store.randomizeCounter()">Randomize</button>
</template>
```

### 4.2. 访问其他 store 的 action

直接引入调用就好了，这样的好处是，可以**全局管理所有的 store**

```typescript
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})

```

### 4.3. Action 选项式 API 的用法

先看看 组合式的用法，**更易用**

```html
<script>
import { useCounterStore } from '../stores/counter'
export default defineComponent({
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
})
</script>
```

可使用 `mapActions()` 辅助函数将 action 属性**映射为你组件中的方法**

```typescript
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // 访问组件内的 this.increment()
    // 与从 store.increment() 调用相同
    ...mapActions(useCounterStore, ['increment'])
     
    ① 与上述相同，但将其注册为this.myOwnName()
    
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

### 4.4. 订阅或监听 Action

即 监听 action 方法执行后的结果

```typescript
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

第二次参数：`someStore.$onAction(callback, true)`

```typescript
<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$onAction(callback, true)
</script>
```

## 5. Pinia 插件

插件是通过`pinia.use() `添加到`pinia 实例`的 ，使用插件的场景有

- 添加新的状态属性到 store
- 定义 store时创建新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变或取消 action
- 实现副作用，比如 本地存储
- 扩展 store 的属性

### 5.1. 最简单的一个示例

通过返回一个对象**将一个静态属性添加到所有 store**，如：

```typescript
import { createPinia } from 'pinia'

// 创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 在安装此插件后，插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

这对添加**全局对象**很有用，如**路由器、modal 或 toast 管理器**

### 5.2. 如何定义插件

```typescript
export function myPiniaPlugin(context) {
  context.pinia // 用 `createPinia()` 创建的 pinia。 
  context.app // 用 `createApp()` 创建的当前应用(仅 Vue 3)。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
}
```

### 5.3. 每个 store 都添加上特定属性

```typescript
// 上文示例
pinia.use(({ store }) => {
  store.hello = 'world'
  // 确保你的构建工具能处理这个问题，webpack 和 vite 在默认情况下应该能处理。
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的键值
    store._customProperties.add('hello')
  }
})
```

>  每个 `store` 都被 `reactive` 包装过

### 5.4. 添加新的外部属性

```typescript
import { markRaw } from 'vue'
// 根据你的路由器的位置来调整
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

> 使用 `markRaw` 标记一个对象，使其在响应式系统中变为非响应式的，避免无意义的渲染

### 5.5. 在插件中调用 $subscribe

你也可以在插件中使用 `store.$subscribe 和 store.$onAction `。

```typescript hl:3,6
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```

### 5.6. 在定义 store 时，可添加新的 options

比如，你可以创建一个 `debounce` 选项，允许你让**任何 action 实现防抖**。

## 6. TS 支持

具体再参考文档

## 7. 组件外部使用 Store

在组件外部使用store时，情况会有所不同

在单页面应用程序中，只需在创建pinia实例之后调用`useStore()`函数即可正常工作。确保在pinia安装后才调用`useStore()`函数即可。

例如，在Vue Router的导航守卫中使用 `store` 时
- 应将 useStore() 的调用放在`beforeEach()`函数中

## 8. Pinia 不太需要类似 immer.js 这样的库

### 8.1. **Vue 的响应式系统本身已经很完善**

```js
// Pinia store 示例
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: 'John',
      profile: {
        age: 25,
        address: {
          city: 'New York'
        }
      }
    }
  }),
  
  actions: {
    // Vue 的响应式系统可以直接修改嵌套对象
    updateCity(newCity) {
      this.user.profile.address.city = newCity // 直接修改即可
    }
  }
})
```

### 8.2. **Pinia 的状态更新是可变的**

```js
// Pinia 中直接修改状态
const store = useUserStore()

// 直接修改
store.user.name = 'Jane'

// 批量修改
store.$patch({
  user: {
    name: 'Jane',
    profile: {
      age: 26
    }
  }
})

// 使用函数式修改
store.$patch((state) => {
  state.user.name = 'Jane'
  state.user.profile.age += 1
})
```

### 8.3. **对比 React + Redux 的情况**

```js
// React + Redux 需要 immer.js
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      // 不使用 immer 时需要手动处理不可变更新
      return {
        ...state,
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            address: {
              ...state.user.profile.address,
              city: action.payload
            }
          }
        }
      }
  }
}

// 使用 immer 后
import produce from 'immer'

const reducer = produce((draft, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      draft.user.profile.address.city = action.payload
      break
  }
})
```

### 8.4. **Pinia 的内置功能**

```js
// Pinia 提供了多种状态管理方式
const store = useUserStore()

// 1. 直接修改
store.count++

// 2. $patch 方法
store.$patch({
  count: store.count + 1,
  name: 'Jane'
})

// 3. 使用 actions
store.increment()

// 4. 重置状态
store.$reset()

// 5. 批量修改状态
store.$patch((state) => {
  // 可以进行任意修改
  state.items.push({ name: 'new item' })
  state.count++
})
```

### 8.5. **为什么 Pinia 不需要 immer.js**

```js
// Pinia store
const useStore = defineStore('main', {
  state: () => ({
    nested: {
      data: {
        count: 0
      }
    }
  }),
  
  actions: {
    // 1. 直接修改嵌套数据
    updateCount() {
      this.nested.data.count++ // Vue 响应式系统会自动处理
    },
    
    // 2. 批量修改
    batchUpdate() {
      this.$patch((state) => {
        state.nested.data.count++
        state.nested.data.newField = 'value'
      })
    },
    
    // 3. 替换整个对象
    replaceNested() {
      this.nested = {
        data: {
          count: 100
        }
      }
    }
  }
})
```

### 8.6. **性能考虑**

```js
// Pinia 已经优化了性能
const store = useStore()

// 1. 组件中使用 storeToRefs 来保持响应性
import { storeToRefs } from 'pinia'
const { nested } = storeToRefs(store)

// 2. 计算属性自动追踪依赖
const doubleCount = computed(() => store.nested.data.count * 2)

// 3. 监听状态变化
watch(
  () => store.nested.data.count,
  (newValue) => {
    console.log('Count changed:', newValue)
  }
)
```

### 8.7. 总结

- **不必要性**：
	- Vue 的响应式系统已经很好地处理了状态更新
	- Pinia 支持直接修改状态
	- 提供了多种状态管理方式
- **性能影响**：
	- 添加 immer.js 会增加包体积
	- 可能会引入额外的性能开销
	- Vue 的响应式系统已经很高效
- **开发体验**：
	- Pinia 的 API 设计已经很友好
	- 不需要考虑不可变更新
	- 代码更简洁直观
- **特殊情况**：
	- 如果你的项目同时使用 React 和 Vue，并且已经使用了 immer.js
	- 如果你需要特别复杂的状态更新逻辑
	- 这些情况下可以考虑使用 immer.js，但大多数情况下是不必要的

因此，在一般的 Vue + Pinia 项目中，没有必要使用 immer.js，**Vue 的响应式系统和 Pinia 的 API 已经足够优秀和便捷**。

## 9. Vue3 项目中对 Pinia 进行拆包处理：

### 9.1. 基本拆包方案

#### 9.1.1. **使用 Vite 的动态导入**

```javascript
// store/modules/user.js
export const useUserStore = defineStore('user', {
  // store 配置
})

// store/modules/product.js
export const useProductStore = defineStore('product', {
  // store 配置
})

// store/index.js
// 动态导入各个 store 模块
export const stores = {
  user: () => import('./modules/user'),
  product: () => import('./modules/product')
}
```

#### 9.1.2. **配置 Vite 的分包策略**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'store-user': ['./src/store/modules/user.js'],
          'store-product': ['./src/store/modules/product.js'],
          'vendor-pinia': ['pinia']
        }
      }
    }
  }
})
```

### 9.2. 按功能模块拆分

#### 9.2.1. **模块化组织 Store**

```javascript
// stores/modules/auth/index.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  // ...其他配置
})

// stores/modules/cart/index.js
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  // ...其他配置
})
```

#### 9.2.2. **异步注册 Store**

```javascript
// 按需加载 store
const loadAuthStore = async () => {
  const module = await import('./modules/auth')
  return module.useAuthStore
}

const loadCartStore = async () => {
  const module = await import('./modules/cart')
  return module.useCartStore
}
```

### 9.3. 路由级别的拆分

#### 9.3.1. **配合路由进行拆分**

```javascript hl:7
// router/index.js
const routes = [
  {
    path: '/user',
    component: () => import('../views/User.vue'),
    // 异步加载相关 store
    beforeEnter: async (to, from, next) => {
      await import('../stores/modules/user')
      next()
    }
  }
]
```

#### 9.3.2. **组件内按需导入**

```vue hl:2
<script setup>
// 组件内动态导入 store
const initStore = async () => {
  const { useUserStore } = await import('../stores/modules/user')
  const userStore = useUserStore()
  // 使用 store
}

onMounted(() => {
  initStore()
})
</script>
```

### 9.4. 高级拆包配置

#### 9.4.1. **使用 Rollup 的高级配置**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 将 node_modules 中的包单独打包
          if (id.includes('node_modules')) {
            if (id.includes('pinia')) {
              return 'vendor-pinia'
            }
            return 'vendor'
          }
          // 将 store 模块单独打包
          if (id.includes('/stores/modules/')) {
            const module = id.split('/stores/modules/')[1].split('/')[0]
            return `store-${module}`
          }
        }
      }
    }
  }
})
```

#### 9.4.2. **优化分包大小**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心依赖单独打包
          'vendor-core': ['vue', 'pinia'],
          // 工具类库单独打包
          'vendor-utils': ['lodash', 'axios'],
          // store 按模块打包
          'store-user': ['./src/stores/modules/user'],
          'store-cart': ['./src/stores/modules/cart']
        }
      }
    },
    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 1000
  }
})
```

### 9.5. 最佳实践建议

#### 9.5.1. **合理的模块划分**

```javascript
// 按业务域划分
stores/
  ├── modules/
  │   ├── user/          // 用户相关
  │   │   ├── index.js
  │   │   └── types.ts
  │   ├── product/       // 产品相关
  │   └── cart/          // 购物车相关
  └── index.js
```

#### 9.5.2. **懒加载策略**

```javascript
// 在需要时才加载对应的 store
const useStore = async () => {
  const module = await import(`./modules/${moduleName}`)
  return module.default
}
```

#### 9.5.3. **性能优化**

- 避免过度拆分
- 合理设置 chunk 大小
- 使用预加载提示
```javascript
// 预加载相关模块
<link rel="modulepreload" href="/assets/store-user-xxx.js">
```

### 9.6. 注意事项

#### 9.6.1. **避免循环依赖**

- 合理组织 store 之间的依赖关系
- 使用事件总线或其他方式解耦

#### 9.6.2. **控制包大小**

- 监控各个 chunk 的大小
- 合理合并相关模块
- 使用 tree-shaking 优化

#### 9.6.3. **缓存策略**

- 合理设置缓存策略
- 考虑模块更新机制
- 处理版本控制

## 10. 性能优化点

- 每个命名空间下，都应该提供`清空方法` ，避免内存暴增
	- `store.$reset()`
- **路由切换时清理** ? 
- WeakMap/WeakSet

```javascript
const useStore = defineStore('cache', {
  state: () => ({
    // 使用 WeakMap 存储对象引用
    cache: new WeakMap(),
  }),
  actions: {
    setCache(key, value) {
      this.cache.set(key, value)
    }
  }
})

```

- 实现数据过期策略

```javascript
const useStore = defineStore('main', {
  state: () => ({
    cache: new Map(),
    cacheTimeout: new Map()
  }),
  actions: {
    setData(key, value, timeout = 5000) {
      this.cache.set(key, value)
      this.cacheTimeout.set(key, Date.now() + timeout)
      
      // 设置过期清理
      setTimeout(() => {
        if (this.cache.has(key)) {
          this.cache.delete(key)
          this.cacheTimeout.delete(key)
        }
      }, timeout)
    },
    getData(key) {
      if (!this.cache.has(key)) return null
      if (Date.now() > this.cacheTimeout.get(key)) {
        this.cache.delete(key)
        this.cacheTimeout.delete(key)
        return null
      }
      return this.cache.get(key)
    }
  }
})

```


- 清理超过一定时间未访问的数据
```javascript
const useStore = defineStore('main', {
  state: () => ({
    data: {}
  }),
  actions: {
    clearInactiveData() {
      // 清理超过一定时间未访问的数据
    }
  }
})

// 监听 store 变化
store.$subscribe((mutation, state) => {
  // 记录数据访问时间
  updateAccessTime(mutation.storeId)
})

```


- 监控 store 大小

```javascript
const useStore = defineStore('main', {
  state: () => ({
    data: {}
  })
})

// 开发环境监控 store 大小
if (process.env.NODE_ENV === 'development') {
  store.$subscribe((mutation, state) => {
    const size = new Blob([JSON.stringify(state)]).size
    if (size > 1024 * 1024) { // 1MB
      console.warn(`Store size exceeds 1MB: ${size} bytes`)
    }
  })
}
```

## 11. Pinia 插件来管理数据内存

>  在**大型应用或数据密集型应用**中使用可使用使用这个插件

>  但是，最大内存，最大时间，可能都会影响到业务，最好的办法是，最好是**最近访问10 条？ 的 pinia 命名空间的**

 这个插件将包含数据过期、内存监控、自动清理等功能。
 

```typescript
// plugins/piniaMemoryManager.ts

interface MemoryManagerOptions {
  // 最大存储大小（单位：bytes）
  maxSize?: number;
  // 数据过期时间（单位：ms）
  defaultExpireTime?: number;
  // 是否开启调试日志
  debug?: boolean;
  // 自动清理的阈值（占 maxSize 的百分比）
  cleanupThreshold?: number;
  // 是否启用自动清理
  autoCleanup?: boolean;
}

interface StoreMetadata {
  accessTime: number;
  size: number;
  expireTime?: number;
}

export function createMemoryManager(options: MemoryManagerOptions = {}) {
  const {
    maxSize = 50 * 1024 * 1024, // 默认 50MB
    defaultExpireTime = 30 * 60 * 1000, // 默认 30 分钟
    debug = false,
    cleanupThreshold = 0.8, // 当使用空间达到 80% 时触发清理
    autoCleanup = true,
  } = options;

  // 存储元数据
  const storeMetadata = new Map<string, Map<string, StoreMetadata>>();
  let totalSize = 0;

  // 日志函数
  const log = (...args: any[]) => {
    if (debug) {
      console.log('[Pinia Memory Manager]', ...args);
    }
  };

  // 计算对象大小
  const calculateSize = (obj: any): number => {
    return new Blob([JSON.stringify(obj)]).size;
  };

  // 清理过期数据
  const cleanupExpiredData = (store: any, storeId: string) => {
    const storeData = storeMetadata.get(storeId);
    if (!storeData) return;

    const now = Date.now();
    let cleaned = false;

    for (const [key, metadata] of storeData.entries()) {
      if (metadata.expireTime && now > metadata.expireTime) {
        if (key in store.$state) {
          delete store.$state[key];
          totalSize -= metadata.size;
          storeData.delete(key);
          cleaned = true;
          log(`Cleaned expired data: ${storeId}.${key}`);
        }
      }
    }

    return cleaned;
  };

  // 强制清理最旧的数据
  const forceCleanup = () => {
    let entries: [string, Map<string, StoreMetadata>][] = Array.from(storeMetadata.entries());
    
    // 按最后访问时间排序
    entries.sort((a, b) => {
      const aTime = Math.max(...Array.from(a[1].values()).map(m => m.accessTime));
      const bTime = Math.max(...Array.from(b[1].values()).map(m => m.accessTime));
      return aTime - bTime;
    });

    for (const [storeId, storeData] of entries) {
      if (totalSize < maxSize * cleanupThreshold) break;

      const store = useStore(storeId);
      if (!store) continue;

      for (const [key, metadata] of storeData.entries()) {
        delete store.$state[key];
        totalSize -= metadata.size;
        storeData.delete(key);
        log(`Force cleaned: ${storeId}.${key}`);

        if (totalSize < maxSize * cleanupThreshold) break;
      }
    }
  };

  return defineStore => {
    return (storeId: string, options: any) => {
      const store = defineStore(storeId, options);
      
      // 初始化store元数据
      if (!storeMetadata.has(storeId)) {
        storeMetadata.set(storeId, new Map());
      }

      // 包装 $state 的 setter
      const originalState = store.$state;
      Object.defineProperty(store, '$state', {
        get() {
          return originalState;
        },
        set(newState) {
          const storeData = storeMetadata.get(storeId)!;
          
          // 更新元数据
          for (const key in newState) {
            const size = calculateSize(newState[key]);
            storeData.set(key, {
              accessTime: Date.now(),
              size,
              expireTime: Date.now() + defaultExpireTime
            });
            totalSize += size;
          }

          // 检查是否需要清理
          if (autoCleanup && totalSize > maxSize * cleanupThreshold) {
            log(`Memory threshold exceeded: ${totalSize} bytes`);
            cleanupExpiredData(store, storeId);
            if (totalSize > maxSize * cleanupThreshold) {
              forceCleanup();
            }
          }

          originalState = newState;
        }
      });

      // 添加辅助方法
      store.$memoryManager = {
        // 设置数据过期时间
        setExpireTime(key: string, time: number) {
          const storeData = storeMetadata.get(storeId);
          if (storeData && storeData.has(key)) {
            storeData.get(key)!.expireTime = Date.now() + time;
          }
        },

        // 手动清理数据
        cleanup() {
          cleanupExpiredData(store, storeId);
        },

        // 获取存储状态
        getStatus() {
          return {
            totalSize,
            maxSize,
            usage: totalSize / maxSize,
            storeSize: Array.from(storeMetadata.get(storeId)?.values() || [])
              .reduce((acc, curr) => acc + curr.size, 0)
          };
        },

        // 手动删除数据
        remove(key: string) {
          const storeData = storeMetadata.get(storeId);
          if (storeData && storeData.has(key)) {
            totalSize -= storeData.get(key)!.size;
            storeData.delete(key);
            delete store.$state[key];
          }
        }
      };

      // 订阅 store 变化
      store.$subscribe((mutation, state) => {
        const storeData = storeMetadata.get(storeId)!;
        
        // 更新访问时间
        if (mutation.type === 'direct') {
          const key = mutation.events.key;
          if (storeData.has(key)) {
            storeData.get(key)!.accessTime = Date.now();
          }
        }
      });

      return store;
    };
  };
}
```

使用示例：

```typescript
// store/index.ts
import { createPinia } from 'pinia'
import { createMemoryManager } from './plugins/piniaMemoryManager'

const pinia = createPinia()

// 注册内存管理插件
pinia.use(createMemoryManager({
  maxSize: 100 * 1024 * 1024, // 100MB
  defaultExpireTime: 60 * 60 * 1000, // 1小时
  debug: true,
  cleanupThreshold: 0.8,
  autoCleanup: true
}))

export default pinia
```

在 Store 中使用：

```typescript
// store/userStore.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [],
    userDetails: {},
  }),
  actions: {
    async fetchUsers() {
      const users = await api.getUsers()
      this.userList = users
      
      // 设置数据过期时间
      this.$memoryManager.setExpireTime('userList', 5 * 60 * 1000) // 5分钟后过期
    },

    async fetchUserDetails(id: string) {
      const details = await api.getUserDetails(id)
      this.userDetails[id] = details
    },

    cleanup() {
      // 手动清理数据
      this.$memoryManager.cleanup()
    },

    checkStatus() {
      // 获取存储状态
      const status = this.$memoryManager.getStatus()
      console.log('Store 内存使用情况:', status)
    }
  }
})
```

在组件中使用：

```vue
<template>
  <div>
    <button @click="checkStoreStatus">检查存储状态</button>
    <button @click="cleanupStore">清理存储</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const checkStoreStatus = () => {
  const status = userStore.$memoryManager.getStatus()
  console.log('存储状态:', status)
}

const cleanupStore = () => {
  userStore.$memoryManager.cleanup()
}
</script>
```

这个插件的主要功能：

1. **内存监控**
   - 跟踪每个 store 的数据大小
   - 监控总内存使用情况
   - 提供内存使用状态查询

2. **数据过期机制**
   - 支持设置数据过期时间
   - 自动清理过期数据
   - 手动清理接口

3. **自动内存管理**
   - 当内存使用超过阈值时自动清理
   - 优先清理过期数据
   - 必要时清理最久未访问的数据

4. **调试功能**
   - 详细的日志输出
   - 内存使用统计
   - 性能监控

5. **灵活的配置选项**
   - 可配置最大内存限制
   - 可设置默认过期时间
   - 可调整清理阈值
