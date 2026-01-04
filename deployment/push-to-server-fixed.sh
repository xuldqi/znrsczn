#!/bin/bash

# 修复版推送脚本
# 增加重试机制和更好的错误处理

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"
COMPANY_DIR="/Users/macmima1234/Downloads/company"

echo "🚀 开始推送网站到服务器 $SERVER_IP..."

# 检查本地文件
if [ ! -d "$LOCAL_PROJECT_DIR" ]; then
    echo "❌ 本地项目目录不存在: $LOCAL_PROJECT_DIR"
    exit 1
fi

# 构建主网站
echo "🏗️ 构建主网站..."
cd "$LOCAL_PROJECT_DIR"
npm run build

# 测试服务器连接 - 增加重试机制
echo "🔍 测试服务器连接..."
SSH_OPTS="-o ConnectTimeout=30 -o ServerAliveInterval=10 -o ServerAliveCountMax=3"
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
        echo "✅ SSH连接成功"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "⚠️ 连接失败，重试 $RETRY_COUNT/$MAX_RETRIES..."
        sleep 5
    fi
    
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "❌ SSH连接失败，尝试交互式连接..."
        echo "请手动输入密码："
        ssh $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'"
        break
    fi
done

# 在服务器上创建目录结构
echo "📁 在服务器上创建目录..."
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "
    mkdir -p /var/www/bambumoon-sites/main-site
    mkdir -p /var/www/bambumoon-sites/company
    mkdir -p /var/www/bambumoon-sites/config
    mkdir -p /var/backups
    echo '目录创建完成'
"

# 上传主网站文件
echo "📤 上传主网站文件..."
rsync -avz --timeout=60 --delete "$LOCAL_PROJECT_DIR/dist/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/main-site/dist/

# 如果公司目录存在，上传公司网站文件
if [ -d "$COMPANY_DIR" ]; then
    echo "📤 上传公司网站文件..."
    rsync -avz --timeout=60 --delete "$COMPANY_DIR/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/company/
else
    echo "⚠️ 公司网站目录不存在，跳过上传"
fi

# 上传部署配置文件
echo "📤 上传配置文件..."
rsync -avz --timeout=60 "$LOCAL_PROJECT_DIR/deployment/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/config/

# 在服务器上执行部署
echo "⚙️ 在服务器上执行部署配置..."
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "
    cd /var/www/bambumoon-sites/config

    # 更新系统
    export DEBIAN_FRONTEND=noninteractive
    apt update
    
    # 安装必要软件
    apt install -y nginx certbot python3-certbot-nginx curl

    # 备份现有配置
    if [ -f /etc/nginx/sites-enabled/default ]; then
        cp /etc/nginx/sites-enabled/default /var/backups/nginx-default-\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    fi

    # 配置 Nginx
    cp nginx.conf /etc/nginx/sites-available/bambumoon-sites
    ln -sf /etc/nginx/sites-available/bambumoon-sites /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

    # 设置文件权限
    chown -R www-data:www-data /var/www/bambumoon-sites
    chmod -R 755 /var/www/bambumoon-sites

    # 测试 Nginx 配置
    nginx -t

    # 启动 Nginx
    systemctl enable nginx
    systemctl restart nginx

    echo '✅ Nginx 配置完成'
"

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 5

# 获取 SSL 证书
echo "🔒 获取 SSL 证书..."
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "
    # 获取证书
    certbot --nginx --agree-tos --no-eff-email --email admin@bambumoon.cn \
        -d bambumoon.cn -d www.bambumoon.cn --non-interactive || echo '证书获取可能失败，但网站应该可以通过HTTP访问'

    # 重新加载配置
    systemctl reload nginx

    echo '✅ SSL配置完成'
"

# 健康检查
echo "🏥 执行健康检查..."
sleep 3

echo "检查网站状态:"

# 检查主网站 HTTP
if curl -f -s --connect-timeout 10 http://bambumoon.cn > /dev/null 2>&1; then
    echo "✅ 主网站 HTTP (bambumoon.cn) 正常"
elif curl -f -s --connect-timeout 10 http://$SERVER_IP > /dev/null 2>&1; then
    echo "✅ 服务器 HTTP 正常，请配置域名DNS解析到 $SERVER_IP"
else
    echo "⚠️ HTTP 服务检查失败"
fi

# 显示服务器状态
echo ""
echo "📊 服务器状态:"
ssh $SSH_OPTS $SERVER_USER@$SERVER_IP "
    echo '=== Nginx 状态 ==='
    systemctl status nginx --no-pager -l | head -10
    echo ''
    echo '=== 网站文件 ==='
    ls -la /var/www/bambumoon-sites/
    echo ''
    echo '=== 磁盘使用情况 ==='
    df -h /var/www
"

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 访问地址:"
echo "主网站: http://bambumoon.cn 或 http://$SERVER_IP"
echo ""
echo "📋 下一步:"
echo "1. 配置域名 DNS 解析到服务器 IP: $SERVER_IP"
echo "2. 等待 DNS 生效后，HTTPS 会自动工作"
echo ""
echo "🔧 管理命令:"
echo "服务器登录: ssh $SERVER_USER@$SERVER_IP"
echo "查看网站: curl http://$SERVER_IP"