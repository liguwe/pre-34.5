# HTML 标签与 HTML 属性

`#前端` `#HTML` 

## 1. 说说 `<meta>` 标签的用处？

使用 `<meta>` 标记 Metadata 
> 更多参考：[https://web.dev/learn/html/metadata?hl=zh-cn](https://web.dev/learn/html/metadata?hl=zh-cn)

## 2. 标签语义化是什么意思？

每个标签都有语义，需要注意使用场景，比如下图：
![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/acc28644f26ef7363764d208cbc08ba3.png)

## 3. 列举一些不常用但特别有用的标签

### 3.1. abbr：缩写 abbreviation

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/dd23fcc1f51d799987d70f160ed51031.png)

### 3.2. 展示计算机代码

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/3949d49f5800384366ecff6d88bc091b.png)

> 所以不只有`pre/code` ，但其他确实不太常用

### 3.3. 对话框

```html
<dialog open>
  <p>Greetings, one and all!</p>
  <form method="dialog">
    <button>OK</button>
  </form>
</dialog>
```

### 3.4. 其他：HTML 元素，多看 MDN

> **这里只是强调您可能还有很多标签元素没有使用过，建议多多参考文档**

> 更多参考： https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a

## 4. 说说 HTML 属性有哪些类型？

![image.png](https://832-1310531898.cos.ap-beijing.myqcloud.com/yuque/e5d1702720265eaec8f3a3af0dce9349.png)

又分`布尔属性`、`枚举属性`、`全局属性`及`自定义属性`，可见下面代码示例

```html
<input required>
<section id="reg"/>
<blockquote data-machine-learning="workshop"></blockquote>
```

> 更多可参考：[网页元素的属性](https://wangdoc.com/html/attribute)

## 5. 列举多媒体嵌入相关的标签

- 常见标签为`<img> 、<video> 、<audio>、、<iframe>、<embed> 、 <object>、<track>、<param>`
	- 可插入如图片、视频、音频、网页、字幕
- `<embed>` 和 `<object>` : 
	- 可嵌入各类资源，如音频、视频、pdf 文件等

>  多媒体标签的一些事件往往都不支持冒泡！

> 更多参考：
> [多媒体与嵌入 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding)
> [多媒体标签](https://wangdoc.com/html/multimedia#embed)
