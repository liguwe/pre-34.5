# TS 常见问题

`#typescript` 

## 1. typescript 中 unknown、any、void 的区别

### 1.1. **类型安全性**

- `any`: 
	- 完全不安全，跳过类型检查
- `unknown`: 
	- 类型安全，需要类型检查才能使用
- `void`: 类型安全，只能赋值 undefined 或 null
	- `void`其实可以理解为`null`和`undefined`的`联合类型`，它表示空值

### 1.2. **使用场景**

- `any`: 
	- 当你不确定类型，或者需要快速迁移 JavaScript 代码时使用
- `unknown`: 
	- 当你不确定输入类型，但想保持类型安全时使用
- `void`: 主
	- 要用于表示函数没有返回值

### 1.3. **操作限制**

- `any`: 
	- 没有任何限制
- `unknown`: 
	- 必须先进行**类型检查或断言**
- `void`: 
	- 只能赋值 `undefined` 或 `null`

### 1.4. **最佳实践**

- 尽量避免使用 `any`，因为它会失去 TypeScript 的类型检查优势
- 如果不确定类型，优先使用 `unknown` 而不是 `any`
- `void` 主要用于函数返回类型声明

## 2. ts 的类型保护

**类型保护**主要的想法是尝试检测属性、方法或原型，以弄清楚如何处理一个值。
- 有四种使用类型保护的主要方法
	- 分别是 
		- `in`，
		- `typeof`，
		- `instanceof`，
		- `类型谓词is`

- `typeof` 类比于 js 的`typeof`
- `instanceof` 类比于 js 的`instanceof`
- `in` 如下检查某个对象上是否存在某个属性
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-21.png)
- is 
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-22.png)

## 3. implements 与 extends 的区别

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-23.png)

>   类不能继承接口，只能实现`接口` ，但`接口`可以继承`接口`

### 3.1. extends（继承）

- 用于**类**继承**类**
- 用于**接口**继承**接口**
- 用于**类型约束**
- 继承父类的所有成员（属性和方法）

```typescript hl:13,20
// extends 示例
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  
  move() {
    console.log('Moving...');
  }
}

// 类继承类
class Dog extends Animal {
  bark() {
    console.log('Woof!');
  }
}

// 接口继承接口
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

```

### 3.2. implements（实现）

- 用于**类**实现**接口**
- 只实现接口的类型检查
- **不包含具体实现代码**
- 可以同时实现**多个接口**

```javascript hl:7
// implements 示例
interface Movable {
  move(): void;
  speed: number;
}

// 类实现接口
class Car implements Movable {
  speed: number = 0;
  
  move() {
    console.log('Car moving...');
  }
}
```

### 3.3. 多重继承与实现

- `接口`可以继承多个`接口`
- `类`只能继承一个`类`，但可以实现`多个接口`

```typescript
// 接口可以继承多个接口
interface A {
  a(): void;
}

interface B {
  b(): void;
}

interface C extends A, B {
  c(): void;
}

// 类只能继承一个类，但可以实现多个接口
class MyClass extends BaseClass implements A, B, C {
  a() { /* ... */ }
  b() { /* ... */ }
  c() { /* ... */ }
}
```

### 3.4. 类 extends 会继承构造函数

```typescript
// extends 会继承构造函数
class Base {
  constructor(public value: string) {}
  
  method() {
    return this.value;
  }
}

class Derived extends Base {
  // 可以使用 super 访问父类
  constructor(value: string) {
    super(value);
  }
  
  newMethod() {
    return super.method();
  }
}
```

### 3.5. 类的 implements 接口，只检查类型

```typescript
// implements 只检查类型
interface Printable {
  print(): void;
  content: string;
}

class Printer implements Printable {
  // 必须自己实现所有成员
  content: string = '';
  
  print() {
    console.log(this.content);
  }
}
```

### 3.6. extends 可以继承访问修饰符

```typescript
class Parent {
  private secret: string;
  protected internal: string;
  public visible: string;
  
  constructor() {
    this.secret = 'secret';
    this.internal = 'internal';
    this.visible = 'visible';
  }
}

// extends 可以继承访问修饰符
class Child extends Parent {
  method() {
    // this.secret; // 错误：private 在子类中不可访问
    this.internal; // 正确：protected 在子类中可访问
    this.visible;  // 正确：public 在子类中可访问
  }
}


```

### 3.7. 类 implements 只关注公共接口

```typescript
// implements 只关注公共接口
interface Visible {
  visible: string;
}

class Implementation implements Visible {
  // 只需要实现公共接口
  visible: string = 'visible';
  
  // 可以有自己的私有成员
  private ownSecret: string = 'secret';
}
```

### 3.8. extends 用于泛型约束

```typescript
// extends 用于泛型约束
interface HasLength {
  length: number;
}

// T 必须包含 length 属性
function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}
```

### 3.9. implements 用于实现泛型接口

```typescript
// implements 用于实现泛型接口
interface Container<T> {
  value: T;
  getValue(): T;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}
  
  getValue(): T {
    return this.value;
  }
}
```

### 3.10. 抽象类和接口

```typescript
// 抽象类可以包含实现
abstract class AbstractClass {
  abstract abstractMethod(): void;
  
  implementedMethod() {
    console.log('This method has implementation');
  }
}

// 接口只能包含声明
interface Interface {
  method(): void;
}

// 使用 extends 继承抽象类
class ConcreteClass extends AbstractClass {
  abstractMethod() {
    console.log('Implemented abstract method');
  }
}

// 使用 implements 实现接口
class ImplementingClass implements Interface {
  method() {
    console.log('Implemented interface method');
  }
}
```

### 3.11. 类型检查差异

```typescript
// extends 继承实现和类型
class Base {
  baseMethod() { return 'base'; }
}

class Derived extends Base {
  derivedMethod() { return 'derived'; }
}

const derived: Derived = new Derived();
derived.baseMethod();     // 正确：继承了实现
derived.derivedMethod();  // 正确：自己的方法

// implements 只继承类型
interface Walkable {
  walk(): void;
  speed: number;
}

class Human implements Walkable {
  speed: number = 5;
  
  // 必须实现接口中的所有方法
  walk() {
    console.log('Walking...');
  }
  
  // 可以有额外的方法
  run() {
    console.log('Running...');
  }
}
```

### 3.12. 实际应用场景

```typescript
// 使用 extends 的场景
// 1. 共享代码实现
abstract class HttpClient {
  protected baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  abstract request(url: string): Promise<any>;
}

class RestClient extends HttpClient {
  request(url: string): Promise<any> {
    return fetch(this.baseUrl + url);
  }
}

// 使用 implements 的场景
// 1. 确保类型一致性
interface Repository<T> {
  find(id: string): Promise<T>;
  save(item: T): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: string): Promise<User> {
    // 实现查找用户
    return {} as User;
  }
  
  async save(user: User): Promise<void> {
    // 实现保存用户
  }
}

// 2. 策略模式
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paying ${amount} with credit card`);
  }
}

class PayPalPayment implements PaymentStrategy {
  pay(amount: number) {
    console.log(`Paying ${amount} with PayPal`);
  }
}
```

### 3.13. 关键区别总结

- **继承与实现**
	- `extends` 用于继承类的实现
	- `implements` 只用于实现接口的类型检查
- **代码复用**
	- `extends` 可以复用父类的代码
	- `implements` 不提供代码复用
- **多重使用**
	- 类只能 `extends` 一个类
	- 类可以 `implements` 多个接口
- **访问修饰符**
	- `extends` 继承所有访问修饰符
	- `implements` 只关注公共接口
- **构造函数**
	- `extends` 可以使用 `super()`
	- `implements` 不涉及构造函数继承
- **使用场景**
	- `extends` 用于代码复用和类型继承
	- `implements` 用于确保类型一致性

## 4. TypeScript 中 Interface 与 Type 的区别

- `interface` 只能定义`对象类型`
- `type` 声明可以声明任何类型。
- `interface` 能够声明 **合并**，两个相同接口会 **合并**。`Type`声明合并会报错
- `type`可以`类型推导`
	- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-24.png)

## 5. ts 中的 const 、 readonly 的区别

- 一个用于变量，一个用于属性
- `readonly` 修饰的**属性**能确保自身不能修改属性，
