# Vue 的整体设计思路

`#vue` `#前端框架/vue` 

## 1. 总结

- 一个 JSON 数据，使用**渲染器**渲染出来
- 为了更好的开发体验，在使用**编译器**提高开发体验
	- 配合**编译器**也能提高运行时性能
- 发现没有，其实市面上的**低代码平台实现思路**无非也就**编译器和渲染器**
	- 运行时：写个**渲染器**
	- 使用**编译器**：
		- 编译器成可执行的代码
		- 或者**出码编译**后二次开发
		- 在编译过程中，提取关键信息， 给渲染器**更多的信息**，实现更好的性能

## 2. 如何描述 UI

三种方式：

- 声明式描述 UI
- JavaScript对象
- v-dom

### 2.1. 声明式描述 UI

`声明式描述 UI`，比如 `<div class='btn' id='test' @click="handle"> button </div>`， 包含信息 tag名，属性，事件，层级关系

### 2.2. JavaScript对象

使用 `JavaScript对象 ` 来描述 UI，如下代码

```javascript
const title = {
    tag: 'h1', // tag 名称
    props:{ // 属性与事件
        onClick:handler
    }
    children:[ // 子节点
        {tag: 'span'}
    ]
}
```

### 2.3. v-dom

`虚拟 DOM` 描述 UI，比如 vue 中的 `渲染函数 - h` ，如下代码：

```javascript hl:4,7
import {h} from "vue";
export default{
    render(){
        // 虚拟 DOM
        return h('h1',{ onClick: fn }); 
        
        // 或者直接返回 js 对象
        return {
            tag: 'h1', // tag 名称
            props:{ // 属性与事件
                onClick:handler
            }
            children:[ // 子节点
                {tag: 'span'}
            ]
        }
    }
}
```

> `h` 返回的其实就是 `js 对象`， `h函数`就是**辅助创建虚拟 DOM 的工具函数**而已，**所以他俩其实是一个东西**

- 哪种方式**更灵活**呢？
   - 答案是：`JavaScript 对象`（或`虚拟 DOM` ） 的方式，
      - 比如表现 `H1-H6` ，使用 `tag:H${index}` 即可
      - 又比如说，`jsx`的方式实现 `递归树`，更方便
- 那种方式**更直观**呢？当然是 `模板`

## 3. 渲染函数

- 即上面的 `render 方法`
   - 如 vue 会根据返回的`虚拟 DOM` ， 把组件渲染出来

## 4. 渲染器

`渲染器`的作用，就是把 `虚拟 DOM`，如 `h('div','hello')` 转成 `真实的 DOM` 

> 这里再强调一下，`h('div','hello')` 返回的其实就一个 `用于表示 UI 的 js 对象`

如何实现一个`渲染器`? 

```javascript
const vnode = {}; // 用于描述 UI 的 js 对象。
function renderer(vnode,container){
    1. 根据 vnode.tag 创建元素
    2. 添加 props 和 事件
    3. 处理 children，递归调用 renderer 
}
```

所以`渲染器` 的

- **本质是**，递归遍历 `vdom` , 调用`原生 DOM API` 完成真实的 `DOM 创建`
- 但**精髓在于**，**如何做 diff 更新**

## 5. 组件的本质

组件**本质**是`一组虚拟DOM元素`的封装
- 他可以是一个返回虚拟 DOM 的`函数`
- 也可以是一个`对象`，然后再用 `渲染器` 进行渲染

所以，渲染时需要判断 `vnode.tag = function | object | string ? ` 分别处理

## 6. 模板编译器

编译器其实就是把 `模板` 编译成 `渲染函数` 

- 即：声明式描述 UI **→** 虚拟 DOM 方式描述 UI
- 比如：一个标准`vue模板`
```html
<template>
    <div @click="fn"></div>
</template>

<script>
export default{
    data(){},
    methond(){
        fn(){}
    },
    render(){
        return h('div',{onclick:fn})
    }
}
</script>

```

最终**编译**成的样子如下：

```javascript hl:7
export default{
    data(){},
    methond(){
        fn(){}
    },
    render(){
        return h('div',{onclick:fn})
    }
}
```

## 7. 最后总结

- 组件的实现依赖于 `渲染器`
- 模板的编译依赖于 `编译器`
- `渲染器` 和 `编译器` 是存在`信息交流`的
	- 比如虚拟 DOM 对象中 的 `patchFlages` 属性，用于标识是 `动态属性` 和 `静态属性`？
		- 互相配合使得性能得到提升
