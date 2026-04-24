# CSS 变量

`#前端/CSS`

## 1. 定义

CSS 变量使用 `--` 作为前缀来定义，并且通常定义在 `:root` 选择器中，以便在整个文档中全局可用。

```css
:root {
  --main-color: `#3498db;`
  --padding-size: 10px;
  --font-size: 16px;
}
```

CSS 变量可以存储**任何合法的 CSS 值**，包括颜色、长度、百分比、字符串等

## 2. 使用 CSS 变量

使用 `var()` 函数来引用 CSS 变量。

```css
.element {
  color: var(--main-color);
  padding: var(--padding-size);
  font-size: var(--font-size);
}
```

## 3. 变量的作用域

CSS 变量的作用域可以是全局的（定义在 `:root` 中）或局部的（定义在特定选择器中）。

### 3.1. 全局变量

定义在 `:root` 中的变量可以在**整个文档**中使用。

```css
:root {
  --global-color: `#3498db;`
}
.element {
  color: var(--global-color);
}
```

### 3.2. 局部变量

定义在特定选择器中的变量只能在该选择器及其子元素中使用。

```css
.container {
  --local-color: `#e74c3c;`
}
.element {
  color: var(--local-color); /* 仅在 .container 内部有效 */
}
```

## 4. 变量的默认值

`var()` 函数可以接受一个可选的`第二个参数`作为默认值，当变量未定义时使用该默认值。

```css
.element {
  color: var(--undefined-color, `#2ecc71);` /* 如果 --undefined-color 未定义，则使用 `#2ecc71` */
}
```

## 5. 嵌套变量

CSS 变量可以嵌套使用，即一个变量的值可以引用另一个变量。

```css
:root {
  --primary-color: `#3498db;`
  --secondary-color: var(--primary-color);
}
.element {
  color: var(--secondary-color); /* 等同于 `#3498db` */
}
```

## 6. 变量的计算

CSS 变量可以与其他 CSS 属性值一起使用，并且可以参与计算。

```css
:root {
  --base-padding: 10px;
}
.element {
  padding: calc(var(--base-padding) * 2); /* 等同于 20px */
}
```

## 7. 动态更新变量

CSS 变量的值可以**通过 JavaScript 动态更新**，从而实现动态样式更改。

```html
<style>
  :root {
    --dynamic-color: `#3498db;`
  }
  .element {
    color: var(--dynamic-color);
  }
</style>

<div class="element">Hello World</div>

<script>
  document.documentElement.style.setProperty('--dynamic-color', '#e74c3c');
</script>

```

## 8. 变量的继承

CSS 变量遵循 CSS 的继承规则，子元素可以继承父元素定义的变量

```css
.parent {
  --inherited-color: `#3498db;`
}
.child {
  color: var(--inherited-color); /* 继承自 .parent */
}
```

## 9. 变量的类型

CSS 变量可以存储任何合法的 CSS 值，包括**颜色、长度、百分比、字符串**等。

```css
:root {
  --color: `#3498db;`
  --padding: 10px;
  --font: 'Arial, sans-serif';
}
.element {
  color: var(--color);
  padding: var(--padding);
  font-family: var(--font);
}
```

## 10. CSS @property

- 描述：用于**注册自定义属性**，并定义其初始值和继承行为
- 特点：增强了 CSS 变量的功能。
- 示例：
```css
@property --main-color {
  syntax: '<color>';
  initial-value: `#3498db;`
  inherits: true;
}
```
