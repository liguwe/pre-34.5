# PerformanceObserver API

`#前端性能` 

## 1. 总结

- new PerformanceObserver：
	- 以**异步**的方式监听性能度量事件，而**不会阻塞主线程**
-  CLS (Cumulative Layout Shift) 统计
	- 检测 layout-shift，**并且需要累加**
- 可自定义性能标记

## 2. PerformanceObserver 概述

- PerformanceObserver 是 Performance API 的一部分，用于观察和响应性能相关的事件。
	- 通过 PerformanceObserver，我们可以**全面监控网页性能，收集各种性能指标，为性能优化提供数据支持**。
- 允许我们**以异步的方式监听性能度量事件，而不会阻塞主线程**。

## 3. 基本使用方法

```javascript hl:13
// 创建性能观察器
const observer = new PerformanceObserver((list, observer) => {
    // 获取所有性能条目
    const entries = list.getEntries();
    
    entries.forEach(entry => {
        console.log('Performance Entry:', entry);
    });
});

// 开始观察特定类型的性能条目
observer.observe({
    entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift']
});
```

## 4. 可观察的性能指标类型

```javascript hl:8
// 常用的 entryTypes
const entryTypes = [
    'navigation',           // 导航计时
    'resource',            // 资源加载
    'paint',              // 绘制时间点
    'mark',               // 自定义性能标记
    'measure',            // 自定义性能测量
    'layout-shift',       // 布局偏移
    'largest-contentful-paint', // 最大内容绘制
    'first-input',        // 首次输入延迟
    'element'             // 元素计时
];
```

## 5. 实际应用示例

### 5.1. 监控页面加载性能

```javascript
const pageLoadObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    entries.forEach(entry => {
        // 导航计时数据
        if (entry.entryType === 'navigation') {
            console.log({
                DNS查询时间: entry.domainLookupEnd - entry.domainLookupStart,
                TCP连接时间: entry.connectEnd - entry.connectStart,
                页面加载总时间: entry.loadEventEnd - entry.startTime
            });
        }
    });
});

pageLoadObserver.observe({ entryTypes: ['navigation'] });
```

### 5.2. 监控资源加载

```javascript
const resourceObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
        // 资源加载详情
        console.log({
            资源名称: entry.name,
            资源类型: entry.initiatorType,
            加载时间: entry.duration,
            传输大小: entry.transferSize,
            开始时间: entry.startTime
        });
    });
});

resourceObserver.observe({ entryTypes: ['resource'] });
```

### 5.3. 监控 Core Web Vitals

```javascript hl:1,10
// LCP (Largest Contentful Paint) 监控
const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
});

lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

// CLS (Cumulative Layout Shift) 监控
let clsValue = 0;
const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
            clsValue += entry.value;
        }
    }
    console.log('Current CLS:', clsValue);
});

clsObserver.observe({ entryTypes: ['layout-shift'] });
```

## 6. 自定义性能标记

```javascript hl:6,1
// 创建自定义性能标记
performance.mark('customStart');

// 某些操作
setTimeout(() => {
    performance.mark('customEnd');
    
    // 测量两个标记之间的时间
    performance.measure('customOperation', 'customStart', 'customEnd');
    
    // 观察测量结果
    const measureObserver = new PerformanceObserver((list) => {
        const measures = list.getEntries();
        measures.forEach(measure => {
            console.log(`${measure.name} took ${measure.duration}ms`);
        });
    });
    
    measureObserver.observe({ entryTypes: ['measure'] });
}, 1000);
```

## 7. 错误处理和断开连接

```javascript
const observer = new PerformanceObserver((list, observer) => {
    try {
        const entries = list.getEntries();
        // 处理条目...
        
        // 可选：在特定条件下断开观察
        if (someCondition) {
            observer.disconnect();
        }
    } catch (error) {
        console.error('Performance observation error:', error);
    }
});

// 错误处理
try {
    observer.observe({ 
        entryTypes: ['paint'],
        buffered: true  // 获取缓冲的条目
    });
} catch (error) {
    console.error('Failed to start observer:', error);
}
```

## 8. 性能数据收集和分析

```javascript
// 创建性能数据收集器
class PerformanceCollector {
    constructor() {
        this.metrics = {
            navigation: [],
            resource: [],
            paint: []
        };
        
        this.initObservers();
    }
    
    initObservers() {
        // 导航性能
        new PerformanceObserver((list) => {
            this.metrics.navigation = list.getEntries();
            this.analyzeNavigation();
        }).observe({ entryTypes: ['navigation'] });
        
        // 资源性能
        new PerformanceObserver((list) => {
            this.metrics.resource = [...this.metrics.resource, ...list.getEntries()];
            this.analyzeResources();
        }).observe({ entryTypes: ['resource'] });
        
        // 绘制性能
        new PerformanceObserver((list) => {
            this.metrics.paint = list.getEntries();
            this.analyzePaint();
        }).observe({ entryTypes: ['paint'] });
    }
    
    analyzeNavigation() {
        const navEntry = this.metrics.navigation[0];
        if (navEntry) {
            console.log({
                FCP: navEntry.firstContentfulPaint,
                DOMContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
                LoadComplete: navEntry.loadEventEnd - navEntry.startTime
            });
        }
    }
    
    analyzeResources() {
        const slowResources = this.metrics.resource
            .filter(entry => entry.duration > 1000)
            .map(entry => ({
                url: entry.name,
                duration: entry.duration,
                size: entry.transferSize
            }));
            
        console.log('Slow Resources:', slowResources);
    }
    
    analyzePaint() {
        const paintMetrics = this.metrics.paint.reduce((acc, entry) => {
            acc[entry.name] = entry.startTime;
            return acc;
        }, {});
        
        console.log('Paint Metrics:', paintMetrics);
    }
}

// 使用收集器
const collector = new PerformanceCollector();
```
