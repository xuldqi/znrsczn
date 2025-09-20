#!/bin/bash

# 从服务器同步最新代码到本地
# 用于获取服务器上的最新后端代码和数据

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"

echo "🔄 从服务器同步最新代码..."

# 检查服务器连接
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo '✅ 服务器连接正常'" 2>/dev/null; then
    echo "❌ 无法连接到服务器 $SERVER_IP"
    echo "请检查："
    echo "1. 服务器是否在线"
    echo "2. SSH 密钥是否配置正确"
    echo "3. 网络连接是否正常"
    exit 1
fi

echo "📡 连接服务器成功，开始同步..."

# 创建备份目录
BACKUP_DIR="$LOCAL_PROJECT_DIR/backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份当前本地代码
echo "💾 备份当前本地代码到 $BACKUP_DIR"
cp -r "$LOCAL_PROJECT_DIR"/*.js "$BACKUP_DIR/" 2>/dev/null || true
cp -r "$LOCAL_PROJECT_DIR"/*.json "$BACKUP_DIR/" 2>/dev/null || true

# 从服务器下载后端代码
echo "⬇️ 从服务器下载后端API代码..."
if ssh $SERVER_USER@$SERVER_IP "[ -f /var/www/bambumoon-sites/api/server.js ]"; then
    scp $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/api/*.js "$LOCAL_PROJECT_DIR/"
    echo "✅ 后端API代码已下载"
else
    echo "⚠️ 服务器上未找到 /var/www/bambumoon-sites/api/server.js"
    echo "尝试查找其他位置的API代码..."
    
    # 检查其他可能的位置
    ssh $SERVER_USER@$SERVER_IP "find /var/www -name '*.js' -path '*/api/*' -o -name 'server*.js' 2>/dev/null | head -10" || true
fi

# 从服务器下载文章数据
echo "⬇️ 从服务器下载文章数据..."
if ssh $SERVER_USER@$SERVER_IP "[ -f /var/www/bambumoon-sites/api/articles.json ]"; then
    scp $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/api/articles.json "$LOCAL_PROJECT_DIR/"
    echo "✅ 文章数据已下载"
else
    echo "⚠️ 服务器上未找到文章数据文件"
    # 尝试通过API导出数据
    echo "🔄 尝试通过API导出数据..."
    curl -s https://bambumoon.cn/api/articles > "$LOCAL_PROJECT_DIR/articles-from-api.json" && \
    echo "✅ 通过API导出的文章数据已保存到 articles-from-api.json"
fi

echo ""
echo "🎉 同步完成！"
echo "📂 备份位置: $BACKUP_DIR"
echo "🔧 请检查下载的文件并手动合并代码更改"
echo ""
echo "📋 下一步："
echo "1. 检查新下载的后端代码"
echo "2. 启动本地后端服务器"
echo "3. 验证前端连接"