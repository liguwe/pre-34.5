# class 中各种方法定义的区别

`#javascript` 

## 1. class中箭头函数与普通函数的 `this` 指向问题

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241114-20.png)

```javascript hl:17,23,8
class Animal {
  constructor() {
    this.name = "cat";
  }
  // 普通函数方法,直接挂载在原型上
  speak() {
    // 当然，this都指向实例对象
    console.log(this)
    console.log(this.name);
  }
  // 箭头函数方法，直接挂载在 Animal 上
  eat = () => {
    // 当然，this 都指向实例对象
    console.log(this.name);
  };
}
const n = new Animal();
const a = n.speak;
const b = n.eat;

// 箭头函数方法： this依然指向创建的实例对象，即，箭头函数中的this始终是该箭头函数所在作用域中的this
b(); // cat
// 普通方法，报错，因为 方法中的this 会指向undefined ，即普通函数中的 this 是动态绑定的，始终指向函数的执行环境，
a(); // 报错
```

## 2. 总结： JavaScript class 中各种方法定义的区别：

| 方法类型     | 语法                    | this 绑定 | 继承性      | 访问范围 | 内存占用   | 主要使用场景           | 示例                                                 |
| -------- | --------------------- | ------- | -------- | ---- | ------ | ---------------- | -------------------------------------------------- |
| 普通实例方法   | `method() {}`         | 动态绑定    | 可继承      | 公开   | 所有实例共享 | 实例的基本行为、可复用的实例方法 | `speak() { console.log(this.name) }`               |
| 箭头函数属性   | `method = () => {}`   | 固定绑定到实例 | **不可继承** | 公开   | 每个实例单独 | 事件处理器、回调函数       | `onClick = () => { this.count++ }`                 |
| 静态方法     | `static method() {}`  | 绑定到类    | 可继承      | 公开   | 类级别共享  | 工具函数、工厂方法        | `static create() { return new This() }`            |
| 私有方法     | `#method() {}`        | 动态绑定    | **不可继承** | 私有   | 所有实例共享 | 内部实现、封装逻辑        | `#validate() { return true }`                      |
| 异步方法     | `async method() {}`   | 动态绑定    | 可继承      | 公开   | 所有实例共享 | API调用、异步操作       | `async fetch() { await data }`                     |
| 生成器方法    | `*method() {}`        | 动态绑定    | 可继承      | 公开   | 所有实例共享 | 迭代器、数据流          | `*range() { yield 1 }`                             |
| getter方法 | `get prop() {}`       | 动态绑定    | 可继承      | 公开   | 所有实例共享 | 计算属性、只读属性        | `get fullName() { return this.first + this.last }` |
| setter方法 | `set prop() {}`       | 动态绑定    | 可继承      | 公开   | 所有实例共享 | 属性验证、计算属性        | `set age(v) { if(v>0) this._age = v }`             |
| 静态私有方法   | `static `#method()` {}` | 绑定到类    | **不可继承** | 私有   | 类级别共享  | 私有工具函数、内部初始化     | `static `#init()` { this.config = {} }`              |
| 计算属性名方法  | `[expr]() {}`         | 动态绑定    | 可继承      | 公开   | 所有实例共享 | 动态方法名、Symbol方法   | `[Symbol.iterator]() {}`                           |


1、说明
- **内存效率排序**（从高到低）：
	- 静态方法（类级别共享）
	- 普通实例方法（原型链共享）
	- 箭头函数属性（每实例独立）
- **使用建议**：
	- 一般方法优先使用普通实例方法（原型链共享）
	- 需要 this 稳定的回调用箭头函数
	- 工具函数使用静态方法
	- 内部实现使用私有方法

2、**注意事项**：

   ```javascript
   class Example {
     // 推荐：普通业务方法
     doSomething() {}

     // 推荐：事件处理器
     handleClick = () => {}

     // 推荐：工具函数
     static utils() {}

     // 推荐：内部实现
     `#internal()` {}
   }
   ```

3、**性能考虑**：

   ```javascript
   class Performance {
     // 好 - 内存效率高
     method1() {}

     // 差 - 每个实例都会创建新函数
     method2 = () => {}
   }
   ```

4、**访问控制**：

   ```javascript
   class Access {
     publicMethod() {}      // 外部可访问
     `#privateMethod()` {}    // 仅内部可访问
     static utilMethod() {} // 通过类访问
   }
   ```

### 2.1. 所有定义方法的方式

```javascript
class Example {
  // 1. 普通实例方法
  normalMethod() {}

  // 2. 箭头函数属性
  arrowMethod = () => {}

  // 3. 静态方法
  static staticMethod() {}

  // 4. 私有方法（以 # 开头）
  `#privateMethod()` {}

  // 5. 异步方法
  async asyncMethod() {}

  // 6. 生成器方法
  *generatorMethod() {}

  // 7. 访问器方法（getter/setter）
  get value() {}
  set value(v) {}

  // 8. 静态私有方法
  static `#staticPrivateMethod()` {}

  // 9. 静态代码块
  static {
    // 静态初始化代码
  }

  // 10. 计算属性名方法
  [computedMethodName()]() {}
}
```

### 2.2. 详细比较和使用场景

#### 2.2.1. 普通实例方法

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  // 普通实例方法
  sayHello() {
    console.log(`Hello, ${this.name}`);
  }
}

// 使用场景：
// 1. 实例的基本行为方法
// 2. 需要访问实例属性的方法
// 3. 可以被继承和重写的方法

const user = new User('John');
user.sayHello(); // "Hello, John"
```

#### 2.2.2. 箭头函数属性

```javascript
class Button {
  count = 0;

  // 箭头函数属性
  handleClick = () => {
    this.count++;
    console.log(this.count);
  }
}

// 使用场景：
// 1. 事件处理器
// 2. 需要保持 this 上下文的回调函数
// 3. React 组件中的方法

const button = new Button();
const handler = button.handleClick;
handler(); // this 始终指向 Button 实例
```

#### 2.2.3. 静态方法

```javascript
class MathUtils {
  // 静态方法
  static add(x, y) {
    return x + y;
  }

  static isPositive(num) {
    return num > 0;
  }
}

// 使用场景：
// 1. 工具函数
// 2. 工厂方法
// 3. 不需要访问实例状态的方法

console.log(MathUtils.add(1, 2)); // 3
console.log(MathUtils.isPositive(5)); // true
```

#### 2.2.4. 私有方法

```javascript
class BankAccount {
  `#balance` = 0;

  // 私有方法
  `#validateAmount(amount)` {
    if (amount <= 0) throw new Error('Invalid amount');
  }

  deposit(amount) {
    this.#validateAmount(amount);
    this.#balance += amount;
  }
}

// 使用场景：
// 1. 内部辅助方法
// 2. 封装敏感逻辑
// 3. 防止外部直接访问的方法

const account = new BankAccount();
account.deposit(100);
// account.#validateAmount(50); // Error: 私有方法不能在类外部访问
```

#### 2.2.5. 异步方法

```javascript
class DataFetcher {
  // 异步方法
  async fetchData() {
    try {
      const response = await fetch('https://api.example.com/data');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
}

// 使用场景：
// 1. API 调用
// 2. 文件操作
// 3. 需要等待结果的操作

const fetcher = new DataFetcher();
fetcher.fetchData().then(data => console.log(data));
```

#### 2.2.6. 生成器方法

```javascript
class Iterator {
  // 生成器方法
  *range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }

  // 可迭代对象的生成器
  *[Symbol.iterator]() {
    yield* this.range(1, 5);
  }
}

// 使用场景：
// 1. 创建自定义迭代器
// 2. 惰性计算序列
// 3. 处理大量数据时的内存优化

const iterator = new Iterator();
for (const num of iterator.range(1, 3)) {
  console.log(num); // 1, 2, 3
}
```

#### 2.2.7. 访问器方法

```javascript
class Temperature {
  `#celsius` = 0;

  // getter
  get celsius() {
    return this.#celsius;
  }

  // setter
  set celsius(value) {
    this.#celsius = value;
  }

  // 计算属性的 getter
  get fahrenheit() {
    return this.#celsius * 9/5 + 32;
  }
}

// 使用场景：
// 1. 属性的读写控制
// 2. 计算属性
// 3. 数据验证和转换

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit); // 77
```

#### 2.2.8. 静态私有方法

```javascript hl:5
class ConfigManager {
  static `#instance` = null;

  // 静态私有方法
  static `#initialize()` {
    // 初始化配置
    return new ConfigManager();
  }

  static getInstance() {
    if (!this.#instance) {
      this.#instance = this.#initialize();
    }
    return this.#instance;
  }
}

// 使用场景：
// 1. 单例模式实现
// 2. 私有工具函数
// 3. 内部初始化逻辑
```

#### 2.2.9. 静态代码块

```javascript
class Application {
  static config;

  // 静态代码块
  static {
    try {
      this.config = JSON.parse(localStorage.getItem('app-config'));
    } catch {
      this.config = { default: true };
    }
  }
}

// 使用场景：
// 1. 复杂的静态初始化
// 2. 需要 try-catch 的初始化
// 3. 一次性的设置代码
```

#### 2.2.10. 计算属性名方法

```javascript
const getMethodName = () => 'handle' + 'Click';

class DynamicMethods {
  // 计算属性名方法
  [getMethodName()]() {
    console.log('Clicked!');
  }

  // 使用 Symbol 作为方法名
  [Symbol.iterator]() {
    // ...
  }
}

// 使用场景：
// 1. 动态方法名
// 2. Symbol 方法
// 3. 元编程
```

### 2.3. 方法定义的最佳实践

```javascript
class BestPractices {
  // 1. 公共 API 方法使用普通方法
  publicMethod() {}

  // 2. 事件处理使用箭头函数
  handleEvent = () => {}

  // 3. 工具函数使用静态方法
  static utility() {}

  // 4. 内部逻辑使用私有方法
  `#internalLogic()` {}

  // 5. 异步操作使用 async 方法
  async fetchData() {}

  // 6. 需要计算的属性使用 getter/setter
  get computedValue() {}

  // 7. 迭代相关使用生成器
  *createIterator() {}
}
```

### 2.4. 性能和内存考虑

```javascript
class Performance {
  // 1. 原型方法 - 内存效率高
  method1() {}

  // 2. 实例方法 - 每个实例都会创建
  method2 = () => {}

  // 3. 静态方法 - 类级别共享
  static method3() {}
}

// 创建多个实例时的内存影响
const instances = Array(1000).fill().map(() => new Performance());
```

### 2.5. 继承行为

```javascript
class Parent {
  parentMethod() {}
  static parentStatic() {}
}

class Child extends Parent {
  // 可以继承和重写普通方法
  parentMethod() {
    super.parentMethod();
  }

  // 可以继承和重写静态方法
  static parentStatic() {
    super.parentStatic();
  }

  // 箭头函数和私有方法不能通过 super 访问
}
```

### 2.6. 最佳实践建议

```javascript
class BestPracticeExample {
  // 使用箭头函数：
  // 1. 需要绑定到实例的事件处理器
  onEvent = () => {}
  
  // 使用普通方法：
  // 1. 实例的业务逻辑方法
  // 2. 需要在原型链上的方法
  processData() {}
  
  // 使用静态方法：
  // 1. 工具函数
  // 2. 工厂方法
  // 3. 不需要访问实例状态的方法
  static create() {}
}
```
