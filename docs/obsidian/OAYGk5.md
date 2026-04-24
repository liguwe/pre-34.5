# 高性能插入 100000 个 DOM节点

`#前端性能` 

## 1. 总结

- 下面按**性能从高到低**排序说明
	- DocumentFragment + 虚拟列表
	- DocumentFragment + requestAnimationFrame 分批插入
	- DocumentFragment 一次性插入
	- innerHTML 模板字符串

## 2. DocumentFragment + 虚拟列表

```javascript
function renderList(total) {
    const container = document.getElementById('container');
    const fragment = document.createDocumentFragment();
    const itemHeight = 20; // 假设每项高度20px
    const visibleCount = Math.ceil(window.innerHeight / itemHeight);
    
    // 创建虚拟滚动容器
    const virtualContainer = document.createElement('div');
    virtualContainer.style.height = `${total * itemHeight}px`;
    virtualContainer.style.position = 'relative';
    
    // 初始只渲染可视区域的内容
    function renderItems(startIndex) {
        fragment.textContent = ''; // 清空
        const endIndex = Math.min(startIndex + visibleCount, total);
        
        for(let i = startIndex; i < endIndex; i++) {
            const div = document.createElement('div');
            div.textContent = `Item ${i}`;
            div.style.position = 'absolute';
            div.style.top = `${i * itemHeight}px`;
            fragment.appendChild(div);
        }
        
        virtualContainer.textContent = '';
        virtualContainer.appendChild(fragment);
    }
    
    // 监听滚动事件
    container.addEventListener('scroll', () => {
        const scrollTop = container.scrollTop;
        const startIndex = Math.floor(scrollTop / itemHeight);
        renderItems(startIndex);
    });
    
    container.appendChild(virtualContainer);
    renderItems(0);
}
```

## 3. DocumentFragment + requestAnimationFrame 分批插入

```javascript hl:14,17
function renderWithRAF(total) {
    const container = document.getElementById('container');
    const fragment = document.createDocumentFragment();
    const batchSize = 500; // 每批处理500个
    let currentIndex = 0;
    
    function appendItems() {
        const fragment = document.createDocumentFragment();
        const end = Math.min(currentIndex + batchSize, total);
        
        for(let i = currentIndex; i < end; i++) {
            const div = document.createElement('div');
            div.textContent = `Item ${i}`;
            fragment.appendChild(div);
        }
        
        container.appendChild(fragment);
        currentIndex = end;
        
        if(currentIndex < total) {
            requestAnimationFrame(appendItems);
        }
    }
    
    requestAnimationFrame(appendItems);
}
```

## 4. DocumentFragment 一次性插入

```javascript hl:3,8,11
function renderAll(total) {
    const container = document.getElementById('container');
    const fragment = document.createDocumentFragment();
    
    for(let i = 0; i < total; i++) {
        const div = document.createElement('div');
        div.textContent = `Item ${i}`;
        fragment.appendChild(div);
    }
    
    container.appendChild(fragment);
}
```

## 5. innerHTML 模板字符串

```javascript
function renderWithInnerHTML(total) {
    const container = document.getElementById('container');
    const html = Array.from({ length: total }, (_, i) => 
        `<div>Item ${i}</div>`
    ).join('');
    
    container.innerHTML = html;
}
```

## 6. 性能优化要点

- 使用虚拟列表（最优方案）
	- 只渲染可视区域的内容
	- 监听滚动按需渲染
	- 内存占用最小
	- 性能最好
- 分批处理
	- 使用 `requestAnimationFrame` 分批插入
	- 避免长时间阻塞主线程
	- 保持页面响应性
- DocumentFragment
	- 减少 DOM 操作次数
	- 避免重排重绘
	- 一次性插入
- 批量更新
	- 使用 innerHTML 或模板字符串
	- 减少 DOM 操作
	- 注意 XSS 风险

## 7. 使用建议

- 数据量大时（>1000）推荐使用虚拟列表
- 数据量中等时（100-1000）可以用分批处理
- 数据量小时（<100）可以直接用 DocumentFragment
- 需要考虑内存占用时避免使用 innerHTML

## 8. 示例用法

```javascript
// 虚拟列表（推荐）
renderList(100000);

// 分批处理
renderWithRAF(100000);

// 一次性插入
renderAll(100000);

// innerHTML方式
renderWithInnerHTML(100000);
```
