import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Avatar } from '@mui/material'
import { Transform, TrendingUp, AutoFixHigh, School, Computer, Build } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const Transformation = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取转型升级类文章
  const transformationArticles = getArticlesByCategory('转型升级')

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
            转型升级
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
            适应时代变化，主动转型升级：从传统思维到数字化思维的全方位转变
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="数字化转型" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="技能升级" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="思维转变" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="能力提升" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Transformation Articles Section */}
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
            转型升级文章
          </Typography>
          
          <Stack spacing={2}>
            {transformationArticles.map((article, index) => (
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
                        backgroundColor: '#64748b',
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
                        转型升级
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
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#616161' }}>
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
                          backgroundColor: '#64748b',
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
            开始你的转型之路
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
            时代在变化，我们也要跟上步伐。制定你的转型升级计划，在变化中找到新的机会和发展空间。
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: '#64748b',
              '&:hover': {
                backgroundColor: '#475569'
              }
            }}
          >
            制定转型计划
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Transformation