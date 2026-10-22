import { useMemo, useState } from 'react'
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
  Tab,
  Button,
  Card,
  CardContent,
  Skeleton,
  Grid
} from '@mui/material'
import {
  AccessTime,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  FamilyRestroom as FamilyIcon,
  Psychology as PsychologyIcon,
  Calculate as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  RateReview as RateReviewIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as SparkleIcon,
  MenuBook as BookIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 颜色映射系统
const categoryGradients = {
  '职场发展': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  '转型升级': 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
  '副业指南': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
  '财务管理': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
  '中年危机': 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
  '心理健康': 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  '家庭关系': 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
  '生活技能': 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
  '兴趣爱好': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
}

const getCategoryIcon = (category) => {
  switch (category) {
    case '职场发展':
    case '转型升级':
    case '副业指南':
      return <WorkIcon sx={{ fontSize: 32, color: 'white' }} />
    case '财务管理':
      return <AccountBalanceIcon sx={{ fontSize: 32, color: 'white' }} />
    case '家庭关系':
    case '生活技能':
      return <FamilyIcon sx={{ fontSize: 32, color: 'white' }} />
    case '中年危机':
    case '心理健康':
    case '兴趣爱好':
    default:
      return <PsychologyIcon sx={{ fontSize: 32, color: 'white' }} />
  }
}

// 稳定一致的点赞与讨论数生成
const getDeterministicStats = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const likes = Math.abs(hash % 50) + 18
  const comments = Math.abs((hash >> 3) % 16) + 3
  return { likes, comments }
}

const Home = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(8)
  const navigate = useNavigate()
  const { getAllArticles, loading } = useArticles()

  // 获取已发布文章
  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(article => article.status === 'published')
  }, [getAllArticles])

  // 按日期降序排序
  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  // 四大核心支柱分类体系定义
  const pillarTabs = useMemo(() => [
    {
      id: 'all',
      name: '🔥 全部精选',
      badge: sortedArticles.length,
      filter: () => true
    },
    {
      id: 'career',
      name: '💼 职场·副业·转型',
      badge: sortedArticles.filter(a => ['职场发展', '转型升级', '副业指南'].includes(a.category)).length,
      filter: (a) => ['职场发展', '转型升级', '副业指南'].includes(a.category)
    },
    {
      id: 'finance',
      name: '💰 财务·养老规划',
      badge: sortedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      filter: (a) => ['财务管理'].includes(a.category)
    },
    {
      id: 'family',
      name: '🏡 家庭·生活效能',
      badge: sortedArticles.filter(a => ['家庭关系', '生活技能'].includes(a.category)).length,
      filter: (a) => ['家庭关系', '生活技能'].includes(a.category)
    },
    {
      id: 'mind',
      name: '🌱 身心·危机破局',
      badge: sortedArticles.filter(a => ['中年危机', '心理健康', '兴趣爱好'].includes(a.category)).length,
      filter: (a) => ['中年危机', '心理健康', '兴趣爱好'].includes(a.category)
    }
  ], [sortedArticles])

  const currentTabObj = pillarTabs[activeTab] || pillarTabs[0]
  const currentFilteredArticles = useMemo(() => {
    return sortedArticles.filter(currentTabObj.filter)
  }, [sortedArticles, currentTabObj])

  const visibleArticles = currentFilteredArticles.slice(0, displayCount)
  const hasMore = currentFilteredArticles.length > displayCount

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setDisplayCount(8) // 切换分类重置展示数量
  }

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6)
  }

  const handlePillarCardClick = (tabIndex) => {
    setActiveTab(tabIndex)
    const element = document.getElementById('articles-feed-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 全新现代智库 Hero 区域 */}
      <Box 
        sx={{ 
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 9 },
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 65%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 背景光晕装饰 */}
        <Box 
          sx={{
            position: 'absolute',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.04) 50%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* 顶栏徽章 */}
          <Chip
            icon={<SparkleIcon sx={{ fontSize: 16, color: '#2563eb !important' }} />}
            label="专为 35+ 职场人量身打造的自救与破局智库"
            sx={{
              mb: 3,
              px: 1.5,
              py: 2.2,
              borderRadius: '50px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              border: '1px solid #bfdbfe',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.08)'
            }}
          />

          {/* 主标题 */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              color: '#0f172a',
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
              letterSpacing: '-0.03em',
              lineHeight: 1.15
            }}
          >
            中年自救指南
          </Typography>

          {/* 副标题 */}
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#475569',
              fontWeight: 400,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              mb: 4,
              lineHeight: 1.6,
              maxWidth: '720px',
              mx: 'auto'
            }}
          >
            破解 35+ 职场危机 · 探索副业第二曲线 · 测算家庭养老防守 · 安顿身心秩序
          </Typography>

          {/* 数据指标胶囊 */}
          <Stack 
            direction="row" 
            spacing={{ xs: 1.5, sm: 3 }} 
            justifyContent="center" 
            flexWrap="wrap" 
            useFlexGap
            sx={{ mb: 6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
              <BookIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <span>{publishedArticles.length || 137} 篇实战指南</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
              <FireIcon sx={{ fontSize: 18, color: '#ef4444' }} />
              <span>4 大自救支柱维度</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
              <CalculateIcon sx={{ fontSize: 18, color: '#059669' }} />
              <span>智能养老金缺口测算</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#334155', fontSize: '0.9rem', fontWeight: 600 }}>
              <StarIcon sx={{ fontSize: 18, color: '#d97706' }} />
              <span>100% 拒绝空洞说教</span>
            </Box>
          </Stack>

          {/* 四大支柱快速入口卡片 */}
          <Grid container spacing={2.5} justifyContent="center">
            {[
              {
                title: '💼 职场与副业',
                desc: '35岁突围 · 技能变现 · 转型升级',
                count: '47 篇',
                tabIndex: 1,
                color: '#2563eb',
                bg: 'rgba(37, 99, 235, 0.04)',
                border: '#bfdbfe'
              },
              {
                title: '💰 财务与养老',
                desc: '家庭抗风险 · 资产配置 · 养老测算',
                count: '15 篇 + 工具',
                tabIndex: 2,
                color: '#d97706',
                bg: 'rgba(217, 119, 6, 0.04)',
                border: '#fde68a'
              },
              {
                title: '🏡 家庭与生活',
                desc: '青春期沟通 · 夫妻关系 · 效能统筹',
                count: '30 篇',
                tabIndex: 3,
                color: '#db2777',
                bg: 'rgba(219, 39, 119, 0.04)',
                border: '#fbcfe8'
              },
              {
                title: '🌱 身心与破局',
                desc: '中年焦虑 · 情绪边界 · 找回热爱',
                count: '45 篇',
                tabIndex: 4,
                color: '#7c3aed',
                bg: 'rgba(124, 58, 237, 0.04)',
                border: '#ddd6fe'
              }
            ].map((pillar) => (
              <Grid item xs={12} sm={6} md={3} key={pillar.title}>
                <Paper
                  onClick={() => handlePillarCardClick(pillar.tabIndex)}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    height: '100%',
                    textAlign: 'left',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: pillar.border,
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                      borderColor: pillar.color,
                      backgroundColor: pillar.bg
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {pillar.title}
                    </Typography>
                    <Chip 
                      label={pillar.count} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        bgcolor: pillar.bg, 
                        color: pillar.color 
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {pillar.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 主体内容区 */}
      <Container 
        id="articles-feed-section"
        maxWidth="lg" 
        sx={{ 
          pt: 5,
          pb: 10,
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ display: 'flex', gap: { lg: 5, md: 4 }, flexDirection: { xs: 'column', lg: 'row' } }}>
          
          {/* 左侧主要内容流 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 分类标签栏 */}
            <Box 
              sx={{ 
                mb: 3.5, 
                position: 'sticky', 
                top: 64, 
                zIndex: 10, 
                backgroundColor: 'rgba(248, 250, 252, 0.92)',
                backdropFilter: 'blur(12px)',
                py: 1,
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: 'primary.main'
                  },
                  '& .MuiTab-root': {
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    mr: 1,
                    borderRadius: 2,
                    color: '#64748b',
                    '&.Mui-selected': {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                {pillarTabs.map((tab, index) => (
                  <Tab 
                    key={tab.id} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <span>{tab.name}</span>
                        <Typography 
                          component="span" 
                          sx={{ 
                            fontSize: '0.75rem', 
                            bgcolor: activeTab === index ? 'primary.50' : 'grey.200',
                            color: activeTab === index ? 'primary.main' : 'text.secondary',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '10px',
                            fontWeight: 700
                          }}
                        >
                          {tab.badge}
                        </Typography>
                      </Box>
                    } 
                  />
                ))}
              </Tabs>
            </Box>

            {/* 文章列表 */}
            <Stack spacing={2.5}>
              {loading ? (
                <Stack spacing={2.5}>
                  {[1, 2, 3, 4].map((n) => (
                    <Card key={n} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: { sm: 190 }, borderRadius: 3 }}>
                      <Skeleton variant="rectangular" sx={{ width: { xs: '100%', sm: '32%' }, height: { xs: 160, sm: '100%' } }} />
                      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                          <Skeleton variant="text" width="100%" height={20} />
                          <Skeleton variant="text" width="90%" height={20} />
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Skeleton variant="circular" width={24} height={24} />
                          <Skeleton variant="text" width={80} height={20} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : visibleArticles.length === 0 ? (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: 3, 
                    border: '1px dashed #cbd5e1', 
                    bgcolor: 'white' 
                  }}
                >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    该分类下正在整理更多干货内容
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    敬请期待即将上线的新文章与专题指导
                  </Typography>
                </Paper>
              ) : (
                visibleArticles.map((article, index) => {
                  const stats = getDeterministicStats(article.id || article.title)
                  const gradient = categoryGradients[article.category] || 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'

                  return (
                    <Card
                      key={article.id || index}
                      onClick={() => navigate(`/article/${article.id}`)}
                      elevation={0}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        cursor: 'pointer',
                        overflow: 'hidden',
                        minHeight: { sm: 190 },
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 3,
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 28px rgba(0,0,0,0.07)',
                          borderColor: '#cbd5e1',
                          '& .card-title': {
                            color: 'primary.main'
                          }
                        }
                      }}
                    >
                      {/* 精致的卡片左侧封面区 */}
                      <Box
                        sx={{
                          width: { xs: '100%', sm: 190 },
                          minWidth: { sm: 190 },
                          height: { xs: 150, sm: 'auto' },
                          background: article.image ? `url(${article.image})` : gradient,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 2,
                          position: 'relative',
                          color: 'white',
                          textAlign: 'center'
                        }}
                      >
                        {!article.image && (
                          <>
                            <Box sx={{ mb: 1, opacity: 0.95 }}>
                              {getCategoryIcon(article.category)}
                            </Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 700, 
                                letterSpacing: '0.05em',
                                opacity: 0.95,
                                fontSize: '0.75rem' 
                              }}
                            >
                              {article.category}
                            </Typography>
                          </>
                        )}
                        {article.image && (
                          <Chip 
                            label={article.category} 
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              left: 10, 
                              backgroundColor: 'rgba(255,255,255,0.92)',
                              backdropFilter: 'blur(4px)',
                              fontWeight: 700,
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                      </Box>

                      {/* 卡片右侧内容区 */}
                      <CardContent 
                        sx={{ 
                          flex: 1, 
                          p: { xs: 2.5, sm: 3 }, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'space-between' 
                        }}
                      >
                        <Box>
                          <Typography 
                            className="card-title"
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              mb: 1.2,
                              fontSize: { xs: '1.1rem', sm: '1.2rem' },
                              lineHeight: 1.35,
                              color: '#0f172a',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              transition: 'color 0.2s'
                            }}
                          >
                            {article.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.6,
                              fontSize: '0.88rem'
                            }}
                          >
                            {article.excerpt || article.summary}
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2.5 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main', fontWeight: 700 }}>
                                {article.author?.charAt(0) || '指'}
                              </Avatar>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155' }}>
                                {article.author || '特约导师'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                · {article.readTime || '3分钟阅读'}
                              </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1.5} sx={{ color: '#64748b' }}>
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                👍 {article.likes ?? stats.likes}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                💬 {article.comments ?? stats.comments}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </Stack>

            {/* 加载更多 / 浏览进度栏 */}
            {visibleArticles.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4, pt: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                  已展示 {visibleArticles.length} / {currentFilteredArticles.length} 篇精选指南
                </Typography>
                {hasMore && (
                  <Button 
                    variant="outlined"
                    onClick={handleLoadMore}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                      borderColor: '#cbd5e1',
                      color: '#334155',
                      bgcolor: 'white',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50',
                        color: 'primary.main'
                      }
                    }}
                  >
                    加载更多内容 ({currentFilteredArticles.length - visibleArticles.length} 篇)
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* 右侧边栏 */}
          <Box sx={{ width: { lg: 320 }, display: { xs: 'none', lg: 'block' } }}>
            <Stack spacing={3.5} sx={{ position: 'sticky', top: 88 }}>
              
              {/* 核心亮点：养老金测算工具专属推荐卡片 */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
                  color: 'white',
                  borderRadius: 3,
                  border: '1px solid #3b82f6',
                  boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <CalculateIcon sx={{ color: '#60a5fa' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                    养老金缺口测算
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.85, mb: 2.5, fontSize: '0.85rem', lineHeight: 1.6 }}>
                  输入当前年龄、月支出与储蓄，3分钟测算退休时的资金缺口与抗风险底线。
                </Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => navigate('/pension-planner')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    bgcolor: '#2563eb', 
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: 2.5,
                    py: 1,
                    '&:hover': { bgcolor: '#1d4ed8' }
                  }}
                >
                  立即智能测算
                </Button>
              </Paper>

              {/* 热门精选榜单 */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  backgroundColor: 'white', 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0' 
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#0f172a' }}>
                  <FireIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                  精选必读榜
                </Typography>
                <Stack spacing={2}>
                  {sortedArticles.slice(0, 5).map((article, i) => (
                    <Box 
                      key={article.id || i} 
                      onClick={() => navigate(`/article/${article.id}`)}
                      sx={{ 
                        display: 'flex', 
                        gap: 1.5, 
                        cursor: 'pointer',
                        p: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#f1f5f9' }
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontSize: '1rem', 
                          fontWeight: 800, 
                          color: i < 3 ? 'primary.main' : 'text.disabled',
                          minWidth: 20 
                        }}
                      >
                        0{i + 1}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            lineHeight: 1.4, 
                            color: '#1e293b',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {article.category} · {article.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* 意见与共创卡片 */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2.5, 
                  backgroundColor: 'white', 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0' 
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                  💡 读者共创与想法建议
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.82rem', mb: 2 }}>
                  遇到了哪些中年困惑？欢迎向我们提出您想看的选题或工具需求。
                </Typography>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="small"
                  onClick={() => navigate('/complaints')}
                  startIcon={<RateReviewIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  提交建议反馈
                </Button>
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
