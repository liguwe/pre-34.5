# TypeScript 项目中使用 node_modules 中定义的全局类型

`#typescript` 

## 1. 通过 tsconfig.json 配置

在 `tsconfig.json` 中配置 `typeRoots` 和 `types` 来引入类型定义：

```json
{
  "compilerOptions": {
    // typeRoots 用于指定类型声明文件的根目录
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/库名/types",
      "./src/types"
    ],
    // types 用于指定需要包含的类型声明
    "types": [
      "node",
      "jest",
      "express"
    ]
  }
}
```

## 2. 通过 **reference** 引用

在项目中创建类型声明文件（`.d.ts`），然后通过 `reference` 引用：

```typescript
// src/types/global.d.ts
/// <reference types="node" />
/// <reference types="express" />
/// <reference path="../../node_modules/库名/types/index.d.ts" />

// 声明全局类型
declare global {
  interface Window {
    // 使用第三方库定义的类型
    customType: import('第三方库').CustomType;
  }
}
```

## 3. 直接导入类型

```typescript
// src/types/custom.ts
import type { SomeType } from 'some-library';

// 重新导出类型
export type { SomeType };

// 或者扩展类型
export interface ExtendedType extends SomeType {
  additionalProp: string;
}
```

## 4. 实际使用示例

### 4.1. **使用 Express 类型**：

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "types": ["express"]
  }
}

// src/types/express.d.ts
import { Request, Response } from 'express';

// 扩展 Express 的 Request 接口
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
      }
    }
  }
}
```

### 4.2. **使用 Vue 类型**：

```typescript
// src/types/vue.d.ts
import type { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $myGlobal: string
  }
}

// 使用
export default defineComponent({
  created() {
    console.log(this.$myGlobal) // 类型安全
  }
})
```

### 4.3. **使用 React 类型**：

```typescript
// src/types/react.d.ts
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // 添加自定义属性
    customProp?: string;
  }
}

// 使用
const MyComponent: React.FC = () => {
  return <div customProp="value">Hello</div>;
}
```

### 4.4. **使用第三方库类型**：

```typescript
// src/types/third-party.d.ts
import type { Options } from 'some-library';

// 扩展配置类型
declare module 'some-library' {
  interface Options {
    extraOption?: boolean;
  }
}

// 使用
import { someFunction } from 'some-library';

const options: Options = {
  extraOption: true,
  // ... 其他选项
};
```

## 5. 最佳实践

### 5.1. **组织类型文件**：

```typescript
// src/types/index.d.ts
// 集中管理所有类型声明
/// <reference path="./express.d.ts" />
/// <reference path="./vue.d.ts" />
/// <reference path="./react.d.ts" />

// 导出公共类型
export * from './models';
export * from './api';
```

### 5.2. **创建类型模块**：

```typescript
// src/types/models/index.ts
export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
}
```

### 5.3. **类型增强**：

```typescript
// src/types/enhanced.d.ts
import { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    customConfig?: {
      retry?: number;
      retryDelay?: number;
    }
  }
}
```

### 5.4. **环境变量类型**：

```typescript
// src/types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      API_KEY: string;
      // ... 其他环境变量
    }
  }
}
```

## 6. 注意事项

### 6.1. **类型声明文件命名**：

   - 使用 `.d.ts` 后缀
   - 文件名要有意义且清晰

### 6.2. **模块解析**：

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

### 6.3. **类型检查**：

```typescript
// 确保类型正确导入
import type { SomeType } from 'some-library';
// 使用 typeof 获取变量的类型
type Config = typeof import('./config').default;
```
