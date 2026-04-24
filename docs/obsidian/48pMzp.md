# Vue3 中 Transition 组件的实现原理

`#vue` 

## 1. 总结

- 动效事件
	- `transitionend` ：监听 CSS transition 完成的事件
	- `transitioncancel` ：监听 CSS transition 取消的事件
- 每一帧的处理逻辑
	- JavaScript → Style → Layout → Paint → Composite
- 两次 `requestAnimationFrame`？
	- 第一帧用于应用改变
	- 第二帧用于安全地读取更新后的值
- **Transition 组件**的**核心原理**是：
	- 当 DOM 元素被`挂载时`
		- 将**动效**附加到该 DOM 元素上；
	- 当 DOM 元素被`卸载时`
		- 不要立即卸载 DOM 元素，而是等到附加到该 DOM 元素上的**动效执行完成后**再卸载它

## 2. 核心原理

Transition 组件的实现比想象中简单得多，它的**核心原理**是：
- 当 DOM 元素被`挂载时`
	- 将**动效**附加到该 DOM 元素上； 
- 当 DOM 元素被`卸载时`
	- 不要立即卸载 DOM 元素，而是等到附加到该 DOM 元素上的**动效执行完成后**再卸载它。

## 3. 原生 DOM 的过渡实现原理

简单说就是，如果使用 JS 为 DOM 元素添加进场和离场的动效。

![|720](https://832-1310531898.cos.ap-beijing.myqcloud.com/545fb51c3790dac61166a5a7ae72d606.png)

但上面的代码，我们执行会发现不符合预期，这是因为都是`当前帧`绘制了，下面的代码就符合预期

![|672](https://832-1310531898.cos.ap-beijing.myqcloud.com/b34413de3d3674ef0ce3ec8b64afda80.png)

 

### 3.1. 为什么 `requestAnimationFrame` 要嵌套两次？

```javascript
// 一帧的处理流程
JavaScript → Style → Layout → Paint → Composite

// 第一帧
rAF(() => {
  // 在这里修改 DOM
  element.style.width = '100px'
  // 这些修改会在当前帧末尾应用
})

// 第二帧
rAF(() => {
  // 这时 DOM 已经更新完成
  // 可以安全地读取新的 DOM 状态
})

总结：
1. 双重 rAF 确保 DOM 更新完成后再读取
2. 第一帧用于应用改变
3. 第二帧用于安全地读取更新后的值
4. 主要用于需要精确测量 DOM 变化的场景
5. 在简单的动画或不需要测量的场景下，单次 rAF 就足够了
```


最后 通过监听元素的 `transitionend 事件`来完成收尾工作，如下：

![|720](https://832-1310531898.cos.ap-beijing.myqcloud.com/c533b909a9f09e46fb8c4e81251ae13c.png)

所以总结下就是三个阶段：

- beforeEnter 阶段：
	- 添加 enter-from 和 enter-active 类。 
- enter 阶段：
	- 在下一帧中移除 enter-from 类，添加 enter-to。 
- 进场动效结束：
	- 移除 enter-to 和 enter-active 类

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/6411de1206e237b995eb09b237262567.png)

## 4. 最终代码，再封装

```html
<head>
<style>
.box {
  width: 100px;
  height: 100px;
  background-color: red;
}

.enter-active, .leave-active {
  transition: transform 1s ease-in-out;
}
.enter-from, .leave-to {
  transform: translateX(200px);
}
.enter-to, .leave-from {
  transform: translateX(0);
}
</style>

</head>

<body>

<div id="app"></div>

<script>

const container = document.querySelector('#app')

const el = document.createElement('div')
el.classList.add('box')

// before enter
el.classList.add('enter-from')
el.classList.add('enter-active')

container.appendChild(el)
// enter
nextFrame(() => {
  el.classList.remove('enter-from')
  el.classList.add('enter-to')

  el.addEventListener('transitionend', () => {
    el.classList.remove('enter-to')
    el.classList.remove('enter-active')
  })
})


function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

el.addEventListener('click', () => {
  const performRemove = () => el.parentNode.removeChild(el)
  el.classList.add('leave-from')
  el.classList.add('leave-active')

  // document.body.offsetHeight

  nextFrame(() => {
    el.classList.remove('leave-from')
    el.classList.add('leave-to')

    el.addEventListener('transitionend', () => {
      el.classList.remove('leave-to')
      el.classList.remove('leave-active')

      performRemove()
    })
  })
})

</script>

</body>

```

>  注：`nextFrame` 的实现有两个 `requestAnimationFrame` 嵌套

## 5. Transition 组件的实现原理

更多参考流程图：

[https://www.figma.com/file/yadsH3JL06697MH3uWxPXd/2023.06.LOG?type=whiteboard&node-id=20-77&t=h8yXeRi9xblhKVhW-4](https://www.figma.com/file/yadsH3JL06697MH3uWxPXd/2023.06.LOG?type=whiteboard&node-id=20-77&t=h8yXeRi9xblhKVhW-4)

### 5.1. 总结

Transition 组件的实现原理：
- 我们将过渡相关的钩子函数定义到虚拟节点的 `vnode.transition对象`中。
- 渲染器在执行`挂载和卸载`操作时，会优先检查该虚拟节点是否需要进行过渡，
- 如果需要， 则会在`合适的时机`执行 `vnode.transition 对象`中定义的过渡相关钩子函数。
	- 这些钩子函数主要是添加一些动画信息

> 更形象的参考流程图

## 6. 附：`transitionend` 事件介绍

- `transitionend` 是一个监听 CSS transition 完成的事件
- `transitioncancel`

### 6.1. 基本用法

```javascript
element.addEventListener('transitionend', (event) => {
    // transition 结束时触发
    console.log('过渡完成');
    console.log('属性名:', event.propertyName);
    console.log('过渡时长:', event.elapsedTime);
});
```

### 6.2. 事件属性

```javascript
// transitionend 事件对象包含以下重要属性：
{
    propertyName: 'transform',  // 发生过渡的 CSS 属性名
    elapsedTime: 1.5,          // 过渡持续时间（秒）
    pseudoElement: '',         // 触发过渡的伪元素
    target: element           // 触发过渡的元素
}
```

### 6.3. 使用场景

#### 6.3.1. 基础动画完成检测

```javascript
const box = document.querySelector('.box');

box.addEventListener('transitionend', () => {
    // 动画完成后执行
    box.classList.add('animation-completed');
});

// 触发动画
box.classList.add('animate');
```

#### 6.3.2. 多属性过渡

```javascript
// CSS
.box {
    transition: width 0.3s, height 0.5s, background-color 1s;
}

// JavaScript
let completedTransitions = 0;
element.addEventListener('transitionend', (e) => {
    completedTransitions++;
    
    // 所有过渡都完成时
    if (completedTransitions === 3) {
        console.log('所有过渡都完成了');
        completedTransitions = 0;
    }
});
```

#### 6.3.3. 链式动画

```javascript
const element = document.querySelector('.element');

element.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'width') {
        // 宽度过渡完成后开始高度过渡
        this.style.height = '200px';
    } else if (e.propertyName === 'height') {
        // 高度过渡完成后改变颜色
        this.style.backgroundColor = 'blue';
    }
});

// 开始第一个过渡
element.style.width = '300px';
```

### 6.4. 注意事项

#### 6.4.1. 过渡被中断

```javascript
// 过渡中断时不会触发 transitionend
element.addEventListener('transitionend', () => {
    console.log('可能不会执行');
});

element.style.width = '200px';
// 立即改变其他属性会中断过渡
setTimeout(() => {
    element.style.display = 'none';
}, 100);
```

#### 6.4.2. 使用 transitioncancel

```javascript
// 监听过渡取消事件
element.addEventListener('transitioncancel', () => {
    console.log('过渡被取消');
});
```

#### 6.4.3. 零时长过渡

```javascript
// 过渡时间为 0 时不会触发 transitionend
.instant {
    transition: width 0s;
}
```

### 6.5. 完整示例

```html
<style>
.box {
    width: 100px;
    height: 100px;
    background: red;
    transition: all 0.3s ease;
}

.box.active {
    width: 200px;
    height: 200px;
    background: blue;
}
</style>

<div class="box"></div>

<script>
const box = document.querySelector('.box');
let isAnimating = false;

box.addEventListener('transitionend', (e) => {
    console.log(`${e.propertyName} 过渡完成`);
    isAnimating = false;
});

box.addEventListener('click', () => {
    if (!isAnimating) {
        isAnimating = true;
        box.classList.toggle('active');
    }
});
</script>
```

### 6.6. 兼容性检查

```javascript
function supportsTransitionEnd() {
    const style = document.createElement('div').style;
    return 'transition' in style ||
           'WebkitTransition' in style ||
           'MozTransition' in style;
}

if (supportsTransitionEnd()) {
    // 支持 transition
} else {
    // 降级处理
}
```
