# 编译时框架 vs 运行时框架

`#前端框架` 

## 1. 总结

- 主流框架都是**编译时+运行时框架**，比如 vue、React 等
	- 结合**编译时优化**和**运行时灵活性&动态性**
- 运行时框架
	- 运行时进行，组件渲染、状态管理、使用`虚拟 DOM` 进行**差异化更新**
- 编译时框架：Svelte
- 选择建议
	- 性能敏感 
		- 可考虑 Svelte
	- 静态内容为主 
		- 可考虑 Svelte

## 2. 定义

- 编译时框架（Compile-time Framework）：
	- 在`构建阶段`完成大部分工作
	- 将框架代码转换为优化后的**原生 JavaScript**
	- 最小化运行时开销
	- 代表框架：
		- Svelte、Solid
- 运行时框架（Runtime Framework）：
	- 在浏览器中需要完整的框架运行时
	- 使用`虚拟 DOM` 进行差异化更新
	- 运行时进行
		- 组件渲染
		- **状态管理**
	- 代表框架：
		- React、Vue、Angular

## 3. 主流框架对比分析

### 3.1. React（运行时框架）

```javascript
// React 示例
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```


- 需要完整的 React 运行时
- 使用虚拟 DOM 进行差异化更新
- 状态更新触发组件重新渲染
- 打包后包含框架代码

> 当然也有**编译动作**，比如 JSX 的编译，各类打包动作等等

### 3.2. Svelte（编译时框架）

```javascript
// Svelte 示例
<script>
  let count = 0;
</script>

<div>
  <p>{count}</p>
  <button on:click={() => count++}>+</button>
</div>
```


- 编译后生成
	- **→ 原生 JavaScript**
- 无虚拟 DOM
- 精确更新 DOM
- 最小化运行时代码

### 3.3. Vue（混合模式）

```javascript
// Vue 示例
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="count++">+</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>
```

- 包含运行时但相对轻量
- 使用虚拟 DOM
- 响应式系统
- **编译优化模板**
	- 静态变量提升
	- v-memo
	- v-once
	- 等等

## 4. 性能对比

### 4.1. 编译时优势

- 更小的包体积
- 更快的首次加载
- 更少的内存占用
- 更直接的 DOM 操作

### 4.2. 运行时优势

- 动态性更强
- 更灵活的组件复用
- 更成熟的生态系统
- 开发工具支持更好

## 5. 构建产物对比（React 与 Svelte）

让我们通过代码示例来看一个**简单计数器**在不同框架下的**构建产物差异**：

```javascript hl:1,13,8,16,4
// React 构建产物（简化示意）
import { useState } from 'react';

// React 运行时代码...
function Counter() {
  const [count, setCount] = useState(0);
  return React.createElement('div', null,
    React.createElement('p', null, count),
    React.createElement('button', { onClick: () => setCount(count + 1) }, '+')
  );
}

// Svelte 构建产物（简化示意）
let count = 0;
const p = document.createElement('p');
const button = document.createElement('button');
p.textContent = count;
button.textContent = '+';
button.addEventListener('click', () => {
    count++;
    p.textContent = count;
});
```

## 6. 使用场景建议

### 6.1. 编译时框架（如 Svelte）适合

- 性能敏感的应用
- 包体积要求严格
- **静态内容为主**
- 小型到中型项目

### 6.2. 运行时框架（如 React）适合

- 大型复杂应用
- 需要强大生态支持
- 团队熟悉度高
- 动态内容为主

## 7. 开发体验对比

### 7.1. 编译时框架

- 更接近原生 JavaScript
- 更少的模板代码
- 更直观的状态管理
- 构建时报错提示

### 7.2. 运行时框架

- 更成熟的开发工具
- 更丰富的生态系统
- 更多的社区资源
- 更好的调试体验

## 8. 未来趋势

- **混合方案**的兴起：
	- 结合编译时优化和运行时灵活性
- 更智能的编译优化选择
- 更小的运行时
- 更好的开发体验
- 更强的类型支持

## 9. 选择建议

1. 如果项目对性能和包体积有**严格要求**，考虑编译时框架
2. 如果需要大量第三方库支持，选择主流运行时框架
3. 如果是新项目，可以考虑混合方案
4. 需要权衡团队学习成本和项目需求
