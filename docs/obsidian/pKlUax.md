# 跨端的核心技术点

`#跨端` 

## 1. 总结

- 前端需要干的三件事件
	- 获取数据
		- 卷不了，你不可能把网络实现一遍
	- 状态或数据管理 → `f(state,data)`
		- state 影响 Flutter 和 swiftUI
		- vdom
	- 页面渲染
		- 止于**宿主环境提供的渲染 API**
			- 比如浏览器
			- 客户端渲染 API
			- 自己实现的渲染能力：Flutter
- 跨端方案分析：
	- 网页：
		- 天生的跨端，奈何性能不好
	- 网页 Plus：bybird 方案
		-  **预热**：
			- 预加载
		- **缓存**：
			- H5 离线包
		- **劫持**：
			- Web 对**网络加载的控制力**比较弱，交给 Native 做
		- **替换控件**
			- 使用原生控件
	- 小程序：
		- 封闭 + 技术半衰期短
	- RN：
		- vdom + js 引擎 Hermes
	- Flutter：
		- 自己的渲染引擎
	- 但 RN 和 Flutter
		- 一旦做深了，前端 hold 不住的，需要专业的客户端原生能力

## 2. 前端本质只干三件事

- fetch data（数据获取）
	- HTTP1.x、HTTP2.0、HTTP3.0 、SSE、WS 等等
- manage state（状态管理）
	- pinia 、Redux 、Flux 等，进而影响 Flutter、SwiftUI 等
- render page（页面渲染）
	- HTML、CSS
	- Canvas
	- 音视频

## 3. 往三个方向的卷

- fetch data
	- 没法搞，你不能把网络协议实现一遍吧
- render page
	- 本质是计算机图形学，前端很难卷到底层（OpenGL、metal ...）
		- 所以这活**止于渲染引擎**
- manage state
	- 现在主流的做法再抽象一层`虚拟`的东西（虚拟机或虚拟 DOM）

所以，能卷的方向是：
- 渲染引擎
- 虚拟层

## 4. 网页：JS Engine + WebKit

天生的跨端

## 5. 网页 PLUS：JS Engine + WebKit + Native 能力

H5 容器化，hybidrd 方案

- JavaScript Bridge
	- **预热**：
		- 预加载
	- **缓存**：
		- H5 离线包
	- **劫持**：
		- Web 对**网络加载的控制力**比较弱，交给 Native 做
	- **替换控件**
		- 使用原生控件

## 6. 小程序：JS Engine + WebKit

- 本质上就是**阉割版的网页**
- 生态封闭
	- **技术半衰期短**

## 7. React Native：JS Engine + Native RenderPipeLine

- JavaScrip 引擎：
	- Hermes
- Vdom： 
	- 天然的跨端
- 一旦做深了
	- 要求原生能力，你得会安卓 和 IOS

## 8. Flutter: Dart VM + Flutter RnderPipeLine

- 更进一步，自己的渲染引擎

> 同样，一旦做深了，前端 hold 不住的，需要专业的客户端原生能力
