# 浏览器的渲染原理

`#bom` 

## 1. 浏览器是如何把网页渲染到显示器上的

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-6.png)

## 2. 重排、重绘、合成

注意点：
- 主线程与非主线程
- 渲染路径：重排 > 重绘 > 合成，如下图
- 合成
	- 直接在**非主线程**上执行合成动画操作
	- 合成层的transform、opacity修改，只需要将多个图层再次合并，而后生成位图，最终展示到屏幕上

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-8.png)

## 3. 渲染流程、渲染层、合成层、开启 GPU 加速的关系

### 3.1. 渲染过程概述

首先,让我们简要回顾一下浏览器的基本渲染过程:
![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-9.png)

1) 解析HTML构建DOM树
2) 解析CSS构建CSSOM树
3) 将DOM和CSSOM合并成渲染树(Render Tree)
4) 布局(Layout):计算每个可见元素的几何信息
5) 绘制(Paint):将渲染树中的各个节点绘制到屏幕上
6) 合成(Compositing): **将不同的绘制层合成到一起**

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-11.png)

### 3.2. 渲染层和合成层主要区别

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-13.png)

### 3.3. 渲染层

>  更多见 [8. 渲染层（Paint Layer）和合成层（Composite Layer）](/TKF66i)

**渲染层**的概念跟“**层叠上下文**”密切相关，简单来说，拥有z-index属性的定位元素会生成一个层叠上下文，一个生成层叠上下文的元素就生成了一个渲染层

形成`渲染层`的条件也就是**形成层叠上下文**的条件

- document 元素
- 拥有z-index 属性的定位元素（position: relative|fixed|sticky|absolute）
- 弹性布局的子项（父元素display:flex|inline-flex)，并且 z-index 不是auto时
- opacity 非 1 的元素
- transform 非 none 的元素
- filter非none的元素
- will-change = opacity | transform | filter
- 此外需要剪裁的元素也会形成一个渲染层，也就是overflow不是visible的元素

### 3.4. 合成层(Compositing Layer)

- 定义: **可以独立于普通文档流中的其他层进行绘制和缓存**。
- 特点: 合成层的内容会被**缓存**为一个独立的图像,可以直接用于显示。
- 优势: 合成层的更新不会影响其他层,可以提高渲染性能。

#### 3.4.1. 在开发者工具看到的全部都是合成层

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-12.png)

#### 3.4.2. 创建合成层的条件

下面这些条件属于**生成渲染层的“加强版”**，也就是说形成合成层的条件要更苛刻

| 条件                             | 说明                             | 示例                                                                                                   |
| ------------------------------ | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 3D 或透视变换 CSS 属性                | 使用 3D 变换可以创建合成层                | `transform: translateZ(0);`<br>`transform: translate3d(0,0,0);`<br>`transform: perspective(1000px);` |
| 包含硬件加速的 2D 变换                  | 某些 2D 变换也可能触发合成层               | `transform: translateZ(0);`                                                                          |
| `will-change` 属性               | 预先告知浏览器元素可能发生的变化               | `will-change: transform;`<br>`will-change: opacity;`<br>`will-change: top, left, bottom, right;`     |
| 应用 `animation` 或 `transition`  | 对特定属性应用动画或过渡效果                 | 适用于 `opacity`, `transform`, `filter`, `backdrop-filter`                                              |
| `position: fixed`              | 固定定位的元素会创建合成层                  | `position: fixed;`                                                                                   |
| 具有 `alpha` 通道或使用 `mask`/`clip` | 半透明元素或使用遮罩/剪切的元素               | `opacity: 0.9;`<br>`mask-image: url(mask.png);`                                                      |
| 使用 CSS `filter` 属性             | 应用滤镜效果                         | `filter: blur(5px);`                                                                                 |
| 后代元素中存在合成层                     | 如包含 `<video>` 或 `<iframe>` 等标签 | `<div><video src="..."></video></div>`                                                               |
| CSS `reflection` 属性            | 使用倒影效果                         | `-webkit-box-reflect: below 1px linear-gradient(transparent, `#0004);``                                |
| `mix-blend-mode` 属性            | 设置元素的内容应该与父元素的内容混合             | `mix-blend-mode: multiply;`                                                                          |
| CSS 动画的 `@keyframe` 规则         | 使用关键帧动画                        | `@keyframes example { ... }`                                                                         |
| `<video>` 元素                   | 视频元素通常会创建合成层                   | `<video src="..."></video>`                                                                          |
| 使用 WebGL 的 `<canvas>` 元素       | WebGL 内容会触发合成层                 | `<canvas id="webgl-canvas"></canvas>`                                                                |
| 硬件加速的 `<iframe>` 元素            | 嵌入的 iframe 可能创建合成层             | `<iframe src="..."></iframe>`                                                                        |
| 使用剪裁（clip）或遮罩（mask）属性          | 应用复杂的剪裁或遮罩效果                   | `clip-path: circle(50%);`                                                                            |
| CSS 多列布局                       | 使用多列布局可能触发合成层                  | `column-count: 3;`<br>`column-width: 100px;`                                                         |
| CSS regions                    | 使用区域布局                         | 较少使用，主要在特定布局中                                                                                        |
| CSS `isolation` 属性             | 创建新的堆叠上下文                      | `isolation: isolate;`                                                                                |
| `z-index` 属性                   | 在某些情况下可能触发合成层                  | `z-index: 100;`                                                                                      |

### 3.5. GPU加速

- 定义: GPU加速是指利用图形处理器(GPU)来加速页面渲染和动画执行。
- 原理: 通过将某些渲染任务转移到GPU上处理,可以显著提高性能。
- 触发: **创建合成层通常会触发GPU加速**。

创建合成层的条件和开启 GPU 3D 加速的条件虽然有很大的重叠，但并不完全相同，具体如下表：

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241025-10.png)

### 3.6. 新开GPU加速

"新开GPU加速"通常指的是某个元素因为特定的CSS属性或DOM操作而创建了新的合成层,从而触发了GPU加速。这个过程包括:

1) 元素被提升为独立的**合成层**
2) 该层的渲染被转移到GPU上处理
3) GPU独立处理该层的绘制和合成

### 3.7. 实际应用和注意事项

- 性能优化: 合理使用合成层可以提高动画性能和页面滚动流畅度。
- 过度使用的问题: 创建过多的合成层可能会增加内存使用,反而降低性能。
- 调试工具: Chrome DevTools的 "Layers" 面板可以帮助可视化和调试复合层

### 3.8. 代码示例

触发GPU加速的CSS示例:

```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

这段CSS会强制创建一个**新的合成层**,并触发GPU加速。

### 3.9. 最佳实践

- 只在需要的地方使用GPU加速
- 使用 will-change 属性来提前告知浏览器即将发生的变化
- 避免大量使用固定定位元素
- 对于不需要频繁重绘的元素, 考虑**使用 opacity 和 transform 来实现动画效果**

### 3.10. 注意项

如果有一个元素，它的兄弟元素在复合层中渲染，而这个兄弟元素的`z-index`比较小，那么这个元素（不管是不是应用了硬件加速样式）也会被放到复合层

换言之，浏览器有可能给复合层之后的所有相对或绝对定位的元素都创建一个`合成层`来渲染

所以，使用3D硬件加速提升动画性能时，最好给元素增加一个`z-index`属性，**人为干扰复合层的排序**，可以有效减少chrome创建不必要的复合层，提升渲染性能，移动端优化效果尤为明显

### 3.11. 复合层 = 合成层
