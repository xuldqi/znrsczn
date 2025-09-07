import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Avatar } from '@mui/material'
import { FamilyRestroom, Home, Favorite, School, Work, CalendarToday, AccessTime } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const Family = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取家庭关系类文章
  const familyArticles = getArticlesByCategory('家庭关系')

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
            家庭关系
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
            处理家庭关系中的各种挑战：夫妻沟通、子女教育、老人赡养等实用指导
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="夫妻关系" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="子女教育" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="家庭沟通" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="理财规划" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Family Articles Section */}
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
            家庭关系文章
          </Typography>
          
          <Grid container spacing={3}>
            {familyArticles.map((article, index) => (
              <Grid item xs={12} md={6} lg={4} key={article.id || index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        mb: 2,
                        lineHeight: 1.3
                      }}
                    >
                      {article.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3, 
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {article.excerpt}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#e91e63' }}>
                          家
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                          {article.category}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {article.readTime}
                      </Typography>
                    </Stack>
                    
                    <Chip 
                      label={article.category}
                      size="small"
                      sx={{
                        backgroundColor: '#e91e63',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            改善家庭关系从现在开始
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
            学习实用的家庭沟通技巧，建立更和谐的家庭关系，让家人之间的情感更加深厚。
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: '#e91e63',
              '&:hover': {
                backgroundColor: '#c2185b'
              }
            }}
          >
            开始改善关系
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Family