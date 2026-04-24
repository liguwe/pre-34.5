# CSS 兼容性相关

`#前端/CSS`  

- `@supports not (--css: variables) {}` 用于确定是否支持 `css 变量`
- Autoprefixer
- Can I use?
- CSS Reset
- `CSS Reset`: 如 Eric Meyer’s Reset CSS
- `Normalize.css`: 
	- 保留有用的默认样式，同时标准化跨浏览器的样式
- Modernizr 库: 
	- 一个流行的库，用于检测 HTML5 和 CSS3 特性，比如 `if (Modernizr.flexbox) {} `
- IE条件注释
	- **太老了，可以不用关注了**
- 渐进增强和优雅降级
- CSS Hack：
	- 比如 `*color: yellow; /* IE6,IE7 */`
- 单位兼容性：
	- 使用 `px` , 有可能 `rem/vw/vh` 不支持
