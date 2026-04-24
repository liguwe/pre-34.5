# 堆叠上下文 与 z-index 的关系

`#R1` `#bom` 

## 1. 什么是堆叠上下文？

堆叠上下文（Stacking Context）是 HTML 元素在渲染时的**三维概念化模型**，它沿着假想的 z 轴延伸，决定了元素在重叠时的显示顺序。可以将其想象成一个层级系统或容器，其中的内容按照特定规则进行分层和渲染。

## 2. 堆叠上下文的形成条件

以下情况会创建新的堆叠上下文：

```css
/* 1. 文档根元素 <html> */

/* 2. position 不为 static 且设置了 z-index 值的元素 */
.element {
    position: relative;
    z-index: 1;
}

/* 3. position 为 fixed 或 sticky 的元素 */
.element {
    position: fixed;
}

/* 4. flex 容器的子元素且 z-index 不为 auto */
.flex-child {
    z-index: 1;
}

/* 5. grid 容器的子元素且 z-index 不为 auto */
.grid-child {
    z-index: 1;
}

/* 6. opacity 值小于 1 的元素 */
.element {
    opacity: 0.99;
}

/* 7. transform 不为 none 的元素 */
.element {
    transform: scale(1);
}

/* 8. filter 不为 none 的元素 */
.element {
    filter: blur(0px);
}

/* 9. perspective 不为 none 的元素 */
.element {
    perspective: 1000px;
}

/* 10. isolation 为 isolate 的元素 */
.element {
    isolation: isolate;
}

/* 11. will-change 指定了任何属性 */
.element {
    will-change: opacity;
}

/* 12. contain 为 layout、paint 的元素 */
.element {
    contain: layout;
}

/* 13. backdrop-filter 不为 none 的元素 */
.element {
    backdrop-filter: blur(10px);
}

/* 14. mix-blend-mode 不为 normal 的元素 */
.element {
    mix-blend-mode: multiply;
}
```



### 2.1. 根元素（默认）

- 文档根元素 `<html>` 自动生成堆叠上下文

### 2.2. 定位相关

```css
/* 以下条件会创建堆叠上下文 */
.stacking-context {
    /* 1. 定位元素 + z-index */
    position: relative | absolute | fixed | sticky;
    z-index: <number>; /* 不为 auto */
    
    /* 2. 固定定位元素 */
    position: fixed;
    
    /* 3. 粘性定位元素 */
    position: sticky;
}
```

### 2.3. CSS 属性触发

```css
.stacking-context {
    /* 透明度 */
    opacity: <number>; /* 小于1 */
    
    /* 变换 */
    transform: <transform-function>;
    
    /* 滤镜 */
    filter: <filter-function>;
    
    /* 混合模式 */
    mix-blend-mode: <blend-mode>;
    
    /* 隔离 */
    isolation: isolate;
    
    /* 其他 */
    perspective: <length>;
    clip-path: <clip-source>;
    mask: <mask-layer>;
    backdrop-filter: <filter-function>;
}
```

### 2.4. 新特性触发

```css
.stacking-context {
    /* 性能优化属性 */
    will-change: opacity, transform;
    
    /* 包含属性 */
    contain: layout | paint;
    
    /* 层合成属性 */
    perspective: 1000px;
}
```

## 3. 堆叠顺序（Stacking Order）

在同一个堆叠上下文内，元素按照以下顺序**从后到前堆叠**：

1. 堆叠上下文的根元素的背景和边框
2. z-index 为负值的定位子元素（按照 z-index 值从小到大）
3. 常规流中的非定位子元素、块级盒子
4. 浮动元素
5. 常规流中的内联元素
6. z-index 为 auto 或 0 的定位子元素
7. z-index 为正值的定位子元素（按照 z-index 值从小到大）

### 3.1. 示例代码

```css
/* 堆叠顺序示例 */
.stacking-context {
    position: relative;
    z-index: 0;
}

.negative-z-index {
    position: absolute;
    z-index: -1;
    /* 将显示在背景之上，其他元素之下 */
}

.normal-flow {
    /* 非定位元素，按照文档顺序堆叠 */
}

.float {
    float: left;
    /* 浮动元素在非定位元素之上 */
}

.inline {
    display: inline;
    /* 内联元素在浮动元素之上 */
}

.zero-z-index {
    position: relative;
    z-index: 0;
    /* 在内联元素之上 */
}

.positive-z-index {
    position: absolute;
    z-index: 1;
    /* 在最上层 */
}
```

## 4. 堆叠上下文的特性

### 4.1. 层级包含性

- 子堆叠上下文被完全包含在父堆叠上下文之内
- 子元素无法穿透父元素的堆叠层级

```css
/* 父元素创建堆叠上下文 */
.parent {
    position: relative;
    z-index: 1;
}

/* 子元素的 z-index 只在父元素内部比较 */
.child {
    position: absolute;
    z-index: 999; /* 不会影响父元素外的元素 */
}
```

### 4.2. 兄弟关系

```css
/* 两个独立的堆叠上下文 */
.context-1 {
    position: relative;
    z-index: 1;
}

.context-2 {
    position: relative;
    z-index: 2;
    /* 会在 context-1 之上，无论子元素的 z-index 多大 */
}
```

## 5. 实际应用场景

### 5.1. 模态框（Modal）

```css
.modal-overlay {
    position: fixed;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: fixed;
    z-index: 101;
}
```

### 5.2. 下拉菜单

```css
.dropdown {
    position: relative;
}

.dropdown-content {
    position: absolute;
    z-index: 1;
}
```

### 5.3. 固定导航栏

```css
.navbar {
    position: fixed;
    top: 0;
    z-index: 1000; /* 确保在其他内容之上 */
}
```

## 6. z-index

### 6.1. 基本概念

z-index 是 CSS 中用于控制元素在 z 轴上**堆叠顺序**的属性。它决定了元素在重叠时哪个元素显示在上层。

1. z-index **只在创建了堆叠上下文的元素中生效**
2. **堆叠上下文**形成独立的层级体系
3. 多种 CSS 属性都可能创建新的堆叠上下文
4. 合理使用堆叠规则可以创建复杂的层叠效果

取值范围

```css
z-index: auto;          /* 默认值 */
z-index: 0;            /* 整数值 */
z-index: 999;          /* 正整数 */
z-index: -1;           /* 负整数 */
z-index: inherit;      /* 继承父元素 */
z-index: initial;      /* 初始值 */
z-index: unset;        /* 未设置 */
```

## 7. 其他

### 7.1. z-index 管理策略：使用变量

```css
/* 使用变量管理 z-index */
:root {
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
}

.dropdown { z-index: var(--z-dropdown); }
.sticky-header { z-index: var(--z-sticky); }
.fixed-nav { z-index: var(--z-fixed); }
.modal-backdrop { z-index: var(--z-modal-backdrop); }
.modal { z-index: var(--z-modal); }
.popover { z-index: var(--z-popover); }
.tooltip { z-index: var(--z-tooltip); }
```

### 7.2. 调试技巧

```css
/* 使用 outline 调试重叠元素 */
* {
    outline: 1px solid red;
}

/* 使用不同颜色标识不同堆叠上下文 */
.stacking-context {
    background: rgba(255, 0, 0, 0.1);
}

/* 使用不同颜色的轮廓线标识堆叠上下文 */
.debug-stacking {
    outline: 2px solid red;
}

/* 临时提升元素层级进行测试 */
.debug-top {
    position: relative;
    z-index: 999999;
}
```

### 7.3. z-index 失效

```css
/* 问题：z-index 不生效 */
.element {
    z-index: 999; /* 无效 */
}

/* 解决方案：添加定位属性 */
.element {
    position: relative;
    z-index: 999; /* 现在生效了 */
}
```

### 7.4. 层级穿透

```css
/* 问题：子元素超出父元素层级 */
.parent {
    position: relative;
    z-index: 1;
}

/* 解决方案：确保父元素 z-index 足够高 */
.parent {
    position: relative;
    z-index: 1000;
}
```

### 7.5. 隔离堆叠上下文

```css
/* 使用 isolation 创建新的堆叠上下文 */
.isolated-context {
    isolation: isolate;
}
```

### 7.6. 常见问题

- z-index 不生效
- 元素无法置于顶层
- 层级关系混乱

### 7.7. 最佳实践

```css
/* 使用 CSS 变量管理 z-index */
:root {
    --z-dropdown: 100;
    --z-modal: 1000;
    --z-tooltip: 1500;
    --z-notification: 2000;
}

/* 使用语义化的类名和合理的层级值 */
.dropdown { z-index: var(--z-dropdown); }
.modal { z-index: var(--z-modal); }
.tooltip { z-index: var(--z-tooltip); }
.notification { z-index: var(--z-notification); }
```
