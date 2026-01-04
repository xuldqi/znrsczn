import { useState } from 'react'
import { useCategories } from '../contexts/CategoryContext'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert
} from '@mui/material'
import { Add, Edit, Delete, Save, Cancel } from '@mui/icons-material'

const defaultColor = '#2563eb'

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories()
  const [open, setOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    color: defaultColor,
    description: '',
    order: categories.length + 1
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const resetForm = () => {
    setFormData({
      name: '',
      color: defaultColor,
      description: '',
      order: categories.length + 1
    })
  }

  const handleAdd = () => {
    setEditingCategory(null)
    resetForm()
    setOpen(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      color: category.color || defaultColor,
      description: category.description || '',
      order: category.order || 1
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingCategory(null)
    resetForm()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('请填写分类名称', 'error')
      return
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          color: formData.color,
          description: formData.description,
          order: Number(formData.order) || editingCategory.order || 1
        })
        showToast('分类更新成功')
      } else {
        await addCategory({
          name: formData.name.trim(),
          color: formData.color,
          description: formData.description
        })
        showToast('分类创建成功')
      }
      handleClose()
    } catch (error) {
      showToast(error.message || '保存分类失败', 'error')
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`确定要删除分类「${category.name}」吗？`)) {
      return
    }
    try {
      await deleteCategory(category.id)
      showToast('分类已删除')
    } catch (error) {
      showToast(error.message || '删除分类失败', 'error')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          分类管理
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          新建分类
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>排序</TableCell>
              <TableCell>分类名称</TableCell>
              <TableCell>颜色</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>标识</TableCell>
              <TableCell width={140}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: category.color || defaultColor,
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    />
                    <Chip label={category.color || defaultColor} size="small" variant="outlined" />
                  </Stack>
                </TableCell>
                <TableCell sx={{ maxWidth: 240 }}>
                  <Typography variant="body2" color="text.secondary" noWrap title={category.description}>
                    {category.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={category.id} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(category)}>
                      <Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    暂无分类，请点击右上角「新建分类」按钮创建。
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? '编辑分类' : '新建分类'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="分类名称"
              value={formData.name}
              onChange={(event) => handleChange('name', event.target.value)}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="分类颜色"
                type="color"
                value={formData.color}
                onChange={(event) => handleChange('color', event.target.value)}
                sx={{ width: 120 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="显示顺序 (数字越小越靠前)"
                type="number"
                value={formData.order}
                onChange={(event) => handleChange('order', event.target.value)}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Stack>
            <TextField
              label="分类描述"
              value={formData.description}
              onChange={(event) => handleChange('description', event.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            {editingCategory && (
              <Alert severity="info">
                分类标识保持不变：<strong>{editingCategory.id}</strong>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<Cancel />}>
            取消
          </Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CategoryManager
