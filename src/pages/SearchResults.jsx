import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  InputAdornment
} from '@mui/material'
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
  Headphones as HeadphonesIcon,
  OpenInNew as OpenInNewIcon
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

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const term = query.toLowerCase()
    return publishedArticles.filter(art => {
      const title = (art.title || '').toLowerCase()
      const summary = (art.excerpt || art.summary || '').toLowerCase()
      const content = (art.content || '').toLowerCase()
      const tags = Array.isArray(art.tags) ? art.tags.join(' ').toLowerCase() : ''
      const category = (art.category || '').toLowerCase()
      return title.includes(term) || summary.includes(term) || tags.includes(term) || category.includes(term) || content.includes(term)
    })
  }, [publishedArticles, query])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4f5f8', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 搜索头部 */}
      <Box sx={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 800, mb: 1, display: 'block', letterSpacing: '0.05em' }}>
            实战检索中心
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 2.5 }}>
            搜索 "{query || '全站实战指南'}" 的结果
          </Typography>

          <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 600 }}>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入关键词，如：离职、补偿、失业金、四笔钱、副业..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <ClearIcon
                      sx={{ color: '#9ca3af', fontSize: 18, cursor: 'pointer' }}
                      onClick={() => {
                        setQuery('')
                        setSearchParams({})
                      }}
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

      {/* 结果列表 */}
      <Container maxWidth="lg" sx={{ py: 4.5 }}>
        <Box sx={{ maxWidth: 840, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              共检索到 <Typography component="span" sx={{ fontWeight: 700, color: '#111827' }}>{searchResults.length}</Typography> 篇相关实战文章
            </Typography>

            <Button
              size="small"
              onClick={() => navigate('/articles')}
              sx={{ color: '#c2410c', fontWeight: 600, fontSize: '0.82rem' }}
            >
              浏览全部文库 →
            </Button>
          </Box>

          {searchResults.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 2.5, border: '1px solid #e5e7eb' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
                未找到匹配结果
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                抱歉，没有找到与 "{query}" 相关的实战内容。请尝试使用更常见的词汇（如裁员、副业、养老金、社保）。
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/articles')}
                sx={{ color: '#c2410c', borderColor: '#c2410c' }}
              >
                查阅全网热帖文库
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {searchResults.map((article, idx) => {
                const colorConfig = categoryStyles[article.category] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' }
                return (
                  <Paper
                    key={article.id || idx}
                    elevation={0}
                    onClick={() => navigate(`/article/${article.id}`)}
                    sx={{
                      p: 2.5,
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        {article.readTime || '3分钟阅读'}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {article.source === '小宇宙' ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <HeadphonesIcon sx={{ fontSize: 14, color: '#ea580c' }} />
                            <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 700, fontSize: '0.75rem' }}>
                              播客《{article.author || '知行小酒馆'}》
                            </Typography>
                          </Box>
                        ) : article.author ? (
                          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem', fontWeight: 600 }}>
                            {article.source ? `${article.source} 楼主` : '发布者'} · @{article.author}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#4b5563', fontSize: '0.75rem', fontWeight: 600 }}>
                            {article.source || '精选热帖'}
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          · {article.date || '近期'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {article.sourceUrl && (
                          <Typography
                            component="a"
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            variant="caption"
                            sx={{
                              color: '#6b7280',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.3,
                              '&:hover': { color: '#c2410c', textDecoration: 'underline' }
                            }}
                          >
                            原帖 ↗
                          </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                          阅读全文 →
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )
              })}
            </Stack>
          )}
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default SearchResults
