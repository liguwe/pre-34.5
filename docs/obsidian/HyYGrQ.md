# 常见接口鉴权方式

`#前端安全` 

## 1. Session-Cookie 认证

```javascript
// 服务端
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (validateUser(username, password)) {
    req.session.userId = userId;
    res.cookie('sessionId', req.session.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    res.json({ success: true });
  }
});

// 中间件验证
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

## 2. **JWT（JSON Web Token）认证**

```javascript hl:4
// JWT 工具类
class JwtUtil {
  static sign(payload) {
    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: '24h',
      algorithm: 'HS256'
    });
  }

  static verify(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return null;
    }
  }
}

// 登录接口
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (validateUser(username, password)) {
    const token = JwtUtil.sign({ userId: user.id });
    res.json({ token });
  }
});

// JWT 中间件
const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = JwtUtil.verify(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};
```

## 3. API Key 认证： `req.headers['x-api-key']`

```javascript
// API Key 中间件
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  if (!validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};

// 使用
app.get('/api/data', apiKeyMiddleware, (req, res) => {
  // 处理请求
});
```

## 4. 签名认证

```javascript
class SignatureAuth {
  static generateSignature(params, secretKey) {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // 按字母顺序排序参数
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    // 拼接参数
    const signStr = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // 加入时间戳和随机数
    const finalStr = `${signStr}&timestamp=${timestamp}&nonce=${nonce}`;
    
    // 计算签名
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(finalStr)
      .digest('hex');

    return {
      signature,
      timestamp,
      nonce
    };
  }

  static verifySignature(params, signature, timestamp, nonce, secretKey) {
    // 验证时间戳是否过期
    const now = Date.now();
    if (now - timestamp > 5 * 60 * 1000) {
      return false;
    }

    // 重新计算签名
    const { signature: newSignature } = this.generateSignature(params, secretKey);
    return signature === newSignature;
  }
}

// 使用示例
app.post('/api/data', (req, res) => {
  const { signature, timestamp, nonce } = req.headers;
  const params = req.body;

  if (!SignatureAuth.verifySignature(
    params,
    signature,
    timestamp,
    nonce,
    SECRET_KEY
  )) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 处理请求
});
```

## 5. 双重认证（2FA）

```javascript
class TwoFactorAuth {
  // 生成密钥
  static generateSecret() {
    return speakeasy.generateSecret({
      name: 'MyApp',
      length: 20
    });
  }

  // 生成 TOTP token
  static generateToken(secret) {
    return speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32'
    });
  }

  // 验证 token
  static verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 1
    });
  }
}

// 使用示例
app.post('/enable-2fa', (req, res) => {
  const secret = TwoFactorAuth.generateSecret();
  // 保存 secret 到用户记录
  res.json({
    secret: secret.base32,
    qrCode: secret.otpauth_url
  });
});

app.post('/verify-2fa', (req, res) => {
  const { token } = req.body;
  const userSecret = getUserSecret(req.user.id);

  if (!TwoFactorAuth.verifyToken(userSecret, token)) {
    return res.status(401).json({ error: 'Invalid 2FA token' });
  }

  // 验证通过
  res.json({ success: true });
});
```

## 6. 验证码机制

- 比如钉钉、企微或者密码管理器的验证码机制
- 也有点类似于2FA，之前 GitHub 要求验证来着
