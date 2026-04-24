# Vue3 的页面渲染流程

`#vue3` 

## R1

**init → mounted → updated →  unmountd**
- 初始化 
	- 创建应用实例
	- 初始化响应式系统
	- 编译模板
		- 也可以没有
- 挂载
	- 创建虚拟 DOM
	- 渲染真实 DOM
	- **建立响应式联系**
- 更新
	- **触发响应式更新**
	-  diff 算法比较
	-  最小化 DOM 操作
- 卸载
	- 清理副作用
	- 移除事件监听
	- 删除 DOM节点

## 1. 初始化阶段

```javascript
// 创建应用实例
const app = createApp({
  setup() {
    const count = ref(0)
    return { count }
  },
  template: '<div>{{ count }}</div>'
})

// 挂载应用
app.mount('#app')
```


### 1.1. 创建应用实例

```javascript
// 简化的createApp实现
function createApp(rootComponent) {
  const app = {
    mount(selector) {
      // 创建根组件的 vnode
      const vnode = createVNode(rootComponent)
      
      // 获取容器元素
      const container = document.querySelector(selector)
      
      // 渲染vnode
      render(vnode, container)
    }
  }
  return app
}
```

### 1.2. 编译模板

```javascript
// template 会被编译成 render 函数
function render() {
  return createVNode('div', null, [ctx.count])
}
```

### 1.3. 创建虚拟DOM

```javascript
function createVNode(type, props, children) {
  return {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type)
  }
}
```

## 2. 响应式系统初始化

```javascript
// 创建响应式对象
const state = reactive({
  count: 0
})

// 创建计算属性
const double = computed(() => state.count * 2)

// 创建副作用
watchEffect(() => {
  console.log('count changed:', state.count)
})
```

## 3. 挂载过程

```javascript
function mount(vnode, container) {
  // 创建DOM元素
  const el = document.createElement(vnode.type)
  
  // 处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      patchProp(el, key, null, vnode.props[key])
    }
  }
  
  // 处理children
  if (vnode.children) {
    mountChildren(vnode.children, el)
  }
  
  // 插入到容器
  container.appendChild(el)
  
  // 保存真实DOM引用
  vnode.el = el
}
```

## 4. 更新流程

```javascript
function patch(n1, n2, container) {
  if (n1 && !isSameVNodeType(n1, n2)) {
    unmount(n1)
    n1 = null
  }
  
  const { type } = n2
  
  if (typeof type === 'string') {
    // 处理普通元素
    processElement(n1, n2, container)
  } else if (typeof type === 'object') {
    // 处理组件
    processComponent(n1, n2, container)
  }
}
```

## 5. diff 算法

```javascript
function patchChildren(n1, n2, container) {
  const c1 = n1.children
  const c2 = n2.children
  
  // 新旧子节点的处理
  if (typeof c2 === 'string') {
    // 文本节点的处理
    if (Array.isArray(c1)) {
      unmountChildren(c1)
    }
    if (c1 !== c2) {
      container.textContent = c2
    }
  } else if (Array.isArray(c2)) {
    // 数组节点的处理
    if (Array.isArray(c1)) {
      // 双端diff算法
      patchKeyedChildren(c1, c2, container)
    } else {
      container.textContent = ''
      mountChildren(c2, container)
    }
  }
}
```

## 6. 完整的渲染示例

```javascript
// 组件定义
const MyComponent = {
  setup() {
    const count = ref(0)
    
    const increment = () => {
      count.value++
    }
    
    // 监听变化
    watch(count, (newVal, oldVal) => {
      console.log(`Count changed from ${oldVal} to ${newVal}`)
    })
    
    return {
      count,
      increment
    }
  },
  
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">Increment</button>
    </div>
  `
}

// 创建应用并挂载
const app = createApp(MyComponent)
app.mount('#app')
```

## 7. 生命周期钩子的执行顺序

```javascript
const MyComponent = {
  setup() {
    onBeforeMount(() => {
      console.log('Before Mount')
    })
    
    onMounted(() => {
      console.log('Mounted')
    })
    
    onBeforeUpdate(() => {
      console.log('Before Update')
    })
    
    onUpdated(() => {
      console.log('Updated')
    })
    
    return {}
  }
}
```

## 8. 异步组件的渲染

```javascript
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./components/MyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

## 9. 性能优化相关

- 使用`v-memo`优化列表渲染
- 使用`shallowRef/shallowReactive`优化大数据
- 使用`v-once`优化静态内容
  

```javascript hl:1,8,13
// 1. 使用v-memo优化列表渲染
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
    {{ item.name }}
  </div>
</template>

// 2. 使用shallowRef/shallowReactive优化大数据
const state = shallowRef({
  deepNestedData: {...}
})

// 3. 使用v-once优化静态内容
<template>
  <div v-once>
    {{ staticContent }}
  </div>
</template>
```

## 10. 错误处理

```javascript
app.config.errorHandler = (err, vm, info) => {
  // 处理渲染过程中的错误
  console.error('Render Error:', err)
  console.log('Error Component:', vm)
  console.log('Error Info:', info)
}
```
