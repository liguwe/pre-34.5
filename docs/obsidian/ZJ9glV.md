# Vue3中 Teleport 组件的实现原理

`#vue` 

## 1. 总结

- 弹框场景就经常使用
- 将 `Teleport 组件`的**渲染逻辑**从渲染器中分离出来，这么做有**两点好处**：
	- **①** 可以**避免渲染器逻辑代码“膨胀”**
	- **②** **方便TreeShaking**：
		- 当用户没有使用 `Teleport` 组件时，由于 `Teleport` 的渲染逻辑被分离
		- 因此可以利用 `TreeShaking` 机制在最终的 bundle 中删除 Teleport 相关的代码，使得最终构建包的体积变小

## 2. 使用场景

> 简单说就是，蒙层 `z-index` 的问题，所以必须渲染到 `body` 或者挂载到父元素上才行，vue3 本身提供内部组件来支持这个功能

## 3. 定义

```typescript
interface TeleportProps {
  /**
   * 必填项。指定目标容器。
   * 可以是选择器或实际元素。
   */
  to: string | HTMLElement
  /**
   * 当值为 `true` 时，内容将保留在其原始位置
   * 而不是移动到目标容器中。
   * 可以动态更改。
   */
  disabled?: boolean
  /**
   * 当值为 `true` 时，Teleport 将推迟
   * 直到应用的其他部分挂载后
   * 再解析其目标。(3.5+)
   */
  defer?: boolean
}
```

## 4. 实现渲染逻辑分离

将 Teleport 组件的**渲染逻辑**从渲染器中分离出来，这么做有两点好处：

- 可以**避免渲染器逻辑代码“膨胀”**； 
- **方便TreeShaking**：
	- 当用户没有使用 Teleport 组件时，由于 `Teleport` 的渲染逻辑被分离，因此可以利用 `TreeShaking` 机制在最终的 bundle 中删除 Teleport 相关的代码，使得最终构建包的体积变小

下面是 patch 函数：

![|608](https://832-1310531898.cos.ap-beijing.myqcloud.com/157ea664c2294a84c81ee0dba0120952.png)

## 5. 以下面模板为示例

![|472](https://832-1310531898.cos.ap-beijing.myqcloud.com/43dac0ddd96491945eff4ff8a1f2770c.png)

所以具体对应的 vdom 如下：

![|536](https://832-1310531898.cos.ap-beijing.myqcloud.com/f25fb6a62f4fc44e773d798c7cc4227b.png)

## 6. 最终代码

```javascript
const Teleport = {
  __isTeleport: true,
  process(n1, n2, container, anchor, internals) {
    const { patch, patchChildren, move } = internals
    if (!n1) {
      // 挂载
        // 使用 to属性 去查找 DOM 节点
      const target = typeof n2.props.to === 'string'
        ? document.querySelector(n2.props.to)
        : n2.props.to
      n2.children.forEach(c => patch(null, c, target, anchor))
    } else {
      // 更新
      patchChildren(n1, n2, container)
      if (n2.props.to !== n1.props.to) {
          // :::: 使用 to属性 去查找 DOM 节点
        const newTarget = typeof n2.props.to === 'string'
          ? document.querySelector(n2.props.to)
          : n2.props.to
        n2.children.forEach(c => move(c, newTarget))
      }
    }
  }
}
```

## 7. 最后

看看 `Teleport` 单词含义：

v. 心灵运输（物体、人）；远距离传送
n. 通信卫星；心灵传输

**即，Teleport组件 将模板渲染到其他节点下，即跨越 DOM 层级渲染**
