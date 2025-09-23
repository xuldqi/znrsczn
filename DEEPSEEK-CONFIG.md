# 🤖 DeepSeek API 配置指南

## 📋 配置清单

你需要配置这些文件来使用DeepSeek：

### 1. **基础配置文件**

运行配置助手创建 `.env` 文件：
```bash
./configure-n8n.sh
```

在 `.env` 文件中添加：
```env
# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
```

### 2. **n8n 工作流配置**

工作流文件已更新支持DeepSeek：
- ✅ `n8n-workflows/auto-content-generation.json` - AI内容生成
- ✅ `n8n-workflows/intelligent-scraper.json` - 智能爬虫  
- ✅ `n8n-workflows/multi-platform-publisher.json` - 多平台发布

### 3. **n8n 界面配置**

启动系统后在 http://localhost:5678 中：

#### a) 创建 DeepSeek 凭据
1. 点击 "Settings" → "Credentials"
2. 点击 "Add Credential"
3. 选择 "HTTP Header Auth"
4. 填入：
   - **名称**: `DeepSeek API`
   - **Header Name**: `Authorization`  
   - **Header Value**: `Bearer sk-your-deepseek-api-key`

#### b) 导入工作流
1. 点击左侧 "Workflows"
2. 点击 "Import from File"
3. 依次导入3个工作流文件
4. 在每个工作流中分配 "DeepSeek API" 凭据

## 🔑 获取 DeepSeek API Key

### 注册流程
1. 访问：https://platform.deepseek.com/
2. 注册账号并验证
3. 进入控制台：https://platform.deepseek.com/api_keys
4. 创建新的API Key
5. 复制API Key（格式：sk-xxxxxxxx）

### 定价说明
- DeepSeek 提供免费额度
- 按Token计费，比OpenAI便宜很多
- 详见：https://platform.deepseek.com/pricing

## ⚡ 快速测试

### 测试DeepSeek API连接
```bash
# 测试API是否正常
curl -X POST "https://api.deepseek.com/v1/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "你好，请简单介绍一下自己"}
    ],
    "max_tokens": 100
  }'
```

### 启动系统测试
```bash
# 1. 配置 DeepSeek API Key
nano .env

# 2. 启动系统
./start-n8n.sh

# 3. 访问 n8n 界面
open http://localhost:5678
```

## 🔧 工作流中的 DeepSeek 配置

### 自动内容生成工作流
- 使用 `deepseek-chat` 模型
- Temperature: 0.7（创意性）
- Max tokens: 2000（适合长文章）

### 智能爬虫工作流  
- 质量评估：Temperature 0.3（准确性）
- 内容改写：Temperature 0.7（创意性）

### 多平台发布工作流
- 使用现有的内容，无需额外AI调用

## 💰 成本优化建议

### DeepSeek vs OpenAI
- **DeepSeek**: ~¥0.001/1K tokens
- **OpenAI GPT-4**: ~¥0.2/1K tokens  
- **节省**: 约 200倍成本优势

### 使用建议
1. **免费额度**: 新用户有免费试用额度
2. **成本控制**: 设置合理的max_tokens限制
3. **批量处理**: 一次处理多篇文章更经济

## 🚨 注意事项

1. **API限制**: 遵守DeepSeek的调用频率限制
2. **内容质量**: DeepSeek在中文内容生成方面表现优秀
3. **模型选择**: 目前主要使用 `deepseek-chat` 模型
4. **错误处理**: 工作流中已包含错误重试机制

## 🔍 常见问题

### Q: DeepSeek API Key无效？
A: 检查API Key格式（sk-开头）和余额

### Q: 内容生成质量如何？
A: DeepSeek在中文内容生成方面表现出色，特别适合中年人相关内容

### Q: 可以和OpenAI混用吗？
A: 可以，但需要在工作流中选择使用哪个API

### Q: 成本控制？
A: 在 `.env` 中设置token限制和调用频率

运行 `./configure-n8n.sh` 开始配置！