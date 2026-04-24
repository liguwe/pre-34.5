# RESTful 接口规范

`#nodejs` 

## 1. 资源（Resources）

`RESTful`（Representational State Transfer）API 的核心概念是**资源**。
- **每个资源都应该有一个唯一的 URI（统一资源标识符）**。
- **系统中所有事务都是资源**

例如：

```
/users         // 用户集合
/users/123     // 特定用户
/articles      // 文章集合
/articles/456  // 特定文章
```

## 2. HTTP 方法（HTTP Methods）

使用标准的 HTTP 方法来对资源进行操作：

- GET：获取资源
- `POST`：创建新资源
- PUT：更新资源（全量更新）
- `PATCH`：部分更新资源
- `DELETE`：删除资源

例如：

```
GET /users         // 获取所有用户
POST /users        // 创建新用户
GET /users/123     // 获取特定用户
PUT /users/123     // 更新特定用户
DELETE /users/123  // 删除特定用户
```

## 3. 无状态（Stateless）

每个请求应该包含所有**必要的信息**，服务器不应该在不同请求之间保存客户端状态。

>  因为 HTTP 是无状态

## 4. 统一接口（Uniform Interface）

API 应该有一个一致的接口，这包括：

- 资源标识
- 通过表述来操作资源
- 自描述消息
- 超媒体作为应用状态引擎（`HATEOAS`）

## 5. 响应状态码（Response Status Codes）

使用适当的 HTTP 状态码来表示请求的结果：

```
200 OK              // 成功
201 Created         // 创建成功
204 No Content      // 成功但无返回内容
400 Bad Request     // 客户端错误
401 Unauthorized    // 未授权
403 Forbidden       // 禁止访问
404 Not Found       // 资源不存在
500 Internal Server Error  // 服务器错误
```

## 6. 数据格式（Data Formats）

通常使用 JSON 作为数据交换格式，但也可以支持其他格式如 XML。

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

## 7. 版本控制（Versioning）

在 URI 中包含 API 版本：

```
/api/v1/users
/api/v2/users
```

## 8. 过滤、排序和分页（Filtering, Sorting, and Pagination）

使用查询参数来实现：

```
/users?role=admin          // 过滤
/users?sort=name_asc       // 排序
/users?page=2&limit=20     // 分页
```

## 9. 错误处理（Error Handling）

提供清晰和一致的错误消息：

```json
{
  "error": {
    "code": 404,
    "message": "User not found"
  }
}
```

## 10. 安全性（Security）

使用 HTTPS 来加密所有通信。对于需要认证的端点，使用 `token` 或 `OAuth` 等机制。

## 11. 文档（Documentation）

提供完整和清晰的 API 文档，包括每个端点的描述、参数、响应格式等。

## 12. 实际应用示例

假设我们有一个博客 API，下面是一些符合 RESTful 规范的端点设计：

```js
GET /api/v1/posts                               // 获取所有文章
GET /api/v1/posts?author=john&sort=date_desc  // 获取 John 的文章，按日期降序排列
POST /api/v1/posts          // 创建新文章
GET /api/v1/posts/789       // 获取特定文章
PUT /api/v1/posts/789       // 更新特定文章
DELETE /api/v1/posts/789    // 删除特定文章
GET /api/v1/posts/789/comments  // 获取特定文章的评论
POST /api/v1/posts/789/comments // 为特定文章添加评论
```
