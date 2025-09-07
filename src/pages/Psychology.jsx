import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Divider, Avatar } from '@mui/material'
import { Psychology as PsychologyIcon, TrendingUp, Group, Work, School, Favorite, ArrowForward, CalendarToday, AccessTime } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const Psychology = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取心理健康类文章
  const psychologyArticles = getArticlesByCategory('心理健康')
  const psychologyTopics = [
    {
      icon: <Work sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '压力管理',
      description: '面对KPI、deadline、老板压力的实用应对方法，学会在高压下保持冷静和效率',
      category: '工作压力',
      readTime: '8分钟',
      date: '2024-01-15',
      tags: ['压力管理', '工作效率', '情绪调节']
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '职业倦怠',
      description: '当工作失去激情时，如何重新找回动力，重新定义职业目标和意义',
      category: '职业发展',
      readTime: '12分钟',
      date: '2024-01-10',
      tags: ['职业倦怠', '工作动力', '目标设定']
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '自我怀疑',
      description: '当工作失败、被质疑能力时，如何重建自信，从失败中学习和成长',
      category: '自信心',
      readTime: '10分钟',
      date: '2024-01-08',
      tags: ['自信心', '失败处理', '成长思维']
    },
    {
      icon: <Group sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '团队冲突',
      description: '与开发、设计、运营的沟通技巧，化解冲突，建立高效协作关系',
      category: '团队协作',
      readTime: '15分钟',
      date: '2024-01-05',
      tags: ['沟通技巧', '团队协作', '冲突解决']
    },
    {
      icon: <School sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '职业焦虑',
      description: '35岁危机、技能焦虑的心理调节，如何在变化中保持职业竞争力',
      category: '职业焦虑',
      readTime: '14分钟',
      date: '2024-01-01',
      tags: ['职业焦虑', '技能提升', '职业规划']
    },
    {
      icon: <Favorite sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '工作生活平衡',
      description: '如何在高压工作中保持身心健康，建立可持续的工作生活模式',
      category: '生活平衡',
      readTime: '11分钟',
      date: '2023-12-28',
      tags: ['工作生活平衡', '身心健康', '时间管理']
    }
  ]

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
            心理建设
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
            中年职场人的心理按摩：压力管理、职业倦怠、自我怀疑、团队冲突等心理问题的解决方案
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="压力管理" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="职业倦怠" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="团队冲突" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="工作生活平衡" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Psychology Articles Section - NEW */}
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
            心理健康文章
          </Typography>
          
          <Grid container spacing={3}>
            {psychologyArticles.map((article, index) => (
              <Grid item xs={12} md={6} key={article.id || index}>
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
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: 'secondary.main' }}>
                          心
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
                        backgroundColor: 'secondary.main',
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

        {/* Psychology Topics Grid - EXISTING CONTENT */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: '1fr 1fr', 
            lg: '1fr 1fr 1fr'
          }, 
          gap: 3 
        }}>
          {psychologyTopics.map((topic, index) => (
            <Card 
              key={index}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Box 
                  sx={{ 
                    backgroundColor: 'grey.50',
                    borderRadius: '50%', 
                    width: 70, 
                    height: 70, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: 2,
                    border: '1px solid #f0f0f0'
                  }}
                >
                  {topic.icon}
                </Box>
                
                <Chip 
                  label={topic.category}
                  size="small"
                  sx={{
                    mb: 2,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 500,
                    alignSelf: 'flex-start',
                    fontSize: '0.75rem'
                  }}
                />
                
                <Typography 
                  variant="h5" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    mb: 2,
                    fontSize: '1.2rem',
                    lineHeight: 1.3
                  }}
                >
                  {topic.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3, 
                    lineHeight: 1.6,
                    flexGrow: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  {topic.description}
                </Typography>
                
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {topic.tags.map((tag, tagIndex) => (
                    <Chip 
                      key={tagIndex}
                      label={tag} 
                      size="small"
                      sx={{ 
                        backgroundColor: 'grey.100', 
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        height: 20
                      }} 
                    />
                  ))}
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday sx={{ color: 'text.secondary', fontSize: 14 }} />
                      <Typography variant="caption" color="text.secondary">
                        {topic.date}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTime sx={{ color: 'text.secondary', fontSize: 14 }} />
                      <Typography variant="caption" color="text.secondary">
                        {topic.readTime}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'primary.main',
                        fontWeight: 500
                      }}
                    >
                      阅读全文
                    </Typography>
                    <ArrowForward sx={{ color: 'primary.main', fontSize: 14 }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8, p: 4, backgroundColor: 'white', borderRadius: 2, border: '1px solid #f0f0f0' }}>
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
            需要更多心理支持？
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
            如果你正在经历职业困境，欢迎分享你的故事。我们可以一起找到解决方案，互相支持，共同成长。
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            分享你的故事
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Psychology
