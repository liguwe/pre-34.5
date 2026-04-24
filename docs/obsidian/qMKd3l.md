# JavaScript 的组成

`#javascript` 

## 1. Javascript 的组成

![image.png|632](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/a9104fded4d48d2d613eecce29dc3a26.png)

- ECMAScript：由 ECMA-262 定义并提供核心功能
- 文档对象模型(DOM)：
	- 提供与`网页内容`交互的方法和接口
- 浏览器对象模型(BOM)：
	- 提供与`浏览器`交互的方法和接口

> - ECMA-262：ECMA-262 是由欧洲计算机制造商协会（ECMA）发布的一项标准，正式名称为“ECMAScript 语言规范


> - 至于 262 没有什么特别的含义，就是一个代号
> - TC39 委员会：ECMA-262 由 TC39（ECMAScript 技术委员会）负责制定和维护，该委员会由来自各大科技公司的专家组成，定期讨论和推进 ECMAScript 标准的演进。
> - 最新的规范草案请见 [https://tc39.es/ecma262/](https://tc39.es/ecma262/)

## 2. Javascript 为何有如此“地位”

- 与 HTML/CSS 完全集成
- 所有的主流浏览器支持

## 3. 浏览器上的 Javascript 能做什么 和 不能做什么？

- JavaScript 的能力很大程度上取决于它`运行的环境`。
	- 例如，[Node.js](https://wikipedia.org/wiki/Node.js) 支持允许 JavaScript 读取/写入任意文件，执行网络请求等的函数
	- 浏览器上的 Javascript 的能力都是浏览器提供的
		- app webview 上 JavaScript 的能力都是`嵌入的 APP` 提供
			- 比如 `webview` 组件提供了很多配置项，用于是否开启一些能力
				- 比如是否开启 Locastarage , iframe 的一些配置等等

### 3.1. 能做什么

- DOM：
	- 操作 HTML 及 CSS
- BOM：
	- 操作浏览器提供的各类 API
- 请求资源：
	- 访问资源、上传、下载资源
- 本地存储：
	- cookie、localstarage 、sessionstrage 等

### 3.2. 不能做什么

- 浏览器端读、写文件，但可以通过 `input type=file` 选择文件
- 直接访问原生系统的一些能力，比如调取摄像头、麦克风等
	- 通过**特殊标签**可以调取
- 不能在`随意在不同窗口间通信`，需要一些限制，比如同域

## 4. JS 的超级们

- [CoffeeScript](https://coffeescript.org/) 
	- 现在基本不用了
- [TypeScript](https://www.typescriptlang.org/) 
	- 添加了严格的数据类型校验，后面会详细说它。微软出品。
- [Flow](https://flow.org/) 
	- 也添加了数据类型，但是以一种不同的方式。由 Facebook 开发。
- [Dart](https://www.dartlang.org/) `Flutter` 使有语言，它也可以被编译成 JavaScript，由 Google 开发。
- [Brython](https://brython.info/)  
	- Python 到 JavaScript 的转译器
- [Kotlin](https://kotlinlang.org/docs/reference/js-overview.html) 
	- 是一个现代、简洁且安全的编程语言，编写出的应用程序可**以在浏览器和 Node 环境中运行**。
