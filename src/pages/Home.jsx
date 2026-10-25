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
  Slider
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  SpaceDashboardOutlined as DashboardIcon,
  BookmarkBorder as BookmarkIcon,
  LocalOfferOutlined as TagIcon,
  OpenInNew as OpenInNewIcon,
  Headphones as HeadphonesIcon,
  FilterList as FilterListIcon
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
  const [displayCount, setDisplayCount] = useState(12)

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
    return [...publishedArticles].sort((a, b) => {
      const diff = new Date(b.date || 0) - new Date(a.date || 0)
      if (diff !== 0) return diff
      return (b.id || '').localeCompare(a.id || '')
    })
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

  // 今日置顶精选（高信噪比置顶焦点头条）
  const heroArticle = sortedArticles[0] || {
    id: 'web-tianya-cycle-survival',
    title: '康波周期与大变局下，普通人如何保全资产与守住现金流',
    excerpt: '重读周金涛与天涯经济周期研判：面对经济下行与降薪风险，普通家庭最核心的不是追求超额收益，而是切断高风险杠杆，储备 36 个月刚性流动资金跑道。',
    author: 'KKndme',
    date: '2026-10-22',
    readTime: '12分钟精读',
    category: '财务管理',
    source: '天涯论坛',
    sourceUrl: 'https://bbs.tianya.cn/'
  }

  // 分类 Tabs
  const feedTabs = useMemo(() => [
    { id: 'hot', name: '全网精选', filter: () => true },
    { id: 'career', name: '找不到工作 / 维权', filter: a => ['职场发展', '转型升级'].includes(a.category) },
    { id: 'side', name: '副业与搞钱', filter: a => ['副业指南'].includes(a.category) },
    { id: 'finance', name: '房贷与钱袋子', filter: a => ['财务管理'].includes(a.category) },
    { id: 'frugal', name: '极简省钱', filter: a => ['生活技能'].includes(a.category) },
    { id: 'family', name: '夫妻与育儿', filter: a => ['家庭关系'].includes(a.category) },
    { id: 'mind', name: '心态调适', filter: a => ['心理健康', '中年危机'].includes(a.category) },
    { id: 'interests', name: '爱好与寄托', filter: a => ['兴趣爱好'].includes(a.category) },
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
      
      {/* 顶通微状态栏 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
              <Chip
                label="实战指南"
                size="small"
                sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.72rem', height: 20, borderRadius: 1 }}
              />
              <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.85rem', fontWeight: 600 }}>
                35+ 逆境自救与轻资产破局实战手册 · 真实经历 · 债务防线 · 技能变现
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Button
                size="small"
                onClick={() => navigate('/market-temperature')}
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
                全市场估值水位与资产四分法 →
              </Button>
              <Button
                size="small"
                onClick={() => navigate('/dashboard')}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                sx={{
                  color: '#4b5563',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  p: 0,
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                自救工作台
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 方案 A 主体：高信噪比情报雷达 (Readhub / Hacker News Style) */}
      <Container maxWidth="lg" sx={{ pt: 2.5, pb: 6 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2.5fr 1fr'
            },
            gap: 3,
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* 左侧：主情报流 (Pinned Focus + Filter Pills + Discussion Rows) */}
          <Box sx={{ width: '100%' }}>
            
            {/* 1. 今日置顶焦点速递 (Pinned Focus Bar) */}
            <Paper
              elevation={0}
              onClick={() => navigate(`/article/${heroArticle.id}`)}
              sx={{
                p: { xs: 1.8, sm: 2 },
                mb: 2.2,
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid #fed7aa',
                borderLeft: '4px solid #c2410c',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#c2410c',
                  boxShadow: '0 4px 16px rgba(194, 65, 12, 0.08)',
                  '& .focus-title': { color: '#c2410c' }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="今日焦点"
                    size="small"
                    sx={{
                      bgcolor: '#c2410c',
                      color: '#ffffff',
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
                      color: '#4b5563',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      height: 22,
                      borderRadius: 1
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    {heroArticle.hotMetric || '全网精选讨论'}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/article/${heroArticle.id}`)
                  }}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                  sx={{
                    bgcolor: '#c2410c',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    py: 0.4,
                    px: 1.5,
                    borderRadius: 1.2,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#9a3412' }
                  }}
                >
                  阅读全文 →
                </Button>
              </Box>

              <Typography
                className="focus-title"
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  fontSize: { xs: '0.98rem', sm: '1.05rem' },
                  lineHeight: 1.45,
                  mb: 0.6,
                  transition: 'color 0.15s'
                }}
              >
                {heroArticle.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#4b5563',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {heroArticle.excerpt}
              </Typography>
            </Paper>

            {/* 2. 一体化紧凑药丸筛选栏 (Integrated Pill Filter) */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 2 },
                mb: 2.2,
                borderRadius: 2,
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* 分类药丸 (Row 1) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflowX: 'auto', pb: 1, mb: 1.2, borderBottom: '1px solid #f3f4f6', '::-webkit-scrollbar': { display: 'none' } }}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', mr: 0.5 }}>
                  专栏方向:
                </Typography>
                {feedTabs.map((tab, idx) => {
                  const isSelected = activeTab === idx
                  return (
                    <Chip
                      key={tab.id}
                      label={tab.name}
                      size="small"
                      onClick={() => {
                        setActiveTab(idx)
                        setDisplayCount(12)
                      }}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.78rem',
                        height: 28,
                        borderRadius: 1.5,
                        px: 0.5,
                        whiteSpace: 'nowrap',
                        bgcolor: isSelected ? '#1f2937' : '#f9fafb',
                        color: isSelected ? '#ffffff' : '#4b5563',
                        border: isSelected ? '1px solid #1f2937' : '1px solid #e5e7eb',
                        transition: 'all 0.15s',
                        '&:hover': {
                          bgcolor: isSelected ? '#111827' : '#f3f4f6',
                          borderColor: isSelected ? '#111827' : '#d1d5db'
                        }
                      }}
                    />
                  )
                })}
              </Box>

              {/* 社区来源药丸 (Row 2) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, overflowX: 'auto', '::-webkit-scrollbar': { display: 'none' } }}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap', mr: 0.5 }}>
                  社区来源:
                </Typography>
                {[
                  { id: '全部', name: '全部社区', count: publishedArticles.length },
                  { id: '天涯论坛', name: '天涯', count: sourceCounts['天涯论坛'] || 0 },
                  { id: '知乎', name: '知乎', count: sourceCounts['知乎'] || 0 },
                  { id: 'LINUX DO', name: 'LINUX DO', count: sourceCounts['LINUX DO'] || 0 },
                  { id: '少数派', name: '少数派', count: sourceCounts['少数派'] || 0 },
                  { id: '小宇宙', name: '小宇宙', count: sourceCounts['小宇宙'] || 0 },
                  { id: '雪球', name: '雪球', count: sourceCounts['雪球'] || 0 },
                  { id: 'V2EX', name: 'V2EX', count: sourceCounts['V2EX'] || 0 },
                  { id: '豆瓣', name: '豆瓣', count: sourceCounts['豆瓣'] || 0 },
                ].map((src) => {
                  const isSelected = selectedSource === src.id
                  return (
                    <Chip
                      key={src.id}
                      label={`${src.name} (${src.count})`}
                      size="small"
                      onClick={() => {
                        setSelectedSource(src.id)
                        setDisplayCount(12)
                      }}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.72rem',
                        height: 24,
                        borderRadius: 1,
                        whiteSpace: 'nowrap',
                        bgcolor: isSelected ? '#c2410c' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#6b7280',
                        border: isSelected ? '1px solid #c2410c' : '1px solid #e5e7eb',
                        transition: 'all 0.15s',
                        '&:hover': {
                          bgcolor: isSelected ? '#9a3412' : '#f9fafb'
                        }
                      }}
                    />
                  )
                })}
              </Box>

              {/* 筛选统计与重置 */}
              {(searchTerm || selectedSource !== '全部' || activeTab !== 0) && (
                <Box sx={{ mt: 1.5, pt: 1.2, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    当前匹配到 <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{filteredArticles.length}</Typography> 条讨论
                    {selectedSource !== '全部' && ` · 来源: ${selectedSource}`}
                    {activeTab !== 0 && ` · 专栏: ${currentTab.name}`}
                    {searchTerm && ` · 关键词 "${searchTerm}"`}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedSource('全部')
                      setActiveTab(0)
                    }}
                    sx={{ color: '#c2410c', fontSize: '0.75rem', p: 0, minWidth: 'auto', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                  >
                    重置所有筛选
                  </Button>
                </Box>
              )}
            </Paper>

            {/* 3. 高密度讨论列表 (Readhub / Hacker News Feed) */}
            <Stack spacing={1.5} sx={{ width: '100%' }}>
              {visibleArticles.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
                return (
                  <Paper
                    key={article.id || idx}
                    elevation={0}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      p: 2,
                      width: '100%',
                      boxSizing: 'border-box',
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        borderColor: '#fdba74',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                        '& .article-title': { color: '#c2410c' }
                      }
                    }}
                  >
                    {/* 第一行：社区来源 + 分类 + 标题 */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 0.8 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap', flex: 1 }}>
                        {article.source && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              bgcolor: sourceStyles[article.source]?.bg || '#f3f4f6',
                              color: sourceStyles[article.source]?.color || '#374151',
                              border: `1px solid ${sourceStyles[article.source]?.border || '#e5e7eb'}`,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              px: 0.7,
                              py: 0.15,
                              borderRadius: 0.8,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {article.source}
                          </Typography>
                        )}
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            bgcolor: colorConfig.bg,
                            color: colorConfig.color,
                            border: `1px solid ${colorConfig.border}`,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            px: 0.6,
                            py: 0.15,
                            borderRadius: 0.8,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {article.category}
                        </Typography>

                        <Typography
                          className="article-title"
                          component="span"
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: '#111827',
                            fontSize: '0.98rem',
                            lineHeight: 1.45,
                            transition: 'color 0.15s'
                          }}
                        >
                          {article.title}
                        </Typography>
                      </Box>
                    </Box>

                    {/* 第二行：一句话精要导读 (单行截断，高信噪比) */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#4b5563',
                        fontSize: '0.86rem',
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1.2
                      }}
                    >
                      {article.excerpt || article.summary}
                    </Typography>

                    {/* 第三行：热度指标 + 播客名/时间 + 标签 + 阅读全文 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f9fafb', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {article.source === '小宇宙' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HeadphonesIcon sx={{ fontSize: 13, color: '#ea580c' }} />
                            <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, fontSize: '0.74rem' }}>
                              播客《{article.author || '知行小酒馆'}》
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.74rem', fontWeight: 600 }}>
                            {article.hotMetric || `${article.source || '全网'} 讨论`}
                          </Typography>
                        )}

                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.74rem' }}>
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
                              px: 0.7,
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

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      {article.sourceUrl && (
                        <Button
                          size="small"
                          variant="text"
                          component="a"
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          endIcon={<OpenInNewIcon sx={{ fontSize: 11 }} />}
                          sx={{
                            color: '#78716c',
                            fontSize: '0.74rem',
                            p: '2px 4px',
                            whiteSpace: 'nowrap',
                            '&:hover': { color: '#c2410c', bgcolor: 'transparent' }
                          }}
                        >
                          原帖 ↗
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/article/${article.id}`)
                        }}
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 13 }} />}
                        sx={{
                          color: '#c2410c',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          p: '2px 8px',
                          whiteSpace: 'nowrap',
                          '&:hover': { bgcolor: '#fff7ed' }
                        }}
                      >
                        阅读全文 →
                      </Button>
                    </Box>
                  </Box>
                </Paper>
                )
              })}
            </Stack>

            {/* 加载更多按钮 */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#374151',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    bgcolor: '#ffffff',
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                  }}
                >
                  加载更多实战讨论 (还有 {filteredArticles.length - visibleArticles.length} 篇待展开)
                </Button>
              </Box>
            )}
          </Box>

          {/* 右侧：精简实用工具与便签侧边栏 (Sticky Sidebar) */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.2}>
              
              {/* 挂件 1：工作台现金流跑道简易速测组件 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                  <DashboardIcon sx={{ color: '#c2410c', fontSize: 19 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    测测存款能撑多久
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  如果突然断了收入，手里的存款能在不降低生活质量的情况下维持多久。
                </Typography>

                <Box sx={{ mb: 1.8 }}>
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

                <Box sx={{ p: 1.4, borderRadius: 1.5, bgcolor: '#f9fafb', border: '1px solid #e5e7eb', textAlign: 'center', mb: 2 }}>
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
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    bgcolor: '#111827',
                    color: '#ffffff',
                    fontWeight: 700,
                    py: 0.9,
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
                  p: 2.2,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                  <BookmarkIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    被裁谈话的 3 条常识
                  </Typography>
                </Box>

                <Stack spacing={1.4}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      1. 千万别在现场匆忙签字
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.74rem', lineHeight: 1.5, display: 'block' }}>
                      把解除协议带回家看清再签，算清楚 N+1 与未休年假的折算。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      2. 趁没断网赶紧存好流水
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.74rem', lineHeight: 1.5, display: 'block' }}>
                      权限切断前，把打卡记录、绩效通知和近 12 个月工资流水保存好。
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#1f2937', display: 'block' }}>
                      3. 主动离职领不到失业金
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.74rem', lineHeight: 1.5, display: 'block' }}>
                      协议上必须明确写着用人单位提出解除，才能享受失业金和医保代缴。
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* 挂件 3：热门实战标签云 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.2 }}>
                  <TagIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    大家常搜的话题
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {popularTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => {
                        setSearchTerm(tag)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      sx={{
                        bgcolor: '#f3f4f6',
                        color: '#4b5563',
                        fontSize: '0.74rem',
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
