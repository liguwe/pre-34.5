# 前端框架设计概述

`#前端/前端框架` 


## 1. 总结

- 什么才算前端框架？
- 现代前端框架要点
	- 围绕 `UI = f(state)` 展开的
		-  `UI` 依赖与宿主环境的`渲染引擎`
		- `f` 是框架本身的`运行机制`
		- `state` 当前视图的`状态/数据`
	- 组件化：独立单元，方便复用
	- vdom：分层
	- 响应式系统
		-  Vue：
            - 使用 `Proxy` 和 `Object.defineProperty` 来检测数据变更。
        - React：
            - 通过**状态（state）管理系统**更新，通常结合 `setState` 或 `hooks`。
		- 自动收集+自动触发更新
	- 单选数据流
	- 模板与声明式渲染
	- 路由管理
	- 生命周期管理
	- 性能优化手段：懒加载、代码分割
	- 跨平台渲染：
		- ssr、ssg、rn
		- 抽象出渲染层，兼容多平台
	- **事件委托** ： 管理和优化事件绑定
		- react 的合成事件：统一管理事件监听等
		- vue 的自定义事件 + 原生事件等
	- 编程范式
		- **组合而非继承**
		- 函数式编程，推崇纯函数和不可变数据
	- 配合编译时优化，比如
		- 内联优化，写到模板里的回调函数，提出来
		- 静态代码编译 → 提升
- 如何描述 UI：更直观还是更灵活？
	- 声明式：vue 、jsx 、HTML 等等
	- js 对象：
		- vdom 
		- 渲染函数
			- vue h
			- React 的 createElement
- 副作用
	- 影响到**组件以外**的地方
	- 纯函数，没有副作用
- 渲染函数
	- **创建虚拟 DOM 节点**的工厂函数
	- 比如vue的 h 函数：`h(标签或组件, 属性对象, 子节点列表&文本节点)`
		- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250102.png)
- 前端框架中的一些**编译技术&编译策略**
	- JIT：**即时编译**
		- 比较适合开发时
			- 源码和产物方便对应
	- AOT ：**预编译**
	- 增量编译
	- 懒加载（Lazy Loading）或者叫延迟编译，按需编译
		- 现在 vite 就是这个代表
	- tree shaking 
	- source mapping
	- 选择
		-  **开发期间**，快速迭代和调试需求往往让 `JIT` 更受青睐。
		- **生产环境**，启动性能和安全性通常使 `（AOT（Ahead-of-Time）` 成为更好的选择
- 现代框架优化思路
	- 编译时优化
	- 运行时优化
		- 虚拟 DOM diff 算法优化
		- 事件处理优化
		- 状态更新批处理
		- 缓存优化
		- **编译时静态分析**
			- 提前优化**静态内容**
		- **增量渲染**: 
			- 只更新变化的部分
			- 分批次渲染大列表
		- **异步渲染**: 
			- 任务分片和优先级调度 
		- **渲染优先级**:
			- 智能调度渲染任务
		- **后台预渲染**: 
			- 利用空闲时间**预渲染**
		- **选择性渲染**: 
			- 智能跳过不必要的更新
	- 构建优化
		- 体系化思路见 [14.  前端构建提速的体系化思路](/Y3re9r) 
	- 加载优化
		- 预加载
		- 代码分割、异步组件
		- 资源压缩，图片，字体等
		- CDN
		- 缓存策略设置
	- 开发体验优化
		- 热更新
		- 工具链
		- ts 提醒
		- 错误、排查定位问题等
	- **服务器组件**
		- RSC
	- 跨平台
		- 抽象出来
		- 跨平台的一致开发体验
	- 响应式优化：
		- 自动收集+自动触发更新

## 2. 何为前端框架

- umi 算是框架
	- 内置了路由、构建、流水线部署等
- Angular 是框架
- Next.js ：
	- 基于 React 的，支持 SSR、SSG的`服务端框架`
- Nuxt.js 
	- 基于 Vue
- Modern.js 等

## 3. 前端库与前端框架的区别？

- 框架：
	- React
		- 虽然有时被称为库，但因其生态系统更像框架
		- Angular 
		- Vue.js 
- 库：
	- 提供特定功能的工具集，比如 jQuery、Lodash、Moment.js

> 严格说，React 和 Vue 都不算是`框架`，而算是`库`

## 4. 现代前端框架的实现原理

现代前端框架的**核心实现原理**是通过**组件化、虚拟DOM和响应式系统**等，实现**高效的声明式 UI 渲染 和 状态管理**。
- 其实就是围绕 `UI = f(state)` 展开的
	- `UI` 依赖与宿主环境的`渲染引擎`
	- `f` 是框架本身的`运行机制`
	- `state` 当前视图的`状态/数据`
- 至于**组件化、VDom、响应式**等都是`手段`

## 5. 现代前端框架的核心模块组成有哪些？

1. **组件化**：
	- 前端框架通常以组件为基础构建应用程序。
	- 组件是封装了 **UI 和逻辑的独立单元**，可以重复使用
2. **虚拟 DOM**：
    - 虚拟 DOM 是内存中的一个轻量级表示，用于优化实际 DOM 操作。
3. **响应式系统**：
    - 现代框架提供自动化的响应式数据绑定，确保当应用状态变化时，UI 会自动更新。
    - 实现：
        - Vue：
            - 使用 `Proxy` 和 `Object.defineProperty` 来检测数据变更。
        - React：
            - 通过状态（state）管理系统更新，通常结合 `setState` 或 `hooks`。
4. **单向数据流**：
    - 通过单向数据流来管理组件之间的数据传递，以确保应用的数据流动方向明确，易于跟踪和调试。
    - 实现：
        - 通常采用状态管理库（如 Redux、Vuex、Pinia 等）
            - 管理全局应用状态，
            - 并通过严格的操作步骤来更新状态。
5. **模板和声明式渲染**：
    - 使用模板来描述 UI，提供声明式的视图定义。
    - 实现：
        - 模板语法被**编译**为渲染函数，将数据映射到 UI 组件。
            - 比如 
                - JSX 编译成 `createElement`
                - `.vue` 编译成 `h 函数`
6. **路由管理**：
    - 实现单页应用（SPA）的视图切换，方便在不同页面之间导航。
    - 实现：
        - 框架提供路由功能（如 React Router、Vue Router），匹配路径并渲染相应组件。
7. **生命周期管理**：
    - 提供钩子函数
        - 允许开发者在组件特定的生命周期阶段执行代码。
    - 实现：
        - 通过生命周期方法（React 的 componentDidMount、useEffect，Vue 的 created、mounted 等）来获取个性化控制。
8. **性能优化**：
    - 现代框架通过多种技术优化性能，如懒加载、代码分割等。
    - 实现：
        - 框架提供内置的工具和约定，以减少初始加载时间和优化更新性能。
9. **跨平台渲染**： 
	- 支持服务器端渲染（SSR）、静态站点生成（SSG）、以及与移动和桌面平台（如 React Native）集成。 
	- 抽象出**渲染层**，并提供多平台兼容的实现
10. **事件处理**
    - 管理和优化事件绑定
    - 实现: 
        - 事件委托，统一管理事件监听

## 6. 如何描述 UI

### 6.1. 方式一：声明式描述 UI - 模板

主流其实都是**模板**来描述，无论是 jsx 或者模板引擎都是**模板**

- JSX 也是一种特殊的模板，兼顾以下两个特性（关于 JSX，更多见 [9. 深入理解 JSX](/4y3MUj)）
	- 强逻辑表达
	- UI 描述丰富性
- 模板，即声明式描述 UI  
	- 代表 
		- HTML
		- `.vue` SFC
		- php smarty
		- jsp 等等
		- ejs
	- 主要问题是逻辑表达性弱了些

举例：`声明式描述 UI`
- 比如 `<div class='btn' id='test' @click="handle"> button </div>`， 包含信息 tag名，属性，事件，层级关系  

### 6.2. 方式二：JavaScript 对象  

 使用 `JavaScript对象 ` 来描述 UI，如下代码 

```javascript  
const title = {
    tag: 'h1', // tag 名称
    props:{
	    // 属性与事件
	    onClick:handler
	}
	children:[
      // 子节点
      {tag: 'span'}
  ]
}
```  

#### 6.2.1. V-DOM

`虚拟 DOM` 描述 UI，比如 vue 中的 `渲染函数 - h` ，如下代码：  

```javascript  
import { h } from "vue";
export default{
    render(){
        // 虚拟 DOM
        return h('h1',{ onClick: fn }); 
        // 或者直接返回 js 对的
        return {
            tag: 'h1', // tag 名称
            props:{ // 属性与事件
                onClick:handler
            }
            children:[ // 子节点
                {tag: 'span'}
            ]
        }
    }
}
```  

`h` 返回的其实就是 `js 对象`， `h 函数`就是辅助创建虚拟 DOM 的工具函数而已，**所以他俩其实是一个东西**  

### 6.3. 两种方式的对比

- 哪种方式**更灵活**呢？  
  - 答案是：`JavaScript 对象`（或`虚拟 DOM` ） 的方式，  
     - 比如表现 `H1-H6` ，使用 `tag:H${index}` 即可  
     - 又比如说，`jsx`的方式实现 `递归树`，更方便  
- 那种方式**更直观**呢？
	- 当然是 `模板`

## 7. 数据与视图（UI ）

简单说，前端框架需要`数据驱动 UI 渲染`，即数据变化了，UI 视图跟着一起变化

## 8. 什么是副作用

- 指的是在组件渲染过程中，那些会影响到**组件之外**的其他部分的操作，比如
	- 发起网络请求（如 API 调用）
	- 修改 DOM（直接操作，而非通过框架的渲染机制）
	- 设置定时器或间隔器
		- 如 `setTimeout` 或 `setInterval`
	- 订阅外部事件
	- 修改全局变量
	- 写入本地存储
		- 如修改 `localStorage` 或 `sessionStorage`
	- 日志记录等

比如：访问/修改 `localStorage`（副作用）

```jsx
// 这个组件将用户名存储在浏览器的 localStorage 中，这是一个影响外部环境的操作
function RememberMe({ username }) {
 
 useEffect(() => {
   localStorage.setItem('username', username);
 }, [username]);
 
 return <div>Remembering {username}</div>;
}
```

相对比的，**纯函数**或者没有副作用代表**不会影响到它本身以外的任何东西**，比如

```jsx
// 这个组件只是单纯地渲染文本，不会影响其他任何东西。
function Welcome(props) {
	 return <h1>Hello, {props.name}</h1>;
}
```
   
副作用不是简单的渲染操作，而是会影响组件外部状态或环境的操作。

>  在现代前端框架中，妥善管理这些`副作用`是保证应用稳定性和性能的关键。

## 9. 展开说说渲染函数：以 Vue 的 `h 函数` 为例

- `h函数` 是**用于创建虚拟 DOM 节点**的一个函数，通常**在渲染函数中使用**。
- `h 函数`本质上是**一个创建虚拟 DOM 节点的工厂函数**。
	- 它的作用可以类比为`用 JavaScript 来写 HTML`。

简单来说：
- 作用：
	- **创建虚拟 DOM 节点**
- 使用场景：
	- 当你需要用 JavaScript 来精确控制渲染内容时
- 基本语法：参数
	- `h(标签或组件, 属性对象, 子节点列表&文本节点)`

一个简单的例子：

```javascript
// HTML: <div class="greeting">Hello, World!</div>
h('div', { class: 'greeting' }, 'Hello, World!')

// HTML: <button onClick="alert('Hi')">Click me</button>
h('button', { onClick: () => alert('Hi') }, 'Click me')

// 嵌套使用
h('div', [
  h('h1', 'Title'),
  h('p', 'Paragraph')
])
```

### 9.1. 主要用途

1. **创建虚拟 DOM**:
	- `h` 函数通过 JavaScript 对象来描述 DOM 结构，这对于动态创建组件结构、进行复杂的条件渲染等场景十分有用。
2. **渲染函数中使用**:
	- 在需要完全控制渲染逻辑时，`h` 函数可以与渲染函数一起使用，以构建组件的虚拟 DOM 树。
3. **支持 JSX 语法**:
	- 在使用 JSX 语法时，**JSX 会被编译成 `h` 函数调用**。
	- 使用 React 也一样，JSX 渲染成 `createElement` 等函数

### 9.2. 常见的 `h` 函数参数

- **第一个参数**：
	- 标签名称、组件类型或异步组件（可以是字符串或组件变量）
- **第二个参数**（可选）：
	- 一个数据对象，包括属性、class、事件等
- **第三个参数**（可选）：
	- 子节点，可以是字符串、数组或更多 `h` 函数调用

### 9.3. 示例

```javascript
import { h } from 'vue';

export default {
  render() {
    return h('div', { class: 'container' }, [
      h('h1', 'Hello World'),
      h('p', 'This is a paragraph.'),
      h(MyButton, { onClick: this.handleClick }, 'Click Me')
    ]);
  },
  methods: {
    handleClick() {
      alert('Button clicked!');
    }
  }
}
```

- 在这个例子中，`h` 函数用于创建一个 `div` 包含一个标题、一个段落和一个自定义按钮组件。
	- 这种方式提供了非常灵活的界面渲染能力，可以在不依赖模板的情况下，直接**使用 JavaScript 表达业务逻辑**。

## 10. 前端框架中的一些编译技术或编译策略

代码编译技术或者策略，对**应用程序的性能和开发体验**有重要影响，还直接影响开发效率和调试能力。选择合适的编译策略通常需要权衡开发体验、应用性能和部署环境等多个因素。

### 10.1. JIT（Just-in-Time）编译：即时编译、运行时编译

**JIT 编译**是在**运行时**进行的编译。代码在执行时被动态编译为机器码。

特点：
- 灵活性高：可以根据运行时的情况进行优化。
- 启动时间较长：因为需要在运行时编译。
- 内存占用较大：需要保存原始代码和编译后的代码。

应用：
- 在浏览器中广泛使用，如 **V8 引擎（Chrome）**。
- Angular 的**开发时模式**默认使用 JIT。

优势：
- 开发过程中更快的构建时间
- 易于调试，因为**源代码和运行代码之间有直接对应关系**

### 10.2. AOT（Ahead-of-Time）：预编译

**AOT 编译**是在**构建阶段**就将代码编译为机器码或更低级的代码。

特点：
- 更快的启动时间：
	- 因为代码已经预先编译
- 更小的包体积：
	- 不需要包含编译器
- 更好的安全性：
	- 源代码不暴露在客户端

应用：
- **Angular 生产模式**默认使用 AOT
- React 的 `Prepack` 是一种 AOT 优化工具。
	- 分析代码的静态部分
	- 预执行可以预计算的代码（**看下面代码**）
	- 生成优化后的等效代码
	- 保持代码的语义不变
	- 目前 **Prepack 项目处于暂停状态**

```javascript hl:5
// 原始代码
const x = 2 + 3;
const y = x * x;

// Prepack 优化后
const y = 25; // 直接计算结果

```

优势：
- 更快的首次加载和渲染速度。
- 在构建时就能发现某些类型的错误。

### 10.3. 增量编译（Incremental Compilation）

只重新编译**发生变化的部分（增量部分）**，而不是整个应用

特点：
- 加快开发中的编译速度。
- 在大型项目中特别有效。

应用：
- TypeScript 和许多现代构建工具支持增量编译。

### 10.4. 懒加载（Lazy Loading）

- 不是的编译技术，**是一种编译策略**
- 定义
	- 按需加载代码块，而不是一次性加载整个应用
- 特点：
	- 改善初始加载时间。
	- 减少不必要的网络传输。
- 应用：
	- Angular、React Router 等都支持**路由级别的懒加载**
	- 还有现在相对比较成熟的 `vite`

### 10.5. Tree Shaking

- 定义：移除未使用的代码（死代码消除）。
- 特点：
	- 减小最终的包大小。
	- 通常与 ES6 模块和 AOT 编译结合使用。
- 应用：
	- Webpack、Rollup 等构建工具支持 Tree Shaking。

### 10.6. 源码映射（Source Mapping）

- 定义：在生产环境中将压缩和转换后的代码映射回原始源代码。
- 特点：
	- 便于在生产环境中进行调试。
	- 通常与 AOT 编译结合使用。

### 10.7. 选择

- **开发期间**，快速迭代和调试需求往往让 `JIT` 更受青睐。
- **生产环境**，启动性能和安全性通常使 `（AOT（Ahead-of-Time）` 成为更好的选择

## 11. 现代框架的优化思路

### 11.1. 框架核心设计原则

- **JSX/模板语法**: 
	- 直观的视图描述方式
- **组件组合**: 
	- 通过**组合而非继承**构建复杂UI
- **函数式编程**: 
	- 推崇纯函数和不可变数据
		- Vue 或 React 的 hooks 都是这个思路

### 11.2. 编译时优化

- 常量折叠
- 内联优化
- 静态代码编译 → 提升
- 死代码消除
- Props 传递优化

```javascript
// 传统运行时框架
const app = createApp({
  template: '<div>{{ message }}</div>'
})

// 现代编译时框架（如Svelte）
// 编译后直接生成优化的 JavaScript 代码
function update(message) {
  div.textContent = message;
}
```

### 11.3. 运行时优化

- 虚拟 DOM diff 算法优化
- 事件处理优化
- 状态更新批处理
- 缓存优化
- **编译时静态分析**: 
	- 提前优化**静态内容**
- **增量渲染**: 
	- 只更新变化的部分
	- 分批次渲染大列表
- **异步渲染**: 
	- 任务分片和优先级调度 
- **渲染优先级**:
	- 智能调度渲染任务
- **后台预渲染**: 
	- 利用空闲时间**预渲染**
- **选择性渲染**: 
	- 智能跳过不必要的更新

### 11.4. 构建优化

```javascript
// 现代构建工具配置示例
export default {
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'moment']
        }
      }
    }
  }
}
```

### 11.5. 加载优化

- **代码分割**: 
	- 路由级别的代码分割
- **预加载策略**: 
	- 使用预加载提示
- **资源优化**:
	- 图片、字体等资源的优化
- **缓存策略**: 
	- 合理的缓存配置 

### 11.6. 开发体验优化

- 工具链集成：
	- jsx、ts、vite 等等
- **热模块替换**: 
	- 快速更新修改
- **类型检查**: 
	- TypeScript 集成
- **开发工具**: 
	- DevTools 支持
- **调试能力**: 
	- 源码映射

### 11.7. 服务器组件（RSC）

```javascript
// 服务器组件示例 (React Server Components)
// server-component.jsx
async function ServerComponent() {
  const data = await db.query('SELECT * FROM posts');
  return <div>{data.map(post => <Post key={post.id} {...post} />)}</div>;
}
```

### 11.8. 跨平台

- **Web Components**: 
	- 标准化组件
- **跨平台渲染**: 
	- **统一的渲染抽象**
- **原生性能**: 
	- 更接近原生的性能
- **一致性体验**: 
	- 跨平台的一致开发体验

### 11.9. 响应式系统优化：自动收集+自动触发更新

```javascript
// 现代响应式系统示例
const createSignal = (value) => {
  const subscribers = new Set();
  
  const read = () => {
    // 依赖收集
    if (currentEffect) {
      subscribers.add(currentEffect);
    }
    return value;
  };
  
  const write = (newValue) => {
    value = newValue;
    // 触发更新
    subscribers.forEach(effect => effect());
  };
  
  return [read, write];
};
```
