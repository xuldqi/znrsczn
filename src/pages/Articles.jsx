import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  SpaceDashboardOutlined as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  OpenInNew as OpenInNewIcon,
  Headphones as HeadphonesIcon
} from '@mui/icons-material'
import { useArticles } from '../contexts/ArticleContext'
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

const allCategoryTabs = [
  '全网热帖',
  '职场发展',
  '转型升级',
  '副业指南',
  '财务管理',
  '中年危机',
  '心理健康',
  '家庭关系',
  '生活技能'
]

const Articles = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [displayCount, setDisplayCount] = useState(12)

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  // 排序：最新的排前
  const sortedArticles = useMemo(() => {
    return [...publishedArticles].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [publishedArticles])

  // 筛选
  const filteredArticles = useMemo(() => {
    const selectedCat = allCategoryTabs[activeTab] || '全网热帖'
    return sortedArticles.filter(article => {
      const matchCat = selectedCat === '全网热帖' || article.category === selectedCat
      if (!matchCat) return false
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase()
      const title = (article.title || '').toLowerCase()
      const excerpt = (article.excerpt || article.summary || '').toLowerCase()
      const tags = Array.isArray(article.tags) ? article.tags.join(' ').toLowerCase() : ''
      return title.includes(term) || excerpt.includes(term) || tags.includes(term)
    })
  }, [sortedArticles, activeTab, searchTerm])

  const visibleArticles = filteredArticles.slice(0, displayCount)
  const hasMore = filteredArticles.length > displayCount

  // 侧边栏精选热门
  const trendingArticles = useMemo(() => {
    return sortedArticles.slice(0, 5)
  }, [sortedArticles])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 头部标题与检索区 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 780, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  fontSize: { xs: '1.6rem', sm: '2rem' },
                  letterSpacing: '-0.02em'
                }}
              >
                全网热帖文库
              </Typography>
              <Chip
                label={`${publishedArticles.length} 篇热帖`}
                size="small"
                sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.75rem', height: 24, borderRadius: 1 }}
              />
            </Box>

            <Typography variant="body1" sx={{ color: '#4b5563', fontSize: '0.96rem', lineHeight: 1.7 }}>
              聚合天涯神贴、LINUX DO 搞钱灵感、小宇宙对谈与知乎真实经历。汇集全网关于被裁自保、轻资产尝试与省钱生活的诚恳讨论。
            </Typography>
          </Box>

          {/* 搜索框 */}
          <Box sx={{ maxWidth: 600 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索关键词，如：2N赔偿、副业、失业金、房贷延期、大理旅居..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setDisplayCount(12)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <ClearIcon
                      sx={{ color: '#9ca3af', fontSize: 18, cursor: 'pointer' }}
                      onClick={() => setSearchTerm('')}
                    />
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: 2,
                  bgcolor: '#f9fafb',
                  fontSize: '0.9rem',
                  '& fieldset': { borderColor: '#e5e7eb' },
                  '&:hover fieldset': { borderColor: '#c2410c' },
                  '&.Mui-focused fieldset': { borderColor: '#c2410c' }
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* 少数派经典 7:3 资讯流与侧边栏 */}
      <Container maxWidth="lg" sx={{ py: 4.5 }}>
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
          {/* 左侧：分类 Tab 与文章列表 */}
          <Box sx={{ width: '100%' }}>
            {/* 分类 Tabs */}
            <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 2.5, backgroundColor: '#ffffff', borderRadius: 2, p: 0.5, border: '1px solid #e5e7eb' }}>
              <Tabs
                value={activeTab}
                onChange={(e, val) => {
                  setActiveTab(val)
                  setDisplayCount(12)
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
                {allCategoryTabs.map((cat) => (
                  <Tab key={cat} label={cat} />
                ))}
              </Tabs>
            </Box>

            {/* 结果计数提示 */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                共找到 <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: '#111827' }}>{filteredArticles.length}</Typography> 篇实战指南
                {searchTerm && ` (包含关键词 "${searchTerm}")`}
              </Typography>
            </Box>

            {/* 文章列表 */}
            {visibleArticles.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 1 }}>
                  未找到与 "{searchTerm}" 相关的实战内容
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 2 }}>
                  建议尝试缩短搜索词，或切换至其他分类专栏查阅
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('')
                    setActiveTab(0)
                  }}
                  sx={{ color: '#c2410c', borderColor: '#c2410c' }}
                >
                  重置筛选条件
                </Button>
              </Paper>
            ) : (
              <Stack spacing={2} sx={{ width: '100%' }}>
                {visibleArticles.map((article, idx) => {
                  const colorConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
                  return (
                    <Paper
                      key={article.id || idx}
                      elevation={0}
                      onClick={() => navigate(`/article/${article.id}`)}
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
                          <Button
                            size="small"
                            variant="text"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/article/${article.id}`)
                            }}
                            sx={{
                              color: '#c2410c',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              p: '3px 10px',
                              whiteSpace: 'nowrap',
                              borderRadius: 1,
                              bgcolor: '#fff7ed',
                              '&:hover': { bgcolor: '#ffedd5', color: '#9a3412' }
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
            )}

            {/* 加载更多 */}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 3.5 }}>
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
                    fontSize: '0.88rem',
                    bgcolor: '#ffffff',
                    whiteSpace: 'nowrap',
                    '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }
                  }}
                >
                  加载更多文章 ({filteredArticles.length - visibleArticles.length} 篇待展开)
                </Button>
              </Box>
            )}
          </Box>

          {/* 右侧：少数派挂件 */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.5}>
              {/* 热门实战精选榜 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    全库精选热榜
                  </Typography>
                </Box>

                <Stack spacing={1.8}>
                  {trendingArticles.map((art, idx) => (
                    <Box
                      key={art.id || idx}
                      onClick={() => navigate(`/article/${art.id}`)}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.2,
                        '&:hover .rank-title': { color: '#c2410c' }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          color: idx === 0 ? '#c2410c' : '#9ca3af',
                          minWidth: 20,
                          lineHeight: 1.3
                        }}
                      >
                        0{idx + 1}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          className="rank-title"
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: '#1f2937',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.15s'
                          }}
                        >
                          {art.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          {art.source || '全网'} · {art.hotMetric || '精选热帖'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* 直通工作台 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DashboardIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    自救工作台
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  包含离职交涉、轻资产副业与现金流跑道三大防御 SOP，支持实时勾选留存进度。
                </Typography>
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
                    py: 1,
                    borderRadius: 1.5,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#c2410c' }
                  }}
                >
                  打开自救工作台
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

export default Articles
