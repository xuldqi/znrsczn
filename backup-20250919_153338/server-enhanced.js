const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 1337;
const DATA_FILE = path.join(__dirname, 'articles.json');
const ORDER_FILE = path.join(__dirname, 'article-order.json');

// 确保上传目录存在
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

// 创建上传目录
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('Created upload directory:', UPLOAD_DIR);
  }
};

// 配置multer用于图片上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名：时间戳 + 随机数 + 原始扩展名
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}_${randomNum}${ext}`);
  }
});

// 文件类型过滤
const fileFilter = (req, file, cb) => {
  // 只允许图片文件
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 默认文章数据
const defaultArticles = {};
const defaultOrder = [];

// 初始化数据文件
const initializeDataFiles = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultArticles, null, 2));
  }

  try {
    await fs.access(ORDER_FILE);
  } catch (error) {
    await fs.writeFile(ORDER_FILE, JSON.stringify(defaultOrder, null, 2));
  }
};

// 读取文章数据
const getArticlesData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取文章数据失败:', error);
    return defaultArticles;
  }
};

// 保存文章数据
const saveArticlesData = async (articles) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(articles, null, 2));
    return true;
  } catch (error) {
    console.error('保存文章数据失败:', error);
    return false;
  }
};

// 读取排序数据
const getOrderData = async () => {
  try {
    const data = await fs.readFile(ORDER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取排序数据失败:', error);
    return defaultOrder;
  }
};

// 保存排序数据
const saveOrderData = async (order) => {
  try {
    await fs.writeFile(ORDER_FILE, JSON.stringify(order, null, 2));
    return true;
  } catch (error) {
    console.error('保存排序数据失败:', error);
    return false;
  }
};

// 根据排序获取文章列表
const getSortedArticles = async (articles, sortBy = 'custom') => {
  let articleList = Object.values(articles);
  
  switch (sortBy) {
    case 'newest':
      articleList.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      articleList.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'title':
      articleList.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
      break;
    case 'category':
      articleList.sort((a, b) => a.category.localeCompare(b.category, 'zh-CN'));
      break;
    case 'custom':
    default:
      const order = await getOrderData();
      if (order.length > 0) {
        const orderedArticles = [];
        const remainingArticles = [];
        
        // 先按自定义顺序添加
        order.forEach(id => {
          const article = articles[id];
          if (article) {
            orderedArticles.push(article);
          }
        });
        
        // 再添加不在自定义顺序中的文章
        articleList.forEach(article => {
          if (!order.includes(article.id)) {
            remainingArticles.push(article);
          }
        });
        
        articleList = [...orderedArticles, ...remainingArticles];
      }
      break;
  }
  
  return articleList;
};

// API路由

// 图片上传API
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未选择文件' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      message: '图片上传成功',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({ error: '图片上传失败' });
  }
});

// 删除图片API
app.delete('/api/upload/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    // 检查文件是否存在
    await fs.access(filePath);
    
    // 删除文件
    await fs.unlink(filePath);
    
    res.json({ message: '图片删除成功' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: '文件不存在' });
    } else {
      console.error('删除图片失败:', error);
      res.status(500).json({ error: '删除图片失败' });
    }
  }
});

// 获取所有文章
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const sortBy = req.query.sort || 'custom';
    const articleList = await getSortedArticles(articles, sortBy);
    res.json(articleList);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 获取单个文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const article = articles[req.params.id];
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建新文章
app.post('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const newId = Date.now().toString();
    const newArticle = {
      id: newId,
      ...req.body,
      date: new Date().toISOString().split('T')[0]
    };
    
    articles[newId] = newArticle;
    const saved = await saveArticlesData(articles);
    
    if (saved) {
      res.status(201).json(newArticle);
    } else {
      res.status(500).json({ error: '保存文章失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 更新文章
app.put('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const articleId = req.params.id;
    
    if (articles[articleId]) {
      articles[articleId] = { ...articles[articleId], ...req.body };
      const saved = await saveArticlesData(articles);
      
      if (saved) {
        res.json(articles[articleId]);
      } else {
        res.status(500).json({ error: '更新文章失败' });
      }
    } else {
      res.status(404).json({ error: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const articleId = req.params.id;
    
    if (articles[articleId]) {
      delete articles[articleId];
      const saved = await saveArticlesData(articles);
      
      if (saved) {
        // 同时从排序中删除
        const order = await getOrderData();
        const newOrder = order.filter(id => id !== articleId);
        await saveOrderData(newOrder);
        
        res.json({ message: '文章已删除' });
      } else {
        res.status(500).json({ error: '删除文章失败' });
      }
    } else {
      res.status(404).json({ error: '文章不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
});

// 更新文章排序
app.post('/api/articles/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: '排序数据格式错误' });
    }
    
    const saved = await saveOrderData(order);
    if (saved) {
      res.json({ message: '排序已更新' });
    } else {
      res.status(500).json({ error: '更新排序失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新排序失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CMS API is running' });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小不能超过5MB' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ error: error.message || '服务器内部错误' });
});

// 启动服务器
const startServer = async () => {
  try {
    await initializeDataFiles();
    await initializeUploadDir();
    
    app.listen(PORT, () => {
      console.log(`CMS API Server is running on port ${PORT}`);
      console.log(`Upload directory: ${UPLOAD_DIR}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();