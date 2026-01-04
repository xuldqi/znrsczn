# 后端 API 服务器 Dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY server-n8n-enhanced.cjs ./
COPY articles.json ./
COPY admin-latest.html ./admin.html

# 创建必要目录
RUN mkdir -p n8n-backups

# 暴露端口
EXPOSE 1337

# 启动服务
CMD ["node", "server-n8n-enhanced.cjs"]