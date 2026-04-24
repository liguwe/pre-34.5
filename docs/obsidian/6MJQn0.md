# Vue3 中可使用 JSX 原理

`#vue` `#jsx` 

## 总结

Vue 3 中支持使用 JSX 的原理涉及到**编译过程和运行时**的配合
- 编译过程将 JSX 转换为 **Vue 的渲染函数**调用
- 而运行时则通过 `h 函数`创建虚拟 DOM。
- 这种方式既保留了 JSX 的灵活性，又充分利用了 Vue 的响应式系统和组件模型

## 1. 编译原理

JSX 在 Vue 3 中的使用需要通过编译步骤将 JSX 语法转换为 Vue 的渲染函数。这个过程主要依赖于 Babel 插件，特别是 `@vue/babel-plugin-jsx`。

编译过程大致如下：

### 1.1. 解析 JSX

Babel 首先将 JSX 代码解析成抽象语法树（AST）。

### 1.2. 转换

**@vue/babel-plugin-jsx 插件**会遍历 AST，将 JSX 节点转换为对应的 Vue 3 渲染函数调用。

### 1.3. 生成代码

最后，Babel 根据转换后的 AST 生成 JavaScript 代码。

## 2. 运行时原理

在运行时，Vue 3 使用 `h 函数`（createElement 的简写）来创建虚拟 DOM 节点。JSX 编译后的代码本质上就是一系列 h 函数的调用。

例如，下面的 JSX：

```jsx
const App = () => (
  <div>
    <h1>Hello, Vue 3!</h1>
    <p>{message}</p>
  </div>
);
```

会被编译成类似这样的代码：

```javascript
import { h } from 'vue';

const App = () => h('div', null, [
  h('h1', null, 'Hello, Vue 3!'),
  h('p', null, message)
]);
```

## 3. 与 Vue 组件系统的集成

Vue 3 的组件系统能够无缝地与 JSX 集成，主要通过以下方式：

### 3.1. 属性传递

JSX 中的属性会被转换为 h 函数的第二个参数，对应于组件的 props。

### 3.2. 事件处理

JSX 中的事件处理器（如 onClick）会被转换为 Vue 的事件监听器。

### 3.3. 插槽

JSX 允许直接传递子元素，这些会被转换为`默认插槽`或`具名插槽`。

## 4. 响应式整合

Vue 3 的组合式 API（Composition API）与 JSX 配合得很好。你可以在 JSX 中直接使用 ref、computed 等响应式 API。

```jsx
import { ref, computed } from 'vue';

const MyComponent = () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  return () => (
    <div>
      <p>Count: {count.value}</p>
      <p>Double: {doubleCount.value}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
};
```

## 5. 性能优化：编译优化

Vue 3 的编译器能够对 JSX 进行静态分析和优化，例如：

- 静态提升：
	- 将不变的内容提升到渲染函数之外。
- 补丁标记：
	- 为动态内容添加标记，以优化更新过程。

## 6. Vue3 的JSX 和 React 的JSX在各个层面的区别

### 6.1. 语法层面的区别

#### 6.1.1. v-model 的处理

- React中没有v-model概念，需要手动处理：
```jsx
<input 
  value={value} 
  onChange={e => setValue(e.target.value)} 
/>
```
- Vue JSX中可以使用v-model：
```jsx
<input v-model={value} />
// 或者使用更原生的方式
<input 
  value={value} 
  onInput={e => value.value = e.target.value} 
/>
```

#### 6.1.2. 属性传递

- React JSX:
```jsx
<Component prop={value} />
```
- Vue JSX:
```jsx
<Component prop={value} />
// 也支持v-bind语法
<Component {...props} />
```

### 6.2. 组件定义方式的区别

React组件定义：

```jsx
// 函数组件
function MyComponent(props) {
  return <div>{props.text}</div>
}

// Class组件
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.text}</div>
  }
}
```

Vue3组件定义：

```jsx
// 使用defineComponent
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: String
  },
  setup(props) {
    return () => <div>{props.text}</div>
  }
})

// 或者直接使用函数式组件
const MyComponent = (props) => {
  return () => <div>{props.text}</div>
}
```

### 6.3. 状态管理的区别

React中的状态管理：

```jsx
function Component() {
  const [count, setCount] = useState(0)
  return <div onClick={() => setCount(count + 1)}>{count}</div>
}
```

Vue3中的状态管理：

```jsx
import { ref } from 'vue'

const Component = defineComponent({
  setup() {
    const count = ref(0)
    return () => (
      <div onClick={() => count.value++}>{count.value}</div>
    )
  }
})
```

### 6.4. 原理层面的区别

#### 6.4.1. 编译时差异

- React JSX 会被编译成 `React.createElement()` 调用
- Vue JSX 会被编译成 `h()` 函数调用（`createVNode`）

#### 6.4.2. 更新机制

- React 采用虚拟DOM diff算法，当状态改变时会重新执行整个组件函数
- Vue3 采用响应式系统，只有依赖发生变化的部分才会重新渲染

#### 6.4.3. 属性处理

- React **将所有属性都统一处理为 props**
- Vue **区分了props、attrs、events等不同类型的属性**

#### 6.4.4. 特有功能支持

Vue 特有的功能在 JSX 中的使用：

- 插槽（slots）
```jsx
// Vue JSX
const MyComponent = {
  setup(props, { slots }) {
    return () => (
      <div>
        {slots.default?.()}
        {slots.named?.()}
      </div>
    )
  }
}
```

- 指令
```jsx
// Vue JSX
<div v-show={isShow}>Content</div>
```

React特有的功能：

- Fragments
```jsx
// React
<>
  <div>1</div>
  <div>2</div>
</>

// Vue3 JSX也支持
<>
  <div>1</div>
  <div>2</div>
</>
```

### 6.5. 性能考虑

- React 的JSX 每次更新都会重新执行整个组件函数
- Vue3的 JSX 借助响应式系统，可以实现更细粒度的更新
- Vue3 在编译时可以进行更多优化，因为它的模板语法提供了更多静态分析的机会

### 6.6. 使用场景

- React中 JSX 是主要的模板编写方式
- Vue中 JSX 更多是一个补充选项，通常在需要更灵活的渲染逻辑时使用

### 6.7. 开发体验

- React的JSX更接近原生JavaScript的编程体验
- Vue的JSX需要考虑响应式特性，有时需要额外处理.value
- Vue提供了两种选择：模板语法和JSX，可以根据需求选择

### 6.8. 调试与工具支持

- React的JSX调试工具更成熟（React DevTools）
- Vue的JSX调试体验相对较差，尤其是与模板语法相比
