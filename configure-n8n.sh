#!/bin/bash

# n8n 配置助手脚本
# 帮助用户快速配置所有必要的文件

echo "🔧 n8n 自动化系统配置助手"
echo "========================================"

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "📝 创建配置文件..."
    cp .env.template .env
    echo "✅ 已创建 .env 配置文件，请编辑此文件填入你的API密钥"
    echo ""
fi

echo "📋 需要配置的文件清单："
echo ""

echo "1. 【必需】编辑 .env 文件"
echo "   文件位置: $(pwd)/.env"
echo "   必需配置: DEEPSEEK_API_KEY"
echo "   可选配置: 各社交媒体平台API密钥"
echo ""

echo "2. 【可选】修改 docker-compose.n8n.yml"
echo "   - 更改数据库密码"
echo "   - 调整端口配置"
echo "   - 修改时区设置"
echo ""

echo "3. 【启动后】在 n8n 界面中配置："
echo "   - 导入工作流文件"
echo "   - 创建API凭据"
echo "   - 设置平台认证"
echo ""

echo "🔑 API 密钥获取地址："
echo "========================================"
echo "DeepSeek:    https://platform.deepseek.com/api_keys"
echo "Unsplash:    https://unsplash.com/developers"
echo "微博开放平台:  https://open.weibo.com/"
echo "Twitter API: https://developer.twitter.com/"
echo "微信公众平台:  https://developers.weixin.qq.com/"
echo ""

echo "⚡ 快速配置步骤："
echo "========================================"
echo "1. 编辑 .env 文件，至少填入 DEEPSEEK_API_KEY"
echo "2. 运行: ./start-n8n.sh"
echo "3. 访问: http://localhost:5678"
echo "4. 导入 n8n-workflows/ 中的工作流文件"
echo "5. 在 n8n 中配置凭据和API密钥"
echo ""

# 检查必需的API密钥
if [ -f ".env" ]; then
    echo "🔍 检查当前配置状态："
    echo "========================================"
    
    # 检查 DeepSeek API Key
    if grep -q "DEEPSEEK_API_KEY=sk-" .env; then
        echo "✅ DeepSeek API Key 已配置"
    else
        echo "❌ DeepSeek API Key 未配置（必需）"
    fi
    
    # 检查其他API密钥
    apis=("WEIBO_ACCESS_TOKEN" "TWITTER_BEARER_TOKEN" "XIAOHONGSHU_TOKEN" "WECHAT_ACCESS_TOKEN")
    configured=0
    
    for api in "${apis[@]}"; do
        if grep -q "${api}=.*[^=]$" .env && ! grep -q "${api}=your-" .env; then
            configured=$((configured + 1))
        fi
    done
    
    echo "📱 社交媒体API: ${configured}/4 已配置"
    
    if [ $configured -eq 0 ]; then
        echo "⚠️  未配置社交媒体API，将无法自动发布到各平台"
    fi
    
    echo ""
fi

echo "📚 详细文档："
echo "========================================"
echo "完整配置指南: $(pwd)/N8N-SETUP.md"
echo "启动命令: ./start-n8n.sh"
echo "停止命令: docker-compose -f docker-compose.n8n.yml down"
echo ""

echo "💡 提示："
echo "- 首次使用建议只配置 DeepSeek API Key 进行测试"
echo "- 社交媒体API可以后续逐个添加"
echo "- 所有配置可以在运行时在 n8n 界面中修改"