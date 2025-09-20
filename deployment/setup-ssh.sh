#!/bin/bash

# SSH 免密登录配置脚本

SERVER_IP="118.178.189.214"
SERVER_USER="root"

echo "🔑 配置 SSH 免密登录到 $SERVER_IP..."

# 检查本地是否有 SSH 密钥
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "📝 生成 SSH 密钥..."
    ssh-keygen -t rsa -b 4096 -C "$(whoami)@$(hostname)" -f ~/.ssh/id_rsa -N ""
    echo "✅ SSH 密钥已生成"
fi

# 复制公钥到服务器（需要输入密码）
echo "📤 复制公钥到服务器..."
echo "请输入服务器密码: 1q2ws3edcQ123"

ssh-copy-id -i ~/.ssh/id_rsa.pub $SERVER_USER@$SERVER_IP

# 测试连接
echo "🔍 测试免密登录..."
if ssh -o BatchMode=yes $SERVER_USER@$SERVER_IP "echo 'SSH 免密登录配置成功！'"; then
    echo "✅ 免密登录配置完成"
    echo ""
    echo "现在可以运行部署脚本："
    echo "bash deployment/push-to-server.sh"
else
    echo "❌ 免密登录配置失败"
    exit 1
fi