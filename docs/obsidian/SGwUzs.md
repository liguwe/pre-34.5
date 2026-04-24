# 原型链

`#javascript` 

## 1. 自己实现 isMyInstanceof

```javascript hl:3,5,9
function myInstanceof(left, right) {

  // 获取对象的原型，使用 Object.getPrototypeOf()
  let proto = Object.getPrototypeOf(left); 
  // 或者使用 left.__proto__
  // let proto = left.__proto__; 
  let prototype = right.prototype; // 获取构造函数的原型对象

  while (true) {
    // 查找到尽头，还没找到, 返回 false
    if (proto === null) {
      return false;
    }
    // 找到相同的原型对象，返回 true
    if (proto === prototype) {
      return true;
    }
    // 继续查找, 直到找到相同的原型对象
    proto = Object.getPrototypeOf(proto);
  }
}
```

## 2. 原型链

> 别搞混了：是 实例的 `__proto__` 指向 `构造函数的 prototype`

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241024-4.png)
