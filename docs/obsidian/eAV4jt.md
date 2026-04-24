# Chrome DevTools（篇一）

`#前端性能` 

## 1. 总结

- 实时监控性能各项指标
	- cpu 
	- dom节点数量
	- JS event
	- document 个数
	- 帧率
	- GUP 内存
	- 等等
- Elements（元素面板）
	- Computed
	- DOM 断点
	- 盒子模型
- Console（控制台）
	- 错误和警告日志
- Sources（源代码）
	- `Watch` 表达式
	- 源码映射
	- 文件树浏览
- Network（网络）
	- 请求模拟
- Performance（性能）
	- CPU 分析
	- 帧率监控
	- 内存分析
	- **垃圾回收**分析
- Memory（内存）
	- **内存泄漏检测**
- Application（应用）
- Performance Insights
- Device Mode
- Remote Debugging
	- USB 调试
	- 局域网内网调试
- Security（安全） & Privacy（隐私）
- Layers（图层）
	- **可查看合成层**
- Animations（动画）
-  Rendering（渲染）
	- FPS 计量表
	- **Core Web Vitals**
- Settings（设置）
- 扩展支持
- 其他
	- **Coverage 覆盖率**
	- Lighthouse 集成

## 2. 性能监控

按下图操作展开

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241130-4.png)

检测渲染是否卡顿

- ![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241130-3.png)

任务管理

![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241130-5.png)

## 3. Elements（元素面板）

- DOM 树检查和编辑
- CSS 样式查看和修改
- 计算样式（Computed）查看
	- 盒子模型
- 事件监听器
- DOM 断点
	- DOM 监控
- 属性修改
- **布局检查器**

## 4. Console（控制台）

- JavaScript 交互式环境
- 错误和警告日志
- 网络请求日志
- 控制台 API
- 多行编辑器
- 过滤器和搜索
- 控制台设置 
- 实时表达式求值
- 多行编辑器模式

## 5. Sources（源代码）

- 源代码查看和编辑
- 文件树浏览
- 源码编辑器
- 调试器
	- 断点调试
	- 断点管理
- **调用堆栈**
- 作用域变量
- 代码段管理
- `Watch` 表达式
- 源码映射

## 6. Network（网络）

- 网络请求监控
- 请求列表
- 请求详情
	- 请求详情分析
- 资源时间线
	- 时间轴
- 过滤器
	- 请求筛选和搜索
- 请求阻止
- 网络限速模拟
- 离线模式 

## 7. Performance（性能）

- CPU 分析
- 内存分析
- 帧率监控
- 事件分析
- 火焰图
- 垃圾回收分析
- 层级时间轴
- 网络瀑布图 
- 性能瓶颈识别

## 8. Memory（内存）

- 堆快照
- 内存泄漏检测
- 内存分配时间轴
- 内存分配采样
- 对象保留树
- 比较视图
- GC 垃圾回收分析

## 9. Performance Insights

- 性能指标
- 优化建议
- 性能评分
- 加载时间分析
- 交互性分析 

## 10. Application（应用）

- 存储查看器
	- Local Storage
	- Session Storage
	- IndexedDB
	- Web SQL
	- Cookies
- Cache Storage
- Background Services
- 清除存储数据
- Storage（存储）
	- 配额使用情况
	- 服务工作线程
	- 清除站点数据
	- 存储持久化

## 11. Device Mode

- 响应式设计模式
- 设备模拟
- 网络模拟
- 传感器模拟
- 位置模拟 

## 12. Remote Debugging

- USB 调试
- 网络检查
- 屏幕截图
- 端口转发 

## 13. Security（安全） & Privacy（隐私）

- HTTPS 证书信息
- 混合内容检查
- 安全问题
- 源信息 
- Privacy（隐私）
	- Cookie 检查
	- 权限管理
	- 信任设置
	- 安全上下文 

## 14. Layers（图层）

- 合成层查看
- 3D 视图
- 图层边界
- 绘制分析
![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241130-6.png)

## 15. Animations（动画）

- 动画时间轴
- 动画控制
- 缓动函数编辑器
- 动画检查器 

## 16. Changes（更改）

- CSS 更改跟踪
- DOM 更改跟踪
- 修改对比
- 更改历史 

## 17. 实验面板

- CSS 概览
- WebAuthn
- 问题选项卡
- 3D 视图
- 网络请求阻止
- 源码订阅

## 18. 开发者实验

- Protocol Monitor:
- Network Console
- WebAssembly 调试
- CSS 概览
- 问题选项卡 

## 19. Rendering（渲染）

- FPS 计量表
- Paint flashing
- Layer borders
- Scrolling bottlenecks
- **Core Web Vitals**

## 20. Command Menu（命令菜单）

- 快速打开文件
- 运行命令
- 切换功能
- 设置访问 

## 21. Settings（设置）

- 主题设置
- 工作区
- 实验功能
- 快捷键
- 设备模式
- 网络设置
- 控制台设置 

## 22. 扩展支持

- Chrome DevTools 扩展
- 自定义面板
- 调试器扩展
- 主题扩展 

## 23. 集成功能

- Lighthouse 集成
- **Coverage 覆盖率**
	- 这个很有用，看看有多少没用的东西
- CSS 概览
- Issues 问题面板
- 渲染性能
