# SSO 系统与权限系统设计

`#系统设计` `#前端系统设计` 

## 总结

- SSO（单点登录）允许用户使用一组凭证访问多个独立系统，主要解决跨域认证问题。
- 实现原理
	- 主域名相同
		- `client -> sso.example.com -> Set-Cookie: token=xxx; domain=.example.com`
			-  app1.example.com
			- app2.example.com
			- sso.example.com
	- 基于 Token 的跨域方案
		1. 用户访问 `系统 A`
		2. 重定向到 `SSO 服务`
		3. SSO 认证后生成 Token
		4. 302 重定向回`系统 A 并携带 Token`
		5. 系统 A 验证 Token
	- oAuth 2.0
		- Client -> 系统A
		- 系统A -> OAuth服务 (redirect)
		- OAuth服务 -> 用户授权
		- OAuth服务 -> 系统A (返回授权码)
		- 系统A -> OAuth服务 (用授权码换token)
		- OAuth服务 -> 系统A (返回access token)
	- 选择
		- Cookie 方案简单但受域名限制
		- Token 方案灵活但需要额外存储
		- OAuth2.0 方案标准化但相对复杂
	- Session 共享方案
		1. 集中式存储：Redis/Memcached
		2. Session ID 统一管理
		3. 分布式 Session 同步
- 权限系统
	- `RBAC`（Role-Based Access Control ）基于角色的访问控制
	- **Casbin**

## 1. SSO 系统要素

- 需要有一个`sso.domain.com`的站点
	- 同域，都会携带一个`AuthToken` 来校验身份就好
	- `跨域`，主要流程就是`sso`系统会上生成一个`service ticket` 
		- 然后重定向到应用服务，应用服务再根据`st` 想sso服务发送验证，成功后写入应用域名cookie，如下图
			- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-5.png)
- redis 缓存登录信息
- 数据库存储用户信息等
- 权限系统
	- 一般都会 sso 服务配合使用

## 2. 权限系统

- 一般和`sso`服务是搭起来的
- `RBAC`（Role-Based Access Control ）基于角色的访问控制
	- 当初用的这个权限引擎方案 `Casbin` 
		- go 语言和 `nodejs` 版本
- 在这个模型中，有三种实体：
	- 角色：`subject`(用户可以与角色合并成为 subject，于是角色组也可以表示了)；
	- 资源：`object`;
	- 操作：`action`;
- 举例：模型对象：规则
	- p, alice, data1, read
	- p, bob, data2, write  
    
![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-6.png)

## SSO（Single Sign-On）在跨域场景下的实现原理：

### 1. 基本概念

SSO（单点登录）允许用户使用一组凭证访问多个独立系统，主要解决跨域认证问题。

### 2. 主要实现方案

#### 2.1 基于 Cookie + Domain 方案

```
client -> sso.example.com -> Set-Cookie: token=xxx; domain=.example.com
```
- 适用场景：主域名相同的子域名系统
- 原理：设置顶级域名的 Cookie
- 限制：**只能用于同一主域名下的系统**
- 示例：
  - app1.example.com
  - app2.example.com
  - sso.example.com

#### 2.2 基于 Token 的跨域方案

1. **标准流程**：
```
1. 用户访问系统A
2. 重定向到 SSO 服务
3. SSO 认证后生成 Token
4. 重定向回系统A并携带 Token
5. 系统A验证 Token
```

2. **具体实现方式**：
```
Client -> System A
System A -> SSO (302 redirect)
SSO -> 认证页面
用户认证 -> SSO
SSO -> System A with token (302 redirect)
System A 验证 token
```

#### 2.3 OAuth2.0 方案

```
1. 授权码模式流程：
   Client -> 系统A
   系统A -> OAuth服务 (redirect)
   OAuth服务 -> 用户授权
   OAuth服务 -> 系统A (返回授权码)
   系统A -> OAuth服务 (用授权码换token)
   OAuth服务 -> 系统A (返回access token)
```

### 3. 关键技术点

#### 3.1 Session 共享方案

```
1. 集中式存储：Redis/Memcached
2. Session ID 统一管理
3. 分布式 Session 同步
```

#### 3.2 Token 设计

```json
{
  "iss": "sso.example.com",
  "sub": "user123",
  "aud": "app1.com",
  "exp": 1516239022,
  "iat": 1516239022
}
```

### 4. 安全考虑

#### 4.1 Token 安全

```
1. 使用 JWT 签名
2. 设置合理的过期时间
3. 加入防重放设计
```

#### 4.2 通信安全

```
1. 使用 HTTPS
2. 加入时间戳防重放
3. 请求签名验证
```

### 5. 最佳实践

#### 5.1 系统设计

```
1. SSO 服务高可用设计
2. 失效 Token 快速清理
3. 统一的会话管理
```

#### 5.2 代码示例（伪代码）

```python
# SSO 服务端
class SSOServer:
    def login(self, username, password):
        if authenticate(username, password):
            token = generate_jwt_token(username)
            return redirect(f"{callback_url}?token={token}")

# 应用服务端
class ApplicationServer:
    def verify_token(self, token):
        if validate_jwt_token(token):
            create_local_session()
            return True
        return False
```

### 6. 常见问题解决

#### 6.1 登出处理

```
1. 单点登出通知
2. Token 黑名单
3. 会话状态同步
```

#### 6.2 性能优化

```
1. Token 缓存策略
2. 会话存储优化
3. 负载均衡设计
```

### 7. 监控与维护

```
1. 登录状态监控
2. Token 有效性检查
3. 异常行为告警
```

这些实现方案各有优劣，需要根据具体场景选择：
- Cookie 方案简单但受域名限制
- Token 方案灵活但需要额外存储
- OAuth2.0 方案标准化但相对复杂

选择时需考虑：
1. 系统规模
2. 安全需求
3. 性能要求
4. 维护成本
