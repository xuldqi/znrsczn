#!/bin/bash

# 双网站回滚脚本

set -e

if [ -z "$1" ]; then
    echo "用法: $0 <备份目录>"
    echo "示例: $0 /var/backups/bambumoon-20240101_120000"
    exit 1
fi

BACKUP_DIR="$1"
DEPLOY_BASE="/var/www/bambumoon-sites"
MAIN_SITE_DIR="$DEPLOY_BASE/main-site"
COMPANY_SITE_DIR="$DEPLOY_BASE/company"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ 备份目录不存在: $BACKUP_DIR"
    exit 1
fi

echo "🔄 开始回滚到备份: $BACKUP_DIR"

# 回滚主网站
if [ -d "$BACKUP_DIR/main-site-backup" ]; then
    echo "🔙 回滚主网站..."
    rm -rf $MAIN_SITE_DIR/dist
    cp -r $BACKUP_DIR/main-site-backup $MAIN_SITE_DIR/dist
    chown -R www-data:www-data $MAIN_SITE_DIR
    echo "✅ 主网站回滚完成"
else
    echo "⚠️ 主网站备份不存在"
fi

# 回滚公司网站
if [ -d "$BACKUP_DIR/company-backup" ]; then
    echo "🔙 回滚公司网站..."
    rm -rf $COMPANY_SITE_DIR/*
    cp -r $BACKUP_DIR/company-backup/* $COMPANY_SITE_DIR/
    chown -R www-data:www-data $COMPANY_SITE_DIR
    echo "✅ 公司网站回滚完成"
else
    echo "⚠️ 公司网站备份不存在"
fi

# 重启 Nginx
systemctl reload nginx

echo "🎉 回滚完成！"