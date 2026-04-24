# Interface 中的运算符操作

`#typescript` 

## 1. `交叉类型`运算符 (&) ，需要配合 type 的 `&`

交叉类型运算符 `&` 用于**组合多个类型为一个类型**，包含了所有类型的特性：

```typescript hl:17
interface BusinessPartner {
    name: string;
    credit: number;
}

interface Identity {
    id: number;
    email: string;
}

interface Contact {
    phone: string;
    address: string;
}

// 使用交叉类型组合接口
type Employee = Identity & BusinessPartner & Contact;

// 使用组合后的类型
const employee: Employee = {
    id: 100,
    email: "john@example.com",
    name: "John Doe",
    credit: 1000,
    phone: "123-456-7890",
    address: "123 Main St"
};
```

## 2. `联合类型`运算符 (|)

联合类型运算符 `|` 表示一个值可以是几种类型之一：

```typescript
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

// 联合类型
type Pet = Bird | Fish;

function getPet(): Pet {
    // 返回的可以是 Bird 或 Fish
    return {
        swim: () => console.log("Swimming..."),
        layEggs: () => console.log("Laying eggs...")
    };
}
```

## 3. 类型映射运算符

### 3.1. `Partial<T>` ，包装过的泛型

使所有属性变为可选：

```typescript
interface User {
    name: string;
    age: number;
    email: string;
}

// 所有属性都变为可选
type PartialUser = Partial<User>;
// 等价于：
// {
//     name?: string;
//     age?: number;
//     email?: string;
// }
```

### 3.2. `Required<T>`，包装过的泛型

使所有属性变为必需：

```typescript
interface Config {
    name?: string;
    age?: number;
}

// 所有属性都变为必需
type RequiredConfig = Required<Config>;
// 等价于：
// {
//     name: string;
//     age: number;
// }
```

### 3.3. `Readonly<T>`，包装过的泛型

使所有属性只读：

```typescript
interface Mutable {
    name: string;
    value: number;
}

// 所有属性变为只读
type Immutable = Readonly<Mutable>;
// 等价于：
// {
//     readonly name: string;
//     readonly value: number;
// }
```

## 4. 条件类型运算符

使用 `extends` 关键字进行条件类型判断：

```typescript
type ExtractType<T> = T extends string ? string : number;

// 根据条件返回不同的类型
type StringType = ExtractType<string>;  // string
type NumberType = ExtractType<number>;  // number
```

## 5. 键类型运算符

### 5.1. keyof

获取对象类型的所有键：

```typescript
interface Person {
    name: string;
    age: number;
    address: string;
}

// 获取所有键
type PersonKeys = keyof Person; // "name" | "age" | "address"

// 实际应用
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

### 5.2. `Pick<T, K>`

从类型中**选择部分属性**：

```typescript
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

// 只选择部分属性
type TodoPreview = Pick<Todo, "title" | "completed">;
// 等价于：
// {
//     title: string;
//     completed: boolean;
// }
```

### 5.3. `Omit<T, K>`

从类型中**排除某些属性**：

```typescript
interface User {
    id: number;
    name: string;
    password: string;
}

// 排除敏感信息
type PublicUser = Omit<User, "password">;
// 等价于：
// {
//     id: number;
//     name: string;
// }
```

## 6. 高级运算符组合

可以组合多个运算符来创建复杂的类型：

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// 组合多个类型运算符
type PartialPublicUser = Partial<Omit<User, "password">>;
// 等价于：
// {
//     id?: number;
//     name?: string;
//     email?: string;
// }
```

## 7. `Record<K, T>`

创建具有指定**键类型和值类型**的对象类型：

```typescript
type PageInfo = {
    title: string;
    url: string;
}

// 创建字符串索引的对象类型
type Pages = Record<string, PageInfo>;

const pages: Pages = {
    home: { title: "Home", url: "/" },
    about: { title: "About", url: "/about" }
};
```
