import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Avatar } from '@mui/material'
import { SportsEsports, Brush, Camera, MusicNote, Book, FitnessCenter } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const Interests = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取兴趣爱好类文章
  const interestsArticles = getArticlesByCategory('兴趣爱好')

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
            兴趣爱好
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
            培养有意义的兴趣爱好，丰富中年生活，找到工作之外的乐趣和成就感
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="运动健身" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="艺术创作" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="阅读学习" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="音乐摄影" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Interests Articles Section */}
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
            兴趣爱好文章
          </Typography>
          
          <Stack spacing={2}>
            {interestsArticles.map((article, index) => (
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
                        backgroundColor: '#f59e0b',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}>
                        
                      </Box>
                      <Typography variant="caption" color="#999" sx={{ fontSize: '0.75rem' }}>
                        兴趣爱好
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
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#ff9800' }}>
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
                          backgroundColor: '#f59e0b',
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
            开始培养新的兴趣爱好
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
            选择适合自己的兴趣爱好，丰富生活内容，让中年生活更加充实和有意义。
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: '#f59e0b',
              '&:hover': {
                backgroundColor: '#d97706'
              }
            }}
          >
            探索兴趣爱好
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Interests