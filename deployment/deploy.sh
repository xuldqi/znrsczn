#!/bin/bash

# 双网站部署脚本
# 部署 bambumoon.cn (主网站) 和 company.bambumoon.cn (公司网站)

set -e

echo "🚀 开始双网站部署..."

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 root 权限运行此脚本"
    exit 1
fi

# 定义变量
MAIN_DOMAIN="bambumoon.cn"
COMPANY_DOMAIN="company.bambumoon.cn"
DEPLOY_BASE="/var/www/bambumoon-sites"
MAIN_SITE_DIR="$DEPLOY_BASE/main-site"
COMPANY_SITE_DIR="$DEPLOY_BASE/company"
BACKUP_DIR="/var/backups/bambumoon-$(date +%Y%m%d_%H%M%S)"

# 创建部署目录
echo "📁 创建部署目录..."
mkdir -p $DEPLOY_BASE
mkdir -p $MAIN_SITE_DIR
mkdir -p $COMPANY_SITE_DIR
mkdir -p $BACKUP_DIR

# 备份现有文件（如果存在）
if [ -d "$MAIN_SITE_DIR/dist" ]; then
    echo "💾 备份现有主网站..."
    cp -r $MAIN_SITE_DIR/dist $BACKUP_DIR/main-site-backup
fi

if [ -d "$COMPANY_SITE_DIR" ]; then
    echo "💾 备份现有公司网站..."
    cp -r $COMPANY_SITE_DIR $BACKUP_DIR/company-backup
fi

# 构建主网站
echo "🏗️ 构建主网站 (中年自救指南)..."
cd /Users/macmima1234/Documents/project/pmsaveself

# 安装依赖并构建
npm install
npm run build

# 部署主网站
echo "📦 部署主网站到 $MAIN_SITE_DIR..."
rm -rf $MAIN_SITE_DIR/dist
cp -r dist $MAIN_SITE_DIR/
chown -R www-data:www-data $MAIN_SITE_DIR
chmod -R 755 $MAIN_SITE_DIR

# 部署公司网站
echo "📦 部署公司网站到 $COMPANY_SITE_DIR..."
rm -rf $COMPANY_SITE_DIR/*
cp -r /Users/macmima1234/Downloads/company/* $COMPANY_SITE_DIR/
chown -R www-data:www-data $COMPANY_SITE_DIR
chmod -R 755 $COMPANY_SITE_DIR

# 安装 Nginx（如果未安装）
if ! command -v nginx &> /dev/null; then
    echo "📥 安装 Nginx..."
    apt update
    apt install -y nginx
fi

# 复制 Nginx 配置
echo "⚙️ 配置 Nginx..."
cp deployment/nginx.conf /etc/nginx/sites-available/bambumoon-sites
ln -sf /etc/nginx/sites-available/bambumoon-sites /etc/nginx/sites-enabled/

# 删除默认配置（如果存在）
rm -f /etc/nginx/sites-enabled/default

# 测试 Nginx 配置
nginx -t

# 安装 Certbot（如果未安装）
if ! command -v certbot &> /dev/null; then
    echo "📥 安装 Certbot..."
    apt install -y certbot python3-certbot-nginx
fi

# 获取 SSL 证书
echo "🔒 获取 SSL 证书..."
certbot --nginx -d $MAIN_DOMAIN -d www.$MAIN_DOMAIN -d $COMPANY_DOMAIN --non-interactive --agree-tos --email admin@$MAIN_DOMAIN

# 重启服务
echo "🔄 重启服务..."
systemctl reload nginx
systemctl enable nginx

# 设置自动续期
echo "⏰ 设置 SSL 证书自动续期..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 健康检查
echo "🏥 执行健康检查..."
sleep 3

if curl -f -s https://$MAIN_DOMAIN > /dev/null; then
    echo "✅ 主网站 (https://$MAIN_DOMAIN) 运行正常"
else
    echo "❌ 主网站健康检查失败"
fi

if curl -f -s https://$COMPANY_DOMAIN > /dev/null; then
    echo "✅ 公司网站 (https://$COMPANY_DOMAIN) 运行正常"
else
    echo "❌ 公司网站健康检查失败"
fi

echo "🎉 部署完成！"
echo "主网站: https://$MAIN_DOMAIN"
echo "公司网站: https://$COMPANY_DOMAIN"
echo "备份位置: $BACKUP_DIR"
echo ""
echo "如需回滚，请运行："
echo "bash deployment/rollback.sh $BACKUP_DIR"