# 浏览器实现截图

`#bom` 

## 1. HTML5 Canvas 截图

这是最基本和常用的方法，主要使用 `Canvas API` 来实现。

```javascript hl:21,11
// 基本实现步骤
function captureElement(element) {
    // 1. 创建 canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // 2. 设置 canvas 尺寸
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    
    // 3. 将目标元素绘制到 canvas
    const html2canvas = new html2canvas(element);
    
    // 4. 转换为图片
    const image = canvas.toDataURL('image/png');
    
    // 5. 下载或使用图片
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = image;
    link.click();
}
```

## 2. MediaDevices API (屏幕录制)

用于捕获屏幕内容，可以实现更复杂的屏幕截图功能。

```javascript
async function captureScreen() {
    try {
        // 1. 请求屏幕捕获权限
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                mediaSource: 'screen'
            }
        });
        
        // 2. 创建 video 元素
        const video = document.createElement('video');
        video.srcObject = stream;
        
        // 3. 等待视频加载
        await new Promise(resolve => video.onloadedmetadata = resolve);
        video.play();
        
        // 4. 创建 canvas 并截图
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // 5. 停止所有轨道
        stream.getTracks().forEach(track => track.stop());
        
        // 6. 转换为图片
        return canvas.toDataURL('image/png');
    } catch (err) {
        console.error('Error: ' + err);
    }
}
```

## 3. 使用第三方库 `html2canvas`

`html2canvas` 是一个流行的库，可以将 DOM 元素转换为 canvas。

```javascript
import html2canvas from 'html2canvas';

function captureElementWithHtml2canvas(element) {
    html2canvas(element, {
        // 配置选项
        useCORS: true,            // 处理跨域图片
        scale: window.devicePixelRatio, // 设备像素比
        logging: true,            // 启用日志
        allowTaint: true,         // 允许加载跨域图片
        backgroundColor: null     // 背景色
    }).then(canvas => {
        // 转换为图片
        const image = canvas.toDataURL('image/png');
        // 处理图片...
    });
}
```

## 4. 浏览器扩展 API

如果是**开发浏览器扩展**，可以使用**浏览器提供的截图 API**：

```javascript
// Chrome 扩展示例
chrome.tabs.captureVisibleTab(null, {}, function(image) {
    // image 是 base64 编码的图片数据
});
```

## 5. 实现中需要注意的问题

### 5.1. 跨域资源处理

```javascript hl:3
// 处理跨域图片
const img = new Image();
img.crossOrigin = 'anonymous';
img.src = url;
```

### 5.2. 高分辨率屏幕支持

```javascript
// 考虑设备像素比
canvas.width = element.offsetWidth * window.devicePixelRatio;
canvas.height = element.offsetHeight * window.devicePixelRatio;
context.scale(window.devicePixelRatio, window.devicePixelRatio);
```

### 5.3. 异步内容处理

```javascript
// 等待图片加载完成
async function waitForImages(element) {
    const images = element.getElementsByTagName('img');
    const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });
    await Promise.all(promises);
}
```

### 5.4. 性能优化

```javascript
// 使用 requestAnimationFrame 优化性能
requestAnimationFrame(() => {
    // 执行截图操作
});
```

## 6. 常见应用场景

1. 网页内容分享
2. 生成缩略图
3. 页面 bug 截图反馈
4. 生成图片报告
5. 保存 canvas 绘制内容

## 7. 总结

前端实现截图功能主要依赖：
- `Canvas API` 进行图像处理
- `MediaDevices API` 捕获屏幕内容
- 第三方库提供的功能 → `html2canvas`
- 浏览器扩展 API
	- 利用浏览器本身提供的能力
		- 类似的还有很多能力，比如截图，离线渲染、生成 PDF 等等
