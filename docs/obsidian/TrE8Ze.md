# 使用 useInsertionEffect 注入 css-in-js

`#react` 

## 1. 总结

- useInsertionEffect 是 React 18 引入的一个特殊的 Effect Hook
	- 它的执行时机比 `useLayoutEffect` 和 `useEffect` 都要早
	- 其主要目的是用于 CSS-in-JS 库**在 DOM 变更之前注入样式** 
- 执行顺序如下：
	1. useInsertionEffect
	2. useLayoutEffect
	3. useEffect

## 2. 定义和基本概念

useInsertionEffect 是 React 18 引入的一个特殊的 Effect Hook，它的执行时机比 `useLayoutEffect` 和 `useEffect` 都要早。其主要目的是用于 CSS-in-JS 库**在 DOM 变更之前注入样式** 

基本语法：

```javascript
useInsertionEffect(setup, dependencies?)
```

## 3. 执行时机

执行顺序如下：
1. useInsertionEffect
2. useLayoutEffect
3. useEffect

这个顺序设计使得它**特别适合在 DOM 变更之前插入样式，避免了布局抖动的问题**

## 4. 主要使用场景

- **CSS-in-JS 库的样式注入**
	- styled-components
	- Emotion
	- 其他动态样式库
- **性能关键的样式操作**
	- 动态主题切换
	- 关键样式注入
	- 样式优先级处理 
- **特殊的 DOM 操作**
	- 需要在布局计算前执行的操作
	- 样式表动态插入
	- 性能敏感的 DOM 修改 

## 5. 实际使用案例

### 5.1. 案例1：基本的样式注入

```javascript hl:5,8
function StyleInjector({ styles }) {
  useInsertionEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = styles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [styles]);

  return null;
}
```

### 5.2. 案例2：简单的 CSS-in-JS 实现

```javascript
function DynamicStyles({ className, rules }) {
  useInsertionEffect(() => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(rules);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets
        .filter(sheet => sheet !== styleSheet);
    };
  }, [rules]);

  return <div className={className}>{/* content */}</div>;
}
```

### 5.3. 案例3：主题切换实现

```javascript hl:9
function ThemeProvider({ theme, children }) {
  useInsertionEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-theme', theme);
    styleElement.textContent = generateThemeCSS(theme);
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme]);

  return <>{children}</>;
}
```

## 6. 注意事项

- 不能访问 refs
- 专注于样式注入
- 做好清理工作
- 保持简单的逻辑
- 不能使用 DOM APIs（除了样式注入）
- 不能更新状态
- 仅用于必要的样式注入
- 注意清理工作 
- 避免复杂计算
- 防止 XSS 攻击
- 清理无用样式
- 验证样式内容

### 6.1. 注意事项的详细说明

- `useInsertionEffect`只在客户端运行，不能在服务器渲染期间运行。
- 不能从`useInsertionEffect`中更新状态。
	- 这是因为`useInsertionEffect`专为**插入操作**设计的，
	- 而不是为响应式状态变化设计的。
	- 如果在`useInsertionEffect`里更新状态，会造成组件重新渲染。
- 当`useInsertionEffect`运行时，`refs`还没有附加。
	- 如果你试图在`useInsertionEffect`中访问ref，你可能会得到`null`或未定义的值。
- `useInsertionEffect`可能在DOM更新之前或之后运行，所以不能依赖于DOM在特定时刻的更新状态。
	- 这是因为`useInsertionEffect`的设计初衷是在任何布局效果触发之前插入元素，但它并不保证在 DOM 的任何特定更新之前或之后运行。
	- 因此，依赖于DOM在特定时刻的状态可能导致不可预测的行为。
		- 例如：假设你希望在`useInsertionEffect`中检查某个元素的尺寸。但由于 DOM 可能尚未更新，所以你得到的尺寸可能是旧的或不准确的。
