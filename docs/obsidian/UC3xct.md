# JavaScript 简介

`#javascript` 

## 1. JavaScript 的基本概念

### 1.1. 定义

- **JavaScript** 是一种符合 ECMAScript 规范的高级编程语言。
- 最初设计的目的是增强 HTML 网页的动态行为和交互能力。

### 1.2. 历史

- **诞生**：
	- 由 Brendan Eich 在 1995 年开发，并首次应用于 Netscape Navigator 浏览器。
- **标准化**：
	- ECMAScript 是由 ECMA International 管理的 JavaScript 标准化规范，ECMAScript 31999 年）和 ECMAScript 5（2009 年）是重要的里程碑。
- **现代化**：
	- ECMAScript 6（2015 年），又称 **ES6 或 ES2015**
		- 引入了许多新特性类，模块，箭头函数等。

## 2. JavaScript 的核心特性

### 2.1. 动态类型

- JavaScript 是动态类型语言，变量可以在运行时改变类型。

### 2.2. 解释执行

- JavaScript 解释型语言，**不需要编译**，直接在浏览器或 JS 引擎中解释执行。
	- 或者说是 即时编译（JIT）

### 2.3. 弱类型

- 支持隐式类型转换，可以灵活使用不同的数据类型

### 2.4. 单线程

- JavaScript 本上是单线程的，但通过**事件循环机制**可以处理异步任务

### 2.5. 跨平台

- JavaScript 可以在多种环境下运行，最常见的是浏览器环境和 Node.js 环境。
- 特别容易集成
	- 比如很多低代码平台内置 js 引擎方便扩展
	- 又比如 postman，自动化脚本等等也内置了 js 引擎

## 3. JavaScript 的应用场景

### 3.1. Web前端开发

- **DOM操作**：
	- 控制和操作网页内容
- **事件处理**：
	- 响应用户操作（如点击、输入）
- **AJAX**：
	- 实现异步数据请求和更新
- **动态样式**：
	- 通过操作 CSS 打造动态效果

### 3.2. 服务端开发

- **Node.js**：基于 Chrome V8 引擎构建，支持服务器端开发。
- **Express、Koa**：常用的服务器框。
- **数据库操作**：
	- 如与 MongoDB、MySQL 的交互。
	- ORM

### 3.3. 全栈开发

- **MEAN/MERN 栈**：
	- MongoDB, Express, Angular/React, Node.js。
		- **很早以前还用过**
- 基于 React 和 Vue.js 的服务端渲染框架: 
	- Next.js 和 Nuxt.js。

### 3.4. 移动应用开发

- **React Native**：
	- 使用 JavaScript 构建原生移动应用。
- **Ionic、PhoneGap/Cordova**：
	- 建跨平台移动应用。

### 3.5. 桌面应用开发

- **Electron、NW.js**：
	- 使用 Web 技术构建跨平台桌面应用。

### 3.6. 游戏开发

- **Three.js**：创建3D图形动画。
- **Phaser**：2D 游戏框架。

### 3.7. 数据可视化

- **D3.js、Chart.js、Highcharts**：用于高级数据可视化和图表创建。

### 3.8. 机器学习人工智能

- **TensorFlow.js、Brain.js**：让机器学习和神经网络在浏览器中运行。
- MD5.js

### 3.9. 物联网 (IoT)

- **Johnny-Five、Espruino**：用于智能设备和嵌式开发。

### 3.10. 自动化和脚本

- **Gulp、Grunt**：任务自动化工具。
- **ShellJS**：执行系统命令和脚本编写。

## 4. JavaScript 的重要概念和机制

### 4.1. 原型和原型链

- JavaScript 使用原型继承，即对象之间通过原型链形成继承关系。

### 4.2. 闭包

- 闭包是一个函数能记住并访问它的词法域，即使在函数在其词法作用域外执行。

### 4.3. 事件循环

- 事件循环是 JavaScript 处理异步操作的机制，检测**调用栈**是否为空，并从**任务队列中取任务执行**

### 4.4. 异步编程

- **回调函数**：
	- 基本的异步处理方式，但会导致“回调地狱”。
- **Promise**：
	- 链式解决异步调用，避免回调地狱。
- **async/await**：
	- Promise 的语法糖，让异步代码看起来像同步代码。

### 4.5. this 关键字

- `this` 在**不同的上下文中有不同的指向**。比如，
	- 函数调用中的 `this` 指向局对象
	- 用 `new` 调用构造函数时，`this` 指向新创建的对象。

### 4.6. 模块化

- ES6 提供了原生的模块化支持 (`import` 和 `export`)。
- 之前解决方案包括 `CommonJS` (Node.js 使用的模块系统) 和 AMD (异步模块定义)。

## 5. JavaScript 的生态系统

- **库和框架**：
	- 如 React、Vue.js、Angular、jQuery 等。
- **包管理**：
	- npm (Node Package Manager)、Yarn 等。
	- pnpm
- **构建工具**：
	- Webpack、Parcel、Gulp、Grunt 等。
	- rspack 
- **测试工具**：
	- Jest、Mocha、Chai、Cypress 等。
- **版本控制：Babel，支持将新的 JavaScript 语法转换为旧的语法，以便在不支持的环境中运行。

## 6. JavaScript 的局限性

- 单线程模型在进行 **CPU 密集型**任务时效率较低。
- **隐式类型转换**可能导致一些预期之外的行为。
- **动态类型**系统可能在大型项目中引入类型相关的缺陷。
