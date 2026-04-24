# rem 和 vw、vh

`#javascript` `#css` 

## 1. rem 方案

### 1.1. 优点：

1. **浏览器兼容性好**
	- 支持 IE9 及以上
	- 几乎所有现代浏览器都完全支持

2. **可控性强**
	- 可以通过改变 html 的 `font-size` 来统一控制所有使用 rem 的元素
	- 便于整体缩放

3. **适合移动端**
	- 常用的 `flexible` 方案就是基于 `rem` 实现
	- 对于不同尺寸的移动设备适配效果好

### 1.2. 缺点：

1. **需要额外的 JavaScript 代码**
   ```javascript
   // 常见的 rem 适配代码
   (function() {
     function resize() {
       const width = document.documentElement.clientWidth
       document.documentElement.style.fontSize = width / 10 + 'px'
     }
     window.addEventListener('resize', resize)
     resize()
   })()
   ```

2. **计算复杂**
   - 需要将设计稿的 `px` 值转换为 rem
   - 虽然可以通过 `PostCSS` 插件自动转换

3. **存在舍入误差**
   - 因为浏览器对小数的 `font-size` 处理有差异
   - `可能导致细微的布局偏差`

## 2. vw/vh 方案：纯 CSS 解决方案

### 2.1. 优点：

1. **更加直观**
	- 1vw 等于视口宽度的 1%
	- 1vh 等于视口高度的 1%
	- 计算更简单直接

2. **不需要 JavaScript**
	- `纯 CSS 解决方案`
	- 性能更好

3. **响应更加及时**
	- 直接跟随视口大小变化
	- 不需要等待 `JavaScript` 执行

### 2.2. 缺点：

1. **兼容性稍差**
	- IE11 才开始支持
	- 部分老旧移动设备可能存在兼容问题

2. **无法整体控制**
	- 不像 rem 可以通过改变一个值来统一控制
	- **需要修改每个使用 vw/vh 的地方**

3. **特定场景下的问题**
	- 在移动端，`100vh` **可能会出现滚动问题**
	- **软键盘弹出时可能导致布局问题**

## 3. 实际应用建议

### 3.1. 移动端

```css
/* rem 方案 */
.box {
  width: 7.5rem;    /* 假设 html font-size = width/10 */
  height: 3.75rem;
}

/* vw 方案 */
.box {
  width: 75vw;      /* 直接使用百分比 */
  height: 37.5vw;
}
```

### 3.2. 混合使用

```css
/* 结合两者优点 */
.container {
  /* 大布局使用 vw */
  width: 100vw;
  padding: 3vw;
  
  /* 文字使用 rem */
  font-size: 1rem;
}

/* 最小值保护 */
.text {
  font-size: max(16px, 1rem);
}
```

### 3.3. 响应式断点

```css
/* rem 方案 */
@media screen and (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

/* vw 方案 */
@media screen and (min-width: 768px) {
  .container {
    width: 80vw;
    margin: 0 auto;
  }
}
```

## 4. 选择建议

1. **移动端项目**
   - 如果需要精确还原设计稿，推荐使用 rem
   - 如果追求开发效率，推荐使用 vw

2. **PC 端项目**
   - 推荐使用 vw/vh 配合媒体查询
   - 特别是现代网站开发

3. **混合开发**
   - 可以 rem 和 vw/vh 结合使用
   - rem 用于字体大小
   - vw/vh 用于布局尺寸

4. **需要考虑兼容性**
   - 如果需要支持 IE，使用 rem
   - 现代浏览器推荐 vw/vh

## 5. 最佳实践：组合使用

```css
/* 基础设置 */
:root {
  /* 基准字体大小 */
  font-size: 16px;
  
  /* 在移动端使用 vw */
  @media screen and (max-width: 768px) {
    font-size: 3.75vw; /* 基于 375px 设计稿 */
  }
}

/* 混合使用 */
.container {
  /* 布局使用 vw */
  width: 90vw;
  margin: 0 auto;
  
  /* 文字使用 rem */
  font-size: 1rem;
  
  /* 间距可以使用 vw 或 rem */
  padding: 1rem;
  /* 或 */
  padding: 3vw;
}
```

这样的组合使用能够在保持灵活性的同时，也确保了良好的可维护性和兼容性。
