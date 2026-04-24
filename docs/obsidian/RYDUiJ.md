# Vue3 中原始值的响应方案

`#vue3` `#R1` 


>  本文讲原始值的响应方案，比如 `Boolean String BigInt Symbol undefined null Number`

> 注意：这也是，平时我建议尽量使用 ref 而不使用 reactive 的原因

## 1. 总结

- ref 的原理 → 依赖于 `reactive`
	- 本质上 `ref` 是一个 包裹 对象。
		- `因为` JavaScript 的 Proxy 无法提供对原始值的代理，`所以`我们需要使用一层对象作为包裹，`间接`实现原始值的响应式方案。
	- 如何判断是 ref 对象 →   `__v_isRef`
		- 由于“包 裹对象”本质上与普通对象没有任何区别，因此为了区分 ref 与普通响应式对象，
			- 我们还为“包裹对象”定义了一个值为 true 的属性，即 `__v_isRef`，用它作为 ref 的标识。
- 响应式丢失问题
	- `ref` 除了能够用于原始值的响应式方案之外，还能用来解决`响应丢失问题`。
	- 为了解决该问题，我们实现了 `toRef` 以及 `toRefs` 这两个函数。
		- 它们本质上是对响应式数据做了一层包装，或者叫作`访问代理`
- 自动脱 ref 的能力
	- 关键点
		- `get` 读取时，直接返回 `xxx.value`
		- `set` 时，设置 `xxx.value = newVal`
	- 模板中的响应式数据进行`脱 ref 处理`
	- 表现为 vue 模板中不需要输入 `.value`
- ref 和 reactive 的区别
	- reactive 必须传入对象，ref 任意类型都行
	- 是否是复杂结构？复杂结构使用  `reactive`
		- 比如复杂表单，这样使用不用每次都 `.value` 了
	- reactive 性能一般，因为可能会导致连锁反映

## 2. Ref 的原理

原始值`按值传递`，所以需要`包裹` , 我们使用 `ref()` 来包裹。代码如下：

```javascript hl:9
function ref(val) {
    const wrapper = {
        value: val
    }
    // 定义一个不可枚举不可写的属性，用于标识他是一个 ref
    Object.defineProperty(wrapper, '__v_isRef', {
        value: true
    })
    return reactive(wrapper)
}

```

> `ref` 依赖 `reactive` ，**是的就一段代码就完事了**

## 3. 响应式丢失问题

`ref` 还能解决`响应式丢失`的问题，关于`响应式丢失`，我们来看一个例子

```javascript hl:4,11

const obj = reactive({foo: 1, bar: 2});

// :::: 使用 ... 运算符
const newObj = {...obj}; 

effect(() => {
    console.log(newObj.foo); // newObj 没有任何响应能力，所以这里不会触发 effect
})

// :::: 很显然，这里不会触发 effect 
obj.foo = 2; 
```

有没有什么办法，即使使用 `newObj` 普通对象访问属性值，也会被收集响应呢？答案如下：

```javascript hl:4,9
const obj = reactive({foo: 1, bar: 2});
const newObj = {
    foo: {
        get value() {
            return obj.foo
        }
    },
    bar: {
        get value() {
            return bar.foo
        }
    }
}

effect(() => {
    // 这里会触发 get value() ，从而访问了 obj.foo ，从而触发收集依赖
    console.log(newObj.foo); 
})

obj.foo = 2;
```

所以封装两个函数 `toRef` 和 `toRefs` 

## 4. toRef 与 toRefs

```javascript hl:12,4
function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}

function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    set value(val) {
      obj[key] = val
    }
  }

  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return wrapper
}
```

这样，就能正确的触发收集了。

>  这下知道这个两个函数是干什么的了吧？以前都有一点懵逼

## 5. 自动脱落 `ref` 的能力

最后，我们说说 自动脱落 `ref` 的能力，啥意思呢？

比如模板代码，每次都需要加一个 `.value` ？

```html
<div>{{foo.value}}</div>
```

有啥办法解决吗？ 其实很简单，如下代码：

![|808](https://832-1310531898.cos.ap-beijing.myqcloud.com/4a689b99b8f3b3e902890b4f5a93765a.png)

## 6. ref 和 reactive 使用建议

### 6.1. ref 的优势

#### 6.1.1. 原始值包装

```javascript
// ✅ 使用 ref
const count = ref(0)
count.value++

// ❌ reactive 不能直接用于原始值
const count = reactive(0) // 无效！
```

#### 6.1.2. 解构安全

```javascript
// ✅ ref 解构后仍然保持响应性
const state = {
  count: ref(0),
  name: ref('John')
}
const { count, name } = state
count.value++ // 仍然是响应式的

// ❌ reactive 解构会丢失响应性
const state = reactive({
  count: 0,
  name: 'John'
})
const { count, name } = state // 失去响应性！
```

#### 6.1.3. 函数返回值更清晰

```typescript
// ✅ 使用 ref，类型和响应性都很清晰
function useCounter() {
  const count = ref(0)
  return { count } // 返回的 count 仍然是响应式的
}

// ❌ 使用 reactive，返回值可能失去响应性
function useCounter() {
  const state = reactive({ count: 0 })
  return { count: state.count } // count 失去响应性！
}
```

### 6.2. reactive 的优势

#### 6.2.1. 嵌套对象处理

```javascript
// ✅ reactive 处理嵌套对象很自然
const state = reactive({
  user: {
    profile: {
      name: 'John',
      age: 30
    }
  }
})

// ❌ ref 处理嵌套对象较繁琐
const state = {
  user: ref({
    profile: {
      name: 'John',
      age: 30
    }
  })
}
```

#### 6.2.2. 数组操作

```javascript
// ✅ reactive 数组操作更直观
const list = reactive([1, 2, 3])
list.push(4)

// ⚠️ ref 需要 .value
const list = ref([1, 2, 3])
list.value.push(4)
```

### 6.3. 最佳实践建议

#### 6.3.1. 使用 ref 的场景

```javascript hl:12
// 1. 原始值
const count = ref(0)
const name = ref('John')
const isActive = ref(true)

// 2. 需要解构的对象
const state = {
  count: ref(0),
  name: ref('John')
}

// 3. 组合式函数返回值
function useUser() {
  const name = ref('John')
  const age = ref(30)
  return {
    name,
    age
  }
}
```

>  公共 hooks 请尽量使用 `ref` ，多个 `.value` 而已，约定习惯就好了

#### 6.3.2. 使用 reactive 的场景

```javascript
// 1. 表单数据
const formData = reactive({
  username: '',
  password: '',
  remember: false
})

// 2. 复杂的嵌套数据结构
const store = reactive({
  user: {
    profile: {
      // ...深层嵌套数据
    }
  },
  settings: {
    // ...配置数据
  }
})

// 3. 需要保持引用的对象
const api = reactive({
  baseURL: 'https://api.example.com',
  endpoints: {
    users: '/users',
    posts: '/posts'
  }
})
```

#### 6.3.3. 混合使用的最佳实践

```javascript
// 组合式函数中的混合使用
function useUserProfile() {
  // 简单值使用 ref
  const userId = ref(1)
  const isLoading = ref(false)
  
  // 复杂对象使用 reactive
  const profile = reactive({
    basic: {
      name: '',
      email: ''
    },
    preferences: {
      theme: 'light',
      notifications: true
    }
  })
  
  return {
    userId,
    isLoading,
    profile
  }
}
```

### 6.4. 性能考虑

#### 6.4.1. 内存使用

```javascript
// ref 对简单值的内存开销较小
const simpleRef = ref(0)

// reactive 对大对象的代理可能有更多开销
const largeObject = reactive({
  // ... 大量数据
})
```

#### 6.4.2. 更新性能

```javascript
// ref 的更新很直接
const count = ref(0)
count.value++ // 只触发一次更新

// reactive 的更新可能触发多次
const state = reactive({
  count: 0,
  total: 0
})
state.count++ // 可能触发多个属性的更新
```

### 6.5. 总结建议

1. **优先使用 ref**：
   - 用于简单值
   - 需要解构的数据
   - 组合式函数返回值
   - 需要明确类型的场景

2. **适当使用 reactive**：
   - 复杂的嵌套对象
   - 表单数据
   - 需要保持引用的对象
   - API 配置等

3. **混合使用原则**：
```javascript
// 推荐的混合使用方式
const state = {
  // 简单值用 ref
  count: ref(0),
  name: ref(''),
  
  // 复杂对象用 reactive
  formData: reactive({
    // ...表单字段
  }),
  
  // 数组也推荐用 ref
  list: ref([])
}
```

4. **TypeScript 支持**：
```typescript
// ref 类型推导更直接
const count = ref<number>(0)

// reactive 需要接口定义
interface State {
  count: number
  name: string
}
const state = reactive<State>({
  count: 0,
  name: ''
})
```

> 在大多数简单场景下，使用 ref 确实是更好的选择，但不应该完全排除 reactive 的使用。关键是要理解两者的优缺点，在适当的场景选择合适的方案。

## 7. ref 和 reactive 详细对比

### 7.1. 基本概念

#### 7.1.1. ref

```javascript
// ref 包装的值需要通过 .value 访问
const count = ref(0)
console.log(count.value) // 0
count.value++

// ref 会自动解包在模板中使用时
<template>
  <div>{{ count }}</div> <!-- 无需 .value -->
</template>
```

#### 7.1.2. reactive

```javascript
// reactive 直接代理对象
const state = reactive({
  count: 0,
  name: 'John'
})
console.log(state.count) // 0
state.count++
```

### 7.2. 主要区别

#### 7.2.1. 数据类型支持

```javascript
// ref - 支持所有类型
const num = ref(0)                  // ✅ 数字
const str = ref('hello')           // ✅ 字符串
const bool = ref(true)             // ✅ 布尔值
const arr = ref([1, 2, 3])         // ✅ 数组
const obj = ref({ name: 'John' })  // ✅ 对象

// reactive - 只支持对象类型（包括数组）
const num = reactive(0)            // ❌ 无效
const str = reactive('hello')      // ❌ 无效
const obj = reactive({             // ✅ 有效
  count: 0,
  name: 'John'
})
const arr = reactive([1, 2, 3])    // ✅ 有效
```

#### 7.2.2. 解构行为

```javascript
// ref - 保持响应性
const state = {
  count: ref(0),
  name: ref('John')
}
const { count, name } = state
count.value++ // ✅ 仍然是响应式的

// reactive - 失去响应性
const state = reactive({
  count: 0,
  name: 'John'
})
const { count, name } = state // ❌ 解构后失去响应性

// reactive 解构保持响应性的方法
import { toRefs } from 'vue'
const state = reactive({
  count: 0,
  name: 'John'
})
const { count, name } = toRefs(state) // ✅ 转换为 ref 后解构
```

#### 7.2.3. 嵌套数据处理

```javascript hl:11
// ref - 嵌套对象需要额外的 .value
const user = ref({
  profile: {
    name: 'John',
    age: 30
  }
})
console.log(user.value.profile.name)
user.value.profile.age++

// reactive - 自动递归代理
const user = reactive({
  profile: {
    name: 'John',
    age: 30
  }
})
console.log(user.profile.name)
user.profile.age++
```

### 7.3. 使用场景对比

#### 7.3.1. 适合使用 ref 的场景

##### 7.3.1.1. 简单值管理

```javascript
// 计数器
const count = ref(0)
const increment = () => count.value++

// 开关状态
const isVisible = ref(false)
const toggle = () => isVisible.value = !isVisible.value
```

##### 7.3.1.2. **组合式函数返回值**

```javascript
function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return {
    count,    // 返回 ref，保持响应性
    increment
  }
}
```

##### 7.3.1.3. 需要解构的数据 → 保证安全解构

```javascript
function useUserInfo() {
  const name = ref('John')
  const age = ref(30)
  
  return {
    name,
    age
  }
}

// 使用时可以安全解构
const { name, age } = useUserInfo()
```

#### 7.3.2. 适合使用 reactive 的场景

##### 7.3.2.1. 表单数据

```javascript
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  agreeToTerms: false
})

// 表单验证
const errors = reactive({
  username: [],
  password: [],
  email: []
})
```

##### 7.3.2.2. 复杂状态管理

```javascript
const store = reactive({
  user: {
    id: null,
    name: '',
    permissions: []
  },
  settings: {
    theme: 'light',
    notifications: true
  },
  cache: new Map()
})
```

##### 7.3.2.3. API 配置对象

```javascript
const api = reactive({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': null
  },
  timeout: 5000
})
```

### 7.4. 性能考虑

#### 7.4.1. 内存占用

```javascript
// ref - 每个值都是独立的响应式对象
const state = {
  name: ref('John'),
  age: ref(30),
  city: ref('New York')
}

// reactive - 一个代理对象管理多个值
const state = reactive({
  name: 'John',
  age: 30,
  city: 'New York'
})
```

#### 7.4.2. 更新性能

```javascript
// ref - 精确的更新
const count = ref(0)
count.value++ // 只触发一个属性的更新

// reactive - 可能触发多个更新
const state = reactive({
  count: 0,
  total: 0
})
state.count++ // 可能触发相关属性的连锁更新
```

### 7.5. TypeScript 支持

#### 7.5.1. ref 类型定义

```typescript
// 简单类型
const count = ref<number>(0)
const name = ref<string>('John')

// 复杂类型
interface User {
  name: string
  age: number
}
const user = ref<User>({
  name: 'John',
  age: 30
})
```

#### 7.5.2. reactive 类型定义

```typescript
// 接口定义
interface State {
  count: number
  name: string
  users: User[]
}

const state = reactive<State>({
  count: 0,
  name: '',
  users: []
})
```

### 7.6. 最佳实践建议

#### 7.6.1. 混合使用策略

```javascript
function useUserSystem() {
  // 简单值使用 ref
  const isLoggedIn = ref(false)
  const currentUserId = ref(null)
  
  // 复杂对象使用 reactive
  const userState = reactive({
    profile: {
      name: '',
      email: '',
      preferences: {}
    },
    permissions: new Set(),
    metadata: new Map()
  })
  
  return {
    isLoggedIn,
    currentUserId,
    userState
  }
}
```

#### 7.6.2. 代码组织建议

```javascript
// 按职责分离 ref 和 reactive
const ui = {
  isLoading: ref(false),
  error: ref(null),
  currentTab: ref('home')
}

const data = reactive({
  users: [],
  posts: [],
  comments: []
})

const cache = reactive(new Map())
```

总的来说，ref 和 reactive 各有优势，选择使用哪个主要取决于：
1. 数据类型（原始值vs对象）
2. 是否需要解构
3. 数据的复杂度
4. 性能考虑
5. 代码组织方式

## 8. 个人建议

> 建议还是都使用 ref 吧，省得理解成本高，你不能保证团队所有人都理解他们的区别
> 麻烦的点在于每次都 `.value` ，习惯了就还好！
