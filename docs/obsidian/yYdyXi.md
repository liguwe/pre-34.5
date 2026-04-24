# LCP 、白屏时间、首屏时间

`#前端性能` 

## 总结

 - LCP 
	 - 视口内可见的**最大图像或文本块完成渲染**的时间点
	 - entryTypes = largest-contentful-paint
	 -  定义：**视口内最大内容元素呈现的时间点**
	- 计算：由**浏览器自动计算最大内容元素的渲染时间**
	- 特点：**是一个清晰的、可量化的指标**
 - 白屏时间
	 - 从页面开始加载到**第一个像素**绘制到屏幕上的时间
	 - entryTypes = first-paint
 - 首屏时间
	- 定义：首屏内容全部渲染完成的时间点
	- 计算：**没有标准的计算方法**，通常需要自定义计算
	- 特点：定义较为模糊，**依赖于具体业务场景**
 - 其他
	 - 页面加载时间轴：
		 - `[开始加载] -> [首次绘制(FP/白屏)] -> [首次内容绘制(FCP)] -> [最大内容绘制(LCP)]`
	 - fetchpriority 属性
		 - `<img src="hero.jpg" fetchpriority="high">`

## 1. LCP (Largest Contentful Paint) 和白屏时间

是两个不同的指标，它们测量的是不同的性能方面。

### 1.1. LCP 与白屏时间的区别

#### 1.1.1. 定义差异

- **白屏时间 (First Paint, FP)**：
	- 从页面开始加载到**第一个像素**绘制到屏幕上的时间
	- 代表用户**第一次看到页面有内容的时刻**
	- 可能**只是背景颜色或简单的元素**
- **LCP (Largest Contentful Paint)**：
	- 视口内可见的**最大图像或文本块完成渲染**的时间点
	- 代表页面主要内容加载完成的时刻
	- 关注的是最大的内容元素的渲染时间

#### 1.1.2. 时间点差异

```
页面加载时间轴：
[开始加载] -> [首次绘制(FP/白屏)] -> [首次内容绘制(FCP)] -> [最大内容绘制(LCP)]
```

### 1.2. 测量方法对比

#### 1.2.1. 白屏时间测量

- 方法一：Performance API
	- PerformanceObserver API
		- paint
- 方法二：手动测量 

```javascript hl:1,12,4
// 方法一：Performance API
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name === 'first-paint') {
            console.log('White screen time:', entry.startTime);
        }
    }
});

observer.observe({ entryTypes: ['paint'] });

// 方法二：手动测量 
performance.mark('pageStart');
window.addEventListener('load', () => {
    const whiteScreenTime = performance.now() - performance.getEntriesByName('pageStart')[0].startTime;
    console.log('Manual white screen time:', whiteScreenTime);
});
```

#### 1.2.2. LCP 测量：largest-contentful-paint

```javascript hl:7
// 使用 PerformanceObserver 测量 LCP
new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
}).observe({
    entryTypes: ['largest-contentful-paint']
});
```

### 1.3. 影响因素对比

#### 1.3.1. 白屏时间的影响因素

- HTML 文档的网络请求时间
- HTML 解析时间
- 关键 CSS 加载时间
- JavaScript 阻塞渲染的情况
- 服务器响应时间

#### 1.3.2. LCP 的影响因素

- 图片加载时间
- 大型文本块的渲染
- CSS 样式计算
- Web 字体加载
- 服务器响应时间
- JavaScript 执行时间

### 1.4. 优化策略对比

#### 1.4.1. 白屏优化

```html
<!-- 1. 内联关键 CSS -->
<style>
  /* 首屏关键样式 */
  .header { ... }
  .main-content { ... }
</style>

<!-- 2. 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="critical.js" as="script">

<!-- 3. 服务端渲染 -->
<div id="app">
  <!-- 服务端预渲染的内容 -->
</div>
```

#### 1.4.2. LCP 优化

```javascript
// 1. 图片优化
const img = new Image();
img.loading = 'lazy';  // 非LCP图片使用懒加载
img.srcset = 'small.jpg 300w, large.jpg 1000w';
img.sizes = '(max-width: 500px) 300px, 1000px';

// 2. 使用 fetchpriority 属性
<img src="hero.jpg" fetchpriority="high">

// 3. 缓存策略
// 服务端设置缓存头
Cache-Control: max-age=31536000
```

>  fetchpriority 属性

### 1.5. 实际应用场景

#### 1.5.1. 需要关注白屏时间的场景

- 首页加载体验
- SPA 应用的路由切换
- 移动端页面加载
- 弱网环境优化

#### 1.5.2. 需要关注 LCP 的场景

- 新闻网站的文章页面
- 电商网站的商品详情页
- 图片展示网站
- 内容密集型应用

### 1.6. 监控代码示例

```javascript hl:21,28
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fp: 0,
            lcp: 0
        };
        this.init();
    }

    init() {
        // 监控白屏时间
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-paint') {
                    this.metrics.fp = entry.startTime;
                    this.report('FP', entry.startTime);
                }
            }
        }).observe({ entryTypes: ['paint'] });

        // 监控 LCP
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.report('LCP', lastEntry.startTime);
        }).observe({
            entryTypes: ['largest-contentful-paint']
        });
    }

    report(metric, value) {
        console.log(`${metric}: ${value}ms`);
        // 可以在这里发送数据到分析服务器
    }
}

// 使用监控
const monitor = new PerformanceMonitor();
```

### 1.7. 总结

LCP 和白屏时间是两个不同的性能指标：
1. 白屏时间反映的是**页面开始有内容**的时间点
2. LCP 反映的是**页面主要内容加载完成**的时间点
3. LCP 通常会大于白屏时间
4. 两者都是重要的性能指标，但衡量的维度不同
5. 优化策略也有所不同，需要根据具体场景选择关注点

因此，LCP 不等于白屏时间，它们是衡量页面性能的两个独立指标。

## 2. LCP（Largest Contentful Paint）和首屏时间

### 2.1. 基本概念对比

#### 2.1.1. LCP (Largest Contentful Paint)

- 定义：**视口内最大内容元素呈现的时间点**
- 计算：由**浏览器自动计算最大内容元素的渲染时间**
- 特点：**是一个清晰的、可量化的指标**

#### 2.1.2. 首屏时间（First Screen Paint）

- 定义：首屏内容全部渲染完成的时间点
- 计算：没有标准的计算方法，通常需要自定义计算
- 特点：定义较为模糊，**依赖于具体业务场景**

### 2.2. 关系分析

1. **相似点**
	- 都关注用户可见内容的加载
	- 都是衡量页面性能的重要指标
	- 都与用户体验密切相关
2. **区别**
```javascript hl:27
// LCP 示例
new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
}).observe({
    entryTypes: ['largest-contentful-paint']
});

// 首屏时间计算示例（一种实现方式）
class FirstScreenTime {
    constructor() {
        this.firstScreenHeight = window.innerHeight;
        this.startTime = performance.now();
        this.isFirstScreenFinished = false;
    }

    checkFirstScreen() {
        if (this.isFirstScreenFinished) return;

        // 获取首屏内所有元素
        const elements = document.querySelectorAll('*');
        let isInFirstScreen = false;

        for (let element of elements) {
            const rect = element.getBoundingClientRect();
            // 判断元素是否在首屏内
            if (rect.top < this.firstScreenHeight) {
                isInFirstScreen = true;
                // 检查图片加载
                const imgs = element.getElementsByTagName('img');
                for (let img of imgs) {
                    if (!img.complete) {
                        return false;
                    }
                }
            }
        }

        if (isInFirstScreen) {
            this.isFirstScreenFinished = true;
            const firstScreenTime = performance.now() - this.startTime;
            console.log('First Screen Time:', firstScreenTime);
            return true;
        }

        return false;
    }
}
```

### 2.3. 实际应用场景对比

#### 2.3.1. LCP 适用场景

```javascript
// 电商商品详情页面
class ProductDetailPerformance {
    constructor() {
        this.observeLCP();
    }

    observeLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            // 通常是商品主图
            if (lastEntry.element) {
                console.log('Product main image loaded:', lastEntry.startTime);
                this.reportLCP(lastEntry.startTime);
            }
        }).observe({
            entryTypes: ['largest-contentful-paint']
        });
    }

    reportLCP(time) {
        // 上报数据
    }
}
```

#### 2.3.2. 首屏时间适用场景

```javascript hl:17
// 新闻列表页面
class NewsListPerformance {
    constructor() {
        this.startTime = performance.now();
        this.observeFirstScreen();
    }

    observeFirstScreen() {
        const newsItems = document.querySelectorAll('.news-item');
        let loadedItems = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadedItems++;
                    
                    // 假设首屏显示5条新闻
                    if (loadedItems === 5) {
                        const firstScreenTime = performance.now() - this.startTime;
                        console.log('News List First Screen Time:', firstScreenTime);
                        this.reportFirstScreen(firstScreenTime);
                        observer.disconnect();
                    }
                }
            });
        });

        newsItems.forEach(item => observer.observe(item));
    }

    reportFirstScreen(time) {
        // 上报数据
    }
}
```

### 2.4. 监控方案对比

#### 2.4.1. 综合监控方案

```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            lcp: 0,
            firstScreen: 0
        };
        this.init();
    }

    init() {
        // 监控 LCP
        this.observeLCP();
        // 监控首屏
        this.observeFirstScreen();
    }

    observeLCP() {
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.report('LCP', lastEntry.startTime);
        }).observe({
            entryTypes: ['largest-contentful-paint']
        });
    }

    observeFirstScreen() {
        // MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(() => {
            const now = performance.now();
            if (this.isFirstScreenReady()) {
                this.metrics.firstScreen = now - performance.timing.navigationStart;
                this.report('FirstScreen', this.metrics.firstScreen);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    isFirstScreenReady() {
        // 自定义首屏判断逻辑
        const viewHeight = window.innerHeight;
        const elements = document.querySelectorAll('*');
        let isReady = true;

        for (let el of elements) {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewHeight) {
                // 检查图片加载
                const imgs = el.getElementsByTagName('img');
                for (let img of imgs) {
                    if (!img.complete) {
                        isReady = false;
                        break;
                    }
                }
            }
        }

        return isReady;
    }

    report(metric, value) {
        console.log(`${metric}: ${value}ms`);
        // 上报逻辑
    }
}
```

### 2.5. 性能优化建议

#### 2.5.1. **共同优化点**

```javascript
// 1. 资源预加载
<link rel="preload" href="critical.js" as="script">
<link rel="preload" href="hero-image.jpg" as="image">

// 2. 图片优化
<img 
    src="product.jpg" 
    loading="eager" 
    fetchpriority="high"
    srcset="product-300.jpg 300w, product-600.jpg 600w"
    sizes="(max-width: 600px) 300px, 600px"
>

// 3. 关键CSS内联
<style>
    /* 首屏关键样式 */
    .hero-section {
        /* ... */
    }
</style>
```

#### 2.5.2. **差异化优化**

- LCP优化：
	- 关注**最大**内容元素
- 首屏优化：
	- 关注视口内**所有**内容

```javascript
// LCP优化：关注最大内容元素
const optimizeLCP = () => {
    // 1. 识别LCP元素
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpElement = entries[entries.length - 1];
        if (lcpElement.element) {
            // 2. 针对性优化
            if (lcpElement.element.tagName === 'IMG') {
                lcpElement.element.fetchPriority = 'high';
            }
        }
    }).observe({
        entryTypes: ['largest-contentful-paint']
    });
};

// 首屏优化：关注视口内所有内容
const optimizeFirstScreen = () => {
    // 1. 延迟非首屏内容加载
    const deferNonFirstScreen = () => {
        const elements = document.querySelectorAll('[data-defer]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    // 加载延迟的内容
                    element.src = element.dataset.src;
                    observer.unobserve(element);
                }
            });
        });

        elements.forEach(element => observer.observe(element));
    };

    // 2. 首屏资源优先级管理
    document.querySelectorAll('img').forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight) {
            img.loading = 'eager';
            img.fetchPriority = 'high';
        } else {
            img.loading = 'lazy';
        }
    });
};
```

### 2.6. 总结

- **关系**：
	- LCP 是首屏时间的一个组成部分，但不完全等同
	- LCP 只关注最大内容元素，首屏时间关注整个首屏区域
	- LCP 通常小于首屏时间
- **选择建议**：
	- 如果需要标准化的性能指标，建议使用 LCP
	- 如果需要更全面的用户体验评估，建议同时监控首屏时间
	- 在实际应用中，两者结合使用能更好地评估页面性能
- **监控建议**：
	- LCP：使用标准的 PerformanceObserver API
	- 首屏时间：根据**业务场景自定义计算方法**
	- **建议同时监控多个指标，全面评估页面性能**
