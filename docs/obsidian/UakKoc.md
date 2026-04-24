# 基于 Vue3 的低代码平台架构设计：篇一

`#lowcode` 

## 1. 核心理念

与 `Amis` 类似，我们采用 **JSON 配置**驱动的方式来构建页面。主要包含以下核心概念：

- **Schema 驱动渲染** 
	- 通过 JSON 描述页面结构和行为
- **组件注册机制**
	- 灵活的组件注册和扩展系统
- **数据域管理**
	- 独立的数据作用域
	- 建议使用 `pinia`
- **表达式引擎** 
	- 处理动态数据和条件判断
- **事件系统** 
	- 统一的事件处理机制

## 2. 技术架构图

让我用 `Mermaid` 来绘制架构图：

````mermaid


  graph TD
    A[Schema JSON] --> B[Schema Parser]
    B --> C[Component Factory]
    C --> D[Runtime Renderer]
    D --> E[页面实例]
    
    F[组件库] --> C
    G[表达式引擎] --> D
    H[数据域] --> D
    I[事件系统] --> D
    
    subgraph 核心引擎
    B
    C
    D
    end
    
    subgraph 扩展系统
    F
    G
    H
    I
    end
````

## 3. 渲染引擎

渲染引擎是整个框架的核心，负责解析 Schema 并渲染组件。以下是核心渲染器的示例代码：

### 3.1. types/schema.ts

```typescript
// types/schema.ts
interface Schema {
  type: string;
  props?: Record<string, any>;
  children?: Schema[];
  data?: Record<string, any>;
}
```

### 3.2. components/Renderer.vue

```vue hl:19,21,22

<script setup lang="ts">
import { computed, provide, inject } from 'vue';
import { resolveComponent } from 'vue';

const props = defineProps<{
  schema: Schema;
  data?: Record<string, any>;
}>();

// 数据域管理
const parentData = inject('scopeData', {});
const currentData = computed(() => ({
  ...parentData,
  ...props.data
}));
provide('scopeData', currentData);

// 解析组件
const resolveSchemaComponent = (type: string) => {
  // 1. 查找注册的自定义组件
  // 2. 回退到 Vue 内置组件
  return resolveComponent(type) || resolveComponent('div');
};

// 处理属性
const resolveProps = (props: Record<string, any>) => {
  return Object.entries(props).reduce((acc, [key, value]) => {
    // 处理表达式
    acc[key] = typeof value === 'string' && value.startsWith('${') 
      ? evaluateExpression(value, currentData.value)
      : value;
    return acc;
  }, {});
};
</script>

<template>
  <component
    :is="resolveSchemaComponent(schema.type)"
    v-bind="resolveProps(schema.props || {})"
  >
    <template v-if="schema.children">
      <Renderer
        v-for="(child, index) in schema.children"
        :key="index"
        :schema="child"
      />
    </template>
  </component>
</template>

```

## 4. 组件注册系统

>  结合异步组件来做，系统本身只提供部分核心组件

```typescript
// core/registry.ts
interface ComponentMeta {
  component: Component;
  schema?: Record<string, any>;
  validations?: Record<string, Function>;
}

class ComponentRegistry {
  private components: Map<string, ComponentMeta> = new Map();

  register(type: string, meta: ComponentMeta) {
    this.components.set(type, meta);
  }

  get(type: string): ComponentMeta | undefined {
    return this.components.get(type);
  }

  // 批量注册
  registerMultiple(components: Record<string, ComponentMeta>) {
    Object.entries(components).forEach(([type, meta]) => {
      this.register(type, meta);
    });
  }
}

export const registry = new ComponentRegistry();
```

## 5. 表达式引擎

>  请结合使用 `loadsh` 里面的各类工具类函数

```typescript hl:15
// core/expression.ts
export function evaluateExpression(expr: string, data: Record<string, any>) {
  // 移除 ${} 包裹
  const script = expr.slice(2, -1).trim();
  
  // 构建安全的执行环境
  const context = {
    ...data,
    // 内置函数
    FORMAT: (val: any, format: string) => format(val),
    IF: (condition: boolean, then: any, else_: any) => condition ? then : else_,
  };

  try {
    // 使用 Function 构造器创建沙箱环境
    const fn = new Function(...Object.keys(context), `return ${script}`);
    return fn(...Object.values(context));
  } catch (e) {
    console.error('Expression evaluation failed:', expr, e);
    return undefined;
  }
}
```

## 6. 事件系统

- 提供注册事件能力
- 注意需要注册特定的上下文

```typescript hl:12
// core/events.ts
type ActionType = 'ajax' | 'link' | 'dialog' | 'custom';

interface Action {
  type: ActionType;
  config: Record<string, any>;
}

class EventManager {
  private handlers: Map<ActionType, Function> = new Map();

  register(type: ActionType, handler: Function) {
    this.handlers.set(type, handler);
  }

  async execute(action: Action, context: any) {
    const handler = this.handlers.get(action.type);
    if (!handler) {
      throw new Error(`No handler registered for action type: ${action.type}`);
    }
    return handler(action.config, context);
  }
}

export const eventManager = new EventManager();
```

## 7. 示例：基础页面配置

>  需要考虑如何和数据模块结合，`options` 的来源如何获取

```typescript hl:27
// 页面配置示例
const schema = {
  type: 'page',
  props: {
    title: '用户管理'
  },
  children: [
    {
      type: 'form',
      props: {
        api: '/api/users'
      },
      children: [
        {
          type: 'input',
          props: {
            name: 'username',
            label: '用户名',
            required: true
          }
        },
        {
          type: 'select',
          props: {
            name: 'role',
            label: '角色',
            options: [
              { label: '管理员', value: 'admin' },
              { label: '用户', value: 'user' }
            ]
          }
        }
      ]
    }
  ]
};
```

## 8. 示例：组件注册示例

```tsx
// components/Form.vue
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Form',
  props: {
    api: String,
  },
  setup(props, { slots }) {
    // 表单逻辑实现
    return () => (
      <form>
        {slots.default?.()}
      </form>
    );
  }
});

// 注册组件
registry.register('form', {
  component: Form,
  schema: {
    type: 'object',
    properties: {
      api: { type: 'string' },
      submitText: { type: 'string', default: '提交' }
    }
  }
});
```

## 9. 示例：自定义组件

>  高阶组件实现的方式，类似于 amis 的 `@renderer`

```typescript
// 自定义图表组件示例
registry.register('chart', {
  component: defineComponent({
    props: {
      type: String,
      data: Array,
      config: Object
    },
    setup(props) {
      // 集成第三方图表库
      return () => (
        <div class="chart-container">
          {/* 图表渲染逻辑 */}
        </div>
      );
    }
  }),
  schema: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['line', 'bar', 'pie'] },
      data: { type: 'array' },
      config: { type: 'object' }
    }
  }
});
```

## 10. 示例： 数据联动

```typescript hl:11,10,16
// 实现组件间的数据联动
const schema = {
  type: 'page',
  children: [
    {
      type: 'select',
      props: {
        name: 'province',
        label: '省份',
        onChange: {
          actions: [
            {
              type: 'ajax',
              config: {
                url: '/api/cities/${province}',
                target: 'cities'
              }
            }
          ]
        }
      }
    },
    {
      type: 'select',
      props: {
        name: 'city',
        label: '城市',
        source: '${cities}'
      }
    }
  ]
};
```

> 我是需要统一包在统一字段里面，比如 `onEvent`

## 11. 其他

   - 组件
	   - 提供合理的默认值
	   - 实现完善的类型定义
- 性能优化
	- 使用 Vue3 的 `defineAsyncComponent` 实现组件懒加载
- 扩展性设计
	- 提供插件系统
	- 支持主题定制
	- 预留适配层接口
- 开发工具
	- 提供 Schema 验证工具
	- 开发调试工具
	- 可视化编辑器
- 继续完善
	- 更多的内置组件
	- 更强大的表达式引擎
	- 更完善的文档和示例
	- 供更多的主题和样式选项
	- 加单元测试和端到端测试
