const express = require('express');
const app = express();
const port = 5678;

// 模拟 n8n 的基本功能
app.use(express.json());
app.use(express.static('.'));

// 基础路由
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>简化版 n8n 工作流系统</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1>🤖 n8n 工作流系统</h1>
        <p>状态: 运行中</p>
        <p>版本: 简化版 1.0.0</p>
        
        <h2>📋 可用功能:</h2>
        <ul>
            <li><a href="/workflows">查看工作流</a></li>
            <li><a href="/api/health">健康检查</a></li>
            <li><a href="/webhook">Webhook 端点</a></li>
        </ul>
        
        <h2>🔗 相关链接:</h2>
        <ul>
            <li><a href="http://118.178.189.214:1337/admin.html" target="_blank">文章管理后台</a></li>
            <li><a href="http://118.178.189.214:1337/api/articles" target="_blank">API 接口</a></li>
        </ul>
        
        <p><em>注: 这是一个简化版本，提供基本的工作流功能</em></p>
    </body>
    </html>
  `);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0-simplified',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 工作流列表
app.get('/workflows', (req, res) => {
  res.json({
    workflows: [
      {
        id: 'auto-content-generation',
        name: '自动内容生成',
        active: true,
        description: '定时生成文章内容'
      },
      {
        id: 'intelligent-scraper', 
        name: '智能爬虫',
        active: true,
        description: '抓取和处理网络内容'
      },
      {
        id: 'multi-platform-publisher',
        name: '多平台发布',
        active: false,
        description: '同步发布到各个平台'
      }
    ]
  });
});

// Webhook 端点
app.post('/webhook/:workflowId', (req, res) => {
  const { workflowId } = req.params;
  console.log(`收到 webhook 调用: ${workflowId}`, req.body);
  
  // 模拟工作流执行
  res.json({
    success: true,
    workflowId,
    executionId: Date.now().toString(),
    message: '工作流已触发',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 简化版 n8n 运行在 http://localhost:${port}`);
  console.log(`📊 管理后台: http://118.178.189.214:1337/admin.html`);
});

module.exports = app;