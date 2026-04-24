# Vue3 基础：篇三

`#vue3` `#R1` 

## 1. Vue 应用实例

- 通过 `createApp` 函数创建新的应用实例
- 应用实例需要一个`根组件`来渲染内容
- 使用 `.mount() `方法挂载应用实例到` DOM 元素`上
- 可以配置应用实例的全局选项和资源，比如
	- 应用级别错误处理器：`app.config.errorHandler = (err) => {})`
	- 注册一个全局组件： `app.component('TodoDeleteButton', TodoDeleteButton)`
- 一个页面可以创建多个共存的 Vue 应用实例。

## 2. Vue 模板

1、Vue 使用基于 `HTML` 的模板语法, 将组件实例的数据绑定到呈现的 DOM 上

2、`文本插值`使用双大括号语法，可以将组件属性显示为纯文本

3、使用 `v-html 指令`可以将属性插入为`原始 HTML`, 但要注意安全风险

3、属性绑定使用 `v-bind` 指令或其`简写`， 可以**动态绑定**多个 HTML 属性

4、`指令`是带有 `v- 前缀`的特殊属性,可以根据表达式的值更新 DOM，`指令`可以带有参数,如 `v-bind:href` 或 `v-on:click`,用于指定绑定的目标

5、`动态参数`允许使用`js 表达式`计算参数名称,如` :[someAttrObj]`

6、`修饰符`是以点开头的特殊后缀，用于指定指令需要以特殊方式绑定，如` .prevent`。

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/3df5cd42ab14e6bb604f1a7fc53e3e91.png)

7、JavaScript 表达式可以被使用在如下场景上

- 在文本插值中 (双大括号)
- 在任何 Vue 指令 (以 `v- 开头`的特殊 attribute) attribute 的值中

## 3. 响应式基础

1、建议使用 `<script setup>`，**来简化暴露大量的状态和方法的繁琐**

2、`ref`可以包装`任何类型`的值并保持`深层响应性` ，即改变嵌套对象或数组时，变化也会被检测到

- 在`模板`渲染上下文中，只有`顶级的 ref` 属性才会被解包
- DOM 更新不适合 ref 变化同步的，`nextTick()` 后可以保证更新
- 非模板场景，**解构里面的属性也会丢失响应性**

3、`reactive()` 将使`对象本身`具有响应性；

- 另外只有`代理对象`是响应式的，更改`原始对象`不会触发更新
- 同一个对象上调用 `reactive() `会返回相同的代理
- 在一个代理上调用 `reactive() `会返回它自己
	- `reactive()` 的局限性
	- `reactive()` 只能处理对象类型，不能处理原始类型
	- `reactive()` 不能替换整个对象，否则会丢失响应式
	- `解构`会丢失响应性，比如 `let { count } = state` 中，修改 `count`就没用了

```javascript
import { reactive } from 'vue'

// 只有代理对象是响应式的，更改原始对象不会触发更新
const raw = {}
const proxy = reactive(raw)


// 在同一个对象上调用 reactive() 会返回相同的代理
console.log(reactive(raw) === proxy) // true

// 在一个代理上调用 reactive() 会返回它自己
console.log(reactive(proxy) === proxy) // true


let state = reactive({ count: 0 })

// 上面的 ({ count: 0 }) 引用将不再被追踪
// (响应性连接已丢失！)
state = reactive({ count: 1 })
```

## 4. 计算属性

- 计算属性可以用来描述依赖响应式状态的复杂逻辑，比方法更加优雅和高效
- 计算属性基于其响应式依赖被`缓存`,只有在依赖变化时才会重新计算,这`对于性能敏感的场景`很有帮助。
- 计算属性可以定义为`可写属性`,提供 `getter` 和 `setter` 方法。
- 计算属性的 `getter` 应该只做计算而没有任何`副作用`，不应该改变其他状态或执行异步操作。
- 计算属性返回的值应该被视为`只读的`，不应该直接修改它，而是`应该更新它所依赖的源状态`

```vue
<script setup>
  import { ref, computed } from 'vue'

  const firstName = ref('John')
  const lastName = ref('Doe')

  const fullName = computed({
    // getter
    get() {
      return firstName.value + ' ' + lastName.value
    },
    // setter
    set(newValue) {
      // 注意：我们这里使用的是解构赋值语法
      [firstName.value, lastName.value] = newValue.split(' ')
    }
  })
</script>
```

## 5. 类与样式

- `:class ` 和 `:style` 都可以绑定`数组` 或者 `对象`，并且最后会被`合并` 处理。
- `:style` 绑定的属性名可以使用 `camelCase` 或 `kebab-case`。
- Vue 使用 `:style` 会自动添加`前缀`

## 6. 条件渲染

- `v-if`
	- `v-if 指令`用于条件性地渲染内容，**仅在表达式返回真值时渲染**。 
	- 注意 `v-if ` `v-else-if` `v-else` 三个的配对关系。
- `v-if` 与 `v-show`
	- `v-if` 是真实的按条件渲染，切换时**销毁与重建事件监听器和子组件**；
	- `v-show `则简单切换 CSS 属性（即始终保留在 DOM 中，**仅切换 display 属性**）
	- `v-if` 有**更高的切换开销**
	- 而 `v-show` 有**更高的初始渲染开销**
	- ` v-if` 优先级高于 `v-for`， 不推荐同时使用。

## 7. 列表渲染

- 循环范围： `v-for="n in 10"`
- 循环列表：`v-for="item in items"`
- 使用 `of` ： `v-for="item of items"`
- 使用 `key` 优化性能
- 在`计算属性`中使用 `reverse()` 和 `sort()` 会修改原数组，务必小心

```js
- return numbers.reverse()
+ return [...numbers].reverse()
```

## 8. 事件处理

- 使用 `v-on` 指令监听 DOM 事件，并在事件触发时执行对应的 JavaScript。
- 内联事件与方法事件
	- `内联事件`处理器适用于简单场景
	- 而`方法事件`处理器适用于复杂逻辑
- 如何传入参数？
	- 可以在`内联事件处理器`中`调用方法`，并`传入自定义参数`或访问原生事件
- Vue 提供了多种`事件修饰符`，
	- 如 `.stop.prevent.self.capture.once.passive` ，以简化事件处理
	- `按键修饰符`和`系统按键修饰符`用于处理特定按键事件
		- 按键修饰符： `.enter .tab .delete  .esc .space .up .down .left .right`
		- 系统按键修饰符： `.ctrl .alt .shift .meta` 
		- `.exact` 修饰符允许精确控制触发**事件所需的系统修饰符组合**
		- `鼠标按键修饰符`用于处理特定鼠标按键触发的事件
		   - 比如 `.left.right.middle` 

> `passive` 是一个事件监听器选项，它告诉浏览器监听器不会调用 `preventDefault() `来阻止默认的滚动行为，可用于改善滚动性能

```javascript
window.addEventListener('scroll', function(event) {
    // 处理滚动事件
}, { passive: true });
```

## 9. 表单输入绑定

- `v-model 指令`简化了表单输入与 JavaScript 变量的同步
	- `v-model` 支持多种表单元素，包括文本输入、复选框、单选按钮和选择器。比如
	- 文本类型的` <input>` 和 `<textarea>` 元素会绑定 `value property` 并侦听` input 事件`；
	- `<input type="checkbox">` 和 `<input type="radio">` 会绑定 `checked property `并侦听 `change 事件`；
	- `<select> `会绑定 `value property `并侦听 `change` 事件
	- `v-model` 会忽略任何表单元素上初始的 `value`、`checked` 或 `selected` attribute
	- `v-model` 可以与`修饰符`一起使用，如` .lazy、.number 和 .trim`，以实现不同的输入管理方式
	- `.lazy`：在 `change` 事件后同步更新而不是 `input`
	- 除了`内置表单`外，可以在组件中使用 `v-model` 来创建具有`自定义行为`的可复用输入组件

相对小众的一个用法：

```vue hl:4
<input
  type="checkbox"
  v-model="toggle"
  :true-value="'选中了'"
  :false-value="'未选中'" />
```

## 10. 生命周期

![image.png|688](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/ecf5a16d3c2229d12c040cb757da8714.png)

## 11. 侦听器

### 11.1. watch 

```javascript hl:6,13,32,33,18
// 侦听单个来源
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): StopHandle

// 侦听多个来源
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): StopHandle

type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object
  ? T
  : never // 响应式对象

interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean // 默认：false
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  once?: boolean // 默认：false (3.4+)
}
```

### 11.2. watchEffect()

```javascript
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): StopHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

type StopHandle = () => void
```

### 11.3. 几个注意点

1、`watch` 的 `第一个参数` 都建议写成`箭头函数`

2、注意 `watch` 的 `第二个参数` 有 `once` 、`immediate` ， `deep`
- 但需要注意 `deep = true 时` 可能会引起性能问题

3、 [watchEffect函数](https://cn.vuejs.org/api/reactivity-core.html#watcheffect) 会**自动收集并追踪**函数内所依赖的响应式数据，省得手动维护所需要监听的数据，他不需要像 `watch` 一样递归地跟踪所有的属性，比较适合侦听一个嵌套数据结构中的`几个属性`。

4、回调的触发时机

（1）`flush：pre`默认情况下，侦听器回调会在`父组件更新之后、所属组件的 DOM 更新之前`被调用，这意味着如果你尝试在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态

- 能够避免不必要的渲染
- 大多数情况下这是最优选择
- 考虑使用 `pre` 模式配合 `nextTick`

```javascript
const count = ref(0)

// 在组件更新前触发
watch(count, (newValue, oldValue) => {
  console.log('count changed:', newValue)
}, { flush: 'pre' })

function update() {
  count.value++
}

// 执行顺序：
// 1. count 值更新
// 2. 触发 watch 回调
// 3. 组件重新渲染

```

（2）可以通过设置`flush: 'post'`选项在侦听器回调中访问被 Vue 更新之后的 DOM。

- 需要访问更新后的 DOM
- 需要确保某些 DOM 操作在渲染后执行

```javascript
const count = ref(0)

// 在组件更新后触发
watch(count, (newValue, oldValue) => {
  // 此时可以访问更新后的 DOM
  console.log('DOM updated, count is:', newValue)
}, { flush: 'post' })

function update() {
  count.value++
}

// 执行顺序：
// 1. count 值更新
// 2. 组件重新渲染
// 3. 触发 watch 回调

```

（3）可以设置 `flush: 'sync'` 创建一个`同步触发的侦听器`，它会在 Vue 进行任何更新之前触发

- 可能影响性能
- 只在特定场景下使用（如**调试**）
- 处理高频更新时要特别注意

```javascript
const count = ref(0)

// 同步触发，立即执行
watch(count, (newValue, oldValue) => {
  console.log('count immediately changed:', newValue)
}, { flush: 'sync' })

function update() {
  count.value++
  count.value++
  count.value++
  // 每次改变都会立即触发 watch
}

// 执行顺序：
// 值改变立即触发 watch，不等待下一个 tick
```

（4）同步侦听器不会进行**批处理**，每当检测到响应式数据发生变化时就会触发。可以使用它来监视简单的布尔值，但应避免在可能多次同步修改的数据源 (如数组) 上使用

5、停止侦听器

（1）**宿主组件卸载时自动停止，但异步回调里则不会**

```javascript hl:9
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

> 需要`异步创建`侦听器的情况很少，请尽可能选择`同步创建`。如果需要等待一些异步数据，你可以使用**条件式的侦听逻辑**

（2）手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数

```javascript
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

## 12. 模板引用

1、使用 `ref attribute` 来引用 DOM ，如 `<input ref="input"> `

2、在组件挂载后 `onMounted` 中，使用 `ref` ,不然可能为 `null` ；或者 `watch ` 不为空时，也能正常获取到 DOM

3、`v-for` 中的模板引用，`<li v-for="item in list" ref="itemRefs">` ， 其中 `const itemRefs = ref([]) `

4、函数模板引用： `<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">`

5、组件上的 `ref` ： `<Child ref="child" />`，而后就可以通过 `child` 获取组件 `Child` 的实例，但访问`组件实例`的属性或方法需要通过 `defineExpose` 暴露出来，原因如下：

6、使用了 `<script setup>` 的组件是默认私有的：一个父组件无法访问到一个使用了 `<script setup> `的子组件中的任何东西，除非子组件在其中通过 `defineExpose 宏` **显式暴露**

>  这个和 React 也很像
