# apply、call、bind 的区别及简易实现

`#javascript` 

## 1. 区别

1. call 和 apply 的区别主要在于参数的传递方式:
    - call 接受一系列参数：`fn.call(obj,arg1,arg2)`
    - apply 接受一个参数数组：`fn.apply(obj,[arg1,arg2])`
2. bind 与 call/apply 的主要区别 → **是否立即执行**
    - call 和 apply 会**立即执行**函数
    - bind **返回一个新函数**,可以稍后执行
3. 使用场景:
    - call/apply: 
        - 当你想**立即调用函数**,并`临时`改变 this 指向时使用
    - bind: 
        - 当你想创建一个**永久改变 this 指向**的**新函数**时使用,常用于回调函数中保持 this 指向

## 2. 手写 apply

```javascript
// 使用ES6语法实现的apply 
Function.prototype._apply = function (context = window, args) {
  // 首先要获取那个函数调用了 apply ，即 this
  // 比如 foo.apply(bar, [1, 2, 3]) , 这里的 this 就是 foo
  context.fn = this;
  let res;
  if (Array.isArray(args)) {
    res = context.fn(...args);
  } else {
    // none args
    res = context.fn();
  }
  delete context.fn;
  return res;
};
```

## 3. 手写 call

```javascript
// 使用ES6语法实现的call: 记得使用扩展运算符
Function.prototype._call = function (context = window, ...args) {
  // 首先要获取那个函数调用了 call ，即 this
  // 比如 foo.call(bar, 1, 2, 3) , 这里的 this 就是 foo
  context.fn = this;

  let res = context.fn(...args);

  delete context.fn;
  return res;
};
```

## 4. 手写 bind

```javascript hl:4,7
// 使用ES6语法实现的bind
Function.prototype._bind = function (context = window, ...args) {
  let fn = this;
  // 返回的一个新函数: 注意这里需要合并参数
  return function (...newArgs) {
    return fn.apply(context, args.concat(newArgs));
    // 如果要求不能使用 apply, 那么就使用 上面定义的 _apply
    // return fn._apply(context, args.concat(newArgs));
  };
};
```
