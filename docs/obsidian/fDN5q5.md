# DevOps 开源项目

`#devops`

## 1. 总结

- CI&CD 工具
	- Jenkins
	- GitLab CI
	- DroneCI
- 监控与日志
	- Prometheus
	- Grafana
	- ELK Stack
		- Elasticsearch
		- Logstash
		- Kibana
- 制片库
	- Harbor
	- Nexus

## 2. 持续集成/持续部署 (CI/CD)

1. **Jenkins**
	- 最流行的开源 CI/CD 工具
	- 丰富的插件生态系统
	- 支持多种构建类型和部署方式
	- 适合各种规模的项目
2. **GitLab CI**
	- 与 GitLab 深度集成
	- 配置简单，使用 YAML 文件
	- 支持 Docker 原生
	- 自动化部署流程完整
3. **DroneCI**
	- 基于 Docker 的现代 CI/CD 平台
	- 配置简单，性能优秀
	- 支持多种代码托管平台

## 3. 容器编排与管理

1. **Kubernetes (K8s)**
	- 容器编排的事实标准
	- 自动化部署、扩展和管理容器化应用
	- 强大的生态系统
2. **Rancher**
	- 企业级容器管理平台
	- 简化 Kubernetes 操作
	- 提供友好的 Web UI

## 4. 监控与日志

1. **Prometheus**
	- 开源监控系统和时间序列数据库
	- 强大的查询语言 PromQL
	- 广泛的集成支持
2. **Grafana**
	- 优秀的可视化和监控平台
	- 支持多种数据源
	- 丰富的仪表盘模板
3. **ELK Stack**
	- Elasticsearch：搜索和分析引擎
	- Logstash：日志收集和处理
	- Kibana：数据可视化

## 5. 配置管理

1. **Ansible**
	- 简单易用的自动化工具
	- 无需客户端安装
	- 使用 YAML 描述任务
2. **Terraform**
	- 基础设施即代码（IaC）工具
	- 支持多云环境
	- 声明式配置

## 6. 服务网格

1. **Istio**
	- 强大的服务网格平台
	- 提供流量管理、安全性和可观察性
	- 与 Kubernetes 深度集成
2. **Linkerd**
	- 轻量级服务网格
	- 易于使用和维护
	- 性能优秀

## 7. 安全扫描

1. **SonarQube**
	- 代码质量和安全性分析
	- 支持多种编程语言
	- 提供详细的报告和建议
2. **Trivy**
	- 容器安全扫描工具
	- 简单易用
	- 支持多种漏洞数据库

## 8. 制品库

1. **Harbor**
	- 企业级容器镜像仓库
	- 支持多租户
	- 提供安全扫描功能
2. **Nexus**
	- 通用制品仓库
	- 支持多种包格式
	- 可作为代理缓存
