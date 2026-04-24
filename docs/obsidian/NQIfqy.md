# javascript 中实现继承的方式

`#R2` `#javascript` 

## 1. es6： extend

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.colors = ["red", "blue"];
  }

  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }

  getAge() {
    return this.age;
  }
}

```

## 2. es5：原型链继承

```javascript
// 缺点：引用类型属性被所有示例共享
Child.prototype = new Parent();
```

## 3. es5：借用构造函数继承

```javascript
/*********************************************
 // 832: 借用构造函数继承
 优点1：避免引用类型属性被所有示例共享
 优点2：可以在 Child 中向 Parent 传参
 缺点：每次创建实例都会创建一遍方法
 *********************************************/
function Child(name) {
    // 832: 使用call函数
    Parent.call(this, name);
}
```

## 4. es5：原型链继承 + 借用构造函数

```javascript
/*********************************************
 // 832: 原型链继承 + 借用构造函数
 优点1：避免引用类型属性被所有示例共享
 优点2：可以在 Child 中向 Parent 传参
 优点3：方法不用重新创建，在原型链上
 *********************************************/
// 关键点1：
function Child(name) {
    Parent.call(this, name);
}

// 关键点2：
Child.prototype = new Parent();
Child.prototype.constructor = Child;
```

## 5. ES5： Object.create

```javascript
/*********************************************
 // 832: 即ES5 Object.create ， 将传入的对象作为创建的对象的原型
 缺点：引用类型属性被所有示例共享，和原型链一样
 *********************************************/
function myCreate(o) {
    function F() {
    }

    F.prototype = o;
    return new F();
}
```

## 6. es5：寄生式继承

```javascript
/*********************************************
 // 832: 寄生式继承
 缺点：每次创建实例都会创建一遍方法
 *********************************************/
function createObj(o) {
    let clone = Object.create(o);
    clone.sayName = function () {
        console.log('hi');
    }
    return clone;
}
```

## 7. es5：寄生组合式继承：最佳方式

```javascript
/*********************************************
 // 832: 寄生组合式继承
 优点1：这种方式的高效率体现它只调用了一次 Parent 构造函数，
 优点2：并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。
 优点3：与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。
 *********************************************/
function prototype(child, parent) {
    let p = Object.create(parent.prototype);
    p.constructor = child;
    child.prototype = p;
}
```
