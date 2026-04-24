# 浏览器的宏任务（MacroTask）的优先级

`#bom` `#浏览器` 

## 1. 宏任务优先级从高到低排序

```javascript
// 优先级从高到低
1. 用户交互事件（User Interaction）
   - 点击（click）
   - 输入（input）
   - 键盘事件（keyboard）
   - 触摸事件（touch）

2. 网络请求回调（Network）
   - fetch 回调
   - XMLHttpRequest 回调

3. 页面渲染事件（Rendering）
   - requestAnimationFrame
   - IntersectionObserver

4. setTimeout/setInterval
   - setTimeout(fn, 0) 实际最小延迟 4ms
   - setInterval 的回调

5. setImmediate（Node.js 环境）

6. MessageChannel

7. I/O 事件
   - 文件操作
   - IndexedDB
```

## 2. 具体示例

```javascript
// 1. 用户点击事件优先级最高
button.addEventListener('click', () => {
    console.log('Click event');
});

// 2. 网络请求
fetch('/api/data').then(() => {
    console.log('Fetch callback');
});

// 3. 渲染
requestAnimationFrame(() => {
    console.log('Animation frame');
});

// 4. 定时器（较低优先级）
setTimeout(() => {
    console.log('Timeout');
}, 0);
```

## 3. 优先级影响因素

### 3.1. **任务类型**：

```javascript
// 用户交互类型的任务优先级最高
element.addEventListener('click', () => {
    // 高优先级
    console.log('User interaction');
});

setTimeout(() => {
    // 低优先级
    console.log('Timer');
}, 0);
```

### 3.2. **浏览器调度策略**：

```javascript
// 示例：页面性能优化
// 高优先级任务
document.addEventListener('click', () => {
    // 用户交互立即响应
    updateUI();
});

// 低优先级任务
setTimeout(() => {
    // 非关键操作延后执行
    analytics.send();
}, 0);
```

## 4. 实际应用场景

### 4.1. **性能优化**：

```javascript
// 高优先级任务：关键渲染
requestAnimationFrame(() => {
    updateCriticalUI();
});

// 低优先级任务：数据统计
setTimeout(() => {
    sendAnalytics();
}, 0);
```

### 4.2. **用户体验优化**：

```javascript
// 即时响应用户输入
input.addEventListener('input', (e) => {
    // 立即更新UI反馈
    updateSearchResults(e.target.value);
});

// 延迟处理非关键任务
setTimeout(() => {
    // 缓存搜索结果
    cacheResults();
}, 100);
```

### 4.3. **资源加载优化**：

```javascript
// 优先加载关键资源
fetch('/critical-data.json')
    .then(handleCriticalData);

// 延迟加载非关键资源
setTimeout(() => {
    fetch('/non-critical-data.json')
        .then(handleNonCriticalData);
}, 1000);
```

## 5. 注意事项

### 5.1. **定时器延迟**

```javascript
// 最小延迟 4ms
setTimeout(() => {
    console.log('Delayed');
}, 0);  // 实际至少 4ms 后执行
```

### 5.2. **优先级保证**

```javascript
// 高优先级任务不应被低优先级任务阻塞
button.addEventListener('click', () => {
    // 重要的用户响应
    updateUI();
    
    // 非关键任务延后处理
    setTimeout(nonCriticalTask, 0);
});
```

### 5.3. **避免优先级反转**

```javascript
// 不好的做法
setTimeout(() => {
    // 关键任务不应放在低优先级队列
    criticalTask();
}, 0);

// 好的做法
requestAnimationFrame(() => {
    criticalTask();
});
```

## 6. 最佳实践

### 6.1. **任务分类**

```javascript
// 关键任务：用户交互、UI更新
function criticalTask() {
    // 直接执行
}

// 非关键任务：日志、统计
function nonCriticalTask() {
    setTimeout(() => {
        // 延迟执行
    }, 0);
}
```

### 6.2. **优先级管理**：

```javascript
class TaskScheduler {
    static high(task) {
        requestAnimationFrame(task);
    }
    
    static low(task) {
        setTimeout(task, 0);
    }
}
```
