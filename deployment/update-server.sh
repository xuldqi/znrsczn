#!/bin/bash

# 快速更新网站到服务器脚本
# 用于日常更新，跳过初始安装步骤

set -e

SERVER_IP="118.178.189.214"
SERVER_USER="root"
LOCAL_PROJECT_DIR="/Users/macmima1234/Documents/project/pmsaveself"
COMPANY_DIR="/Users/macmima1234/Downloads/company"

echo "🔄 快速更新网站到服务器..."

# 构建主网站
echo "🏗️ 构建主网站..."
cd "$LOCAL_PROJECT_DIR"
npm install
npm run build

# 创建备份
echo "💾 创建服务器备份..."
ssh $SERVER_USER@$SERVER_IP "
    BACKUP_DIR=/var/backups/bambumoon-\$(date +%Y%m%d_%H%M%S)
    mkdir -p \$BACKUP_DIR
    
    if [ -d /var/www/bambumoon-sites/main-site/dist ]; then
        cp -r /var/www/bambumoon-sites/main-site/dist \$BACKUP_DIR/main-site-backup
        echo '主网站已备份到: '\$BACKUP_DIR'/main-site-backup'
    fi
    
    if [ -d /var/www/bambumoon-sites/company ]; then
        cp -r /var/www/bambumoon-sites/company \$BACKUP_DIR/company-backup
        echo '公司网站已备份到: '\$BACKUP_DIR'/company-backup'
    fi
"

# 上传更新
echo "📤 上传主网站更新..."
rsync -avz --delete "$LOCAL_PROJECT_DIR/dist/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/main-site/dist/

echo "📤 上传公司网站更新..."
rsync -avz --delete "$COMPANY_DIR/" $SERVER_USER@$SERVER_IP:/var/www/bambumoon-sites/company/

# 重启服务
echo "🔄 重启服务..."
ssh $SERVER_USER@$SERVER_IP "
    chown -R www-data:www-data /var/www/bambumoon-sites
    systemctl reload nginx
"

echo "✅ 更新完成！"