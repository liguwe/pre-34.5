# immer.js 在 React 中的使用

`#React` 

## 1. 总结

- Immer.js 
	- 创建一个草稿状态(draft)来修改数据，而不是直接修改原始状态
	- 使用 `produce` 方便修改复杂对象的某个属性
- Vue 值修改就好响应式数据就好，不存在这个问题

## 2. 定义

Immer.js 是一个让我们能够以更简单的方式处理`不可变数据`的库。

它的**核心理念是通过创建一个草稿状态(draft)来修改数据，而不是直接修改原始状态**。

## 3. 基本使用方法

```jsx
import produce from 'immer';

// 基础用法
const baseState = {
    name: "John",
    age: 30,
    address: {
        city: "New York",
        country: "USA"
    },
     users: [ { id: 1, name: 'John' } ]
};

// 使用 produce 创建新状态
const newState = produce(baseState, draft => {
    draft.age = 31;
    draft.address.city = "Boston";
    draft.users.push({ id: 2, name: 'Jane' });
});
```

## 4. 在 React 中的应用

```jsx hl:13
import { useState } from 'react';
import produce from 'immer';

function UserProfile() {
    const [user, setUser] = useState({
        name: "John",
        preferences: {
            theme: "light",
            notifications: true
        }
    });

    // 使用 Immer 更新嵌套状态
    const toggleNotifications = () => {
        setUser(produce(draft => {
            draft.preferences.notifications = !draft.preferences.notifications;
        }));
    };
    
    // 也可以这样写
    const toggleTheme = () => {
        setUser(
            produce(user, draft => {
                draft.preferences.theme = draft.preferences.theme === "light" ? "dark" : "light";
            })
        );
    };
}
```

## 5. 主要作用和优势

### 5.1. 简化复杂状态更新

- 不需要手动创建对象的深拷贝
- 避免了展开运算符的多层嵌套
- 代码更直观，更易读

```jsx hl:1,15
// 不使用 Immer
const updateNestedState = () => {
    setState({
        ...state,
        nested: {
            ...state.nested,
            deep: {
                ...state.nested.deep,
                value: newValue
            }
        }
    });
};

// 使用 Immer
const updateNestedState = () => {
    setState(produce(draft => {
        draft.nested.deep.value = newValue;
    }));
};
```

## 6. 自动处理不可变性

- Immer 确保状态的不可变性
- 防止意外的状态突变
- 优化 React 的性能（通过引用比较）

## 7. 使用注意事项

### 7.1. 返回值处理

```jsx
// 这样是正确的
const newState = produce(state, draft => {
    draft.value += 1;
});

// 这样也是正确的（返回全新的状态）
const newState = produce(state, draft => {
    return {
        ...draft,
        value: draft.value + 1
    };
});

// 注意：不要这样做
const newState = produce(state, draft => {
    return draft.value + 1; // 错误：返回原始值而不是对象
});
```

### 7.2. 性能考虑

- 对于简单的状态更新，直接使用展开运算符可能更高效
- Immer 适合处理复杂的嵌套状态更新
- 避免在性能关键的循环中过度使用

```jsx
// 简单更新，不需要 Immer
setState(state => ({ ...state, count: state.count + 1 }));

// 复杂嵌套更新，适合使用 Immer
setState(produce(draft => {
    draft.deeply.nested.array[0].value = newValue;
}));
```

### 7.3. 异步操作

```jsx
// 在异步操作中使用
const handleAsync = async () => {
    const response = await fetchData();
    setState(produce(draft => {
        draft.data = response;
        draft.loading = false;
    }));
};
```

## 8. 与 React 工具的集成

### 8.1. 与 useReducer 配合使用

```jsx
import produce from 'immer';

const reducer = produce((draft, action) => {
    switch (action.type) {
        case 'INCREMENT':
            draft.count += 1;
            break;
        case 'ADD_TODO':
            draft.todos.push(action.payload);
            break;
    }
});
```

### 8.2. 与 Redux 配合使用

```jsx
import produce from 'immer';

const todosReducer = produce((draft, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            draft.push(action.payload);
            break;
        case 'TOGGLE_TODO':
            const todo = draft.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
            break;
    }
});
```

## 9. 最佳实践

- 在状态更新逻辑复杂的组件中使用 Immer
- 对于简单的状态更新，可以继续使用常规方式
- 确保团队成员都理解 Immer 的工作原理
- 在性能关键的场景中谨慎使用
- 保持状态结构的扁平化，即使使用 Immer 也应避免过深的嵌套

## 10. 与 Immutable.js 的比较

- 如果你的项目不是特别依赖性能，并且希望保持代码的可读性和维护性，Immer.js 是更好的选择。
- 如果你的项目规模较大，对性能要求极高，并且团队成员都熟悉**函数式编程概念**，那么 Immutable.js 可能更适合。
- 在现代 React 开发中，Immer.js 的使用更为普遍，
	- 这也是为什么 Redux Toolkit 选择了集成 Immer.js 而不是 Immutable.js。
