# 如何度量前端性能

`#前端性能` 

> 源于个人某次分享

## 总结

- 性能定义：
	- 电池耗电、内存、CPU 占用、加载速度、响应能力等
- **以用户为中心的指标**：
	- 是否发生 → 是否有用 → 是否可用 → 是否好用
		- 是否发生：FP
		- 是否有用：LCP
		- 是否可用：TTI 页面可交互时间
		- 是否好用：CLS
- **用户体验核心指标**：
	- 白屏 → 首屏 → 可交互 → 可流畅交互
		- 白屏：FP、FCP
		- 首屏：需要自己算
		- 可交互时间：FCI
		- 可流畅交互：TTI
- **core** web vitals
	- LCP ： good → 2.5 → 4 → bad
	- FID 换成 INP (Interaction to Next Paint)
		- 衡量**页面交互响应速度**
		- good →  200ms → 500ms → bad
	- CLS 
		- 衡量页面**视觉稳定性**，量化意外布局偏移的程度
		- good → 0.1 → 0.25 → bad


>  Google 宣布从 2024 年 3 月开始，将用 INP (Interaction to Next Paint) 替代 FID (First Input Delay) 作为 Core Web Vitals 的指标之一
>  因为：**FID 只测量第一次交互的延迟，无法完整反映整个页面交互体验**
>  

## 1. 何为前端性能

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-8.png)

## 2. 如何度量性能

### 2.1. 主观感受

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-9.png)

### 2.2. 客观度量：（比如，如何度量白屏时间）

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-10.png)

使用`性能 API`

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-11.png)

## 3. web performance api

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-12.png)

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-13.png)

## 4. 以用户为中心的性能指标

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-14.png)、

## 5. 用户体验核心指标

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-15.png)

## 6. Web Vitals

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-16.png)

## 7. 性能指标总结

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241101-17.png)
