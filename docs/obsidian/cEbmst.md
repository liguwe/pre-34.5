# 说说 React 19 的最新的进展

`#react` 

## 总结

- use hook
	- 可以在循环和条件语句中调用
- 支持在 React 代码里编写 document metadata，即在页面组件编写`<title>` `<link>` 和 `<meta>` 标签会自动添加应用的 `<head>` 上面
- 新指令
	- `'use client'` 标记仅在客户端运行的代码。
	- `'use server'` 标记可以从客户端代码调用的服务器端函数
- useOptimistic 乐观更新
	- 比如点赞
- 预加载能力：`import { prefetchDNS, preconnect, preload, preinit} from "react-dom";`
- 等等

## 1. use hook

- 不同于所有其他的 React 钩子，`use` 可以在循环和条件语句中调用，比如 `if`

### 1.1. use(Context)

```tsx hl:4
import { use } from "react";
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

### 1.2. use(Promise)

```jsx
import { use } from 'react';
function MessageComponent({ messagePromise }) {
    const message = use(messagePromise);
    // ...
}
```

## 2. 新指令

- `'use client'` 标记仅在客户端运行的代码。
- `'use server'` 标记可以从客户端代码调用的服务器端函数

## 3. useActionState

这个钩子简化了表单状态和表单提交的管理。通过使用 Actions，它捕获表单输入数据，处理验证和错误状态，减少了自定义状态管理逻辑的需求。这个钩子还暴露了一个状态，可以在执行操作时显示加载指示器

```jsx hl:9
import { useActionState } from "react";
import { createUser } from "./actions";

const initialState = {
  message: "",
};

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button aria-disabled={pending} type="submit">
        {pending ? "Submitting..." : "Sign up"}
      </button>
    </form>
  );
}

```

## 4. useFormStatus

这个钩子管理最后一次表单提交的状态，必须在一个也在表单内的组件中调用

```tsx hl:1
import { useFormStatus } from "react-dom";
import action from "./actions";

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>;
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

```

## 5. useOptimistic 乐观更新

是一种在前端开发中`常用的处理异步操作反馈的策略`。

它基于一种“乐观”的假设：即假设无论我们向服务器发送什么请求，这些操作都将成功执行，因此在得到服务器响应之前，我们就提前在用户界面上渲染这些改变。

使用场景：点赞、评论、任务添加编辑等。

useOptimistic 会在异步操作进行时先渲染预期的结果，等到异步操作完成，状态更新后，再渲染真实的返回结果（无论成功和失败）

## 6. 预加载资源

```javascript
// React code
import { prefetchDNS, preconnect, preload, preinit} from "react-dom";

function MyComponent() {
  preinit("https://.../path/to/some/script.js", { as: "script" });
  preload("https://.../path/to/some/font.woff", { as: "font" });
  preload("https://.../path/to/some/stylesheet.css", { as: "style" });
  prefetchDNS("https://...");
  preconnect("https://...");
}
```

## 7. 样式加载支持

```javascript hl:4
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="one" precedence="default" />
      <link rel="stylesheet" href="two" precedence="high" />
      <article>...</article>
    </Suspense>
  );
}

function ComponentTwo() {
  return (
    <div>
      <p>...</p>
      {/* Stylesheet "three" below will be inserted between "one" and "two" */}
      <link rel="stylesheet" href="three" precedence="default" />
    </div>
  );
}

```

## 8. 异步脚本支持

```tsx hl:4
function Component() {
  return (
    <div>
      <script async={true} src="..." />
      // ...
    </div>
  );
}

function App() {
  return (
    <html>
      <body>
        <Component>// ...</Component> // Won't duplicate script in the DOM
      </body>
    </html>
  );
}

```

## 9. 更好的支持 web Componets 

自定义元素允许开发者将自己的 HTML 元素定义为 Web Components 规范的一部分。

在之前的 React 版本中，使用自定义元素很困难，因为 React 将未识别的属性视为属性而不是属性。

## 10. 服务端组件：SRC

服务端组件和 `server actions` 将成为稳定特性，这两个概念属于熟悉 Next.js/Remix 的人已经烂熟于心，而不用 Next.js/Remix 的人根本用不到

更到参考 [40. React Server Components (RSC)](/ehtLUF)

## 11. ref 抛弃 forwardRef

## 12. 支持在 React 代码里编写 document metadata

支持在 React 代码里编写 document metadata，即在页面组件编写`<title>` `<link>` 和 `<meta>` 标签会自动添加应用的 `<head>` 上面

## 13. context 可当作 provider

从在 React 19 开始，开发者可以直接将 `<Context>` 直接作为 provider，而不是使用 `<Context.Provider>`
