# Vue3 的响应式原理：effect、computed、watch 的实现原理

`#前端框架/vue` `#前端` `#vue3` 

## 1. 总结

### 1.1. 摘要

本文详细介绍了Vue3响应式系统的设计原理和实现过程。从副作用函数的概念出发，逐步讲解了
- 响应式数据的实现
- 数据结构的设计
- 分支切换问题的解决
- `effect` 函数 嵌套的处理
- `调度系统`的实现
- `computed` 计算属性的原理
- `watch` 函数的实现

### 1.2. 要点

- 响应式数据的基本实现：
	- 依赖于 `Proxy` 和 `副作用函数`
- 使用 `WeakMap`、`Map` 和 `Set` 组合的数据结构来存储**依赖关系**
- 通过 `cleanup函数` 解决分支切换问题
- 使用 `effectStack` 来处理 `effect函数` 的**嵌套问题**
- 实现 `调度系统` 来控制**副作用函数的执行时机和次数**
- 计算属性 `computed` 的实现基于 **lazy执行 和 缓存机制**
- `watch函数` 的实现涉及
	- 递归遍历对象属性
	- 处理`竞态`问题
		- 使用 `oncleanup` 参数
		- 每次变更后都会执行

## 2. 何为副作用函数？

如修改了全局变量等

> 在 React useEffect 章节会有详细介绍副作用的概念

## 3. 为何响应式数据？

如下代码，希望 `data.text` 值改变时，会自己执行 `effect函数` ， 那么`data 数据`就是`响应式的`。

```js
// 原始数据
const data = { text: 'hello world' }

function effect() {
  document.body.innerText = obj.text
}
effect()

```

## 4. 响应式数据最简单的实现

借助 `Proxy` ，
- 每次`读取`时，将 effect 函数存储到`桶：bucket` 中，
- 每次`set 时`，从`桶`中**取出并执行**

如下代码：

```js hl:20,11
// 存储副作用函数的桶
const bucket = new Set()

// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 effect 添加到存储副作用函数的桶中
    bucket.add(effect)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    bucket.forEach(fn => fn())
  }
})

function effect() {
  document.body.innerText = obj.text
}
effect()
```

但上面的方式缺点是`硬编码`了 `effect`

## 5. 解决硬编码 `effect` 函数的问题

思路是，`effect(fn)` 传入一个函数，标识注册副作用函数 `fn` 

- 并使用全局变量 `activeEffect` 来存储 `当前激活的 effect 函数`

```js hl:25,10
// 存储副作用函数的桶
const bucket = new Set()

// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    bucket.add(activeEffect)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    bucket.forEach(fn => fn())
  }
})


// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
  activeEffect = fn
  // 执行副作用函数
  fn()
}

effect(() => {
  console.log('effect run')
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text2 = 'hello vue3'
}, 1000)
```

但是，上面代码如果我们设置不存在的属性时，如 `obj.noExist = 'hello '` , `传入的effect` 中的 `fn` 会**执行两次**

所以，`副作用函数`需要与`目标字段` 建立映射，所以我们**需要重新设计数据结构**

## 6. 重新设计数据结构

**解决上面设置不存在的属性时也执行问题**，可以**重新设计数据结构**

如下代码：

```js
// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
function effect(fn) {
    // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
    activeEffect = fn
    // 执行副作用函数
    fn()
}

const obj = { text1: 'text1', text2: 'text2' };
const obj2 = { text1: 'text1', text2: 'text2' };

effect(function fn1() {
    console.log(obj.text1);
})

effect(function fn2() {
    console.log(obj.text2);
    console.log(obj.text1);
})

/*************************************************
 * :::: 以上代码的映射关系如下
 * obj
 *  text1: [fn1,fn2]
 *  text2: [fn2]
 ************************************************/

effect(function fn3() {
    console.log(obj.text1);
    console.log(obj.text2);
})
/*************************************************
 * :::: 以上代码的映射关系如下
 * obj
 *  text1: [fn3]
 *  text2: [fn3]
 ************************************************/

effect(function fn1() {
    console.log(obj.text1);
})

effect(function fn2() {
    console.log(obj2.text2);
    console.log(obj.text1);
})

/*************************************************
 * :::: 以上代码的映射关系如下
 * obj
 *   text1: [fn1,fn2] 
 * obj2
 *   text2: [fn2]
 ************************************************/
```

结构如下：

- `WeakMap`
	- `key` 为 `obj` 或者 `obj1` 对象
	- `value` 为 `Map`
		- `key` 为 字段名，如 `text1` ,`text2`
		- `value`为 `Set` ，比如上面的 `fn1` `fn2`

如下图：

![|736](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304081112785.png)

>  weakMap 的键只能是对象

### 6.1. 为什么要使用 WeakMap？

```js
const weakMap = new WeakMap();
const map = new Map();

(function () {
    let w = {w: "w"};
    let m = {m: "m"};
    weakMap.set(w, 1);
    map.set(m, 2);
    console.log(weakMap);
    console.log(map);
    w = null;
    m = null;
})()

// 这 5s的时间，weakMap 会被回收，而 map 不会，因为 map 的 key 是强引用，不会被回收
// chrome performance 手动触发垃圾回收
setTimeout(() => {
    console.log(weakMap);
    console.log(map);
}, 5000);
```

手动触发垃圾回收机制：

![|536](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304081153881.png)

最终打印打印结果如下：

![|464](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304081151462.png)

所以，结论就是：使用 `WeakMap` 能够保证 `GC`，不会像 `Map` 那个强引用导致`内存溢出`

### 6.2. 最终代码

**最终代码如下**：
- 并封装 `track(targe,key)` 和 `trigger(targe,key)`

```js
// 存储副作用函数的桶
const bucket = new WeakMap()
// 原始数据
const data = { text: 'hello world' }
// 对原始数据的代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key)
    // 返回属性值
    return target[key]
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal
    // 把副作用函数从桶里取出并执行
    trigger(target, key)
  }
})

function track(target, key) {
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}
// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
  activeEffect = fn
  // 执行副作用函数
  fn()
}

effect(() => {
  console.log('effect run')
  document.body.innerText = obj.text
})

setTimeout(() => {
  trigger(data, 'text')
}, 1000)
```

>[!tip]  
其实如何能够梳理清楚这个数据结构，那能那么容易写出代码，所以也**不用抠代码细节，推导的思想更有借鉴意义**，真正需要自己使用即可！

## 7. 分支切换问题

即使用**三元符号**时，如何避免不必要的执行？

如下代码：

```js
effect(() => {
  console.log('effect run')
  document.body.innerText = obj.ok ? obj.text : 'not'
})
```

根据上面，我们知道关系如下：

- obj
	- ok
	- fn
- text
	- fn

所以，当 `text` 值改变时，必然会导致 `fn` 重新执行 
- 但其实当`ok` 为 `false` 时，无论 `text` 如何变化，我们不希望 `fn` 重新执行。如何解决呢？

>  解决方案是 **每次副作用函数执行之前，清除上一次建立的关系**。

重新设计结构，`effect.deps` 用来存储 `所有与该副作用函数相关的依赖集合` ，如下代码：

```js
// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
    activeEffect = effectFn
    fn()
  }
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}

// 每次都会清除
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}
```

下面看 `trigger` 函数：

```js
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key);
  // here ，这里出现无限循环
  effects && effects.forEach(effectFn => effectFn())
}
```

但是，上面的代码会出现无限循环，原因类似于下面的代码：

```js
const set = new Set([1])
set.forEach(item => {
  set.delete(1)
  set.add(1)
  console.log(999)
})
```

![|560](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304081406196.png)

解决方案：**新的变量** `newSet`

```js
const set = new Set([1])
const newSet = new Set(set)
newSet.forEach(item => {
  set.delete(1)
  set.add(1)
  console.log(999)
})
```

所以最终 `trigger` 代码：创建`新的变量` `effectsToRun`

```js
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => effectsToRun.add(effectFn))
  effectsToRun.forEach(effectFn => effectFn())
  // effects && effects.forEach(effectFn => effectFn())
}
```

## 8. Effect 函数嵌套的场景

### 8.1. 先说说为什么要支持嵌套

因为 `jsx` 天然需要支持嵌套，如下代码：

```js
const Foo = {
    render() {
        return h('div', 'foo')
    }
}

const Bar = {
    render() {
        // 引用 Foo
        return h(Foo, 'bar')
    }
}
```

### 8.2. 现有 `effect` 函数不支持嵌套

如下代码：

```js hl:3
let temp1, temp2

// 嵌套 effect 里面还有 effect 函数
effect(function effectFn1() {
  console.log('1')
  effect(function effectFn2() {
    console.log('2')
    temp2 = obj.bar
  })
  temp1 = obj.foo
})

// obj.foo之前的值为 true
setTimeout(() => {
    obj.foo = false
}, 5000);
```

我们修改 `obj.foo` , 预期是：

- 输出 `1 2 1` , 因为 obj.foo 修改导致 `fn1` 的执行，打印 `1`，`fn2` 嵌套在 `fn1` 里，所以还会执行`fn2` 打印出 `2`，5s 后，值`obj.foo`改变了，导致 `fn1` 执行，打印出 `2`

但实际上是 `1 2 2`

原因是：发生嵌套时，内层激活的 `activeEffect` 会覆盖`外层的副作用函数`，所以最终执行的都是`内层副作用函数`

### 8.3. 解决思路：副作用函数栈 `efectStack`

如下代码：

```js
// 用一个全局变量存储当前激活的 effect 函数
let activeEffect
// effect 栈
const effectStack = []
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数复制给 activeEffect
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    fn()
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈
    // 并还原 activeEffect 为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}
```

## 9. 新的问题：无限递归循环

如下代码，会引起 `栈溢出`

```js
effect(() => {
    obj.foo++;
})
```

因为 `obj.foo 同时读取和设置` ，从而导致无限递归循环。

因为读取和操作是在同一个副作用函数中，进行的。所以可以增加`守卫条件`： **trigger 触发的副作用函数和当前执行的副作用函数，是一个函数，则不执行。**

```js hl:7,6
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    // 守卫条件
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => effectFn())
}
```

## 10. 响应式系统的调度（Scheduler）

所谓`调度`，即 `trigger` 重新触发副作用函数时，能够决定执行的`时机`，`次数`等`自定义行为`。

### 10.1. 例子 1 ：控制执行顺序

以下执行顺序是：`1 ，2 ，end...`

```js
const data = {foo: 1};
const obj = new Proxy(data, {});

effect(() => {
    console.log(obj.foo);
})

obj.foo++;
console.log('end...');
// ::::顺序是：1 ，2 ，end... 
```

如果我们希望顺序变成了：`1 ，end... ，2` 呢？？？

**解法方法是**：
- 给 `effect` 函数添加一个 `options` 参数
	- 即 给在批量执行副作用函数的地方，即 trigger 函数中，添加特定的判断，即调度逻辑，如下代码

```js hl:13,15
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
      // ::::新增代码::::
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}
```

修改上面例子代码如下：

> **options 的 scheduler 选项是一个函数**


```js hl:9
const data = {foo: 1};
const obj = new Proxy(data, {});

effect(
    () => {
        console.log(obj.foo);
    },
    {
        scheduler: (fn) => {
            setTimeout(fn, 0);
        }
    }
);

obj.foo++;
console.log('end...');

// ::::顺序就可以变成 1 ，end... ，2
```

### 10.2. 示例 2：合并操作

如下代码

```js
const data = {foo: 1};
const obj = new Proxy(data, {});

effect(
    () => {
        console.log(obj.foo);
    }
);

obj.foo++;
obj.foo++;
obj.foo++;
obj.foo++;

// ::::顺序： 1 2 3 4 5 
```

如果我只打印 `初始值` 和 `最终值`呢？

>  其实就有点类似于 **React 中的 setState 多次或者 Vue 中的连续改变响应式数据。**

#### 10.2.1. 微任务队列

所以，关键是 需要 **实现一个微任务队列，并去重，并且如何保证一个微任务队列里，只执行一次**，如下代码：

```js hl:12,4,1,22
// 任务队列，使用 Set 方便去重
const jobQueue = new Set()
// 标识是否正在刷新微任务队列，
// 如果正在刷新，则不再执行 flushJob，所以一个事件循环中只会执行一次 flushJob
let isFlushing = false
// 利用 promise ，保证 flushJob 在一个事件循环中只执行一次
function flushJob() {
  if (isFlushing) return
  isFlushing = true;
  // 将一个函数添加到微任务队列中
  Promise.resolve().then(() => {
    // 这个时候，取出来的 job 是已经去重过的了，所以不会重复执行了
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}

effect(() => {
  console.log(obj.foo)
}, {
  // 使用 scheduler 选项，去重任务后，再刷新执行微任务队列的函数
  scheduler(fn) {
    // 使用 Set 来去重
    jobQueue.add(fn);
    // 刷新微任务队列
    flushJob()
  }
})
```

### 10.3. 更多参考后文

> [9. Vue3 中 effect 的调度选项（scheduler）使用示例](/rxDoX9)

## 11. 计算属性 `computed` 实现原理与 `lazy`

### 11.1. 懒执行

以下代码是`立即执行`的，如何实现代码 `lazy 执行` 呢？如下代码：

```js
const data = {foo: 1};
const obj = new Proxy(data, {});
effect(
    () => {
        console.log(obj.foo); // ::::立即执行
    }
);
```

添加 `options.lazy = true`, 使得 `effect` 不会立即执行 ? 如下代码：

```js
effect(
    () => {
        console.log(obj.foo); // ::::不立即执行
    },
    // ::::options.lazy = true 时不立即执行
    {lazy: true}
);
```

改造 `effect函数` 代码如下：

![|496](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091113904.png)

> **延迟执行，往往都是返回一个函数，这和柯里化函数很像**

但是，上面的代码，仅仅能够`手动执行` ，如下代码：

![|360](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091118724.png)

如果 `fn` 为 `getter函数`呢？ 如下：

![|512](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091121697.png)

上面代码能否再抽象成 `computed` ? 这就引出了 `computed`

### 11.2. `computed` 计算属性 → **只有读取时，才会计算**

- 计算属性的 `懒计算`，即 `只有读取时，才会计算`
- 多次读取一个属性时，还需要做到 `缓存`，避免`多次计算`
	- 通过脏变量 `dirty`来标识，**类似于 Angular 的概念**。
- 如果`计算属性发生变化会重新触发渲染` ， 但是如果一个计算属性依赖另外一个计算属性时，会发生 `effect 嵌套`
	- 所以，每次读取计算属性时，需要`手动触发 trigger 追踪` 

![|576](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091154769.png)

所以，上面的代码会建立响应联动关系如下：

- `computed(obj)`
	- `value`
		- `effectFn`

即，你就把 `对于computed嵌套，当做是两个副作用函数的嵌套来理解`，就对了！

> [!info]  
真正还是需要看代码去，说真的，自己手写实现完整的功能，得实现多久啊！！，这就是业务代码和真正技术代码的区别吧！

>[!tip]  
所以，**这里基本思路掌握即可，不用装牛角尖**，也不可能让你段时间内徒手写出来，需要的话就去自己看代码。

### 11.3. 为什么使用 computed 时，具体值都需要使用`.value`来包装

仔细看上面的截图代码的第 2 行，就知道了

## 12. `watch函数` 的实现原理

### 12.1. 简单实现

通过前面我们知道，副作用函数重新执行时，`可调度` ，所以 我们把调度里，加个`回调`，就能实现，如下代码：

![|576](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091223151.png)

上面代码硬编码了 `source.foo` 的读取操作，更通用的解法：`递归读取对象的所有属性`

### 12.2. 相对完善的实现

就想想如何使用 `watch` 函数的？ 所以，需要支持一下功能：

- watch 入参支持`三个`，想想是 哪三个？
	- `第一个`参数 支持 `getter 函数` 和 `对象`
	- `第二个`参数，回调函数里支持 `newVal` 和 `oldVal`
	- `第三个`自定义参数 `options`

下面是 `watch 函数`的代码  

![|840](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091242677.png)

> [!tip]  
注意，上面代码**高亮的部分** ，另外 `flush` 的值 `pre` 和 `post` 代表**组件更新前和更新后**，后面会涉及到具体原理，这里不深究。

### 12.3. 回调的第三个参数？

```typescript hl:4
type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

```

先看一个例子，如果 `watch` 一个 `obj 对象`，改变了就发请求，如下：

![|696](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091258200.png)

所以，会存在`过期的副作用函数`，`第三个参数`就是解决这种`竞态问题`的 ，以下是代码实现：

![|576](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091303363.png)

注意上面代码的 **高亮部分**

下面是 **使用实例**：

![|568](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091304118.png)

所以，最终的效果如下：

![|560](https://od-1310531898.cos.ap-beijing.myqcloud.com/202304091306983.png)

## 13. 最后

>[!warning]  
强调下，这一章很难啃的，但层层递进的思想比代码本身更重要，具体如何实现，代码最终如何编写实现，远远没有理解来龙去脉重要。**最终代码都有，多些思考与理解，装牛角尖意义不大**

## 14. 参考

- 《Vue.js设计与实现》
- [https://github.com/HcySunYang/code-for-vue-3-book](https://github.com/HcySunYang/code-for-vue-3-book)
