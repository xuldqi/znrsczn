import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Alert
} from '@mui/material'
import { 
  Dashboard, 
  Article, 
  Code, 
  Store, 
  Edit, 
  Delete, 
  Add,
  CloudUpload,
  Image,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import ArticleManager from '../components/ArticleManager'

const Admin = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 1,
      name: 'hero-image.jpg',
      url: '/api/placeholder/400/300',
      size: '245KB',
      uploadDate: new Date(),
      usedIn: ['首页横幅']
    },
    {
      id: 2,
      name: 'product-screenshot.png',
      url: '/api/placeholder/300/200',
      size: '156KB',
      uploadDate: new Date(Date.now() - 86400000),
      usedIn: ['工具推荐']
    }
  ])

  // 模拟数据统计
  const stats = {
    totalArticles: 3,
    totalDevLogs: 2,
    totalProducts: 3,
    totalImages: uploadedImages.length,
    monthlyViews: 1250,
    totalLikes: 89
  }

  // 模拟最近活动
  const recentActivities = [
    {
      id: 1,
      type: 'article',
      action: '发布了新文章',
      title: 'B端项目设计的思考与实践',
      time: new Date()
    },
    {
      id: 2,
      type: 'devlog',
      action: '添加了开发日志',
      title: '导航栏开发',
      time: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      type: 'product',
      action: '推荐了新工具',
      title: 'Figma',
      time: new Date(Date.now() - 7200000)
    }
  ]

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleImageUpload = () => {
    if (selectedFile) {
      const newImage = {
        id: Date.now(),
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
        size: `${Math.round(selectedFile.size / 1024)}KB`,
        uploadDate: new Date(),
        usedIn: []
      }
      setUploadedImages([newImage, ...uploadedImages])
      setSelectedFile(null)
      setUploadDialogOpen(false)
    }
  }

  const handleDeleteImage = (id) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id))
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'article': return <Article color="primary" />
      case 'devlog': return <Code color="secondary" />
      case 'product': return <Store color="success" />
      default: return <Dashboard />
    }
  }

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          后台管理
        </Typography>
        <Chip 
          icon={<Dashboard />} 
          label="管理员模式" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab icon={<Dashboard />} label="概览" />
          <Tab icon={<Image />} label="图片管理" />
          <Tab icon={<Article />} label="文章管理" />
        </Tabs>
      </Box>

      {/* 概览面板 */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      文章总数
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalArticles}
                    </Typography>
                  </Box>
                  <Article sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      开发日志
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalDevLogs}
                    </Typography>
                  </Box>
                  <Code sx={{ fontSize: 40, color: 'secondary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      推荐工具
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalProducts}
                    </Typography>
                  </Box>
                  <Store sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      图片资源
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalImages}
                    </Typography>
                  </Box>
                  <Image sx={{ fontSize: 40, color: 'warning.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              最近活动
            </Typography>
            {recentActivities.map((activity) => (
              <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'background.paper' }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">
                    {activity.action}: <strong>{activity.title}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(activity.time, 'HH:mm', { locale: zhCN })}
                  </Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 图片管理面板 */}
      <TabPanel value={currentTab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            图片资源管理
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialogOpen(true)}
          >
            上传图片
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          支持上传 JPG、PNG、GIF 格式图片，单个文件不超过 5MB
        </Alert>

        <Grid container spacing={3}>
          {uploadedImages.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    size="small"
                    color="error"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="subtitle2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {image.size} • {format(image.uploadDate, 'MM月dd日', { locale: zhCN })}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {image.usedIn.length > 0 ? (
                      image.usedIn.map((usage, index) => (
                        <Chip key={index} label={usage} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))
                    ) : (
                      <Chip label="未使用" size="small" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* 文章管理面板 */}
      <TabPanel value={currentTab} index={2}>
        <ArticleManager />
      </TabPanel>

      {/* 图片上传对话框 */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>上传图片</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                sx={{ mb: 2 }}
              >
                选择图片文件
              </Button>
            </label>
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  已选择: {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  大小: {Math.round(selectedFile.size / 1024)}KB
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>取消</Button>
          <Button 
            onClick={handleImageUpload} 
            variant="contained" 
            disabled={!selectedFile}
          >
            上传
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Admin