# Vue3 渲染器的原理和实现

`#vue` `#vue3` 

## 1. 总结

- 渲染器的作用是将 `虚拟 DOM对象` 渲染为 `真实DOM元素`
	- 其核心在于更新时的 Diff 算法
- 如何实现一个**跨平台渲染器**，即不依赖于`具体宿主`
	- 如 浏览器的 `DOM API`
	- 或 Node.js 端
	- 或 客户端 等
	- 或 **小程序** 等
	- 实现跨平台渲染器的关键是 **将渲染操作抽象为可配置的对象**
		- `const renderer = createRenderer(创建元素方法、插入元素方法、设置文本方法等)`
- 属性处理：
	- 需要区分 HTML Attributes 和 DOM Properties
	- 并正确处理特殊属性如 class 和 style。
- 事件处理采用**特殊的设计**来优化性能并解决事件冒泡和更新时机的问题
	- `on` 开头的属性才需要处理
		- `invokers：事件处理函数` 用于处理事件回调函数
			- `invokers[key]` 
				- `key` 代表 `事件名称` 
			- `真正的事件 callback` 存在 `invokers.value` 中
	- **规避性能问题**：比如更新事件时，直接更新 `invokers.value` 即可
		- 没必要每次都调用 `removeEventListener` 来移除上一次绑定的事件
- **子节点更新**涉及多种情况，需要正确处理新旧节点的变化
	- 一共**六种情况**
		- 6种情况：`【新节点、老节点】 * 【文本节点、一组节点、null】`
- 特殊节点如文本节点、注释节点和 Fragment 需要特殊处理
	- 使用 `symbol` 
- Vue3 的渲染器设计考虑了性能优化、跨平台兼容性和特殊场景的处理
- 渲染器的实现涉及多个方面，包括挂载、更新、卸载等操作的细节处理
	- 比如**卸载时**，需要执行相应的钩子函数
- Fragment 的存在简化了组件的结构
	- 类似于 React 的空标签 或 Fragment 组件
	- 在挂载、更新、卸载操作是，**不处理它本身**，**只处理它的子节点**即可

## 2. 何为渲染器？

以`浏览器平台`来说，如下的`rendere r函数`就是一个`渲染器` 。

```js
function renderer(domString, container) {
  container.innerHTML = domString
}

renderer(`<h1>hello app</h1>`, document.getElementById('app'));
```

- 渲染器的作用是，把**虚拟DOM 对象渲染为真实 DOM元素**
- 它的**工作原理**是
	- **递归地遍历虛拟DOM对象，并调用原生 DOM API 来完成真实 DOM 的创建**
- 渲染器的**精髓**在于后续的更新
	- 它会通过 **Diff 算法** 找出变更点，并且只会更新需要更新的内容

## 3. 渲染器与响应式系统

即结合 `响应式能力`，实现 `自动`调用渲染器完成渲染和更新
- 即变量变了，UI 主动更新

如下代码，使用 `effect`, `ref` 两个变量。

```vue hl:8,18,23

<div id="app"></div>

<script src="https://unpkg.com/@vue/reactivity@3.0.5/dist/reactivity.global.js"></script>

<script>

// ::::暴露的全局 API
const { effect, ref } = VueReactivity; 

function renderer(domString, container) {
  container.innerHTML = domString
}

const count = ref(1)

effect(() => {
  renderer(`<h1>${count.value}</h1>`, document.getElementById('app'))
})

count.value++

// 2s后更新
setTimeout(() => {
    count.value++;
},2000)

</script>
```

## 4. 渲染的一些基本概念

- `渲染器`与`渲染`
	- 名词 和 动词 的区别
- `挂载`
	- 即 `mount` ，将 `虚拟 DOM` 渲染成 `真实 DOM 节点`
- `容器`
	- 即渲染`到哪儿`？

下面来看一个如何实现一个**渲染器函数**

- `createRender`

```vue hl:42
<div id="app"></div>

<script src="https://unpkg.com/@vue/reactivity@3.0.5/dist/reactivity.global.js"></script>

<script>
    function createRenderer() {
        /**
         * @desc 补丁函数
         * @param {VNode} oldNode 旧的 VNode
         * @param {VNode} newNode 新的 VNode
         * @param {HTMLElement} container 容器
         * */
        function patch(oldNode, newNode, container) {
        
        }
        function render(vnode, container) {
	        // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数进行打补丁
            if (vnode) {
                patch(container._vnode, vnode, container);
            } else {
                if (container._vnode) { // 卸载操作
                    // 旧 vnode 存在，且新 vnode 不存在，说明是 卸载(unmount)操作
                    // 只需要将 container 内的 DOM 清空即可
                    container.innerHTML = ''
                }
            }
            // 把 vnode 存储到 container._vnode 下，即后续渲染中的旧 vnode
            container._vnode = vnode
        }
        // 服务端渲染时会用到
        function hydrate() {
        
        }
        return {
            render,
            hydrate
        }
    }
    
    const renderer = createRenderer()
    // 三次渲染，都渲染到#app上 
    // 首次渲染
    renderer.render(vnode1, document.querySelector('#app'))
    // 第二次渲染
    renderer.render(vnode2, document.querySelector('#app'))
    // 第三次渲染
    renderer.render(null, document.querySelector('#app'))
    
</script>
```

## 5. 实现一个极简跨平台渲染器

- 如何实现一个渲染器，即不依赖于`具体宿主`
	- 如 浏览器的 `DOM API`
	- 或 Node.js 端
	- 或 客户端 等
	- 或 **小程序** 等

```js hl:26,27
function createRenderer(options) {
    // ::::为了实现跨平台，将渲染器的操作抽象为 options 对象::::
    // 如：创建元素 createElement，
    // 如：设置元素文本 setElementText
    // 如：插入元素 insert
    const {
        createElement,
        insert,
        setElementText
    } = options;
    
    function mountElement(vnode, container) {
        
        // 这里的 createElement 依赖于具体宿主
        const el = createElement(vnode.type)
        
        // 说明是文本内容，调用 setElementText 插入
        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children)
        }
        
        insert(el, container)
    }
    
    function patch(n1, n2, container) {
        // 真正的挂载操作
        if (!n1) {
            mountElement(n2, container)
        } else {
            // n1 存在，这里需要打补丁
        }
    }
    
    function render(vnode, container) {
        if (vnode) {
            // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数进行打补丁
            patch(container._vnode, vnode, container)
        } else {
            if (container._vnode) {
                // 旧 vnode 存在，且新 vnode 不存在，说明是卸载(unmount)操作
                // 只需要将 container 内的 DOM 清空即可
                container.innerHTML = ''
            }
        }
        // 把 vnode 存储到 container._vnode 下，即后续渲染中的旧 vnode
        container._vnode = vnode
    }
    
    return {
        render
    }
}
```

上面代码把`创建、修改、及删除操作`等抽象成可配置的对象

### 5.1. 浏览器端

比如在浏览器环境下，调用`浏览器`特定的 `DOM API` ，如下代码：

```js
const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  }
})

const vnode = {
    type: 'h1',
    children: 'hello'
}

renderer.render(vnode, document.querySelector('#app'))

```

### 5.2. Nodejs 端

而在 `Nodejs 环境`下，如下代码：

```js

const renderer2 = createRenderer({
    createElement(tag) {
        console.log(`创建元素 ${tag}`)
        return {tag}
    },
    setElementText(el, text) {
        console.log(`设置 ${JSON.stringify(el)} 的文本内容：${text}`)
        el.text = text
    },
    insert(el, parent, anchor = null) {
        console.log(`将${JSON.stringify(el)}添加到${JSON.stringify(parent)} 下`)
        parent.children = el
    }
});

const container = {type: 'root'};
renderer2.render(vnode, container);
```

## 6. 如何挂载 `子节点` 及 `子节点的属性`

### 6.1. 首先看如何挂载子节点

以下是是一个能够跑起来的 `最简易的 DEMO` :

```js hl:23,16,25,15
<div id="app"></div>

<script src="https://unpkg.com/@vue/reactivity@3.0.5/dist/reactivity.global.js"></script>

<script>
    function createRenderer(options) {
        const {
            createElement,
            insert,
            setElementText
        } = options
        function mountElement(vnode, container) {
            const el = createElement(vnode.type)
            if (typeof vnode.children === 'string') {
                setElementText(el, vnode.children)
                // 递归渲染子节点即可
            } else if (Array.isArray(vnode.children)) {
                vnode.children.forEach(child => {
                    patch(null, child, el)
                })
            }
            // 设置属性
            if (vnode.props) {
                for (const key in vnode.props) {
                    el.setAttribute(key, vnode.props[key])
                }
            }
            // 插入到容器中
            insert(el, container)
        }
        function patch(n1, n2, container) {
            if (!n1) {
                mountElement(n2, container)
            } else {
                // // ::::补丁逻辑
            }
        }

        function render(vnode, container) {
            if (vnode) {
                // 新 vnode 存在，将其与旧 vnode 一起传递给 patch 函数进行打补丁
                patch(container._vnode, vnode, container)
            } else {
                if (container._vnode) {
                    // 旧 vnode 存在，且新 vnode 不存在，说明是卸载(unmount)操作
                    // 只需要将 container 内的 DOM 清空即可
                    container.innerHTML = ''
                }
            }
            // 把 vnode 存储到 container._vnode 下，即后续渲染中的旧 vnode
            container._vnode = vnode
        }

        return {
            render
        }
    }
    const renderer = createRenderer({
        createElement(tag) {
            return document.createElement(tag)
        },
        setElementText(el, text) {
            el.textContent = text
        },
        insert(el, parent, anchor = null) {
            parent.insertBefore(el, anchor)
        }
    })
    const vnode = {
        type: 'div',
        props: {
            id: 'foo'
        },
        children: [
            {
                type: 'p',
                children: 'p tag'
            },
            {
                type: 'h1',
                children: 'H1 tag'
            },
            {
                type: 'div',
                children: [
                    {
                        type: 'span',
                        children: 'div > span > tag'
                    }
                ]
            }
        ]
    }
    renderer.render(vnode, document.querySelector('#app'))

</script>
```

下图是最终`渲染的效果`：

![](https://od-1310531898.cos.ap-beijing.myqcloud.com/202305232003540.png)

两个注意点：

- 递归逻辑：如果存在 `children` 则接着遍历
- 设置属性使用 `el.setAttribute(key,value)` 
	- 我们也可以使用 `el[key] = value` 的方式
	- 但是，**为元素设置属性比想象中的更复杂得多**

下面先区分 `HTML Attributes` 和 `DOM Properities`

### 6.2. `HTML Attributes` 和 `DOM Properities` 不一样

浏览器解析完以下 `HTML代码段` 后，会创建以之相符的 `DOM 元素对象` ，比如
- `id="app"` 对应 `el.id`
- `class="green"` 对应 `el.className` ，说明两者并不是一一对应的。

```html
<div id="app" class="green"></div>

<div data-a="3" mmm="asdf" draggable="true"></div>

<form id="aaa"></form>
```

又比如下面的 HTML 片段，把 `foo` 改成 `bar`

```html
<!-- 如果 foo 改成 bar -->
<input value="foo" form="aaa"/>
```

- `el.getAttribute('value')` 和 `el.defaultValue` 始终是 `foo`
- 只有 `el.value` 为修改的值

又比如修改上面 input 的 type 值： `el.type = 'xxx'` ，浏览器会**矫正**这个不合法的 `xxx` 为 `text`

> [!abstract]
> 
**综上：** `HTML Attributes` **是为** `DOM Properities`**设置**`初始值`**的**

### 6.3. 如何正常的设置属性

比如如下 `vnode` 
- `disabled` 需要处理成 布尔值

```js
const vnode = {
  type: 'button',
  props: {
    disabled: '' // 需要处理成 false 
  },
  children: 'Button'
}
```

```js
// form 是只读的，只能通过 setAttribute 来设置
function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false
  return key in el
}

// 省略了很多逻辑
if (vnode.props) {
  for (const key in vnode.props) {
	patchProps(el, key, null, vnode.props[key])
  }
}

// 下面是传入的 patchProp 的场景
patchProps(el, key, preValue, nextValue) {
    if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      // 兼容 el.disabled = false 这种情况, 以及 el.disabled = '' 这种情况
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
```

上面代码展示了如何正确设置属性，即根据不同的标签类型，使用不同的设置属性的方法，另外需要关注下更新前后的值，如 `preValue, nextValue`

> 上面代码只展示了关键逻辑部分

## 7. `class属性` 与 `style 属性` 的处理

如下节点，我们希望挂载子节点的 class 属性，并且做增强

```js
const vnode = {
  type: 'p',
  props: {
    class: 'foo bar baz',
    class: {'foo': true},
    class: ['foo bar baz','abc'],
  },
  children: 'text'
}
```

主要逻辑如下：

```js
  patchProps(el, key, preValue, nextValue) {
    //************** here 这里  ************//
    if (key === 'class') {
      el.className = nextValue
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  }
```

- 这里为什么要使用 `className` ，
	- 而不是 `el.classList` 和`setAttribute('class','xxxx')` 
		- 因为`性能更优` 

另外，vue 也对 `style` 属性做了些增强，支持 `对象和字符串` 

## 8. 如何卸载一个节点

前面，我们自己通过 `InnerHTML` 的方式来卸载，有以下问题

1. 这个组件可能由多个组件组成，`没办法细粒度的控制每个组件的卸载`，即不能正确调用 `钩子生命周期函数`，如 `beforeUnmount` 或者 `unmounted` 等
2. 有些元素存在`指令`，卸载时，应该正确执行对应的 `指令钩子函数`
3. 没法正确移除 DOM 上绑定的`事件`

所以，我们需要通过以下方式来实现：

```js hl:6
function unmount(vnode) {
    const parent = vnode.el.parentNode
    if (parent) {
        parent.removeChild(vnode.el)
    }
    // 在这里，我们可以调用该节点树下的指令钩子函数 和 生命周期函数
}

function render(vnode, container) {
    if (vnode) {
        patch(container._vnode, vnode, container)
    } else {
        if (container._vnode) {
            // 旧 vnode 存在，且新 vnode 不存在，说明是卸载(unmount)操作
            unmount(container._vnode)
        }
    }
    // 把 vnode 存储到 container._vnode 下，即 后续渲染中的旧 vnode
    container._vnode = vnode
}
```

单独提出 `unmount` ，好处是：我们可以调用该节点树下的指令钩子函数 和 生命周期函数

>[!info]  
其实，卸载时，真正还有很多事情要搞，比如遍历 `虚拟 DOM树节点`，`递归卸载`子元素等等，这里只是给了一个简单的说明

## 9. 为什么要区分 vnode 的 类型 ?

看下面一个例子：

```js
const vnode = {
    type: 'p',
    props: {
        class: 'foo bar baz'
    },
    children: 'text'
}
renderer.render(vnode, document.querySelector('#app'))

const newVnode = {
    type: 'div',
    props: {
        id: 'foo'
    },
    children: 'hello'
}

setTimeout(() => {
    renderer.render(newVnode, document.querySelector('#app'))
}, 1000);
```

我们发现 `vnode` 的 `type` 值都发生变化了，由 `p` 变成 `div` ，这个时候，还需要`打补丁`吗？
- 是的
	- ① 应该先把 `p 挂载` 
	- ② 然后再将 `div 挂载`
- 如下代码：

```js hl:2,7,15 
function patch(n1, n2, container) {
    // 类型不同，直接卸载
    if (n1 && n1.type !== n2.type) {
        unmount(n1);
        n1 = null
    }
    // 挂载新的 vnode 
    const {type} = n2
    if (typeof type === 'string') {
        if (!n1) {
            mountElement(n2, container)
        } else {
            patchElement(n1, n2)
        }
    // 如果是 Object ，需要再特殊处理,递归处理	
    } else if (typeof type === 'object') {
        // 组件
    }
}
```

- 如果是 `Object` ， 需要调用 `mountComponent` 和 `patchComponent` 来继续`递归处理`，直到遇到`普通的标签元素`，如 `div`

下面是`对具体元素打补丁`的逻辑：

```js
function patchElement(n1, n2) {
    const el = n2.el = n1.el
    const oldProps = n1.props
    const newProps = n2.props;
    
    // 对【新添加的元素属性】打补丁
    for (const key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patchProps(el, key, oldProps[key], newProps[key])
        }
    }
    // 对 【旧的的元素属性】 打补丁
    for (const key in oldProps) {
        if (!(key in newProps)) {
            patchProps(el, key, oldProps[key], null)
        }
    }
}
```

## 10. 事件的处理

> 事件只是 DOM 上的一个属性，所以当做特殊的 `props` 来处理

如何给 `vnode` 绑定事件呢？比如如 `虚拟节点`

```js hl:5,8
const vnode = {
    type: 'p',
    props: {
        onClick: [
            () => {
                alert('clicked 1')
            },
            () => {
                alert('clicked 2')
            }
        ]
    },
    children: 'text'
}
```

我们直接来看代码实现，后面再说明为什么这么设计？

```js hl:2
patchProps(el, key, prevValue, nextValue) {
    if (/^on/.test(key)) {
        const invokers = el._vei || (el._vei = {})
        let invoker = invokers[key]
        const name = key.slice(2).toLowerCase()
        if (nextValue) {
            if (!invoker) {
                invoker = el._vei[key] = (e) => {
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(e))
                    } else {
                        invoker.value(e)
                    }
                }
                invoker.value = nextValue
                el.addEventListener(name, invoker)
            } else {
                invoker.value = nextValue
            }
        } else if (invoker) {
            el.removeEventListener(name, invoker)
        }
    } else if (key === 'class') {
        
    } else if (shouldSetAsProps(el, key, nextValue)) {
        
    } else {
        
    }
}
})
```

说明：

- `on` 开头的属性才需要处理
	- `invokers：事件处理函数` 用于处理事件回调函数
	- `真正的事件 callback` 存在 `invokers.value` 中
- 问：为什么要这样
	- 解决性能问题
		- 比如更新事件时，直接更新 `invokers.value` 即可
			- 没必要每次都调用 `removeEventListener` 来移除上一次绑定的事件？
	- `el._vei[key]` 中存储着**所有事件信息**，它的数据结构可能是一个**数组**，比如同一事件如 `click` 有多个回调 callback，所以才有 `invoker.value.forEach(fn => fn(e))`
	- 它还能解决`事件冒泡`和`更新相互冲突`的问题，见下面 

## 11. 事件冒泡与更新时机问题

看如下代码：

```js
const {effect, ref} = VueReactivity
const bol = ref(false)

effect(() => {
    const vnode = {
        type: 'div',
        props: bol.value ? {
            onClick: () => { 
                alert('父元素 clicked')
            }
        } : {},
        children: [
            {
                type: 'p',
                props: {
                    onClick: () => {
                        bol.value = true
                    }
                },
                children: 'text'
            }
        ]
    }
    renderer.render(vnode, document.querySelector('#app'))
})
```

一开始 `bol` 为 `false`， 
- 所以 `div` 没有回调事件 ， `p` 有回调 ， 所以 `正常预期` 是 点击 `p 元素`，冒泡到 `div` , 不 `alert`。
- 但是，竟然执行了，为什么呢？
	- 因为 `bol 是响应数据`， 变化了会导致 副作用执行，然后就给 div 绑定了事件；

如何解决呢？符合正常预期。如下代码：

![|616](https://od-1310531898.cos.ap-beijing.myqcloud.com/202305252000226.png)

即，屏蔽所有`绑定时间 晚于 真正执行时间`的执行 。

## 12. 如何更新子节点

6种情况：`【新节点、老节点】 * 【文本节点、一组节点、null】`

需要在特定情况 调用 `旧节点卸载操作` 和 `新加节点的挂载操作` ，如下代码：

```js

function patchChildren(oldNode, newNode, container) {
    // 新节点是否是文本节点
    if (typeof newNode.children === 'string') {
        // 老节点是仅在是是一组节点时，才需要遍历卸载
        if (Array.isArray(oldNode.children)) {
            oldNode.children.forEach((c) => unmount(c))
        }
        setElementText(container, newNode.children)
    // 新节点是一组节点
    } else if (Array.isArray(newNode.children)) {
        // 老节点是一组节点
        if (Array.isArray(oldNode.children)) {
            oldNode.children.forEach(c => unmount(c))
            newNode.children.forEach(c => patch(null, c, container))
        } else {
            setElementText(container, '')
            newNode.children.forEach(c => patch(null, c, container))
        }
    } else {
        if (Array.isArray(oldNode.children)) {
            oldNode.children.forEach(c => unmount(c))
        } else if (typeof oldNode.children === 'string') {
            setElementText(container, '')
        }
    }
}
```

其实上面代码很简单粗暴，比如，如果旧节点是一组节点，简单粗暴的全部卸载，再全部挂载新节点操作；

其实更好的方式是 `使用 Diff 算法，最大可能利用`，以提高性能。

## 13. 文本节点与注释节点

- **文本节点**：
	- 用于表示纯文本
- **注释节点**：
	- 用于在HTML中添加注释，这些注释不会显示在页面上但可能对开发者有帮助。
- 如何使用 `vnode` 描述真实场景中的 `文本节点` 与 `注释节点` ？
	- 答案是：使用 `Symbol()` ，如下代码：
		- 使用 Symbol 的原因：
		    - Symbol 是 JavaScript 中的一种基本数据类型，用于**创建唯一的标识符**。
		    - 通过使用 Symbol，我们可以创建独特的标识来代表**文本节点**和**注释节点**。
		- 使用 Symbol 的**优势** ，我们可以清晰且安全地在虚拟DOM中定义和**区分不同类型的节点**
			- 统一的节点表示方式
			- 清晰的类型区分
			- 易于在渲染过程中进行特殊处理

```js hl:1,2
const Text = Symbol();
const Comment = Symbol();

const vnode1 = {
  type: Text,
  children: 'Some Text'
}

const vnode2 = {
  type: Comment,
  children: 'Some Comment'
}
```

然后根据具体节点类型，在挂载、更新、卸载等操作时根据具体情况处理即可。

## 14. Fragment

存在的意义是什么 ？ 其实就是类似于React 的 `<></>` 和 `<fragment>`

如下 vnode ：

```js
const Fragment = Symbol()
const newVnode = {
  type: 'div',
  children: [
    {
      type: Fragment,
      children: [
        { type: 'p', children: 'text 1' },
        { type: 'p', children: 'text 2' },
        { type: 'p', children: 'text 3' }
      ]
    },
    { type: 'section', children: '分割线' }
  ]
}
```

>  **在挂载、更新、卸载操作是，不处理它本身，只处理它的子节点即可**
