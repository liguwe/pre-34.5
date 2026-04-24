# 哪些事件不会冒泡的事件，以及为什么不支持冒泡？

`#dom` `#bom` `#R1` 

## 1. 事件传播的三个阶段

事件传播分为三个阶段：

```javascript
// 事件传播示意
/*
1. 捕获阶段（Capturing Phase）：从顶层元素向下传播
2. 目标阶段（Target Phase）：到达目标元素
3. 冒泡阶段（Bubbling Phase）：从目标元素向上传播
*/

document.addEventListener('click', function(e) {
    console.log('捕获阶段');
}, true); // 第三个参数 true 表示在捕获阶段处理

element.addEventListener('click', function(e) {
    console.log('目标阶段');
});

document.addEventListener('click', function(e) {
    console.log('冒泡阶段');
}, false); // 默认是冒泡阶段
```

## 2. 不冒泡的事件列表

以下事件不会冒泡：

- a) 焦点事件：
	- `focus`  
		- 如果 focus 冒泡，当输入框获得焦点时，所有父元素都会收到通知
		- **额外的性能开销**
	- blur
- b) 资源事件： → **加载完了，没必要再冒泡了**
	- load
	- unload
	- abort
	- error
- c) 鼠标事件： **enter 和 leave**  →  逻辑合理性，不然矛盾了
	- `mouseenter`
	- `mouseleave`
- d) 媒体事件：
	- pause
	- play
	- playing
	- ended
	- volumechange
	- stalled

> 这些事件**只在目标元素上触发**

示例代码：

```javascript
// 焦点事件示例
document.querySelector('input').addEventListener('focus', function(e) {
    console.log('Input focused');
    console.log('这个事件不会冒泡到父元素');
});

// mouseenter/mouseleave vs mouseover/mouseout
const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

// mouseenter 不冒泡
parent.addEventListener('mouseenter', () => {
    console.log('Parent mouseenter'); // 只在真正进入父元素时触发一次
});

// mouseover 会冒泡
parent.addEventListener('mouseover', () => {
    console.log('Parent mouseover'); // 进入子元素时也会触发
});
```

## 3. 为什么某些事件不冒泡？

主要有以下几个原因：

### 3.1. 性能考虑

```javascript hl:8
// 想象如果 focus 事件冒泡会发生什么
<div>
    <div>
        <input id="myInput" />
    </div>
</div>

// 如果 focus 冒泡，当输入框获得焦点时，所有父元素都会收到通知
// 这会导致不必要的性能开销
```

### 3.2. 逻辑合理性

```javascript hl:7
// 以 mouseenter 为例
<div class="parent">
    <div class="child"></div>
</div>

// mouseenter 不冒泡是合理的，因为：
// 1. 从 parent 进入 child 时，鼠标实际上并没有"进入"父元素
// 2. 如果冒泡，会导致父元素重复触发 mouseenter 事件
```

### 3.3. 事件本身的特性

```javascript hl:4
// 例如 load 事件
<img src="example.jpg" onload="handleLoad()">

// load 事件表示资源加载完成
// 这是一个一次性的状态变化，没有必要向上冒泡
```

## 4. 如何处理不冒泡的事件

### 4.1. 使用捕获阶段

```javascript
// 如果确实需要在父元素捕获子元素的 focus 事件
parent.addEventListener('focus', function(e) {
    console.log('Focus captured');
}, true); // 使用捕获阶段
```

### 4.2. 使用替代事件

```javascript hl:2
// 使用 focusin/focusout 代替 focus/blur
// focusin/focusout 是会冒泡的
element.addEventListener('focusin', function(e) {
    console.log('Focus detected');
});
```

### 4.3. 事件委托的替代方案

#### 4.3.1. 对于不冒泡的事件，可以使用 `MutationObserver` 来监听

```javascript
// 对于不冒泡的事件，可以使用 MutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'focused') {
            // 处理焦点变化
        }
    });
});

observer.observe(element, {
    attributes: true,
    attributeFilter: ['focused']
});
```

## 5. 最佳实践

### 5.1. 选择合适的事件

```javascript hl:6
// 不好的实践
document.addEventListener('mouseenter', function(e) {
    // 试图通过事件委托处理子元素的 mouseenter
}, false);

// 好的实践
document.addEventListener('mouseover', function(e) {
    // 使用冒泡事件实现类似功能
}, false);
```

### 5.2. 使用事件委托时注意

```javascript
// 正确的事件委托
document.addEventListener('click', function(e) {
    if (e.target.matches('.button')) {
        // 处理按钮点击
    }
});

// 对于不冒泡的事件，直接绑定到目标元素
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', handleFocus);
});
```

## 6. 检测事件是否冒泡

```javascript hl:7,11
// 检测事件是否冒泡
function isEventBubbling(eventName) {
    const element = document.createElement('div');
    let bubbles = false;
    
    element.addEventListener(eventName, function(e) {
        bubbles = e.bubbles;
    });
    
    // 触发事件
    const event = new Event(eventName, {
        bubbles: true,
        cancelable: true
    });
    element.dispatchEvent(event);
    
    return bubbles;
}

// 使用示例
console.log(isEventBubbling('click')); // true
console.log(isEventBubbling('focus')); // false
```
