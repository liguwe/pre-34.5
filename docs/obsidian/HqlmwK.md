# Shadow dom 与 Web Component

`#bom` 

## 1. shadow dom

### 1.1. 两种 DOM

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-9.png)
所以，有两种 DOM，如下图：

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-10.png)

### 1.2. 定义

Shadow DOM 是 Web Components 标准的一个重要部分，它提供了一种封装和隔离 Web 组件的方法

### 1.3. 优势

- 样式隔离
- 性能优化，因为浏览器可以独立渲染更新他们
- 安全性：比如 `dom.attachShadow({mode: 'closed'})` ，外部 js 无法访问他们
- 封装性与可维护性

## 2. 聊聊 Web Component

> 它里面的，一些概念如`template` 与 `插槽slot` 影响如`Vue`类的框架

- `window.customElements.define()` 方法来自定义 `组件` ，下面是一个简单实现 `<user-card>`
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-11.png)
		- 要点 1：`<template id="userCardTemplate"/>`
		- 要点 2：定义 `window.customElements.define('user-card',UserCard)`
		- 要点 3：定义 `UserCard`

Web Components 的核心特性：
- 自定义元素：创建新的 HTML 标签
- Shadow DOM：封装组件的内部结构和样式
- HTML 模板：定义组件的结构

### 2.1. 实现一个 custom-counter 

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-13.png)

```html hl:17,15,36,34
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Custom Counter Web Component</title>
    </head>
    <body>
        <custom-counter></custom-counter>
        <script>
            class CustomCounter extends HTMLElement {
                constructor() {
                    super();
                    this.count = 0;
                    this.attachShadow({ mode: "open" });
                }
                // connectedCallback是Web Components 生命周期中的一个关键钩子函数。
                // 它是自定义元素规范定义的四个生命周期回调之一
                // 另外三个是：connectedCallback、disconnectedCallback 和 adoptedCallback
                // 当自定义元素被移除时，disconnectedCallback 会被调用
                // 当自定义元素首次被插入到文档的 DOM 中时，connectedCallback 会被自动调用
                // 通常在这里进行一些初始化的操作，比如创建 shadow DOM、添加事件监听器等
                connectedCallback() {
                    this.render();
                    this.shadowRoot
                        .querySelector("#increment")
                        .addEventListener("click", () => this.increment());
                    this.shadowRoot
                        .querySelector("#decrement")
                        .addEventListener("click", () => this.decrement());
                }

                render() {
                    this.shadowRoot.innerHTML = `
					  <style>
						:host {
						  display: block;
						  font-family: Arial, sans-serif;
						  background-color: `#f0f0f0;`
						  padding: 20px;
						  border-radius: 5px;
						}
						`#counter` {
						  font-size: 24px;
						  margin-bottom: 10px;
						}
						button {
						  font-size: 16px;
						  margin: 0 5px;
						  padding: 5px 10px;
						  cursor: pointer;
						}
					  </style>
					  <div id="counter">Count: ${this.count}</div>
					  <button id="decrement">-</button>
					  <button id="increment">+</button>
					`;
                }

                increment() {
                    this.count++;
                    this.updateCounter();
                }

                decrement() {
                    this.count--;
                    this.updateCounter();
                }

                updateCounter() {
                    this.shadowRoot.querySelector("#counter").textContent =
                        `Count: ${this.count}`;
                }
            }

            customElements.define("custom-counter", CustomCounter);
        </script>
    </body>
</html>

```

## 3. Web Components 定义组件样式时，`:host`的作用是？

`":host" 选择器`用于选择自定义元素本身，即**组件的根元素**

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-12.png)
