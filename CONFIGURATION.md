# 🔧 n8n 自动化系统配置清单

## 📁 需要配置的文件

### 1. **`.env` 配置文件** (主要配置)
```bash
# 运行配置助手创建
./configure-n8n.sh
```

**必需配置项：**
- `DEEPSEEK_API_KEY` - AI内容生成（必需）

**可选配置项：**
- `WEIBO_ACCESS_TOKEN` - 微博发布
- `TWITTER_BEARER_TOKEN` - Twitter发布  
- `XIAOHONGSHU_TOKEN` - 小红书发布
- `WECHAT_ACCESS_TOKEN` - 微信公众号发布
- `UNSPLASH_ACCESS_KEY` - 自动配图

### 2. **n8n工作流配置** (启动后在界面配置)

需要导入的工作流文件：
- `n8n-workflows/auto-content-generation.json`
- `n8n-workflows/intelligent-scraper.json`  
- `n8n-workflows/multi-platform-publisher.json`

### 3. **API凭据配置** (在n8n界面中创建)

#### HTTP Header Auth 凭据
- **名称**: `API认证`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer n8n-webhook-secret-2024`

#### OpenAI 凭据
- **API Key**: 你的DeepSeek API密钥

## 🚀 快速配置步骤

### 第一步：基础配置
```bash
# 1. 运行配置助手
./configure-n8n.sh

# 2. 编辑 .env 文件，至少添加 DeepSeek API Key
nano .env
```

### 第二步：启动系统
```bash
./start-n8n.sh
```

### 第三步：n8n界面配置
1. 访问 http://localhost:5678
2. 点击 "Settings" → "Credentials" 
3. 创建 "HTTP Header Auth" 凭据
4. 创建 "OpenAI" 凭据（输入DeepSeek API Key）
5. 导入3个工作流文件
6. 在工作流中分配凭据

## 🔑 API密钥获取

| 平台 | 获取地址 | 用途 |
|------|----------|------|
| DeepSeek | https://platform.deepseek.com/api_keys | AI内容生成 |
| Unsplash | https://unsplash.com/developers | 自动配图 |
| 微博 | https://open.weibo.com/ | 微博发布 |
| Twitter | https://developer.twitter.com/ | Twitter发布 |
| 微信公众号 | https://developers.weixin.qq.com/ | 公众号发布 |

## ⚠️ 重要提醒

1. **最低配置**: 只需配置 `DEEPSEEK_API_KEY` 就可以启动AI内容生成
2. **逐步配置**: 可以先启动系统，后续逐个添加社交媒体API
3. **安全性**: 所有API密钥都存储在本地，不会上传到GitHub
4. **测试模式**: 建议先用测试API密钥验证系统正常运行

## 🔧 配置文件说明

- `.env` - 主配置文件（不会提交到Git）
- `.env.template` - 配置模板（已提交）
- `configure-n8n.sh` - 配置助手脚本
- `start-n8n.sh` - 启动脚本

运行 `./configure-n8n.sh` 获取详细的配置指导！