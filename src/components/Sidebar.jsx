import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Button
} from '@mui/material'
import { 
  TrendingUp, 
  Article, 
  Person, 
  Visibility,
  ArrowForward
} from '@mui/icons-material'

const Sidebar = () => {
  // 热门文章数据
  const hotArticles = [
    {
      id: 1,
      title: "35岁职场危机完全应对指南",
      views: 12580,
      category: "职业发展",
      date: "2024-01-20"
    },
    {
      id: 2, 
      title: "中年转行成功的5个关键步骤",
      views: 9876,
      category: "职业转型",
      date: "2024-01-18"
    },
    {
      id: 3,
      title: "副业赚钱：适合中年人的6个方向",
      views: 8654,
      category: "副业创收",
      date: "2024-01-15"
    },
    {
      id: 4,
      title: "高效时间管理：中年人的必备技能",
      views: 7432,
      category: "效率提升",
      date: "2024-01-12"
    },
    {
      id: 5,
      title: "职场沟通技巧：化解人际冲突",
      views: 6789,
      category: "沟通技巧",
      date: "2024-01-10"
    }
  ]

  // 推荐工具数据
  const recommendedTools = [
    {
      name: "番茄工作法Timer",
      description: "专注工作的时间管理神器",
      type: "效率工具"
    },
    {
      name: "Forest专注森林",
      description: "种树专注，戒除手机依赖",
      type: "专注工具"
    },
    {
      name: "有道云笔记",
      description: "知识管理和团队协作",
      type: "笔记工具"
    }
  ]

  // 热门标签
  const hotTags = [
    "职场技能", "心理调节", "副业创收", "时间管理", 
    "人际沟通", "职业规划", "压力管理", "学习方法"
  ]

  return (
    <Stack spacing={3}>
      {/* 热门文章 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          border: '1px solid #f0f0f0',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            热门文章
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {hotArticles.map((article, index) => (
            <Box key={article.id}>
              <ListItem 
                sx={{ 
                  px: 0,
                  py: 2,
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'grey.50'
                  }
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      sx={{ 
                        mr: 1,
                        minWidth: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: index < 3 ? 'primary.main' : 'grey.300',
                        color: index < 3 ? 'white' : 'text.secondary',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'text.primary',
                          lineHeight: 1.4,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip 
                          label={article.category}
                          size="small"
                          sx={{ 
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: 'grey.100',
                            color: 'text.secondary'
                          }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility sx={{ fontSize: 12, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {article.views.toLocaleString()}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </ListItem>
              {index < hotArticles.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
        
        <Button 
          variant="text" 
          endIcon={<ArrowForward />}
          sx={{ 
            mt: 2,
            color: 'primary.main',
            fontSize: '0.875rem'
          }}
        >
          查看更多热门文章
        </Button>
      </Paper>

      {/* 推荐工具 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          border: '1px solid #f0f0f0',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Article sx={{ mr: 1, color: 'secondary.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            推荐工具
          </Typography>
        </Box>
        
        <Stack spacing={2}>
          {recommendedTools.map((tool, index) => (
            <Box 
              key={index}
              sx={{ 
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5
                }}
              >
                {tool.name}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  display: 'block',
                  mb: 1,
                  lineHeight: 1.4
                }}
              >
                {tool.description}
              </Typography>
              <Chip 
                label={tool.type}
                size="small"
                sx={{ 
                  height: 18,
                  fontSize: '0.65rem',
                  backgroundColor: 'primary.main',
                  color: 'white'
                }}
              />
            </Box>
          ))}
        </Stack>
        
        <Button 
          variant="text" 
          endIcon={<ArrowForward />}
          sx={{ 
            mt: 2,
            color: 'secondary.main',
            fontSize: '0.875rem'
          }}
        >
          发现更多工具
        </Button>
      </Paper>

      {/* 热门标签 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          border: '1px solid #f0f0f0',
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 3
          }}
        >
          热门标签
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {hotTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              clickable
              sx={{
                backgroundColor: 'grey.100',
                color: 'text.secondary',
                fontSize: '0.8rem',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* 作者推荐 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3,
          border: '1px solid #f0f0f0',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Person sx={{ mr: 1, color: 'warning.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            推荐作者
          </Typography>
        </Box>
        
        <Stack spacing={2}>
          {[
            { name: "职场导师李明", articles: 48, desc: "15年职场经验分享者" },
            { name: "转行专家王芳", articles: 32, desc: "帮助500+人成功转行" },
            { name: "副业达人张伟", articles: 28, desc: "多个副业项目操盘手" }
          ].map((author, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  backgroundColor: 'primary.main',
                  fontSize: '0.9rem'
                }}
              >
                {author.name.slice(0, 1)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5
                  }}
                >
                  {author.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  {author.desc}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="primary.main"
                  sx={{ fontWeight: 500 }}
                >
                  {author.articles} 篇文章
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}

export default Sidebar