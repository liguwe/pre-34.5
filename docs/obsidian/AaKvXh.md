# 前端安全相关

`#前端安全`  

## 1. 总结

> 再重复一遍

## 2. XSS（跨站脚本攻击）

### 2.1. 攻击类型

- **存储型XSS**：恶意代码被存储在数据库中
- **反射型XSS**：恶意代码通过URL参数传递
- **DOM型XSS**：通过修改页面DOM节点形成攻击

### 2.2. 防范措施

1. 输入过滤：对用户输入进行严格验证
2. 输出转义：对输出内容进行 HTML 实体编码
3. 使用 CSP（Content Security Policy）内容安全策略
4. 避免使用`eval()`、`innerHTML`等危险函数
5. 对 Cookie 设置 `HttpOnly` 属性

## 3. CSRF（跨站请求伪造）

### 3.1. 攻击类型

- **GET类型CSRF**：
	- 利用 GET 请求进行攻击
- **POST类型CSRF**：
	- 通过**自动提交表单**进行攻击
- **链接类型CSRF**：
	- 诱导用户点击恶意链接

### 3.2. 防范措施

1. 使用 CSRF Token 验证
2. **验证请求来源**（`Referer`）
3. 设置 `SameSite Cookie` 属性
4. 使用 `双重Cookie`验证
5. **在请求头中加入自定义字段**

## 4. 点击劫持（Clickjacking）

### 4.1. 防范措施

1. 设置 `X-Frame-Options` 响应头
2. 使用 `frame-ancestors` CSP 指令
3. JavaScript 框架防御
4. 实现页面重定向保护 

```bash
// 1. 设置 X-Frame-Options 响应头
// X-Frame-Options: DENY
// X-Frame-Options: SAMEORIGIN

// 2. 使用 CSP frame-ancestors 指令
// Content-Security-Policy: frame-ancestors 'none';

```

> 更多见 [7. 点击劫持 ( Clickjacking )](/z5dnKx)

## 5. SQL注入

### 5.1. 攻击原理

- 通过输入特殊的 SQL 语句片段
- 破坏原有 SQL 语句结构，实现非法操作

### 5.2. 防范措施

1. 使用参数化查询
2. 过滤特殊字符
3. 限制数据库操作权限
4. 避免直接拼接SQL语句

```javascript
// 1. 使用参数化查询
const query = 'SELECT * FROM users WHERE id = ?';
connection.query(query, [userId]);

// 2. 使用 ORM 框架
const user = await User.findOne({
    where: { id: userId }
});

```

## 6. 敏感信息泄露

```javascript
// 1. 避免在前端存储敏感信息
// 错误示例
localStorage.setItem('token', 'sensitive_token');

// 2. 使用 HTTPS

// 3. 设置正确的响应头

// Cache-Control: no-store
// Strict-Transport-Security: max-age=31536000
```

## 7. 其他安全注意事项

### 7.1. 开发规范

- **密码安全**
	- 使用 HTTPS 传输
	- 密码加密存储
	- 实施密码强度要求
- **文件上传安全**
	- 限制文件类型和大小
	- 文件名随机化
	- 存储路径安全配置
- **API安全**
	- 实施请求频率限制
	- 接口权限控制
	- 数据加密传输

### 7.2. 最佳实践

1. 定期进行安全审计
2. 及时更新依赖包
3. 实施错误处理机制
4. 使用安全的第三方库
5. 保持代码简洁，避免不必要的复杂性

```bash
# 定期检查依赖包安全性 
npm audit 
yarn audit
```

密码安全

```javascript
// 1. 密码强度验证
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
}

// 2. 密码传输时使用加密
const encryptPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

```

## 8. 预防措施总结

1. **代码层面**
	- 遵循安全编码规范
	- 使用成熟的安全库
	- 实施输入验证和输出转义
2. **配置层面**
	- 启用安全响应头
	- 配置合适的Cookie属性
	- 实施访问控制策略
3. **运维层面**
	- 定期安全测试
	- 监控异常访问
	- 及时修复漏洞
