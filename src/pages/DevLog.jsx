import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Stack,
  Divider
} from '@mui/material'
import { Add, Edit, Delete, Code, BugReport, Star, CalendarToday } from '@mui/icons-material'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const DevLog = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      title: '项目初始化',
      content: '使用Vite + React创建了项目基础架构，配置了Material-UI和React Router。',
      type: 'feature',
      date: new Date(),
      tags: ['React', 'Vite', 'Material-UI']
    },
    {
      id: 2,
      title: '导航栏开发',
      content: '完成了响应式导航栏的开发，支持路由高亮显示。',
      type: 'feature',
      date: new Date(Date.now() - 86400000),
      tags: ['UI', '导航']
    }
  ])
  
  const [open, setOpen] = useState(false)
  const [editingLog, setEditingLog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'feature',
    tags: ''
  })

  const logTypes = {
    feature: { label: '新功能', color: 'success', icon: <Star /> },
    bug: { label: '修复', color: 'error', icon: <BugReport /> },
    code: { label: '重构', color: 'info', icon: <Code /> }
  }

  const handleOpen = (log = null) => {
    if (log) {
      setEditingLog(log)
      setFormData({
        title: log.title,
        content: log.content,
        type: log.type,
        tags: log.tags.join(', ')
      })
    } else {
      setEditingLog(null)
      setFormData({ title: '', content: '', type: 'feature', tags: '' })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingLog(null)
  }

  const handleSave = () => {
    const newLog = {
      id: editingLog ? editingLog.id : Date.now(),
      title: formData.title,
      content: formData.content,
      type: formData.type,
      date: editingLog ? editingLog.date : new Date(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    if (editingLog) {
      setLogs(logs.map(log => log.id === editingLog.id ? newLog : log))
    } else {
      setLogs([newLog, ...logs])
    }
    
    handleClose()
  }

  const handleDelete = (id) => {
    setLogs(logs.filter(log => log.id !== id))
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              开发日志
            </Typography>
            <Typography variant="body1" color="text.secondary">
              记录项目开发过程中的思考、决策和经验总结
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            添加日志
          </Button>
        </Box>

        <Grid container spacing={4}>
          {logs.map((log) => (
            <Grid item xs={12} key={log.id}>
              <Card 
                sx={{ 
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Chip 
                          icon={logTypes[log.type].icon}
                          label={logTypes[log.type].label}
                          color={logTypes[log.type].color}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            {format(log.date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                        {log.title}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        onClick={() => handleOpen(log)} 
                        size="small"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(log.id)} 
                        size="small" 
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Box>
                  
                  <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 3 }}>
                    {log.content}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {log.tags.map((tag, index) => (
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
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingLog ? '编辑日志' : '添加新日志'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="标题"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 3 }}
            />
            <TextField
              select
              margin="dense"
              label="类型"
              fullWidth
              variant="outlined"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              SelectProps={{ native: true }}
              sx={{ mb: 3 }}
            >
              {Object.entries(logTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="内容"
              fullWidth
              multiline
              rows={4}
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
              placeholder="React, UI, 功能开发"
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
              保存
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default DevLog