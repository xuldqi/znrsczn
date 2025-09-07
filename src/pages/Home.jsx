import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab
} from '@mui/material'
import {
  AccessTime,
  Visibility
} from '@mui/icons-material'
import Footer from '../components/Footer'

const Home = () => {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  // 获取已发布的文章
  const publishedArticles = getAllArticles().filter(article => article.status === 'published')
  
  // 添加调试信息
  console.log('获取到的所有文章数量:', getAllArticles().length)
  console.log('已发布文章数量:', publishedArticles.length)
  console.log('已发布文章列表:', publishedArticles.map(a => a.title))
  
  // 如果没有文章，创建一些示例数据
  const sampleArticles = [
    {
      id: '1',
      title: '35岁职场转折：如何重新定义自己的价值',
      excerpt: '当你发现自己在职场中的优势不再明显，年轻同事的冲击让你感到压力时，是时候重新审视和定义自己的价值了。',
      author: '职场导师',
      readTime: '8分钟',
      category: '职场发展',
      status: 'published'
    },
    {
      id: '2', 
      title: '中年焦虑症的五个阶段及应对策略',
      excerpt: '从否认到接受，中年焦虑往往经历五个心理阶段。了解这些阶段，能帮助我们更好地管理情绪，找到内心平静。',
      author: '心理咨询师',
      readTime: '12分钟', 
      category: '心理健康',
      status: 'published'
    },
    {
      id: '3',
      title: '财务自由还是精神富足：中年人的选择困境',
      excerpt: '在追求更高收入和寻找生活意义之间，中年人往往面临两难选择。如何在现实压力和理想追求中找到平衡？',
      author: '生活规划师',
      readTime: '10分钟',
      category: '职场发展', 
      status: 'published'
    },
    {
      id: '4',
      title: '副业赚钱：适合中年人的5个方向',
      excerpt: '分享适合中年人的副业选择和实操经验，增加收入来源的具体方法。',
      author: '副业专家',
      readTime: '15分钟',
      category: '职场发展',
      status: 'published'
    }
  ]
  
  const articlesData = publishedArticles.length > 0 ? publishedArticles : sampleArticles

  // 文章分类
  const articleTabs = [
    { name: '推荐', description: '编辑精选内容', articles: articlesData.slice(0, 6) },
    { name: '技能提升', description: '职场方法和工具', articles: articlesData.slice(1, 7) },
    { name: '经验分享', description: '职场前辈案例', articles: articlesData.slice(2, 8) },
    { name: '工具推荐', description: '效率提升工具', articles: articlesData.slice(3, 9) },
    { name: '职业拓展', description: '副业和投资方向', articles: articlesData.slice(0, 6) },
    { name: '心理建设', description: '心理问题解决方案', articles: articlesData.filter(a => a.category === '心理健康') }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const currentTabArticles = articleTabs[activeTab]?.articles || []

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Banner轮播区域 - 全屏宽度 */}
      <Box 
        sx={{ 
          width: '100vw',
          height: 300,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6db4c4 0%, #5ba3b5 50%, #4a92a3 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ textAlign: 'center', zIndex: 2, px: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            中年人自救指南
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.95 }}>
            当中年人遇到职业困境时的实用解决方案
          </Typography>
        </Box>
      </Box>

      {/* 主要容器 - 少数派风格 */}
      <Container 
        maxWidth={false} 
        sx={{ 
          maxWidth: '1120px',
          px: { xs: 2, sm: 3 },
          py: 4
        }}
      >

        {/* 主体内容区 - 左右分栏 */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* 左侧主要内容 */}
          <Box sx={{ flex: '1 1 70%' }}>
            {/* 分类标签 */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                {articleTabs.map((tab, index) => (
                  <Tab key={index} label={tab.name} />
                ))}
              </Tabs>
            </Box>

            {/* 文章列表 */}
            <Stack spacing={2}>
              {currentTabArticles.map((article, index) => (
                <Paper
                  key={article.id || index}
                  elevation={0}
                  onClick={() => navigate(`/article/${article.id}`)}
                  sx={{
                    display: 'flex',
                    backgroundColor: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {/* 左侧图片 */}
                  <Box
                    sx={{
                      width: '33.333%',
                      height: 200,
                      flexShrink: 0,
                      backgroundColor: '#f5f5f5',
                      backgroundImage: article.image ? `url(${article.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!article.image && (
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        color: '#ccc'
                      }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#e0e0e0',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <AccessTime sx={{ fontSize: '1.5rem', color: '#bbb' }} />
                        </Box>
                        <Typography variant="caption" color="#999" sx={{ fontSize: '0.75rem' }}>
                          暂无图片
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* 右侧内容 */}
                  <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* 标题和摘要 */}
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 1.5,
                          color: 'text.primary',
                          fontSize: '1.1rem',
                          lineHeight: 1.3
                        }}
                      >
                        {article.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ mb: 2, lineHeight: 1.5 }}
                      >
                        {article.excerpt}
                      </Typography>
                    </Box>

                    {/* 底部元信息 */}
                    <Stack 
                      direction="row" 
                      spacing={2} 
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          {article.author?.charAt(0) || 'A'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                          {article.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          昨天 {article.readTime}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            👍 {Math.floor(Math.random() * 50) + 10}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            💬 {Math.floor(Math.random() * 20) + 2}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Box>

          {/* 右侧边栏 */}
          <Box sx={{ flex: '0 0 30%', display: { xs: 'none', lg: 'block' } }}>
            <Stack spacing={3}>
              {/* 到此一游 - 第一位 */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  到此一游
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  分享你的故事，发表你的看法
                </Typography>
                <Box 
                  onClick={() => navigate('/complaints')}
                  sx={{ 
                    border: '2px dashed #e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderColor: '#bdbdbd'
                    }
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    点击分享你的想法
                  </Typography>
                </Box>
              </Paper>

              {/* 热门文章 - 第二位 */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  热门文章
                </Typography>
                <Stack spacing={2}>
                  {articlesData.slice(0, 5).map((article, index) => (
                    <Box
                      key={article.id || index}
                      onClick={() => navigate(`/article/${article.id}`)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover .title': { color: 'primary.main' }
                      }}
                    >
                      <Typography 
                        className="title"
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          mb: 0.5,
                          transition: 'color 0.2s'
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {article.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {article.readTime}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* 分类导航 - 第三位 */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  分类导航
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    { name: '家庭关系', count: 15, color: '#e91e63' },
                    { name: '职场发展', count: 12, color: '#1976d2' },
                    { name: '心理健康', count: 18, color: '#388e3c' },
                    { name: '兴趣爱好', count: 8, color: '#ff9800' },
                    { name: '生活技能', count: 10, color: '#7b1fa2' },
                    { name: '财务管理', count: 6, color: '#d32f2f' },
                    { name: '副业指南', count: 7, color: '#0288d1' },
                    { name: '中年危机', count: 9, color: '#5d4037' },
                    { name: '转型升级', count: 4, color: '#616161' }
                  ].map((category) => (
                    <Box
                      key={category.name}
                      onClick={() => navigate(`/articles?category=${encodeURIComponent(category.name)}`)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        py: 1,
                        px: 1.5,
                        borderRadius: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          transform: 'translateX(2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box 
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: category.color
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary'
                          }}
                        >
                          {category.name}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontSize: '0.75rem'
                        }}
                      >
                        {category.count}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default Home