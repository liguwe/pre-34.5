# 前端工程化历程

`#前端工程化` 

## 1. 总结

- webpack ：bundle 的代表
	- 广度优先遍历，找到所有资源和依赖关系，最后统一打包
	- 但：项目越来越复杂，依赖越来越多，构建编译速度越来越慢 
- vite 
	- unbundle 的代表
	- 因为 HTTP2、ESM 等新技术已经得到**浏览器广泛支持**
- turbopack 
	- 原生语言 rust
	- 依然是 bundle 线路
	- 做到函数级别的缓存
	- 实现增量构建

## 2. 早期

- 09 年之前，**JS 无法脱离浏览器运行**，前后端职能耦合
	- 工程化能做的有限，特别有限
- 2009 年，NodeJS 的出现，使得 **JS 能够脱离浏览器运行**，也催生了许多效率工具

## 3. gulp → 不同资源依然走各自的处理逻辑

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211.png)

## 4. webpack → 广度优先遍历，找到所有资源和依赖关系，最后统一打包

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-1.png)

## 5. webpack → 优势与劣势

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-2.png)

## 6. 再之后 

- 项目越来越复杂，依赖越来越多，构建编译速度越来越慢 
- HTTP2、ESM 等新技术已经得到**浏览器广泛支持**

## 7. bundle → module 、原生语言

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-3.png)

## 8. Vite 的优势与劣势

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-4.png)

## 9. Turbopack: The Rust-powered successor to Webpack

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-5.png)

### 9.1. 函数级别的缓存

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-7.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-8.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-9.png)


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-10.png)

## 10. 对比

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-6.png)

## 11. 下载量对比

> https://npmtrends.com/gulp-vs-rollup-vs-rspack-vs-turbopack-vs-vite-vs-webpack

- 最高的还是 gulp 
- Vite 与 Webpack Stars 接近
- 但，Webpack 下载量依然是绝对的榜首
- Rollup 下载量高居榜二

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-11.png)

## 12. 工程化的一些思考

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-12.png)


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241211-13.png)

## 13. 参考

- D2大会 - 前端工程化与 Turbopack 概述
