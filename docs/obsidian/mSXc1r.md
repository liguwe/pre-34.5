# Vue3 基础：篇二

`#vue3` `#前端框架/vue` 

## 1. 几个关键词

### 1.1. Vue 的两个核心功能

- `声明式渲染`：
	- Vue 基于标准 HTML 拓展了一套模板语法，使得我们可以声明式地描述最终输出的 HTML 和 JavaScript 状态之间的关系。
- 响应性：
	- Vue 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM。

### 1.2. 单文件组件

- `单文件组件` (也被称为 `*.vue` 文件，英文 Single-File Components，缩写为 SFC)
	- 顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里

### 1.3. API 风格

Vue 的组件可以按两种不同的风格书写：选项式 API 和 组合式 API。

#### 1.3.1. 选项式 API (Options API)

即`vue2`的写法

#### 1.3.2. 组合式 API (Composition API)

即新的`vue3`的写法

### 1.4. ONLINE DEMO

> 很重要，重要功能或者feature 可以直接在线体验

- 想要快速体验 Vue，你可以直接试试我们的 [演练场](https://sfc.vuejs.org/#eNo9j01qAzEMha+iapMWOjbdDm6gu96gG2/cjJJM8B+2nBaGuXvlpBMwtj4/JL234EfO6toIRzT1UObMexvpN6fCMNHRNc+w2AgwOXbPL/caoBC3EjcCCPU0wu6TvE/wlYqfnnZ3ae2PXHKMfiwQYArZOyYhAHN+2y9LnwLrarTQ7XeOuTFch5Am8u8WRbcoktGPbnzFOXS3Q3BZXWqKkuRmy/4L1eK4GbUoUTtbPDPnOmpdj4ee/1JVKictlSot8hxIUQ3Dd0k/lYoMtrglwfUPkXdoJg==)。
- 如果你更喜欢不用任何构建的原始 HTML，可以使用 [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) 入门。
- 如果你已经比较熟悉 Node.js 和构建工具等概念，还可以直接在浏览器中打开 [StackBlitz](https://vite.new/vue) 来尝试完整的构建设置。

### 1.5. 类似于 unpkg 的东西

- [unpkg](https://unpkg.com/)
- [jsdelivr](https://www.jsdelivr.com/package/npm/vue) 或 [cdnjs](https://cdnjs.com/libraries/vue)

### 1.6. Vue2 与 Vue3 的区别

- Vue 2 在 2023 年底将到达它的截止维护日期
- vue3 仅支持 IE11及以上。Vue 3 用到了一些 IE11 不支持的现代 JavaScript 特性
- vue3 只支持 [原生支持 ES2015 的浏览器](https://caniuse.com/es6) ，即 `es6`

## 2. 应用

1、每个 `Vue` 应用都是通过 [createApp](https://cn.vuejs.org/api/application.html#createapp) 函数创建一个新的 `应用实例`

2、根组件

![image.png|568](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/b88a5a4d2277eff8f27cf31541ea7c84.png)

3、挂载应用

![image.png|552](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/e83ae5da762a1f626745c2bb063513cf.png)

4、应用配置

![image.png|552](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/8a51b48b1e5e8ea2fd9d5590b63f12f0.png)

5、多个应用实例

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/06eaeda3dcc927c55c1c786a078866da.png)

## 3. 模板语法

1、`&#123;&#123;&#125;&#125;`

![image.png|496](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/348842d7954689c3fdb16c1a8c0f0cad.png)

2、rawHtml 与 `v-html` 指令

![image.png|520](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/5968a47d4e873e246b2520f15634070f.png)

3、`v-bind:attrName` 与 简写`:attrName` 或 `v-bind:obj` 动态绑定多个值

![image.png|496](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/26f05e6dfe25ed256f0eee99069f2010.png)

简写： `:attrName`

![image.png|504](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/50c1241f3a8803a2f5b58996c011aeea.png)

![image.png|432](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/acf06258899c4d73a70ae439342aef61.png)

4、`&#123;&#123;&#125;&#125;` 仅支持`表达式`，不支持`语句`

![image.png|488](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/1ebe8a98b79792c966d3a75d935365ad.png)

5、受限的全局访问，可以通过 [app.config.globalProperties](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 配置

- 模板中的表达式将被`沙盒化`，仅能够访问到[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3)。
- 该列表中会暴露常用的内置全局对象，比如 `Math` 和 `Date`。

```javascript
import { makeMap } from './makeMap'

const GLOBALS_WHITE_LISTED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'

export const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED)
```

没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 window 上的属性。

> 你也可以自行在 [app.config.globalProperties](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 上 显式地添加它们，供所有的 Vue 表达式使用。

## 4. 指令 Directives

1、`v-on` 有一个相应的缩写，即 `@` 字符 ， 如 `@click <=> v-on:click`

2、`v-bind:href` 等价于 `:href` 

3、**动态参数**的说明如下
- 动态属性
- 动态事件名称
- 动态参数值的限制：为null 或者 字符串，否则编译警告
- 动态参数的语法限制：大小写，注意空格等

具体看下面：

![image.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/0c3f6bbe4333afb3a4d663b954c16887.png)

动态参数的语法限制：

![image.png|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/53bf37f4be201240faf16a9c33191c14.png)

4、指令的修饰符

![image.png|552](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/9f6397816b7d01663f22e57bbc383a36.png)
