# CSS 定位或布局相关的参考坐标系

`#前端/CSS` 

![image.png|656](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/c792c133990e2818a06482c7117b141c.png)

> 这里可以对应 JS 获取某个元素的各种位置信息：比如 clientX pageX 、width 、offesetLeft 等等等等
> 

## 1. **文档坐标系**

文档坐标系是整个 HTML 文档的坐标系，所有位置和尺寸都是相对于文档的起点（通常是**左上角**）来指定的。

- **元素的宽度和高度**：以整个文档为参考系。
- **滚动位置**：以整个文档为基准的滚动。

> - `块级元素`独占一行,`内联元素`在一行内排列

## 2. **视口坐标系**

视口坐标系是指`浏览器窗口或视口`的坐标系。

- **百分比宽度和高度**：如`width: 100vw`表示宽度为 100% 视口宽度。
- **固定定位**：`position: fixed;` 会以视口为参考系来定位元素。

## 3. **包含块（Containing Block）**

`包含块`是一个元素在正常流或其他指定布局上下文中的直接父块或祖先块，用于确定其坐标和大小。

- **相对定位**：`position: relative;` 会以包含块为参考来定位元素。
- **绝对定位**：`position: absolute;` 会以最近的非静态定位的祖先元素（包含块）为参考。

## 4. **边框框（Border Box）**

边框框是包含元素的内容、**内边距和边框**的区域。

- **盒模型**：用于计算元素的总计宽度和高度。

## 5. **内边距框（Padding Box）**

内边距框是包含元素内容和内边距的区域。

- **背景和边框**：默认情况下，`**背景和边框**`会扩展到内边距框之外。

## 6. **内容框（Content Box）**

内容框是仅包含元素内容的区域，不包括内边距、边框和外边距

- **内容尺寸**：通过`box-sizing`属性可以设置为以`内容框或边框框`来计算元素尺寸（默认是`content-box`）。

## 7. **变换参考系（Transform Reference）**

当你对元素应用 CSS 变换（比如`transform`属性）时，使用的是变换参考系

- **变换中心点**：默认情况下，**变换中心点为元素的中心**。
- 创建一个新的坐标系，不影响其他元素
- 变换后的元素成为其子元素的`包含块`

```css
.transform {  
   transform: rotate(45deg) translateX(100px);  
}
```

## 8. 表格布局

- display: `table 和 table-cell`
- 模拟表格的布局结构

## 9. Flex 布局、 Grid 布局、CSS 多列布局（Multi-Column Layout）

这些布局模型创建了自己的坐标系:

- Flexbox 坐标系: 
	- 主轴(main axis)和交叉轴(cross axis)
- Grid 坐标系: 
	- 行和列定义的`网格坐标系`
- Multi-Column Layout：
	- 用于**将文本分为多列**

## 10. 示例

下面示例展示了几种不同的坐标系的使用：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Reference Coordinate Systems</title>

    <style>
        .relative-container {
            position: relative;
            width: 300px;
            height: 300px;
            background-color: lightgray;
            margin: 50px; /* 文档坐标系 */
        }

        .relative-child {
            position: absolute;
            top: 10px; /* 包含块参考系 */
            left: 10px;
            width: 100px;
            height: 100px;
            background-color: lightcoral;
        }

        .fixed-element {
            position: fixed;
            top: 20px; /* 视口坐标系 */
            right: 20px;
            width: 100px;
            height: 100px;
            background-color: lightblue;
        }

        .transform-element {
            width: 100px;
            height: 100px;
            background-color: lightgreen;
            margin: 50px;
            transform: rotate(45deg); /* 变换参考系 */
        }
    </style>

</head>

<body>
    <div class="fixed-element">Fixed</div>

    <div class="relative-container">
        <div class="relative-child">Absolute</div>

    </div>

    <div class="transform-element">Transform</div>

</body>

</html>

```

## 11. 关键点

1. **文档坐标系**：用于整体文档的布局和滚动。
2. **视口坐标系**：用于固定定位和视口相对尺寸。
3. **包含块**：用于`相对和绝对`定位。
4. **边框框、内边距框和内容框**：用于`盒模型`计算。
5. **变换参考系**：用于应用 CSS 变换。
