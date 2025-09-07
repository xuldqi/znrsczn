import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import { 
  Container, 
  Typography, 
  Box, 
  Avatar, 
  Chip, 
  Stack, 
  Divider,
  Button,
  Paper
} from '@mui/material'
import { 
  ArrowBack, 
  CalendarToday, 
  AccessTime, 
  Star, 
  Article,
  Share,
  Bookmark
} from '@mui/icons-material'
import Footer from '../components/Footer'

// 简单的 Markdown 渲染函数
const renderMarkdownContent = (text) => {
  if (!text) return ''
  
  return text
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 代码
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // 引用
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // 列表
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^[0-9]+\. (.*$)/gim, '<li>$1</li>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // 段落
    .split('\n')
    .map(line => {
      if (line.trim() === '') return '<br>'
      if (line.match(/^<h[1-6]>|^<blockquote>|^<li>/)) return line
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

  useEffect(() => {
    // 从 ArticleContext 获取文章数据
    const loadArticle = () => {
      const foundArticle = getArticle(slug)
      if (foundArticle && foundArticle.status === 'published') {
        setArticle(foundArticle)
      }
      setLoading(false)
    }

    loadArticle()
  }, [slug, getArticle])

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography>加载中...</Typography>
      </Box>
    )
  }

  if (!article) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              文章未找到
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              抱歉，您要查看的文章不存在或已被删除。
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              startIcon={<ArrowBack />}
            >
              返回首页
            </Button>
          </Paper>
        </Container>
        <Footer />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 返回按钮 */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ color: 'text.secondary' }}
            >
              返回首页
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* 主内容区 */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: { xs: 3, md: 6 }, backgroundColor: 'white', borderRadius: 2 }}>
              {/* 文章头部 */}
              <Box sx={{ mb: 4 }}>
                <Chip 
                  label={article.category} 
                  color="primary" 
                  sx={{ mb: 2 }}
                />
                
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3,
                    fontSize: { xs: '1.8rem', md: '2.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  {article.title}
                </Typography>

                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: '1.1rem'
                  }}
                >
                  {article.excerpt}
                </Typography>

                {/* 文章元信息 */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  sx={{ mb: 3 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}>
                      {article.author.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {article.author}
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {article.date}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {article.readTime}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* 互动按钮 */}
                  <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
                    <Button 
                      startIcon={<Star />} 
                      variant="outlined" 
                      size="small"
                    >
                      收藏
                    </Button>
                    <Button 
                      startIcon={<Share />} 
                      variant="outlined" 
                      size="small"
                    >
                      分享
                    </Button>
                  </Stack>
                </Stack>

                {/* 标签 */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  {article.tags.map((tag, index) => (
                    <Chip 
                      key={index} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* 文章内容 */}
              <Box 
                sx={{ 
                  '& h1': { 
                    fontSize: '2rem', 
                    fontWeight: 700, 
                    mb: 3, 
                    mt: 4,
                    color: 'text.primary'
                  },
                  '& h2': { 
                    fontSize: '1.5rem', 
                    fontWeight: 600, 
                    mb: 2, 
                    mt: 3,
                    color: 'text.primary'
                  },
                  '& h3': { 
                    fontSize: '1.25rem', 
                    fontWeight: 600, 
                    mb: 2, 
                    mt: 2,
                    color: 'text.primary'
                  },
                  '& p': { 
                    lineHeight: 1.8, 
                    mb: 2,
                    color: 'text.primary'
                  },
                  '& ul, & ol': { 
                    mb: 2, 
                    pl: 3 
                  },
                  '& li': { 
                    mb: 1, 
                    lineHeight: 1.6 
                  },
                  '& strong': { 
                    fontWeight: 600,
                    color: 'primary.main'
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #2196f3',
                    backgroundColor: '#f5f9ff',
                    p: 2,
                    my: 2,
                    borderRadius: '0 4px 4px 0'
                  },
                  '& code': {
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '0.9em'
                  }
                }}
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownContent(article.content) 
                }}
              />
            </Paper>
          </Box>

          {/* 侧边栏 */}
          <Box sx={{ 
            width: 300, 
            display: { xs: 'none', lg: 'block' } 
          }}>
            <Stack spacing={3}>
              {/* 相关文章 */}
              <Paper sx={{ p: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  相关文章
                </Typography>
                <Stack spacing={2}>
                  {getAllArticles().filter(a => a.id !== article.id && a.status === 'published').slice(0, 3).map((relatedArticle) => (
                    <Box 
                      key={relatedArticle.id}
                      onClick={() => navigate(`/article/${relatedArticle.id}`)}
                      sx={{ 
                        cursor: 'pointer', 
                        '&:hover': { color: 'primary.main' } 
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {relatedArticle.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {relatedArticle.readTime} • {relatedArticle.author}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* 作者信息 */}
              <Paper sx={{ p: 3, backgroundColor: 'white' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  关于作者
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, backgroundColor: 'primary.main' }}>
                    {article.author.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {article.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      专业作者
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  专注于中年职场人的发展和心理健康，致力于帮助更多人走出困境。
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  )
}

export default ArticleDetail