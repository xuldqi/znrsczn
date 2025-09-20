#!/bin/bash

# 推送双网站到服务器脚本
# 服务器: 118.178.189.214

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

if [ ! -d "$COMPANY_DIR" ]; then
    echo "❌ 公司网站目录不存在: $COMPANY_DIR"
    exit 1
fi

# 构建主网站
echo "🏗️ 构建主网站..."
cd "$LOCAL_PROJECT_DIR"
npm install
npm run build

# 测试服务器连接
echo "🔍 测试服务器连接..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP "echo 'SSH连接成功'" 2>/dev/null; then
    echo "❌ 无法连接到服务器，请检查:"
    echo "1. 服务器IP是否正确"
    echo "2. SSH密钥是否配置"
    echo "3. 网络连接是否正常"
    echo ""
    echo "手动连接测试: ssh $SERVER_USER@$SERVER_IP"
    exit 1
fi

# 在服务器上创建目录结构
echo "📁 在服务器上创建目录..."
ssh $SERVER_USER@$SERVER_IP "
    mkdir -p /var/www/bambumoon-sites/main-site
    mkdir -p /var/www/bambumoon-sites/company
    mkdir -p /var/www/bambumoon-sites/config
    mkdir -p /var/backups
"

# 上传主网站文件
echo "📤 上传主网站文件..."
rsync -avz --delete "$LOCAL_PROJECT_DIR/dist/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/main-site/dist/

# 上传公司网站文件
echo "📤 上传公司网站文件..."
rsync -avz --delete "$COMPANY_DIR/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/company/

# 上传部署配置文件
echo "📤 上传配置文件..."
rsync -avz "$LOCAL_PROJECT_DIR/deployment/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/config/

# 在服务器上执行部署
echo "⚙️ 在服务器上执行部署配置..."
ssh $SERVER_USER@$SERVER_IP "
    cd /var/www/bambumoon-sites/config

    # 安装必要软件
    apt update
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
ssh $SERVER_USER@$SERVER_IP "
    # 停止 nginx 以释放 80 端口
    systemctl stop nginx

    # 获取证书
    certbot certonly --standalone --agree-tos --no-eff-email --email admin@bambumoon.cn \
        -d bambumoon.cn -d www.bambumoon.cn -d company.bambumoon.cn || true

    # 重启 nginx
    systemctl start nginx

    # 强制更新 nginx 配置以使用 SSL
    systemctl reload nginx
"

# 健康检查
echo "🏥 执行健康检查..."
sleep 3

echo "检查网站状态:"

# 检查主网站
if curl -f -s --connect-timeout 10 http://bambumoon.cn > /dev/null 2>&1; then
    echo "✅ 主网站 HTTP (bambumoon.cn) 正常"
else
    echo "⚠️ 主网站 HTTP 可能还在配置中"
fi

if curl -f -s --connect-timeout 10 https://bambumoon.cn > /dev/null 2>&1; then
    echo "✅ 主网站 HTTPS (bambumoon.cn) 正常"
else
    echo "⚠️ 主网站 HTTPS 可能还在配置中（SSL证书需要时间生效）"
fi

# 检查公司网站
if curl -f -s --connect-timeout 10 http://company.bambumoon.cn > /dev/null 2>&1; then
    echo "✅ 公司网站 HTTP (company.bambumoon.cn) 正常"
else
    echo "⚠️ 公司网站 HTTP 可能还在配置中"
fi

# 显示服务器状态
echo ""
echo "📊 服务器状态:"
ssh $SERVER_USER@$SERVER_IP "
    echo '=== Nginx 状态 ==='
    systemctl status nginx --no-pager -l
    echo ''
    echo '=== 磁盘使用情况 ==='
    df -h /var/www
    echo ''
    echo '=== 网站文件 ==='
    ls -la /var/www/bambumoon-sites/
"

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 访问地址:"
echo "主网站: http://bambumoon.cn (https://bambumoon.cn)"
echo "公司网站: http://company.bambumoon.cn (https://company.bambumoon.cn)"
echo ""
echo "📋 下一步:"
echo "1. 配置域名 DNS 解析到服务器 IP: $SERVER_IP"
echo "2. 等待 DNS 生效后，SSL 证书会自动工作"
echo "3. 定期运行更新脚本进行网站更新"
echo ""
echo "🔧 管理命令:"
echo "更新网站: bash push-to-server.sh"
echo "服务器登录: ssh $SERVER_USER@$SERVER_IP"
echo "查看日志: ssh $SERVER_USER@$SERVER_IP 'tail -f /var/log/nginx/access.log'"