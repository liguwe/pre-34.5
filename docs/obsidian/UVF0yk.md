# 遍历对象的方式

`#javascript` 

## 1. 列举

- 使用 `Object.keys()` 当：
    - 只需要`可枚举`属性
    - 不返回`继承`的属性
    - 不需要 Symbol 属性
    - 性能是主要考虑因素
        - `Object.keys()` **通常性能更好**，因为它只处理可枚举属性 
- 使用 `Reflect.ownKeys()` 当：
    - 返回对象的**所有有属性键的数组** ，包括：
        - 所有字符串键（可枚举和不可枚举）
        - 所有 Symbol 键（可枚举和不可枚举）
        - **不返回继承的属性** 
        - 不会返回**原型链**上的属性和方法
    - 返回顺序：
        1. 数字键（按升序）
        2. 字符串键（按添加顺序）
        3. Symbol 键（按添加顺序）
- **for...in 循环**
	- 返回**所有可枚举**属性，包括**继承**的
		- **所以慢啊**
	- 不返回 Symbol 属性
- 在开发工具、框架或需要完整反射功能的场景中，`Reflect.ownKeys()` 是更好的选择

## 2. 选择指南

1. **需要遍历继承的属性**
    - 使用 `for...in`
2. **只需要自身可枚举属性**
    - 使用 `Object.keys()`
3. **需要所有属性（包括不可枚举）**
    - 使用 `Object.getOwnPropertyNames()`
        - 只返回对象自身的属性
        - 不返回`原型链`上的属性
        - 返回的是一个字符串数组
        - 不返回 Symbol 属性
4. **需要 Symbol 属性**
    - 使用 `Object.getOwnPropertySymbols()`
    - 只返回对象的 Symbol 类型的
        - 包括可枚举和不可枚举的 Symbol
        - 不包含字符串键
5. **需要所有类型的属性**
    - 使用 `Reflect.ownKeys()`
6. **需要键值对**
    - 使用 `Object.entries()`
7. **只需要值**
    - 使用 `Object.values()`

## 3. 如何返回原型链上的所有属性和方法

### 3.1. 使用 for...in 循环

最简单的方法，会遍历对象本身及其原型链上的所有可枚举属性：

```javascript
class Animal {
    constructor() {
        this.type = 'animal';
    }
    eat() {
        console.log('eating');
    }
}

class Dog extends Animal {
    constructor() {
        super();
        this.name = 'dog';
    }
    bark() {
        console.log('woof');
    }
}

const dog = new Dog();

// 使用 for...in
const propsWithForIn = [];
for (let prop in dog) {
    propsWithForIn.push(prop);
}
console.log('for...in:', propsWithForIn);
// 输出: ['name', 'type', 'bark', 'eat']
```

>  这也是为什么通常 for-in 都很慢的原因

### 3.2. 手动遍历原型链

如果需要包括不可枚举属性，可以手动遍历原型链：

```javascript hl:5
function getAllProperties(obj) {
    const props = new Set();
    
    let currentObj = obj;
    while (currentObj !== null) {
        // 获取当前对象的所有属性（包括不可枚举的）
        Reflect.ownKeys(currentObj).forEach(key => props.add(key));
        // 获取原型对象
        currentObj = Object.getPrototypeOf(currentObj);
    }
    
    return Array.from(props);
}

// 测试
class Base {
    constructor() {
        this.baseProperty = 'base';
        // 添加一个不可枚举属性
        Object.defineProperty(this, 'hidden', {
            value: 'hidden property',
            enumerable: false
        });
    }
    
    baseMethod() {}
}

class Derived extends Base {
    constructor() {
        super();
        this.derivedProperty = 'derived';
    }
    
    derivedMethod() {}
}

const instance = new Derived();

console.log('All properties:', getAllProperties(instance));
// 输出包括所有属性和方法，包括不可枚举的
```
