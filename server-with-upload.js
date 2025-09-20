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
    await fs.access(filePath);
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

// 获取所有文章（支持排序）
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const order = await getOrderData();
    
    let articleList = Object.values(articles);
    
    // 如果有自定义排序，按排序返回
    if (order.length > 0) {
      const ordered = [];
      const unordered = [...articleList];
      
      // 按排序顺序添加文章
      order.forEach(id => {
        const article = articleList.find(a => a.id === id);
        if (article) {
          ordered.push(article);
          const index = unordered.findIndex(a => a.id === id);
          if (index > -1) unordered.splice(index, 1);
        }
      });
      
      // 添加未排序的文章
      articleList = [...ordered, ...unordered];
    }
    
    res.json(articleList);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 获取单篇文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const article = articles[req.params.id];
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建文章
app.post('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const newArticle = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: req.body.status || 'published'
    };
    
    articles[newArticle.id] = newArticle;
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
    if (!articles[req.params.id]) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    articles[req.params.id] = {
      ...articles[req.params.id],
      ...req.body
    };
    
    const saved = await saveArticlesData(articles);
    if (saved) {
      res.json(articles[req.params.id]);
    } else {
      res.status(500).json({ error: '更新文章失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    if (!articles[req.params.id]) {
      return res.status(404).json({ error: '文章不存在' });
    }
    
    delete articles[req.params.id];
    const saved = await saveArticlesData(articles);
    
    // 同时从排序中移除
    const order = await getOrderData();
    const newOrder = order.filter(id => id !== req.params.id);
    await saveOrderData(newOrder);
    
    if (saved) {
      res.json({ message: '文章已删除' });
    } else {
      res.status(500).json({ error: '删除文章失败' });
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
async function startServer() {
  await initDataFile();
  await initializeUploadDir();
  app.listen(PORT, () => {
    console.log(`🚀 CMS API Server is running on port ${PORT}`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  });
}

startServer();