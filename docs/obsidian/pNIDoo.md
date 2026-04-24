# interface

`#typescript` 

>  另外可参考 [2.  type 和 interface 的区别](/AD86MJ)

## 1. 基本概念

Interface 是 TypeScript 中一个核心概念，用于**定义对象的类型契约**。
- 它描述了对象应该具有的属性和方法的结构。

### 1.1. 基本语法

```typescript
interface Person {
    name: string;
    age: number;
}

// 使用接口
const person: Person = {
    name: "张三",
    age: 25
}
```

## 2. 可选属性

使用 `?` 表示属性是可选的：

```typescript
interface Config {
    color?: string;
    width?: number;
}

// 以下都是合法的
const config1: Config = { color: "red" };
const config2: Config = { width: 100 };
const config3: Config = {};
```

## 3. 只读属性

使用 `readonly` 修饰符使属性只读：

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
const p1: Point = { x: 10, y: 20 };
// p1.x = 5; // 错误！x 是只读的
```

## 4. 函数类型接口

接口也可以描述函数类型：

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = function(src: string, sub: string): boolean {
    return src.search(sub) > -1;
}
```

## 5. 类类型接口

接口可以强制类遵循特定的契约：

```typescript
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date): void;
}

class Clock implements ClockInterface {
    currentTime: Date = new Date();
    setTime(d: Date) {
        this.currentTime = d;
    }
}
```

## 6. 继承接口

接口可以**相互继承**：自己继承自己

```typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

const square: Square = {
    color: "blue",
    sideLength: 10
}
```

## 7. 混合类型接口

一个对象可以**同时作为函数和对象使用**：

```typescript
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = function(start: number) {} as Counter;
    counter.interval = 123;
    counter.reset = function() {};
    return counter;
}
```

## 8. 索引签名

可以描述可以额外拥有其他属性的对象：

```typescript
interface StringArray {
    [index: number]: string;
}

interface Dictionary {
    [key: string]: any;
}

const myArray: StringArray = ["Bob", "Fred"];
const myDict: Dictionary = {
    name: "张三",
    age: 25,
    isStudent: true
};
```

## 9. 接口合并

TypeScript 允许你声明多个同名接口，它们会**自动合并**：

```typescript
interface Box {
    height: number;
}

interface Box {
    width: number;
}

// 等同于：
// interface Box {
//     height: number;
//     width: number;
// }

const box: Box = { height: 5, width: 6 };
```

## 10. 实用技巧

### 10.1. 接口继承类：**同时使用 extends 和 implements**

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {}
}
```

### 10.2. **可选方法**：和可选属性一样

```typescript
interface EventListener {
    onClick?(): void;
    onMouseOver?(): void;
}
```

### 10.3. readonly 数组

```typescript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
```

## 11. 最佳实践

### 11.1. **命名约定**：

   - 接口名通常以大写字母 `I` 开头（虽然不是必须的）
   - 使用 `PascalCase` 命名方式

### 11.2. **接口分离原则**：

   - 保持接口小而精确
   - **一个接口只负责一个功能域**

```typescript hl:12
// 好的实践
interface IUser {
    id: number;
    name: string;
}

interface IUserActions {
    updateName(newName: string): void;
    deleteUser(): void;
}

// 而不是
interface IUserWithActions {
    id: number;
    name: string;
    updateName(newName: string): void;
    deleteUser(): void;
}
```

### 11.3. **使用泛型接口**：

```typescript
interface IResponse<T> {
    data: T;
    status: number;
    message: string;
}

// 使用
interface IUser {
    name: string;
    email: string;
}

const response: IResponse<IUser> = {
    data: { name: "张三", email: "zhangsan@example.com" },
    status: 200,
    message: "success"
};
```

> **范型接口，很有用的**

## 12. 注意事项

1. 接口不会生成 JavaScript 代码，它们只在编译时用于类型检查。

2. 接口可以**描述 JavaScript 中不存在的类型**，如联合类型：
```typescript
interface Result {
    success: boolean;
    error?: string | Error;
}
```

3. 实现接口时，必须严格遵守接口定义的结构：
```typescript
interface Vehicle {
    brand: string;
    model: string;
}

// 错误：缺少必需的属性
const car: Vehicle = {
    brand: "Toyota"
}; // 类型错误！

// 正确
const car: Vehicle = {
    brand: "Toyota",
    model: "Camry"
};
```

## 13. 高级用法

### 13.1. 映射类型与接口

```typescript hl:7,10
interface Person {
    name: string;
    age: number;
}

// 创建所有属性可选的新接口
type PartialPerson = Partial<Person>;

// 创建所有属性只读的新接口
type ReadonlyPerson = Readonly<Person>;
```

### 13.2. 条件类型与接口

```typescript
interface Animal {
    live(): void;
}

interface Dog extends Animal {
    woof(): void;
}

type Example1 = Dog extends Animal ? number : string; // type Example1 = number
```
