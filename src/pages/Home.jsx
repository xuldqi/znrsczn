import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import { useCategories } from '../contexts/CategoryContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent
} from '@mui/material'
import {
  AccessTime,
  Visibility
} from '@mui/icons-material'
import Footer from '../components/Footer'

const Home = () => {
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const { getAllArticles, loading, error } = useArticles()
  const { categories: categoryList } = useCategories()

  // 获取已发布的文章
  const publishedArticles = getAllArticles().filter(article => article.status === 'published')
  
  // 添加调试信息
  console.log('获取到的所有文章数量:', getAllArticles().length)
  console.log('已发布文章数量:', publishedArticles.length)
  console.log('已发布文章列表:', publishedArticles.map(a => a.title))
  
  // 只使用从API获取的真实数据
  const articlesData = publishedArticles

  // 文章分类
  const sortedArticles = useMemo(
    () => [...articlesData].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)),
    [articlesData]
  )

  const pickArticles = (filterFn, limit = 6) => {
    return sortedArticles.filter(filterFn).slice(0, limit)
  }

  const hasKeyword = (article, keywords) => {
    const tags = Array.isArray(article.tags) ? article.tags.join(' ') : ''
    const text = `${article.title || ''} ${article.excerpt || ''} ${tags}`.toLowerCase()
    return keywords.some(keyword => text.includes(keyword.toLowerCase()))
  }

  const articleTabs = [
    { 
      name: '推荐', 
      description: '编辑精选内容', 
      articles: pickArticles(() => true)
    },
    { 
      name: '技能提升', 
      description: '职场方法和工具', 
      articles: pickArticles(article => ['职场发展', '生活技能', '兴趣爱好', '转型升级'].includes(article.category))
    },
    { 
      name: '经验分享', 
      description: '职场前辈案例', 
      articles: pickArticles(article => ['家庭关系', '心理健康', '中年危机'].includes(article.category))
    },
    { 
      name: '工具推荐', 
      description: '效率提升工具', 
      articles: pickArticles(article => hasKeyword(article, ['工具', '模板', '清单', '指南']) || ['生活技能', '职场发展'].includes(article.category))
    },
    { 
      name: '职业拓展', 
      description: '副业和投资方向', 
      articles: pickArticles(article => ['副业指南', '财务管理', '转型升级'].includes(article.category))
    },
    { 
      name: '心理建设', 
      description: '心理问题解决方案', 
      articles: pickArticles(article => article.category === '心理健康')
    }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const currentTabArticles = articleTabs[activeTab]?.articles || []

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Banner轮播区域 - 更加沉浸的设计 */}
      <Box 
        sx={{ 
          width: '100vw',
          height: { xs: 350, md: 450 },
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('/images/beach-banner-optimized.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ textAlign: 'center', zIndex: 2, px: 2, maxWidth: '800px' }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 800, 
            mb: 2.5,
            color: 'white',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            letterSpacing: '-0.03em'
          }}>
            中年自救指南
          </Typography>
          <Typography variant="h5" sx={{ 
            opacity: 0.9,
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.25rem' },
            mb: 5,
            lineHeight: 1.6,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            为 35+ 职场人提供实用的转型建议、理财规划与心理支持
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' })}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)'
              }}
            >
              开始探索
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* 主要容器 */}
      <Container 
        id="main-content"
        maxWidth="lg"
        sx={{ 
          px: { xs: 2, sm: 3 },
          pb: 8
        }}
      >
        {/* 主体内容区 - 左右分栏 */}
        <Box sx={{ display: 'flex', gap: { lg: 6, md: 4 }, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* 左侧主要内容 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 分类标签 - 更加现代的样式 */}
            <Box sx={{ 
              mb: 4, 
              position: 'sticky', 
              top: 0, 
              zIndex: 10, 
              backgroundColor: 'rgba(248, 250, 252, 0.8)',
              backdropFilter: 'blur(10px)',
              pt: 1
            }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  },
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 3,
                    mr: 1,
                    transition: 'all 0.2s'
                  }
                }}
              >
                {articleTabs.map((tab, index) => (
                  <Tab key={index} label={tab.name} />
                ))}
              </Tabs>
            </Box>

            {/* 文章列表 */}
            <Stack spacing={3}>
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">正在为您加载内容...</Typography>
                </Box>
              ) : currentTabArticles.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderStyle: 'dashed' }}>
                  <Typography color="text.secondary">该分类下暂无文章</Typography>
                </Paper>
              ) : (
                currentTabArticles.map((article, index) => (
                  <Card
                    key={article.id || index}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      cursor: 'pointer',
                      overflow: 'hidden',
                      height: { sm: 200 },
                      backgroundColor: 'background.paper',
                      '&:hover': {
                        '& .article-image': {
                          transform: 'scale(1.05)'
                        }
                      }
                    }}
                  >
                    <Box
                      className="article-image"
                      sx={{
                        width: { xs: '100%', sm: '35%' },
                        height: { xs: 200, sm: '100%' },
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 0.5s ease'
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundImage: article.image ? `url(${article.image})` : 'none',
                          backgroundColor: '#f1f5f9',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {!article.image && <AccessTime sx={{ fontSize: 40, color: 'divider' }} />}
                      </Box>
                      <Chip 
                        label={article.category} 
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 12, 
                          left: 12, 
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(4px)',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>

                    <CardContent sx={{ 
                      flex: 1, 
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between' 
                    }}>
                      <Box>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 1,
                            fontSize: '1.25rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.6
                          }}
                        >
                          {article.excerpt}
                        </Typography>
                      </Box>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.light' }}>
                            {article.author?.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {article.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            · {article.readTime}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} color="text.secondary">
                          <Typography variant="caption">👍 {Math.floor(Math.random() * 50)}</Typography>
                          <Typography variant="caption">💬 {Math.floor(Math.random() * 10)}</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Box>

          {/* 右侧边栏 - 更加精致的小组件 */}
          <Box sx={{ width: { lg: 320 }, display: { xs: 'none', lg: 'block' } }}>
            <Stack spacing={4} sx={{ position: 'sticky', top: 24 }}>
              
              {/* 会员专属入口 */}
              <Paper 
                sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                   加入会员 ✨
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                  解锁深度长文、AI 咨询与专属社区。
                </Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/membership')}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#1e293b',
                    '&:hover': { bgcolor: '#f8fafc' }
                  }}
                >
                  查看方案
                </Button>
              </Paper>

              {/* 热门精选 */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, px: 1 }}>
                  热门精选
                </Typography>
                <Stack spacing={2}>
                  {articlesData.slice(0, 4).map((article, i) => (
                    <Box 
                      key={i} 
                      onClick={() => navigate(`/article/${article.id}`)}
                      sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      <Box sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 1.5, 
                        bgcolor: 'grey.200',
                        backgroundImage: `url(${article.image})`,
                        backgroundSize: 'cover',
                        flexShrink: 0
                      }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4, mb: 0.5 }}>
                          {article.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {article.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* 工具箱 */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, px: 1 }}>
                  实用工具
                </Typography>
                <Stack spacing={1.5}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => navigate('/pension-planner')}
                    sx={{ justifyContent: 'flex-start', py: 1.5, px: 2 }}
                  >
                    🧮 养老金缺口测算
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={() => navigate('/complaints')}
                    sx={{ justifyContent: 'flex-start', py: 1.5, px: 2 }}
                  >
                    💡 想法与建议收集
                  </Button>
                </Stack>
              </Box>

            </Stack>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default Home
