import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Paper, Stack, Divider, Avatar } from '@mui/material'
import { Business, School, TrendingUp, Group, Work, Favorite, ArrowForward, CalendarToday, AccessTime, Star } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'

const Career = () => {
  const navigate = useNavigate()
  const { getArticlesByCategory } = useArticles()
  
  // 获取职场发展类文章
  const careerArticles = getArticlesByCategory('职场发展')
  const careerPaths = [
    {
      icon: <Business sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '副业咨询',
      description: '利用职场经验做行业咨询、培训、顾问，在不放弃现有工作的前提下增加收入',
      category: '副业发展',
      difficulty: '中等',
      income: '5K-20K/月',
      time: '周末/晚上',
      tags: ['咨询', '培训', '副业', '技能变现']
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '投资理财',
      description: '用理性思维做投资决策，从股票、基金到创业投资，让钱生钱',
      category: '投资理财',
      difficulty: '高',
      income: '波动较大',
      time: '碎片时间',
      tags: ['投资', '理财', '理性思维', '风险控制']
    },
    {
      icon: <School sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '技术管理',
      description: '向技术管理岗位发展，成为技术管理专家或技术总监',
      category: '职业发展',
      difficulty: '高',
      income: '30K-80K/月',
      time: '全职转型',
      tags: ['技术管理', '职业转型', '技术领导', '团队管理']
    },
    {
      icon: <Group sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '行业专家',
      description: '深耕某个行业，成为该领域的专家，提供专业咨询和解决方案',
      category: '专业发展',
      difficulty: '中等',
      income: '10K-50K/月',
      time: '兼职/全职',
      tags: ['行业专家', '专业咨询', '深度发展', '品牌建设']
    },
    {
      icon: <Work sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '内容创作',
      description: '分享职场经验，建立个人品牌，通过写作、视频、课程等方式变现',
      category: '内容创业',
      difficulty: '中等',
      income: '3K-30K/月',
      time: '碎片时间',
      tags: ['内容创作', '个人品牌', '知识付费', '影响力']
    },
    {
      icon: <Favorite sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: '创业准备',
      description: '积累经验和资源，为未来创业做准备，包括人脉、资金、技能储备',
      category: '创业准备',
      difficulty: '高',
      income: '长期投资',
      time: '长期规划',
      tags: ['创业准备', '资源积累', '人脉建设', '长期规划']
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
            职业拓展
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
            在现有工作基础上拓展职业边界：副业、咨询、投资、技术管理等，不放弃现有积累
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
            <Chip label="副业发展" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="投资理财" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="技术管理" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
            <Chip label="内容创作" sx={{ backgroundColor: 'grey.100', color: 'text.primary' }} />
          </Stack>
        </Box>

        {/* Career Articles Section - NEW */}
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
            职场发展文章
          </Typography>
          
          <Stack spacing={2}>
            {careerArticles.map((article, index) => (
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
                        backgroundColor: '#2563eb',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: 600
                      }}>
                        职
                      </Box>
                      <Typography variant="caption" color="#999" sx={{ fontSize: '0.75rem' }}>
                        职场发展
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
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', backgroundColor: '#1976d2' }}>
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
                          backgroundColor: '#2563eb',
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

        {/* Career Paths Grid - EXISTING CONTENT */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: '1fr 1fr', 
            lg: '1fr 1fr 1fr'
          }, 
          gap: 3 
        }}>
          {careerPaths.map((path, index) => (
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
                  {path.icon}
                </Box>
                
                <Chip 
                  label={path.category}
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
                  {path.title}
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
                  {path.description}
                </Typography>
                
                {/* Path Details */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">难度：</Typography>
                    <Chip 
                      label={path.difficulty} 
                      size="small"
                      sx={{ 
                        backgroundColor: path.difficulty === '高' ? '#ffebee' : path.difficulty === '中等' ? '#fff3e0' : '#e8f5e8',
                        color: path.difficulty === '高' ? '#d32f2f' : path.difficulty === '中等' ? '#f57c00' : '#388e3c',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">收入预期：</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {path.income}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">时间投入：</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {path.time}
                    </Typography>
                  </Stack>
                </Stack>
                
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {path.tags.map((tag, tagIndex) => (
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
                
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    了解详情
                  </Typography>
                  <ArrowForward sx={{ color: 'primary.main', fontSize: 14 }} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Success Stories Section */}
        <Box sx={{ mt: 8, p: 4, backgroundColor: 'white', borderRadius: 2, border: '1px solid #f0f0f0' }}>
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
            成功案例
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #f0f0f0' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Star sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    从中年职场人到技术总监
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  "通过系统学习技术知识，结合业务思维，成功转型为技术管理总监，薪资翻倍。"
                </Typography>
                <Typography variant="caption" color="primary.main">
                  — 张明，前BAT职场人
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: '1px solid #f0f0f0' }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Star sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    副业咨询月入2万
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  "利用周末时间做行业咨询，不仅增加了收入，还建立了行业影响力。"
                </Typography>
                <Typography variant="caption" color="primary.main">
                  — 李华，某互联网公司职场人
                </Typography>
              </Paper>
            </Grid>
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
            准备开始你的职业拓展？
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
            选择适合你的拓展方向，制定详细的行动计划，在现有工作基础上实现职业突破。
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
            制定拓展计划
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Career
