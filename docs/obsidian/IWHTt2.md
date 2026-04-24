# Next.js

`#react`  

## 1. 总结

- Next.js 是一个基于 React 的`全栈 Web 应用开发框架`
- 支持多少渲染方式
	- ssr ssg isr csr
- 文件路径 → 路由
- 底层技术栈
	- turbopack
	- swc

## 2. 基本定义

Next.js 是一个基于 React 的`全栈 Web 应用开发框架`，它提供了构建现代网络应用所需的所有功能。它是由 Vercel 公司开发和维护的开源框架。

## 3. 核心特性

### 3.1. 渲染方式

- 服务器端渲染 (SSR)
- 静态站点生成 (SSG)
- 增量静态再生成 (ISR)
- 客户端渲染 (CSR)

### 3.2. 路由系统

- 基于文件系统的路由
- 动态路由支持
- App Router（最新稳定版特性）
- 嵌套路由和布局

### 3.3. 性能优化

- 自动代码分割
- 图片优化
- 字体优化
- 脚本优化

## 4. 主要优势

- 零配置：提供开箱即用的配置
- SEO 友好：得益于服务器端渲染
- 开发体验佳：支持热模块替换（HMR）
- 内置 API 路由：支持全栈开发
- TypeScript 支持
- 自动优化和性能提升

## 5. Next.js 的全栈开发能力

### 5.1. API 路由实现

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'  // 假设使用 Prisma 作为 ORM

export async function GET() {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
}

export async function POST(request: Request) {
    const data = await request.json()
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email
        }
    })
    return NextResponse.json(user)
}
```

### 5.2. 数据库集成

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export { prisma }

// schema.prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

model User {
    id        Int      @id @default(autoincrement())
    name      String
    email     String   @unique
    posts     Post[]
}
```

### 5.3. 服务器组件中的数据获取

```typescript
// app/users/page.tsx
import { prisma } from '@/lib/prisma'

// 服务器组件
export default async function UsersPage() {
    // 直接在服务器端获取数据
    const users = await prisma.user.findMany({
        include: {
            posts: true
        }
    })

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <h3>Posts:</h3>
                    <ul>
                        {user.posts.map(post => (
                            <li key={post.id}>{post.title}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
```

### 5.4. 中间件实现

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 获取 token
    const token = request.cookies.get('token')

    // 保护 API 路由
    if (request.nextUrl.pathname.startsWith('/api/')) {
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}
```

### 5.5. 全栈数据验证

```typescript
// lib/validations.ts
import { z } from 'zod'

export const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
})

// app/api/register/route.ts
import { userSchema } from '@/lib/validations'

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const validated = userSchema.parse(data)
        
        // 处理验证后的数据
        const user = await prisma.user.create({
            data: validated
        })
        
        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json(
            { error: 'Validation failed' },
            { status: 400 }
        )
    }
}
```

### 5.6. 服务器端状态管理

```typescript
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
    const title = formData.get('title')
    const content = formData.get('content')
    
    const post = await prisma.post.create({
        data: {
            title: title as string,
            content: content as string
        }
    })
    
    return post
}

// app/new-post/page.tsx
import { createPost } from '../actions'

export default function NewPostPage() {
    return (
        <form action={createPost}>
            <input name="title" type="text" />
            <textarea name="content" />
            <button type="submit">Create Post</button>
        </form>
    )
}
```

### 5.7. 认证集成

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        }
    }
})

export { handler as GET, handler as POST }
```

### 5.8. 文件上传处理

```typescript
// app/api/upload/route.ts
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
        return NextResponse.json(
            { error: 'No file uploaded' },
            { status: 400 }
        )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const path = `/uploads/${file.name}`
    await writeFile(`public${path}`, buffer)
    
    return NextResponse.json({ path })
}
```

### 5.9. WebSocket 集成

```typescript
// app/api/socket/route.ts
import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_URL
    }
})

io.on('connection', (socket) => {
    console.log('Client connected')
    
    socket.on('message', (data) => {
        io.emit('message', data)
    })
})

httpServer.listen(3001)
```

### 5.10. 环境变量和配置管理

```env
# .env.local
DATABASE_URL="postgresql://..."
GITHUB_ID="..."
GITHUB_SECRET="..."
NEXT_PUBLIC_API_URL="..."
```

这些示例展示了 Next.js 的全栈能力，包括：
- API 路由处理
- 数据库操作
- 服务器端渲染
- 文件处理
- 认证授权
- 实时通信
- 中间件
- 数据验证
- 服务器端状态管理
- 环境配置

建议根据项目需求逐步整合这些功能，不必一次性实现所有特性。从基本的 API 路由和数据库操作开始，然后根据需要添加更多功能。

## 6. Next.js 的底层技术栈

### 6.1. 核心编译和构建工具

#### 6.1.1. SWC (Speedy Web Compiler)

- 用 Rust 编写的高性能 JavaScript/TypeScript 编译器
- 替代了传统的 Babel
- 提供代码转换和压缩功能
- 比 Babel 快 17 倍以上 

#### 6.1.2. Turbopack

- Next.js 13 引入的新一代打包工具
- 同样使用 Rust 编写
- 比 Webpack 快 700 倍
- 支持增量编译

### 6.2. 运行时核心

#### 6.2.1. React 核心

- 完全集成 React 18
- 支持服务器组件（React Server Components）
- 支持并发渲染
- 支持 Suspense 和流式渲染 

#### 6.2.2. 渲染引擎

- 支持服务器端渲染（SSR）
- 静态网站生成（SSG）
- 增量静态再生成（ISR）
- 客户端渲染（CSR）

### 6.3. 数据层支持

#### 6.3.1. 数据获取

- fetch API
- React Query/SWR 集成
- GraphQL 支持
- REST API 支持 

#### 6.3.2. 数据库集成

- Prisma
- MongoDB
- PostgreSQL
- MySQL
- SQLite

### 6.4. 性能优化工具

#### 6.4.1. 图像优化

- 内置图像组件
- 自动图像优化
- WebP 支持
- 响应式图像处理

#### 6.4.2. 字体优化

- 内置字体系统
- 自动字体优化
- 变体字体支持
- 本地字体加载

### 6.5. 开发工具集成

#### 6.5.1. TypeScript

- 原生 TypeScript 支持
- 类型检查
- 智能提示
- 自动类型生成

#### 6.5.2. ESLint

- 内置 ESLint 配置
- 代码质量检查
- 最佳实践强制执行

### 6.6. 路由系统

#### 6.6.1. 文件系统路由

- 基于文件的路由系统
- 动态路由支持
- 嵌套路由
- 平行路由

#### 6.6.2. 中间件

- 路由中间件
- 认证中间件
- 重定向处理
- 请求拦截

### 6.7. 样式解决方案

#### 6.7.1. CSS 支持

- CSS Modules
- Sass/SCSS
- PostCSS
- Tailwind CSS 

#### 6.7.2. CSS-in-JS

- styled-components
- emotion
- CSS Modules
- 注意：部分 CSS-in-JS 解决方案在服务器组件中可能受限

### 6.8. 安全特性

#### 6.8.1. 内置安全措施

- CSRF 保护
- XSS 防护
- CSP 支持
- 请求验证

#### 6.8.2. 认证集成

- NextAuth.js
- JWT
- Session 管理
- OAuth 提供商支持

### 6.9. 部署和基础设施

#### 6.9.1. 部署平台

- Vercel（原生支持）
- AWS
- Google Cloud
- Azure

#### 6.9.2. Edge 运行时

- Edge Functions
- Edge Middleware
- CDN 集成
- 全球分发

### 6.10. 开发体验

#### 6.10.1. 开发服务器

- 快速刷新
- 错误处理
- 开发时调试
- 热模块替换（HMR）

#### 6.10.2. 调试工具

- React DevTools 集成
- 性能分析
- 内存泄漏检测
- 网络请求监控
