import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Avatar } from '@mui/material'
import { Psychology, TrendingDown, Help, SelfImprovement, Lightbulb, Psychology as PsychIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const MidlifeCrisis = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取中年危机类文章
  const midlifeCrisisArticles = getArticlesByCategory('中年危机')

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3rem' }
            }}
          >
            中年危机
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            面对中年危机不要恐慌：理解、接受、转化，让人生的转折点成为新的起点
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="职业危机" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="情感困惑" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="人生意义" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="重新出发" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Midlife Crisis Articles Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 4,
              textAlign: 'center'
            }}
          >
            中年危机文章
          </Typography>
          
          <Stack spacing={2}>
            {midlifeCrisisArticles.map((article, index) => (
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
                        backgroundColor: '#ef4444',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}>
                        🤔
                      </Box>
                      <Typography variant="caption" color="#999" sx={{ fontSize: '0.75rem' }}>
                        中年危机
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
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#5d4037' }}>
                        {article.author?.charAt(0) || 'A'}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                        {article.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {article.readTime}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip 
                        label={article.category}
                        size="small"
                        sx={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: 'white', borderRadius: 2, border: '1px solid #f0f0f0' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 2
            }}
          >
            走出迷茫，重新出发
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            中年危机并不可怕，它是人生的一个重要转折点。让我们一起面对挑战，找到新的人生方向。
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: '#ef4444',
              '&:hover': {
                backgroundColor: '#dc2626'
              }
            }}
          >
            寻找新方向
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default MidlifeCrisis