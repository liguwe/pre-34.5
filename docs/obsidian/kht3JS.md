# 面向前端的 python 指南 05： 实现分词器类（Tokenizer Class）

`#2026/01/04` `#python` 

## 📝 功能说明

创建可复用的 `SimpleTokenizerV1` 类，提供 `encode()`（文本→ID）和 `decode()`（ID→文本）方法。

```python
"""
步骤 5: 实现分词器类 (Tokenizer Class)
功能: 创建可复用的分词器类，支持编码和解码
"""

import re
from typing import List, Dict

class SimpleTokenizerV1:
    """
    简单分词器 V1 版本
    - 基于预定义的词汇表（vocab）进行编码和解码
    - 使用正则表达式进行文本预处理和分词
    """

    def __init__(self, vocab: Dict[str, int]):
        """
        初始化分词器

        参数:
            vocab (dict): 词汇表字典，格式为 {token_string: token_id}
                         例如: {"hello": 0, "world": 1, ",": 2}

        属性:
            self.str_to_int: 字符串到整数的映射（编码用）
            self.int_to_str: 整数到字符串的映射（解码用）
        """
        # 保存原始词汇表：字符串 -> 整数 ID
        self.str_to_int = vocab

        # 创建反向映射：整数 ID -> 字符串
        # 使用字典推导式，将 vocab 的键值对反转
        # 例如: {"hello": 0, "world": 1} -> {0: "hello", 1: "world"}
        self.int_to_str = {i: s for s, i in vocab.items()}

        print(f"✓ 分词器初始化完成")
        print(f"  词汇表大小: {len(vocab)}")

    def encode(self, text: str) -> List[int]:
        """
        编码方法：将文本转换为整数 ID 序列

        参数:
            text (str): 待编码的文本字符串

        返回:
            list[int]: 整数 ID 列表

        处理流程:
            1. 使用正则表达式分割文本
            2. 去除空白项
            3. 将每个 token 映射为对应的整数 ID
        """
        # 使用正则表达式分割文本
        # 模式说明:
        # - r'(...)': 原始字符串 + 捕获组，保留分隔符
        # - [,.:;?_!"()\']:  匹配常见标点符号
        # - |--:            匹配双连字符
        # - |\s:            匹配任意空白字符（空格、制表符、换行符等）
        preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', text)

        # 清理分词结果：
        # - item.strip(): 去除每个 token 两端的空白字符
        # - if item.strip(): 过滤掉空字符串（只包含空白的项）
        # 使用列表推导式简洁地完成过滤和清理
        preprocessed = [
            item.strip() for item in preprocessed if item.strip()
        ]

        # 将清理后的 token 转换为词汇表中的整数 ID
        # 如果 token 不在词汇表中，这里会报 KeyError (V1 版本暂不处理未知单词)
        ids = [self.str_to_int[token] for token in preprocessed]
        return ids

    def decode(self, ids: List[int]) -> str:
        """
        解码方法：将整数 ID 序列还原为文本

        参数:
            ids (list[int]): 整数 ID 列表

        返回:
            str: 解码后的文本字符串

        处理流程:
            4. 将每个整数 ID 映射回对应的字符串 token
            5. 用空格连接所有 token
            6. 使用正则表达式去除标点符号前的多余空格
        """
        # 将整数 ID 列表转换为字符串列表，然后用空格连接
        # 例如: [0, 1, 2] -> ["hello", "world", ","] -> "hello world ,"
        # 对比 JavaScript → ["hello", "world", ","].join(" ")
        text = ' '.join([self.int_to_str[i] for i in ids])

        # 去除标点符号前的多余空格
        # 正则表达式说明:
        # - r'\s+([,.:;?_!"()\'])': 匹配"一个或多个空白字符 + 标点符号"
        # - r'\1': 替换为第一个捕获组（即标点符号本身），去掉前面的空格
        # 例如: "hello , world !" -> "hello, world!"
        # 对比 JavaScript → text.replace(/\s+([,.:;?_!"()\'])/g, "$1");
        text = re.sub(r'\s+([,.:;?_!"()\'])', r'\1', text)
        return text

def test_tokenizer(tokenizer: SimpleTokenizerV1) -> None:
    """
    测试分词器功能

    参数:
        tokenizer: 分词器实例
    """
    print("\n" + "=" * 60)
    print("测试分词器")
    print("=" * 60)

    # 测试文本
    test_text = """It's the last he painted, you know," Mrs. Gisburn said with pardonable pride."""

    print(f"测试文本: {test_text}\n")

    # 编码
    ids = tokenizer.encode(test_text)
    print(f"✓ 编码完成")
    print(f"  Token IDs: {ids}")
    print(f"  IDs 数量: {len(ids)}")

    # 解码
    decoded_text = tokenizer.decode(ids)
    print(f"\n✓ 解码完成")
    print(f"  解码文本: {decoded_text}")

    # 验证
    print(f"\n✓ 验证结果:")
    print(f"  原文长度: {len(test_text)}")
    print(f"  解码长度: {len(decoded_text)}")
    print(f"  完全一致: {test_text == decoded_text}")

    # 展示一些 token 映射
    print(f"\n✓ Token 映射示例:")
    for i, token_id in enumerate(ids[:10]):
        token = tokenizer.int_to_str[token_id]
        print(f"    {token_id:4d} -> {repr(token)}")

if __name__ == "__main__":
    print("=" * 60)
    print("步骤 5: 实现分词器类")
    print("=" * 60)

    # 导入前面步骤的函数
    from read_file import read_file
    from tokenization import tokenize
    from create_vocab import create_vocab

    # 读取文件
    print("\n[1/4] 读取文件...")
    raw_text = read_file()

    # 进行分词
    print("\n[2/4] 分词...")
    tokens = tokenize(raw_text)

    # 创建词汇表
    print("\n[3/4] 创建词汇表...")
    vocab = create_vocab(tokens)

    # 创建分词器
    print("\n[4/4] 创建分词器...")
    tokenizer = SimpleTokenizerV1(vocab)

    # 测试分词器
    test_tokenizer(tokenizer)

    print("\n" + "=" * 60)
    print("步骤 5 完成！")
    print("=" * 60)

```

---

## 🔍 核心概念

### 1. 类（Class）定义

#### Python 实现

```python
class SimpleTokenizerV1:
    """简单分词器 V1 版本"""

    def __init__(self, vocab: Dict[str, int]):
        """初始化分词器"""
        self.str_to_int = vocab
        self.int_to_str = {i: s for s, i in vocab.items()}
```

#### JavaScript/TypeScript 等价实现

```typescript
class SimpleTokenizerV1 {
  private strToInt: Map<string, number>;
  private intToStr: Map<number, string>;

  constructor(vocab: Record<string, number>) {
    // 保存原始词汇表
    this.strToInt = new Map(Object.entries(vocab).map(([k, v]) => [k, v]));

    // 创建反向映射
    this.intToStr = new Map(Object.entries(vocab).map(([k, v]) => [v, k]));
  }

  encode(text: string): number[] {
    // 编码逻辑
    return [];
  }

  decode(ids: number[]): string {
    // 解码逻辑
    return "";
  }
}
```

**类的基本语法：**

```python
class MyClass:
    """类文档字符串"""

    # 类属性（所有实例共享）
    class_attr = "I am shared"

    def __init__(self, value):
        """构造方法"""
        # 实例属性（每个实例独立）
        self.instance_attr = value

    def method(self):
        """实例方法"""
        return self.instance_attr

# 使用
obj = MyClass("hello")
print(obj.method())  # "hello"
```

---

### 2. **init** 构造方法

#### Python 实现

```python
def __init__(self, vocab: Dict[str, int]):
    """初始化分词器"""
    self.str_to_int = vocab
    self.int_to_str = {i: s for s, i in vocab.items()}
```

#### JavaScript 等价实现

```javascript
constructor(vocab) {
  // 初始化
  this.strToInt = vocab;
  this.intToStr = Object.fromEntries(
    Object.entries(vocab).map(([k, v]) => [v, k])
  );
}
```

`init` 详解： 

```python
class Person:
    def __init__(self, name, age):
        """创建对象时自动调用"""
        self.name = name
        self.age = age

# 使用
person = Person("Alice", 25)
# __init__ 自动被调用
print(person.name)  # "Alice"
print(person.age)   # 25

# JavaScript 对比
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person("Alice", 25);
console.log(person.name);  // "Alice"
```

**关键区别：**
- Python: `__init__(self)` - 初始化已创建的对象
- JavaScript: `constructor()` - 创建并初始化对象

---

### 3. self 关键字

> self - this

#### Python 实现

```python
class SimpleTokenizerV1:
    def __init__(self, vocab):
        # self 指向当前实例
        self.str_to_int = vocab

    def encode(self, text):
        # self 访问实例属性
        return [self.str_to_int[token] for token in text.split()]
```

#### JavaScript 等价实现

```javascript
class SimpleTokenizerV1 {
  constructor(vocab) {
    // this 指向当前实例
    this.strToInt = vocab;
  }

  encode(text) {
    // this 访问实例属性
    return text.split().map(token => this.strToInt[token]);
  }
}
```

**self vs this：**

| 特性 | Python (self) | JavaScript (this) |
|------|--------------|-----------------|
| 是否必需 | 是（必须显式声明） | 是（隐式） |
| 作为参数 | 第一参数 | 不需要 |
| 指向 | 当前实例 | 取决于调用方式 |
| 箭头函数 | 无 | 绑定外层 this |

**Python 的 self：**

```python
class Example:
    def __init__(self, value):
        self.value = value  # self 必须显式使用

    def show(self):
        # self 必须作为第一个参数
        print(f"Value: {self.value}")

# 调用时不需要传 self
obj = Example(42)
obj.show()  # self 自动绑定到 obj
```

**JavaScript 的 this：**

```javascript
class Example {
  constructor(value) {
    this.value = value;  // this 自动指向实例
  }

  show() {
    console.log(`Value: ${this.value}`);
  }
}

const obj = new Example(42);
obj.show();  // this 自动绑定到 obj
```

---

### 4. 实例方法

#### Python 实现

```python
class SimpleTokenizerV1:
    def encode(self, text: str) -> List[int]:
        """编码方法"""
        # 方法体
        return ids

    def decode(self, ids: List[int]) -> str:
        """解码方法"""
        # 方法体
        return text
```

#### JavaScript 等价实现

```javascript
class SimpleTokenizerV1 {
  encode(text) {
    // 编码方法
    return [];
  }

  decode(ids) {
    // 解码方法
    return "";
  }
}
```

**方法类型对比：**

```python hl:11,17
class Example:
    class_var = "shared"

    def __init__(self):
        self.instance_var = "unique"

    # 实例方法（最常见）
    def instance_method(self):
        return self.instance_var

    # 类方法
    @classmethod
    def class_method(cls):
        return cls.class_var

    # 静态方法
    @staticmethod
    def static_method():
        return "static"

# 使用
obj = Example()
obj.instance_method()  # "unique"
Example.class_method()  # "shared"
Example.static_method()  # "static"
```

```javascript hl:13,8
class Example {
  static classVar = "shared";

  constructor() {
    this.instanceVar = "unique";
  }

  // 实例方法
  instanceMethod() {
    return this.instanceVar;
  }

  // 静态方法
  static staticMethod() {
    return "static";
  }
}

// 使用
const obj = new Example();
obj.instanceMethod();  // "unique"
Example.staticMethod();  // "static"
```

---

### 5. 字符串的 join() 方法

#### Python 实现

```python
# 将整数 ID 列表转换为字符串列表，然后用空格连接
text = ' '.join([self.int_to_str[i] for i in ids])
# 例如: [0, 1, 2] -> ["hello", "world", ","] -> "hello world ,"
```

#### JavaScript 等价实现

```javascript
// 将整数 ID 列表转换为字符串数组，然后用空格连接
const text = ids.map(i => this.intToStr.get(i)).join(' ');
// 例如: [0, 1, 2] -> ["hello", "world", ","] -> "hello world ,"
```

**join() 详解：**

```python
# Python
words = ["Hello", "world", "!"]

# 用空格连接
' '.join(words)  # "Hello world !"

# 用空字符串连接
''.join(words)   # "Helloworld!"

# 用逗号连接
','.join(words)  # "Hello,world,!"

# 用换行符连接
'\n'.join(words)  # "Hello\nworld\n!"
```

```javascript
// JavaScript
const words = ["Hello", "world", "!"];

// 用空格连接
words.join(' ');  // "Hello world !"

// 用空字符串连接
words.join('');   // "Helloworld!"

// 用逗号连接
words.join(',');  // "Hello,world,!"

// 用换行符连接
words.join('\n');  // "Hello\nworld\n!"
```

---

### 6. 正则表达式替换（re.sub）

#### Python 实现

```python
# 去除标点符号前的多余空格
text = re.sub(r'\s+([,.:;?_!"()\'])', r'\1', text)
# "hello , world !" -> "hello, world!"
```

#### JavaScript 等价实现

```javascript
// 去除标点符号前的多余空格
const text = text.replace(/\s+([,.:;?_!"()\'])/g, '$1');
// "hello , world !" -> "hello, world!"
```

**re.sub() 详解：**

```python
import re

text = "Hello, World!"

# 基本替换
re.sub('World', 'Python', text)  # "Hello, Python!"

# 使用正则
re.sub(r'\b[a-z]+\b', 'word', text)  # "word, word!"

# 使用捕获组
re.sub(r'(Hello), (World)', r'\2 and \1', text)  # "World and Hello!"

# 使用函数
def repl(match):
    return match.group(0).upper()

re.sub(r'[a-z]+', repl, text)  # "HELLO, WORLD!"
```

**对比表：**

| 操作 | Python | JavaScript |
|------|--------|-----------|
| 基本替换 | `re.sub(pattern, repl, text)` | `text.replace(pattern, repl)` |
| 全局替换 | 默认全部替换 | 需要 `/g` 标志 |
| 捕获组 | `\1`, `\2` | `$1`, `$2` |
| 使用函数 | `repl` 参数 | 函数作为第二个参数 |

---

### 7. 类型提示（类方法）

#### Python 实现

```python
from typing import List, Dict

class SimpleTokenizerV1:
    def __init__(self, vocab: Dict[str, int]):
        pass

    def encode(self, text: str) -> List[int]:
        pass

    def decode(self, ids: List[int]) -> str:
        pass
```

#### TypeScript 等价实现

```typescript
class SimpleTokenizerV1 {
  constructor(vocab: Record<string, number>) {}

  encode(text: string): number[] {
    return [];
  }

  decode(ids: number[]): string {
    return "";
  }
}
```

---

## 🎯 Python 最佳实践

### 1. 使用属性（@property）

```python hl:7,5,13
class Tokenizer:
    def __init__(self, vocab):
        self._vocab = vocab

    @property
    def vocab_size(self):
        """只读属性"""
        return len(self._vocab)

# 使用
tokenizer = Tokenizer(vocab)
print(tokenizer.vocab_size)  # 像访问属性一样
# 不是 tokenizer.vocab_size()
```

### 2. 使用 **str** 和 **repr**

```python hl:15,16
class Tokenizer:
    def __init__(self, vocab):
        self.vocab = vocab

    def __str__(self):
        """面向用户"""
        return f"Tokenizer(vocab_size={len(self.vocab)})"

    def __repr__(self):
        """面向开发者"""
        return f"Tokenizer(vocab={self.vocab})"

# 使用
tokenizer = Tokenizer({"hello": 0})
print(tokenizer)    # Tokenizer(vocab_size=1)
repr(tokenizer)     # Tokenizer(vocab={'hello': 0})
```

---

## 📚 深入理解：分词器设计

### 编码-解码一致性

```python
# 理想情况
text = "Hello, world!"
ids = tokenizer.encode(text)
decoded = tokenizer.decode(ids)
assert text == decoded  # 应该相等

# 实际情况（可能不一致）
text = "Hello, world!"
ids = tokenizer.encode(text)
decoded = tokenizer.decode(ids)
# "hello, world!" (大小写可能改变)
```

### 处理未知词（OOV）

```python
class SimpleTokenizerV2:
    def __init__(self, vocab):
        self.str_to_int = vocab
        self.int_to_str = {i: s for s, i in vocab.items()}
        self.unk_id = vocab.get("<UNK>", -1)

    def encode(self, text):
        tokens = text.split()
        ids = []
        for token in tokens:
            if token in self.str_to_int:
                ids.append(self.str_to_int[token])
            elif self.unk_id >= 0:
                ids.append(self.unk_id)
            else:
                raise ValueError(f"Unknown token: {token}")
        return ids
```

---

## 🔄 Python vs JavaScript 完整对比

### 分词器类完整实现

#### Python

```python hl:5
import re
from typing import List, Dict

class SimpleTokenizerV1:
    def __init__(self, vocab: Dict[str, int]):
        self.str_to_int = vocab
        self.int_to_str = {i: s for s, i in vocab.items()}

    def encode(self, text: str) -> List[int]:
        preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', text)
        tokens = [t.strip() for t in preprocessed if t.strip()]
        return [self.str_to_int[t] for t in tokens]

    def decode(self, ids: List[int]) -> str:
        text = ' '.join([self.int_to_str[i] for i in ids])
        return re.sub(r'\s+([,.:;?_!"()\'])', r'\1', text)
```

#### JavaScript

```javascript
class SimpleTokenizerV1 {
  constructor(vocab) {
    this.strToInt = vocab;
    this.intToStr = Object.fromEntries(
      Object.entries(vocab).map(([k, v]) => [v, k])
    );
  }

  encode(text) {
    const preprocessed = text.split(/([,.:;?_!"()\']|--|\s)/);
    const tokens = preprocessed
      .map(t => t.trim())
      .filter(t => t.length > 0);
    return tokens.map(t => this.strToInt[t]);
  }

  decode(ids) {
    let text = ids.map(i => this.intToStr[i]).join(' ');
    return text.replace(/\s+([,.:;?_!"()\'])/g, '$1');
  }
}
```

---

## 📚 总结

**关键要点：**

1. ✅ **类和对象** - 封装数据和行为
2. ✅ ****init** 构造方法** - 初始化实例
3. ✅ **self 关键字** - 访问实例属性和方法
4. ✅ **实例方法** - 定义对象行为
5. ✅ **encode/decode** - 分词器的核心功能

**Python vs JavaScript：**
- 类语法相似
- `self` 必须显式声明 vs `this` 隐式
- `__init__` vs `constructor`
- 方法名几乎相同
