# Nodejs 加载 JSON 文件

`#nodejs` 

总结：
- `require`
- `readFile` 或者 `readFileSync` 
- `require` 和 `readFileSync` 的区别？
- 流式处理：
	- stream 、createWriteStream 、new Readable 等
	- fs.createReadStream

## 1. 磁盘上某目录下有100个JSON文件，请合并成 1个JSON文件

- 使用 `require` 直接简单同步写入，然后合并
	- **同步阻塞，内存消耗大**
- 使用 `readFile` 异步读取，并修改成 Promise 
	- **可并发，但内存占用高**
- 流处理：引入 `stream` 、 `createWriteStream` 、`new Readalble`
	- **内存占用低，可处理大文件，但串行处理，速度较慢**
- 工作线程：使用 `worker_threads` 
	- 充分利用多核 CPU，并行处理
- 优化的流处理
	- 异步 + 流处理

补充说明：
- 所有方案都应该添加`错误处理`
- 生产环境中应该添加`日志记录`
- 可以根据具体需求`调整并发数和缓冲区大小`
- 考虑添加`进度提示`功能

## 2. require 和 readFileSync 加载一个 JSON 文件的区别

- 是否缓存
	- `require` 会缓存，所以会**常驻内存**
	- `readFileSync` 每次都重新读取，所以 **不常驻内存**
- 文件更新处理
	- `require` 不会感知文件更新，即使外部修改了， 依然是从缓存里获取**旧数据**
	- `readFileSync` 每次都是**最新数据**
- 错误处理
	- `require` 的错误处理，会抛出 `MODULE_NOT_FOUND` 错误
	- `readFileSync` 的错误处理，会抛出 ENOENT 错误（ENOENT = Error NO ENTry（或 Error NO ENTity））
		- 表示系统找不到指定的文件或目录
		- 主要原因包括路径错误、权限问题、异步操作顺序等
- 路径解析
	- require 使用**模块解析**规则
	- `readFileSync` 使用**文件系统**路径
- 实际应用场景
	- require：
		- 配置文件（不需要动态更新）、静态数据、模块化的 JSON 数据
	- `readFileSync`：
		- 文件监控场景、需要动态更新的配置、**大文件处理** 
		- 但大文件建议考虑使用**流式**处理
