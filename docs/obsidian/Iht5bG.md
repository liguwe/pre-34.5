# CSS 性能优化思路

`#前端/CSS`

>  可以从网络 → 解析 → 运行时的维度来展开，更**具有逻辑性**

## 1. 减少 CSS 文件的大小

- 压缩 CSS 文件：
	- 使用工具（如 CSSNano、csso）压缩 CSS 文件，去除空格、注释和不必要的字符。
- 移除未使用的 CSS：
	- 使用工具（如 PurifyCSS、PurgeCSS）检测并移除未使用的 CSS 规则。
	- 开发者工具查看使用了多少的样式，那些是无用的

## 2. 优化选择器

- 避免过于具体的选择器：
	- 复杂的选择器（如后代选择器）会增加浏览器的匹配时间。尽量使用简单的选择器。
- 避免使用通配符选择器：
	- 如 `*` 选择器会匹配所有元素，性能较差。
- 减少嵌套层级：
	- 过深的嵌套会增加选择器的复杂度，影响性能。

## 3. 使用高效的布局技术

- 优先使用 Flexbox 和 Grid 布局：
	- 这些布局模型在现代浏览器中性能较好，且代码简洁易维护。
- 避免使用浮动布局：
	- 浮动布局需要更多的清理和处理，影响性能。

## 4. 减少重排和重绘

- 避免频繁修改样式：
	- 频繁修改样式会导致重排和重绘，影响性能。尽量批量修改样式。
- 使用 `class` 切换而不是直接修改样式：
	- 通过切换 `class` 来改变样式，而不是直接修改元素的 `style` 属性。
- 避免使用 JavaScript 修改样式：
	- 尽量使用 CSS 过渡和动画，而不是通过 JavaScript 修改样式。

## 5. 使用硬件加速

启用 GPU 加速：使用 `transform`、`opacity` 和 `will-change` 属性来启用 GPU 加速，减少 CPU 负载。

```css
.element {
  will-change: transform, opacity;
}
```

## 6. 延迟加载和异步加载

- 异步加载 CSS：使用 `media` 属性和 `onload` 事件异步**加载非关键 CSS。**

```html
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="non-critical.css"></noscript>

```

> 比如**打印**的样式肯定需要后置 ` media="print"`

## 7. 使用 CSS 预处理器和后处理器

- 使用预处理器（如 Sass、Less）：
	- 预处理器可以帮助组织和优化 CSS 代码，提高可维护性。
- 使用后处理器（如 PostCSS）：
	- 后处理器可以自动添加浏览器前缀、压缩 CSS 等。

## 8. 优化字体加载

- 使用字体显示策略：使用 `font-display` 属性优化字体加载体验。
```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: swap;
}
```

- 只加载必要的字体：避免加载过多的字体变体和字符集。

## 9. 代码分割和按需加载

- 按需加载 CSS：
	- 将不同页面的样式分割成不同的 CSS 文件，按需加载。

## 10. 使用现代 CSS 特性

- 使用 CSS 变量：CSS 变量可以减少重复代码，提高可维护性和性能。
```css
:root {
  --primary-color: `#3498db;`
}

.element {
  color: var(--primary-color);
}
```

- 使用现代布局和功能：
	- 如 CSS Grid、Flexbox、`clamp()`、`min()`、`max()` 等，**减少依赖 JavaScript 实现复杂布局和功能**。

## 11. 提前加载关键 CSS

内联关键 CSS：将关键 CSS 内联到 HTML 中，减少初始渲染时间。

```html
<style>
  /* 关键 CSS */
  body {
    font-family: 'Arial', sans-serif;
  }
</style>

```

## 12. 使用内容分发网络 (CDN)

- 使用 CDN 提供 CSS：
	- 使用 CDN 提供的 CSS 文件，可以加速文件加载。
