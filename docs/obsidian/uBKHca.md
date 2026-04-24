# BFC 与外边距重叠

`#前端/CSS`   

## 1. 定义

`BFC（Block Formatting Context，块级格式化上下文）`是 CSS 中一个重要的概念，它是页面布局中的一个独立渲染区域，决定了元素如何定位及与其他元素之间的关系。

![image.png|616](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/54562a17d3dbd31f0f89a9e125bfe2c3.png)

## 2. BFC 的特性

1. **内部的盒子会在垂直方向，一个接一个地放置。**
2. **盒子垂直方向上的距离由 `margin`** 决定。相邻块级元素的外边距会发生折叠。
3. **BFC 的区域不会与浮动元素的盒子重叠。**
4. **BFC 是一个隔离的独立容器，容器内部的元素不会影响外部的元素。**

## 3. 创建 BFC 的方式

以下 CSS 属性会触发创建 BFC：

1. 设置 `float` 不为 `none` 的元素；
2. 设置 `position` 为 `absolute` 或 `fixed` 的元素；
3. 设置 `display` 为 `inline-block`, `table-cell`, `table-caption`, `flex`, 或 `grid` 的元素；
4. 设置 `overflow` 不为 `visible` 的元素。

示例：
```css
.bfc {
  overflow: hidden;  /* 触发 BFC */
}
```

## 4. 外边距重叠（Margin Collapsing）

外边距重叠是指`当两个上下相邻的块级元素的垂直外边距相遇时，它们会合并为一个外边距`，其高度为最大的那个外边距值，而不是两者之和。

### 4.1. 兄弟元素的边界重叠 & 父子元素的边界重叠

![A792D720-3B01-4A74-B5BD-7DC9028EFE9D.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/e34a6a6d31a5c93b4d342ec4a57f596b.png)

### 4.2. 外边距重叠的规则

- 同正，较大值 
- 同负，绝对值最大值
- 一正一负：相加

## 5. 使用 BFC 防止外边距重叠

- 解决方案：即去触发`BFC`即可，如`BFC` 不会与 `float` 元素发生重叠。

![240B4A71-C78E-47B2-A432-BF18ACC1134C.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/c4f97a2d27026987eb2967c1a6d48207.png)

![E87FF6E8-F4A6-458C-B71C-9D230BAC5BB1.png|560](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/ff8df8522e39084cec5d64669309ac23.png)
