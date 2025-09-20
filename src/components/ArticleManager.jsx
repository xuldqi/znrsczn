import { useState, useEffect } from 'react'
import { useArticles } from '../contexts/ArticleContext'
import RichTextEditor from './RichTextEditor'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Save,
  Cancel
} from '@mui/icons-material'

const categories = [
  "职场发展",
  "心理健康", 
  "家庭关系",
  "兴趣爱好",
  "好物推荐",
  "财务管理"
]

const statusOptions = [
  { value: "draft", label: "草稿", color: "default" },
  { value: "published", label: "已发布", color: "success" },
  { value: "archived", label: "已归档", color: "warning" }
]

const ArticleManager = () => {
  const { getAllArticles, addArticle, updateArticle, deleteArticle } = useArticles()
  const [open, setOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // 从 Context 获取文章列表
  const articles = getAllArticles()

  // 初始化空文章表单
  const emptyArticle = {
    id: '',
    title: '',
    excerpt: '',
    author: '',
    category: '',
    status: 'draft',
    readTime: '',
    tags: [],
    content: ''
  }

  const [formData, setFormData] = useState(emptyArticle)

  // 打开添加文章对话框
  const handleAddArticle = () => {
    setEditingArticle(null)
    setFormData(emptyArticle)
    setOpen(true)
  }

  // 打开编辑文章对话框
  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : []
    })
    setOpen(true)
  }

  // 删除文章
  const handleDeleteArticle = (articleId) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      deleteArticle(articleId)
      showSnackbar('文章删除成功！', 'success')
    }
  }

  // 保存文章
  const handleSaveArticle = () => {
    if (!formData.title || !formData.content) {
      showSnackbar('请填写文章标题和内容！', 'error')
      return
    }

    if (editingArticle) {
      // 更新现有文章
      updateArticle(editingArticle.id, formData)
      showSnackbar('文章更新成功！', 'success')
    } else {
      // 添加新文章
      addArticle(formData)
      showSnackbar('文章创建成功！', 'success')
    }

    setOpen(false)
  }

  // 显示提示信息
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  // 处理表单输入
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理标签输入
  const handleTagsChange = (event) => {
    const value = event.target.value
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    setFormData(prev => ({
      ...prev,
      tags: tags
    }))
  }

  // 获取状态颜色
  const getStatusChip = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status)
    return (
      <Chip 
        label={statusOption?.label || status} 
        color={statusOption?.color || 'default'}
        size="small"
      />
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          文章管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddArticle}
        >
          添加文章
        </Button>
      </Box>

      {/* 文章列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell>作者</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>阅读时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {article.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {article.excerpt.substring(0, 80)}...
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{article.author}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{getStatusChip(article.status)}</TableCell>
                <TableCell>{article.readTime}</TableCell>
                <TableCell>{article.updatedAt}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => handleEditArticle(article)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteArticle(article.id)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 文章编辑对话框 */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingArticle ? '编辑文章' : '添加文章'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* 基本信息 */}
            <TextField
              fullWidth
              label="文章标题"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="文章摘要"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              multiline
              rows={3}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="作者"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                select
                label="分类"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                sx={{ flex: 1 }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                select
                label="状态"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                sx={{ flex: 1 }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="阅读时间"
                value={formData.readTime}
                onChange={(e) => handleInputChange('readTime', e.target.value)}
                placeholder="例如：8分钟"
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              fullWidth
              label="标签 (用逗号分隔)"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="例如：职场转型, 价值重塑, 35岁危机"
            />

            {/* 文章内容 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                文章内容 *
              </Typography>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="请输入文章内容，支持 Markdown 语法..."
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} startIcon={<Cancel />}>
            取消
          </Button>
          <Button 
            onClick={handleSaveArticle} 
            variant="contained" 
            startIcon={<Save />}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示信息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ArticleManager