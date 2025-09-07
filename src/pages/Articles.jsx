import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions,
  Chip, 
  Button, 
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Stack,
  IconButton
} from '@mui/material'
import { 
  Search, 
  Add, 
  Visibility, 
  ThumbUp, 
  Share, 
  Edit, 
  Delete,
  Category,
  TrendingUp,
  Schedule,
  LocalOffer
} from '@mui/icons-material'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const Articles = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: '中年职场人如何做好需求管理',
      summary: '需求管理是职场人的核心技能之一，本文分享一些实用的需求管理方法和工具。',
      content: '详细的文章内容...',
      category: '方法论',
      tags: ['需求管理', '项目规划', '工具'],
      author: '中年小白',
      date: new Date(),
      views: 128,
      likes: 15,
      difficulty: '入门',
      images: ['/api/placeholder/400/300', '/api/placeholder/300/200']
    },
    {
      id: 2,
      title: '从0到1搭建项目数据体系',
      summary: '数据驱动决策已成为项目管理的重要趋势，如何搭建完整的项目数据体系？',
      content: '详细的文章内容...',
      category: '数据分析',
      tags: ['数据分析', '指标体系', '用户行为'],
      author: '中年小白',
      date: new Date(Date.now() - 172800000),
      views: 256,
      likes: 32,
      difficulty: '进阶',
      images: ['/api/placeholder/350/250']
    },
    {
      id: 3,
      title: 'B端项目设计的思考与实践',
      summary: 'B端项目与C端项目在设计理念上有很大差异，本文总结B端项目设计的关键要点。',
      content: '详细的文章内容...',
      category: '项目设计',
      tags: ['B端项目', '用户体验', '业务流程'],
      author: '中年小白',
      date: new Date(Date.now() - 345600000),
      views: 189,
      likes: 24,
      difficulty: '进阶',
      images: []
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [open, setOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '方法论',
    tags: '',
    difficulty: '入门',
    images: []
  })

  const categories = ['全部', '方法论', '数据分析', '项目设计', '行业洞察', '工具推荐']
  const difficulties = ['入门', '进阶', '高级']
  const difficultyColors = {
    '入门': 'success',
    '进阶': 'warning', 
    '高级': 'error'
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleOpen = (article = null) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        tags: article.tags.join(', '),
        difficulty: article.difficulty
      })
      setSelectedImages(article.images || [])
    } else {
      setEditingArticle(null)
      setFormData({ title: '', summary: '', content: '', category: '方法论', tags: '', difficulty: '入门' })
      setSelectedImages([])
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingArticle(null)
  }

  const handleSave = () => {
    const newArticle = {
      id: editingArticle ? editingArticle.id : Date.now(),
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      difficulty: formData.difficulty,
      author: '中年小白',
      date: editingArticle ? editingArticle.date : new Date(),
      views: editingArticle ? editingArticle.views : 0,
      likes: editingArticle ? editingArticle.likes : 0,
      images: selectedImages
    }

    if (editingArticle) {
      setArticles(articles.map(article => article.id === editingArticle.id ? newArticle : article))
    } else {
      setArticles([newArticle, ...articles])
    }
    
    handleClose()
  }

  const handleDelete = (id) => {
    setArticles(articles.filter(article => article.id !== id))
  }

  const handleLike = (id) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, likes: article.likes + 1 } : article
    ))
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImages(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 页面标题 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            文章分享
          </Typography>
          <Typography variant="body1" color="text.secondary">
            分享职场方法论、实战经验和行业洞察
          </Typography>
        </Box>

        {/* 文章列表 */}
        <Grid container spacing={4}>
          {filteredArticles.map((article) => (
            <Grid item xs={12} md={6} lg={4} key={article.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={article.category} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip 
                        label={article.difficulty} 
                        color={difficultyColors[article.difficulty]} 
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small"
                        onClick={() => handleOpen(article)}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDelete(article.id)}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 2,
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6
                    }}
                  >
                    {article.summary}
                  </Typography>
                
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: 14,
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {article.author[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {article.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(article.date, 'MM月dd日', { locale: zhCN })}
                      </Typography>
                    </Box>
                  </Box>
                
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag} 
                        variant="outlined" 
                        size="small"
                        sx={{
                          borderColor: 'grey.300',
                          color: 'text.secondary',
                          fontWeight: 500
                        }}
                      />
                    ))}
                    {article.tags.length > 3 && (
                      <Chip 
                        label={`+${article.tags.length - 3}`}
                        variant="outlined" 
                        size="small"
                        sx={{ borderColor: 'grey.300', color: 'text.secondary' }}
                      />
                    )}
                  </Stack>
                </CardContent>
              
                <CardActions sx={{ justifyContent: 'space-between', px: 4, pb: 4, pt: 0 }}>
                  <Stack direction="row" spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Visibility fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{article.views}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ThumbUp fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{article.likes}</Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      size="small" 
                      startIcon={<ThumbUp />} 
                      onClick={() => handleLike(article.id)}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      点赞
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Share />}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      分享
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 发布文章对话框 */}
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingArticle ? '编辑文章' : '发布新文章'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="文章标题"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 3 }}
            />
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  select
                  margin="dense"
                  label="分类"
                  fullWidth
                  variant="outlined"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  margin="dense"
                  label="难度"
                  fullWidth
                  variant="outlined"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  SelectProps={{ native: true }}
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              margin="dense"
              label="文章摘要"
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              margin="dense"
              label="文章内容"
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              margin="dense"
              label="标签 (用逗号分隔)"
              fullWidth
              variant="outlined"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="项目管理, 用户体验, 数据分析"
            />
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleClose}
              sx={{ color: 'text.secondary' }}
            >
              取消
            </Button>
            <Button 
              onClick={handleSave} 
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              发布
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default Articles