# Vue3 的编译器原理（篇二：完善的 HTML 解析器）

`#vue3` 

## 总结

- 完善的 HTML 解析器，📢📢 📢 注意需要参考 HTML 规范（WHATWG）
- 使用正则能够让我写更少的代码
	- 其实正则表达式也是一种状态机

## 1. 前言

- 解析器本质上是一个状态机
- 正则表达式其实也是一个状态机
- 因此在编写 `parser` 的时候，利用正则表达式能够让我们少写不少代码
	- **本文我们将更多地利用正则表达式来实现 HTML 解析器。**
- 另外，一个完善的 HTML 解析器远比想象的要复杂。 我们知道，**浏览器会对 HTML 文本进行解析**，那么它是如何做的呢? 
	- 其实关于 HTML 文本的解析，是有规范可循的，即 WHATWG 关于 HTML 的解析规范，
		- 其中**定义了完整的错误处理和状态机的状态迁移流程**，还提及了一些**特殊的状态**，
			- 例如 DATA、CDATA、RCDATA、 RAWTEXT 等。
			- 那么，这些状态有什么含义呢
			- 它们对解析器有哪些影 响呢?什么是 HTML 实体
			- 以及 Vue.js 模板解析器需要如何处理 HTML 实体呢?

## 2. 完善的 HTML 解析器

```javascript
// 定义文本模式，状态表
const TextModes = {
  DATA: "DATA", // 普通文本模式
  RCDATA: "RCDATA", // 解析字符数据模式
  RAWTEXT: "RAWTEXT", // 原始文本模式
  CDATA: "CDATA", // CDATA 模式
};

// 解析 Vue 模板, 返回 AST
// 传入一个 vue 模板字符串，返回一个对象
function parse(str) {
  // 定义上下文对象
  const context = {
    source: str, // 模板内容
    mode: TextModes.DATA, // 当前模式
    // 前进指定长度的字符
    advanceBy(num) {
      context.source = context.source.slice(num); // 截取字符串，前进指定长度
    },
    // 跳过空白字符
    advanceSpaces() {
      const match = /^[\t\r\n\f ]+/.exec(context.source); // 匹配空白字符
      if (match) {
        context.advanceBy(match[0].length); // 前进匹配到的空白字符长度
      }
    },
  };

  // 第一个参数是上下文对象，
  // 第二个参数是代表父节点构成的节点栈，初始为空数组
  const nodes = parseChildren(context, []); // 解析子节点

  return {
    type: "Root", // 根节点类型
    children: nodes, // 子节点
  };
}

// 解析子节点
function parseChildren(context, ancestors) {
  let nodes = []; // 存储解析出的子节点

  const { mode } = context; // 获取当前模式

  // 循环解析，直到模板字符串结束或遇到结束标签
  while (!isEnd(context, ancestors)) {
    let node; // 当前解析出的节点

    // 根据当前模式解析不同类型的节点
    if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
      if (mode === TextModes.DATA && context.source[0] === "<") {
        if (context.source[1] === "!") {
          if (context.source.startsWith("<!--")) {
            // 解析注释
            node = parseComment(context);
          } else if (context.source.startsWith("<![CDATA[")) {
            // 解析 CDATA
            node = parseCDATA(context, ancestors);
          }
        } else if (context.source[1] === "/") {
          // 结束标签，不做处理
        } else if (/[a-z]/i.test(context.source[1])) {
          // 解析元素标签
          node = parseElement(context, ancestors);
        }
      } else if (context.source.startsWith("{{")) {
        // 解析插值
        node = parseInterpolation(context);
      }
    }

    // 如果没有解析出节点，则解析为文本节点
    if (!node) {
      node = parseText(context);
    }

    nodes.push(node); // 将解析出的节点加入节点数组
  }

  return nodes; // 返回解析出的子节点数组
}

// 解析元素节点
function parseElement(context, ancestors) {
  // 解析开始标签
  const element = parseTag(context);
  if (element.isSelfClosing) return element; // 如果是自闭合标签，直接返回

  // 将当前元素节点加入父节点栈
  ancestors.push(element);

  // 根据标签类型切换模式
  if (element.tag === "textarea" || element.tag === "title") {
    context.mode = TextModes.RCDATA;
  } else if (/style|xmp|iframe|noembed|noframes|noscript/.test(element.tag)) {
    context.mode = TextModes.RAWTEXT;
  } else {
    context.mode = TextModes.DATA;
  }

  // 解析子节点
  element.children = parseChildren(context, ancestors);

  // 从父节点栈中移除当前元素节点
  ancestors.pop();

  // 解析结束标签
  if (context.source.startsWith(`</${element.tag}`)) {
    parseTag(context, "end");
  } else {
    console.error(`${element.tag} 标签缺少闭合标签`);
  }

  return element; // 返回解析出的元素节点
}

// 解析标签
function parseTag(context, type = "start") {
  const { advanceBy, advanceSpaces } = context; // 获取上下文中的方法

  // 匹配开始标签或结束标签
  const match =
    type === "start"
      ? /^<([a-z][^\t\r\n\f />]*)/i.exec(context.source) // 匹配开始标签
      : /^<\/([a-z][^\t\r\n\f />]*)/i.exec(context.source); // 匹配结束标签
  const tag = match[1]; // 获取标签名

  // 前进到标签名之后
  advanceBy(match[0].length);
  advanceSpaces(); // 跳过空白字符

  // 解析属性
  const props = parseAttributes(context);

  // 判断是否自闭合标签
  const isSelfClosing = context.source.startsWith("/>");
  advanceBy(isSelfClosing ? 2 : 1); // 前进到标签结束符之后

  return {
    type: "Element", // 元素节点类型
    tag, // 标签名
    props, // 属性
    children: [], // 子节点
    isSelfClosing, // 是否自闭合
  };
}

// 解析属性
function parseAttributes(context) {
  const { advanceBy, advanceSpaces } = context; // 获取上下文中的方法
  const props = []; // 存储解析出的属性

  // 循环解析属性，直到遇到标签结束符
  while (!context.source.startsWith(">") && !context.source.startsWith("/>")) {
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source); // 匹配属性名
    const name = match[0]; // 获取属性名

    advanceBy(name.length); // 前进到属性名之后
    advanceSpaces(); // 跳过空白字符
    advanceBy(1); // 跳过等号
    advanceSpaces(); // 跳过空白字符

    let value = ""; // 属性值

    // 判断属性值是否被引号包裹
    const quote = context.source[0];
    const isQuoted = quote === '"' || quote === "'";
    if (isQuoted) {
      advanceBy(1); // 跳过引号
      const endQuoteIndex = context.source.indexOf(quote); // 查找引号结束位置
      if (endQuoteIndex > -1) {
        value = context.source.slice(0, endQuoteIndex); // 获取属性值
        advanceBy(value.length); // 前进到属性值之后
        advanceBy(1); // 跳过引号
      } else {
        console.error("缺少引号");
      }
    } else {
      const match = /^[^\t\r\n\f >]+/.exec(context.source); // 匹配未被引号包裹的属性值
      value = match[0]; // 获取属性值
      advanceBy(value.length); // 前进到属性值之后
    }

    advanceSpaces(); // 跳过空白字符

    props.push({
      type: "Attribute", // 属性节点类型
      name, // 属性名
      value, // 属性值
    });
  }

  return props; // 返回解析出的属性数组
}

// 解析文本节点
function parseText(context) {
  let endIndex = context.source.length; // 文本节点结束位置
  const ltIndex = context.source.indexOf("<"); // 查找下一个标签的起始位置
  const delimiterIndex = context.source.indexOf("{{"); // 查找下一个插值的起始位置

  // 找到最近的标签或插值的起始位置
  if (ltIndex > -1 && ltIndex < endIndex) {
    endIndex = ltIndex;
  }
  if (delimiterIndex > -1 && delimiterIndex < endIndex) {
    endIndex = delimiterIndex;
  }

  const content = context.source.slice(0, endIndex); // 获取文本内容

  context.advanceBy(content.length); // 前进到文本内容之后

  return {
    type: "Text", // 文本节点类型
    content: decodeHtml(content), // 解码后的文本内容
  };
}

// 判断是否解析结束
function isEnd(context, ancestors) {
  if (!context.source) return true; // 如果模板字符串为空，则解析结束

  // 与节点栈内全部的节点比较，判断是否遇到结束标签
  for (let i = ancestors.length - 1; i >= 0; --i) {
    if (context.source.startsWith(`</${ancestors[i].tag}`)) {
      return true; // 如果遇到结束标签，则解析结束
    }
  }
}

// 命名字符引用表
const namedCharacterReferences = {
  gt: ">",
  "gt;": ">",
  lt: "<",
  "lt;": "<",
  "ltcc;": "⪦",
};

// 解码 HTML 字符引用
function decodeHtml(rawText, asAttr = false) {
  let offset = 0; // 当前偏移量
  const end = rawText.length; // 文本结束位置
  let decodedText = ""; // 解码后的文本
  let maxCRNameLength = 0; // 最大字符引用名称长度

  function advance(length) {
    offset += length; // 增加偏移量
    rawText = rawText.slice(length); // 截取字符串
  }

  while (offset < end) {
    const head = /&(?:#x?)?/i.exec(rawText); // 匹配字符引用的起始位置
    if (!head) {
      const remaining = end - offset; // 剩余未处理的文本长度
      decodedText += rawText.slice(0, remaining); // 追加剩余文本
      advance(remaining); // 前进到文本结束
      break;
    }
    // 前进到字符引用的起始位置
    decodedText += rawText.slice(0, head.index); // 追加字符引用前的文本
    advance(head.index); // 前进到字符引用起始位置

    if (head[0] === "&") {
      // 命名字符引用
      let name = ""; // 字符引用名称
      let value; // 字符引用值
      if (/[0-9a-z]/i.test(rawText[1])) {
        if (!maxCRNameLength) {
          maxCRNameLength = Object.keys(namedCharacterReferences).reduce(
            (max, name) => Math.max(max, name.length),
            0,
          ); // 计算最大字符引用名称长度
        }
        for (let length = maxCRNameLength; !value && length > 0; --length) {
          name = rawText.substr(1, length); // 获取字符引用名称
          value = namedCharacterReferences[name]; // 获取字符引用值
        }
        if (value) {
          const semi = name.endsWith(";"); // 判断字符引用是否以分号结尾
          if (
            asAttr &&
            !semi &&
            /[=a-z0-9]/i.test(rawText[name.length + 1] || "")
          ) {
            decodedText += "&" + name; // 追加字符引用
            advance(1 + name.length); // 前进到字符引用之后
          } else {
            decodedText += value; // 追加解码后的字符引用值
            advance(1 + name.length); // 前进到字符引用之后
          }
        } else {
          decodedText += "&" + name; // 追加字符引用
          advance(1 + name.length); // 前进到字符引用之后
        }
      } else {
        decodedText += "&"; // 追加字符引用
        advance(1); // 前进到字符引用之后
      }
    } else {
      // 判断是十进制表示还是十六进制表示
      const hex = head[0] === "&#x";
      // 根据不同进制表示法，选用不同的正则
      const pattern = hex ? /^&#x([0-9a-f]+);?/i : /^&#([0-9]+);?/;
      // 最终，body[1] 的值就是 Unicode 码点
      const body = pattern.exec(rawText);

      // 如果匹配成功，则调用 String.fromCodePoint 函数进行解码
      if (body) {
        // 将码点字符串转为十进制数字
        const cp = Number.parseInt(body[1], hex ? 16 : 10);
        // 码点的合法性检查
        if (cp === 0) {
          // 如果码点值为 0x00，替换为 0xfffd
          cp = 0xfffd;
        } else if (cp > 0x10ffff) {
          // 如果码点值超过了 Unicode 的最大值，替换为 0xfffd
          cp = 0xfffd;
        } else if (cp >= 0xd800 && cp <= 0xdfff) {
          // 如果码点值处于 surrogate pair 范围，替换为 0xfffd
          cp = 0xfffd;
        } else if ((cp >= 0xfdd0 && cp <= 0xfdef) || (cp & 0xfffe) === 0xfffe) {
          // 如果码点值处于 `noncharacter` 范围，则什么都不做，交给平台处理
          // noop
        } else if (
          // 控制字符集的范围是：[0x01, 0x1f] 加上 [0x7f, 0x9f]
          // 却掉 ASICC 空白符：0x09(TAB)、0x0A(LF)、0x0C(FF)
          // 0x0D(CR) 虽然也是 ASICC 空白符，但需要包含
          (cp >= 0x01 && cp <= 0x08) ||
          cp === 0x0b ||
          (cp >= 0x0d && cp <= 0x1f) ||
          (cp >= 0x7f && cp <= 0x9f)
        ) {
          // 在 CCR_REPLACEMENTS 表中查找替换码点，如果找不到则使用原码点
          cp = CCR_REPLACEMENTS[cp] || cp;
        }
        // 解码后追加到 decodedText 上
        decodedText += String.fromCodePoint(cp);
        // 消费掉整个数字字符引用的内容
        advance(body[0].length);
      } else {
        // 如果没有匹配，则不进行解码操作，只是把 head[0] 追加到 decodedText 并消费掉
        decodedText += head[0];
        advance(head[0].length);
      }
    }
  }
  return decodedText; // 返回解码后的文本
}

// 解析插值
function parseInterpolation(context) {
  context.advanceBy("{{".length); // 前进到插值起始位置
  closeIndex = context.source.indexOf("}}"); // 查找插值结束位置
  const content = context.source.slice(0, closeIndex); // 获取插值内容
  context.advanceBy(content.length); // 前进到插值内容之后
  context.advanceBy("}}".length); // 前进到插值结束位置

  return {
    type: "Interpolation", // 插值节点类型
    content: {
      type: "Expression", // 表达式节点类型
      content: decodeHtml(content), // 解码后的表达式内容
    },
  };
}

// 解析注释
function parseComment(context) {
  context.advanceBy("<!--".length); // 前进到注释起始位置
  closeIndex = context.source.indexOf("-->"); // 查找注释结束位置
  const content = context.source.slice(0, closeIndex); // 获取注释内容
  context.advanceBy(content.length); // 前进到注释内容之后
  context.advanceBy("-->".length); // 前进到注释结束位置

  return {
    type: "Comment", // 注释节点类型
    content, // 注释内容
  };
}



```

## 3. 执行结果测试

```js
// 测试解析函数
const s = `<div><!-- comments --></div>`;
const ast = parse(s); // 解析模板字符串
console.log(ast); // 输出解析结果

{
    "type": "Root",
    "children": [
        {
            "type": "Element",
            "tag": "div",
            "props": [],
            "children": [
                {
                    "type": "Comment",
                    "content": " comments "
                }
            ],
            "isSelfClosing": false
        }
    ]
}
```

## 4. 更多

> 细节需要再慢慢看看书中的内容吧，不需要每行每字的看了，别浪费时间，以后需要直接来看调试这个代码，或者看书，或者借助其他工具都行
