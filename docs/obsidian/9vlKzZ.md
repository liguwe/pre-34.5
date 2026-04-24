# 前端框架现状及未来趋势

`#前端框架` 

## 1. 总结

- 性能体验方向
	- 去 JS 化 ？比如
		- 岛屿架构
		- RSC 
	- 去 DOM 化？直接编译成 JavaScript
- 更注重编译时优化
	- 减少**运行时开销**成为主要方向 
- 服务器组件和同构渲染
	- RSC 
	- SSR → SSG
- 元框架兴起：**开箱即用的完整全链路解决方案**
	- 比如 next.js 和 nuxt.js
- 其他
	- 整合 Web Assembly 
	- **跨框架**
		- **微前端**深化
	- Serverless 架构 、BFF
		- **云原生开发模式**
	- AI 驱动开发
		- 比如 Vercel 集成了不少 AI 功能
	- 开发范式：
		- **函数式**开发（Hooks）
	- `卷`编译时
		- 完全编译时框架
	- **增量更新 与 流式更新**
	- 跨平台场景考虑
	- 新兴场景: 
		- 元宇宙、AR/VR、大模型场景

## 2. 都忙着**去 JS 化** 和 **去 Vdom 化** ？

- 比如岛屿架构 
	- 详见 [9. 前端框架的岛屿架构（Island Architecture）](/flRX8Z)
- 又比如 `vue3.5` 最新的进展

## 3. 当前主流前端框架概况

- React
- Vue
- Svelte
	- 新兴的编译时框架
	- **无虚拟 DOM**，直接编译为原生 JavaScript
	- 性能优秀，包体积小

## 4. 未来趋势

### 4.1. 编译时优化

- Svelte 带动的编译时优化趋势
- 更多框架开始`关注构建时的优化`
- 减少运行时开销成为主要方向 

### 4.2. 服务器组件和同构渲染

- React Server Components（RSC） 的推广
- 服务端渲染(SSR)和静态生成(SSG) 的进一步融合
- 更好的性能和SEO支持 
- 包括 JAMStack 架构
	- [10. JAMstack 架构](/kOysIJ)

### 4.3. 元框架兴起

- Next.js(React)、Nuxt(Vue)、umi(React) 等成为标配
- 同时支持 SSR、SSG 等多种渲染模式
- 开箱即用的完整解决方案

### 4.4. 去 JavaScript 化

其中的典型代表是

- `Islands Architecture` (岛屿架构)
-  `React Server Component`(RSC, React 服务端组件)

## 5. 选择建议

- 大型企业项目：
	- 考虑Angular 或 React
- 中小型项目：
	- Vue.js 是很好的选择
- 性能敏感项目：
	- 可以考虑 Svelte
- 快速开发：
	- Next.js或Nuxt.js等元框架
- 性能敏感
	- Svelte
	- Solid
- 原生 Web Components

## 6. 其他

- Web Assembly 整合
- 跨框架：
	- **微前端**深化
- Serverless 架构 、BFF
	- **云原生开发模式**
- AI 驱动开发
	- 比如 Vercel 集成了不少 AI 功能
- 开发范式：
	- 函数式开发（Hooks）
- `卷`编译时
	- 完全编译时框架
- 增量更新
- 流式更新
- 跨平台场景考虑
- 新兴场景: 
	- 元宇宙、AR/VR、大模型场景

## 7. 附：Vercel AI SDK

- 与 Next.js、Svelte 等主流框架的原生集成
- 提供开箱即用的组件和 hooks
- 简化 AI 功能的开发流程
	- 支持 AI 响应的实时流式传输
	- 优化用户体验，实现打字机效果
	- 支持多种主流 LLM 模型

```javascript
// 1. 基础流式对话实现
import { OpenAIStream, StreamingTextResponse } from '@vercel/ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await OpenAIStream({
    model: 'gpt-4',
    messages,
  });
  return new StreamingTextResponse(response);
}

// 2. 使用 React Hooks
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>{m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
      </form>
    </div>
  );
}

```
