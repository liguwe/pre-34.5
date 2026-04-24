# 长列表或大数据渲染优化的一些思路

`#前端` `#前端性能` 

## 1. 总结

- 所有的性能体验问题的本质原因都是：CPU 瓶颈 和 IO 的瓶颈
- 思路
	- 分页
	- 虚拟列表
	- 其他
		- 骨架
		- 使用 `requestAnimationFrame` 来包装回调
		- 图片懒加载
		- 精简 DOM 结构
		- 服务器端渲染 ， `SSR` 
		-  `requestIdleCallback` 空闲时间再执行**不重要的长任务**

## 2. 先说导致长列表性能及体现不佳的本质原因

- 需要 `渲染大量的DOM节点` 及 `频繁的DOM操作` ，展开说就是每个节点都需要浏览器进行`计算`、`布局`和`绘制` 等。 如果总结，那么其实就是 所谓的 **CPU的瓶颈**
- 另外，就是一些网络原因了，毕竟请求总是需要耗费时间的，这就是所谓的 **IO的瓶颈** （这里主要指`网络IO`） 


> 总结：所有的性能体验问题的本质原因都是：CPU 和 IO 的瓶颈

## 3. 一些常见的优化思路

### 3.1. 分页

最简单且见效的方法，但需要与 `用户体验` 做平衡

### 3.2. 虚拟滚动、虚拟列表

比较常见且大规模应用的思路，具体的一些`要点`：

- `可视区域`： 做`绝对定位`，left、right、top 设置为 0
- `滚动区域`：用于`形成滚动条`，做绝对定位，`left、right、top` 设置为 0，`z-index:-1`
- `真实渲染区域`：滚动时使用`translate3d(x,y,z)`

具体步骤：

1. 计算当前可见区域起始数据的 `startIndex`
2. 计算当前可见区域结束数据的 `endIndex`
3. 计算当前可见区域的数据，并渲染到页面中
4. 计算 `startIndex` 对应的数据在整个列表中的偏移位置 `startOffset`，并设置到列表上
5. 在滚动的时候，修改`真实渲染区域`的 `transform: translate3d(0, y, 0)`

下面是一段示例代码：

```javascript
updateVisibleData(scrollTop) {
  scrollTop = scrollTop || 0;
  // 取得可见区域的可见列表项数量
  const visibleCount = Math.ceil(this.$el.clientHeight / this.itemHeight); 
  // 取得可见区域的起始数据索引
  const start = Math.floor(scrollTop / this.itemHeight); 
  // 取得可见区域的结束数据索引
  const end = start + visibleCount; 
  // 计算出可见区域对应的数据，让 Vue.js 更新
  this.visibleData = this.data.slice(start, end); 
  // 把可见区域的 top 设置为起始元素在整个列表中的位置（使用 transform 是为了更好的性能）
  this.$refs.content.style.webkitTransform = `translate3d(0, ${ start * this.itemHeight }px, 0)`; 
}
```

`动态高度`的场景：需要在渲染时`动态计算`每个列表项的高度，并根据`实际高度`进行渲染，下面是`updateVisibleData` 的一个思路。

```javascript
updateVisibleData(scrollTop) {
  scrollTop = scrollTop || 0;
  const start = this.findNearestItemIndex(scrollTop);
  const end = this.findNearestItemIndex(scrollTop + this.$el.clientHeight);
  this.visibleData = this.data.slice(start, Math.min(end + 1, this.data.length));
  // 通过具体方法来设计
  this.$refs.content.style.webkitTransform = `translate3d(0, ${         this.getItemSizeAndOffset(start).offset }px, 0)`; 
}
```

一个细节，`ios` 没法实时 触发 `scroll` 的问题？

- 使用 `iscroll` 或者 `better-scroll` 等成熟的第三方库
- `ontouchmove` 来兼容下
- `-webkit-overflow-scrolling:touch` 设置有`回弹效果`
   - `auto`: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。
   - `touch` , 有回弹效果

### 3.3. 其他的一些细节优化点

- 使用`骨架片`优化白屏
- 使用新的API，提高性能
	- `scroll` 时，使用 `requestAnimationFrame` 来包装回调
	- 或者做下`节流`
- 使用`缓存`，需要把`尺寸、偏移`等信息进行一个`缓存` 
- 图片`懒加载`

## 4. 其他的思路

- 使用`缓存` ，包括数据缓存，也包括重复利用节点等
- `懒加载` 与 `预加载`
- 减少 DOM 操作 ，精简 DOM 结构
- 使用`Web Worker` 将页面的`渲染`和`计算逻辑`分离开来
- 服务器端渲染 ， `SSR` 
- CSS
	- CSS布局优化，减少`回流`等 
	- CSS3硬件加速
- 优化渲染性能，比如`CSS样式优化`和 `JS性能优化`
- 图片优化 ， `懒加载`和`预加载` 及 `压缩` ，`缩略图` ， 图片格式比如 `WebP` 更小，`jpg` 更快渲染等
- 使用渐进式渲染 ，先渲染关键内容
- 新 API 使用，比如 `requestIdleCallback` 空闲时间再执行
- `HTTP`请求优化等

> [!tip]
  JPEG 格式不支持透明度设置

## 5. 最后

还是需要根据`实际情况` 选择 `ROI` 最佳的方案，找**主要矛盾**

> 注意，没必要过早优化，过早优化会导致很多问题
