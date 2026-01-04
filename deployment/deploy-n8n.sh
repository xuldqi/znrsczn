#!/bin/bash

# n8n 自动化系统服务器部署脚本
# 在 bambumoon.cn 服务器上部署 n8n 工作流系统

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"
N8N_DOMAIN="n8n.bambumoon.cn"

echo "🚀 开始部署 n8n 到服务器 $SERVER_IP..."

# 检查本地文件
if [ ! -d "$LOCAL_PROJECT_DIR" ]; then
    echo "❌ 本地项目目录不存在: $LOCAL_PROJECT_DIR"
    exit 1
fi

# 测试服务器连接
echo "🔍 测试服务器连接..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    echo "❌ 无法连接到服务器，请检查 SSH 配置"
    exit 1
fi

# 在服务器上创建目录结构
echo "📁 在服务器上创建 n8n 目录..."
ssh $SERVER_USER@$SERVER_IP "
    mkdir -p /var/www/n8n-system
    mkdir -p /var/www/n8n-system/workflows
    mkdir -p /var/www/n8n-system/backups
    mkdir -p /var/www/n8n-system/config
"

# 上传项目文件
echo "📤 上传 n8n 系统文件..."
rsync -avz --delete "$LOCAL_PROJECT_DIR/" $SERVER_USER@$SERVER_IP:/var/www/n8n-system/ \
    --exclude node_modules \
    --exclude dist \
    --exclude .git \
    --exclude .npm

# 上传部署配置
echo "📤 上传部署配置..."
rsync -avz "$LOCAL_PROJECT_DIR/deployment/docker-compose.n8n.yml" $SERVER_USER@$SERVER_IP:/var/www/n8n-system/docker-compose.yml
rsync -avz "$LOCAL_PROJECT_DIR/Dockerfile" $SERVER_USER@$SERVER_IP:/var/www/n8n-system/

# 在服务器上安装 Docker 和 Docker Compose
echo "🐳 在服务器上安装 Docker..."
ssh $SERVER_USER@$SERVER_IP "
    # 使用便利脚本安装 Docker
    if ! command -v docker &> /dev/null; then
        apt update
        apt install -y curl ca-certificates
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl enable docker
        systemctl start docker
        rm get-docker.sh
    fi

    # 安装 Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        apt install -y docker-compose || {
            # 如果 apt 安装失败，使用官方下载
            COMPOSE_VERSION=\$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '\"' -f 4)
            curl -L \"https://github.com/docker/compose/releases/download/\$COMPOSE_VERSION/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
        }
    fi

    # 检查 Docker 状态
    docker --version
    docker-compose --version
    systemctl status docker --no-pager -l

    echo '✅ Docker 安装完成'
"

# 启动 n8n 系统
echo "🚀 启动 n8n 系统..."
ssh $SERVER_USER@$SERVER_IP "
    cd /var/www/n8n-system

    # 停止现有容器
    docker-compose down 2>/dev/null || true

    # 拉取镜像并启动服务
    docker-compose pull
    docker-compose up -d

    echo '✅ n8n 系统启动完成'
"

# 配置 Nginx 反向代理
echo "🔧 配置 Nginx 反向代理..."
cat > /tmp/n8n-nginx.conf << 'EOF'
server {
    listen 80;
    server_name n8n.bambumoon.cn;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}

server {
    listen 80;
    server_name api.bambumoon.cn;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 上传并配置 Nginx
scp /tmp/n8n-nginx.conf $SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/n8n
ssh $SERVER_USER@$SERVER_IP "
    ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 获取 SSL 证书
echo "🔒 获取 SSL 证书..."
ssh $SERVER_USER@$SERVER_IP "
    certbot --nginx -d $N8N_DOMAIN -d api.bambumoon.cn --non-interactive --agree-tos --email admin@bambumoon.cn || true
    systemctl reload nginx
"

# 健康检查
echo "🏥 执行健康检查..."
sleep 10

echo "检查服务状态:"

# 检查 n8n
if curl -f -s --connect-timeout 10 http://$N8N_DOMAIN > /dev/null 2>&1; then
    echo "✅ n8n 工作流引擎 (http://$N8N_DOMAIN) 正常"
else
    echo "⚠️ n8n 可能还在启动中"
fi

# 检查 API
if curl -f -s --connect-timeout 10 http://api.bambumoon.cn/api/articles > /dev/null 2>&1; then
    echo "✅ API 服务器 (http://api.bambumoon.cn) 正常"
else
    echo "⚠️ API 服务器可能还在启动中"
fi

# 显示容器状态
echo ""
echo "📊 Docker 容器状态:"
ssh $SERVER_USER@$SERVER_IP "
    cd /var/www/n8n-system
    docker-compose ps
"

echo ""
echo "🎉 n8n 系统部署完成！"
echo ""
echo "📝 访问地址:"
echo "n8n 工作流编辑器: http://$N8N_DOMAIN (https://$N8N_DOMAIN)"
echo "API 管理后台: http://api.bambumoon.cn/admin.html"
echo "API 接口: http://api.bambumoon.cn/api/"
echo ""
echo "📋 下一步:"
echo "1. 配置域名 DNS: $N8N_DOMAIN -> $SERVER_IP"
echo "2. 配置域名 DNS: api.bambumoon.cn -> $SERVER_IP"
echo "3. 在 n8n 中导入工作流文件"
echo "4. 配置各平台的 API 密钥"
echo ""
echo "🔧 管理命令:"
echo "查看日志: ssh $SERVER_USER@$SERVER_IP 'cd /var/www/n8n-system && docker-compose logs -f'"
echo "重启服务: ssh $SERVER_USER@$SERVER_IP 'cd /var/www/n8n-system && docker-compose restart'"
echo "更新部署: bash deployment/deploy-n8n.sh"

rm /tmp/n8n-nginx.conf