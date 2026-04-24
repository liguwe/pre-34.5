# OAuth 2.0 认证

`#前端安全` 

OAuth 2.0 是一个授权框架，**允许第三方应用获取用户在某个服务提供商上的资源，而无需知道用户的密码**。

## 1. 授权码模式（Authorization Code）→ redirect 的方式

**最完整、最安全的流程**
- **适用于有后端的 Web 应用**
- 交给后端重定向

```javascript
// 1. 前端跳转到授权页面
window.location.href = `https://oauth-provider.com/oauth/authorize?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  scope=read,write&
  state=RANDOM_STATE`;

// 2. 服务端处理回调，获取 code
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 3. 用 code 换取 access_token
  const response = await axios.post('https://oauth-provider.com/oauth/token', {
    grant_type: 'authorization_code',
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: CALLBACK_URL
  });

  const { access_token, refresh_token } = response.data;
  // 存储 token，后续使用
});
```

## 2. 简化模式（Implicit）

**适用于纯前端应用**，前端直接获取 token 

```javascript
// 直接获取 access_token
window.location.href = `https://oauth-provider.com/oauth/authorize?
  response_type=token&
  client_id=CLIENT_ID&
  redirect_uri=CALLBACK_URL&
  scope=read,write&
  state=RANDOM_STATE`;

// 回调 URL 中直接包含 token
// callback#access_token=TOKEN&expires_in=3600
```

## 3. 密码模式（Password）

适用于**用户高度信任的应用**。

```javascript
// 直接用用户名密码获取 token
const response = await axios.post('https://oauth-provider.com/oauth/token', {
  grant_type: 'password',
  username: 'user',
  password: 'pass',
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET
});
```

## 4. 客户端模式（Client Credentials）

> 适用于纯后端的应用，类似于 ak/sk

```javascript
const response = await axios.post('https://oauth-provider.com/oauth/token', {
  grant_type: 'client_credentials',
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET
});
```
