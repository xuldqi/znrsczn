# n8n 自动化系统设置指南

## 🚀 快速开始

### 1. 启动系统
```bash
./start-n8n.sh
```

### 2. 访问 n8n 界面
打开浏览器访问: http://localhost:5678

### 3. 导入工作流
在 n8n 中导入以下工作流文件：
- `n8n-workflows/auto-content-generation.json` - 自动内容生成
- `n8n-workflows/intelligent-scraper.json` - 智能爬虫
- `n8n-workflows/multi-platform-publisher.json` - 多平台发布

## 🔧 配置说明

### API 密钥配置

#### 1. OpenAI API Key
- 在 n8n 中添加 OpenAI 凭据
- 用于 AI 内容生成和质量评估

#### 2. Unsplash Access Key
- 获取免费 API Key: https://unsplash.com/developers
- 用于自动获取文章配图

#### 3. 社交媒体 API 配置

**微博 API**
- 申请地址: https://open.weibo.com/
- 需要配置 access_token

**Twitter API**
- 申请地址: https://developer.twitter.com/
- 需要配置 Bearer Token

**小红书 API**
- 需要企业账号申请
- 配置 API Token

**微信公众号 API**
- 申请地址: https://developers.weixin.qq.com/
- 需要配置 access_token

### 4. n8n Webhook 认证
所有 webhook 调用需要使用以下 Header：
```
Authorization: Bearer n8n-webhook-secret-2024
```

## 📊 API 端点

### 内容管理
- `GET /api/n8n/articles/pending` - 获取待发布文章
- `GET /api/n8n/articles/category/:category` - 获取分类文章
- `POST /api/n8n/articles/ai-generated` - 创建 AI 生成文章
- `POST /api/n8n/articles/scraped` - 创建爬虫文章

### 发布管理
- `PUT /api/n8n/articles/:id/publish-status` - 更新发布状态
- `GET /api/n8n/logs` - 查看操作日志
- `GET /api/n8n/health` - 系统健康检查

## 🤖 工作流说明

### 1. 自动内容生成工作流
- **触发器**: 每6小时执行一次
- **功能**: 
  - 获取现有文章作为参考
  - AI 生成新内容
  - 自动匹配配图
  - 保存为草稿
- **输出**: 新的原创文章

### 2. 智能爬虫工作流
- **触发器**: 每12小时执行一次
- **功能**:
  - 爬取知乎、小红书相关内容
  - AI 质量评估（70分以上保留）
  - 内容改写和本地化
  - 去重和分类存储
- **输出**: 高质量的改写文章

### 3. 多平台发布工作流
- **触发器**: 每8小时执行一次
- **功能**:
  - 获取待发布文章
  - 按平台格式化内容
  - 同步发布到多个平台
  - 记录发布状态
- **支持平台**: 微博、Twitter、小红书、微信公众号

## 📝 使用建议

### 内容策略
1. **分类发布**：不同时间发布不同分类内容
2. **质量控制**：定期检查 AI 生成内容质量
3. **人工审核**：重要内容建议人工审核后发布

### 发布时间优化
- **微博**: 工作日 9:00-12:00, 14:00-18:00
- **小红书**: 晚上 19:00-22:00
- **微信公众号**: 晚上 20:00-21:00
- **Twitter**: 根据目标受众时区调整

### 监控和维护
1. **定期检查日志**: `/api/n8n/logs`
2. **监控发布成功率**: 查看各平台发布状态
3. **内容质量评估**: 定期review AI生成内容
4. **API限制管理**: 注意各平台API调用限制

## 🚨 注意事项

### 法律合规
- 确保爬取内容符合版权法规
- 尊重原创作者权益
- 遵守各平台使用条款

### 技术限制
- API 调用频率限制
- 内容长度限制（各平台不同）
- 图片大小和格式限制

### 安全建议
- 定期更换 API 密钥
- 监控异常访问
- 备份重要数据

## 🔄 故障排除

### 常见问题
1. **n8n 无法访问**: 检查 Docker 服务状态
2. **API 调用失败**: 检查认证 Token
3. **发布失败**: 检查平台 API 密钥和权限
4. **爬虫失败**: 检查目标网站访问限制

### 日志查看
```bash
# n8n 日志
docker-compose -f docker-compose.n8n.yml logs -f n8n

# 后端日志
tail -f n8n-webhook.log

# 系统整体日志
docker-compose -f docker-compose.n8n.yml logs -f
```