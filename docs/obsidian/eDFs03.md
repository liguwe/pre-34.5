# JavaScript 的核心语法

`#javascript` 

## 1. 现代模式，"use strict"

### 1.1. 原因

ES5 规范增加了新的语言特性并且修改了一些已经存在的特性。为了保证旧的功能能够使用，大部分的修改是默认不生效的。

你需要一个特殊的指令 —— `"use strict"` 来明确地激活这些特性。

### 1.2. 语法

```javascript
"use strict"; // 必须放到开头

// 代码以现代模式工作
...
```

- 现代 JavaScript 支持 “class” 和 “module”，如果使用它们，无需添加 `"use strict"`

## 2. 原始类型 + 1 种复杂数据类型			

- 原始类型：
	- Undefined、Null、Boolean、Number、String 和 Symbol  
- 复杂类型：
	- Object

## 3. 变量、作用域与内存

### 3.1. 复制

#### 3.1.1. 原始类型

![image.png|712](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/e3768b3af18a23c8cdeccb85e280c323.png)

#### 3.1.2. 引用类型

![image.png|672](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/bb555ee9faabf851d1d0d40946117804.png)

### 3.2. let、var、const 申明选择建议

1. 不使用 var
2. const 优先，let 次之

> `var`就不解释了，`const` 声明可以让浏览器运行时强制保持变量不变，也可以让静态代码分析工具提前发现不合法的赋值操作

## 4. 其他的不展开了
