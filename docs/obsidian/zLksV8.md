# Shadow DOM 中的 closed mode 和 open mode

`#浏览器`

> 另可参考 [12.  Shadow dom 与 Web Component](/HqlmwK)


## 1. 基本概念

Shadow DOM 有两种模式：
- `open`：默认模式
- `closed`：封闭模式

创建方式：

```javascript
// open mode
element.attachShadow({ mode: 'open' });

// closed mode
element.attachShadow({ mode: 'closed' });
```

## 2. 主要区别

### 2.1. Open Mode（开放模式）

- 外部可以访问 `shadow root`
- 外部可以修改内容

```javascript
class OpenComponent extends HTMLElement {
  constructor() {
    super();
    // 创建 open shadow root
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<div>Open Shadow DOM</div>`;
  }
}
customElements.define('open-component', OpenComponent);

// 外部可以访问 shadow root
const element = document.querySelector('open-component');
console.log(element.shadowRoot); // 返回 ShadowRoot
element.shadowRoot.innerHTML = '<div>Modified</div>'; // 可以修改内容
```

### 2.2. Closed Mode（封闭模式）

- 外部无法访问 shadow root，无法从外部修改内容

```javascript
class ClosedComponent extends HTMLElement {
  constructor() {
    super();
    // 创建 closed shadow root
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.innerHTML = `<div>Closed Shadow DOM</div>`;
  }
}
customElements.define('closed-component', ClosedComponent);

// 外部无法访问 shadow root
const element = document.querySelector('closed-component');
console.log(element.shadowRoot); // 返回 null
// 无法从外部修改内容
```

## 3. 实际应用示例

### 3.1. 使用 Closed Mode 保护组件

```javascript
class ProtectedComponent extends HTMLElement {
  `#shadowRoot;` // 私有变量存储 shadow root 引用
  
  constructor() {
    super();
    // 存储 shadow root 引用
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    
    // 初始化组件
    this.#init();
  }
  
  `#init()` {
    this.#shadowRoot.innerHTML = `
      <style>
        .container { padding: 20px; }
        button { background: blue; color: white; }
      </style>
      <div class="container">
        <button>Click me</button>
      </div>
    `;
    
    // 添加事件监听器
    const button = this.#shadowRoot.querySelector('button');
    button.addEventListener('click', this.#handleClick.bind(this));
  }
  
  `#handleClick()` {
    // 私有方法处理点击事件
    console.log('Button clicked');
  }
  
  // 公共 API
  updateContent(text) {
    const button = this.#shadowRoot.querySelector('button');
    button.textContent = text;
  }
}

customElements.define('protected-component', ProtectedComponent);
```

## 4. 安全性对比

### 4.1. Open Mode

```javascript
// 外部可以：
// 1. 访问 shadow DOM
const openElement = document.querySelector('open-component');
const shadowContent = openElement.shadowRoot;

// 2. 修改样式
openElement.shadowRoot.querySelector('button').style.background = 'red';

// 3. 添加事件监听器
openElement.shadowRoot.querySelector('button')
  .addEventListener('click', () => {
    console.log('External listener');
  });
```

### 4.2. Closed Mode

```javascript
// 外部无法：
const closedElement = document.querySelector('closed-component');

// 1. 访问 shadow DOM
console.log(closedElement.shadowRoot); // null

// 2. 直接修改内部元素
// 这些操作都将失败
try {
  closedElement.shadowRoot.querySelector('button');
} catch(e) {
  console.log('Cannot access shadow DOM');
}
```

## 5. 使用建议

- **何时使用 Open Mode:**
	- 开发内部组件或可信环境
	- 需要外部访问和调试
	- 组件需要与其他组件交互
- **何时使用 Closed Mode:**
	- 开发第三方组件
	- 需要严格的封装
	- 防止外部干扰
	- 保护敏感功能

## 6. 注意事项

1. **Closed Mode 不是完全安全的**
```javascript
// 仍然可以通过一些方法获取 closed shadow root
const shadowRoot = Object.getOwnPropertySymbols(element)
  .map(s => element[s])
  .find(v => v instanceof ShadowRoot);
```

2. **最佳实践**
```javascript
class SecureComponent extends HTMLElement {
  `#shadowRoot;`
  `#state` = {
    sensitive: 'private data'
  };
  
  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'closed' });
    
    // 组合使用多种保护机制
    // 1. Closed mode
    // 2. 私有字段
    // 3. 封装的公共 API
    this.#initialize();
  }
  
  `#initialize()` {
    // 私有初始化逻辑
  }
  
  // 公共 API
  publicMethod() {
    // 受控的外部接口
  }
}
```

## 7. 总结

- `closed` mode 提供了更好的封装性，但不应该被视为完全的安全机制。
- 它更多是一种表明" **这是私有实现，请不要访问**"的设计意图声明。
	- 在实际应用中，通常需要结合其他技术（如私有字段、Symbol）来实现更完善的组件封装。
