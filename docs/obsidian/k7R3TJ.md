# 前端错误的分类、优先级管理及处理策略

`#R1` `#javascript` 

## 1. 错误分类体系

### 1.1. 运行时错误 (Runtime Errors)

- JavaScript 语法错误
- 类型错误
- 引用错误

```javascript hl:1,14,25
// 1.1 JavaScript 语法错误
class RuntimeErrorHandler {
    static handleSyntaxError(error) {
        return {
            category: 'Runtime',
            subType: 'Syntax',
            priority: 'P0',
            error,
            stack: error.stack,
            recovery: 'immediate-report'
        };
    }

    // 1.2 类型错误
    static handleTypeError(error) {
        return {
            category: 'Runtime',
            subType: 'Type',
            priority: 'P1',
            error,
            stack: error.stack
        };
    }

    // 1.3 引用错误
    static handleReferenceError(error) {
        return {
            category: 'Runtime',
            subType: 'Reference',
            priority: 'P1',
            error,
            stack: error.stack
        };
    }
}
```

### 1.2. 网络错误 (Network Errors)

- api 错误
	- 不同的状态码
- 资源加载错误
	- 重要资源
	- 不重要资源



```javascript
class NetworkErrorHandler {
    // 2.1 API 请求错误
    static handleAPIError(error) {
        const errorMap = {
            400: { priority: 'P2', type: 'BadRequest' },
            401: { priority: 'P0', type: 'Unauthorized' },
            403: { priority: 'P1', type: 'Forbidden' },
            404: { priority: 'P2', type: 'NotFound' },
            500: { priority: 'P1', type: 'ServerError' },
            502: { priority: 'P1', type: 'BadGateway' },
            503: { priority: 'P0', type: 'ServiceUnavailable' },
            504: { priority: 'P1', type: 'GatewayTimeout' }
        };

        const { priority, type } = errorMap[error.status] || 
            { priority: 'P2', type: 'Unknown' };

        return {
            category: 'Network',
            subType: type,
            priority,
            error,
            endpoint: error.config?.url,
            status: error.status
        };
    }

    // 2.2 资源加载错误
    static handleResourceError(error) {
        return {
            category: 'Network',
            subType: 'Resource',
            priority: 'P1',
            error,
            resource: error.target?.src || error.target?.href
        };
    }
}
```

### 1.3. 业务逻辑错误 (Business Logic Errors)

>  都是用户**预定义的错误类型**

- 表单验证错误
- 状态管理错误
- 用户操作错误

```javascript hl:2,14,25
class BusinessErrorHandler {
    // 3.1 表单验证错误
    static handleValidationError(error) {
        return {
            category: 'Business',
            subType: 'Validation',
            priority: 'P2',
            error,
            field: error.field,
            value: error.value
        };
    }

    // 3.2 状态管理错误
    static handleStateError(error) {
        return {
            category: 'Business',
            subType: 'State',
            priority: 'P1',
            error,
            state: error.state
        };
    }

    // 3.3 用户操作错误
    static handleUserOperationError(error) {
        return {
            category: 'Business',
            subType: 'UserOperation',
            priority: 'P3',
            error,
            operation: error.operation
        };
    }
}
```

### 1.4. 性能错误 (Performance Issues)

- 性能错误
	- FCP：First Contentful Paint
	- FID：First Input Delay
	- LCP：
	- 等
- 内存错误

```javascript
class PerformanceErrorHandler {
    // 4.1 加载性能
    static handleLoadingPerformance(metrics) {
        const thresholds = {
            FCP: 2000,  // First Contentful Paint
            LCP: 2500,  // Largest Contentful Paint
            FID: 100,   // First Input Delay
            CLS: 0.1    // Cumulative Layout Shift
        };

        return {
            category: 'Performance',
            subType: 'Loading',
            priority: metrics.value > thresholds[metrics.name] ? 'P1' : 'P3',
            metrics
        };
    }

    // 4.2 内存性能
    static handleMemoryPerformance(usage) {
        return {
            category: 'Performance',
            subType: 'Memory',
            priority: usage.overLimit ? 'P1' : 'P2',
            usage
        };
    }
}
```

## 2. 优先级管理系统

### 2.1. 优先级定义

```javascript
const PriorityDefinition = {
    P0: {
        description: '致命错误',
        responseTime: '立即',
        impact: '整个应用不可用',
        examples: ['白屏', '无法登录', '支付流程中断'],
        notification: 'immediate',
        autoRetry: true
    },
    P1: {
        description: '严重错误',
        responseTime: '24小时内',
        impact: '主要功能受影响',
        examples: ['主要API失败', '核心模块异常', '数据丢失'],
        notification: 'urgent',
        autoRetry: true
    },
    P2: {
        description: '一般错误',
        responseTime: '72小时内',
        impact: '次要功能受影响',
        examples: ['非核心API错误', 'UI显示异常', '性能下降'],
        notification: 'normal',
        autoRetry: false
    },
    P3: {
        description: '轻微错误',
        responseTime: '下次迭代',
        impact: '体验轻微受影响',
        examples: ['控制台警告', '非关键资源加载失败'],
        notification: 'batch',
        autoRetry: false
    }
};
```

### 2.2. 错误处理中心

```javascript
class ErrorCenter {
    static instance = null;

    constructor() {
        this.errorQueue = new Map();
        this.errorHandlers = new Map();
        this.initializeHandlers();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ErrorCenter();
        }
        return this.instance;
    }

    initializeHandlers() {
        // 注册各种错误处理器
        this.registerHandler('Runtime', new RuntimeErrorHandler());
        this.registerHandler('Network', new NetworkErrorHandler());
        this.registerHandler('Business', new BusinessErrorHandler());
        this.registerHandler('Performance', new PerformanceErrorHandler());
    }

    handleError(error) {
        const errorInfo = this.categorizeError(error);
        this.processError(errorInfo);
    }

    categorizeError(error) {
        // 根据错误类型分类
        if (error instanceof TypeError) {
            return RuntimeErrorHandler.handleTypeError(error);
        }
        // ... 其他错误类型判断
    }

    processError(errorInfo) {
        const { priority } = errorInfo;
        
        // 根据优先级处理
        switch(priority) {
            case 'P0':
                this.handleP0Error(errorInfo);
                break;
            case 'P1':
                this.handleP1Error(errorInfo);
                break;
            // ... 其他优先级处理
        }
    }

    handleP0Error(errorInfo) {
        // 1. 立即上报
        this.reportError(errorInfo);
        
        // 2. 触发告警
        this.triggerAlert(errorInfo);
        
        // 3. 尝试恢复
        this.attemptRecovery(errorInfo);
        
        // 4. 用户提示
        this.notifyUser(errorInfo);
    }
}
```

## 3. 错误监控与上报策略

### 3.1. 全局错误监听

```javascript
class ErrorMonitor {
    static initialize() {
        // 1. JavaScript 运行时错误
        window.onerror = (message, source, lineno, colno, error) => {
            ErrorCenter.getInstance().handleError({
                type: 'Runtime',
                error,
                context: { message, source, lineno, colno }
            });
        };

        // 2. Promise 未捕获异常
        window.addEventListener('unhandledrejection', (event) => {
            ErrorCenter.getInstance().handleError({
                type: 'Promise',
                error: event.reason
            });
        });

        // 3. 资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
                ErrorCenter.getInstance().handleError({
                    type: 'Resource',
                    error: event
                });
            }
        }, true);
    }
}
```

### 3.2. 错误上报策略

- 立即上报
- 列队批量上报

```javascript
class ErrorReporter {
    constructor() {
        this.queue = [];
        this.batchSize = 10;
        this.batchTimeout = 5000;
    }

    report(error) {
        const { priority } = error;

        switch(priority) {
            case 'P0':
            case 'P1':
                this.immediateReport(error);
                break;
            case 'P2':
            case 'P3':
                this.queueReport(error);
                break;
        }
    }

    immediateReport(error) {
        const data = this.formatError(error);
        this.sendToServer(data);
    }

    queueReport(error) {
        this.queue.push(error);
        
        if (this.queue.length >= this.batchSize) {
            this.flushQueue();
        }
    }

    formatError(error) {
        return {
            ...error,
            timestamp: new Date().toISOString(),
            userInfo: this.getUserInfo(),
            environment: process.env.NODE_ENV,
            version: process.env.VERSION,
            url: window.location.href
        };
    }
}
```

### 3.3. 错误恢复策略

- 重试：比如网络请求重试
- 降级：比如 SSR → CSR 等

```javascript
class ErrorRecovery {
    static async attemptRecovery(error) {
        const strategies = {
            Network: async () => {
                await this.retryRequest(error);
            },
            State: () => {
                this.resetState(error);
            },
            Resource: async () => {
                await this.reloadResource(error);
            }
        };

        const strategy = strategies[error.category];
        if (strategy) {
            await strategy();
        }
    }

    static async retryRequest(error, maxRetries = 3) {
        let retries = 0;
        while (retries < maxRetries) {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
                const response = await fetch(error.endpoint);
                if (response.ok) return response;
            } catch (e) {
                retries++;
            }
        }
        throw new Error('Max retries reached');
    }
}
```

## 4. 最佳实践建议

1. **错误分类准则**
   - 按**影响范围**分类
   - 按**错误来源**分类
   - 按**处理紧急程度**分类

2. **优先级确定因素**
   - 用户影响程度
   - 业务重要性
   - 修复难度
   - 影响范围

3. **监控指标**
   - 错误发生率
   - 影响用户数
   - 错误持续时间
   - 修复时间

4. **处理流程**
   - 及时发现
   - 准确分类
   - 优先级排序
   - 及时处理
   - 复盘总结
