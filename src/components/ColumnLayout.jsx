import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  Button,
  Avatar,
  Breadcrumbs
} from '@mui/material'
import {
  ArrowForward as ArrowForwardIcon,
  NavigateNext as NavigateNextIcon,
  SpaceDashboardOutlined as DashboardIcon,
  LocalOfferOutlined as TagIcon,
  OpenInNew as OpenInNewIcon,
  Headphones as HeadphonesIcon
} from '@mui/icons-material'
import Footer from './Footer'

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

const ColumnLayout = ({
  columnTitle,
  columnTag,
  columnSummary,
  columnHighlight,
  articles = [],
  tags = [],
  sidebarWidget = null
}) => {
  const navigate = useNavigate()
  const [selectedTag, setSelectedTag] = useState('全部')
  const [displayCount, setDisplayCount] = useState(10)

  // 智能提取该专栏所有真实存在的精选高频标签
  const displayTags = useMemo(() => {
    // 统计本专栏所有文章的真实标签
    const tagCount = {}
    articles.forEach(a => {
      const artTags = Array.isArray(a.tags) ? a.tags : []
      artTags.forEach(t => {
        if (!t) return
        const cleanT = t.trim()
        if (['少数派', '知乎', '知乎精选', '天涯论坛', 'V2EX', 'LINUX DO', '雪球', '豆瓣', '深度长文', a.category].includes(cleanT)) return
        tagCount[cleanT] = (tagCount[cleanT] || 0) + 1
      })
    })

    // 高频标签排序
    const topDynamicTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])

    // 如果传入了预设标签，优先保留在文章库中有实际内容的标签
    const merged = Array.from(new Set([...(tags || []), ...topDynamicTags]))
    const validTags = merged.filter(t => {
      const lowerT = t.toLowerCase()
      return articles.some(a => {
        const artTags = Array.isArray(a.tags) ? a.tags : []
        return artTags.some(at => at.toLowerCase().includes(lowerT) || lowerT.includes(at.toLowerCase())) ||
               (a.title || '').toLowerCase().includes(lowerT) ||
               (a.excerpt || a.summary || '').toLowerCase().includes(lowerT) ||
               (a.content || '').toLowerCase().includes(lowerT)
      })
    })

    return validTags.slice(0, 8)
  }, [articles, tags])

  // 增强版智能过滤：支持标签精准匹配、包含匹配、标题关键词与正文关联
  const filteredArticles = useMemo(() => {
    if (selectedTag === '全部') return articles
    const target = selectedTag.toLowerCase().trim()
    return articles.filter(a => {
      const artTags = Array.isArray(a.tags) ? a.tags : []
      // 1. 标签包含匹配
      const tagMatch = artTags.some(t => t.toLowerCase().includes(target) || target.includes(t.toLowerCase()))
      // 2. 标题包含
      const titleMatch = (a.title || '').toLowerCase().includes(target)
      // 3. 摘要包含
      const excerptMatch = (a.excerpt || a.summary || '').toLowerCase().includes(target)
      // 4. 正文关键词包含
      const contentMatch = (a.content || '').toLowerCase().includes(target)

      return tagMatch || titleMatch || excerptMatch || contentMatch
    })
  }, [articles, selectedTag])

  const visibleArticles = filteredArticles.slice(0, displayCount)
  const hasMore = filteredArticles.length > displayCount

  const featuredArticle = filteredArticles[0]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 专栏头部导引区 (少数派杂志专栏风格) */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', pt: 3, pb: 3.5 }}>
        <Container maxWidth="lg">
          {/* 面包屑 */}
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#9ca3af' }} />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <MuiBreadcrumbLink onClick={() => navigate('/')}>首页</MuiBreadcrumbLink>
            <MuiBreadcrumbLink onClick={() => navigate('/articles')}>实战指南</MuiBreadcrumbLink>
            <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.85rem' }}>
              {columnTitle}
            </Typography>
          </Breadcrumbs>

          {/* 专栏标题与定位 */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2.5 }}>
            <Box sx={{ maxWidth: 760 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: '#111827',
                    fontSize: { xs: '1.6rem', sm: '2rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  {columnTitle}
                </Typography>
                <Chip
                  label={columnTag || '核心实战'}
                  size="small"
                  sx={{
                    bgcolor: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 24,
                    borderRadius: 1
                  }}
                />
              </Box>

              <Typography variant="body1" sx={{ color: '#4b5563', fontSize: '0.96rem', lineHeight: 1.7, mb: 1.5 }}>
                {columnSummary}
              </Typography>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                <Chip
                  label={`收录 ${articles.length} 篇实操方案`}
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', height: 22 }}
                />
                <Chip
                  label="深度防御导向"
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', height: 22 }}
                />
                <Chip
                  label="全站免登录开源查阅"
                  size="small"
                  sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', height: 22 }}
                />
              </Stack>
            </Box>

            {/* 专栏核心口诀小纸条 */}
            {columnHighlight && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#fef8f4',
                  border: '1px dashed #fdba74',
                  maxWidth: { xs: '100%', md: 320 },
                  flexShrink: 0
                }}
              >
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 800, display: 'block', mb: 0.5 }}>
                  专栏防御红线：
                </Typography>
                <Typography variant="caption" sx={{ color: '#7c2d12', lineHeight: 1.6, display: 'block' }}>
                  {columnHighlight}
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </Box>

      {/* 少数派 7:3 核心信息流与侧边栏 */}
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
          {/* 左侧：文章主流列表 */}
          <Box sx={{ width: '100%' }}>
            
            {/* 标签过滤条 */}
            {displayTags.length > 0 && (
              <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, mr: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TagIcon sx={{ fontSize: 15 }} /> 细分标签：
                </Typography>
                {['全部', ...displayTags].map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    onClick={() => {
                      setSelectedTag(t)
                      setDisplayCount(10)
                    }}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedTag === t ? '#c2410c' : '#ffffff',
                      color: selectedTag === t ? '#ffffff' : '#4b5563',
                      border: '1px solid',
                      borderColor: selectedTag === t ? '#c2410c' : '#e5e7eb',
                      fontWeight: selectedTag === t ? 700 : 500,
                      fontSize: '0.78rem',
                      '&:hover': {
                        bgcolor: selectedTag === t ? '#9a3412' : '#f9fafb'
                      }
                    }}
                  />
                ))}
              </Box>
            )}

            {/* 如果有特选头条，展示专栏精选卡片 */}
            {selectedTag === '全部' && featuredArticle && (
              <Paper
                elevation={0}
                onClick={() => navigate(`/article/${featuredArticle.id}`)}
                sx={{
                  p: 3,
                  mb: 2.5,
                  borderRadius: 2.5,
                  backgroundColor: '#ffffff',
                  border: '1px solid #fed7aa',
                  boxShadow: '0 4px 16px rgba(194, 65, 12, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#c2410c',
                    boxShadow: '0 8px 24px rgba(194, 65, 12, 0.1)',
                    '& .featured-title': { color: '#c2410c' }
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Chip
                    label="专栏焦点"
                    size="small"
                    sx={{ bgcolor: '#c2410c', color: '#ffffff', fontWeight: 700, fontSize: '0.7rem', height: 20, borderRadius: 0.8 }}
                  />
                  {featuredArticle.source && (
                    <Chip
                      label={featuredArticle.source}
                      size="small"
                      sx={{
                        bgcolor: sourceStyles[featuredArticle.source]?.bg || '#f3f4f6',
                        color: sourceStyles[featuredArticle.source]?.color || '#374151',
                        border: `1px solid ${sourceStyles[featuredArticle.source]?.border || '#e5e7eb'}`,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        height: 20,
                        borderRadius: 0.8
                      }}
                    />
                  )}
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    {featuredArticle.hotMetric || '精选热议'}
                  </Typography>
                </Box>

                <Typography
                  className="featured-title"
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: '#111827',
                    fontSize: { xs: '1.15rem', sm: '1.35rem' },
                    lineHeight: 1.35,
                    mb: 1.5,
                    transition: 'color 0.15s'
                  }}
                >
                  {featuredArticle.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#4b5563',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2
                  }}
                >
                  {featuredArticle.excerpt || featuredArticle.summary}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid #f9fafb', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {featuredArticle.source === '小宇宙' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HeadphonesIcon sx={{ fontSize: 15, color: '#ea580c' }} />
                        <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, fontSize: '0.78rem' }}>
                          播客《{featuredArticle.author || '知行小酒馆'}》
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: '#374151', fontWeight: 600, fontSize: '0.78rem' }}>
                        {featuredArticle.hotMetric || `${featuredArticle.source || '专栏'} 讨论`}
                      </Typography>
                    )}
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      · {featuredArticle.date || '近期'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/article/${featuredArticle.id}`)
                      }}
                      sx={{
                        bgcolor: '#c2410c',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        py: 0.5,
                        px: 1.8,
                        borderRadius: 1,
                        whiteSpace: 'nowrap',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#9a3412', boxShadow: 'none' }
                      }}
                    >
                      阅读全文 →
                    </Button>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* 空状态提示 */}
            {filteredArticles.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  my: 2
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                  暂未找到匹配「{selectedTag}」的专项文章
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 2.5, fontSize: '0.88rem' }}>
                  您可以尝试切换其他标签，或查看本专栏的全部精选实操。
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedTag('全部')}
                  sx={{ borderColor: '#c2410c', color: '#c2410c', '&:hover': { borderColor: '#9a3412', bgcolor: 'rgba(194, 65, 12, 0.05)' } }}
                >
                  查看本专栏全部文章 ({articles.length}篇)
                </Button>
              </Paper>
            )}

            {/* 少数派标准文章卡片列表 */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              {visibleArticles
                .filter(a => selectedTag !== '全部' || a.id !== featuredArticle?.id)
                .map((article, idx) => {
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

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #f9fafb', flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {article.source === '小宇宙' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <HeadphonesIcon sx={{ fontSize: 14, color: '#ea580c' }} />
                              <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, fontSize: '0.75rem' }}>
                                播客《{article.author || '知行小酒馆'}》
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem', fontWeight: 600 }}>
                              {article.hotMetric || `${article.source || '专栏'} 讨论`}
                            </Typography>
                          )}
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                            · {article.date || '近期'}
                          </Typography>
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
                  加载更多专栏指南
                </Button>
              </Box>
            )}
          </Box>

          {/* 右侧：少数派风格侧边栏 */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.5}>
              {/* 专属定制挂件 (若有) */}
              {sidebarWidget}

              {/* 挂件：直通中年自救工作台 */}
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
                  <DashboardIcon sx={{ color: '#c2410c', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    35+ 自救工作台
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  包含离职交涉、轻资产副业与现金流底线三大互动防御 SOP，支持实时勾选留存进度。
                </Typography>

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
                  打开自救工作台
                </Button>
              </Paper>

              {/* 挂件：全站专栏导航矩阵 */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5 }}>
                  其他实战专栏
                </Typography>
                <Stack spacing={1}>
                  {[
                    { label: '职场突围战', path: '/career', desc: '离职维权与35岁破局' },
                    { label: '副业与轻创', path: '/side-business', desc: '零成本探索与技能变现' },
                    { label: '资产与养老', path: '/finance', desc: '现金流跑道与底线防御' },
                    { label: '身心与家庭', path: '/family', desc: '情绪边界与亲子降温' },
                    { label: '心理与内耗', path: '/psychology', desc: '中年焦虑脱敏指南' }
                  ].map((item) => (
                    <Box
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': { bgcolor: '#f9fafb', '& .col-name': { color: '#c2410c' } }
                      }}
                    >
                      <Box>
                        <Typography className="col-name" variant="caption" sx={{ fontWeight: 700, color: '#374151', display: 'block' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                      <ArrowForwardIcon sx={{ fontSize: 13, color: '#9ca3af' }} />
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

const MuiBreadcrumbLink = ({ children, onClick }) => (
  <Typography
    onClick={onClick}
    sx={{
      color: '#6b7280',
      fontSize: '0.85rem',
      cursor: 'pointer',
      '&:hover': { color: '#c2410c', textDecoration: 'underline' }
    }}
  >
    {children}
  </Typography>
)

export default ColumnLayout
