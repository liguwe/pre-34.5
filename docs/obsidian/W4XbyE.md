# Vue3 的模板编译也可以发生在运行时

`#vue3` 

## R1

Vue3 的模板编译**通常是在构建时完成的，而不是运行时**，但不是绝对的，我们可以打包**两个版本Vue**
- runtime-only：
	- 仅包含运行时，体积更小，当然性能也更好
- runtime + compiler：
	- 包含**编译器代码**，体积更大，当然性能也更好


>  之前做个 markdown 嵌入 vue组件时，就使用过构建时，将 markdown → html → 特定 vdom → 特定的vue组件 → 渲染

> 

## 2. **构建时编译（推荐）**

```js
// 单文件组件 (.vue)
<template>
  <div>{{ message }}</div>
</template>

// 会在构建时被编译成
import { createVNode, toDisplayString } from 'vue'

export function render(_ctx, _cache) {
  return createVNode("div", null, toDisplayString(_ctx.message))
}
```

## 3. **运行时编译（不推荐）**

```js
// main.js
import { createApp } from 'vue/dist/vue.esm-bundler.js' // 包含运行时编译器的版本

createApp({
  template: `<div>{{ message }}</div>` // 这种情况会在运行时编译
}).mount('#app')
```

## 4. **两种版本的区别**

```js
// 1. 仅运行时版本（推荐，体积更小）
import { createApp } from 'vue' // 约 14kb gzipped

// 2. 完整版本（包含编译器，体积更大）
import { createApp } from 'vue/dist/vue.esm-bundler.js' // 约 23kb gzipped
```

## 5. **开发环境配置**

```js hl:5
// vite.config.js
export default {
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.runtime.esm-bundler.js' // 使用仅运行时版本
    }
  }
}
```

## 6. **性能对比**

```js hl:1,11,14
// 1. 构建时编译（更好的性能）
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

// 2. 运行时编译（需要额外的编译开销）
const app = createApp({
  template: `
    <button @click="count++">{{ count }}</button>
  `,
  setup() {
    const count = ref(0)
    return { count }
  }
})
```

## 7. **特殊场景**：动态模板 和 动态渲染

```js hl:7
// 1. 动态模板（需要运行时编译）
const DynamicComponent = {
  props: ['template'],
  render() {
    const { h } = Vue
    if (this.template) {
      // 不推荐：这种情况需要运行时编译
      return h({
        template: this.template,
        data() {
          return this.$props
        }
      })
    }
    return h('div', 'No template provided')
  }
}

// 2. 推荐的动态渲染方式
const DynamicComponent = {
  props: ['content'],
  render() {
    // 使用渲染函数或 JSX
    return h('div', this.content)
  }
}
```

## 8. **编译优化**

```js
// 构建时编译可以进行的优化
<template>
  <div>Static Content</div>
  <div>{{ dynamic }}</div>
</template>

// 编译后
export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode("div", null, "Static Content", -1 /* HOISTED */),
    _createElementVNode("div", null, _toDisplayString(_ctx.dynamic), 1 /* TEXT */)
  ], 64 /* STABLE_FRAGMENT */))
}
```

## 9. 总结

- **默认情况**：
	- Vue3 默认在构建时完成模板编译
	- 使用 Vite 或 webpack 等构建工具时自动处理
- **性能考虑**：
	- 构建时编译可以减少运行时开销
	- 减少最终包的体积
	- 允许更多的编译时优化
- **不同版本**：
	- runtime-only：仅包含运行时，体积更小
	- runtime + compiler：包含**编译器**，体积更大
- **最佳实践**：
	- 尽可能使用单文件组件（.vue）
	- 避免运行时编译
	- 特殊场景下才考虑使用完整版本
- **例外情况**：
	- 需要动态编译模板的场景
	- 不使用构建工具的简单项目
	- 特殊的开发需求
