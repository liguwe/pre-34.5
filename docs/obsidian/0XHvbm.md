# 如何检测页面是否在前台运行

`#bom` 

>  检测页面的可见性

## 1. 首先说说为什么需要检测

页面被`最小化`或`隐藏`或者在`后台运行`时
- 那么`轮询服务器`或`更新动画`等动作就不必要了。

## 2. 常见的几种方法

1、document.hidden 只读属性

2、document.visibilityState 检测页面可见性，返回只读属性

3、`visibilitychange` 事件

4、`window.addEventListener()`方法监听 `blur` 和 `focus` 事件来检测页面是否在前台或后台。
- 当**页面**失去焦点时触发 `blur` 事件
- 而当**页面**重新获得焦点时触发 `focus` 事件。亲测可以

5、`document.hasFocus()` 检测页面是否在前台，即是否获得焦点

6、一些页面生命周期的方法也可以

- `pagehide`
- `beforeunload`
- `unload` 
- `pageshow`

## 3. 总结

整体可以分为两类 

- document上的`属性值`或者`具体方法` 
- 监听特定事件

> 另外需要关注兼容性
