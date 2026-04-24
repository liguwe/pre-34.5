# Array.reduce

## 46. `reduce` 方法及其常见的使用场景

### 46.1. reduce 方法基本语法

```javascript
array.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

- `callback`: 执行数组中每个值的函数，包含四个参数：
	- `accumulator`: 累加器，**累加回调的返回值**
	- `currentValue`: 数组中**正在处理的元素**
	- `index`（可选）: 数组中正在处理的当前元素的**索引**
	- `array`（可选）: 调用 `reduce()` 的数组
- `initialValue`（可选）: 作为第一次调用 `callback` 函数时的第一个参数的值
	- **注意：如果不传时，调用空数组会报错**

>  `accumulator` 是返回值，函数需要显式返回该值才行
 

### 46.2. 使用场景

#### 46.2.1. 数组求和

```javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 输出: 15
```

#### 46.2.2. 数组中最大值

```javascript
const numbers = [5, 2, 8, 1, 9];
const max = numbers.reduce((acc, cur) => Math.max(acc, cur));
console.log(max); // 输出: 9
```

>  有点麻烦，直接 `Math.max(...numbers)` 即可

#### 46.2.3. 数组扁平化

```javascript
const nestedArray = [[1, 2], [3, 4], [5, 6]];
const flatArray = nestedArray.reduce((acc, cur) => acc.concat(cur), []);
console.log(flatArray); // 输出: [1, 2, 3, 4, 5, 6]
```

#### 46.2.4. 计算数组中元素出现的次数

```javascript
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
}, {});
console.log(count); // 输出: { apple: 3, banana: 2, orange: 1 }
```

#### 46.2.5. 按条件分组

```javascript
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 25 },
    { name: 'David', age: 30 }
];

const groupedByAge = people.reduce((acc, person) => {
    (acc[person.age] = acc[person.age] || []).push(person);
    return acc;
}, {});

console.log(groupedByAge);
// 输出: { 
//   25: [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   30: [{ name: 'Bob', age: 30 }, { name: 'David', age: 30 }]
// }
```

#### 46.2.6. 串联 Promise

>  这个也能够保证串行，也可以使用 **async / await 等方法**

```javascript
const asyncTasks = [
    () => new Promise(resolve => setTimeout(() => resolve('Task 1'), 1000)),
    () => new Promise(resolve => setTimeout(() => resolve('Task 2'), 500)),
    () => new Promise(resolve => setTimeout(() => resolve('Task 3'), 800))
];

asyncTasks.reduce((acc, task) => 
    acc.then(results => 
        task().then(result => [...results, result])
    ), 
    Promise.resolve([])
).then(console.log);
// 输出: ['Task 1', 'Task 2', 'Task 3']
```

#### 46.2.7. 实现 pipe 或 compose 函数

>  管道 pipe，本质还是函数式编程

```javascript
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const addOne = (x) => x + 1;
const double = (x) => x * 2;
const square = (x) => x * x;

const compute = pipe(addOne, double, square);
console.log(compute(3)); // 输出: 64 ((3 + 1) * 2)^2
```

>  说实话，我很讨厌这种写法：`(...fns) => (x) => fns.reduce((v, f) => f(v), x);` 炫技，代码最终还是写给人看的，换个行就会好多了，谢谢！

#### 46.2.8. 提取对象中的特定字段

```javascript
const users = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Charlie', age: 35 }
];

const names = users.reduce((acc, user) => [...acc, user.name], []);
console.log(names); // 输出: ['Alice', 'Bob', 'Charlie']
```
