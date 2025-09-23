const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 1337;
const DATA_FILE = path.join(__dirname, 'articles.json');
const ORDER_FILE = path.join(__dirname, 'article-order.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const N8N_WEBHOOK_LOG = path.join(__dirname, 'n8n-webhook.log');

// 确保上传目录存在
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('📁 Created upload directory:', UPLOAD_DIR);
  }
};

// 配置multer用于图片上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}_${randomNum}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// N8N Webhook认证中间件
const authenticateN8N = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const validToken = 'Bearer n8n-webhook-secret-2024';
  
  if (!authHeader || authHeader !== validToken) {
    return res.status(401).json({ error: 'Unauthorized: Invalid n8n webhook token' });
  }
  next();
};

// 记录webhook调用
const logWebhookCall = async (endpoint, data, result) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    endpoint,
    data,
    result,
    success: result.success || false
  };
  
  try {
    const existingLog = await fs.readFile(N8N_WEBHOOK_LOG, 'utf8').catch(() => '[]');
    const logs = JSON.parse(existingLog);
    logs.push(logEntry);
    
    // 只保留最近1000条记录
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    await fs.writeFile(N8N_WEBHOOK_LOG, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to write webhook log:', error);
  }
};

// 默认文章数据
const defaultArticles = {};
const defaultOrder = [];

// 初始化数据文件
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultArticles, null, 2));
    console.log('📝 创建了默认文章数据文件');
  }
  
  try {
    await fs.access(ORDER_FILE);
  } catch (error) {
    await fs.writeFile(ORDER_FILE, JSON.stringify(defaultOrder, null, 2));
    console.log('📝 创建了默认排序文件');
  }
}

// 读取文章数据
async function getArticlesData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取文章数据失败:', error);
    return defaultArticles;
  }
}

// 读取排序数据
async function getOrderData() {
  try {
    const data = await fs.readFile(ORDER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取排序数据失败:', error);
    return defaultOrder;
  }
}

// 保存文章数据
async function saveArticlesData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('保存文章数据失败:', error);
    return false;
  }
}

// 保存排序数据
async function saveOrderData(data) {
  try {
    await fs.writeFile(ORDER_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('保存排序数据失败:', error);
    return false;
  }
}

// ==================== 原有API端点 ====================

// 获取所有文章
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const order = await getOrderData();
    res.json({ articles, order });
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 根据分类获取文章
app.get('/api/articles/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    const categoryArticles = {};
    const categoryOrder = [];
    
    // 获取该分类的文章
    Object.keys(articles).forEach(id => {
      if (articles[id].category === category) {
        categoryArticles[id] = articles[id];
      }
    });
    
    // 获取该分类的排序
    order.forEach(item => {
      if (item.category === category) {
        categoryOrder.push(item);
      }
    });
    
    res.json({ 
      articles: categoryArticles, 
      order: categoryOrder,
      category 
    });
  } catch (error) {
    res.status(500).json({ error: '获取分类文章失败' });
  }
});

// 创建新文章
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({ error: '标题、内容和分类为必填项' });
    }
    
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    const id = Date.now().toString();
    const newArticle = {
      id,
      title,
      content,
      category,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishStatus: 'draft'
    };
    
    articles[id] = newArticle;
    
    // 添加到排序列表的开头
    order.unshift({
      id,
      category,
      position: 0
    });
    
    // 更新其他项目的位置
    order.forEach((item, index) => {
      if (item.id !== id) {
        item.position = index;
      }
    });
    
    await saveArticlesData(articles);
    await saveOrderData(order);
    
    res.json({ 
      success: true, 
      article: newArticle,
      message: '文章创建成功' 
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 更新文章
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, publishStatus } = req.body;
    
    const articles = await getArticlesData();
    
    if (!articles[id]) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    // 更新文章
    articles[id] = {
      ...articles[id],
      title: title || articles[id].title,
      content: content || articles[id].content,
      category: category || articles[id].category,
      tags: tags || articles[id].tags,
      publishStatus: publishStatus || articles[id].publishStatus,
      updatedAt: new Date().toISOString()
    };
    
    await saveArticlesData(articles);
    
    res.json({ 
      success: true, 
      article: articles[id],
      message: '文章更新成功' 
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    if (!articles[id]) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    delete articles[id];
    
    // 从排序列表中移除
    const newOrder = order.filter(item => item.id !== id);
    
    await saveArticlesData(articles);
    await saveOrderData(newOrder);
    
    res.json({ 
      success: true,
      message: '文章删除成功' 
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    res.status(500).json({ error: '删除文章失败' });
  }
});

// 更新文章排序
app.put('/api/articles-order', async (req, res) => {
  try {
    const { order: newOrder } = req.body;
    
    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ error: '排序数据格式错误' });
    }
    
    await saveOrderData(newOrder);
    
    res.json({ 
      success: true,
      message: '排序更新成功' 
    });
  } catch (error) {
    console.error('更新排序失败:', error);
    res.status(500).json({ error: '更新排序失败' });
  }
});

// 图片上传
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl,
      filename: req.file.filename,
      message: '图片上传成功' 
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({ error: '图片上传失败' });
  }
});

// ==================== N8N 集成 API 端点 ====================

// N8N Webhook: 获取待发布的文章
app.get('/api/n8n/articles/pending', authenticateN8N, async (req, res) => {
  try {
    const articles = await getArticlesData();
    const pendingArticles = Object.values(articles).filter(
      article => article.publishStatus === 'scheduled' || article.publishStatus === 'ready'
    );
    
    const result = {
      success: true,
      count: pendingArticles.length,
      articles: pendingArticles
    };
    
    await logWebhookCall('/api/n8n/articles/pending', {}, result);
    res.json(result);
  } catch (error) {
    const result = { success: false, error: error.message };
    await logWebhookCall('/api/n8n/articles/pending', {}, result);
    res.status(500).json(result);
  }
});

// N8N Webhook: 获取指定分类的文章用于内容生成
app.get('/api/n8n/articles/category/:category', authenticateN8N, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 5 } = req.query;
    
    const articles = await getArticlesData();
    const categoryArticles = Object.values(articles)
      .filter(article => article.category === category)
      .slice(0, parseInt(limit));
    
    const result = {
      success: true,
      category,
      count: categoryArticles.length,
      articles: categoryArticles
    };
    
    await logWebhookCall(`/api/n8n/articles/category/${category}`, { limit }, result);
    res.json(result);
  } catch (error) {
    const result = { success: false, error: error.message };
    await logWebhookCall(`/api/n8n/articles/category/${category}`, {}, result);
    res.status(500).json(result);
  }
});

// N8N Webhook: 创建AI生成的文章
app.post('/api/n8n/articles/ai-generated', authenticateN8N, async (req, res) => {
  try {
    const { title, content, category, tags, imageUrl, source } = req.body;
    
    if (!title || !content || !category) {
      const result = { success: false, error: '标题、内容和分类为必填项' };
      await logWebhookCall('/api/n8n/articles/ai-generated', req.body, result);
      return res.status(400).json(result);
    }
    
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    const id = `ai_${Date.now()}`;
    const newArticle = {
      id,
      title,
      content,
      category,
      tags: tags || [],
      imageUrl: imageUrl || null,
      source: source || 'AI Generated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishStatus: 'draft',
      isAIGenerated: true
    };
    
    articles[id] = newArticle;
    
    // 添加到排序列表
    order.unshift({
      id,
      category,
      position: 0
    });
    
    await saveArticlesData(articles);
    await saveOrderData(order);
    
    const result = {
      success: true,
      article: newArticle,
      message: 'AI文章创建成功'
    };
    
    await logWebhookCall('/api/n8n/articles/ai-generated', req.body, result);
    res.json(result);
  } catch (error) {
    const result = { success: false, error: error.message };
    await logWebhookCall('/api/n8n/articles/ai-generated', req.body, result);
    res.status(500).json(result);
  }
});

// N8N Webhook: 创建爬虫收集的文章
app.post('/api/n8n/articles/scraped', authenticateN8N, async (req, res) => {
  try {
    const { title, content, category, tags, sourceUrl, author } = req.body;
    
    if (!title || !content || !category || !sourceUrl) {
      const result = { success: false, error: '标题、内容、分类和来源URL为必填项' };
      await logWebhookCall('/api/n8n/articles/scraped', req.body, result);
      return res.status(400).json(result);
    }
    
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    // 检查是否已存在相同来源的文章
    const existingArticle = Object.values(articles).find(
      article => article.sourceUrl === sourceUrl
    );
    
    if (existingArticle) {
      const result = { success: false, error: '来源文章已存在', existingId: existingArticle.id };
      await logWebhookCall('/api/n8n/articles/scraped', req.body, result);
      return res.status(409).json(result);
    }
    
    const id = `scraped_${Date.now()}`;
    const newArticle = {
      id,
      title,
      content,
      category,
      tags: tags || [],
      sourceUrl,
      author: author || 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishStatus: 'draft',
      isScraped: true
    };
    
    articles[id] = newArticle;
    
    order.unshift({
      id,
      category,
      position: 0
    });
    
    await saveArticlesData(articles);
    await saveOrderData(order);
    
    const result = {
      success: true,
      article: newArticle,
      message: '爬虫文章创建成功'
    };
    
    await logWebhookCall('/api/n8n/articles/scraped', req.body, result);
    res.json(result);
  } catch (error) {
    const result = { success: false, error: error.message };
    await logWebhookCall('/api/n8n/articles/scraped', req.body, result);
    res.status(500).json(result);
  }
});

// N8N Webhook: 更新文章发布状态
app.put('/api/n8n/articles/:id/publish-status', authenticateN8N, async (req, res) => {
  try {
    const { id } = req.params;
    const { publishStatus, platform, publishedAt } = req.body;
    
    const articles = await getArticlesData();
    
    if (!articles[id]) {
      const result = { success: false, error: '文章不存在' };
      await logWebhookCall(`/api/n8n/articles/${id}/publish-status`, req.body, result);
      return res.status(404).json(result);
    }
    
    // 更新发布状态
    articles[id].publishStatus = publishStatus;
    articles[id].updatedAt = new Date().toISOString();
    
    // 记录发布平台信息
    if (!articles[id].publishHistory) {
      articles[id].publishHistory = [];
    }
    
    if (platform) {
      articles[id].publishHistory.push({
        platform,
        publishedAt: publishedAt || new Date().toISOString(),
        status: publishStatus
      });
    }
    
    await saveArticlesData(articles);
    
    const result = {
      success: true,
      article: articles[id],
      message: '发布状态更新成功'
    };
    
    await logWebhookCall(`/api/n8n/articles/${id}/publish-status`, req.body, result);
    res.json(result);
  } catch (error) {
    const result = { success: false, error: error.message };
    await logWebhookCall(`/api/n8n/articles/${id}/publish-status`, req.body, result);
    res.status(500).json(result);
  }
});

// N8N Webhook: 获取webhook调用日志
app.get('/api/n8n/logs', authenticateN8N, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const logsData = await fs.readFile(N8N_WEBHOOK_LOG, 'utf8').catch(() => '[]');
    const logs = JSON.parse(logsData);
    
    const recentLogs = logs.slice(-parseInt(limit)).reverse();
    
    res.json({
      success: true,
      count: recentLogs.length,
      totalLogs: logs.length,
      logs: recentLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// N8N Webhook: 健康检查
app.get('/api/n8n/health', authenticateN8N, async (req, res) => {
  try {
    const articles = await getArticlesData();
    const totalArticles = Object.keys(articles).length;
    const aiGenerated = Object.values(articles).filter(a => a.isAIGenerated).length;
    const scraped = Object.values(articles).filter(a => a.isScraped).length;
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: {
        totalArticles,
        aiGenerated,
        scraped,
        manual: totalArticles - aiGenerated - scraped
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 启动服务器
async function startServer() {
  try {
    await initDataFile();
    await initializeUploadDir();
    
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`📊 管理界面访问: http://localhost:${PORT}/admin.html`);
      console.log(`🤖 N8N Webhook认证令牌: Bearer n8n-webhook-secret-2024`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

startServer();