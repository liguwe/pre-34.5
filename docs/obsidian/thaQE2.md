# 浏览器对 Source Map 的支持机制和实现原理

## 1. 主流浏览器支持情况

### 1.1. 支持程度

```javascript
// 完全支持 Source Map 的浏览器
- Chrome/Chromium (v39+)
- Firefox (v44+)
- Safari (v12+)
- Edge (v12+)

// 部分功能支持
- IE 11 (仅支持 JavaScript source maps)
```

### 1.2. 开启方式

```javascript
// 1. 文件末尾注释方式
//# sourceMappingURL=app.js.map

// 2. HTTP 响应头方式
SourceMap: /path/to/file.js.map
// 或旧版本
X-SourceMap: /path/to/file.js.map
```

## 2. DevTools 实现机制

### 2.1. 基本工作流程

```javascript
// 1. 检测 Source Map
document.currentScript.src  // 获取当前执行的脚本
↓
// 2. 解析 sourceMappingURL
parseSourcMappingURL(script)
↓
// 3. 加载 Source Map 文件
fetchSourceMap(url)
↓
// 4. 解析并建立映射关系
parseSourceMap(content)
```

### 2.2. 源码映射过程

```javascript
// 压缩后的代码
function a(){b("Hello")}
// Source Map 映射信息
{
  "version": 3,
  "file": "out.js",
  "sources": ["original.js"],
  "names": ["greet", "console", "log"],
  "mappings": "AAAA,SAASA,IAAIC,QAAQC"
}
// 原始源码
function greet() {
  console.log("Hello");
}
```

## 3. 浏览器加载机制

### 3.1. 异步加载策略

```javascript
// Chrome DevTools 源码简化示例
class SourceMapManager {
  async loadSourceMap(script) {
    // 1. 检查缓存
    if (this.sourceMapCache.has(script.url)) {
      return this.sourceMapCache.get(script.url);
    }

    // 2. 异步加载 source map
    const sourceMapUrl = await this.resolveSourceMapUrl(script);
    const sourceMap = await this.fetchSourceMap(sourceMapUrl);

    // 3. 缓存结果
    this.sourceMapCache.set(script.url, sourceMap);
    return sourceMap;
  }
}
```

### 3.2. 内联 Source Map 处理

```javascript
// Base64 编码的内联 Source Map
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9...

// 浏览器处理流程
function parseInlineSourceMap(content) {
  // 1. 提取 Base64 部分
  const base64Content = content.split(',')[1];
  
  // 2. 解码
  const jsonContent = atob(base64Content);
  
  // 3. 解析 JSON
  return JSON.parse(jsonContent);
}
```

## 4. 调试器集成

### 4.1. 断点映射

```javascript
// DevTools 中的断点处理
class DebuggerAgent {
  setBreakpoint(scriptId, lineNumber, columnNumber) {
    // 1. 获取源码映射
    const sourceMap = this.sourceMapManager.getSourceMap(scriptId);
    
    // 2. 转换断点位置
    const originalPosition = sourceMap.originalPositionFor({
      line: lineNumber,
      column: columnNumber
    });
    
    // 3. 设置实际断点
    this.setBreakpointAtPosition(
      originalPosition.line,
      originalPosition.column
    );
  }
}
```

### 4.2. 调用栈重构

```javascript
// 错误堆栈重构示例
class ErrorStackRewriter {
  async rewriteStack(error) {
    const stack = error.stack.split('\n');
    const newStack = [];
    
    for (const frame of stack) {
      // 1. 解析堆栈信息
      const {fileName, lineNumber, columnNumber} = parseFrame(frame);
      
      // 2. 查找源码位置
      const original = await this.findOriginalPosition(
        fileName,
        lineNumber,
        columnNumber
      );
      
      // 3. 重构堆栈信息
      newStack.push(formatFrame(original));
    }
    
    return newStack.join('\n');
  }
}
```

## 5. 性能优化

### 5.1. 缓存策略

```javascript
// DevTools 中的缓存实现
class SourceMapCache {
  constructor() {
    this.maps = new Map();
    this.pending = new Map();
  }

  async getSourceMap(url) {
    // 1. 检查内存缓存
    if (this.maps.has(url)) {
      return this.maps.get(url);
    }

    // 2. 检查正在加载的请求
    if (this.pending.has(url)) {
      return this.pending.get(url);
    }

    // 3. 新建加载请求
    const promise = this.loadSourceMap(url);
    this.pending.set(url, promise);
    
    try {
      const sourceMap = await promise;
      this.maps.set(url, sourceMap);
      return sourceMap;
    } finally {
      this.pending.delete(url);
    }
  }
}
```

### 5.2. 懒加载策略

```javascript
// 按需加载源码文件
class SourceContentLoader {
  async loadSourceContent(sourceMap, sourceIndex) {
    // 仅在需要时加载源文件内容
    if (!sourceMap.sourcesContent[sourceIndex]) {
      const sourceUrl = sourceMap.sources[sourceIndex];
      sourceMap.sourcesContent[sourceIndex] = 
        await this.fetchSource(sourceUrl);
    }
    return sourceMap.sourcesContent[sourceIndex];
  }
}
```

## 6. 安全考虑

### 6.1. 跨域处理

```javascript
// Source Map 跨域加载
fetch(sourceMapUrl, {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json'
  }
}).then(response => {
  if (!response.ok) {
    throw new Error('Source map load failed');
  }
  return response.json();
});
```

### 6.2. 访问控制

```javascript
// 服务器端配置示例（nginx）
location ~ \.map$ {
    add_header Access-Control-Allow-Origin *;
    # 仅允许开发环境访问
    if ($http_referer !~ ^https?://localhost) {
        return 404;
    }
}
```

## 7. 常见问题处理

### 7.1. 映射不准确

```javascript
// 开发者工具配置
{
  // 强制重新加载 source map
  devtools.force_source_maps: true,
  
  // 禁用缓存
  devtools.cache.disabled: true
}
```

### 7.2. 加载失败处理

```javascript
class SourceMapLoader {
  async loadSourceMap(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Source map load failed: ${error}`);
      // 返回空映射
      return {
        version: 3,
        file: "",
        sources: [],
        names: [],
        mappings: ""
      };
    }
  }
}
```

理解浏览器的 Source Map 支持机制对于：
1. 优化开发调试体验
2. 解决源码映射问题
3. 提高调试效率
4. 处理生产环境错误追踪
