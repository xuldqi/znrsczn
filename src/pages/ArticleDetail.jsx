import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Button,
  Paper,
  Breadcrumbs,
  Snackbar,
  Alert
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  NavigateNext as NavigateNextIcon,
  Share as ShareIcon,
  BookmarkBorder as BookmarkIcon,
  Check as CheckIcon,
  FormatListBulleted as TocIcon,
  OpenInNew as OpenInNewIcon,
  Headphones as HeadphonesIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const categoryStyles = {
  '职场发展': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', path: '/career' },
  '转型升级': { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', path: '/career' },
  '副业指南': { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', path: '/side-business' },
  '财务管理': { bg: '#fffbeb', color: '#b45309', border: '#fde68a', path: '/finance' },
  '中年危机': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', path: '/psychology' },
  '心理健康': { bg: '#f0fdfa', color: '#0f766e', border: '#99f6e4', path: '/psychology' },
  '家庭关系': { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8', path: '/family' },
  '生活技能': { bg: '#f8fafc', color: '#334155', border: '#cbd5e1', path: '/family' },
  '兴趣爱好': { bg: '#faf5ff', color: '#7e22ce', border: '#e9d5ff', path: '/family' },
}

// 优化的 Markdown 渲染函数，为各级标题附加 id 以支持 TOC 锚点跳转
const renderEditorialMarkdown = (text, headings) => {
  if (!text) return ''
  let headingIndex = 0

  return text
    // H3 标题
    .replace(/^### (.*$)/gim, (_, title) => {
      const id = `heading-${headingIndex++}`
      return `<h3 id="${id}">${title}</h3>`
    })
    // H2 标题
    .replace(/^## (.*$)/gim, (_, title) => {
      const id = `heading-${headingIndex++}`
      return `<h2 id="${id}">${title}</h2>`
    })
    // H1 标题
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 行内代码
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // 引用块
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // 无序列表
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // 有序列表
    .replace(/^[0-9]+\. (.*$)/gim, '<li>$1</li>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // 段落换行
    .split('\n')
    .map(line => {
      if (line.trim() === '') return ''
      if (line.match(/^<h[1-6]|<blockquote|<li/)) return line
      return `<p>${line}</p>`
    })
    .join('')
}

const ArticleDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getArticle, getAllArticles } = useArticles()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [bookmarked, setBookmarked] = useState(false)

  // 监听滚动计算阅读进度
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / total) * 100))
        setScrollProgress(progress)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const foundArticle = getArticle(slug)
    if (foundArticle && foundArticle.status === 'published') {
      setArticle(foundArticle)
    } else {
      setArticle(null)
    }
    setLoading(false)
  }, [slug, getArticle])

  // 从文章内容提取目录结构 (TOC)
  const headings = useMemo(() => {
    if (!article?.content) return []
    const lines = article.content.split('\n')
    const list = []
    let index = 0
    lines.forEach(line => {
      if (line.startsWith('## ')) {
        list.push({ id: `heading-${index++}`, level: 2, title: line.replace('## ', '').trim() })
      } else if (line.startsWith('### ')) {
        list.push({ id: `heading-${index++}`, level: 3, title: line.replace('### ', '').trim() })
      }
    })
    return list
  }, [article])

  // 渲染正文 HTML
  const htmlContent = useMemo(() => {
    if (!article?.content) return ''
    return renderEditorialMarkdown(article.content, headings)
  }, [article, headings])

  // 相关推荐（同分类优先）
  const relatedArticles = useMemo(() => {
    if (!article) return []
    const all = getAllArticles().filter(a => a.id !== article.id && a.status === 'published')
    const sameCat = all.filter(a => a.category === article.category)
    if (sameCat.length >= 3) return sameCat.slice(0, 3)
    return [...sameCat, ...all.filter(a => a.category !== article.category)].slice(0, 3)
  }, [article, getAllArticles])

  // 上一篇与下一篇
  const { prevArticle, nextArticle } = useMemo(() => {
    if (!article) return { prevArticle: null, nextArticle: null }
    const list = getAllArticles().filter(a => a.status === 'published')
    const currentIndex = list.findIndex(a => a.id === article.id)
    return {
      prevArticle: currentIndex > 0 ? list[currentIndex - 1] : null,
      nextArticle: currentIndex < list.length - 1 ? list[currentIndex + 1] : null
    }
  }, [article, getAllArticles])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setToastMessage('文章链接已成功复制到剪贴板')
    setToastOpen(true)
  }

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked)
    setToastMessage(!bookmarked ? '已加入本地收藏清单' : '已取消收藏')
    setToastOpen(true)
  }

  const scrollToHeading = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 85
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f5f8' }}>
        <Typography sx={{ color: '#6b7280' }}>正在加载实战指南...</Typography>
      </Box>
    )
  }

  if (!article) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', py: 8 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #e5e7eb' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 1.5 }}>
              未找到对应实战文章
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
              该篇指南可能已调整分类或归档，您可以返回首页查阅最新实战内容。
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ bgcolor: '#c2410c', fontWeight: 700, '&:hover': { bgcolor: '#9a3412' } }}
            >
              返回自救指南首页
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  const categoryConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb', path: '/articles' }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 顶部随滚动平滑阅读进度条 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: 'transparent',
          zIndex: 1300
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${scrollProgress}%`,
            backgroundColor: '#c2410c',
            transition: 'width 0.1s ease-out'
          }}
        />
      </Box>

      {/* 少数派面包屑与顶部操作栏 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 1.8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 15, color: '#9ca3af' }} />}
              aria-label="breadcrumb"
            >
              <Typography
                onClick={() => navigate('/')}
                sx={{ color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', '&:hover': { color: '#c2410c' } }}
              >
                首页
              </Typography>
              <Typography
                onClick={() => navigate(categoryConfig.path)}
                sx={{ color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', '&:hover': { color: '#c2410c' } }}
              >
                {article.category}
              </Typography>
              <Typography sx={{ color: '#111827', fontWeight: 600, fontSize: '0.85rem', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.title}
              </Typography>
            </Breadcrumbs>

            <Button
              size="small"
              onClick={() => navigate(categoryConfig.path)}
              startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
              sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', '&:hover': { color: '#c2410c' } }}
            >
              返回专栏
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 文章正文与侧边栏 (7:3 经典阅读布局) */}
      <Container maxWidth="lg" sx={{ py: 4.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2.4fr 1fr'
            },
            gap: 4,
            width: '100%',
            alignItems: 'flex-start'
          }}
        >
          {/* 左侧：正文沉浸式阅读卡片 */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5, md: 6 },
              borderRadius: 3,
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb'
            }}
          >
            {/* 文章头部元信息 */}
            <Box sx={{ mb: 3.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={article.category}
                  size="small"
                  sx={{
                    bgcolor: categoryConfig.bg,
                    color: categoryConfig.color,
                    border: `1px solid ${categoryConfig.border}`,
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    height: 22,
                    borderRadius: 0.8
                  }}
                />
                {article.source && (
                  <Chip
                    label={`来源 · ${article.source}`}
                    size="small"
                    sx={{
                      bgcolor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fecaca',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      height: 22,
                      borderRadius: 0.8
                    }}
                  />
                )}
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  {article.hotMetric || '全网热帖'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                  · 收录于 {article.date || '近期'}
                </Typography>
              </Box>

              {/* 如果是全网精选来源帖子，展示显眼的原帖来源横幅 */}
              {article.source && article.sourceUrl && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    {article.source === '小宇宙' ? (
                      <Typography variant="body2" sx={{ color: '#1e40af', fontSize: '0.88rem' }}>
                        本音频收录自小宇宙播客<strong>《{article.author || '知行小酒馆'}》</strong>深度对谈
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: '#1e40af', fontSize: '0.88rem' }}>
                        本内容收录自 <strong>{article.source}</strong> 社区热帖讨论，原帖包含大量网友跟帖与实操交流
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    component="a"
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      bgcolor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      whiteSpace: 'nowrap',
                      px: 2,
                      py: 0.6,
                      borderRadius: 1.2,
                      '&:hover': { bgcolor: '#1d4ed8' }
                    }}
                  >
                    前往【{article.source}】查看原帖与完整讨论 ↗
                  </Button>
                </Paper>
              )}

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#111827',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  lineHeight: 1.35,
                  letterSpacing: '-0.02em',
                  mb: 2.5
                }}
              >
                {article.title}
              </Typography>

              {/* 核心导读（少数派编者按风格） */}
              {(article.excerpt || article.summary) && (
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: '#fafaf9',
                    borderLeft: '4px solid #c2410c',
                    borderRadius: '0 8px 8px 0',
                    mb: 3
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 800, display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>
                    内容要点
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#44403c', fontSize: '0.94rem', lineHeight: 1.75 }}>
                    {article.excerpt || article.summary}
                  </Typography>
                </Box>
              )}

              {/* 来源与归属行 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #f3f4f6', flexWrap: 'wrap', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {article.source === '小宇宙' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <HeadphonesIcon sx={{ fontSize: 20, color: '#ea580c' }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#1f2937', fontWeight: 700, display: 'block' }}>
                          播客《{article.author || '知行小酒馆'}》
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                          小宇宙音频 · 收录于 {article.date || '近期'}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="caption" sx={{ color: '#1f2937', fontWeight: 700, display: 'block' }}>
                        {article.source || '全网精选'} · {article.hotMetric || '社区讨论'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                        社区原帖存档 · 收录于 {article.date || '近期'}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleBookmarkToggle}
                    startIcon={bookmarked ? <CheckIcon sx={{ fontSize: 15 }} /> : <BookmarkIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      color: bookmarked ? '#c2410c' : '#4b5563',
                      borderColor: bookmarked ? '#c2410c' : '#e5e7eb',
                      bgcolor: bookmarked ? '#fef8f4' : 'transparent',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bookmarked ? '已收藏' : '收藏'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCopyLink}
                    startIcon={<ShareIcon sx={{ fontSize: 15 }} />}
                    sx={{
                      color: '#4b5563',
                      borderColor: '#e5e7eb',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    复制链接
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* 正文排版 (精良的出版物排版规范) */}
            <Box
              sx={{
                color: '#1c1917',
                fontSize: '1.02rem',
                lineHeight: 1.85,
                '& h1': {
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  mt: 4,
                  mb: 2,
                  color: '#111827'
                },
                '& h2': {
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  mt: 4,
                  mb: 1.8,
                  color: '#111827',
                  borderLeft: '4px solid #c2410c',
                  pl: 1.5,
                  scrollMarginTop: '90px'
                },
                '& h3': {
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  mt: 3,
                  mb: 1.2,
                  color: '#1f2937',
                  scrollMarginTop: '90px'
                },
                '& p': {
                  mb: 2,
                  color: '#292524',
                  textAlign: 'justify'
                },
                '& strong': {
                  fontWeight: 700,
                  color: '#111827'
                },
                '& ul, & ol': {
                  mb: 2.5,
                  pl: 3
                },
                '& li': {
                  mb: 0.8,
                  lineHeight: 1.75
                },
                '& blockquote': {
                  backgroundColor: '#fef8f4',
                  borderLeft: '4px solid #c2410c',
                  color: '#7c2d12',
                  p: 2,
                  my: 2.5,
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.94rem',
                  lineHeight: 1.7
                },
                '& code': {
                  backgroundColor: '#f3f4f6',
                  color: '#b91c1c',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: '4px',
                  fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                  fontSize: '0.88em'
                },
                '& a': {
                  color: '#c2410c',
                  textDecoration: 'underline'
                }
              }}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* 原帖直达与讨论互动横幅 */}
            {article.sourceUrl && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mt: 3.5,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 2
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                    想查看原帖作者更多回帖与最新进展？
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    原帖包含大量网友跟帖与实操交流，建议直接前往 {article.source} 参与讨论。
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  component="a"
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    bgcolor: '#c2410c',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    whiteSpace: 'nowrap',
                    px: 2.5,
                    py: 0.8,
                    borderRadius: 1.2,
                    '&:hover': { bgcolor: '#9a3412' }
                  }}
                >
                  前往 {article.source} 查看原帖与回帖 ↗
                </Button>
              </Paper>
            )}

            {/* 标签列表 */}
            {article.tags && article.tags.length > 0 && (
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>相关标签：</Typography>
                {article.tags.map((t, idx) => (
                  <Chip
                    key={idx}
                    label={t}
                    size="small"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                    sx={{ bgcolor: '#f3f4f6', color: '#4b5563', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { bgcolor: '#fee2e2', color: '#b91c1c' } }}
                  />
                ))}
              </Box>
            )}

            {/* 上一篇 / 下一篇 导航卡片 */}
            <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {prevArticle ? (
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/article/${prevArticle.id}`)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#c2410c', bgcolor: '#ffffff' }
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 0.5 }}>
                    ← 上一篇实战
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {prevArticle.title}
                  </Typography>
                </Paper>
              ) : <Box />}

              {nextArticle ? (
                <Paper
                  elevation={0}
                  onClick={() => navigate(`/article/${nextArticle.id}`)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    textAlign: 'right',
                    '&:hover': { borderColor: '#c2410c', bgcolor: '#ffffff' }
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 0.5 }}>
                    下一篇实战 →
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#111827', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {nextArticle.title}
                  </Typography>
                </Paper>
              ) : <Box />}
            </Box>
          </Paper>

          {/* 右侧：少数派悬浮目录与延伸推荐 */}
          <Box sx={{ width: '100%', position: 'sticky', top: 76 }}>
            <Stack spacing={2.5}>
              
              {/* 目录挂件 (TOC) */}
              {headings.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    maxHeight: '60vh',
                    overflowY: 'auto'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <TocIcon sx={{ color: '#c2410c', fontSize: 18 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                      讨论要点索引
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    {headings.map((h, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        onClick={() => scrollToHeading(h.id)}
                        sx={{
                          cursor: 'pointer',
                          color: '#4b5563',
                          pl: h.level === 3 ? 1.5 : 0,
                          fontSize: '0.8rem',
                          lineHeight: 1.45,
                          display: 'block',
                          transition: 'color 0.15s',
                          '&:hover': { color: '#c2410c', fontWeight: 600 }
                        }}
                      >
                        {h.title}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* 专栏同类实战推荐 */}
              {relatedArticles.length > 0 && (
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
                    同专栏延伸阅读
                  </Typography>

                  <Stack spacing={1.8}>
                    {relatedArticles.map((rel, idx) => (
                      <Box
                        key={rel.id || idx}
                        onClick={() => navigate(`/article/${rel.id}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover .rel-title': { color: '#c2410c' }
                        }}
                      >
                        <Typography
                          className="rel-title"
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: '#1f2937',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 0.3,
                            transition: 'color 0.15s'
                          }}
                        >
                          {rel.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                          {rel.readTime || '3分钟阅读'} · {rel.author}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}

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
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                  自救工作台工具
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 2, lineHeight: 1.5 }}>
                  配套提供现金流跑道测算器及 72h 离职防御清单，随时可核对进度。
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
                    py: 0.8,
                    borderRadius: 1.5,
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: '#c2410c' }
                  }}
                >
                  进入自救工作台
                </Button>
              </Paper>

            </Stack>
          </Box>
        </Box>
      </Container>

      {/* 提示条 Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          sx={{ width: '100%', bgcolor: '#111827', color: '#ffffff', '& .MuiAlert-icon': { color: '#34d399' } }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  )
}

export default ArticleDetail
