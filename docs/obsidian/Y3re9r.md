# 前端构建提速的体系化思路

`#前端构建` 

## 1. 总结

- 构建相关 6 个时代
	1. script 时代
	2. 大文件时代：gulp grunt iife
	3. amd cmd 时代
	4. webpack 时代
	5. esm 时代
	6. now ?
- 构建提速的体系化思路
	- 构建每个阶段都耗时，下面按照最慢 → 最快的顺序
		- 编译 dependency 最慢
		- 压缩 js 
		- 编译 src
		- 生成 sourcemap
		- 压缩 css 
			- 可以对js/或者css做**无用抹除**
	- 提速的三个思路
		- **①** 缓存：做过的事情不做二遍，比如
			- extenals
				- 标识这些依赖项不需要打包，运行时从外部获取这些依赖
			- dll
				- 把公共代码打包成 dll 文件放到硬盘里
			- cache-loader  
			- hard-source-webpack-plugin 等
		- **②** 延迟处理
			- sourcemap 延迟
			- 按需编译
				- vite 
		- **③** 高级语言
			- esbuild 
			- swc 
			- rspack 等等
- npm 包上 cdn 方案
	- **ESM CDN 方案**
	- 类似于 unpkg 方案

---

另外可参考：
- [12. 主流的前端构建工具](/VakEpr)
- [11.   webpack 性能优化的思路](/GUKD1s)

> 源于 umi 作者 CC 大佬的分享 GMTC 分享

## 2. 构建相关 5 个时代

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-34.png)

### 2.1. 文件即scrip时代

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-35.png)

### 2.2. 大文件时代：grunt/gulp/iife

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-36.png)

### 2.3. AMD 和 CMD 时代

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-37.png)

三个问题都解决了

### 2.4. webpack 时代

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-38.png)

虽然三个问题都解决了，但新的问题又出现了

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-39.png)

举个例子

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-41.png)

不同的慢有不同的解

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-42.png)

### 2.5. esm 年代

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-43.png)

> 后面说

## 3. 构建提速的体系化思路

### 3.1. 构建每个阶段都耗时

> 编译 dependency 最慢！！！

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-44.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-45.png)

### 3.2. 提速的三个思路

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-46.png)

#### 3.2.1. 缓存

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-47.png)

#### 3.2.2. 延迟处理

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-48.png)

#### 3.2.3. native code

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-49.png)

#### 3.2.4. 提速方案三个思路的应用：注意颜色

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-51.png)

### 3.3. 传统提速方案：`externals`

- `externals`：用于标记不用打包的库模块，如`JQuery、react-dom`等。可以直接通过script的方式加载
	- `externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法。相当于说："**这些依赖项不需要打包，运行时从外部获取这些依赖**"。

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-54.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-55.png)

可用`auto externals`来解决配置复杂问题

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-56.png)

### 3.4. 传统提速方案：dll **动态链接库**

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-57.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-58.png)

### 3.5. 传统提速方案：按需编译

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-61.png)

### 3.6. 传统生产优化思路

#### 3.6.1. webpack构建中tree shaking

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-59.png)

#### 3.6.2. 无用抹除

可以对js/或者css做无用抹除，css需要引入包`npm i purgecss-webpack-plugin -D`

#### 3.6.3. webpack构建中 scope Hoisting

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-60.png)

### 3.7. 当代提速思路

#### 3.7.1. umi

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-62.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-63.png)

#### 3.7.2. vite

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-64.png)

#### 3.7.3. umi 的 mfsu

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-65.png)

使用 Module Federation （云组件）了

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-66.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-67.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-68.png)

### 3.8. ESM CDN ⽅案

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-69.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-70.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-71.png)

## 4. 总结

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-72.png)
