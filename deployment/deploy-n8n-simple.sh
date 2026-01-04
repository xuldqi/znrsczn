#!/bin/bash

# n8n 无 Docker 部署脚本
# 直接在服务器上安装并运行 n8n

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"
N8N_DOMAIN="n8n.bambumoon.cn"

echo "🚀 开始在服务器上直接安装 n8n..."

# 测试服务器连接
echo "🔍 测试服务器连接..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    echo "❌ 无法连接到服务器"
    exit 1
fi

# 在服务器上安装 Node.js 20 和 n8n
echo "📦 在服务器上安装 Node.js 20 和 n8n..."
ssh $SERVER_USER@$SERVER_IP "
    # 安装 Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt update
    apt install -y nodejs

    # 验证安装
    node --version
    npm --version

    # 全局安装 n8n
    npm install -g n8n@latest

    # 创建 n8n 系统用户
    useradd -r -s /bin/false -d /var/lib/n8n n8n || true
    mkdir -p /var/lib/n8n
    chown -R n8n:n8n /var/lib/n8n

    # 创建工作目录
    mkdir -p /var/www/n8n-system/workflows
    mkdir -p /var/www/n8n-system/backups
    chown -R n8n:n8n /var/www/n8n-system
"

# 上传项目文件到服务器
echo "📤 上传项目文件..."
rsync -avz "$LOCAL_PROJECT_DIR/" $SERVER_USER@$SERVER_IP:/var/www/n8n-system/ \
    --exclude node_modules \
    --exclude dist \
    --exclude .git \
    --exclude .npm

# 创建 n8n systemd 服务
echo "🔧 创建 n8n 服务配置..."
cat > /tmp/n8n.service << 'EOF'
[Unit]
Description=n8n - Workflow Automation Platform
After=network.target

[Service]
Type=simple
User=n8n
WorkingDirectory=/var/lib/n8n
Environment=N8N_HOST=localhost
Environment=N8N_PORT=5678
Environment=N8N_PROTOCOL=http
Environment=GENERIC_TIMEZONE=Asia/Shanghai
Environment=N8N_USER_MANAGEMENT_DISABLED=true
Environment=N8N_ENCRYPTION_KEY=mySecretEncryptionKey2024
Environment=N8N_DIAGNOSTICS_ENABLED=false
Environment=N8N_PERSONALIZATION_ENABLED=false
Environment=N8N_VERSION_NOTIFICATIONS_ENABLED=false
Environment=N8N_TEMPLATES_ENABLED=true
Environment=N8N_PUBLIC_API_DISABLED=false
Environment=N8N_LOG_LEVEL=info
Environment=N8N_LOG_OUTPUT=console
Environment=HOME=/var/lib/n8n
ExecStart=/usr/bin/n8n start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=n8n

[Install]
WantedBy=multi-user.target
EOF

# 上传并安装服务
scp /tmp/n8n.service $SERVER_USER@$SERVER_IP:/etc/systemd/system/

# 创建后端 API 服务
echo "🔧 创建后端 API 服务..."
cat > /tmp/n8n-api.service << 'EOF'
[Unit]
Description=n8n API Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/n8n-system
Environment=NODE_ENV=production
Environment=PORT=1337
ExecStart=/usr/bin/node server-n8n-enhanced.cjs
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=n8n-api

[Install]
WantedBy=multi-user.target
EOF

# 上传并安装 API 服务
scp /tmp/n8n-api.service $SERVER_USER@$SERVER_IP:/etc/systemd/system/

# 启动服务
echo "🚀 启动 n8n 服务..."
ssh $SERVER_USER@$SERVER_IP "
    # 重新载入 systemd 配置
    systemctl daemon-reload

    # 启用并启动 n8n
    systemctl enable n8n
    systemctl start n8n

    # 启用并启动 API 服务
    systemctl enable n8n-api
    systemctl start n8n-api

    # 等待启动
    sleep 10

    # 检查服务状态
    systemctl status n8n --no-pager -l
    systemctl status n8n-api --no-pager -l
"

# 配置 Nginx
echo "🔧 配置 Nginx..."
cat > /tmp/n8n-nginx.conf << 'EOF'
server {
    listen 80;
    server_name n8n.bambumoon.cn;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}

server {
    listen 80;
    server_name api.bambumoon.cn;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 部署 Nginx 配置
scp /tmp/n8n-nginx.conf $SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/n8n
ssh $SERVER_USER@$SERVER_IP "
    ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
"

# 等待服务完全启动
echo "⏳ 等待服务启动..."
sleep 20

# 健康检查
echo "🏥 执行健康检查..."

# 检查本地端口
echo "检查服务器本地端口:"
ssh $SERVER_USER@$SERVER_IP "
    echo '=== n8n 进程 ==='
    ps aux | grep n8n || true
    echo ''
    echo '=== API 进程 ==='
    ps aux | grep server-n8n || true
    echo ''
    echo '=== 端口监听 ==='
    ss -tlnp | grep ':5678\|:1337' || true
    echo ''
    echo '=== 服务状态 ==='
    systemctl status n8n --no-pager -l || true
    echo ''
    systemctl status n8n-api --no-pager -l || true
"

# 检查 HTTP 访问
echo ""
echo "检查 HTTP 访问:"
if curl -f -s --connect-timeout 10 http://$SERVER_IP:5678 > /dev/null 2>&1; then
    echo "✅ n8n 服务 (http://$SERVER_IP:5678) 正常"
else
    echo "⚠️ n8n 服务可能还在启动中"
fi

if curl -f -s --connect-timeout 10 http://$SERVER_IP:1337/api/articles > /dev/null 2>&1; then
    echo "✅ API 服务 (http://$SERVER_IP:1337) 正常"
else
    echo "⚠️ API 服务可能还在启动中"
fi

# 清理临时文件
rm -f /tmp/n8n.service /tmp/n8n-api.service /tmp/n8n-nginx.conf

echo ""
echo "🎉 n8n 无 Docker 部署完成！"
echo ""
echo "📝 访问地址："
echo "n8n 工作流编辑器: http://$SERVER_IP:5678"
echo "API 管理后台: http://$SERVER_IP:1337/admin.html"
echo "API 接口: http://$SERVER_IP:1337/api/"
echo ""
echo "📋 下一步："
echo "1. 配置域名 DNS: $N8N_DOMAIN -> $SERVER_IP"
echo "2. 配置域名 DNS: api.bambumoon.cn -> $SERVER_IP"
echo "3. 获取 SSL 证书：certbot --nginx -d $N8N_DOMAIN -d api.bambumoon.cn"
echo "4. 在 n8n 中导入工作流文件"
echo "5. 配置各平台的 API 密钥"
echo ""
echo "🔧 管理命令："
echo "查看 n8n 日志: ssh $SERVER_USER@$SERVER_IP 'journalctl -f -u n8n'"
echo "查看 API 日志: ssh $SERVER_USER@$SERVER_IP 'journalctl -f -u n8n-api'"
echo "重启 n8n: ssh $SERVER_USER@$SERVER_IP 'systemctl restart n8n'"
echo "重启 API: ssh $SERVER_USER@$SERVER_IP 'systemctl restart n8n-api'"