# 面向前端的 python 指南 02：读取训练文本文件内容

`#python` 

## 📝 功能说明

这个脚本负责读取已下载的《The Verdict》文本文件，并返回完整的文本字符串供后续分词使用。

```python
"""  
步骤 2: 读取 the-verdict.txt 文件  
功能: 读取文件内容并返回文本字符串  
"""  
  
import os  
  
  
def read_file():  
    """读取 the-verdict.txt 文件内容"""  
  
    # 获取当前脚本所在目录  
    curr_dir = os.path.dirname(os.path.abspath(__file__))  
    file_path = os.path.join(curr_dir, "the-verdict.txt")  
  
    # 检查文件是否存在  
    if not os.path.exists(file_path):  
        raise FileNotFoundError(  
            f"文件不存在: {file_path}\n"  
            f"请先运行 01_generate_file.py 生成文件"  
        )  
  
    print(f"正在读取文件: {file_path}")  
  
    # 读取文件内容  
    with open(file_path, "r", encoding="utf-8") as f:  
        raw_text = f.read()  
  
    print(f"✓ 文件读取成功！")  
    print(f"  文件大小: {len(raw_text)} 字符")  
    print(f"  内容预览 (前 200 字符):\n{raw_text[:200]}")  
  
    return raw_text  
  
  
if __name__ == "__main__":  
    print("=" * 60)  
    print("步骤 2: 读取文件")  
    print("=" * 60)  
  
    raw_text = read_file()  
  
    print("\n" + "=" * 60)  
    print("步骤 2 完成！")  
    print("=" * 60)
```

---

## 🔍 核心概念

### 1. 自定义异常

#### Python 实现

`raise` → `new Error`

```python
if not os.path.exists(file_path):
    raise FileNotFoundError(
        f"文件不存在: {file_path}\n"
        f"请先运行 01_generate_file.py 生成文件"
    )
```

#### JavaScript 等价实现

```javascript
// Node.js
const fs = require('fs');
const path = require('path');

if (!fs.existsSync(filePath)) {
  const error = new Error(
    `文件不存在: ${filePath}\n` +
    `请先运行 generate_file.js 生成文件`
  );
  error.code = 'ENOENT';  // 文件不存在错误码
  throw error;
}
```

**Python 内置异常类型：**

```python
# 文件相关
FileNotFoundError    # 文件不存在
FileExistsError      # 文件已存在（创建时）
PermissionError      # 权限不足
IsADirectoryError    # 路径是目录而非文件

# 其他常见异常
ValueError           # 值错误
TypeError            # 类型错误
KeyError             # 字典键不存在
IndexError           # 列表索引越界
AttributeError       # 对象属性不存在
```

**最佳实践：抛出具体异常**

```python
# ✅ 推荐：抛出具体异常
def read_file(path: str) -> str:
    if not os.path.exists(path):
        raise FileNotFoundError(f"文件不存在: {path}")
    # ...

# ❌ 不推荐：抛出通用异常
def read_file(path: str) -> str:
    if not os.path.exists(path):
        raise Exception(f"文件不存在: {path}")
    # ...
```

---

### 2. 多行 f-string

#### Python 实现

```python
error_msg = (
    f"文件不存在: {file_path}\n"
    f"请先运行 01_generate_file.py 生成文件"
)
```

#### JavaScript 等价实现

```javascript
// 模板字符串（支持多行）
const errorMsg = `文件不存在: ${filePath}
请先运行 generate_file.js 生成文件`;

// 或使用字符串拼接
const errorMsg =
  "文件不存在: " + filePath + "\n" +
  "请先运行 generate_file.js 生成文件";
```

**Python 多行字符串的三种方式：**

```python hl:1
# 方式 1: 三引号（保留换行符）
text1 = """
第一行
第二行
第三行
"""

# 方式 2: 括号 + f-string（不保留换行符）
text2 = (
    f"第一行 {variable}\n"
    f"第二行 {variable}\n"
    f"第三行 {variable}"
)

# 方式 3: 反斜杠（不推荐，容易出错）
text3 = "第一行\n"\
        "第二行\n"\
        "第三行"
```

**对比：**
- 方式 1：适合大段文本（如 HTML、SQL）
- 方式 2：适合格式化输出（推荐）
- 方式 3：不推荐，容易在末尾多加空格

---

### 3. 字符串切片（Slicing）

#### Python 实现

```python
print(raw_text[:200])  # 前 200 个字符
```

#### JavaScript 等价实现

```javascript
console.log(text.substring(0, 200));  // 前 200 个字符
// 或
console.log(text.slice(0, 200));
```

**Python 切片语法：**

- 步长 `text[::step]`
- 反转 `text[::-1]`

```python hl:15,16
text = "Hello, World!"

# 基本切片 [start:end:step]
text[0:5]    # "Hello" (从索引 0 到 4，不包含 5)
text[7:12]   # "World"
text[:5]     # "Hello" (从头开始)
text[7:]     # "World!" (到末尾)

# 负数索引（从末尾计数）
text[-6:]    # "World!"
text[-6:-1]  # "World"
text[:-1]    # "Hello, World" (去掉最后一个字符)

# 步长
text[::2]    # "Hlo ol!" (每隔一个字符)
text[::-1]   # "!dlroW ,olleH" (反转字符串)

# 对比 JavaScript
text.slice(0, 5)      # "Hello"
text.slice(-6)        // "World!"
text.split('').reverse().join('')  // "!dlroW ,olleH"
```

**切片 vs JavaScript 方法：**

| Python | JavaScript | 说明 |
|--------|-----------|------|
| `text[:5]` | `text.slice(0, 5)` | 前 5 个字符 |
| `text[-5:]` | `text.slice(-5)` | 后 5 个字符 |
| `text[::2]` | 需手动实现 | 每隔一个字符 |
| `text[::-1]` | `text.split('').reverse().join('')` | 反转 |

**Python 切片的强大之处：**

> [!danger]  
>  `rfind` 从字符串的右侧开始查找，返回最后出现的位置  
>  `rfind` 类比 JavaScript `lastIndexOf` ，`find` 类比 `indexOf`

```python hl:7
# 提取文件扩展名
filename = "document.pdf"
extension = filename[filename.rfind('.'):]  # ".pdf"

# 提取路径的目录
path = "/home/user/documents/file.txt"
# `filename.rfind('.')` 会在字符串 `"document.pdf"` 中从右侧查找 `.`，并返回其最后出现的位置
directory = path[:path.rfind('/')]  # "/home/user/documents"

# 去除字符串两端
text = "  Hello, World!  "
trimmed = text[2:-2]  # "Hello, World!"（不推荐，应用 .strip()）
```

### 4. len() 函数

#### Python 实现

```python
len(raw_text)  # 字符数
```

#### JavaScript 等价实现

```javascript
text.length  // 字符数
```

**`len()` 的多态性：**

```python hl:18
# 字符串
len("Hello")        # 5

# 列表
len([1, 2, 3, 4])   # 4

# 字典
len({"a": 1, "b": 2})  # 2

# 集合
len({1, 2, 3})       # 3

# 元组
len((1, 2, 3))       # 3

# 自定义对象（实现 __len__ 方法）
class MyCollection:
    def __len__(self):
        return 100

len(MyCollection())  # 100
```

**注意：**
- Python: `len()` 是`内置`函数
- JavaScript: `.length` 是属性

---

### 5. 函数返回值

#### Python 实现

```python
def read_file() -> str:  # 类型提示：返回字符串
    """读取文件并返回内容"""
    with open(file_path, "r", encoding="utf-8") as f:
        raw_text = f.read()
    return raw_text  # 返回字符串
```

#### JavaScript 等价实现

```javascript
// Node.js
async function readFile() {  // async 因为文件操作是异步的
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return content;
}

// CommonJS
function readFile(callback) {
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) return callback(err);
    callback(null, content);
  });
}
```

**关键区别：**
- Python: 文件读取是**同步**的（阻塞）
- JavaScript: 文件读取是**异步**的（非阻塞）

**Python 异步文件操作：**

异步 `asyncio`

```python hl:1,5,15
# 同步（阻塞）
with open(file_path, "r") as f:
    content = f.read()  # 程序在这里等待，直到读完

# 异步（非阻塞）- 使用 asyncio
import asyncio

async def read_file_async(path: str) -> str:
    loop = asyncio.get_event_loop()
    with open(path, "r") as f:
        content = await loop.run_in_executor(None, f.read)
    return content

# 使用 aiofiles（推荐）
import aiofiles

async def read_file_async(path: str) -> str:
    async with aiofiles.open(path, "r") as f:
        content = await f.read()
    return content
```

---

### 6. 类型提示（Type Hints）

#### Python 实现

`->` 

```python hl:1
def read_file() -> str:
    """读取文件并返回内容"""
    # ...
    return raw_text
```

#### JavaScript/TypeScript 等价实现

```typescript
// TypeScript
function readFile(): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

// 或者返回 Promise
async function readFile(): Promise<string> {
  const content = await fs.promises.readFile(filePath, 'utf-8');
  return content;
}
```

**Python 类型提示示例：**

```python hl:1
from typing import List, Dict, Optional, Tuple

# 基本类型
def greet(name: str) -> str:
    return f"Hello, {name}"

# 可选类型
def find_user(user_id: int) -> Optional[str]:
    # 返回字符串或 None
    if user_id == 1:
        return "Alice"
    return None

# 列表类型
def get_numbers() -> List[int]:
    return [1, 2, 3, 4, 5]

# 字典类型
def get_config() -> Dict[str, int]:
    return {"timeout": 30, "retries": 3}

# 元组类型
def get_coords() -> Tuple[float, float]:
    return (12.5, 45.3)

# 联合类型
def process(value: int | str) -> str:
    return str(value)
```

**为什么使用类型提示？**

```python
# ✅ 有类型提示 - IDE 能提供智能提示
def calculate_area(width: float, height: float) -> float:
    return width * height

area = calculate_area(10.5, 20.3)
# IDE 知道 area 是 float，能提示可用的方法

# ❌ 无类型提示 - IDE 无法推断
def calculate_area(width, height):
    return width * height
```

**检查类型（使用 mypy）：**

```bash hl:1
# 安装 mypy
pip install mypy

# 检查文件
mypy read_file.py
```

---

## 🎯 Python 最佳实践

### 1. 资源管理（with 语句）

```python hl:6,1
# ✅ 推荐：使用 with 语句
def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# ❌ 不推荐：手动管理文件句柄
def read_file(path: str) -> str:
    f = open(path, "r", encoding="utf-8")
    content = f.read()
    f.close()  # 如果 read() 抛出异常，这行不会执行
    return content
```

### 2. 编码规范

```python
# ✅ 推荐：明确指定编码
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# ⚠️ 谨慎使用：依赖系统默认编码
with open(path, "r") as f:
    content = f.read()
    # Windows 可能用 GBK，Linux/Mac 用 UTF-8
    # 可能导致编码错误
```

**常见编码：**
- `utf-8` - 通用标准（推荐）
- `utf-8-sig` - UTF-8 with BOM（处理 Excel 导出的 CSV）
- `gbk` - 中文 Windows 默认
- `latin-1` - ISO-8859-1（西欧语言）

### 3. 错误处理

`try-except-raise`

```python hl:1,13
# ✅ 推荐：捕获具体异常
def read_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        raise FileNotFoundError(f"文件不存在: {path}")
    except UnicodeDecodeError:
        raise ValueError(f"文件编码错误，请确认是 UTF-8: {path}")
    except PermissionError:
        raise PermissionError(f"没有读取权限: {path}")

# ❌ 不推荐：捕获所有异常
def read_file(path: str) -> str:
    try:
        with open(path, "r") as f:
            return f.read()
    except Exception:  # 捕获所有异常，包括 KeyboardInterrupt
        return ""
```

### 4. 函数设计原则

```python hl:1,12
# ✅ 做好一件事（Single Responsibility）
def read_file(path: str) -> str:
    """只负责读取文件"""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def print_preview(content: str, length: int = 200) -> None:
    """只负责打印预览"""
    print(f"内容预览 (前 {length} 字符):")
    print(content[:length])

# ❌ 做多件事（违反 SRP）
def read_and_print(path: str) -> str:
    """既读取又打印，职责不清"""
    with open(path, "r") as f:
        content = f.read()
    print(f"内容预览: {content[:200]}")
    return content
```

### 5. 使用 pathlib（现代替代方案）

```python hl:1
# Python 3.4+ 推荐使用 pathlib
from pathlib import Path

def read_file() -> str:
    """使用 pathlib 读取文件"""

    # 获取文件路径
    file_path = Path(__file__).parent / "the-verdict.txt"

    # 检查存在
    if not file_path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    # 读取文本
    content = file_path.read_text(encoding="utf-8")

    # 字符数
    char_count = len(content)

    # 预览
    preview = content[:200]

    return content
```

**`pathlib` vs `os.path`：**

| 操作    | os.path                   | pathlib             |
| ----- | ------------------------- | ------------------- |
| 拼接路径  | `os.path.join(a, b)`      | `a / b`             |
| 获取目录  | `os.path.dirname(path)`   | `path.parent`       |
| 获取文件名 | `os.path.basename(path)`  | `path.name`         |
| 检查存在  | `os.path.exists(path)`    | `path.exists()`     |
| 读取文件  | `open(path).read()`       | `path.read_text()`  |
| 写入文件  | `open(path, 'w').write()` | `path.write_text()` |

## 📚 深入理解：文件读取模式

### Python 文件打开模式详解

```python
# 文本模式
"r"   # 只读（默认）
"w"   # 只写（覆盖已存在文件）
"a"   # 追加（在文件末尾写入）
"r+"  # 读写（文件必须存在）
"w+"  # 读写（创建新文件或覆盖）
"a+"  # 读写（追加模式）

# 二进制模式
"rb"  # 只读二进制
"wb"  # 只写二进制
"ab"  # 追加二进制
"rb+" # 读写二进制
"wb+" # 读写二进制（创建或覆盖）
"ab+" # 读写二进制（追加）
```

**示例对比：**

```python hl:7
# 文本模式 - 自动处理换行符
with open("file.txt", "w") as f:
    f.write("Line 1\nLine 2\n")
# Windows 会将 \n 转换为 \r\n

# 二进制模式 - 原始写入
with open("file.bin", "wb") as f:
    f.write(b"Line 1\nLine 2\n")
# 保持原始 \n，不转换
```

**文件对象的方法：**

```python
with open("file.txt", "r") as f:
    # 读取全部
    content = f.read()

    # 读取指定字符数
    first_100 = f.read(100)

    # 读取一行
    line = f.readline()

    # 读取所有行（返回列表）
    lines = f.readlines()

    # 逐行迭代（内存高效）
    for line in f:
        print(line.strip())

# 写入
with open("file.txt", "w") as f:
    f.write("Hello\n")

    # 写入多行
    lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
    f.writelines(lines)
```

---

## 🔄 JavaScript vs Python 完整对比

### 文件读取完整示例

#### Python（同步）

```python
def read_file(path: str) -> str:
    """同步读取文件"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"文件不存在: {path}")

    with open(path, "r", encoding="utf-8") as f:
        return f.read()

# 使用
content = read_file("file.txt")
print(content[:100])
```

#### JavaScript（异步）

```javascript
// Node.js (async/await)
async function readFile(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`文件不存在: ${path}`);
  }

  const content = await fs.promises.readFile(path, 'utf-8');
  return content;
}

// 使用
const content = await readFile("file.txt");
console.log(content.substring(0, 100));
```

**关键区别：**

| 特性 | Python | JavaScript (Node.js) |
|------|--------|---------------------|
| 默认模型 | 同步（阻塞） | 异步（非阻塞） |
| 文件读取 | `open()` + `f.read()` | `fs.readFile()` |
| 路径操作 | `os.path` / `pathlib` | `path` 模块 |
| 错误处理 | `try...except` | `try...catch` |
| 类型提示 | 可选（运行时不检查） | TypeScript（编译时检查） |
| 当前文件 | `__file__` | `__filename` / `import.meta.url` |

---

## 🚀 实战练习

### 练习 1：读取大文件（内存高效）

```python
def read_large_file(path: str) -> None:
    """逐行读取大文件，避免内存溢出"""
    line_count = 0

    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line_count += 1
            # 处理每一行
            print(f"Line {line_count}: {line.strip()[:50]}")

    print(f"总行数: {line_count}")
```

### 练习 2：读取二进制文件

```python
def read_image(path: str) -> bytes:
    """读取图片等二进制文件"""
    with open(path, "rb") as f:
        return f.read()

# 获取文件大小
image_data = read_image("photo.jpg")
print(f"文件大小: {len(image_data)} 字节")
```

### 练习 3：带进度提示的读取

```python
def read_with_progress(path: str) -> str:
    """显示读取进度"""
    file_size = os.path.getsize(path)

    with open(path, "r", encoding="utf-8") as f:
        content = []
        chunk_size = 1024 * 1024  # 1MB

        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break

            content.append(chunk)
            progress = len(''.join(content)) / file_size * 100
            print(f"\r读取进度: {progress:.1f}%", end="")

        print()  # 换行
        return ''.join(content)
```

---

## 📚 总结

**关键要点：**

1. ✅ **使用 `with` 语句** - 自动管理资源
2. ✅ **指定编码** - 避免 Unicode 问题
3. ✅ **抛出具体异常** - 便于调试和处理
4. ✅ **使用类型提示** - 提高代码可读性
5. ✅ **考虑 pathlib** - 更现代的路径操作

**Python vs JavaScript：**
- Python: 同步 I/O（简单直接）
- JavaScript: 异步 I/O（高并发）
