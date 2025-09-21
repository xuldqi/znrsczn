#!/bin/bash

# n8n 自动化系统启动脚本
# 用于启动和管理 n8n 及相关服务

echo "🚀 启动 n8n 自动化系统..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查端口占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️ 端口 $port 已被占用"
        return 1
    fi
    return 0
}

# 停止现有服务（如果存在）
echo "🛑 停止现有服务..."
docker-compose -f docker-compose.n8n.yml down 2>/dev/null

# 创建必要的目录
echo "📁 创建必要目录..."
mkdir -p n8n-workflows n8n-backups
chmod 755 n8n-workflows n8n-backups

# 启动服务
echo "⚡ 启动 n8n 和相关服务..."
docker-compose -f docker-compose.n8n.yml up -d

# 等待服务启动
echo "⏳ 等待服务启动（30秒）..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose -f docker-compose.n8n.yml ps

# 启动增强版后端服务器
echo "🔧 启动增强版后端服务器..."
if ! check_port 1337; then
    echo "⚠️ 端口 1337 被占用，请检查现有服务"
else
    node server-n8n-enhanced.js &
    SERVER_PID=$!
    echo "✅ 后端服务器已启动 (PID: $SERVER_PID)"
fi

# 等待后端服务器启动
sleep 5

# 检查服务是否正常运行
echo "🏥 健康检查..."

# 检查 n8n
if curl -f http://localhost:5678 > /dev/null 2>&1; then
    echo "✅ n8n 运行正常 (http://localhost:5678)"
else
    echo "❌ n8n 启动失败"
fi

# 检查后端 API
if curl -f http://localhost:1337/api/articles > /dev/null 2>&1; then
    echo "✅ 后端 API 运行正常 (http://localhost:1337)"
else
    echo "❌ 后端 API 启动失败"
fi

# 检查 Redis
if docker exec pmsaveself-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis 运行正常"
else
    echo "❌ Redis 启动失败"
fi

# 检查 PostgreSQL
if docker exec pmsaveself-postgres pg_isready -U n8n > /dev/null 2>&1; then
    echo "✅ PostgreSQL 运行正常"
else
    echo "❌ PostgreSQL 启动失败"
fi

echo ""
echo "🎉 n8n 自动化系统启动完成！"
echo ""
echo "📊 访问地址："
echo "  - n8n 工作流编辑器: http://localhost:5678"
echo "  - 文章管理后台: http://localhost:1337/admin.html"
echo "  - API 文档: http://localhost:1337/api"
echo ""
echo "🔧 管理命令："
echo "  - 查看日志: docker-compose -f docker-compose.n8n.yml logs -f"
echo "  - 停止服务: docker-compose -f docker-compose.n8n.yml down"
echo "  - 重启服务: ./start-n8n.sh"
echo ""
echo "🔑 API 认证信息："
echo "  - Webhook Token: Bearer n8n-webhook-secret-2024"
echo "  - 使用此 Token 进行 n8n webhook 调用"
echo ""
echo "📝 工作流导入："
echo "  1. 访问 http://localhost:5678"
echo "  2. 导入 n8n-workflows/ 目录下的工作流文件"
echo "  3. 配置各平台的 API 密钥"
echo ""

# 显示重要提醒
echo "⚠️ 重要提醒："
echo "  - 请在 n8n 中配置各平台的 API 密钥"
echo "  - 请设置 OpenAI API Key 用于 AI 内容生成"
echo "  - 请配置 Unsplash Access Key 用于图片获取"
echo "  - 首次使用需要在 n8n 中导入工作流文件"