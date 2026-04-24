# 小程序的安全合规和性能优化

`#小程序` `#移动端` `#跨端` 


## 总结

- 安全合规
	- 手机号，身份证号等脱密或加密
	- 使用 HTTPS
	- 用户授权
	- 用于完善会员资料
		- 必须说明用途
	- 内容安全
		- 用户生成内容(UGC)需要审核
		- 图片、文字等内容需要做敏感词过滤
	- 隐私政策和用户协议、营业资质
- 性能优化
	- 启动性能优化
		- 代码包体积优化
		- 首屏加载优化
		- 拆包
		- 预加载分包
	- 渲染优化
		- 避免不必要的渲染
		- 长列表优化
	- 网络优化
		- 请求优化
			- 请求合并
			- 数据缓存
			- 图片懒加载
		- 内存优化
			- 及时清理不需要的事件监听
			- 大对象及时释放
	- 体验优化
		- 使用骨架屏提升体验
		- 加载状态
		- 操作结果反馈z
- 监控与统计
	- 性能监控及错误上报
	- 启动时间
	- 页面切换时间
	- 内存占用
	- 帧率（FPS）
	- 页面访问量
## 一、安全合规

### 1. 数据安全

- 敏感信息处理
	- 手机号、身份证等敏感信息需要加密存储
	- 传输过程中使用 HTTPS
	- 本地存储(Storage)中不能保存敏感信息
- 用户授权
	- 获取用户信息需要明确告知用途
	- 遵循最小权限原则
	- 提供取消授权的选项

### 2. 隐私合规

```javascript
// 获取用户信息示例
wx.getUserProfile({
  desc: '用于完善会员资料', // 必须说明用途
  success: (res) => {
    // 处理用户信息
  }
})
```

### 3. 内容安全

- 用户生成内容(UGC)需要审核
- 图片、文字等内容需要做敏感词过滤
- 实现内容举报功能

### 4. 合规要求

- 隐私政策和用户协议
- 备案信息展示
- 营业资质展示（如有）

## 二、性能优化

### 1. 启动性能优化

#### 代码包体积优化

```javascript
// 1. 及时清理无用代码和资源
// 2. 使用分包加载
{
  "subpackages": [
    {
      "root": "pages/secondary/",
      "pages": [
        "detail/detail"
      ]
    }
  ]
}

// 3. 图片资源压缩
// 4. 使用 webpack 压缩
```

#### 首屏加载优化

- 预加载分包
```javascript
// app.json
{
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["secondary"]
    }
  }
}
```

### 2. 渲染性能优化

#### 避免不必要的渲染

```javascript
// 使用 pure 组件
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  }
})

// 合理使用 setData
// 错误示例
this.data.list.forEach((item, index) => {
  this.setData({
    [`list[${index}].checked`]: true
  })
})

// 正确示例
const { list } = this.data
list.forEach(item => {
  item.checked = true
})
this.setData({ list })
```

#### 长列表优化

```javascript
// 使用虚拟列表
<scroll-view>
  <view wx:for="{{visibleData}}" wx:key="id">
    <!-- 只渲染可视区域的数据 -->
  </view>
</scroll-view>
```

### 3. 网络优化

#### 请求优化

```javascript
// 1. 请求合并
// 2. 数据缓存
const cacheKey = 'cache_key'
// 获取数据
function getData() {
  const cache = wx.getStorageSync(cacheKey)
  if (cache && !isExpired(cache.timestamp)) {
    return cache.data
  }
  // 请求新数据
  return requestNewData()
}

// 3. 图片懒加载
<image lazy-load src="{{imageUrl}}" />
```

### 4. 内存优化

```javascript
// 1. 及时清理不需要的事件监听
Page({
  onLoad() {
    wx.onAccelerometerChange(this.handleAccelerometer)
  },
  onUnload() {
    wx.stopAccelerometer() // 记得清理
  }
})

// 2. 大对象及时释放
// 3. 避免内存泄漏
```

### 5. 体验优化

#### 骨架屏

```javascript
// 1. 使用骨架屏提升体验
<view wx:if="{{loading}}">
  <view class="skeleton-item"></view>
</view>
```

#### 状态反馈

```javascript
// 加载状态
wx.showLoading({
  title: '加载中'
})

// 操作结果反馈
wx.showToast({
  title: '操作成功',
  icon: 'success'
})
```

## 三、监控与统计

### 1. 性能监控及错误上报

- 启动时间
- 页面切换时间
- 内存占用
- 帧率（FPS）

```javascript hl:1,7,10
// 1. 使用小程序性能监控
const performance = wx.getPerformance()
const observer = performance.createObserver((entryList) => {
  console.log(entryList.getEntries())
})

// 2. 内存查看器 
wx.getMemoryInfo()

// 3. 错误监控
wx.onError(function(err) {
  // 上报错误
})
```

### 2. 数据统计

- 页面访问量
- 用户行为跟踪
- 性能指标收集

## 四、最佳实践建议

1. 开发规范
   - 统一的代码风格
   - 组件化开发
   - 模块化管理
2. 测试
   - 功能测试
   - 性能测试
   - 兼容性测试
3. 持续优化
   - 定期代码审查
   - 性能指标监控
   - 用户反馈收集
4. 文档维护
   - API 文档
   - 组件文档
   - 更新日志
