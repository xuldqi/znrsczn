import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Stack, 
  Tabs, 
  Tab,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material'
import { Article, Store, Psychology, Work, TrendingUp, CalendarToday, ArrowForward } from '@mui/icons-material'

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const searchCategories = [
    { id: 0, name: '全部', icon: <Article /> },
    { id: 1, name: '文章', icon: <Article /> },
    { id: 2, name: '工具', icon: <Store /> },
    { id: 3, name: '心理', icon: <Psychology /> },
    { id: 4, name: '职业', icon: <Work /> }
  ]

  // 模拟搜索结果数据
  const mockResults = {
    articles: [
      {
        title: "中年职场人如何应对35岁危机",
        excerpt: "当你发现自己在职场中迷失方向时，这些实用的方法可以帮助你重新找到突破点。包括技能提升、人际关系建设、职业规划等核心要素。",
        date: "2024-01-20",
        readTime: "15分钟",
        author: "职业规划师",
        category: "职业发展",
        type: "article"
      },
      {
        title: "提升工作效率的10个实用技巧",
        excerpt: "从时间管理到工作流程优化，分享在职场中真正有效的效率提升方法。适合中年职场人快速上手的实践指南。",
        date: "2024-01-18",
        readTime: "12分钟", 
        author: "效率专家",
        category: "技能提升",
        type: "article"
      },
      {
        title: "中年转行完全指南",
        excerpt: "详细分析中年转行的机遇与挑战，以及如何在转行过程中保持竞争力。真实案例分享和实操建议。",
        date: "2024-01-15",
        readTime: "20分钟",
        author: "转行成功者",
        category: "职业转型",
        type: "article"
      }
    ],
    tools: [
      {
        title: "时间管理工具推荐",
        excerpt: "Todoist、Forest、番茄工作法等提升工作效率的实用应用推荐，帮助中年职场人更好地管理时间。",
        category: "效率工具",
        stats: "5+ 应用",
        type: "tool"
      },
      {
        title: "财务管理工具合集",
        excerpt: "记账软件、投资理财、预算规划等帮助中年人理财的工具推荐，提升财务管理能力。",
        category: "理财工具", 
        stats: "8+ 应用",
        type: "tool"
      }
    ],
    psychology: [
      {
        title: "职场压力管理指南",
        excerpt: "面对KPI、deadline、老板压力时的实用应对方法和心理调节技巧，帮助中年职场人缓解工作压力。",
        category: "压力管理",
        readTime: "10分钟",
        type: "psychology"
      }
    ]
  }

  const getAllResults = () => {
    const allResults = [
      ...mockResults.articles,
      ...mockResults.tools, 
      ...mockResults.psychology
    ]
    return allResults.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredResults = () => {
    switch (activeTab) {
      case 0: return getAllResults()
      case 1: return mockResults.articles.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
      case 2: return mockResults.tools.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
      case 3: return mockResults.psychology.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
      case 4: return getAllResults().filter(item => item.category?.includes('职'))
      default: return getAllResults()
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const results = getFilteredResults()
  const totalResults = getAllResults().length

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {searchQuery && (
        <>
          {/* 搜索结果统计 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              搜索结果
            </Typography>
            <Typography variant="body2" color="text.secondary">
              找到 <strong>{totalResults}</strong> 条关于 "<strong>{searchQuery}</strong>" 的结果
            </Typography>
          </Box>

          {/* 分类标签 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  minHeight: 48,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                  height: 3
                }
              }}
            >
              {searchCategories.map((category) => (
                <Tab 
                  key={category.id} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {category.icon}
                      {category.name}
                    </Box>
                  } 
                />
              ))}
            </Tabs>
          </Box>

          {/* 搜索结果 */}
          {results.length > 0 ? (
            <Stack spacing={3}>
              {results.map((result, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* 类型图标 */}
                      <Box sx={{ mt: 0.5 }}>
                        {result.type === 'article' && <Article sx={{ color: 'primary.main', fontSize: 24 }} />}
                        {result.type === 'tool' && <Store sx={{ color: 'secondary.main', fontSize: 24 }} />}
                        {result.type === 'psychology' && <Psychology sx={{ color: 'warning.main', fontSize: 24 }} />}
                      </Box>
                      
                      {/* 内容 */}
                      <Box sx={{ flexGrow: 1 }}>
                        {/* 标题 */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.3,
                            mb: 1,
                            fontSize: '1.1rem',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          {result.title}
                        </Typography>
                        
                        {/* 描述 */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            lineHeight: 1.6,
                            fontSize: '0.95rem'
                          }}
                        >
                          {result.excerpt}
                        </Typography>
                        
                        {/* 元信息 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip 
                              label={result.category} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'grey.100',
                                color: 'text.secondary',
                                fontSize: '0.75rem'
                              }} 
                            />
                            {result.date && (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarToday sx={{ color: 'text.secondary', fontSize: 14 }} />
                                <Typography variant="caption" color="text.secondary">
                                  {result.date}
                                </Typography>
                              </Stack>
                            )}
                            {result.readTime && (
                              <Typography variant="caption" color="text.secondary">
                                {result.readTime}
                              </Typography>
                            )}
                            {result.stats && (
                              <Typography variant="caption" color="text.secondary">
                                {result.stats}
                              </Typography>
                            )}
                          </Stack>
                          
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'primary.main',
                                fontWeight: 500
                              }}
                            >
                              查看详情
                            </Typography>
                            <ArrowForward sx={{ color: 'primary.main', fontSize: 14 }} />
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                没有找到相关结果
              </Typography>
              <Typography variant="body2" color="text.secondary">
                请尝试使用其他关键词搜索
              </Typography>
            </Paper>
          )}
        </>
      )}

      {!searchQuery && (
        <Paper sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            开始搜索中年人自救指南
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            搜索职场技能、心理建设、工具推荐等内容
          </Typography>
          
          {/* 热门搜索建议 */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              热门搜索
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ gap: 1 }}>
              {['35岁职场危机', '中年转行指南', '副业赚钱', '职场沟通技巧', '时间管理', '压力管理'].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  clickable
                  onClick={() => {
                    setSearchQuery(item)
                    setSearchParams({ q: item })
                  }}
                  sx={{ 
                    backgroundColor: 'grey.100',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>
      )}
    </Container>
  )
}

export default SearchResults