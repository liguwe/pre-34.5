# 渲染层（Paint Layer）和合成层（Composite Layer）

`#bom` 

## 1. 基本概念

### 1.1. 渲染层（Paint Layer）

- 浏览器的**普通渲染层**
- 主要负责页面元素的绘制
- 共用同一个**绘图上下文**
- 在**主线程**中进行绘制

### 1.2. 合成层（Composite Layer）

- 独立的图形层
- 拥有单独的图形上下文
- 可以利用 GPU 加速
- 在**合成线程**中进行处理

## 2. 详细对比

### 2.1. 创建条件

#### 2.1.1. 渲染层（Paint Layer）触发条件：

```css
.paint-layer {
    /* 1. 根元素 <html> */
    
    /* 2. 有定位属性的元素 */
    position: relative | absolute | fixed | sticky;
    
    /* 3. 透明的元素 */
    opacity: 0.9;
    
    /* 4. 有 CSS 滤镜的元素 */
    filter: blur(5px);
    
    /* 5. 有 CSS mix-blend-mode 属性的元素 */
    mix-blend-mode: multiply;
    
    /* 6. 有 CSS transform 属性的元素 */
    transform: scale(1.1);
    
    /* 7. overflow 不为 visible 的元素 */
    overflow: hidden | auto | scroll;
}
```

#### 2.1.2. 关于 opacity

1. opacity < 1 时
	- 会创建**合成层**（Compositing Layer）
	- 会触发GPU加速
	- 不会影响子元素的渲染
2. opacity = 1 时
	- 只是普通的**渲染层**（Paint Layer）
	- 不会创建新的合成层
	- 不会触发 GPU 加速

#### 2.1.3. 合成层（Composite Layer）触发条件：

```css
.composite-layer {
    /* 1. 3D 或透视变换 */
    transform: translate3d(0, 0, 0);
    transform: translateZ(0);
    
    /* 2. 对 opacity、transform、filter 等属性进行动画 */
    animation: slide 1s ease;
    
    /* 3. will-change 属性 */
    will-change: transform | opacity;
    
    /* 4. 具有加速视频解码的 <video> 元素 */
    
    /* 5. 3D 绘图上下文的 <canvas> 元素 */
    
    /* 6. 混合插件内容 */
    
    /* 7. 具有 CSS 滤镜效果的元素 */
    filter: blur(5px);
    
    /* 8. 剪裁（clip）或遮罩（mask）中包含合成层的元素 */
    clip-path: circle(50%);
    -webkit-mask: linear-gradient(#000, transparent);
}
```

### 2.2. 性能特征

#### 2.2.1. 渲染层：

```javascript
// 渲染层的更新过程
document.querySelector('.paint-layer').style.left = '100px';
// 1. 重新计算样式
// 2. 重新布局
// 3. 重新绘制整个渲染层
// 4. 合成显示
```

#### 2.2.2. 合成层：

```javascript
// 合成层的更新过程
document.querySelector('.composite-layer').style.transform = 'translateX(100px)';
// 1. 直接在 GPU 中处理变换
// 2. 无需重新布局和绘制
// 3. 仅需要合成显示
```

### 2.3. 只为容器创建合成层

```javascript hl:13
// 不当使用合成层可能导致内存问题
function badPractice() {
    const elements = document.querySelectorAll('.element');
    elements.forEach(el => {
        // 不要为太多元素强制创建合成层
        el.style.transform = 'translateZ(0)';
    });
}

// 推荐做法
function goodPractice() {
    const container = document.querySelector('.container');
    // 只为容器创建合成层
    container.style.transform = 'translateZ(0)';
}
```

### 2.4. 使用场景

#### 2.4.1. 渲染层适用场景：

```css
/* 1. 静态内容 */
.static-content {
    position: relative;
    background: `#fff;`
}

/* 2. 简单的悬浮效果 */
.hover-effect {
    position: relative;
}
.hover-effect:hover {
    background: `#f0f0f0;`
}
```

#### 2.4.2. 合成层适用场景：

```css
/* 1. 固定定位的头部或侧边栏 */
.header {
    position: fixed;
    top: 0;
    width: 100%;
    transform: translateZ(0);
}

/* 2. 滚动内容 */
.scroll-container {
    overflow: auto;
    will-change: transform;
}

/* 3. 动画元素 */
.animated-element {
    animation: slide 1s ease infinite;
    will-change: transform;
}
```

### 2.5. 调试和优化

#### 2.5.1. Chrome DevTools 中的调试：

1. 打开 Chrome DevTools
2. 使用 `Layers 面板`查看层信息
3. 使用 `Performance` 面板分析性能

```javascript hl:1,7,12
// 优化建议
function optimizePerformance() {
    // 1. 合理使用 will-change
    const animatedElement = document.querySelector('.animated');
    animatedElement.style.willChange = 'transform';
    
    // 2. 动画结束后移除 will-change
    animatedElement.addEventListener('animationend', () => {
        animatedElement.style.willChange = 'auto';
    });
    
    // 3. 使用 transform 替代改变位置的属性
    // 不推荐
    element.style.left = '100px';
    // 推荐
    element.style.transform = 'translateX(100px)';
}
```

### 2.6. 最佳实践

```css
/* 1. 合理使用合成层 */
.optimal-composite {
    /* 只在需要的元素上使用 */
    transform: translateZ(0);
    will-change: transform;
}

/* 2. 避免层爆炸 */
.container {
    /* 在容器上创建合成层，而不是每个子元素 */
    transform: translateZ(0);
}
.container > * {
    /* 子元素不需要单独创建合成层 */
    transform: none;
}

/* 3. 使用 CSS 动画 */
@keyframes slide {
    from { transform: translateX(0); }
    to { transform: translateX(100px); }
}

.animated {
    animation: slide 1s ease;
    will-change: transform;
}
```

### 2.7. 注意事项

- **内存使用**
	- 合成层会占用额外的内存
	- 需要权衡性能和内存使用
- **层爆炸**
	- 避免创建过多的合成层
	- 合理管理层级结构
- **硬件加速**
	- 合成层会启用 GPU 加速
	- 需要考虑设备性能差异
- **调试工具**
	- 使用 Chrome DevTools 监控层的使用
	- 分析性能瓶颈
- **兼容性**
	- 考虑不同浏览器的支持情况
	- 提供降级方案
