# CSS 选择器的优先级

`#前端/CSS` 

## 1. 特异性（Specificity） ：优先级

CSS 选择器的优先级由四个数值组成，用来计算选择器的`特异性（Specificity）`。这些数值从高到低分别是：

- 内联样式：如果样式是通过元素的 `style` 属性内联定义的，例如 `<div style="color: red;"></div>`。
	- 特异性（Specificity）：**1000**
- ID 选择器：例如 `#id`
	- 特异性（Specificity）：**100**
- `类选择器、属性选择器`和`伪类选择器`：例如 `.class`、`[type="text"]`、`:hover`
	- 特异性（Specificity）：**10**
- 元素选择器 和`伪元素`选择器：例如 `div`、`p`、`::before`
	- 特异性（Specificity）：**1**
- 通配符选择器（`*`）
	- 特异性（Specificity）：**0**

> 特异性（Specificity） 即 优先级

## 2. 示例

1. `style="color: red;"` 内联样式，特异性值为 `1000`
2. `#idSelector` ID 选择器，特异性值为 `100`
3. `.classSelector` 类选择器，特异性值为 `10`
4. `[type="text"]` 属性选择器，特异性值为 `10`
5. `:hover` 伪类选择器，特异性值为 `10`
6. `div` 元素选择器，特异性值为 `1`

## 3. `important`

1. `!important` 提升声明的优先级，覆盖任何通常的权重计算
2. 任意规则使用 `!important`，该规则将优先权
3. 多个 `!important`之间情况，优先级基于特异性

## 4. 总结

以下优先级从高到低：

1. `!important` 声明
2. 内联样式（`style 属性`） 
	-  → 1000
3. ID 选择器（`#id`）   
	- → 100
4. 类选择器（`.class`）、属性选择器（`[attr]`）和 `伪类（:hover 等）`  
	- 10
5. 元素选择器（`div, p 等`）和 `伪元素（::before, ::after 等`）
	- 1
6. 通配符选择器（`*`）
	- 0

> 是有一个很详细的计算公式的，CSS 引擎会严格计算具体的值
