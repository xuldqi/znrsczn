import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Box, CircularProgress, Typography } from '@mui/material'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // 显示加载状态
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          正在验证身份...
        </Typography>
      </Box>
    )
  }

  // 检查是否需要登录
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  // 检查是否需要管理员权限
  if (requireAdmin && !isAdmin()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" color="error">
          访问被拒绝
        </Typography>
        <Typography variant="body1" color="text.secondary">
          您没有权限访问此页面，需要管理员权限。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          当前用户：{user?.name} ({user?.role})
        </Typography>
      </Box>
    )
  }

  return children
}

export default ProtectedRoute