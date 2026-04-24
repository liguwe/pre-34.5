# 前端框架设计的核心要素

`#前端` `#前端框架`  `#vue` 

## 1. 总结

- 开发体验
	- 工具链：开发、调试、构建
	- 报错提示
	- 开发调试
- 产物体积
	- tree-shaking
- 多环境下多产物
- 特定开关，为了，比如 vue 的 组合式 还是 选项式
	- 更好性能
	- 更小体积
- 错误处理机制&降级等
- ts 支持

---


> 对于开发一个前端框架来说，有哪些`核心要素`呢？ 如下：

## 2. 开发体验

- **工具链**: 
	- 开发、调试、构建
- **报错警告提示，是否能够让开发者立马定位到问题**
	- 比如 如何提示 `App.mount('#app')` 中 `#app` 节点 不存在
- **开发调试是否直观？**
	- 比如`const obj = ref()` ，每次都是打印 `obj`的值都需要 `obj.value` ?  
		- 框架层面肯定需要提供好的 log 方式
			- `DevTools` 提供 `custom formmaters` 
			- 框架层面会提供 `initCustomFormatter` 的定义

## 3. 控制框架代码体积

如何做到开发环境下更多提示，而不增加代码体积呢？
- 需要使用 `roolup 插件` 或者 `webpack 插件` 的 `__DEV__常量`  来做到这一点，生成环境下形成  `dead code` , 在使用打包工具 `tree-shaking` 的能力，进行移除

> [!info]
`dead code` 即 永远不会执行的代码，如 `if(false)` 或者 `import 后没使用的模块`等

## 4. 良好的 `tree-shaking` 机制

- 上面说的`dead code` 很容易被 `tree-shaking`掉
	- 但是`副作用` 呢，因为 `proxy` 能力`只读每个属性`也可能引起`副作用`。
		- 答案是：`/*#__PURE__*/`   
			- `rollup` 和 `webpack` 、`terser` 都可以识别它 ，它告诉打包工具，`放心 tree-shaking 掉吧` 

## 5. 多种环境下的构建产物不一样

比如：
- `rollup` 下，设置 `format` 为 `iife` 给 `script` 标签直接使用
- `rollup` 下，设置 `format` 为 `esm` 给 `<script type="module">` 直接使用
- `rollup` 下，设置 `format` 为 `cjs` 给 nodejs 环境使用 ，为了 `SSR`

另外，如何打包给 `rollup` 或者 `webpack` 工具使用呢 ？
- 答案是 `esm` , 但又如何 与   `<script type="module">` 区别呢 ？
- 看 package.json , 如下 `代码` 和 `图片` 

```json
{
	"main":"index.js",
	"module":"dist/vue.runtime.esm-bundler.js",
}
```

![|648](https://od-1310531898.cos.ap-beijing.myqcloud.com/202303191018366.png)

## 6. 支持特性开关

  比如 vue3 的 `组合式 API` 和 `选项式 API`， 如果用户确定只需要使用 `组合式 API` ，那么可以通过设置 `__VUE_OPTIONS_API__` 预定于常量来开启或者关闭

## 7. 错误处理机制

比如一个工具库提供一个 `fetch` 方法 ，但使用的方式必须传入回调 `fetch(callback)`，怎么容错呢？三种
1. 用户自己 `try catch`，但是如果有很多方法，需要每个都 `try catch` 吗
2. 用户自己实现一个 `handleError` 方法
3. 工具库提一个 `utils.registerErrorHandler` 静态方法, 用户使用它注册错误处理程序
	- 第 3 种，就是 Vue 的处理方式，`app.config.errorHandler`  , 为用户提供更好的框架层面的健壮性

## 8. Typescript 支持

完善 Typescript 支持，**可能比框架本身还要花精力和时间**

## 9. 参考

- 《Vue.js 设计与实现》
