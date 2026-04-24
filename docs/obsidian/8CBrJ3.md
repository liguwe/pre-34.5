# 回流和重绘

`#前端/CSS`   `#R2` 

## 1. 先看定义

- `回流（或重排）`：布局引擎会根据各种样式计算每个盒子在页面上的`大小与位置`
	- 重排（也称为回流）是浏览器重新计算页面中`元素位置和几何形状`的过程
- `重绘`：
	- 当计算好盒模型的`位置、大小及其他属性`后，浏览器根据每个盒子特性进行绘制
- `重绘`不一定导致`重排`，但`重排`一定会导致`重绘` ，如下图：

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/0e89990a6d49095e5a717c3af1edeb53.png)

## 2. 导致`回流`的场景

- 页面`首次渲染`
- 浏览器`窗口大小`发生改变
- 元素`尺寸或位置`发生改变
- 元素内容变化（`文字数量`或`图片大小`等等）
- 元素`字体大小`变化
- `添加或者删除`可见的DOM元素
- 激活CSS伪类（例如：`:hover`）
- `calc()` 本身不会引起 `回流`，
	- 但是因为需要重新计算布局的属性，比如父元素的宽度改变了，那必然会导致子元素的一个 `回流`
- `查询某些属性`或`调用某些方法`
   - `dom.style.width/height` ，只能取`行内样式的宽和高`，`style` 中 `link` 外链取不到。可写，修改时会导致`重排`
   - `window.getComputedStyle(dom).width/height`，指定`第二参数`指定一个要匹配的伪元素的字符串。必须对普通元素省略（`或null`） ，
      - 读取的样式是`最终样式`，包括了内联样式、嵌入样式和外部样式
      - 比如`getComputedStyle(h3, '::after').content` 
      - 会导致`回流` 因为它需要获取祖先节点的一些信息进行计算（譬如宽高等），为求一个`“即时性”`和`“准确性”`。
   - `dom.getBoundingClientRect().width/height 、top/left/right/bottom` 得到`渲染后的宽和高`，及`相对于视窗的上下左右`的距离
   - 获取`布局信息`时，会导致`重排`。相关的方法属性如 `offsetTop` `getComputedStyle` 等
   - `scrollIntoView()`、`scrollIntoViewIfNeeded()` 、 `scrollTo()` 滚动时，会导致`重排`


总之， `查询某些属性`或`调用某些方法` 是否会导致重排，关键需要看 `只读了` ，还是有`写入`操作

是否`即时计算`
- 另外一些容易被忽略的操作：如 getComputedStyle， offsetTop、offsetLeft、 offsetWidth、offsetHeight、scrollTop、scrollLeft、scrollWidth、scrollHeight、clientTop、clientLeft、clientWidth、clientHeight 这些属性有一个共性，就是需要通过`即时计算`得到。因此浏览器为了获取这些值，也会进行`回流`

## 3. opacity、display 和 visibility

- 修改 `opacity` 和 `visibility` 属性通常只会触发`重绘`，而不会触发`回流`
- 而修改 `display` 属性则可能会触发`回流和重绘`

![|600](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/d416ea83c9a78c5f5445f7568c9de8ba.png)

> - `opacity`为 0 ，可以点击
> - visibility 为 hidden时，不能点击

## 4. 修改 `left` 和 `right` 的影响

### 4.1. 对于绝对定位 (`position: absolute`) 和 固定定位 (`position: fixed`)的元素

> [!abstract]
>  > **结论： 对于脱离文档流的元素：一般不会引起文档流的重排，但会导致该元素的重绘。**

- 这些元素脱离正常文档流，它们的布局不再影响和被其他元素影响
- 对于脱离文档流的元素（如`position: absolute`或`position: fixed`）
	- 修改`left`和`right`属性通常直接影响该元素本身的位置，而不会影响到其他元素的布局，因此**不会引起整体布局的重排**
	- 然而，依然会 **导致该元素的重绘（repaint），但不涉及到重排（reflow）**

### 4.2. 对于对于未脱离文档流的元素（如`position: relative`）

- 可能会导致该元素及其子元素的重排
- 元素本身改变了，自然有可能导致整个文档的重排

### 4.3. 对于 `position: sticky` 的元素

#### 4.3.1. `position: sticky` 的特性

- 当元素在容器视口内时，它表现为相对定位（`relative`）。
- 一旦元素滚动到指定偏移位置，它就表现为固定定位（`fixed`），即相对于视口定位。

#### 4.3.2. 相对定位阶段（在容器视口内）

- 元素还未达到指定的偏移位置，此时与普通的`相对定位`元素非常相似。
- 修改 `left` 和 `right` 会影响元素的位置，因此可能会引发重排（reflow）。

#### 4.3.3. 固定定位阶段（到达偏移位置）

- 元素达到偏移位置，变为相对视口定位。
- 修改 `left` 和 `right` 的行为更像是**固定定位**，通常不影响其他元素的布局。
- 这种情况下，可能只会导致重绘（repaint），不会引发重排。

### 4.4. 总结

- 对于已经脱离文档流的元素（如 position: absolute 或 fixed）
	- 仅修改 `left` 和 `right` 的值通常不会导致其他元素的回流，但可能会导致该元素本身的重绘。
- 对于` position: relative` 来说，会导致
- 对于 `position: sticky` 看属于那个阶段

## 5. 一些优化建议

### 5.1. `transform` 代替 `top/left` 

### 5.2. 避免使用`CSS表达式`（如：`calc()`）

### 5.3. 批量修改 DOM

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
document.getElementById('myList').appendChild(fragment);
```

   - 使用文档片段(`DocumentFragment`) 或者 **先将元素设为不可见**，进行多次修改后再显示。

### 5.4. 避免频繁操作样式

```javascript hl:8
// 不推荐
const el = document.getElementById('myElement');
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
el.style.padding = '5px';

// 推荐
el.style.cssText = 'border-left: 1px; border-right: 2px; padding: 5px;';
// 或者
el.classList.add('my-class');
```

- 合并多次样式修改**一次性修改**。
- 使用类名替代多次样式修改。
- `classList.add/remove/toggle` 来切换样式，而不是直接修改` style 属性`

### 5.5. 缓存布局信息：批量修改

```javascript hl:1,7
// 不推荐： 获取了 100 次 element.offsetLeft 
for (let i = 0; i < 100; i++) {
  element.style.left = `${element.offsetLeft + 1}px`;
}

// 推荐
let left = element.offsetLeft;
for (let i = 0; i < 100; i++) {
  left++;
  element.style.left = `${left}px`;
}
```

- **避免多次读取会引发重排的属性**

### 5.6. 使用绝对定位使元素脱离文档流

- 对于频繁重排的元素，可以使用绝对定位使其脱离文档流。
- `position: absolute、fixed ` 脱离文档流，以避免对其他元素布局的影响。

### 5.7. 优化动画

```javascript
function animate() {
  // 动画逻辑
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

- 使用 `requestAnimationFrame` 来控制动画
- 使用 CSS3 动画和 `transforms` 替代 JavaScript 动画

### 5.8. 使用 CSS3 硬件加速

```css
.move {
  transform: translateX(100px);
}
```

使用 transform、opacity、filters 等属性，触发 GPU 加速。

使用`css3硬件加速`，`可以让transform`、`opacity`、`filters` 这些动画不会引起`回流重绘`

### 5.9. 避免使用 `table` 布局

- 表格布局可能导致多次重排

### 5.10. 降低 CSS 选择器的复杂性

复杂的选择器会增加样式计算时间。

### 5.11. 离线操作：使用 `display: none` 进行大量 DOM 操作

```javascript
const el = document.getElementById('myElement');
el.style.display = 'none';
// 进行大量 DOM 操作
el.style.display = 'block';
```

> 当元素设为 `display: none` 时，对其进行的操作不会引发重排和重绘。

### 5.12. 使用虚拟 DOM

- 像 React、Vue 这样的框架使用`虚拟 DOM` 来优化实际 DOM 操作

### 5.13. 使用防抖(Debounce)和节流(Throttle)

对于频繁触发的事件（如滚动、调整窗口大小等），使用这些技术来限制处理函数的执行频率

### 5.14. 分离读写操作

```javascript
// 不推荐
const h1 = element1.clientHeight;
element1.style.height = `${h1 * 2}px`;
const h2 = element2.clientHeight;
element2.style.height = `${h2 * 2}px`;

// 推荐
const h1 = element1.clientHeight;
const h2 = element2.clientHeight;
element1.style.height = `${h1 * 2}px`;
element2.style.height = `${h2 * 2}px`;
```

先进行**所有的读操作**，然后再进行**写操作**，避免读写交叉导致多次重排

> 在实际应用中，应根据具体情况选择合适的优化方法。
