# TypeScript 的泛型（Generics）

`#typescript` `#R1` 

## 1. 泛型基础

泛型是一种**在定义函数、接口或类时不预先指定具体类型，而在使用时再指定类型的特性**。

> 个人理解是：类比一个函数，可以传入参数，来确定这个接口、函数、或类的具体类型

### 1.1. 基本语法

泛型使用尖括号 `<T>` 来定义，其中 `T` 是一个类型变量：

```typescript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用方式 1
let output1 = identity<string>("hello");  // 显式指定类型
let output2 = identity("hello");          // 类型推断


// 使用方式 2
let output1 = identity<string>("myString");
let output2 = identity(123); // 类型推断为 number
```

### 1.2. 泛型接口

```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = (arg: number): number => {
    return arg;
};


interface Collection<T> {
    add(item: T): void;
    remove(item: T): void;
    getItems(): T[];
}
```

## 2. 泛型类

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
    
    constructor(zero: T, addFn: (x: T, y: T) => T) {
        this.zeroValue = zero;
        this.add = addFn;
    }
}

// 使用示例
const numCalculator = new GenericNumber<number>(0, (x, y) => x + y);
const strCalculator = new GenericNumber<string>('', (x, y) => x + y);
```

## 3. 泛型约束

### 3.1. 使用 `extends` 关键字来约束泛型

```typescript
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
    console.log(arg.length);
}

// 正确
logLength("hello");           // 字符串有 length 属性
logLength([1, 2, 3]);         // 数组有 length 属性
logLength({ length: 10 });    // 对象有 length 属性

// 错误
// logLength(3);              // 数字没有 length 属性
```

### 3.2. 在泛型约束中使用类型参数

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

let obj = { a: 1, b: 2, c: 3 };
getProperty(obj, "a");  // 正确
// getProperty(obj, "z");  // 错误：z 不是 obj 的属性


let x = { a: 1, b: 2, c: 3 };
getProperty(x, "a"); // 正确
getProperty(x, "d"); // 错误：参数 'd' 不存在于 'a' | 'b' | 'c' 中
```

## 4. 多个类型参数

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const p1 = pair<string, number>("hello", 42);
const p2 = pair("world", true);  // 类型推断


// 在类中使用多个类型参数
class KeyValuePair<TKey, TValue> {
    constructor(
        public key: TKey,
        public value: TValue
    ) {}
}
```

## 5. 常用的泛型工具类型

TypeScript 提供了几个**常用的泛型工具类型**

```typescript
// Partial - 使所有属性可选
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Readonly - 使所有属性只读
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Pick - 从类型中选择部分属性
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Record - 创建具有特定类型属性的类型
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

下面分开介绍

### 5.1. `Partial<T>`

将类型的所有属性变为**可选**：

```typescript
interface Todo {
    title: string;
    description: string;
}

type PartialTodo = Partial<Todo>;
// 等价于：
// {
//    title?: string;
//    description?: string;
// }
```

### 5.2. `Record<K,T>`

创建一个键类型为 K，值类型为 T 的对象类型：

```typescript
type PageInfo = {
    title: string;
}

type Page = "home" | "about" | "contact";

const nav: Record<Page, PageInfo> = {
    home: { title: "Home" },
    about: { title: "About" },
    contact: { title: "Contact" }
};
```

### 5.3. `Pick<T,K>` 和 `Omit<T,K>`

```typescript
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
// 等价于：{ title: string; completed: boolean; }

type TodoInfo = Omit<Todo, "completed">;
// 等价于：{ title: string; description: string; }
```

## 6. 实际应用示例

### 6.1. 泛型组件（React 示例）

```typescript
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T>(props: ListProps<T>) {
    return (
        <div>
            {props.items.map((item, index) => (
                <div key={index}>
                    {props.renderItem(item)}
                </div>
            ))}
        </div>
    );
}
```

### 6.2. 泛型 API 请求

```typescript
async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
}

interface User {
    id: number;
    name: string;
}

// 使用
const user = await fetchData<User>('/api/user');
```

>  这个很常用！！！

## 7. 最佳实践

### 7.1. **命名约定**

- T 用于表示第一个类型参数
- K 通常用于表示对象的键类型
- V 用于表示对象的值类型
- E 用于表示元素类型
- 使用单个大写字母作为简单泛型类型参数（T, U, V）
- 对于更复杂的场景，使用有描述性的名称（TKey, TValue, TEntity）

```typescript
function map<TInput, TOutput>(
    array: TInput[], 
    fn: (item: TInput) => TOutput
): TOutput[] {
    return array.map(fn);
}
```

### 7.2. **默认类型参数**

```typescript
interface DefaultGeneric<T = string> {
    value: T;
}

const stringValue: DefaultGeneric = { value: "hello" };
const numberValue: DefaultGeneric<number> = { value: 42 };
```

### 7.3. **泛型约束的组合**

```typescript
interface HasId {
    id: number;
}

interface HasName {
    name: string;
}

function processThing<T extends HasId & HasName>(thing: T) {
    console.log(thing.id, thing.name);
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}
```

## 8. 高级用法

### 8.1. 条件类型与泛型

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type ExtractType<T> = T extends string 
    ? 'string'
    : T extends number
    ? 'number'
    : 'other';
```

### 8.2. 映射类型与泛型

```typescript
type Optional<T> = {
    [K in keyof T]?: T[K];
};

type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
```

## 9. 最后

泛型是 TypeScript 中最强大的特性之一，它可以：

- 提供类型安全性
- 增加代码重用性
- 使代码更加灵活
- 减少重复代码

通过合理使用泛型，我们可以编写出更加通用和类型安全的代码。在实际开发中，泛型经常用于：
- 容器类的实现
- 工具函数的编写
- API 请求的类型定义
- UI 组件的属性定义
