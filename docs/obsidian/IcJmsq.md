# Chrome DevTools（篇二）

`#前端性能` 

> Chrome DevTools 技巧相关

## 1. 总结

- AI 辅助功能
- Console 面板技巧
	- console.groupEnd
	- console.table
- Performance 面板
	- 识别**长任务（Long Tasks）**
	- 查看 CPU 和内存使用情况
- 开发者工具扩展
	- Vue.js devtools
	- React Developer Tools
- Coverage 面板（未使用代码分析）
- Web Vitals 监控

## 2. AI 辅助功能

### 2.1. AI 助手面板

- 位置：
	- DevTools 右侧边栏中的 AI 图标
- 功能：
	- 代码分析和解释
	- 性能优化建议
	- CSS 样式问题诊断
	- JavaScript 代码优化建议
- 使用方法：选择代码或元素，AI 助手会自动分析并提供建议 

### 2.2. 智能代码补全

```javascript
// 在 Console 中输入代码时会提供智能提示
document.querySelector('.my-class').addEventListener('click', () => {
    // AI 会提供上下文相关的代码建议
})
```

## 3. Elements 面板高级技巧

### 3.1. DOM 断点

```javascript
// 右键点击元素，选择 "Break on..."
// - subtree modifications（子树修改）
// - attribute modifications（属性修改）
// - node removal（节点删除）
```

### 3.2. 样式调试

- 使用 `:hov` 强制元素状态
- 使用 `cls` 快速切换类名
- CSS Grid 和 Flexbox 调试工具
- CSS 选择器统计功能 
- 使用 `Computed` 查看计算后的样式
- 使用 `Layout` 查看**盒模型**
- CSS Grid 和 Flexbox 可视化工具

## 4. Console 面板技巧

### 4.1. 高级日志

```javascript
// 分组日志
console.group('用户操作');
console.log('点击按钮');
console.groupEnd();

// 表格展示
console.table([{name: 'John', age: 30}, {name: 'Jane', age: 25}]);

// 性能计时
console.time('操作耗时');
// ... 执行代码 ...
console.timeEnd('操作耗时');
```

### 4.2. Console 实用工具

- `$_` 获取上次表达式结果
- `$0-$4` 最近选择的 DOM 元素
- `monitor()` 函数调用监控
- `debug()` 函数断点调试 

## 5. Network 面板技巧

### 5.1. 请求分析

```javascript
// 使用过滤器
// Protocol: 'http', 'https'
// Domain: 'example.com'
// Method: 'POST', 'GET'
// Status: '200', '404'

// 过滤请求 
// 使用关键字过滤 
is:running // 仅显示正在进行的请求 
larger-than:100kb // 大于100kb的请求 
-main_frame // 排除主框架请求
```

### 5.2. 高级功能

- 请求阻止（Request blocking）
- 请求重放（Replay XHR）
- 带宽限制（Throttling）
	- CPU 也可以限流
- Early Hints 头部信息查看
- 使用 `Waterfall` 分析加载顺序
- 检查资源压缩状态
- 分析请求优先级
- 模拟不同网络条件

## 6. Performance 面板

### 6.1. 性能记录

```javascript
// 使用 Performance API
performance.mark('startTask');
// ... 执行任务 ...
performance.mark('endTask');
performance.measure('taskDuration', 'startTask', 'endTask');
```

### 6.2. 分析工具

- 火焰图分析
- 主线程活动
- 帧率监控
- 内存使用分析
- 识别**长任务（Long Tasks）**
- 分析帧率（FPS）
- 查看 CPU 和内存使用情况
- 分析事件监听器影响

## 7. Application 面板

### 7.1. 存储管理

```javascript
// 查看和管理
// - Local Storage
// - Session Storage
// - IndexedDB
// - Web SQL
// - Cookies
```

### 7.2. PWA 调试

- Service Worker 管理
- Manifest 查看
- Cache Storage 管理
- Background Services 监控 

## 8. 开发者工具扩展

- React Developer Tools
- Vue.js devtools
- Redux DevTools
- Apollo Client DevTools

## 9. 性能优化工具

### 9.1. Lighthouse

```javascript
// 在 DevTools 中运行 Lighthouse
// 1. 打开 Lighthouse 面板
// 2. 选择需要的审计类别
// 3. 生成报告
```

### 9.2. 性能监控

- Coverage 面板（未使用代码分析）
- Memory 面板（内存泄露分析）
- Performance Insights
- Web Vitals 监控

## 10. 调试技巧

### 10.1. 断点类型

```javascript
// 条件断点
// 右键点击行号 -> Add conditional breakpoint
if (someCondition) {
    debugger; // 手动断点
}
```

### 10.2. 高级调试

- 异步调用堆栈
- 黑盒脚本（Blackboxing）
- 源码映射（Source Maps）
- 实时表达式（Live Expressions）
