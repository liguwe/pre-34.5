# window.onerror 和 window.addEventListener 的区别？

`#javascript` 

## 1. 语法和使用方式

### 1.1. **window.onerror**:  

用于捕获**未被 try-catch 捕获的 JavaScript 运行时**错误。

- 只能设置一个处理函数
- 后面的赋值会覆盖前面的
- 可以捕获语法错误和运行时错误
- **无法捕获异步错误（Promise）**
- 设置**返回值为 true** 可以阻止浏览器默认的错误处理

```javascript
// 基本语法
window.onerror = function(message, source, lineno, colno, error) {
    // message: 错误信息
    // source: 发生错误的脚本URL
    // lineno: 发生错误的行号
    // colno: 发生错误的列号
    // error: Error对象
    console.log('捕获到错误：', {
        message,
        source,
        lineno,
        colno,
        error
    });
    return true; // 返回 true 可以阻止浏览器默认的错误处理
};

// 示例
window.onerror = function(msg, url, line, col, error) {
    console.log(`错误: ${msg} \n在 ${url} 第 ${line} 行`);
    return false;
};
```

### 1.2. **window.addEventListener**:

`addEventListener` 是事件监听器，可以**添加多个错误处理函数**。

```javascript
// 基本语法
window.addEventListener('error', function(event) {
    // event.message: 错误信息
    // event.filename: 发生错误的文件
    // event.lineno: 行号
    // event.colno: 列号
    // event.error: Error对象
    console.log('错误事件：', event);
}, false);

// 示例
window.addEventListener('error', (event) => {
    console.log('捕获到错误：', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
}, false);
```

特点：
1. 可以添加多个错误处理函数
2. 不会相互覆盖
3. 可以捕获资源加载错误（如图片加载失败）
4. **同样无法捕获 Promise 错误**

## 2. 主要区别

### 2.1. **错误捕获范围**:

- `window.onerror` 主要捕获 **JavaScript 运行时错误和语法错误**
- `window.addEventListener('error')` 可以**捕获更广泛的错误**
	- 包括资源加载错误（如图片加载失败 ）
	- JavaScript 运行时错误

```javascript
// onerror 只能有一个处理函数
window.onerror = function(msg) {
    console.log('处理器1');
};
window.onerror = function(msg) {
    console.log('处理器2'); // 会覆盖处理器1
};

// addEventListener 可以有多个处理函数
window.addEventListener('error', function(event) {
    console.log('处理器1');
});
window.addEventListener('error', function(event) {
    console.log('处理器2');
}); // 两个处理器都会执行
```

### 2.2. **处理机制**:

- `window.onerror` 一次只能设置一个处理函数，新的会覆盖旧的
- `addEventListener` 可以添加多个错误处理函数，它们会按照添加顺序依次执行 

### 2.3. **返回值处理**:

- `window.onerror` 
	- 返回 `true` 可以阻止默认错误处理
- `addEventListener` 
	- 需要使用 `event.preventDefault()` 来阻止默认行为

### 2.4. **错误信息获取**:

- `window.onerror` 接收分散的参数：
	- message, source, lineno, colno, error
- `addEventListener` 通过单个 `event 对象`获取所有信息

### 2.5. **资源加载错误的处理**：

```javascript hl:8
// onerror 无法捕获资源加载错误
window.onerror = function(msg) {
    console.log('这里捕获不到图片加载错误');
};

// addEventListener 可以捕获资源加载错误
window.addEventListener('error', function(event) {
    if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT')) {
        console.log('资源加载失败:', event.target.src);
    }
}, true); // 注意这里使用捕获阶段
```

## 3. 实际应用示例

```javascript hl:23
// 同时使用两种方式捕获错误
// 方式1：onerror
window.onerror = function(message, source, lineno, colno, error) {
    console.log('捕获到错误 (onerror):', {
        message,
        source,
        lineno,
        colno,
        error
    });
    return true;
};

// 方式2：addEventListener
window.addEventListener('error', function(event) {
    console.log('捕获到错误 (addEventListener):', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    // 如果是资源加载错误
    if (event.target && (event.target.localName === 'img' || event.target.localName === 'script')) {
        console.log('资源加载错误:', event.target.src);
    }
}, true);
```

## 4. 注意事项

### 4.1. 跨域脚本错误处理需要特别注意：

```html
<!-- 添加 crossorigin 属性 -->
<script crossorigin="anonymous" src="https://other-domain.com/app.js"></script>
```

### 4.2. 某些错误可能无法被捕获：

- Promise 中的错误需要使用 `unhandledrejection` 事件
- 某些浏览器可能限制错误信息的详细程度

### 4.3. 性能影响

- 错误处理应该是轻量级的
- 考虑错误**采样和聚合**
- **避免在错误处理中产生新的错误**

## 5. Promise 错误处理

1. `unhandledrejection` 专门处理未被捕获的 Promise 错误
2. 如果 Promise 错误被正确捕获（使用 `.catch()` 或 `try/catch`），就不会触发 `unhandledrejection`
3. 错误处理时机很重要，延迟处理可能会导致 `unhandledrejection` 被触发
4. 建议在生产环境中始终添加全局的 `unhandledrejection` 处理器，作为**最后的错误防线**

对于 Promise 错误，需要使用 `unhandledrejection` 事件：

```javascript
// Promise 错误处理
window.addEventListener('unhandledrejection', function(event) {
    console.log('Promise 错误：', event.reason);
    event.preventDefault(); // 阻止默认处理
});

// 示例
Promise.reject('Promise 失败').catch(err => {
    // 有 catch 处理则不会触发 unhandledrejection
});

new Promise((resolve, reject) => {
    throw new Error('Promise 错误');
}); // 会触发 unhandledrejection
```

## 6. 完整的错误处理方案

```javascript
// 综合错误处理示例
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // 处理常规运行时错误
        window.onerror = (msg, url, line, col, error) => {
            this.handleError({
                type: 'runtime',
                msg,
                url,
                line,
                col,
                error
            });
            return true;
        };

        // 处理资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT')) {
                this.handleError({
                    type: 'resource',
                    target: event.target.tagName,
                    url: event.target.src
                });
            }
        }, true);

        // 处理 Promise 错误
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                reason: event.reason
            });
            event.preventDefault();
        });
    }

    handleError(error) {
        console.log('错误信息：', error);
        // 这里可以添加上报逻辑
    }
}

// 使用
const errorHandler = new ErrorHandler();
```

## 7. 最佳实践建议

### 7.1. **同时使用多种错误捕获方式**：

```javascript
// 综合使用多种错误捕获方式
function setupErrorHandling() {
    // 运行时错误
    window.onerror = function(msg, url, line, col, error) {
        console.log('运行时错误');
        return false;
    };

    // 资源加载错误
    window.addEventListener('error', function(event) {
        console.log('资源加载错误');
    }, true);

    // Promise 错误
    window.addEventListener('unhandledrejection', function(event) {
        console.log('Promise 错误');
    });
}
```

### 7.2. **错误信息分类处理**：

- 运行时错误
- 资源加载错误
- 处理 promise 错误

```javascript hl:5,8,11
class ErrorTracker {
    static sendError(errorInfo) {
        // 可以根据错误类型进行不同处理
        switch(errorInfo.type) {
            case 'runtime':
                // 处理运行时错误
                break;
            case 'resource':
                // 处理资源加载错误
                break;
            case 'promise':
                // 处理 Promise 错误
                break;
        }
    }
}
```

### 7.3. **错误上报节流**：

```javascript
function throttleError(fn, wait) {
    let timer = null;
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, wait);
        }
    };
}

const reportError = throttleError((error) => {
    // 上报错误信息
    console.log('错误上报：', error);
}, 2000);
```

### 7.4. **组合使用**：

- 建议同时使用两种方式以获得最完整的错误捕获覆盖
- `window.onerror` 用于基本的 JavaScript 错误处理
- `addEventListener` 用于捕获资源加载和其他特殊错误

### 7.5. **错误上报**：

```javascript
window.addEventListener('error', function(event) {
    // 上报错误信息到服务器
    const errorInfo = {
        type: event.type,
        message: event.message,
        url: event.filename,
        line: event.lineno,
        col: event.colno,
        error: event.error && event.error.stack
    };
    // 发送错误信息
    navigator.sendBeacon('/log/error', JSON.stringify(errorInfo));
}, true);
```

### 7.6. **性能考虑**：

- `addEventListener` 的处理函数应该尽可能简洁
- 避免在错误处理函数中执行复杂的操作
- 考虑使用防抖或节流来限制错误**上报频率**

### 7.7. **调试支持**：

```javascript
window.addEventListener('error', function(event) {
    if (process.env.NODE_ENV === 'development') {
        console.group('Error Details');
        console.log('Error Message:', event.message);
        console.log('Stack Trace:', event.error && event.error.stack);
        console.groupEnd();
    }
}, true);
```
