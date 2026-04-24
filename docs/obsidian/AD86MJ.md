# type 和 interface 的区别

`#typescript` 

TypeScript 中的 `type` 和 `interface` 都用于定义类型

>  另外可见 [4. interface](/pNIDoo)


## 1. 语法和用途

### 1.1. type

- **可以用于定义任何类型的别名**，包括`原始类型、联合类型、交叉类型`等
- 语法更灵活

```typescript hl:4
type Name = string;
type NameOrAge = string | number;
type Point = { x: number; y: number };
type Callback = (data: string) => void;
```

### 1.2. interface

- 主要用于**定义对象**的结构
- 更接近传统面向对象编程中的**接口**概念

```typescript
interface Person {
  name: string;
  age: number;
}
```

## 2. 扩展和实现

### 2.1. type

- 使用交叉类型（`&`）来**扩展**
- 不能被类实现（`implements`）或继承（`extends`）

```typescript
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}
```

### 2.2. interface：可被实现和扩展

- 可以使用 `extends` 关键字**扩展**其他接口或类型
- 可以被****类****实现（`implements`）或继承（`extends`）

```typescript
interface Animal {
  name: string
}

interface Bear extends Animal {
  honey: boolean
}

class Grizzly implements Bear {
  name: string;
  honey: boolean;
}
```

## 3. 合并声明

### 3.1. type

- 不支持声明合并

```typescript hl:5
type User = {
  name: string
}

// 错误：标识符"User"重复。
type User = {
  age: number
}
```

### 3.2. interface

- 支持声明合并，多次声明会**自动合并**

```typescript
interface User {
  name: string
}

interface User {
  age: number
}

// 结果等同于：
// interface User {
//   name: string
//   age: number
// }
```

## 4. 计算属性

### 4.1. type

- 支持使用映射类型等高级类型操作

```typescript
type Keys = 'firstname' | 'surname'

type DudeType = {
  [key in Keys]: string
}
```

### 4.2. interface

- 不支持映射类型等操作

## 5. 元组和数组

### 5.1. type

- 可以更容易地定义元组和复杂的数组类型

```typescript
type StringNumberPair = [string, number];
type StringArray = string[];
```

### 5.2. interface

- 可以定义数组，但定义元组相对复杂

```typescript
interface StringNumberPair {
  0: string;
  1: number;
  length: 2;
}
```

## 6. 使用建议

- 如果定义的类型可能需要扩展或者实现，使用 `interface`
- 如果需要使用**联合类型、交叉类型、元组**等，或者需要利用映射类型等高级类型操作，使用 `type`
- 在**创建第三方库或公共 API 时**，推荐使用 `interface`，因为它更容易扩展和兼容
