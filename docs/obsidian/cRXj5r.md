# 媒体查询

`#前端/CSS`  

常见的媒体查询语句如下

- min-width
- max-width
- `orientation`
- `@container`

## 1. `Container` Queries 

- **描述**：允许**根据容器的尺寸**而**不是视口尺寸**来应用样式。
- **特点**：**更灵活的响应式设计，更灵活的媒体查询**
- **示例**：

```css
@container (min-width: 500px) {
  .element {
    background-color: blue;
  }
}
```

## 2. **屏幕宽度查询（最常用）**

```css
/* 最小宽度 */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* 最大宽度 */
@media (max-width: 767px) {
    .container {
        width: 100%;
    }
}

/* 宽度范围 */
@media (min-width: 768px) and (max-width: 1024px) {
    .container {
        width: 960px;
    }
}
```

## 3. **设备类型查询**

```css hl:8
/* 屏幕设备 */
@media screen {
    .print-only {
        display: none;
    }
}

/* 打印设备 */
@media print {
    .screen-only {
        display: none;
    }
}

/* 所有设备 */
@media all {
    /* 样式 */
}
```

## 4. **屏幕方向查询**

```css
/* 横向 */
@media (orientation: landscape) {
    .sidebar {
        width: 30%;
    }
}

/* 纵向 */
@media (orientation: portrait) {
    .sidebar {
        width: 100%;
    }
}
```

## 5. **屏幕分辨率查询**

```css
/* 高分辨率屏幕 */
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 192dpi) {
    .logo {
        background-image: url('high-res-logo.png');
    }
}
```

## 6. **常见断点范例**

```css
/* 移动优先的响应式设计 */

/* 小型手机 (320px 及以上) */
@media (min-width: 320px) {
    /* 样式 */
}

/* 大型手机 (480px 及以上) */
@media (min-width: 480px) {
    /* 样式 */
}

/* 平板 (768px 及以上) */
@media (min-width: 768px) {
    /* 样式 */
}

/* 小型桌面显示器 (992px 及以上) */
@media (min-width: 992px) {
    /* 样式 */
}

/* 大型桌面显示器 (1200px 及以上) */
@media (min-width: 1200px) {
    /* 样式 */
}
```

## 7. **特性查询**

```css hl:1,8,16
/* 悬停功能查询 */
@media (hover: hover) {
    .button:hover {
        background-color: `#ddd;`
    }
}

/* 暗色主题查询 */
@media (prefers-color-scheme: dark) {
    body {
        background-color: `#333;`
        color: `#fff;`
    }
}

/* 减少动画查询 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

## 8. **视口高度查询**

```css
/* 最小高度 */
@media (min-height: 600px) {
    .modal {
        max-height: 500px;
    }
}

/* 最大高度 */
@media (max-height: 599px) {
    .modal {
        max-height: 300px;
    }
}
```

## 9. **组合查询**

```css
/* 组合多个条件 */
@media screen and (min-width: 768px) and (orientation: landscape) {
    .content {
        display: flex;
    }
}
```

## 10. **常用的 Bootstrap 断点**

```css
/* Extra small devices (phones, less than 576px) */
/* No media query since this is the default */

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    /* 样式 */
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    /* 样式 */
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    /* 样式 */
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    /* 样式 */
}
```

## 11. **最佳实践**

```css hl:1
/* 使用 em/rem 单位进行响应式设计 */
@media (min-width: 48em) { /* 768px/16px = 48em */
    .container {
        font-size: 1.2rem;
    }
}

/* 移动优先设计模式 */
.element {
    /* 基础样式（移动设备） */
    width: 100%;
}

@media (min-width: 768px) {
    .element {
        /* 平板样式 */
        width: 50%;
    }
}

@media (min-width: 1024px) {
    .element {
        /* 桌面样式 */
        width: 33.33%;
    }
}
```
