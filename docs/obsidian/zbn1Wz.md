# TypeScript 中与类型相关的运算符

`#typescript` `#R1` 

## 1. 类型查询运算符 `typeof`

用于获取变量或表达式的类型：

```typescript
let str = "Hello";
type StrType = typeof str; // string

const user = { name: "Alice", age: 25 };
type User = typeof user; // { name: string; age: number; }
```

## 2. 键值查询运算符 `keyof`

获取类型的所有键组成的联合类型：

```typescript
interface Person {
    name: string;
    age: number;
}
type PersonKeys = keyof Person; // "name" | "age"
```

## 3. 索引访问类型 `T[K]`

访问类型中的特定属性类型：

```typescript
interface Person {
    name: string;
    age: number;
}
type AgeType = Person["age"]; // number
```

## 4. 条件类型

### 4.1. extends

```typescript
type Check<T> = T extends string ? "是字符串" : "不是字符串";
type Result = Check<"hello">; // "是字符串"
```

### 4.2. `infer` ? 没用过

```typescript
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Func = () => number;
type ReturnType = GetReturnType<Func>; // number
```

## 5. 映射类型修饰符

```typescript
interface Person {
    name: string;
    age: number;
}

// 所有属性变为可选
type Optional<T> = {
    [K in keyof T]?: T[K];
};

// 所有属性变为只读
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

## 6. 类型组合：联合类型 和 交叉类型

```typescript
// 联合类型
type StringOrNumber = string | number;

// 交叉类型
type A = { name: string };
type B = { age: number };
type C = A & B; // { name: string; age: number }
```

## 7. 类型断言

```typescript hl:7
// as 断言
let value: any = "string";
let length = (value as string).length;

// 非空断言
function getName(name?: string) {
    return name!.toUpperCase(); // 断言 name 一定存在
}


let value: any = "hello";
let length: number = (value as string).length;
// 或使用尖括号语法
let length2: number = (<string>value).length;
```

### 7.1. 非空断言运算符 (!)

```typescript hl:4
function getValue(): string | undefined {
    return "hello";
}
const value = getValue()!; // 断言值不为 null 或 undefined
```

## 8. 实用运算符

```typescript
// in 操作符
type Keys = "x" | "y";
type Point = {
    [K in Keys]: number;
}; // { x: number; y: number }

// 可选链
interface User {
    address?: {
        street?: string;
    }
}
const street = user?.address?.street;
```

## 9. 条件类型运算符

### 9.1. extends 条件类型

用于创建基于条件的类型：

```typescript
type IsString<T> = T extends string ? true : false;
type Result1 = IsString<"hello">; // true
type Result2 = IsString<42>; // false
```

### 9.2. infer 关键字

用于在条件类型中推断类型：
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

## 10. 映射类型修饰符

### 10.1. 只读和可选修饰符

```typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};
```

### 10.2. 添加和移除修饰符

使用 `+` 和 `-` 来添加或移除 `readonly` 和 `? 修饰符`：
```typescript
type MutableRequired<T> = {
    -readonly [P in keyof T]-?: T[P];
};
```

## 11. 索引类型操作符

### 11.1. 索引访问类型 (`[]`)

```typescript
interface Person {
    name: string;
    age: number;
}
type AgeType = Person["age"]; // number
```

### 11.2. 索引签名

```typescript
interface StringMap {
    [key: string]: string;
}
```
