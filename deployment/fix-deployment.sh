#!/bin/bash

# 修复部署问题脚本
# 服务器: 118.178.189.214

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"

echo "🔧 修复服务器部署问题..."

# 上传临时HTTP配置
echo "📤 上传临时HTTP配置..."
scp "$LOCAL_PROJECT_DIR/deployment/nginx-http-only.conf" $SERVER_USER@$SERVER_IP:/etc/nginx/sites-available/bambumoon-sites

# 在服务器上执行修复
ssh $SERVER_USER@$SERVER_IP "
    echo '🔧 开始修复 Nginx 配置...'
    
    # 创建必要目录
    mkdir -p /var/www/certbot
    
    # 测试配置
    nginx -t
    
    # 启动 Nginx
    systemctl start nginx
    systemctl enable nginx
    
    echo '✅ Nginx 已启动'
    
    # 检查状态
    systemctl status nginx --no-pager -l
    
    echo '🔒 尝试获取 SSL 证书...'
    
    # 获取证书
    certbot certonly --webroot -w /var/www/certbot --agree-tos --no-eff-email --email admin@bambumoon.cn \\
        -d bambumoon.cn -d www.bambumoon.cn -d company.bambumoon.cn || {
        echo '⚠️ SSL 证书获取失败，但网站应该可以通过 HTTP 访问'
        echo '请检查域名 DNS 解析是否正确指向服务器 IP: $SERVER_IP'
    }
    
    echo '📊 当前 Nginx 状态:'
    systemctl status nginx --no-pager
    
    echo '📁 网站文件检查:'
    ls -la /var/www/bambumoon-sites/
    
    echo '🌐 尝试本地访问测试:'
    curl -I localhost || echo '本地访问失败'
"

echo ""
echo "🎉 修复完成！"
echo ""
echo "📝 网站访问地址（HTTP）:"
echo "主网站: http://bambumoon.cn"
echo "公司网站: http://company.bambumoon.cn"
echo ""
echo "⚠️ 注意事项："
echo "1. 确保域名 DNS 已解析到服务器 IP: $SERVER_IP"
echo "2. 网站目前只支持 HTTP，SSL 证书可能需要手动配置"
echo "3. 如果访问失败，请检查防火墙和 DNS 设置"