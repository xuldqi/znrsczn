# 双网站部署指南

## 🚀 服务器部署（118.178.189.214）

### 一键部署
```bash
# 1. 配置 SSH 免密登录（首次需要）
bash deployment/setup-ssh.sh

# 2. 推送并部署到服务器
bash deployment/push-to-server.sh

# 3. 日后更新网站
bash deployment/update-server.sh
```

## 📁 目录结构
```
/var/www/bambumoon-sites/
├── main-site/          # 主网站 (bambumoon.cn)
│   └── dist/          # React 构建产物
├── company/           # 公司网站 (company.bambumoon.cn)
└── config/            # 配置文件
    └── nginx.conf     # Nginx 配置
```

## 🚀 快速部署

### 方式一：脚本部署（推荐）
```bash
# 1. 给脚本执行权限
chmod +x deployment/deploy.sh deployment/rollback.sh

# 2. 运行部署脚本（需要 root 权限）
sudo bash deployment/deploy.sh
```

### 方式二：Docker 部署
```bash
# 1. 构建主网站
npm run build

# 2. 启动 Docker 服务
cd deployment
docker-compose up -d

# 3. 获取 SSL 证书
docker-compose run --rm certbot
```

## ⚙️ 手动部署步骤

### 1. 准备服务器环境
```bash
# 更新系统
apt update && apt upgrade -y

# 安装必要软件
apt install -y nginx certbot python3-certbot-nginx nodejs npm git
```

### 2. 创建目录结构
```bash
mkdir -p /var/www/bambumoon-sites/main-site
mkdir -p /var/www/bambumoon-sites/company
mkdir -p /var/www/bambumoon-sites/config
```

### 3. 构建并部署主网站
```bash
# 在项目目录执行
npm install
npm run build

# 复制构建产物
cp -r dist /var/www/bambumoon-sites/main-site/
```

### 4. 部署公司网站
```bash
cp -r /Users/macmima1234/Downloads/company/* /var/www/bambumoon-sites/company/
```

### 5. 配置 Nginx
```bash
# 复制配置文件
cp deployment/nginx.conf /etc/nginx/sites-available/bambumoon-sites

# 启用配置
ln -sf /etc/nginx/sites-available/bambumoon-sites /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 6. 获取 SSL 证书
```bash
certbot --nginx -d bambumoon.cn -d www.bambumoon.cn -d company.bambumoon.cn
```

## 🔧 DNS 配置

在你的域名服务商处添加以下记录：

```
# 主域名
A     bambumoon.cn           → 服务器IP
A     www.bambumoon.cn       → 服务器IP

# 公司子域名  
A     company.bambumoon.cn   → 服务器IP
```

## 📊 监控和维护

### 健康检查
```bash
# 检查网站状态
curl -I https://bambumoon.cn
curl -I https://company.bambumoon.cn

# 检查 SSL 证书
openssl s_client -connect bambumoon.cn:443 -servername bambumoon.cn
```

### 日志查看
```bash
# Nginx 访问日志
tail -f /var/log/nginx/access.log

# Nginx 错误日志
tail -f /var/log/nginx/error.log

# 系统日志
journalctl -u nginx -f
```

### 证书续期
证书会自动续期，也可手动续期：
```bash
certbot renew --dry-run  # 测试续期
certbot renew            # 实际续期
```

## 🔄 更新部署

### 更新主网站
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建
npm run build

# 3. 备份现有版本
cp -r /var/www/bambumoon-sites/main-site/dist /var/backups/main-site-$(date +%Y%m%d_%H%M%S)

# 4. 部署新版本
cp -r dist /var/www/bambumoon-sites/main-site/
```

### 更新公司网站
```bash
# 1. 备份现有版本
cp -r /var/www/bambumoon-sites/company /var/backups/company-$(date +%Y%m%d_%H%M%S)

# 2. 部署新版本
cp -r /Users/macmima1234/Downloads/company/* /var/www/bambumoon-sites/company/
```

## 🚨 故障排除

### 常见问题

1. **网站无法访问**
   ```bash
   # 检查 Nginx 状态
   systemctl status nginx
   
   # 检查端口占用
   netstat -tlnp | grep :80
   netstat -tlnp | grep :443
   ```

2. **SSL 证书问题**
   ```bash
   # 检查证书状态
   certbot certificates
   
   # 重新获取证书
   certbot delete --cert-name bambumoon.cn
   certbot --nginx -d bambumoon.cn -d www.bambumoon.cn -d company.bambumoon.cn
   ```

3. **权限问题**
   ```bash
   # 修复权限
   chown -R www-data:www-data /var/www/bambumoon-sites
   chmod -R 755 /var/www/bambumoon-sites
   ```

### 回滚操作
```bash
# 使用自动备份回滚
bash deployment/rollback.sh /var/backups/bambumoon-YYYYMMDD_HHMMSS

# 或手动回滚到指定版本
cp -r /var/backups/main-site-YYYYMMDD_HHMMSS /var/www/bambumoon-sites/main-site/dist
systemctl reload nginx
```

## 📈 性能优化

1. **启用 Gzip 压缩**（已在 nginx.conf 中配置）
2. **设置缓存策略**（已在 nginx.conf 中配置）
3. **CDN 加速**（可选，推荐使用七牛云或阿里云 CDN）

## 🔐 安全建议

1. **定期更新系统和软件包**
2. **配置防火墙**
   ```bash
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```
3. **定期备份数据**
4. **监控异常访问**