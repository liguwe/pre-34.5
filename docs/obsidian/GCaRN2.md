# 前端工程化 SOP

`#前端工程化`  

## 1. 总结

- 规范与流程
	- 技术栈选型：
		- 框架、构建工具、css框架、状态管理等
	- 项目结构目录规范
		- 知道在哪里改
	- 代码规范
		- eslint
		- prettierrc
	- 流程规范
		- git 工作流
		- git 提交规范
		- 版本规范
	- 组件开发规范
	- 状态管理规范
	- 构建与部署规范
		- 构建配置：抽象出来，脚手架
		- 环境配置
		- ci/cd
- 质量保障
	- 测试规范
	- 性能优化：
		- 各类指标
		- 加载性能
		- 内存使用情况
	- 用户体验
		- 边界错误处理
		- 加载状态
		- 响应式设计
- **清单**
	- 优化清单
		- 加载 → 渲染优化 → 构建优化 
		- 检测各种优化手段是否上了
	- 发布清单 → **需要严格执行**
		-  **发布前**检查
			- [ ] 所有测试通过
			- [ ] 代码审查完成
			- [ ] 性能指标达标
			- [ ] 文档更新完成
			- [ ] **前后端服务依赖关系**
		  - 发布步骤
			1. 更新版本号
			2. 生成更新日志 →  是否自动生成
			3. 构建生产包
			4. 执行部署脚本
			5. 验证部署结果
		  - **发布后**确认
			- [ ] 功能验证
			- [ ] 监控正常
			- [ ] 备份确认
	- 代码审查**清单**
		- 功能性
			- [ ] 功能是否完整实现
			- [ ] 边界条件是否处理
			- [ ] 错误处理是否完善
		- 代码质量
			- [ ] 代码风格符合规范
			- [ ] 命名是否合理
			- [ ] 是否有重复代码
			- [ ] TypeScript 类型完整性
			- [ ]  单元测试覆盖率
			- [ ]  代码复杂度检查
			- [ ]  性能指标达标
		- 性能
			- [ ] 是否有性能隐患
			- [ ] 资源使用是否合理
		- 安全性
			- [ ] 依赖包安全审查
			- [ ] XSS 防护
			- [ ] CSRF 防护
			- [ ] 是否有安全漏洞
			- [ ] 敏感信息是否加密
		- 可维护性
			- [ ] 代码是否易于理解
			- [ ] 注释是否充分
			- [ ] 是否遵循设计模式
		- **工程规范**
			- [ ]  Git提交规范
			- [ ]  代码审查流程
			- [ ]  文档完整性
			- [ ]  构建流程稳定性
- 前端开发全链路
	- 项目初始化 → dev → 联调 → 埋点 → 构建发布 → 性能监控等
	- 每个环节减少人肉，尽量工具化，自动化，关键动作加**卡点**
		- 比如 git 提交动作
		- 构建发布
- 要确保团队成员**都理解并遵循这些规范**
	- 宣讲、文档化、定期更新等

## 2. 项目初始化与规范制定

### 2.1. **技术栈选型**

   ```javascript
   // 示例技术栈配置
   {
     "frontend": {
       "framework": "React/Vue/Angular",
       "buildTool": "Vite/Webpack",
       "cssFramework": "TailwindCSS/SCSS",
       "stateManagement": "Redux/Vuex/Pinia"
     }
   }
   ```

### 2.2. **项目结构规范**

```bash
src/
├── assets/          # 静态资源
├── components/      # 公共组件
│   ├── basic/      # 基础组件
│   └── business/   # 业务组件
├── hooks/          # 自定义 hooks
├── pages/          # 页面组件
├── services/       # API 服务
├── store/          # 状态管理
├── styles/         # 样式文件
├── types/          # TypeScript 类型
└── utils/          # 工具函数
````

### 2.3. **代码规范配置**

```javascript hl:1,13
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    // 项目特定规则
  }
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

## 3. 开发流程规范

### 3.1. **Git 工作流规范**

### 3.2. **提交信息规范**

### 3.3. **版本管理规范**

```json
{
  "version": "1.2.3",
  "versionStrategy": {
    "major": "重大更新，不兼容的 API 修改",
    "minor": "新功能，向下兼容",
    "patch": "问题修复，向下兼容"
  }
}
```

## 4. 组件开发规范

### 4.1. **组件设计原则**

- 组件开发规范
- 组件文档示例

```javascript
// 标准组件结构
interface Props {
  // 明确的类型定义
  data: UserData;
  onAction: (id: string) => void;
}

const Component: React.FC<Props> = ({ data, onAction }) => {
  // 1. Hooks声明
  const [state, setState] = useState();
  
  // 2. 业务逻辑处理
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, []);
  
  // 3. 渲染逻辑
  return (
    <div>
      {/* JSX结构 */}
    </div>
  );
};

// 导出
export default memo(Component);
```

### 4.2. **状态管理规范** 

## 5. 构建与部署规范

### 5.1. **构建配置**

### 5.2. **环境配置**

### 5.3. **CI/CD 配置**

## 6. 测试规范

### 6.1. **单元测试**

### 6.2. **集成测试规范**

## 7. 性能优化规范

### 7.1. **性能指标**

```javascript
// 性能监控配置
{
  "metrics": {
    "FCP": "First Contentful Paint < 1.8s",
    "LCP": "Largest Contentful Paint < 2.5s",
    "FID": "First Input Delay < 100ms",
    "CLS": "Cumulative Layout Shift < 0.1"
  }
}
```

1. **性能监控**
    - 首屏加载时间
    - 交互响应时间
    - 资源加载性能
    - 内存使用情况
2. **用户体验优化**
    - 加载状态处理
    - 错误边界处理
    - 响应式设计
    - 可访问性优化

### 7.2. **优化清单**

  - 加载优化
	  - 路由懒加载
	  - 图片懒加载
	  - 代码分割
	  - 资源预加载
  - 渲染优化
	  - 虚拟列表
	  - 防抖节流
	  - 组件缓存
- 构建优化
	- Tree Shaking
	- 压缩资源
	- 缓存策略
	- CDN 部署

## 8. 文档规范

### 8.1. **代码注释规范**

```typescript
/**
 * @function formatDate
 * @description 格式化日期
 * @param {Date} date - 要格式化的日期
 * @param {string} [format='YYYY-MM-DD'] - 日期格式
 * @returns {string} 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY/MM/DD')
 */
```

### 8.2. **API 文档规范**

## 9. 监控与日志规范（质量保证体系）

### 9.1. **错误监控**

```typescript
// 错误监控配置
window.onerror = function(message, source, lineno, colno, error) {
  // 上报错误信息
  reportError({
    type: 'javascript',
    message,
    source,
    lineno,
    colno,
    error: error?.stack
  });
};

// React 错误边界
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // 上报错误信息
    reportError({
      type: 'react',
      error,
      errorInfo
    });
  }
}

// 监控配置示例
const monitor = {
  error: (error: Error) => {
    // 错误上报
    errorTracker.capture(error);
    // 日志记录
    logger.error(error);
  },
  
  performance: (metrics: PerformanceMetrics) => {
    // 性能指标上报
    performanceTracker.track(metrics);
  }
};

```

### 9.2. **性能监控**

```typescript hl:2
// 性能监控实现
const performanceObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    // 上报性能指标
    reportPerformance({
      name: entry.name,
      value: entry.startTime,
      type: entry.entryType
    });
  });
});

performanceObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
```

## 10. 发布流程规范

### 10.1. **发布清单**

  - 发布前检查
	- [ ] 所有测试通过
	- [ ] 代码审查完成
	- [ ] 性能指标达标
	- [ ] 文档更新完成
  - 发布步骤
	1. 更新版本号
	2. 生成更新日志
	3. 构建生产包
	4. 执行部署脚本
	5. 验证部署结果
  - 发布后确认
	- [ ] 功能验证
	- [ ] 监控正常
	- [ ] 备份确认

### 10.2. **版本发布脚本**

```bash hl:7
`#!/bin/bash`
# release.sh

# 更新版本号
npm version patch

# 生成更新日志
conventional-changelog -p angular -i CHANGELOG.md -s

# 构建
npm run build

# 部署
npm run deploy
```

## 11. 团队协作规范

### 11.1. **代码审查清单**

  - 代码审查要点
	  - 功能性
		  - [ ] 功能是否完整实现
		  - [ ] 边界条件是否处理
		  - [ ] 错误处理是否完善
	  - 代码质量
		  - [ ] 代码风格符合规范
		  - [ ] 命名是否合理
		  - [ ] 是否有重复代码
		  - [ ] TypeScript 类型完整性
	    - [ ]  单元测试覆盖率
	    - [ ]  代码复杂度检查
	    - [ ]  性能指标达标
	  - 性能
		  - [ ] 是否有性能隐患
		  - [ ] 资源使用是否合理
	  - 安全性
		  - [ ] 依赖包安全审查
		  - [ ] XSS 防护
		  - [ ] CSRF 防护
		  - [ ] 是否有安全漏洞
		  - [ ] 敏感信息是否加密
	  - 可维护性
		  - [ ] 代码是否易于理解
		  - [ ] 注释是否充分
		  - [ ] 是否遵循设计模式
	- **工程规范**
	    - [ ]  Git提交规范
	    - [ ]  代码审查流程
	    - [ ]  文档完整性
	    - [ ]  构建流程稳定性

### 11.2. **团队协作工具配置**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 12. 工程化工具链

1. **开发工具**
    - VS Code + 插件配置
    - Chrome DevTools
    - Postman / Insomnia
2. **自动化工具**
    - CI/CD：Jenkins/GitHub Actions
    - 自动化测试：Jest/Cypress
    - 代码分析：SonarQube

## 13. 最后

这个 SOP 涵盖了前端工程化的主要方面，可以根据具体项目需求进行调整和扩展。

关键是要确保团队成员都理解并遵循这些规范，持续改进工程化流程。建议将**这些规范文档化，并定期更新和优化**。

- 先梳理好我们自己的东西，比如`整个研发生命周期流程`链路；
- 然后在流程里`找可优化的点`，并去调研或者看社区有没有能借力的，看是否需要二次开发


![图片](https://832-1310531898.cos.ap-beijing.myqcloud.com/999.%20Obsidian@832/files/20241028-4.png)
