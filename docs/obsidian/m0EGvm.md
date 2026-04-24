# 深拷贝与浅拷贝

`#javascript` 

## 1. 常见的浅拷贝方式

```javascript
function shadowCopy(obj) {
  const newObj = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      newObj[prop] = obj[prop];
    }
  }
  return newObj;
}

Object.assign({}, {});

Array.prototype.slice();

Array.prototype.concat();

let a = [...b];
```

## 2. 深拷贝的简易实现

```javascript
function deepCopy(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  const newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    newObj[key] = deepCopy(obj[key]);
  }
  return newObj;
}
```

## 3. 如何解决循环引用问题：`WeakMap`

```javascript hl:5,9,2
function deepCopy(obj, hash = new WeakMap()) {
  // 基本类型
  if (typeof obj !== "object") {
    return obj;
  }
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  const newObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (let key in obj) {
    newObj[key] = deepCopy(obj[key], hash);
  }
  return newObj;
}
```

## 4. 考虑其他类型

```javascript hl:15
// 考虑 RegExp、Date、Function、Symbol、Map、Set、WeakMap、WeakSet、Error、Promise、BigInt 等特殊对象
function deepCopy(obj, hash = new WeakMap()) {
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Function) return new Function(obj);
  if (obj instanceof Symbol) return new Symbol(obj);
  if (obj instanceof Map) return new Map(obj);
  if (obj instanceof Set) return new Set(obj);
  if (obj instanceof WeakMap) return new WeakMap(obj);
  if (obj instanceof WeakSet) return new WeakSet(obj);
  if (obj instanceof Error) return new Error(obj);
  if (obj instanceof Promise) return new Promise(obj);
  if (obj instanceof BigInt) return new BigInt(obj);

  // 基本类型
  if (typeof obj !== "object") {
    return obj;
  }
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  const newObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (let key in obj) {
    newObj[key] = deepCopy(obj[key], hash);
  }
  return newObj;
}
```

## 5. 上面的代码肯定有问题的，比如函数，symbol ， map 、set 等

```javascript
function deepCopy(obj, hash = new WeakMap()) {
  // 处理null和undefined
  if (obj === null || typeof obj === 'undefined') return obj;

  // 处理基本类型
  if (typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }

  // 处理已经复制过的对象（循环引用）
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 处理特殊对象类型
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Error) return new Error(obj.message);

  // 处理函数
  if (typeof obj === 'function') {
    return function() {
      return obj.apply(this, arguments);
    };
  }

  // 处理 Symbol
  if (typeof obj === 'symbol') return Object(Symbol.prototype.valueOf.call(obj));

  // 处理 Map
  if (obj instanceof Map) {
    const newMap = new Map();
    hash.set(obj, newMap);
    obj.forEach((value, key) => {
      newMap.set(deepCopy(key, hash), deepCopy(value, hash));
    });
    return newMap;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const newSet = new Set();
    hash.set(obj, newSet);
    obj.forEach(value => {
      newSet.add(deepCopy(value, hash));
    });
    return newSet;
  }

  // 处理 WeakMap 和 WeakSet
  if (obj instanceof WeakMap || obj instanceof WeakSet) {
    // 这些对象不能被深拷贝，返回新的空实例
    return new obj.constructor();
  }

  // 处理 Promise
  if (obj instanceof Promise) {
    return new Promise((resolve, reject) => {
      obj.then(
        value => resolve(deepCopy(value, hash)),
        error => reject(deepCopy(error, hash))
      );
    });
  }

  // 处理 BigInt
  if (typeof obj === 'bigint') return BigInt(obj.toString());

  // 处理普通对象和数组
  const newObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepCopy(obj[key], hash);
    }
  }

  // 处理不可枚举属性
  const symbolProperties = Object.getOwnPropertySymbols(obj);
  for (const sym of symbolProperties) {
    newObj[sym] = deepCopy(obj[sym], hash);
  }

  return newObj;
}

```

也可使用 Reflect.ownKeys 来遍历对象，它包含 Object.keys 的属性 和 symbals 属性，如下代码

>  没考虑 函数、正则、日期、Math 等等

```javascript
function deepCopy(obj, weakMap = new WeakweakMap()) {
  // 基本数据类型
  if (
    ["String", "Boolean", "Number", "Null", "Undefined"].includes(getType(obj))
  ) {
    return obj;
  }
  // 如果是对象
  if (weakMap.get(obj)) {
    return obj;
  }
  let target = Array.isArray(obj) ? [] : {};
  weakMap.set(obj, target);
  // TODO 这个不会检测出symbol
  // 1、可以使用 Reflect.keys 全部能检测出全部 keys ，包括 symbol keys
  // 2、可以使用 Object.getOwnPropertySymbols(obj) 检测出 symbol keys
  Reflect.ownKeys(obj).forEach((key) => {
    // 改动
    if (isObject(obj[key])) {
      target[key] = deepCopy(obj[key], weakMap);
    } else {
      target[key] = obj[key];
    }
  });
  return target;
}
```

## 6. JSON 的方式实现

`json`的方式会丢失很多内容，比如 map、regexp、set、date、set、函数以及循环引用的问题

## 7. 最后：建议

还是使用 `loadsh` 、`Ramda` 等库吧 ，细节还有很多需要考虑的，别自己造轮子
