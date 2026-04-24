# 微信小程序的双线程设计

`#移动端` `#小程序` 

## 1. 总结

- 目的
	1. 提升性能
	2. 增强**安全性**
- 两个线程
	- **渲染层（View 层）**
		- 页面渲染
	- **逻辑层（App Service）**
		- 独立运行的 JS 引起
- 如何通讯 → `WeixinJSBridge`
	1. 用户在视图层点击按钮
	2. 事件通过 `WeixinJSBridge` 传递到逻辑层
	3. 逻辑层处理后通过 `setData` 更新数据
	4. 数据变化通过 `WeixinJSBridge` 传回视图层
	5. 视图层重新渲染
- 其他
	- 这种设计虽然增加了一些开发成本，但带来的好处远大于弊端，是一个**权衡后的最优选择**。
	- 在开发时需要注意通信效率，合理使用 `setData`，避免传输过大的数据。


## 2. 两个线程分别是什么

- **渲染层（View 层）**
	- 负责页面渲染
	- 使用 WebView 线程
	- 处理视图相关的内容
- **逻辑层（App Service）**
	- 负责处理业务逻辑
	- 运行在独立的 `JavaScript` 引擎中（`JSCore`）
	- 处理数据和业务逻辑

## 3. 为什么要分开？

### 3.1. 性能考虑

- 避免单线程卡顿
- 当业务逻辑复杂时，不会影响页面渲染
- 当页面渲染压力大时，不会影响业务逻辑执行

### 3.2. 安全考虑

- **分离后可以阻止开发者直接操作 DOM**
- 避免恶意代码注入
- 更好的控制小程序的能力范围

## 4. 两个线程如何通信？ → `WeixinJSBridge`

```javascript
// 渲染层（WXML）
<button bindtap="handleClick">点击</button>

// 逻辑层（JS）
Page({
  handleClick() {
    // 修改数据
    this.setData({
      message: "Hello"
    })
  }
})
```

通信流程：
1. 用户在视图层点击按钮
2. 事件通过 `WeixinJSBridge` 传递到逻辑层
3. 逻辑层处理后通过 `setData` 更新数据
4. 数据变化通过 `WeixinJSBridge` 传回视图层
5. 视图层重新渲染

## 5. 优缺点分析

优点：
- 更好的性能表现
- 更高的安全性
- 职责分明，架构清晰

缺点：
- **通信成本高**
- setData 性能与数据量关系密切
- 开发时需要注意线程间通信的效率

## 6. 实践建议

1. 避免频繁 setData
2. 避免传输大量数据，即 setData 个别数据即可
3. 合并多次 setData

```javascript
// 1. 避免频繁 setData
// 错误示例
list.forEach(item => {
  this.setData({
    [`list[${index}]`]: item
  })
})

// 正确示例
this.setData({
  list: newList
})

// 2. 避免传输大量数据
// 错误示例
this.setData({
  entireObject: largeObject
})

// 正确示例
this.setData({
  'entireObject.neededField': newValue
})

// 3. 合并多次setData
// 错误示例
this.setData({ a: 1 })
this.setData({ b: 2 })
this.setData({ c: 3 })

// 正确示例
this.setData({
  a: 1,
  b: 2,
  c: 3
})
```
