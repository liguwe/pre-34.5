# 滚动自动吸附效果与吸顶效果

`#前端/CSS`

## 1. CSS 滚动自动吸附效果如何实现？

`CSS Scroll Snap` 用于创建更流畅、更控制的滚动体验，确保滚动容器滚动到`预定义`的位置，使用户可以`精确地滚动到相邻的部分`

- **描述**：提供了一种控制滚动行为的方式，使滚动条在指定位置停止。
- **特点**：适用于创建滑动视图和画廊。
- **示例**：
```css
.container {
  scroll-snap-type: x mandatory;
}
.item {
  scroll-snap-align: center;
}
```

可以理解为幻灯片的效果，或者画廊滚动的效果，具体效果可参考：[https://codepen.io/chriscoyier/full/pMRgwW](https://codepen.io/chriscoyier/full/pMRgwW)

具体 CSS Scroll Snap 属性包括如下：

- [scroll-snap-type](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-snap-type)
- [scroll-padding](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding)
   - [scroll-padding-top](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-top)
   - [scroll-padding-right](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-right)
   - [scroll-padding-bottom](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-bottom)
   - [scroll-padding-left](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-left)
   - [scroll-padding-inline](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-inline)
   - [scroll-padding-inline-start](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-inline-start)
   - [scroll-padding-inline-end](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-inline-end)
   - [scroll-padding-block](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-block)
   - [scroll-padding-block-start](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-block-start)
   - [scroll-padding-block-end](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-padding-block-end)

> 如何使用具体参考上面的链接即可

## 2. 上面说的 css 的`自动吸附效果`和`吸顶`有什么区别吗？

- `position: sticky` 
	- 主要用于使元素在滚动时`粘性`地保持在其父元素的某个位置。
- `CSS Scroll Snap` 
	- 主要用于创建更流畅和可控制的滚动体验，通过自动捕捉和对齐滚动点来提升用户体验。
