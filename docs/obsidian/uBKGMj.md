# 渲染层（Paint Layer）和层叠上下文（Stacking Context）

`#bom` 

## 1. 基本概念

### 1.1. 层叠上下文（Stacking Context）

- 是 HTML 元素在 Z 轴上的层叠**规则**
- 决定元素的显示顺序
- 是一个**逻辑概念**，用于管理元素的层叠顺序

### 1.2. 渲染层（Paint Layer）

- 是浏览器渲染过程中的**实际图层**
- 负责元素的绘制
- 是一个**物理概念**，用于浏览器渲染优化

## 2. 详细关系分析

### 2.1. 创建条件对比

```css
/* 层叠上下文触发条件 */
.stacking-context {
    /* 1. 文档根元素 <html> */
    
    /* 2. position + z-index */
    position: relative | absolute | fixed;
    z-index: 1;
    
    /* 3. opacity 小于 1 */
    opacity: 0.9;
    
    /* 4. transform 不为 none */
    transform: scale(1.1);
    
    /* 5. filter 不为 none */
    filter: blur(1px);
    
    /* 6. isolation: isolate */
    isolation: isolate;
    
    /* 7. mix-blend-mode 不为 normal */
    mix-blend-mode: multiply;
    
    /* 8. perspective 不为 none */
    perspective: 1000px;
}

/* 渲染层触发条件 */
.paint-layer {
    /* 1. 页面根元素 */
    
    /* 2. 有定位属性 */
    position: relative | absolute | fixed;
    
    /* 3. 透明度 */
    opacity: 0.9;
    
    /* 4. 变换 */
    transform: scale(1.1);
    
    /* 5. overflow 不为 visible */
    overflow: hidden;
    
    /* 6. filter */
    filter: blur(1px);
}
```

### 2.2. 层叠顺序和渲染关系

```css
/* 层叠顺序示例 */
.container {
    position: relative; /* 创建层叠上下文 */
    /* 同时也可能创建渲染层 */
}

.child1 {
    position: absolute;
    z-index: 1;
    /* 在层叠上下文中的顺序为 1 */
}

.child2 {
    position: absolute;
    z-index: 2;
    transform: translateZ(0);
    /* 在层叠上下文中的顺序为 2 */
    /* 同时会创建新的渲染层 */
}
```

### 2.3. 嵌套关系

```css
/* 层叠上下文的嵌套 */
.parent {
    position: relative;
    z-index: 1;
    /* 创建层叠上下文 */
}

.child {
    position: relative;
    z-index: 999;
    /* 创建子层叠上下文 */
    /* z-index 只在父层叠上下文中比较 */
}

/* 渲染层的嵌套 */
.container {
    transform: translateZ(0);
    /* 创建渲染层 */
}

.nested {
    opacity: 0.9;
    /* 可能创建新的渲染层 */
    /* 具体是否创建取决于浏览器的优化策略 */
}
```

### 2.4. 性能影响

```css
/* 层叠上下文的性能影响 */
.stacking-context-example {
    position: relative;
    z-index: 1;
    /* 主要影响布局计算 */
}

/* 渲染层的性能影响 */
.paint-layer-example {
    transform: translateZ(0);
    /* 影响内存使用和 GPU 加速 */
}

/* 同时影响两者的属性 */
.both-affected {
    opacity: 0.9;
    /* 1. 创建层叠上下文 */
    /* 2. 可能创建新的渲染层 */
}
```

### 2.5. 实际应用场景

```css
/* 1. 模态框示例 */
.modal-overlay {
    position: fixed;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
    /* 创建层叠上下文确保遮罩在最上层 */
    /* 同时因为 position: fixed 创建渲染层 */
}

/* 2. 滚动容器 */
.scroll-container {
    position: relative;
    overflow: auto;
    /* 创建渲染层优化滚动性能 */
    will-change: transform;
}

/* 3. 下拉菜单 */
.dropdown {
    position: absolute;
    z-index: 10;
    /* 创建层叠上下文控制显示顺序 */
    transform: translateZ(0);
    /* 创建渲染层优化动画性能 */
}
```

### 2.6. 调试方法

```javascript
// 检查层叠上下文
function checkStackingContext(element) {
    const styles = window.getComputedStyle(element);
    const properties = [
        'opacity',
        'transform',
        'filter',
        'position',
        'z-index'
    ];
    
    return properties.some(prop => {
        const value = styles[prop];
        return value && value !== 'none' && value !== 'static';
    });
}

// 使用 Chrome DevTools 检查渲染层
// 1. 打开 DevTools
// 2. 按 Esc 打开 Drawer
// 3. 选择 Layers 面板
```

### 2.7. 最佳实践

>  可使用 `isolation` **创建新的层叠上下文**

```css
/* 1. 合理使用层叠上下文 */
.modal {
    position: fixed;
    z-index: 1000;
    /* 使用较大的 z-index 确保显示在最上层 */
}

/* 2. 优化渲染层创建 */
.optimized-container {
    /* 在父容器创建渲染层 */
    transform: translateZ(0);
}

.optimized-container * {
    /* 避免子元素创建不必要的渲染层 */
    transform: none;
}

/* 3. 处理重叠元素 */
.overlapping-elements {
    position: relative;
    /* 使用 isolation 创建新的层叠上下文 */
    isolation: isolate;
}
```

## 3. 注意事项

- **层叠上下文的特点**：
	- 层叠上下文是相对的
	- 子元素的 `z-index` 只在父层叠上下文中比较
	- 不会影响到其他层叠上下文
- **渲染层的考虑**：
	- 避免创建过多渲染层
	- 注意内存使用
	- 合理使用 GPU 加速
- **性能优化**：
	- 合理管理层叠上下文的嵌套
	- 控制渲染层的数量
	- 使用适当的 CSS 属性
- **浏览器差异**：
	- 不同浏览器的渲染策略可能不同
	- 层叠上下文的行为较为统一
	- 渲染层的创建可能因浏览器而异

总的来说，层叠上下文和渲染层是**两个相关但不完全重叠**的概念：
- 层叠上下文主要控制元素的视觉层级顺序
- 渲染层主要影响浏览器的渲染性能和优化
- 某些 CSS 属性可能同时影响两者
- 理解两者的关系有助于开发更高性能的网页
