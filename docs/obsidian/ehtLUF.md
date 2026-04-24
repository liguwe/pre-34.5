# React Server Components (RSC)

`#react` 

## 总结

- React Server Components (RSC)：
	- 服务器上运行的 React 组件
- 一切不需要交互的内容都应当放到服务端
	- 比如 markdown
- 三种组件类型
	- 默认：服务端组件
	- 客户端组件：
		- 使用`'use client';`标识
	- 共享组件
		- 可在服务端和客户端都能使用的组件
- 区别
	- 服务器组件限制：
		- 不能使用 useState、useEffect 等客户端 hooks
		- 不能访问浏览器 API
		- 不能添加事件处理器
	- 客户端组件限制：
		- 不能直接导入服务器组件
		- 需要通过 props 接收服务器组件
	- 数据获取注意事项：
		- 服务器组件中可以直接使用 async/await
		- 客户端组件需要使用传统的数据获取方式
	- 服务器组件不能使用像 `useState` 和 `useEffect` 这样的 React hook；客户端则可以
	- 服务器组件无权访问浏览器 API；客户端有完整的浏览器 API 权限；
	- 服务端有权限直接访问服务端程序和 API；而客户端组件只能通过请求访问部分程序。
- `UI = f(data, state)`
	- 客户端组件的工作是 `UI = f(state)`
	- 服务端组件的工作是 `UI = f(data)`
	- React 希望组合二者的优势，实现 `UI = f(data, state)`

## 1. RSC 基本概念

React Server Components 允许开发者编写在服务器上运行的 React 组件，这些组件可以：
- 直接访问服务器资源（数据库、文件系统等）
- 减少客户端 JavaScript 包大小
- 保持良好的交互性

RSC 每次预渲染后把 HTML 发送到客户端，由客户端进行水合（hydrate）并正式渲染。

这种做法的好处是，一部分原本要打包在客户端 JavaScript 文件里的代码，现在可以放在服务端运行了，从而减轻客户端的负担，提升应用的整体性能和响应速度。

React 19 带来了 RSC 的稳定版本，主要特性包括：

1. 稳定性提升：RSC 在 React 19 中被标记为稳定特性
2. 性能优化：通过预取机制提升客户端更新速度
3. 更好的开发者体验：改进了错误处理和调试功能

## 2. 一切不需要交互的内容都应当放到服务端？

比如 markdown 渲染就很适合

```javascript hl:2,12

// 客户端组件渲染

import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function NoteWithMarkdown({text}) {
  const html = sanitizeHtml(marked(text));
  return (/* 渲染 */);
}

// 服务器组件渲染
 
import marked from 'marked'; // 零打包大小
import sanitizeHtml from 'sanitize-html'; // 零打包大小
 
function NoteWithMarkdown({text}) {
  // 与之前相同
}
```

## 3. 三种组件类型

### 3.1. 服务器组件 (默认)

```jsx
// 1. 服务器组件 (默认)
// 文件: app/page.js
async function ServerComponent() {
  const data = await fetch('api/data');
  return <div>{data}</div>;
}
```

### 3.2. 客户端组件

```javascript
// 2. 客户端组件
// 文件: components/client.js
'use client';
function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3.3. 共享组件

```tsx
// 3. 共享组件
// 可在服务端和客户端都能使用的组件
function SharedComponent({ children }) {
  return <div className="shared">{children}</div>;
}
```

### 3.4. 主要区别

- 服务器组件限制：
	- 不能使用 useState、useEffect 等客户端 hooks
	- 不能访问浏览器 API
	- 不能添加事件处理器
- 客户端组件限制：
	- 不能直接导入服务器组件
	- 需要通过 props 接收服务器组件
- 数据获取注意事项：
	- 服务器组件中可以直接使用 async/await
	- 客户端组件需要使用传统的数据获取方式
- 服务器组件不能使用像 `useState` 和 `useEffect` 这样的 React hook；客户端则可以
- 服务器组件无权访问浏览器 API；客户端有完整的浏览器 API 权限；
- 服务端有权限直接访问服务端程序和 API；而客户端组件只能通过请求访问部分程序。
- `UI = f(data, state)`
	- 客户端组件的工作是 `UI = f(state)`
	- 服务端组件的工作是 `UI = f(data)`
	- React 希望组合二者的优势，实现 `UI = f(data, state)`

## 4. CSS 处理

### 4.1. 服务器组件中的 CSS

- 支持 CSS Modules
- 支持全局 CSS 导入
- 支持 CSS-in-JS 的静态部分

### 4.2. 客户端组件中的 CSS

- 支持所有传统的 CSS 方案
- 动态样式需要在客户端组件中处理

## 5. Remix 与 Next.js

- 当前 React 更新缓慢，反而是两个上层框架 Remix（由 Shopify 资助）和 Next.js（由 Vercel 资助）在激烈竞争。

## 6. 简单示例

```javascript
// 1. 服务器端
async function BlogPost({ id }) {
  // 直接访问数据库
  const post = await db.posts.findById(id);
  const author = await db.users.findById(post.authorId);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <AuthorInfo author={author} />
      {/* 客户端组件处理交互 */}
      <ClientLikeButton initialLikes={post.likes} />
    </article>
  );
}

// 2. 客户端组件
'use client';
function ClientLikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  
  return (
    <button onClick={() => setLikes(likes + 1)}>
      Like ({likes})
    </button>
  );
}
```
