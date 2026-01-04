import { useEffect, useMemo, useState } from 'react'
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
import { useArticles } from '../contexts/ArticleContext'
import { useCategories } from '../contexts/CategoryContext'

const Articles = () => {
  const {
    getAllArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    refreshArticles,
    loading,
    error
  } = useArticles()
  const { categories: categoryList } = useCategories()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [open, setOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '方法论',
    tags: '',
    difficulty: '入门',
    status: 'published',
    readTime: ''
  })

  const categories = useMemo(
    () => ['全部', ...categoryList.map(category => category.name)],
    [categoryList]
  )
  const difficulties = ['入门', '进阶', '高级']
  const difficultyColors = {
    '入门': 'success',
    '进阶': 'warning', 
    '高级': 'error'
  }

  const allArticles = getAllArticles()
  const publishedArticles = useMemo(
    () => allArticles.filter(article => article.status === 'published'),
    [allArticles]
  )

  const filteredArticles = publishedArticles.filter(article => {
    const tags = Array.isArray(article.tags) ? article.tags : []
    const summaryText = (article.summary || article.excerpt || '').toLowerCase()
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summaryText.includes(searchTerm.toLowerCase()) ||
                         tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('全部')
    }
  }, [categories, selectedCategory])

  const handleOpen = (article = null) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        summary: article.summary || article.excerpt || '',
        content: article.content,
        category: article.category,
        tags: article.tags.join(', '),
        difficulty: article.difficulty || '入门',
        status: article.status || 'published',
        readTime: article.readTime || ''
      })
    } else {
      setEditingArticle(null)
      setFormData({ title: '', summary: '', content: '', category: '方法论', tags: '', difficulty: '入门', status: 'published', readTime: '' })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingArticle(null)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      return
    }

    const payload = {
      title: formData.title,
      excerpt: formData.summary,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      difficulty: formData.difficulty,
      author: editingArticle?.author || '中年小白',
      status: formData.status || 'published',
      readTime: formData.readTime || ''
    }

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, payload)
      } else {
        await addArticle(payload)
      }
      refreshArticles()
      handleClose()
    } catch (err) {
      console.error('保存文章失败', err)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('确认删除这篇文章吗？')) {
      deleteArticle(id)
      refreshArticles()
    }
  }

  const handleLike = (id) => {
    const article = publishedArticles.find(item => item.id === id)
    if (article) {
      updateArticle(id, { likes: (article.likes || 0) + 1 })
    }
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

        <Box sx={{ mb: 5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="搜索文章标题、摘要或标签"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{ textTransform: 'none' }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* 文章列表 */}
        <Grid container spacing={4}>
          {loading && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                正在加载文章...
              </Typography>
            </Grid>
          )}
          {error && !loading && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                加载文章失败：{error}
              </Typography>
            </Grid>
          )}
          {!loading && !error && filteredArticles.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                暂无符合条件的文章
              </Typography>
            </Grid>
          )}
          {!loading && !error && filteredArticles.map((article) => (
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
                      {article.summary || article.excerpt}
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
                        {article.date ? format(new Date(article.date), 'MM月dd日', { locale: zhCN }) : '日期待确认'}
                      </Typography>
                    </Box>
                  </Box>
                
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                    {(article.tags || []).slice(0, 3).map((tag, index) => (
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
                    {(article.tags || []).length > 3 && (
                      <Chip 
                        label={`+${(article.tags || []).length - 3}`}
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
                      <Typography variant="caption" color="text.secondary">{article.views || 0}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ThumbUp fontSize="small" sx={{ color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">{article.likes || 0}</Typography>
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
