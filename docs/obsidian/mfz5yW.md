# 低代码工程结构设计

`#lowcode` 

>   技术栈：`vue3 + pnpm + vite Module Federation + Pinia` 等

## 1. Monorepo 项目结构设计

```bash hl:3,6,9,12,15,18,21
vamis/
├── packages/
│   ├── core/                 # 核心渲染引擎
│   │   ├── package.json
│   │   └── src/
│   ├── components/           # 基础组件库
│   │   ├── package.json
│   │   └── src/
│   ├── editor/              # 可视化编辑器
│   │   ├── package.json
│   │   └── src/
│   └── shared/              # 共享工具和类型
│       ├── package.json
│       └── src/
│   └── docs/              # 文档站点
│       ├── package.json
│       └── src/
│   └── cli/              # 脚手架工具
│       ├── package.json
│       └── src/
├── examples/                # 示例项目
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

## 2. Pinia 数据流管理

### 2.1. 核心数据存储设计

```typescript hl:9,9
// packages/core/src/stores/schema.ts
import { defineStore } from 'pinia';
import type { Schema } from '@vamis/shared';

export const useSchemaStore = defineStore('schema', {
  state: () => ({
    currentSchema: null as Schema | null,
    globalData: {},
    contextData: new Map<string, any>(),
    componentInstances: new Map(),
  }),

  getters: {
    getComponentById: (state) => {
      return (id: string) => state.componentInstances.get(id);
    },
    
    getDataByPath: (state) => {
      return (path: string) => {
        return path.split('.').reduce((obj, key) => obj?.[key], state.globalData);
      };
    }
  },

  actions: {
    setSchema(schema: Schema) {
      this.currentSchema = schema;
    },

    updateComponentData(id: string, data: any) {
      const instance = this.componentInstances.get(id);
      if (instance) {
        Object.assign(instance, data);
      }
    },

    registerComponent(id: string, instance: any) {
      this.componentInstances.set(id, instance);
    }
  }
});
```

### 2.2. 组件状态管理

```typescript
// packages/core/src/stores/component.ts
import { defineStore } from 'pinia';

export const useComponentStore = defineStore('component', {
  state: () => ({
    activeComponents: new Set<string>(),
    componentStates: new Map<string, any>(),
  }),

  actions: {
    setComponentState(componentId: string, state: any) {
      this.componentStates.set(componentId, state);
    },

    activateComponent(componentId: string) {
      this.activeComponents.add(componentId);
    },

    deactivateComponent(componentId: string) {
      this.activeComponents.delete(componentId);
    }
  }
});
```

## 3. Module Federation 配置

### 3.1. 远程组件配置

> 参考[11. vite 中如何使用 Module Federation](/d4V6Ed)

### 3.2. 主应用配置

> 参考[11. vite 中如何使用 Module Federation](/d4V6Ed)

### 3.3. 动态组件加载

```typescript
// packages/core/src/utils/componentLoader.ts
import { defineAsyncComponent } from 'vue';

export class ComponentLoader {
  static async loadComponent(name: string) {
    const componentMap = {
      'Button': () => import('vamis-components/Button'),
      'Form': () => import('vamis-components/Form'),
      'Table': () => import('vamis-components/Table'),
    };

    if (!componentMap[name]) {
      throw new Error(`Component ${name} not found`);
    }

    return defineAsyncComponent({
      loader: componentMap[name],
      loadingComponent: LoadingComponent,
      errorComponent: ErrorComponent,
      timeout: 3000
    });
  }
}
```

## 4. 性能优化策略

- 组件预加载
- 解析 schema时，提请预加载数据
- pinia
	- 使用 `storeToRefs` 保持响应性
	- 合理拆分 store 模块
	- 使用 `subscriptions` 监听状态变化
	- 状态持久化

## 5. 开发规范和最佳实践

- 包管理规范
- 数据流规范

## 6. 其他

> 待补充
