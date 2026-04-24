# 微前端原理（篇三：乾坤）

`#微前端` 

## 1. 总结

- 核心能力
	1. 应用加载（HTML Entry）
	2. JavaScript 沙箱
	3. 样式隔离
	4. 生命周期管理
	5. 应用通信
- 应用加载（HTML Entry）
	- 获取 HTML 内容
	- 解析 HTML，提取资源
	- 加载外部脚本和样式
	- 渲染应用
- 生命周期管理
	1. bootstrap：应用首次加载时调用
	2. mount：应用激活时调用
	3. unmount：应用切换/卸载时调用
	4. update：应用更新时调用
- 通讯方式
	1. Props：简单直接，适合**父子通信**
	2. 全局状态：功能完整，适合复杂场景
	3. 自定义事件：灵活，但需要自行管理 
- 样式隔离
	- strictStyleIsolation：使用 Shadow DOM ：严格隔离
		- 隔离更彻底，但兼容性问题多
	- experimentalStyleIsolation：特定前缀
		- 兼容性更好，但隔离不够彻底
- 性能优化策略
	1. 应用预加载
	2. 资源**缓存复用**：缓存检测
	3. **并行**加载优化
	4. 按需加载策略
- 错误处理机制
	1. 应用加载错误
	2. 运行时错误
	3. 生命周期错误
	4. 资源加载错误 

## 2. 整体架构

乾坤基于 single-spa 封装，实现了以下核心功能：

```javascript hl:7,5
// 主应用注册微应用
registerMicroApps([
  {
    name: 'app1',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app1'
  }
]);

// 启动主应用
start();
```

核心功能模块：
1. 应用加载（HTML Entry）
2. JavaScript 沙箱
3. 样式隔离
4. 生命周期管理
5. 应用通信 

## 3. 应用加载机制（HTML Entry）

乾坤使用 HTML Entry 方式加载应用，主要步骤：
- 获取 HTML 内容
- 解析 HTML，提取资源
- 加载外部脚本和样式
- 渲染应用

```javascript hl:10
async function loadApp(app) {
  // 1. 获取 HTML 内容
  const html = await fetch(app.entry).then(res => res.text());
  
  // 2. 解析 HTML，提取资源
  const { 
    template,    // DOM 结构
    scripts,     // JS 脚本
    styles      // CSS 样式
  } = parseHTML(html);
  
  // 3. 加载外部脚本和样式
  await Promise.all([
    loadScripts(scripts),
    loadStyles(styles)
  ]);
  
  // 4. 渲染应用
  const container = document.querySelector(app.container);
  container.innerHTML = template;
}
```

## 4. 生命周期管理

乾坤为每个微应用定义了完整的生命周期：

```javascript
// 微应用需要导出以下生命周期函数
export async function bootstrap() {
  // 应用初始化
}

export async function mount(props) {
  // 应用挂载
  render(props);
}

export async function unmount() {
  // 应用卸载
  cleanup();
}

// 可选
export async function update(props) {
  // 应用更新
}
```

生命周期执行流程：
1. bootstrap：应用首次加载时调用
2. mount：应用激活时调用
3. unmount：应用切换/卸载时调用
4. update：应用更新时调用

## 5. 路由系统

乾坤的路由系统基于 URL 改变触发应用切换：
- 支持配置式路由
- 支持函数动态判断
- 自动处理应用切换 

```javascript
class RouterEngine {
  constructor(apps) {
    this.apps = apps;
    window.addEventListener('popstate', this.handleRouteChange);
  }
  
  handleRouteChange = () => {
    const { pathname } = window.location;
    // 查找匹配的应用
    const app = this.apps.find(app => {
      return this.isActive(app.activeRule, pathname);
    });
    
    if (app) {
      // 加载并挂载应用
      this.mountApp(app);
    }
  }
  
  isActive(rule, pathname) {
    // 支持字符串或函数规则
    return typeof rule === 'function' 
      ? rule(pathname)
      : pathname.startsWith(rule);
  }
}
```

## 6. 应用通信机制

乾坤提供多种应用通信方式：

```javascript
// 1. Props 传递
registerMicroApps([{
  name: 'app1',
  props: { data: 'shared data' }
}]);

// 2. 全局状态管理
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({
  user: 'qiankun'
});

// 主应用监听
actions.onGlobalStateChange((state, prev) => {
  console.log(state, prev);
});

// 子应用监听
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    console.log(state, prev);
  });
}

// 3. 自定义事件
window.addEventListener('app1-event', () => {});
```

### 6.1. 通信方式比较

1. Props：简单直接，适合父子通信
2. 全局状态：功能完整，适合复杂场景
3. 自定义事件：灵活，但需要自行管理 

## 7. 样式隔离

乾坤提供两种样式隔离方案：
- 使用 Shadow DOM ：严格隔离
- experimentalStyleIsolation：特定前缀

```javascript
// 1. 严格隔离：使用 Shadow DOM
registerMicroApps([{
  name: 'app1',
  sandbox: {
    strictStyleIsolation: true // 使用 Shadow DOM
  }
}]);

// 2. 作用域隔离：添加特定前缀
registerMicroApps([{
  name: 'app1',
  sandbox: {
    experimentalStyleIsolation: true // 添加特定前缀
  }
}]);
```

## 8. qiankun 中这两种样式隔离方式的区别和各自的问题：

### 8.1. strictStyleIsolation（严格隔离）

这种方式使用 Shadow DOM 实现样式隔离：

```javascript
// qiankun 内部实现原理
function createShadowDOM(container) {
  return container.attachShadow({ mode: 'open' });
}

// 子应用挂载
const shadowRoot = createShadowDOM(container);
shadowRoot.appendChild(subAppRoot);
```

#### 8.1.1. 存在的问题：

1. **第三方组件库兼容性问题**
```javascript
// 某些组件库会在 document.body 上挂载元素
// 比如 antd 的 Modal、Drawer、Message 等
const Modal = () => {
  // 这些组件会被挂载到 body 上
  // 而不是 Shadow DOM 内部，导致样式失效
  return ReactDOM.createPortal(
    <div className="ant-modal">...</div>,
    document.body
  );
};
```

2. **弹窗层级问题**
```css
/* Shadow DOM 内部的元素 z-index 无法超过 Shadow DOM 的边界 */
.modal {
  z-index: 9999; /* 在 Shadow DOM 中不会生效 */
}
```

3. **一些特殊 CSS 特性的限制**
```css
/* 例如 position: fixed 相对于 Shadow DOM 根节点定位，而不是 viewport */
.fixed-element {
  position: fixed;
  top: 0;
  /* 会相对于 Shadow DOM 定位，而不是浏览器窗口 */
}
```

### 8.2. experimentalStyleIsolation（实验性隔离）

这种方式通过给样式添加前缀选择器来实现隔离：

```javascript
// 原始样式
.title { color: red; }

// 转换后
div[data-qiankun="app1"] .title { color: red; }
```

#### 8.2.1. 工作原理：

```javascript
// qiankun 内部实现示意
function processCSSRule(rule, appName) {
  const prefix = `[data-qiankun="${appName}"]`;
  
  // 处理选择器
  if (rule.selectorText) {
    rule.selectorText = rule.selectorText
      .split(',')
      .map(selector => `${prefix} ${selector}`)
      .join(',');
  }
}
```

#### 8.2.2. 优点：

1. **更好的兼容性**
```javascript
// 弹窗组件可以正常工作
const Modal = () => {
  return ReactDOM.createPortal(
    <div className="modal">...</div>,
    document.body
  );
};
```

2. **支持完整的 CSS 特性**
```css
/* position: fixed 可以正常工作 */
.fixed-element {
  position: fixed;
  top: 0;
  /* 会相对于视口定位 */
}
```

#### 8.2.3. 但也存在一些问题：

1. **动态生成的样式可能逃逸**
```javascript
// 动态插入的样式可能没有被正确处理
const style = document.createElement('style');
style.textContent = '.dynamic { color: blue; }';
document.head.appendChild(style);
```

2. **性能开销**
```javascript
// 需要实时处理样式规则
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // 处理新增的样式节点
    processNewStyleNodes(mutation.addedNodes);
  });
});
```

### 8.3. 最佳实践建议

#### 8.3.1. 选择建议

```javascript
// 1. 如果应用比较简单，推荐使用 experimentalStyleIsolation
{
  name: 'app1',
  entry: '//localhost:8081',
  container: '#container',
  props: {
    experimentalStyleIsolation: true
  }
}

// 2. 如果需要完全隔离且不依赖第三方组件库，可以使用 strictStyleIsolation
{
  name: 'app2',
  entry: '//localhost:8082',
  container: '#container',
  props: {
    strictStyleIsolation: true
  }
}
```

#### 8.3.2. 混合使用策略

```javascript
// 可以针对不同子应用采用不同的隔离策略
const apps = [
  {
    name: 'simple-app',
    // 简单应用使用实验性隔离
    props: { experimentalStyleIsolation: true }
  },
  {
    name: 'complex-app',
    // 复杂应用使用自定义隔离方案
    props: {
      sandbox: {
        experimentalStyleIsolation: true,
        // 添加额外的样式处理
        stylePatching: (styles, appName) => {
          // 自定义样式处理逻辑
        }
      }
    }
  }
];
```

#### 8.3.3. 处理特殊场景

```javascript
// 对于需要全局生效的样式，可以在主应用中设置
const globalStyles = `
  /* 这些样式将对所有应用生效 */
  :root {
    --primary-color: `#1890ff;`
  }
  
  /* 弹窗层级管理 */
  .global-modal {
    z-index: 1000;
  }
`;

// 在主应用中注入
const style = document.createElement('style');
style.textContent = globalStyles;
document.head.appendChild(style);
```

### 8.4. 总结：

- `strictStyleIsolation` 隔离更彻底，但兼容性问题多
- `experimentalStyleIsolation` 兼容性更好，但隔离不够彻底
- 建议根据应用场景选择合适的方案，或混合使用
- 对于复杂场景，可能需要自定义隔离方案

### 8.5. 实现原理：

#### 8.5.1. Shadow DOM 隔离：

```javascript
class ShadowDOM {
  constructor(app) {
    const container = document.querySelector(app.container);
    this.shadow = container.attachShadow({ mode: 'closed' });
  }
  
  mount(html) {
    this.shadow.innerHTML = html;
  }
}
```

#### 8.5.2. 作用域隔离：

```javascript
function scopedCSS(styleSheet, appName) {
  const prefix = `[data-qiankun="${appName}"]`;
  return styleSheet.replace(/([^}{]*){/g, (match, selector) => {
    return `${prefix} ${selector} {`;
  });
}
```

## 9. 性能优化

乾坤采用多种优化策略：

```javascript
// 1. 预加载
prefetchApps([
  { name: 'app1', entry: '//localhost:8080' }
]);

// 2. 资源缓存
const cache = new Map();
async function loadWithCache(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const resource = await fetch(url);
  cache.set(url, resource);
  return resource;
}

// 3. 并行加载
async function loadResources(resources) {
  return Promise.all(
    resources.map(url => loadWithCache(url))
  );
}
```

优化要点：
1. 应用预加载
2. 资源缓存复用
3. 并行加载优化
4. 按需加载策略

## 10. 错误处理

乾坤提供完整的错误处理机制：

```javascript
registerMicroApps([{
  name: 'app1',
  entry: '//localhost:8080',
  loader: (loading) => render(loading),
  errorBoundary: (error) => {
    // 渲染错误页面
    renderError(error);
    // 上报错误
    reportError(error);
  }
}]);

// 全局错误监听
addGlobalUncaughtErrorHandler((event) => {
  console.log(event);
  // 处理全局未捕获错误
});
```

错误处理策略：
1. 应用加载错误
2. 运行时错误
3. 生命周期错误
4. 资源加载错误 

## 11. 弹框问题常见解决方案：

### 11.1. 常见弹框问题

1. **样式丢失问题**
	- 当弹框设置了`append-to-body`时，会脱离子应用的样式作用域
	- 弹框被插入到主应用的 body 下，导致样式失效
	- 特别是在使用Element UI 等组件库的Dialog组件时最为常见 
2. **定位偏移问题**
	- 使用fixed定位的弹框可能出现位置偏移
	- 依赖popper.js的组件（如Select下拉框）在弹框中位置错误 

### 11.2. 解决方案

#### 11.2.1. 样式隔离方案

```javascript
// 方案一：重写append方法
const originAppend = HTMLElement.prototype.append;
HTMLElement.prototype.append = function(...args) {
  // 如果是弹窗元素，则添加特定的类名
  if (args[0]?.classList?.contains('el-dialog__wrapper')) {
    args[0].classList.add('子应用命名空间');
  }
  return originAppend.apply(this, args);
};
```

```css
/* 方案二：添加样式作用域 */
.子应用命名空间 {
  .el-dialog__wrapper {
    /* 弹框样式 */
  }
  .el-dialog {
    /* 弹框内容样式 */
  }
}
```

#### 11.2.2. 容器挂载方案

```javascript
// 方案三：指定挂载容器
// 在子应用中创建专门的弹框容器
const modalContainer = document.createElement('div');
modalContainer.id = 'modal-container';
document.body.appendChild(modalContainer);

// 弹框配置
{
  appendTo: '#modal-container'
}
```

#### 11.2.3. Element UI 弹框解决方案

```javascript
// 方案四：修改弹框配置
export default {
  mounted() {
    // 获取当前子应用的容器
    const container = document.querySelector('#子应用容器ID');
    
    this.$dialog = this.$createElement('el-dialog', {
      props: {
        // 禁用append-to-body
        appendToBody: false,
        // 指定挂载点
        modalAppendToBody: false
      }
    });
    
    // 手动挂载到子应用容器
    container.appendChild(this.$dialog.$el);
  }
}
```

#### 11.2.4. 全局样式处理

```javascript
// 方案五：全局样式处理
// 在主应用中
import { registerMicroApps } from 'qiankun';

registerMicroApps([
  {
    name: 'subApp',
    entry: '//localhost:8080',
    container: '#container',
    props: {
      sandbox: {
        // 开启严格样式隔离
        strictStyleIsolation: true,
        // 实验性样式隔离
        experimentalStyleIsolation: true
      }
    }
  }
]);
```

### 11.3. 最佳实践建议

1. **避免使用append-to-body**
```javascript
// 不推荐
<el-dialog append-to-body>

// 推荐
<el-dialog :append-to-body="false">
```

2. **使用动态挂载点**
```javascript
// 在子应用中创建动态挂载点
const createModalContainer = () => {
  const container = document.createElement('div');
  container.setAttribute('data-modal-container', '');
  return container;
};

// 在弹框组件中使用
{
  mounted() {
    this.modalContainer = createModalContainer();
    document.body.appendChild(this.modalContainer);
  },
  beforeDestroy() {
    this.modalContainer.remove();
  }
}
```

3. **样式作用域处理**
```scss
// 使用命名空间
.sub-app-namespace {
  // 弹框样式覆盖
  .el-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
  }
  
  // 遮罩层样式
  .el-dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
```

4. **位置修正**
```javascript
// 处理弹框位置偏移
const fixModalPosition = (modal) => {
  const { top, left } = modal.getBoundingClientRect();
  const offsetTop = window.innerHeight - top;
  const offsetLeft = window.innerWidth - left;
  
  modal.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
};
```

通过以上方案的组合使用，可以有效解决微前端中的弹框问题。建议根据具体场景选择合适的解决方案，并在开发中注意以下几点：

- 优先考虑不使用`append-to-body`
- 合理使用样式隔离机制
- 注意弹框的层级管理
- 保持子应用的独立性
