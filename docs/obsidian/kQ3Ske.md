# Python 函数与模块

`#python` 

## 1. 函数的定义和调用

```python
############################################
####### 函数的定义和调用 ####################
###########################################

# 函数的定义
# def 函数名(参数列表):
    # 函数体

# 定义
def my_print():
    print("hello world")

# 函数的调用
my_print()

def my_print2(name):
    print("hello", name)

my_print2("world")
my_print2(name="world")

```

## 2. 函数的参数默认值

```python
############################################
####### 函数的参数默认值 ####################
###########################################

# 默认值: 如果调用函数时没有传入参数，那么就会使用默认值
# 如果第一个参数有默认值，那么后面的参数也必须有默认值
def my_print3(name = "liguwe", age = 18):
    print("hello", name, age)

# 默认值
# 如果调用函数时没有传入参数，那么就会使用默认值
def my_print4(name, age = 18):
    print("hello", name, age)
```


## 3. 函数的返回值


```python
############################################
####### 函数的返回值 ####################
###########################################

def get_fromatted_name(first_name, last_name):
    full_name = first_name + " " + last_name
    return full_name.title()

name = get_fromatted_name("li", "guangwei") # Li Guangwei

# 返回字典
def build_person(first_name, last_name, age=None):
    person = {
        "first": first_name,
        "last": last_name
    }
    if age:
        person["age"] = age
    return person

```


## 4. 传递列表参数

```python
############################################
####### 传递列表 ####################
###########################################

# 传递列表
def greet_users(names):
    for name in names:
        name = name + "!"
        msg = "hello, " + name
        print(msg)

usernames = ["li", "guangwei", "zhang", "san"]

# output: hello, li! hello, guangwei! hello, zhang! hello, san!
greet_users(usernames)

# 传递列表,避免修改原列表
usernames2 = ["li", "guangwei", "zhang", "san"]
greet_users(usernames2[:])
```

## 5. 传递任意数量的实参

```python
############################################
####### 传递任意数量的实参 ####################
###########################################

# 传递任意数量的实参
# *args: 会创建一个元组
# **kwargs: 会创建一个字典

def make_pizza(*toppings):
    print(toppings)

# ('pepperoni',)
make_pizza("pepperoni");
# ('mushrooms', 'green peppers', 'extra cheese')
make_pizza("mushrooms", "green peppers", "extra cheese");

# 结合使用【位置实参】和【任意数量实参】
def make_pizza1(size,*toppings):
    print(size)
    print(toppings)

make_pizza1(12, "pepperoni");
make_pizza1(16, "mushrooms", "green peppers", "extra cheese");
```


## 6. 模块

```python
############################################
####### 导入模块 ####################
###########################################

# 导入模块
# import module_name

# 导入模块，并指定别名
# import module_name as mn

# # 导入模块中的某个函数
# from module_name import function_name

# 导入模块中的函数，并指定别名
# from module_name import function_name as fn

# 导出模块中的所有函数
# from module_name import *

# 导入模块中的特定函数
# from module_name import function_0, function_1, function_2

```
