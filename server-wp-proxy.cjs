const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 1337;

// WordPress Proxy API (服务器)
const WP_PROXY_API = 'http://118.178.189.214:1338/api';
// 本地文章数据文件
const DATA_FILE = path.join(__dirname, 'articles.json');

// 中间件
app.use(cors());
app.use(express.json());

// 读取本地文章数据
async function getLocalArticles() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const articles = JSON.parse(data);
    return Object.values(articles).map(article => ({
      ...article,
      source: 'local' // 标记数据源
    }));
  } catch (error) {
    console.log('本地文章文件不存在或为空');
    return [];
  }
}

// 获取WordPress文章
async function getWordPressArticles() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${WP_PROXY_API}/articles`);
    const articles = await response.json();
    return articles.map(article => ({
      ...article,
      source: 'wordpress' // 标记数据源
    }));
  } catch (error) {
    console.log('WordPress文章获取失败:', error.message);
    return [];
  }
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hybrid API (Local + WordPress) is running' });
});

// 获取所有文章 - 合并本地和WordPress数据
app.get('/api/articles', async (req, res) => {
  try {
    console.log('正在获取文章数据...');
    
    // 并行获取两个数据源
    const [localArticles, wpArticles] = await Promise.all([
      getLocalArticles(),
      getWordPressArticles()
    ]);
    
    // 合并文章，本地文章在前，WordPress文章在后
    const allArticles = [...localArticles, ...wpArticles];
    
    console.log(`本地文章: ${localArticles.length} 篇`);
    console.log(`WordPress文章: ${wpArticles.length} 篇`);
    console.log(`总计: ${allArticles.length} 篇`);
    
    res.json(allArticles);
  } catch (error) {
    console.error('获取文章失败:', error);
    res.json([]);
  }
});

// 获取单篇文章 - 同时从本地和WordPress查找
app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 先在本地文章中查找
    const localArticles = await getLocalArticles();
    const localArticle = localArticles.find(article => article.id === id);
    
    if (localArticle) {
      return res.json(localArticle);
    }
    
    // 如果本地没找到，在WordPress中查找
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(`${WP_PROXY_API}/articles/${id}`);
      if (response.ok) {
        const wpArticle = await response.json();
        return res.json({ ...wpArticle, source: 'wordpress' });
      }
    } catch (wpError) {
      console.log('WordPress中未找到文章:', id);
    }
    
    // 两个数据源都没找到
    res.status(404).json({ error: '文章不存在' });
  } catch (error) {
    console.error('获取文章失败:', error);
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Hybrid API Server is running on port ${PORT}`);
  console.log(`📚 本地文章: ${DATA_FILE}`);
  console.log(`🔗 WordPress Proxy: ${WP_PROXY_API}`);
  console.log(`📝 WordPress管理: http://118.178.189.214:8080`);
  console.log(`🌐 前端访问: http://localhost:5173`);
});