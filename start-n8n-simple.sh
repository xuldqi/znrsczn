#!/bin/bash

# 简化版 n8n 启动脚本 - 不使用 Docker Compose

echo "🚀 启动简化版 n8n 系统..."

# 检查后端服务器
if curl -s http://localhost:1337/api/articles > /dev/null 2>&1; then
    echo "✅ 后端 API 运行正常 (http://localhost:1337)"
else
    echo "🔧 启动后端服务器..."
    cd "$(dirname "$0")"
    node server-n8n-enhanced.cjs &
    sleep 3
    if curl -s http://localhost:1337/api/articles > /dev/null 2>&1; then
        echo "✅ 后端 API 启动成功"
    else
        echo "❌ 后端 API 启动失败"
        exit 1
    fi
fi

# 启动 n8n (简化版，使用 SQLite)
echo "🤖 启动 n8n (简化版)..."

# 设置 n8n 环境变量
export N8N_HOST=localhost
export N8N_PORT=5678
export N8N_PROTOCOL=http
export GENERIC_TIMEZONE=Asia/Shanghai
export N8N_USER_MANAGEMENT_DISABLED=true
export N8N_ENCRYPTION_KEY=mySecretEncryptionKey2024

# 检查 n8n 是否已安装
if ! command -v n8n &> /dev/null; then
    echo "📦 安装 n8n..."
    npm install -g n8n
fi

# 创建 n8n 数据目录
mkdir -p ~/.n8n/workflows

# 启动 n8n
echo "⚡ 启动 n8n 服务..."
n8n start --tunnel &
N8N_PID=$!

# 等待 n8n 启动
echo "⏳ 等待 n8n 启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."

if curl -f http://localhost:5678 > /dev/null 2>&1; then
    echo "✅ n8n 运行正常 (http://localhost:5678)"
else
    echo "⚠️ n8n 可能还在启动中，请稍等..."
fi

if curl -f http://localhost:1337/api/n8n/health -H "Authorization: Bearer n8n-webhook-secret-2024" > /dev/null 2>&1; then
    echo "✅ n8n Webhook API 正常"
else
    echo "❌ n8n Webhook API 异常"
fi

echo ""
echo "🎉 简化版 n8n 系统启动完成！"
echo ""
echo "📊 访问地址："
echo "  - n8n 工作流编辑器: http://localhost:5678"
echo "  - 文章管理后台: http://localhost:1337/admin.html"
echo ""
echo "📝 下一步："
echo "  1. 访问 n8n 界面导入工作流"
echo "  2. 配置 DeepSeek API 凭据"
echo "  3. 测试工作流运行"
echo ""
echo "💡 提示："
echo "  - 这是简化版，使用 SQLite 数据库"
echo "  - 如需完整版请等待 Docker 镜像下载完成"
echo "  - 停止服务: kill $N8N_PID"