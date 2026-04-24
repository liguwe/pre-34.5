# v-memo 介绍

`#vue3` 

## R1

- 是 `Vue 3.2+` 引入的一个性能优化指令，用于**缓存部分模板并跳过不必要的更新**
	- `<div v-memo="[value1, value2]">`


---


> 需要结合编译工作，仅在指定的值变化时，才会更新，避免不必要的 Diff，和渲染更新操作

## 1. **基本语法**

```vue
<template>
  <!-- 基础用法：数组中的值没有变化时，将跳过这部分的更新 -->
  <div v-memo="[value1, value2]">
    {{ expensiveComputation }}
  </div>
</template>
```

## 2. **完整示例**

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const name = ref('John')
const age = ref(25)

const increment = () => {
  count.value++
}
</script>

<template>
  <div>
    <!-- 计数器不会影响下面 v-memo 的内容 -->
    <button @click="increment">Count: {{ count }}</button>

    <!-- 只有当 name 或 age 改变时才会更新 -->
    <div v-memo="[name, age]">
      <h2>Name: {{ name }}</h2>
      <p>Age: {{ age }}</p>
      <p>Expensive computation: {{ name.split('').reverse().join('') }}</p>
    </div>
  </div>
</template>
```

## 3. **列表渲染中的使用**

```vue hl:13
<script setup>
import { ref } from 'vue'

const list = ref([
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
])
</script>

<template>
  <div>
    <!-- 只有当项目的 name 和 age 改变时才会更新对应的列表项 -->
    <div v-for="item in list" :key="item.id" v-memo="[item.name, item.age]">
      <h3>{{ item.name }}</h3>
      <p>Age: {{ item.age }}</p>
      <!-- 复杂计算 -->
      <p>Name reversed: {{ item.name.split('').reverse().join('') }}</p>
    </div>
  </div>
</template>
```

## 4. **条件渲染中的使用**

```vue
<script setup>
import { ref } from 'vue'

const show = ref(true)
const user = ref({
  name: 'John',
  role: 'admin'
})
</script>

<template>
  <div>
    <button @click="show = !show">Toggle</button>

    <div v-if="show" v-memo="[user.role]">
      <!-- 只有当 user.role 改变时才会重新渲染 -->
      <h2>User Role: {{ user.role }}</h2>
      <div>Complex permission calculations...</div>
    </div>
  </div>
</template>
```

## 5. **动态值的使用**： computed

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
const age = ref(25)

const isAdult = computed(() => age.value >= 18)
</script>

<template>
  <div>
    <!-- 使用计算属性 -->
    <div v-memo="[fullName, isAdult]">
      <h2>{{ fullName }}</h2>
      <p>Status: {{ isAdult ? 'Adult' : 'Minor' }}</p>
    </div>
  </div>
</template>
```

## 6. **注意事项和最佳实践**

```vue
<script setup>
import { ref } from 'vue'

const user = ref({
  name: 'John',
  age: 25,
  address: {
    city: 'New York',
    country: 'USA'
  }
})

const count = ref(0)
</script>

<template>
  <!-- ⚠️ 不好的做法：使用整个对象作为依赖 -->
  <div v-memo="[user]">
    {{ user.name }}
  </div>

  <!-- ✅ 好的做法：只使用需要的属性 -->
  <div v-memo="[user.name, user.age]">
    {{ user.name }} - {{ user.age }}
  </div>

  <!-- ⚠️ 过度使用：简单内容不需要 v-memo -->
  <div v-memo="[count]">
    {{ count }}
  </div>
</template>
```

## 7. **性能优化场景**

```vue
<script setup>
import { ref } from 'vue'

const items = ref(Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  value: Math.random()
})))

const searchTerm = ref('')
</script>

<template>
  <input v-model="searchTerm">
  
  <!-- 大列表渲染优化 -->
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      v-memo="[item.name, item.value]"
      class="list-item"
    >
      <h3>{{ item.name }}</h3>
      <p>Value: {{ item.value.toFixed(4) }}</p>
      <!-- 复杂计算或格式化 -->
      <p>Formatted: {{ new Intl.NumberFormat().format(item.value) }}</p>
    </div>
  </div>
</template>
```

## 8. **何时使用 v-memo**

- ✅ 适合使用的场景：
  - 大型列表渲染
  - 复杂的计算或格式化
  - 需要频繁更新的组件中的静态部分

- ❌ 不适合使用的场景：
  - 简单的数据展示
  - 经常变化的数据
  - 已经使用其他缓存机制（如 computed）的场景

## 9. 总结

1. v-memo 是一个强大的性能优化工具
2. 应该谨慎使用，只在真正需要的地方使用
3. 依赖数组应该精确指定需要监听的值
4. 不要过度优化，简单内容不需要使用 `v-memo`
5. 主要用于大型列表或复杂计算的优化
