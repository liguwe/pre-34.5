# CSS 的计算属性

`#前端/CSS` 

在 CSS 中，计算属性（也称为计算值）是指那些可以通过**数学运算、函数或其他方式动态计算**的属性值。

## 1. `calc()`

`calc()` 函数允许你在 CSS 属性中进行基本的数学运算（加、减、乘、除）。
```css
.element {
  width: calc(100% - 50px);
  height: calc(50vh + 20px);
  margin: calc(10px * 2);
}
```

## 2. `var()`

`var()` 函数用于**引用 CSS 变量**。这些变量可以包含计算值。

```css
:root {
  --base-size: 10px;
}

.element {
  padding: calc(var(--base-size) * 2);
}
```

## 3. `min()`, `max()`, `clamp()`

这些函数允许你在多个值之间进行选择

- `min()` 返回最小值
- `max()` 返回最大值
- `clamp()` 返回一个**在指定范围内的值**

```css hl:3
.element {
  width: min(50vw, 500px); /* 取 50vw 和 500px 中的最小值 */
  height: max(100px, 10vh); /* 取 100px 和 10vh 中的最大值 */
  font-size: clamp(1rem, 2vw, 3rem); /* 字体大小在 1rem 到 3rem 之间，取 2vw */
}
```

> 平时很少使用

## 4. `attr()`

`attr()` 函数允许你在 CSS 中使用 HTML 属性的值。虽然这个函数的支持仍然有限，但它可以用于一些简单的场景。

```css
.element::before {
  content: attr(data-content);
}
```

## 5. `env()`

`env()` 函数用于`访问环境变量`，例如**安全区域（safe area）内边距**。

```css
.element {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

## 6. `url()`

`url()` 函数用于引用外部资源，例如图像、字体等

```css
.element {
  background-image: url('path/to/image.jpg');
}
```

## 7. `rgba()`, `hsla()`

这些函数用于定义颜色，可以包含计算值。

```css
.element {
  background-color: rgba(255, 0, 0, 0.5); /* 半透明的红色 */
  color: hsla(120, 100%, 50%, 0.3); /* 半透明的绿色 */
}
```

## 8. `repeat()`

`repeat()` 函数用于在 CSS Grid 布局中重复轨道定义。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列，每列平分 */
}
```

## 9. `fit-content()`  → **这个平时常用**

`fit-content()` 函数用于定义一个**自适应内容的大小**。

```css hl:2
.element {
  width: fit-content(200px); /* 根据内容自适应宽度，不超过 200px */
}
```

## 10. `rotate()`, `scale()`, `translate()`, `skew()`

这些变换函数用于定义元素的变换效果

```css
.element {
  transform: rotate(45deg) scale(1.5) translate(10px, 20px);
}
```

## 11. `cubic-bezier()`, `steps()`

这些函数用于定义动画的时间函数。

```css
.element {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  animation-timing-function: steps(4, end);
}
```

## 12. `conic-gradient()` 

`conic-gradient()` 函数用于创建圆锥渐变。

```css
.element {
  background: conic-gradient(from 0deg at 50% 50%, red, yellow, green, blue);
}
```

## 13. `linear-gradient()`

`linear-gradient()` 函数用于创建线性渐变。

```css
.element {
  background: linear-gradient(to right, red, yellow, green);
}
```

## 14. `radial-gradient()`

`radial-gradient()` 函数用于创建径向渐变。

```css
.element {
  background: radial-gradient(circle, red, yellow, green);
}
```

## 15. `repeating-linear-gradient()`

`repeating-linear-gradient()` 函数用于创建重复的线性渐变。

```css
.element {
  background: repeating-linear-gradient(45deg, red, yellow 10%, green 20%);
}
```

## 16. `repeating-radial-gradient()`

`repeating-radial-gradient()` 函数用于创建重复的径向渐变。

```css
.element {
  background: repeating-radial-gradient(circle, red, yellow 10%, green 20%);
}
```

## 17. `hsl()`, `hsla()`

`hsl()` 和 `hsla()` 函数用于定义 `HSL 颜色值`，可以包含计算值

```css hl:2
/* HSL 语法 */
color: hsl(色相, 饱和度, 亮度);
/* HSLA 语法（带透明度） */
color: hsla(色相, 饱和度, 亮度, 透明度);

.element {
  color: hsl(120, 100%, 50%);
  background-color: hsla(240, 100%, 50%, 0.5);
}
```

## 18. `rotateX()`, `rotateY()`, `rotateZ()

这些 3D 变换函数用于定义元素的旋转效果。

```css
.element {
  transform: rotateX(45deg) rotateY(30deg) rotateZ(60deg);
}
```

## 19. `scaleX()`, `scaleY()`, `scaleZ()`

这些 3D 变换函数用于定义元素的缩放效果

```css
.element {
  transform: scaleX(1.2) scaleY(0.8) scaleZ(1.5);
}
```

## 20. `translateX()`, `translateY()`, `translateZ()`

这些 3D 变换函数用于定义元素的平移效果。

```css
.element {
  transform: translateX(10px) translateY(20px) translateZ(30px);
}
```

## 21. `skewX()`, `skewY()`

这些变换函数用于定义元素的倾斜效果。

```css
.element {
  transform: skewX(30deg) skewY(20deg);
}
```

## 22. `matrix()`, `matrix3d()`

这些函数用于定义 2D 和 3D 变换矩阵。

```css
.element {
  transform: matrix(1, 0, 0, 1, 50, 100); /* 2D 变换矩阵 */
  transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 50, 100, 0, 1); /* 3D 变换矩阵 */
}
```

## 23. `perspective()`

`perspective()` 函数用于**定义 3D 透视效果**。

```css
.element {
  transform: perspective(500px) rotateY(45deg);
}
```

## 24. `path()`

`path()` 函数用于定义一个路径，常用于 `clip-path` 属性

```css
.element {
  clip-path: path('M10 10 H 90 V 90 H 10 L 10 10');
}
```

## 25. `circle()`, `ellipse()`, `inset()`, `polygon()`

这些函数用于定义`裁剪路径`（clip path）。

```css
.element {
  clip-path: circle(50% at 50% 50%);
  clip-path: ellipse(50% 50% at 50% 50%);
  clip-path: inset(10% 20% 30% 40%);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

## 26. `counter()`, `counters()`

这些函数用于**生成计数器**内容

```css
ol {
  counter-reset: section;
}

li::before {
  counter-increment: section;
  content: counter(section) ". ";
}
```

## 27. `rotate3d()`

`rotate3d()` 函数用于定义**沿着任意轴的 3D 旋转**。

```css
.element {
  transform: rotate3d(1, 1, 0, 45deg);
}
```

## 28. `translate3d()`

`translate3d()` 函数用于定义 3D 平移

```css
.element {
  transform: translate3d(10px, 20px, 30px);
}
```
