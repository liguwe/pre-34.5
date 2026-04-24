# 性能优化思路

`#前端性能`  

## 1. 总结

- ① 缓存
	- web 缓存技术
		- localstrage
		- sw
		- 内存缓存
		- 强缓存
		- 协商缓存：304
		- http2：push cache 
	- 离线包
- **②** 加载
	- 资源预加载
		- link ref 
		- 各种**pre**
			-  preconnect dns-prefetch prerender preload 等
			- **性价比最高**
	- 数据预加载
		- 比如首屏数据，借助宿主环境请求
- **③** 渲染
	- 预渲染：
		- 客户端**离屏渲染**
	- 渲染方式选择
		- CDN → SR 
		- CSR
		- SSR ： 同构
		- NRS
- 需要充分考虑**宿主环境的能力**

> 源于个人某次分享

## 2. 性能优化三板斧

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-18.png)

## 3. 缓存

### 3.1. web 缓存技术

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-19.png)

### 3.2. 常见的缓存技术

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-20.png)

## 4. 预加载

### 4.1. 资源预加载

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-21.png)

### 4.2. 数据预数据

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-22.png)

## 5. 渲染

### 5.1. 渲染分类

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-23.png)

### 5.2. csr → ssr

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-24.png)

### 5.3. 预渲染的案例

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-25.png)

### 5.4. 其他运行时优化思路

- 避免强制布局
- 批量化操作
- 长列表
- 任务拆解
- 并行：worker
- css 善用合成

## 6. 一些启发

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-26.png)
