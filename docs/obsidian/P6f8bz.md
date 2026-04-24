# 时光机（录制与回放）的技术原理

`#前端埋点` 

## 总结

- 记录用户在页面上的**所有行为和页面状态变化**
	- 快照 + 增量
		- 记录**页面初始状态**和**后续变化**
	- 操作行为序列化
		- 记录用户的所有交互行为
	- 时间轴
		- 按时间顺序存储所有事件
	- 回放：
		- 回放时**重建DOM树** 和 **用户操作**
- 关键点
	- ① DOM 变更记录：MutationObserver API
	- ② 用户交互记录：**监听所有的事件，并记录下来**
		- 鼠标事件
		- 键盘事件
		- 表单事件
		- 滚动事件
	- ③ 页面状态记录：视口变化、历史记录等等
		- resize
		- popstate
	- ④ 回放功能
		- 回放控制器&播放器
		- 重建
- 特殊情况
	-  iframe处理
	- 异步资源加载
		- 处理动态加载的资源，监听资源加载
			- 使用 `new PerformanceObserver`
- 安全性考虑
	- 敏感信息过滤
	- 密码输入框处理
	- 优化产品体验
- 性能优化
	- 数据压缩与存储
		- 使用 IndexedDB 存储记录
	- 批量处理
	- 使用 `Web Workers` 处理数据压缩和解压
	- 实现增量更新机制
	- 使用 `RequestAnimationFrame` 控制动画
	- **及时释放**不需要的资源
		- 定期清理不需要的记录

## 1. 基本原理

时光机（Session Replay）的核心是**记录用户在页面上的所有行为和页面状态变化**

- **快照 + 增量快照**：
	- 记录页面初始状态和后续变化
- **操作指令序列化**：
	- 记录用户的所有交互行为
- **时间轴管理**：
	- 按时间顺序存储所有事件
- **状态重建**：
	- 在回放时**重建DOM树** 和 **用户操作**

## 2. 录制功能实现

### 2.1. DOM 变更记录： `MutationObserver API`

```javascript hl:10,3
class DOMRecorder {
  constructor() {
    this.records = [];
    this.startTime = Date.now();
    this.initObservers();
  }

  initObservers() {
    // 监听 DOM 变化
    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => this.handleMutation(mutation));
    });

    // 配置观察选项
    const config = {
      attributes: true,        // 监听属性变化
      childList: true,        // 监听子节点增删
      subtree: true,          // 监听所有后代节点
      characterData: true,    // 监听文本内容变化
      attributeOldValue: true // 记录属性旧值
    };

    // 开始观察
    this.mutationObserver.observe(document.documentElement, config);
  }

  handleMutation(mutation) {
    const record = {
      type: 'mutation',
      timestamp: Date.now() - this.startTime,
      target: this.getNodePath(mutation.target),
      mutationType: mutation.type
    };

    switch (mutation.type) {
      case 'attributes':
        record.attributeName = mutation.attributeName;
        record.oldValue = mutation.oldValue;
        record.newValue = mutation.target.getAttribute(mutation.attributeName);
        break;
      
      case 'characterData':
        record.oldValue = mutation.oldValue;
        record.newValue = mutation.target.textContent;
        break;
      
      case 'childList':
        record.addedNodes = Array.from(mutation.addedNodes).map(node => 
          this.serializeNode(node)
        );
        record.removedNodes = Array.from(mutation.removedNodes).map(node => 
          this.serializeNode(node)
        );
        break;
    }

    this.records.push(record);
  }

  // 获取节点的唯一路径
  getNodePath(node) {
    const path = [];
    let current = node;

    while (current && current !== document.documentElement) {
      const parent = current.parentNode;
      if (!parent) break;

      const children = Array.from(parent.children);
      const index = children.indexOf(current);
      path.unshift(index);
      current = parent;
    }

    return path;
  }
}
```

### 2.2. 用户交互记录：监听所有的事件，并记录下来

数据结构示例：

```javascript
const record = {
      type: 'mouse',
      eventType: event.type,
      timestamp: Date.now() - this.startTime,
      x: event.clientX,
      y: event.clientY,
      target: this.getNodePath(event.target)
    };
```

代码部分：

```javascript
class InteractionRecorder {
  constructor() {
    this.records = [];
    this.startTime = Date.now();
    this.initEventListeners();
  }

  initEventListeners() {
    // 鼠标事件
    const mouseEvents = ['click', 'mousedown', 'mouseup', 'mousemove'];
    mouseEvents.forEach(eventType => {
      document.addEventListener(eventType, this.handleMouseEvent.bind(this), true);
    });

    // 键盘事件
    const keyboardEvents = ['keydown', 'keyup'];
    keyboardEvents.forEach(eventType => {
      document.addEventListener(eventType, this.handleKeyboardEvent.bind(this), true);
    });

    // 表单事件
    const formEvents = ['input', 'change', 'focus', 'blur'];
    formEvents.forEach(eventType => {
      document.addEventListener(eventType, this.handleFormEvent.bind(this), true);
    });

    // 滚动事件
    window.addEventListener('scroll', 
      this.throttle(this.handleScroll.bind(this), 100), 
      true
    );
  }

  handleMouseEvent(event) {
    const record = {
      type: 'mouse',
      eventType: event.type,
      timestamp: Date.now() - this.startTime,
      x: event.clientX,
      y: event.clientY,
      target: this.getNodePath(event.target)
    };

    if (event.type === 'click') {
      record.button = event.button;
    }

    this.records.push(record);
  }

  handleFormEvent(event) {
    const record = {
      type: 'form',
      eventType: event.type,
      timestamp: Date.now() - this.startTime,
      target: this.getNodePath(event.target)
    };

    if (event.type === 'input' || event.type === 'change') {
      record.value = event.target.value;
      if (event.target.type === 'checkbox' || event.target.type === 'radio') {
        record.checked = event.target.checked;
      }
    }

    this.records.push(record);
  }

  // 节流函数
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}
```

### 2.3. 页面状态记录：视口变化、历史记录等等

```javascript
class StateRecorder {
  constructor() {
    this.records = [];
    this.startTime = Date.now();
    this.initStateTracking();
  }

  initStateTracking() {
    // 记录初始状态
    this.recordInitialState();

    // 监听视口变化
    window.addEventListener('resize', 
      this.throttle(this.handleResize.bind(this), 100)
    );

    // 监听历史记录变化
    window.addEventListener('popstate', 
      this.handleHistoryChange.bind(this)
    );
  }

  recordInitialState() {
    const record = {
      type: 'initial_state',
      timestamp: 0,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scroll: {
        x: window.pageXOffset,
        y: window.pageYOffset
      },
      url: window.location.href
    };

    this.records.push(record);
  }

  handleResize() {
    const record = {
      type: 'viewport',
      timestamp: Date.now() - this.startTime,
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.records.push(record);
  }
}
```

## 3. 回放功能实现

### 3.1. 回放控制器

```javascript
class ReplayController {
  constructor(records) {
    this.records = this.preprocessRecords(records);
    this.currentTime = 0;
    this.speed = 1;
    this.isPlaying = false;
    this.initReplayEnvironment();
  }

  preprocessRecords(records) {
    // 按时间戳排序
    return records.sort((a, b) => a.timestamp - b.timestamp);
  }

  initReplayEnvironment() {
    // 创建回放容器
    this.container = document.createElement('div');
    this.container.className = 'replay-container';
    document.body.appendChild(this.container);

    // 创建虚拟DOM
    this.virtualDOM = document.createElement('iframe');
    this.container.appendChild(this.virtualDOM);

    // 初始化控制器
    this.createControls();
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startTime = Date.now() - this.currentTime;
    this.playLoop();
  }

  pause() {
    this.isPlaying = false;
  }

  playLoop() {
    if (!this.isPlaying) return;

    const currentTime = (Date.now() - this.startTime) * this.speed;
    const pendingRecords = this.records.filter(record => 
      record.timestamp > this.currentTime && 
      record.timestamp <= currentTime
    );

    pendingRecords.forEach(record => {
      this.applyRecord(record);
    });

    this.currentTime = currentTime;

    if (this.currentTime < this.records[this.records.length - 1].timestamp) {
      requestAnimationFrame(() => this.playLoop());
    } else {
      this.isPlaying = false;
    }
  }
}
```

### 3.2. 记录应用器

```javascript
class RecordApplier {
  constructor(virtualDOM) {
    this.virtualDOM = virtualDOM;
  }

  applyRecord(record) {
    switch (record.type) {
      case 'mutation':
        this.applyMutation(record);
        break;
      case 'mouse':
        this.applyMouseEvent(record);
        break;
      case 'form':
        this.applyFormEvent(record);
        break;
      case 'viewport':
        this.applyViewportChange(record);
        break;
    }
  }

  applyMutation(record) {
    const target = this.getNodeByPath(record.target);
    if (!target) return;

    switch (record.mutationType) {
      case 'attributes':
        if (record.newValue === null) {
          target.removeAttribute(record.attributeName);
        } else {
          target.setAttribute(record.attributeName, record.newValue);
        }
        break;

      case 'characterData':
        target.textContent = record.newValue;
        break;

      case 'childList':
        // 处理移除的节点
        record.removedNodes.forEach(nodeData => {
          const node = this.getNodeByPath(nodeData.path);
          if (node) node.remove();
        });

        // 处理添加的节点
        record.addedNodes.forEach(nodeData => {
          const node = this.deserializeNode(nodeData);
          const parent = this.getNodeByPath(record.target);
          if (parent) parent.appendChild(node);
        });
        break;
    }
  }

  // 根据路径获取节点
  getNodeByPath(path) {
    let node = this.virtualDOM.contentDocument.documentElement;
    for (const index of path) {
      node = node.children[index];
      if (!node) return null;
    }
    return node;
  }
}
```

### 3.3. 鼠标轨迹重现：事件重放

```javascript
class MouseTracker {
  constructor(container) {
    this.container = container;
    this.cursor = this.createCursor();
  }

  createCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'replay-cursor';
    cursor.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: rgba(255, 0, 0, 0.5);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
    `;
    this.container.appendChild(cursor);
    return cursor;
  }

  moveCursor(x, y) {
    this.cursor.style.left = `${x}px`;
    this.cursor.style.top = `${y}px`;
  }

  showClick() {
    const click = document.createElement('div');
    click.className = 'replay-click';
    click.style.cssText = `
      position: absolute;
      left: ${this.cursor.style.left};
      top: ${this.cursor.style.top};
      width: 20px;
      height: 20px;
      border: 2px solid red;
      border-radius: 50%;
      animation: click-animation 0.5s ease-out;
      pointer-events: none;
    `;
    this.container.appendChild(click);
    setTimeout(() => click.remove(), 500);
  }
}
```

## 4. 性能优化

### 4.1. 数据压缩与存储

```javascript
class RecordCompressor {
  compress(records) {
    // 使用相对时间戳
    let lastTimestamp = 0;
    return records.map(record => {
      const compressed = {...record};
      
      // 转换为相对时间戳
      compressed.timestamp = record.timestamp - lastTimestamp;
      lastTimestamp = record.timestamp;

      // 压缩路径信息
      if (compressed.target) {
        compressed.target = this.compressPath(compressed.target);
      }

      return compressed;
    });
  }

  // 使用 IndexedDB 存储记录
  async saveToIndexedDB(records) {
    const db = await this.openDB();
    const transaction = db.transaction(['records'], 'readwrite');
    const store = transaction.objectStore('records');
    
    const compressedRecords = this.compress(records);
    await store.add({
      timestamp: Date.now(),
      records: compressedRecords
    });
  }
}
```

### 4.2. 批量处理

```javascript
class BatchProcessor {
  constructor() {
    this.batchSize = 50;
    this.processingQueue = [];
    this.isProcessing = false;
  }

  addToBatch(record) {
    this.processingQueue.push(record);
    
    if (this.processingQueue.length >= this.batchSize) {
      this.processBatch();
    }
  }

  async processBatch() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const batch = this.processingQueue.splice(0, this.batchSize);
    await this.processRecords(batch);

    this.isProcessing = false;
    
    if (this.processingQueue.length > 0) {
      this.processBatch();
    }
  }
}
```

## 5. 特殊场景处理

### 5.1. iframe处理

```javascript
// iframe内容录制
function recordIframe(iframe) {
  try {
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    // 记录iframe初始状态
    const snapshot = takeInitialSnapshot(iframeDoc);
    
    // 监听iframe内部变化
    const observer = new MutationObserver((mutations) => {
      // 处理iframe内部DOM变化
    });
    
    observer.observe(iframeDoc, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  } catch (error) {
    console.warn('Cannot access iframe content:', error);
  }
}
```

### 5.2. 异步资源加载

```javascript
// 处理动态加载的资源
function handleAsyncResources() {
  // 监听资源加载
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.entryType === 'resource') {
        recordResourceLoad({
          url: entry.name,
          type: entry.initiatorType,
          timestamp: entry.startTime
        });
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
}
```

## 6. 安全性考虑

```javascript
// 敏感信息过滤
function sanitizeData(node) {
  // 密码输入框处理
  if (node.type === 'password') {
    return {
      ...node,
      value: '********'
    };
  }

  // 敏感类名处理
  const sensitiveClasses = ['credit-card', 'ssn', 'password'];
  if (sensitiveClasses.some(cls => node.className?.includes(cls))) {
    return {
      ...node,
      textContent: '[REDACTED]'
    };
  }

  return node;
}
```

整个时光机的实现需要考虑以下关键点：
1. 确保录制的完整性和准确性
2. 优化数据存储和传输效率
3. 保证回放的流畅性和真实性
4. 处理好各种边界情况
5. 注意数据安全和隐私保护

这种实现方式可以帮助开发者：
- 复现用户操作场景
- 分析用户行为轨迹
- 诊断前端异常问题
- 优化产品体验

## 7. 注意事项与优化建议

- **性能优化**：
	- 使用 `Web Workers` 处理数据压缩和解压
	- 实现增量更新机制
	- 使用 `RequestAnimationFrame` 控制动画
	- **采样**
- **内存管理**：
	- 定期清理不需要的记录
	- 实现记录分片存储
	- **及时释放**不需要的资源
- **兼容性处理**：
	- 处理不同浏览器的事件差异
	- 适配各种 DOM 操作场景
	- **处理特殊元素（Canvas、WebGL等）**
- **安全性考虑**：
	- 实现敏感信息过滤
	- 添加用户隐私保护机制
	- 控制录制范围
- **错误处理**：
	- 实现优雅降级
	- 添加错误恢复机制
	- 提供调试信息
