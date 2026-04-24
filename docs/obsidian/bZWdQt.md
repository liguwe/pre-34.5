# HTML 标签

`#前端` `#HTML` `#R2` 

你可以通过下面的清单来检测自己对于 HTML 标签的了解是否全面

- HTML 简介
- HTML 的标准规范有哪些？
- URL ：通过 a 标签，构建了互联网
- 标签语义
- 全局属性：比如 `spellcheck/translate` 是做什么用的？
	- 拼写和翻译
- HTML的字符实体表示方法：为什么？
   - 网页使用 utf-8 ，那么类似于`<p>` 中的 `<` 如何表示呢？
- `a 标签`
	- 它的下面这些属性都是干嘛的？
		- [href](https://wangdoc.com/html/a#href)
		- [hreflang](https://wangdoc.com/html/a#hreflang)
		- [title](https://wangdoc.com/html/a#title)
		- [target](https://wangdoc.com/html/a#target)
		- [rel](https://wangdoc.com/html/a#rel)
		- [referrerpolicy](https://wangdoc.com/html/a#referrerpolicy)
		- [ping](https://wangdoc.com/html/a#ping)：**用于打点**
		- [type](https://wangdoc.com/html/a#type)
		- [download](https://wangdoc.com/html/a#download) ：**用于下载**
	- 发邮件：调用邮件客户端
	- 打电话：H5
- link 标签
	- rel：全称 `relationship`
		- 预加载相关：preload / prefetch /dns-prefetch / prerender / preconnect
		- 其他：比如 icon / stylessheet 等
	- media：媒体查询
	- **crossorigin ：跨域访问相关**
	- manifest：文件清单
	- 更多参考 [<link>](https://wangdoc.com/html/link#hreflang-%E5%B1%9E%E6%80%A7)
- `<script> 、<noscript>`
	- type 
	- async/defer
	- `crossorigin`
	- `integrity`：哈希防篡改
	- `nonce`：密码随机值，配合服务器，只有白名单才执行
- iframe
	- `sandbox`：**沙盒权限属性**，**比如是否允许提交表单、是否允许提示框等等**
	- `importance`：下载优先级
	- `loading`: auto / lazy / eager 
- `table` 相关标签都有哪些
	- 如何合并单元格 
		- 使用 `colspan` 属性来实现**水平方向**的单元格合并
		- 使用 `rowspan` 属性来实现**垂直方向**的单元格合并。
- `details/summary/dialog 标签`是干什么用的 ？ 
- form 
	- input type 有哪些 ？
	- 每种 type 有不同的属性：
		- 比如 min/pattern/autocomplete ...
	- 更多参考：[表单标签](https://wangdoc.com/html/form#meter)
