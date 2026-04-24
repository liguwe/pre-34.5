# 使用 useId 生成唯一的 ID 标识符

`#react` 

## 1. 总结

- `useId` 是 React 18 引入的一个新 Hook，用于生成唯一的 ID 标识符
- 在 `hydration` 过程中，服务器端和客户端生成的 ID 不一致，那么就会导致 hydration 失败

## 2. 前置知识：React 的服务端渲染和客户端渲染之间的关系

当你看到一个服务端渲染的应用，它的渲染过程会是这样：
- 服务端会先生成 HTML，然后将这个 HTML 发送到客户端，
	- 在客户端，React 会进行一个叫做 `hydration` 的过程，即将服务器端生成的 HTML 和客户端的 DOM 进行匹配，并生成最终的 HTML
	- 如果在 `hydration` 过程中，**服务器端和客户端生成的 ID 不一致，，那么就会导致 hydration 失败**

## 3. 定义和基本概念

useId 是 React 18 引入的一个新 Hook，用于生成唯一的 ID 标识符。它主要用于生成可访问性属性的唯一 ID，特别是在需要关联 HTML 元素的场景中。

```javascript
const id = useId()
```

这个 Hook 的特点：

- 返回一个唯一的字符串 ID
- 在服务器端和客户端渲染时保持一致
- 在同一个组件的多个实例中会生成不同的 ID
- 不需要任何参数

## 4.  ID 生成规则

```javascript
// React 内部实现（简化版）
class IdGenerator {
  constructor() {
    this.clientId = 0;    // 客户端计数器
    this.serverId = 0;    // 服务端计数器
  }

  next() {
    // 在服务器端和客户端使用相同的计数逻辑
    const id = this.isServer ? this.serverId++ : this.clientId++;
    return `:r${id}:`;
  }
}

```

## 5. React 内部水合过程（简化示意）

```javascript
// React 内部水合过程（简化示意）
function hydrateRoot(container, element) {
  // 1. 获取服务器渲染的 HTML
  const serverHTML = container.innerHTML;

  // 2. 创建新的 React 树
  const root = createRoot(container);

  // 3. 开始水合过程
  root.hydrate(element, {
    onHydrationMismatch: (serverNode, clientNode) => {
      // 如果发现不匹配，会触发警告
      if (serverNode.id !== clientNode.id) {
        console.error(
          "Hydration mismatch: Server generated ID",
          serverNode.id,
          "but client generated",
          clientNode.id,
        );
      }
    },
  });
}


```

## 6. 如何保证SSR和CSR就会生成完全相同的 ID 序列

1. 服务端和客户端使用相同的遍历顺序
2. 相同位置的 useId 调用获得相同的槽位
3. 相同槽位生成相同的 ID
4. 水合过程中可以完美匹配

```jsx
// 1. 组件定义
function Layout() {
  const id = useId(); // slot: "Layout"
  return <Main />;
}

function Main() {
  const id = useId(); // slot: "Layout.Main"
  return <Form />;
}

function Form() {
  const id = useId(); // slot: "Layout.Main.Form"
  return (
    <input id={`${id}-input`} />
  );
}

// 2. 渲染过程
const app = (
  <Layout>
    <Main>
      <Form />
    </Main>
  </Layout>
);

// 3. 服务端渲染
// - 遍历组件树
// - 为每个 useId 调用生成槽位
// - 生成 HTML

// 4. 客户端水合
// - 使用相同的遍历顺序
// - 匹配已有的 HTML
// - 复用相同的 ID

```

## 7. 注意事项

### 7.1. 调用位置限制

- 只能在组件的顶层调用
- 不能在循环、条件或嵌套函数中调用
   ```javascript
   // ❌ 错误示例
   if (condition) {
     const id = useId();
   }

   // ✅ 正确示例
   const id = useId();
   if (condition) {
     // 使用 id
   }
   ```

### 7.2. 不要用于列表 key

   - useId 不是为生成列表 key 而设计的
   - 列表 key 应该使用数据的唯一标识符
   ```javascript
   // ❌ 错误示例
   items.map(() => {
     const id = useId();
     return <li key={id}>...</li>
   });

   // ✅ 正确示例
   items.map((item) => (
     <li key={item.id}>...</li>
   ));
   ```

### 7.3. 前缀使用

   - 可以添加前缀来避免命名冲突
   ```javascript
   const id = useId();
   const prefix = 'app';
   const elementId = `${prefix}-${id}`;
   ```

### 7.4. 服务器端渲染注意事项

   - 确保服务器和客户端使用相同的 React 版本
   - 不要手动构造 ID 字符串
   - 使用相同的组件结构
