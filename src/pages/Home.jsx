import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
  Slider
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  SpaceDashboardOutlined as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  BookmarkBorder as BookmarkIcon,
  LocalOfferOutlined as TagIcon,
  OpenInNew as OpenInNewIcon,
  Headphones as HeadphonesIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const categoryStyles = {
  '职场发展': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  '转型升级': { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  '副业指南': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  '财务管理': { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  '中年危机': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  '心理健康': { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4' },
  '家庭关系': { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
  '生活技能': { bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
  '兴趣爱好': { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff' },
}

const sourceStyles = {
  '小宇宙': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'LINUX DO': { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' },
  '天涯论坛': { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  '知乎': { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  '少数派': { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  'V2EX': { bg: '#f3f4f6', color: '#1f2937', border: '#e5e7eb' },
  '雪球': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  '掘金': { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd' },
  '豆瓣': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
}

const popularTags = [
  '2N赔偿',
  '失业金代缴医保',
  '房贷协商延期',
  'Chrome插件出海',
  'n8n外贸自动化',
  '周金涛康波',
  '极简做饭省钱',
  '大理旅居',
  '闲鱼卖闲置回血',
  '35岁程序员转型'
]

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const [activeTab, setActiveTab] = useState(0)
  const [selectedSource, setSelectedSource] = useState('全部')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayCount, setDisplayCount] = useState(10)

  // 侧边栏挂件：家庭现金流跑道简易速算
  const [sidebarSavings, setSidebarSavings] = useState(30)
  const [sidebarMonthly, setSidebarMonthly] = useState(12000)

  const sidebarRunway = useMemo(() => {
    if (!sidebarMonthly) return '0.0'
    return ((sidebarSavings * 10000) / sidebarMonthly).toFixed(1)
  }, [sidebarSavings, sidebarMonthly])

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  // 各来源平台统计数
  const sourceCounts = useMemo(() => {
    const counts = {}
    publishedArticles.forEach(a => {
      const s = a.source || '其他'
      counts[s] = (counts[s] || 0) + 1
    })
    return counts
  }, [publishedArticles])

  // 各专栏统计数
  const categoryCounts = useMemo(() => {
    return {
      career: publishedArticles.filter(a => ['职场发展', '转型升级'].includes(a.category)).length,
      side: publishedArticles.filter(a => ['副业指南'].includes(a.category)).length,
      finance: publishedArticles.filter(a => ['财务管理'].includes(a.category)).length,
      family: publishedArticles.filter(a => ['中年危机', '心理健康', '家庭关系', '生活技能'].includes(a.category)).length,
    }
  }, [publishedArticles])

  // 少数派式头条焦点（置顶重磅特稿）
  const heroArticle = sortedArticles[0] || {
    id: 'web-tianya-cycle-survival',
    title: '康波周期与大变局下，普通人如何保全资产与守住现金流',
    excerpt: '重读周金涛与天涯经济周期研判：面对经济下行与降薪风险，普通家庭最核心的不是追求超额收益，而是切断高风险杠杆，储备 36 个月刚性流动资金跑道。',
    author: 'KKndme',
    date: '2026-10-22',
    readTime: '12分钟精读',
    category: '财务管理',
    source: '天涯论坛'
  }

  // 热门排行前 4 篇
  const trendingArticles = useMemo(() => {
    return sortedArticles.slice(1, 5)
  }, [sortedArticles])

  // 分类 Tabs
  const feedTabs = useMemo(() => [
    { id: 'hot', name: '全网热帖', filter: () => true },
    { id: 'career', name: '职场与维权', filter: a => ['职场发展', '转型升级'].includes(a.category) },
    { id: 'side', name: '副业与搞钱', filter: a => ['副业指南'].includes(a.category) },
    { id: 'finance', name: '房贷与钱袋子', filter: a => ['财务管理'].includes(a.category) },
    { id: 'mind', name: '生活与心态', filter: a => ['中年危机', '心理健康', '家庭关系', '生活技能'].includes(a.category) },
  ], [])

  const currentTab = feedTabs[activeTab] || feedTabs[0]

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter(article => {
      // 1. 分类匹配
      const matchCategory = currentTab.filter(article)
      if (!matchCategory) return false

      // 2. 社区来源匹配
      if (selectedSource !== '全部' && article.source !== selectedSource) {
        return false
      }

      // 3. 搜索词匹配
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        const titleMatch = (article.title || '').toLowerCase().includes(term)
        const excerptMatch = (article.excerpt || article.summary || '').toLowerCase().includes(term)
        const tagMatch = Array.isArray(article.tags) && article.tags.some(t => t.toLowerCase().includes(term))
        const sourceMatch = (article.source || '').toLowerCase().includes(term)
        const authorMatch = (article.author || '').toLowerCase().includes(term)
        if (!titleMatch && !excerptMatch && !tagMatch && !sourceMatch && !authorMatch) {
          return false
        }
      }

      return true
    })
  }, [sortedArticles, currentTab, selectedSource, searchTerm])

  const visibleArticles = filteredArticles.slice(0, displayCount)
  const hasMore = filteredArticles.length > displayCount

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 全网动态顶通提示条 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
              <Chip
                label="每日收录"
                size="small"
                sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.72rem', height: 20, borderRadius: 1 }}
              />
              <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.85rem', fontWeight: 600 }}>
                聚合天涯神贴、LINUX DO搞钱项目、小宇宙播客与真实经历 (已整理 {publishedArticles.length} 篇)
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: { xs: 'none', md: 'inline' } }}>
                · 每天凌晨自动同步
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                size="small"
                onClick={() => navigate('/dashboard')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                sx={{
                  color: '#c2410c',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  p: 0,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                测算备用金能撑多久 →
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 少数派经典 Hero：左侧焦点大卡 + 右侧排行列表 (01-04) */}
      <Container maxWidth="lg" sx={{ pt: 3.5, pb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1.7fr 1fr'
            },
            gap: 2.5,
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {/* 左侧：今日置顶焦点热帖 */}
          <Paper
            elevation={0}
            onClick={() => {
              if (heroArticle.sourceUrl) {
                window.open(heroArticle.sourceUrl, '_blank')
              } else {
                navigate(`/article/${heroArticle.id}`)
              }
            }}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#c2410c',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                '& .hero-title': { color: '#c2410c' }
              }
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label="今日焦点"
                  size="small"
                  sx={{
                    bgcolor: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    height: 22,
                    borderRadius: 1
                  }}
                />
                {heroArticle.source && (
                  <Chip
                    label={heroArticle.source}
                    size="small"
                    sx={{
                      bgcolor: sourceStyles[heroArticle.source]?.bg || '#f3f4f6',
                      color: sourceStyles[heroArticle.source]?.color || '#374151',
                      border: `1px solid ${sourceStyles[heroArticle.source]?.border || '#e5e7eb'}`,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      height: 22,
                      borderRadius: 1
                    }}
                  />
                )}
                <Chip
                  label={heroArticle.category}
                  size="small"
                  sx={{
                    bgcolor: '#f3f4f6',
                    color: '#6b7280',
                    fontWeight: 600,
                    fontSize: '0.72rem',
                    height: 22,
                    borderRadius: 1
                  }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  {heroArticle.hotMetric || '420+ 条讨论'}
                </Typography>
              </Box>

              <Typography
                className="hero-title"
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  lineHeight: 1.4,
                  mb: 1.5,
                  transition: 'color 0.15s'
                }}
              >
                {heroArticle.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#4b5563',
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {heroArticle.excerpt}
              </Typography>

              {heroArticle.tags && heroArticle.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mb: 2 }}>
                  {heroArticle.tags.slice(0, 4).map((t) => (
                    <Typography
                      key={t}
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        bgcolor: '#f4f5f8',
                        fontSize: '0.72rem',
                        px: 0.9,
                        py: 0.2,
                        borderRadius: 0.8
                      }}
                    >
                      #{t}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={{ pt: 1.5, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600, fontSize: '0.8rem' }}>
                  {heroArticle.source === '小宇宙' ? `播客《${heroArticle.author || '知行小酒馆'}》` : (heroArticle.hotMetric || `${heroArticle.source || '全网'} 讨论`)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  · {heroArticle.date || '近期'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {heroArticle.sourceUrl && (
                  <Button
                    size="small"
                    variant="contained"
                    component="a"
                    href={heroArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      bgcolor: '#c2410c',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      py: 0.5,
                      px: 1.8,
                      borderRadius: 1.2,
                      whiteSpace: 'nowrap',
                      '&:hover': { bgcolor: '#9a3412' }
                    }}
                  >
                    前往{heroArticle.source || '原帖'}讨论 ↗
                  </Button>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/article/${heroArticle.id}`)
                  }}
                  sx={{
                    borderColor: '#e5e7eb',
                    color: '#4b5563',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    py: 0.4,
                    px: 1.2,
                    borderRadius: 1.2,
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#c2410c', color: '#c2410c' }
                  }}
                >
                  速览要点
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* 右侧：少数派热门排行 (01 - 04) */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUpIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', fontSize: '0.98rem' }}>
                  大家都在看
                </Typography>
              </Box>

              <Stack spacing={2}>
                {trendingArticles.map((art, idx) => (
                  <Box
                    key={art.id || idx}
                    onClick={() => {
                      if (art.sourceUrl) {
                        window.open(art.sourceUrl, '_blank')
                      } else {
                        navigate(`/article/${art.id}`)
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      '&:hover .rank-title': { color: '#c2410c' }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        color: idx === 0 ? '#c2410c' : '#9ca3af',
                        minWidth: 24,
                        fontFamily: '"SF Pro Display", sans-serif'
                      }}
                    >
                      0{idx + 1}
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        className="rank-title"
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#1f2937',
                          lineHeight: 1.45,
                          fontSize: '0.88rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          transition: 'color 0.15s'
                        }}
                      >
                        {art.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.5, flexWrap: 'wrap' }}>
                        {art.source && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              bgcolor: sourceStyles[art.source]?.bg || '#f3f4f6',
                              color: sourceStyles[art.source]?.color || '#4b5563',
                              border: `1px solid ${sourceStyles[art.source]?.border || '#e5e7eb'}`,
                              px: 0.6,
                              py: 0.1,
                              borderRadius: 0.6,
                              fontSize: '0.68rem',
                              fontWeight: 700
                            }}
                          >
                            {art.source}
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          {art.hotMetric || '全网热帖'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                variant="text"
                onClick={() => navigate('/articles')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                sx={{ color: '#4b5563', fontWeight: 600, fontSize: '0.8rem', p: 0, '&:hover': { color: '#c2410c', bgcolor: 'transparent' } }}
              >
                浏览更多热帖
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* 主流信息流 + 实用工具侧边栏 */}
      <Container maxWidth="lg" sx={{ pt: 1, pb: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2.3fr 1fr'
            },
            gap: 3.5,
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* 左侧：主流文章流 (Feed) */}
          <Box sx={{ width: '100%' }}>
            
            {/* 分类 Tabs 切换条 */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 1.5, backgroundColor: '#ffffff', borderRadius: 2, p: 0.5, border: '1px solid #e5e7eb' }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => {
                  setActiveTab(val)
                  setDisplayCount(10)
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 40,
                  '& .MuiTabs-indicator': { backgroundColor: '#c2410c', height: 2 },
                  '& .MuiTab-root': {
                    minHeight: 40,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    color: '#6b7280',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    '&.Mui-selected': { color: '#c2410c' }
                  }
                }}
              >
                {feedTabs.map((tab) => (
                  <Tab key={tab.id} label={tab.name} />
                ))}
              </Tabs>
            </Box>

            {/* 社区来源快捷筛选胶囊 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 2.5, overflowX: 'auto', pb: 0.5, '::-webkit-scrollbar': { display: 'none' } }}>
              <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', mr: 0.5 }}>
                社区来源:
              </Typography>
              {[
                { id: '全部', name: '全部社区', count: publishedArticles.length },
                { id: '天涯论坛', name: '天涯论坛', count: sourceCounts['天涯论坛'] || 0 },
                { id: '知乎', name: '知乎', count: sourceCounts['知乎'] || 0 },
                { id: 'LINUX DO', name: 'LINUX DO', count: sourceCounts['LINUX DO'] || 0 },
                { id: '少数派', name: '少数派', count: sourceCounts['少数派'] || 0 },
                { id: '小宇宙', name: '小宇宙播客', count: sourceCounts['小宇宙'] || 0 },
                { id: '雪球', name: '雪球', count: sourceCounts['雪球'] || 0 },
                { id: 'V2EX', name: 'V2EX', count: sourceCounts['V2EX'] || 0 },
                { id: '豆瓣', name: '豆瓣', count: sourceCounts['豆瓣'] || 0 },
              ].map((src) => {
                const isSelected = selectedSource === src.id
                return (
                  <Chip
                    key={src.id}
                    label={`${src.name} ${src.count}`}
                    size="small"
                    onClick={() => {
                      setSelectedSource(src.id)
                      setDisplayCount(10)
                    }}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.72rem',
                      height: 24,
                      borderRadius: 1,
                      whiteSpace: 'nowrap',
                      bgcolor: isSelected ? '#1f2937' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#4b5563',
                      border: isSelected ? '1px solid #1f2937' : '1px solid #e5e7eb',
                      '&:hover': {
                        bgcolor: isSelected ? '#111827' : '#f3f4f6'
                      }
                    }}
                  />
                )
              })}
            </Box>

            {/* 检索结果统计提示 */}
            {(searchTerm || selectedSource !== '全部') && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  筛选出 <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{filteredArticles.length}</Typography> 条讨论
                  {selectedSource !== '全部' && ` (来源: ${selectedSource})`}
                  {searchTerm && ` (包含关键词 "${searchTerm}")`}
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSource('全部')
                  }}
                  sx={{ color: '#c2410c', fontSize: '0.75rem', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  重置筛选
                </Button>
              </Box>
            )}

            {/* 少数派标准文章卡片列表 */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              {visibleArticles.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
                return (
                  <Paper
                    key={article.id || idx}
                    elevation={0}
                    onClick={() => {
                      if (article.sourceUrl) {
                        window.open(article.sourceUrl, '_blank')
                      } else {
                        navigate(`/article/${article.id}`)
                      }
                    }}
                    sx={{
                      p: 2.5,
                      width: '100%',
                      boxSizing: 'border-box',
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#c2410c',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                        '& .article-title': { color: '#c2410c' }
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          bgcolor: colorConfig.bg,
                          color: colorConfig.color,
                          border: `1px solid ${colorConfig.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          height: 20,
                          borderRadius: 0.8
                        }}
                      />
                      {article.source && (
                        <Chip
                          label={`来源 · ${article.source}`}
                          size="small"
                          sx={{
                            bgcolor: sourceStyles[article.source]?.bg || '#f3f4f6',
                            color: sourceStyles[article.source]?.color || '#374151',
                            border: `1px solid ${sourceStyles[article.source]?.border || '#e5e7eb'}`,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            height: 20,
                            borderRadius: 0.8
                          }}
                        />
                      )}
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {article.hotMetric || '全网精选'}
                      </Typography>
                    </Box>

                    <Typography
                      className="article-title"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1.02rem',
                        lineHeight: 1.45,
                        mb: 0.8,
                        transition: 'color 0.15s'
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4b5563',
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1.5
                      }}
                    >
                      {article.excerpt || article.summary}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.2, borderTop: '1px solid #f9fafb', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {article.source === '小宇宙' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HeadphonesIcon sx={{ fontSize: 14, color: '#ea580c' }} />
                            <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, fontSize: '0.75rem' }}>
                              播客《{article.author || '知行小酒馆'}》
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem', fontWeight: 600 }}>
                            {article.hotMetric || `${article.source || '全网'} 讨论`}
                          </Typography>
                        )}

                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          · {article.date || '近期'}
                        </Typography>

                        {article.tags && article.tags.slice(0, 3).map((t) => (
                          <Typography
                            key={t}
                            variant="caption"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSearchTerm(t)
                            }}
                            sx={{
                              color: '#6b7280',
                              fontSize: '0.7rem',
                              bgcolor: '#f3f4f6',
                              px: 0.8,
                              py: 0.1,
                              borderRadius: 0.8,
                              cursor: 'pointer',
                              '&:hover': { color: '#c2410c', bgcolor: '#ffedd5' }
                            }}
                          >
                            #{t}
                          </Typography>
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {article.sourceUrl && (
                          <Button
                            size="small"
                            variant="text"
                            component="a"
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
                            sx={{
                              color: '#c2410c',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              p: '2px 8px',
                              whiteSpace: 'nowrap',
                              '&:hover': { bgcolor: '#fff7ed' }
                            }}
                          >
                            前往原帖讨论 ↗
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/article/${article.id}`)
                          }}
                          sx={{
                            color: '#9ca3af',
                            fontSize: '0.75rem',
                            p: '2px 6px',
                            whiteSpace: 'nowrap',
                            '&:hover': { color: '#4b5563', bgcolor: 'transparent' }
                          }}
                        >
                          速览
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                )
              })}
            </Stack>

            {/* 加载更多 */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setDisplayCount(prev => prev + 10)}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#374151',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    bgcolor: '#ffffff',
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                  }}
                >
                  加载更多实战指南 ({filteredArticles.length - visibleArticles.length} 篇待展开)
                </Button>
              </Box>
            )}
          </Box>

          {/* 右侧：少数派风格侧边栏 (Sidebar Widgets) */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.5}>
              
              {/* 挂件 1：工作台现金流跑道简易速测组件 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <DashboardIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    测测存款能撑多久
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  算一算如果突然断了收入，手里的存款能在不降低生活质量的情况下维持多久。
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>手头可动用存款</Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>{sidebarSavings} 万元</Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={sidebarSavings}
                    min={0}
                    max={120}
                    step={5}
                    onChange={(e, v) => setSidebarSavings(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#4b5563', fontWeight: 600 }}>全家每月刚性支出</Typography>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>¥{sidebarMonthly.toLocaleString()}</Typography>
                  </Box>
                  <Slider
                    size="small"
                    value={sidebarMonthly}
                    min={5000}
                    max={25000}
                    step={1000}
                    onChange={(e, v) => setSidebarMonthly(v)}
                    sx={{ color: '#c2410c' }}
                  />
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', textAlign: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>大概能维持生活</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#c2410c', my: 0.2 }}>
                    {sidebarRunway} <Typography component="span" variant="caption" sx={{ color: '#6b7280' }}>个月</Typography>
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  onClick={() => navigate('/dashboard')}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    bgcolor: '#111827',
                    color: '#ffffff',
                    fontWeight: 700,
                    py: 1,
                    borderRadius: 1.5,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#c2410c' }
                  }}
                >
                  去工作台查看完整自测
                </Button>
              </Paper>

              {/* 挂件 2：被裁当天的常识便签 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BookmarkIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    被裁谈话的 3 条常识
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      1. 千万别在现场匆忙签字
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      把解除协议带回家看清再签，算清楚 N+1 与未休年假的折算。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      2. 趁没断网赶紧存好流水
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      权限切断前，把打卡记录、绩效通知和近 12 个月工资流水保存好。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      3. 主动离职领不到失业金
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', lineHeight: 1.5, display: 'block' }}>
                      协议上必须明确写着用人单位提出解除，才能享受失业金和医保代缴。
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 挂件 3：热门实战标签云 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TagIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    大家常搜的话题
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                      sx={{
                        bgcolor: '#f3f4f6',
                        color: '#4b5563',
                        fontSize: '0.75rem',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#fee2e2', color: '#b91c1c' }
                      }}
                    />
                  ))}
                </Box>
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
