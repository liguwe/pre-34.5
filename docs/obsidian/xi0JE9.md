# CSS Houdini API

`#前端/CSS` 

## 1. 定义

- **描述**：一组低级 API，允许开发者扩展 CSS 的功能。
- **特点**：可以创建自定义的 CSS 属性、值和渲染逻辑。
- **示例**：使用 Houdini Paint API 创建自定义背景图案。
- workLets 是干什么的？

![image.png|535](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/fbc8c2fd3e2020705eca7a56269f9619.png)

![image.png|616](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/66aa45d5394512e154f5316bb589f85f.png)

## 2. CSS Paint API (Worklet)

>  `paint()` 是 CSS Houdini 中的 Paint API 提供的一个 CSS 函数，它允许我们使用自定义的 `Paint Worklet` 来绘制图像

```javascript hl:1
// 注册一个 Paint Worklet
CSS.paintWorklet.addModule('my-paint-worklet.js');

// paint-worklet.js
class CirclePainter {
    static get inputProperties() {
        return ['--circle-color'];
    }
    
    paint(ctx, size, properties) {
        const color = properties.get('--circle-color');
        const centerX = size.width / 2;
        const centerY = size.height / 2;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(centerX, centerY), 0, 2 * Math.PI);
        ctx.fill();
    }
}

registerPaint('circle', CirclePainter);
```

```css
/* 使用自定义画笔 */
.circle {
    --circle-color: blue;
    background-image: paint(circle); // 
}
```

## 3. CSS Properties and Values API

```javascript hl:1,2
// 注册自定义属性
CSS.registerProperty({
    name: '--my-color',
    syntax: '<color>',
    inherits: false,
    initialValue: '#c0ffee'
});
```

```css
/* 使用自定义属性 */
.element {
    --my-color: `#ff0000;`
    color: var(--my-color);
}
```

## 4. CSS Layout API

```javascript
// 注册自定义布局
registerLayout('masonry', class {
    static get inputProperties() {
        return ['--columns'];
    }
    
    async intrinsicSizes() { /* ... */ }
    
    async layout(children, edges, constraints, styleMap) {
        // 实现瀑布流布局逻辑
        const columns = parseInt(styleMap.get('--columns'));
        // ... 布局计算
    }
});
```

```css
.container {
    display: layout(masonry);
    --columns: 3;
}
```

## 5. CSS Typed OM

```javascript
// 传统方式
element.style.opacity = '0.5';

// Typed OM
element.attributeStyleMap.set('opacity', 0.5);

// 获取计算样式
const opacity = element.computedStyleMap().get('opacity');
console.log(opacity.value); // 0.5
```

## 6. 实际应用示例

### 6.1. 渐变边框生成器

```javascript
// paint-worklet.js
class GradientBorderPainter {
    static get inputProperties() {
        return [
            '--border-width',
            '--gradient-start',
            '--gradient-end'
        ];
    }
    
    paint(ctx, size, properties) {
        const width = properties.get('--border-width');
        const startColor = properties.get('--gradient-start');
        const endColor = properties.get('--gradient-end');
        
        const gradient = ctx.createLinearGradient(0, 0, size.width, size.height);
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.strokeRect(0, 0, size.width, size.height);
    }
}

registerPaint('gradient-border', GradientBorderPainter);
```

```css
.gradient-box {
    --border-width: 2px;
    --gradient-start: `#ff0000;`
    --gradient-end: `#00ff00;`
    border-image: paint(gradient-border);
}
```

### 6.2. 自定义动画属性

```javascript
// 注册自定义动画属性
CSS.registerProperty({
    name: '--slide-distance',
    syntax: '<length>',
    inherits: false,
    initialValue: '0px'
});
```

```css
@keyframes slide {
    from {
        --slide-distance: 0px;
    }
    to {
        --slide-distance: 100px;
    }
}

.sliding-element {
    animation: slide 2s infinite;
    transform: translateX(var(--slide-distance));
}
```

## 7. 浏览器支持检测

```javascript
// 检测各个 API 的支持情况
const support = {
    paint: CSS.paintWorklet !== undefined,
    layout: CSS.layoutWorklet !== undefined,
    properties: CSS.registerProperty !== undefined,
    typedOM: window.CSS?.number !== undefined
};

// 根据支持情况提供降级方案
if (support.paint) {
    CSS.paintWorklet.addModule('my-paint-worklet.js');
} else {
    // 降级处理
    element.style.background = 'fallback-color';
}
```

## 8. 性能考虑

```javascript
// 优化 Paint Worklet 性能
class OptimizedPainter {
    // 缓存常用值
    static get inputProperties() {
        return ['--cache-key'];
    }
    
    // 使用 requestAnimationFrame 优化动画
    paint(ctx, size, properties) {
        requestAnimationFrame(() => {
            // 执行绘制操作
        });
    }
}
```

## 9. 错误处理

```javascript
// 注册属性时的错误处理
try {
    CSS.registerProperty({
        name: '--my-prop',
        syntax: '<color>',
        inherits: false,
        initialValue: '#000000'
    });
} catch (error) {
    console.warn('CSS Custom Properties not supported:', error);
    // 提供后备方案
}
```

## 10. 最佳实践

1. **渐进增强**
```javascript
// 检测特性支持
if ('paintWorklet' in CSS) {
    // 使用 Houdini
} else {
    // 使用传统方案
}
```

2. **模块化设计**
```javascript
// 将 Worklet 代码分离到独立文件
const worklets = {
    paint: 'paint-worklet.js',
    layout: 'layout-worklet.js'
};

// 按需加载
async function loadWorklet(type) {
    if (CSS[`${type}Worklet`]) {
        await CSS[`${type}Worklet`].addModule(worklets[type]);
    }
}
```

3. **性能监控**
```javascript
// 监控 Worklet 性能
const paintStart = performance.now();
// Paint Worklet 操作
const paintEnd = performance.now();

console.log(`Paint took ${paintEnd - paintStart}ms`);
```

CSS Houdini 提供了强大的底层能力，但需要注意浏览器**兼容性和性能影响**。
