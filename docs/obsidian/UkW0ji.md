# Python 类

`#python`  

## 1. 定义类、访问属性、调用方法

```python

# 创建类
# class 类名:
    # 类体
    # 类体中可以定义变量和函数
    # 类体中的函数第一个参数必须是self
    # self代表类的实例对象
    # 类体中的函数第一个参数必须是self

# example 创建 Person 类
class Person:
    # 类体
    def __init__(self, name, age):
        self.name = name
        self.age = age
    # 方法 1
    def say_hi(self):
        print('Hello, how are you?')
    # 方法 2
    def say_name(self):
        print(f'Hello, my name is {self.name}')
    # 方法 3
    def say_age(self):
        print(f'Hello, my age is {self.age}')

person = Person('Alice', 25)
# 访问属性
print(person.name)
print(person.age)
# 调用方法
person.say_hi()
person.say_name()
person.say_age()

```

## 2. 继承

```python
########################################################
##### 继承
########################################################

class Animal:
    def __init__(self, name, age):
        print("Animal")

    def eat(self):
        print("eat")

    def drink(self):
        print("drink")

# 传入父类参数

class Dog(Animal):

    def __init__(self, name, age):
        # 调用父类的构造函数
        super().__init__(name, age)
        print("Dog")

    def bark(self):
        print("bark")

    def eat(self):
        print("Dog eat")

```

## 3. 导出类模块
```python
########################################################
##### 导出类模块
########################################################

# car.py
class Animal:
    def __init__(self, name, age):
        print("Animal")

    def eat(self):
        print("eat")

    def drink(self):
        print("drink")

class Dog(Animal):

    def __init__(self, name, age):
        # 调用父类的构造函数
        super().__init__(name, age)
        print("Dog")

    def bark(self):
        print("bark")

    def eat(self):
        print("Dog eat")

# 导入类模块
from animal import Animal, Dog

# 导入整个模块
import animal

# 导出所有类
import animal import *

```

## 4. 代码风格

**
- 类使用大驼峰
- 函数使用_分割
