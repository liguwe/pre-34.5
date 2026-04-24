# Python 文件与异常处理

`#python` 


## 1. 使用 pathlib 读取文件内容

```python
# pathlib 模块: 用于处理文件路径
from pathlib import Path

path = Path("main.py")

# 读取 main.py 文件的内容
content = path.read_text()

print(content)

```

## 2. 写入文件

```python
# pathlib 模块: 用于处理文件路径
from pathlib import Path

path = Path("programing.txt")

path.write_text("Hello, world!")

```


## 3. 使用 try-except 避免报错

### 3.1. ZeroDivisionError

```python
try:
    print(1/0)
except ZeroDivisionError as e:
    print(e)
    print('error')

```

### 3.2. FileNotFoundError

```python
from pathlib import Path

path = Path("no_exist.txt")

try:
    content = path.read_text()
except FileNotFoundError:
    print("File not found")

```


### 3.3. 静默失败

```python
# 静默失败
# 通过捕获异常，使得程序不会因为异常而终止
# example
def divide(x, y):
    try:
        result = x / y
    except ZeroDivisionError:
        print("division by zero!")
        pass # 静默失败
    else:
        print("result is", result)
    finally:
        print("executing finally clause")
```

### 3.4. json.dumps：将 Python 对象编码成 JSON 字符串

```python
from pathlib import Path
import json

numbers = [1, 2, 3, 4, 5]

path = Path("numbers.json")

# json.dumps() 方法将 Python 对象编码成 JSON 字符串
contents = json.dumps(numbers)

# 将 JSON 字符串写入文件
path.write_text(contents)

```

### 3.5. json.loads：JSON 字符串转换为 Python 对象

```python
from pathlib import Path
import json

path = Path("numbers.json")

content =  path.read_text()

# 使用 json.loads() 函数将 JSON 字符串转换为 Python 对象
contents = json.loads(content)

print(contents)

```
