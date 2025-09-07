import { useState } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack,
  Alert,
  Snackbar
} from '@mui/material'
import { Email, Send } from '@mui/icons-material'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setShowError(true)
      return
    }

    setLoading(true)
    
    // 模拟订阅请求
    setTimeout(() => {
      setLoading(false)
      setShowSuccess(true)
      setEmail('')
    }, 1000)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
  }

  const handleCloseError = () => {
    setShowError(false)
  }

  return (
    <>
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none'
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <Email sx={{ fontSize: 30, color: 'white' }} />
        </Box>
        
        <Typography variant="h4" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          订阅最新内容
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          订阅我们的邮件列表，第一时间获取最新的职场管理文章、工具推荐和开发日志更新。
          我们承诺不会发送垃圾邮件，您可以随时取消订阅。
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ maxWidth: 500, mx: 'auto' }}
          alignItems="center"
        >
          <TextField
            fullWidth
            placeholder="输入您的邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                border: '1px solid #dee2e6'
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubscribe}
            disabled={loading}
            startIcon={loading ? null : <Send />}
            sx={{
              backgroundColor: 'primary.main',
              px: 4,
              py: 1.5,
              whiteSpace: 'nowrap',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            {loading ? '订阅中...' : '立即订阅'}
          </Button>
        </Stack>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          🔒 我们重视您的隐私，不会分享您的邮箱地址
        </Typography>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          订阅成功！感谢您的关注，我们会定期为您发送最新内容。
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          请输入有效的邮箱地址。
        </Alert>
      </Snackbar>
    </>
  )
}

export default Newsletter
