# Vue3 的非原始值响应式方案（Map、WeakMap 、Set 、WeakSet ）

`#vue原理` `#vue原理` 


前文 [8. Vue3 的响应式原理：effect、computed、watch 的实现原理](/xqqSVs) 注意讲了基本的响应式方案

本文，主要讲解更复杂场景 ，比如
- 如何拦截 `for-in` ?
- 如何拦截 `Map WeakMap  Set  WeakSet` 等？

## 1. 总结

> 重点：**查阅 JavaScript 语言规范**

### 1.1. 基本原理

- Vue 的响应式数据是基于 Proxy 实现的
	- Proxy 可以为其他对象创建一个代理对象
	- 在实现代理的过程中，我们遇到了访问器属性的 `this 指向`问题，这需要使用 `Reflect.* 方法`并指定正确的 `receiver` 来解决。
- 在 ECMAScript 规范中，JavaScript 中有两种对象，
	- 其中一叫作`常规对象`
	- 另一种叫作`异质对象`。
- 代理 `Object对象` 的本质， 就是**查阅规范**并找到可拦截的基本操作的方法。
	- 有一些操作并不是基本操作，而是**复合操作**
	- 这需要我们查阅规范了解它们都依赖哪些基本操作，从而通过基本操作的拦截方法**间接**地处理复合操作。
- 添加、修改、删除属性对 `for...in` 操作的影响
	- `添加和删除`属性都会影响 `for...in` 循环的`执行次数`，所以当这些操作发生时，需要触发与 `ITERATE_KEY` 相关联的副作用函数重新执行。
	- `修改`属性值则不影响 `for...in` 循环的执行次数，因此无须处理。
- 如何合理地触发副作用函数重新执行，包括
	- 对 `NaN` 的处理，
		- 对于 `NaN`，我们主要注意的是`NaN === NaN`永远等于false
	- 访问**原型链上的属性导致的副作用函数**重新执行两次的问题
		- 对于原型链属性问题，需要我们查阅规范定位问题的原因。
	- 由此可见，想要基于 `Proxy` 实现一个相对完善的响应系统，**免不了去了解 ECMAScript 规范**。
- 深响应与浅响应，以及深只读与浅只读。
	- 这里的深和浅指的是对象的层级
	- 浅响应(或只读)
		- 代表**仅代理一个对象的第一层属性**，即只有对象的第一层属性值是响应(或只读)的
	- 深响应(或只读)则恰恰相反
		- 为了实现深响应(或只读)，我们需要在返回属性值之前，对值做一层包装，将其包装为响应式(或只读) 数据后再返回

### 1.2. 数组的代理

- 数组是一个`异质对象`，因为数组对象部署的内部方法 `[DefineOwnProperty](#)` 不同于常规对象。
- 很多隐式对象的属性，触发响应的时候需要额外注意，比如
	- 通过`索引`为数组设置新的元素，可能会隐式地改变数组 `length` 属性的值。
	- 对应地，修改数组 `length` 属性的值，也可能会间接影响数组中的已有元素。
- 如何拦截 `for...in` 和 `for...of` 对数组的遍历操作：**只需要跟踪拦截数组的 length** ，下面是原因
	- 使用 `for...in` 循环遍历数组与遍历普通对象区别不大，唯一需要注意的 是，当追踪 for...in 操作时，应该使用`数组的 length` 作为追踪的 key。
	- `for...of` 基于迭代协议工作，数组内建了 `Symbol.iterator` 方法。
		- 数组迭代器执行时，会读取数组的 length 属性或数组的索引。因此，我们不需要做其他额外的处理，就能够实现对 for...of 迭代的响应式支持。
- 数组的查找方法。如 `includes`、indexOf 以及 lastIndexOf 等
	- 对于数组元素的查找，需要注意的一点是：
		- **用户既可能使用代理对象进行查找，也可能使用原始对象进行查找。**
	- 为了支持这两种形式，我们需要**重写数组的查找方法**。
	- 原理很简单，当用户使用这些方法查找元素时，我们可以先去代理对象中查找，如果找不到，再去原始数组中查找。
- 栈溢出问题
	- 即 `push、pop、 shift、unshift 以及 splice` 等方法。
		- 调用这些方法会间接地读取 和设置数组的 `length` 属性
		- 因此，在不同的副作用函数内对同一个 数组执行上述方法，会导致多个副作用函数之间循环调用，最终导致调用**栈溢出**。
	- 为了解决这个问题，我们使用一个标记变量 `shouldTrack` 来代表是否允许进行追踪，
		- 然后重写了上述这些方法， 目的是，当这些方法间接读取 length 属性值时，我们会先将 shouldTrack 的值设置为 false，即禁止追踪。
	- 这样就可以断开 length 属性与副作用函数之间的响应联系，从而避免循环调用导致的调用栈溢出

### 1.3. 集合类型的响应式方案

Vue3 依然使用 Proxy 来实现对 Map 和 Set 的拦截，但实现方式比普通对象更复杂
-  Vue3 为 Map 和 Set 创建了特殊的处理器（`handlers`）
	- **你可以理解为 使用`对象&函数`包装了 Map 和 Set**


--- 


- 集合类型指 Set、Map、WeakSet 以及 WeakMap
	- 例如，集合类型的 size 属性是一个**访问器属性**，当通过代理对象访问 size 属性时
		- 由于代理对象本身并没有部署 `[SetData](#)` 这样的**内部槽**，所以会发生错误
	- 另外，通过代理对象执行集合类型 的操作方法时，要注意这些方法执行时的 this 指向
		- 我们需要在 **get 拦截函数内通过 .bind 函数**为这些方法绑定正确的 `this 值`。
- 集合类型响应式数据的实现
	- 我们需要通过“**重写**”集合方法的方式来实现自定义的能力，
	- 当 Set 集合的 add 方法执行时，需要调用 `trigger` 函数触发响应
- 数据污染
	- 指的是不小心将响应式数据添加到原始数据中，它导致用户可以通过原始数据执行响应式相关操作，这不是我们所期望的
	- 为了避免这类问题发生
		- 我们通过响应式数据对象的 `raw 属性`来访问对应的原始数据对象，后续操作使用原始数据对象就可以了。
- 集合的 `forEach` 方法与对象的 `for...in` 遍历类似，最大的不同体现在在于
	- 当使用 `for...in` 遍历对象时，我们只关心对象的键是否变化，而不关心值
	- 但使用 `forEach` 遍历集合时，我们既关心键的变化，也关心值的变化

## 2. 先看看 `Proxy` 与 `Reflect`

### 2.1. 基本操作

拦截对象的 `读 get 、取 set`   

```javascript
const obj = {foo: 1}

const p = new Proxy(obj, {
    get() {
        return obj.foo
    },
    set(target, key, value) {
        obj[key] = value
    }
})
```

拦截函数的`调用 apply`

```javascript hl:6
const fn = (name) => {
    console.log('我是：', name)
}

const p2 = new Proxy(fn, {
    apply(target, thisArg, argArray) {
        target.call(thisArg, ...argArray)
    }
})
```

### 2.2. 复合操作

读取一个对象的方法，如 `obj.fn()` ， 分两步：
- 先 `get` 读取 `obj.fn`
- 然后`apply` 调用，`obj.fn()`

### 2.3. Reflect

![|496](https://832-1310531898.cos.ap-beijing.myqcloud.com/89f6df0dbb53ae4746460d060a860c99.png)

> `Reflect` 与 `Proxy` 的 API 一一对应，比如 `get / set / apply` 等

`Reflect` 还接受`第三个参数`，如下：

![|728](https://832-1310531898.cos.ap-beijing.myqcloud.com/6f6465918bdc361e993206a4b58d401d.png)

前文 [8. Vue3 的响应式原理：effect、computed、watch 的实现原理](/xqqSVs) 的` Effect` 函数，如果对于下面的数据结构有问题，`无法正常收集响应信息`。这时候就需要用到 `Reflect 的第三个参数了`

```javascript hl:3
const obj = {
  foo: 1,
  get bar() {
     return this.foo
  }
}
```

## 3. Javascript 对象 与 Proxy 对象

### 3.1. 如何判断是 `普通对象` 还是`函数对象`

JS 中一切都是对象，函数也是对象，那么如何区分呢？
- 对象真正语义由`内部方法`实现，即对对象进行某个操作时，`引擎内部`实际调用的方法，对用户是不可见的

![|808](https://832-1310531898.cos.ap-beijing.myqcloud.com/facf27b921187c6c77f36e11511f2d2d.png)

如上图，是常规对象 的 `内部方法`，下面是`函数对象的内部方法`

![|800](https://832-1310531898.cos.ap-beijing.myqcloud.com/5ffa20e66f443a16309655b8ae9201c4.png)

所以，根据是否部署 `[Call](#)` 方法，就可以判断是 `普通对象` 还是`函数对象` 

> [https://262.ecma-international.org/#sec-ordinary-and-exotic-objects-behaviours](https://262.ecma-international.org/#sec-ordinary-and-exotic-objects-behaviours)

### 3.2. `常规对象` 与 `异质对象`

ES 规范，JS 中有`两种对象`：

- `常规对象`
- `异质对象`： 
	- 如 Proxy 对象，如下图：

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/a519e54f6ddf360657463d503143b1ca.png)

- `[Call](#)` 和 `[construct](#)` 两个内部方法**只有被代理对象是函数和构造函数时**才会调用
- 内部方法的`多态性` 即 普通对象 和 Proxy 都有 `[Get](#)` ，但规范定义是完全不同的。

> [https://262.ecma-international.org/#sec-proxy-object-internal-methods-and-internal-slots](https://262.ecma-international.org/#sec-proxy-object-internal-methods-and-internal-slots)

### 3.3. 示例：代理 `delete` 操作

所以根据以上可知，可通过**下面**的方式 `拦截删除属性操作` 

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/29799983481927d8818c33386d0b94e6.png)
``
> [!bug]
注意：需要删除被 `proxy` 的对象，才会拦截，如下图，下面的方式就不会
**自己丢到坑里了，搞了一会，才发现都写错了** ， `delete.p` 才行


![|720](https://832-1310531898.cos.ap-beijing.myqcloud.com/b125b5237dd8ce6ea39f9e95e472d7fa.png)

## 4. 如何代理 Object

如何拦截对象的`一切读取操作`，比如
- 访问属性：`obj.foo` ， `obj['foo']`
	- `Proxy get`
- `in`操作符：`foo in obj`
	- 根据 ECMA-262 中，in 操作符运算时的逻辑，通过 `Proxy has` 拦截
- 遍历：`for(const key in obj)`
	- 还是通过规范可知，使用` Proxy ownKeys 操作` 可拦截
- 删除某个属性： `delete p.foo`
	- 通过看规范可知，可通过拦截 `Proxy deleteProperty ` 拦截
- 等等。。。

所以，结论就是：首先需要`查阅规范`，找到可拦截的方法，另外一些`复合操作`，依赖于一些基本操作，我们需要分析，通过拦截`基本操作`，达到`间接拦截复合操作`的目的。

另外，比如 添加、删除属性时对 `for-in` 的`执行次数`有影响，需要定义 `const ITERATE_KEY = Symbol()`，即`遍历key` 与 副作用函数相关联，避免重复执行。

> [!info]
 更多的参考代码，不展开了，真正需要的时候再说吧！

### 4.1. 合理的触发响应

如下代码：期望改变 `p.foo` 时，触发 `effect` 函数

```javascript
const obj = {foo:0}
const p = reactive(obj);

effect(() => {
    console.log(p.foo);
})

p.foo = 1;
p.foo = 2;
p.foo = 3;

```
打印如下：
![|256](https://832-1310531898.cos.ap-beijing.myqcloud.com/583cf5d8cf0ab1a883d7a49d63b4a3d2.png)

然而，`NaN === NaN` 永远为 `false` ，需要兼容。如下图：

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/e0dfc40ac7fec65a89882cd170810a47.png)

最后，访问`原型链上的属性`，可能会导致副作用执行两次的问题，也需要解决。

```javascript
const obj = {foo: 0};
const proto = {bar: 1};

const child = reactive(obj);
const parent = reactive(proto);

Object.setPrototypeOf(child, parent);

effect(() => {
    console.log(child.bar);
})

child.bar = 2;
```

所以，代理对象是一个大工程，这里不展开了，以后真正有实际应用场景，再来看`源代码`。

## 5. 深响应与浅响应 、深只读 与 浅只读

`深浅`是指：
- `浅`代表`只读或只响应`对象的`第一层`属性，
- `深`则相反，我们需要，我们需要再返回属性值，之前对值进行递归包装，包装成`响应式`的再返回。

如下图：修改嵌套内层的 `bar属性`，也应该触发副作用函数

![|644](https://832-1310531898.cos.ap-beijing.myqcloud.com/53a08f4b30bc2b6d8a8d9247b6de2c82.png)

所以，我们需要再递归再返回属性值，如下图：

![|656](https://832-1310531898.cos.ap-beijing.myqcloud.com/009b93436fd03c02c033d8c930b0f27f.png)

如下代码：

```javascript
import {createApp, reactive, effect,readonly} from 'vue'
const obj = readonly({ text1: 'text1', text2: 'text2' });
obj.text2 = 1; // [Vue warn] Set operation on key "text2" failed: target is readonly
```

执行会警告：如下图

![](https://832-1310531898.cos.ap-beijing.myqcloud.com/37944aa17e10affab4b6854774631b0e.png)
再者，`只读数据`不应该和副作用函数`建立响应关系`。如何实现呢？

## 6. 对于数组的代理

数组是`异质对象`，因为数组对象的 `[DefineOwnproperty](#)` 内部方法与常规对象不同。
- 通过`索引`直接设置新的元素，可能会`隐式`的改变数组的 `length` 值
- 修改 `length` 值，也可能会影响 `已有元素`
- `for-in`遍历对象与普通对象区别不大，可使用 `length` 作为追踪的 `key`
- 使用 `for-of` 时，会读取数组的 `Symbol.iterator` 的方法。
- 另外对于数组的查找方法：
	- 用户可能会对`代理数组对象`进行查找，当然也可能对`原始对象`进行查找，所以我们`重写了`数组的查找方法。

所以，首先，我需要知道 `读取` 和 `写入` 操作都有哪些？

对于数组所有可能的`读取操作`有哪些？
- `arr[0]`
- length
- for-in 
- for-of
- 不改变原数组的方法：
	- 如 some /find 、includes 等等

对于数组所有可能的`设置操作`有哪些？

- `arr[0]=1`
- `length=0`
- 栈方法：
	- push pop 等等，它还会`隐式`修改 `length`
- 改变原数组的方法：
	- 如 `spice 、sort  、fill` 等

然后，去查文档，看看每个操作后面的调用逻辑是什么？再有针对性的去跟踪建立响应。
为什么我们要重写` includes` 、 `indexOf` 和 `lastIndexof` 呢？

- 以 includes 为例，查阅语言规范，我们发现
   - 这个方法的执行流程中使用了`数组的对象属性的一面`去查找属性，所以 `this` 指向这个`对象`，所以 `reacttive(obj)` 每次都很返回一个新的对象，所以 this 指向肯定有问题。所以我们需要重写 `includes`,
      - 如何重写呢，即拦截` arr 对象`的 `includes 属性` ，及看 `includes` 是否存在于`arrayInstrumentations`中，如下代码

```javascript
const arrayInstrumentations = {}

;['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    // this 是代理对象，先在代理对象中查找，将结果存储到 res 中
    let res = originMethod.apply(this, args)

    if (res === false) {
      // res 为 false 说明没找到，在通过 this.raw 拿到原始数组，再去原始数组中查找，并更新 res 值
      res = originMethod.apply(this.raw, args)
    }
    // 返回最终的结果
    return res
  }
})
```

下面看看为什么重写栈方法：如 `push`，看下面示例：

> 你可以想想，语言规范里，调用 `push` 肯定有一步是修改 `length` 的

```javascript
const arr = reactive([]);
// ::::第一个 effect
effect(() => {
    arr.push(1); // 间接读取 length,所以会建立依赖
})
// ::::第二个 effect
effect(() => {
	// 间接读取 length,还会间接修改 length, 然后就执行第 一 已经建立好的effect，然后就死循环了，导致栈溢出
    arr.push(1); 
})
```

上面的代码会`栈溢出` ，解决方案是：使用全局变量 `shouldTrack` 来禁止追踪，断开 length 属性 与 副作用函数的响应联系。

```javascript
let shouldTrack = true
;['push','unshift','pop'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    shouldTrack = false
    // 调用原始方法之前
    let res = originMethod.apply(this, args)
    // 调用原始方法之后，恢复，允许追踪
    shouldTrack = true
    return res;
  }
})
```

以下代码实现`不追踪`：

```javascript
function track(target, key) {
  if (!activeEffect || !shouldTrack) return
}
```

`pop 、 shift、unshift 、splice` 等方法类似。

## 7. 对于 Set 和 Map 的代理

可以想想 `Set` 和 `Map` 对应的属性和方法有哪些？

- size clear keys values() entries() 等等

同样的你还是需要去查语言规范
- 比如 `size` 是一个访问器属性，语言规范里规范有 `this` 执行的步骤，所以直接通过代理对象访问，会导致报错，这时候你需要去兼容，如去拦截 `get()` ，然后`bind` 正确的 `this 值`

其实 `delete()` 也是同样的道理

很多思路类似，比如代理迭代器属性和方法，比如 `for in` 和 `foreach` ，又比如需要去看看文档规范里 `entries keys 和 values` 是如何定义的

另外需要避免数据污染的问题，即把`响应式数据`设置到`原始数据`上的行为。我们可以通过响应式对象的 `row`属性来访问`原始对象`

## 8. 对于 Proxy 对象

### 8.1. Vue 3 对 Proxy 的处理原则

Vue 3 在处理 Proxy 对象时遵循以下原则：

1. 如果检测到目标对象已经是 Proxy，则直接返回该对象
2. 避免重复代理
3. 保持原始 Proxy 的行为

### 8.2. 源码实现分析

Vue 3 中的关键实现（简化版）：

```javascript
// reactive.js
function reactive(target) {
  // 如果不是对象，直接返回
  if (!isObject(target)) {
    return target
  }

  // 关键点：如果目标已经是响应式对象（Proxy），直接返回
  if (target.__v_raw && !(target instanceof Proxy)) {
    return target
  }
  
  // 防止同一对象被重复代理
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 创建代理
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
```

### 8.3. 实际使用示例

#### 8.3.1. 基本 Proxy 对象

```javascript
// 1. 普通 Proxy
const originalProxy = new Proxy({}, {
  get(target, key) {
    console.log('原始 Proxy get:', key)
    return target[key]
  }
})

// 2. Vue reactive
const reactiveProxy = reactive(originalProxy)

// 3. 验证是否是同一个对象
console.log(reactiveProxy === originalProxy) // true
```

#### 8.3.2. 嵌套 Proxy 情况

```javascript
// 嵌套的 Proxy 对象
const nestedProxy = new Proxy({
  nested: new Proxy({}, {
    get(target, key) {
      console.log('嵌套 Proxy get:', key)
      return target[key]
    }
  })
}, {
  get(target, key) {
    console.log('外层 Proxy get:', key)
    return target[key]
  }
})

// Vue reactive 会保持原有的 Proxy 行为
const reactiveNested = reactive(nestedProxy)
```

### 8.4. 特殊场景处理

#### 8.4.1. 自定义 Proxy 行为保持

```javascript
const customProxy = new Proxy({}, {
  get(target, key) {
    console.log('自定义 get')
    return target[key]
  },
  set(target, key, value) {
    console.log('自定义 set')
    target[key] = value
    return true
  }
})

// Vue reactive 会保持原有的自定义行为
const reactiveCustom = reactive(customProxy)
```

#### 8.4.2. 带有内部状态的 Proxy

```javascript
let internalState = {}

const stateProxy = new Proxy({}, {
  get(target, key) {
    // 访问内部状态
    return internalState[key] || target[key]
  },
  set(target, key, value) {
    // 更新内部状态
    internalState[key] = value
    target[key] = value
    return true
  }
})

// Vue reactive 处理时会保持内部状态
const reactiveState = reactive(stateProxy)
```

### 8.5. 实现原理解析

#### 8.5.1. 检测机制

```javascript
// Vue 3 内部实现（简化版）
function isReactive(value) {
  return !!(value && value.__v_isReactive)
}

function reactive(target) {
  // 已经是响应式对象
  if (isReactive(target)) {
    return target
  }

  // 创建新的响应式对象
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers
  )
}
```

#### 8.5.2. Proxy 处理器

```javascript hl:15,23
// 基础处理器
const baseHandlers = {
  get(target, key, receiver) {
    // 如果访问特殊标记，返回true
    if (key === '__v_isReactive') {
      return true
    }
    
    // 如果目标自身是 Proxy，保持其行为
    if (target instanceof Proxy) {
      return Reflect.get(target, key, receiver)
    }
    
    const res = Reflect.get(target, key, receiver)
    track(target, 'get', key)
    return res
  },
  
  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (hasChanged(value, oldValue)) {
      trigger(target, 'set', key, value, oldValue)
    }
    return result
  }
}
```

### 8.6. 最佳实践

#### 8.6.1. 避免重复代理

```javascript
// ❌ 不好的做法
const proxy1 = new Proxy({}, {/*...*/})
const proxy2 = reactive(proxy1)
const proxy3 = reactive(proxy2)

// ✅ 好的做法
const proxy = reactive(new Proxy({}, {/*...*/}))
```

#### 8.6.2. 保持代理一致性

```javascript
// 推荐的做法
const state = reactive({
  data: new Proxy({}, {
    get(target, key) {
      // 自定义获取逻辑
      return target[key]
    }
  })
})

// 使用时保持引用一致性
const { data } = state
```

#### 8.6.3. 处理复杂代理场景

```javascript
// 创建复杂的响应式状态
const complexState = reactive({
  proxy: new Proxy({}, {
    get(target, key) {
      // 复杂的获取逻辑
      return target[key]
    }
  }),
  data: {
    value: 1
  }
})

// 访问和修改
console.log(complexState.proxy.someKey)
complexState.data.value = 2
```

记住，Vue 3 的响应式系统设计考虑了 Proxy 对象的特殊情况，会智能地处理已经是 Proxy 的对象，避免重复代理，同时保持原有的代理行为。在实际开发中，我们应该避免创建不必要的多层代理，保持代码的简洁性和可维护性。

## 9. 最后

OK，就到这儿吧，其实已经有一个很现成的库供我们使用了，如果某一天真正需要用到，或者需要仔细研究，那么去看看 `@vue/reactivity`
