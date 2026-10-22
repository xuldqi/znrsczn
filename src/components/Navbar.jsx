import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Tooltip,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  FamilyRestroom,
  Work,
  Psychology,
  Store,
  AccountBalance,
  Person,
  ExitToApp,
  Diamond,
  Menu as MenuIcon,
  Close as CloseIcon,
  Calculate as CalculateIcon,
  RateReview as FeedbackIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material'
import SearchBar from './SearchBar'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    handleClose()
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  const handleLogin = () => {
    setMobileOpen(false)
    navigate('/login')
  }

  const handleNavClick = (path) => {
    setMobileOpen(false)
    navigate(path)
  }

  const publicNavItems = [
    { path: '/', label: '首页', icon: <Home /> },
    { path: '/career', label: '职场突破', icon: <Work /> },
    { path: '/side-business', label: '副业轻创', icon: <MonetizationOnIcon /> },
    { path: '/finance', label: '财务养老', icon: <AccountBalance /> },
    { path: '/family', label: '家庭生活', icon: <FamilyRestroom /> },
    { path: '/psychology', label: '心理破局', icon: <Psychology /> },
    { path: '/products', label: '精选好物', icon: <Store /> },
  ]

  const toolNavItems = [
    { path: '/pension-planner', label: '养老金深度测算', icon: <CalculateIcon /> },
    { path: '/complaints', label: '自救建议与反馈', icon: <FeedbackIcon /> },
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(9, 13, 22, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 68, justifyContent: 'space-between' }}>
          {/* Mobile Menu Button + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' }, color: '#f1f5f9' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 900,
                color: '#38bdf8',
                textDecoration: 'none',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
                mr: { xs: 1, md: 4 },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              中年自救指南
            </Typography>
          </Box>

          {/* Navigation Items - Desktop */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.5,
            flex: 1
          }}>
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    px: 1.8,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff'
                    }
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </Box>

          {/* Right Side: Search + Action Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 200 }}>
              <SearchBar />
            </Box>

            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/pension-planner')}
              startIcon={<CalculateIcon sx={{ fontSize: 16 }} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                borderRadius: '50px',
                px: 2,
                py: 0.7,
                fontSize: '0.82rem',
                fontWeight: 700,
                bgcolor: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#2563eb',
                  color: 'white'
                }
              }}
            >
              养老缺口测算
            </Button>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => navigate('/membership')}
                  sx={{ color: '#fbbf24' }}
                  title="会员中心"
                >
                  <Diamond />
                </IconButton>
                <Tooltip title="个人中心">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{
                      border: '2px solid rgba(255,255,255,0.2)',
                      p: 0.5
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#2563eb', fontSize: '0.8rem', color: 'white' }}>
                      {user.name ? user.name[0] : <Person />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      bgcolor: '#0f172a',
                      color: '#f8fafc',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <MenuItem onClick={() => navigate('/membership')}>
                    <Diamond fontSize="small" sx={{ mr: 1.5, color: '#fbbf24' }} />
                    会员中心
                  </MenuItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <MenuItem onClick={handleLogout} sx={{ color: '#f87171' }}>
                    <ExitToApp fontSize="small" sx={{ mr: 1.5 }} />
                    退出登录
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                onClick={handleLogin}
                variant="contained"
                size="small"
                sx={{ 
                  borderRadius: '50px',
                  px: { xs: 2, sm: 2.8 },
                  py: { xs: 0.6, sm: 0.8 },
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  bgcolor: '#2563eb',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  '&:hover': { bgcolor: '#1d4ed8' }
                }}
              >
                登录
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* 移动端侧边抽屉 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 290, 
            p: 2.5,
            bgcolor: '#0d131f',
            color: '#f1f5f9',
            borderRight: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#38bdf8', fontSize: '1.15rem' }}>
            中年自救指南
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 移动端搜索 */}
        <Box sx={{ mb: 2.5 }}>
          <SearchBar />
        </Box>

        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        <List disablePadding>
          {publicNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(56, 189, 248, 0.15)',
                      '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.2)' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#38bdf8' : '#94a3b8', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.95rem' }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#64748b' }}>
          实用自救工具
        </Typography>

        <List disablePadding>
          {toolNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#38bdf8' : '#94a3b8', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleNavClick('/pension-planner')}
            startIcon={<CalculateIcon />}
            sx={{
              borderRadius: 2,
              mb: 1.5,
              textTransform: 'none',
              bgcolor: '#2563eb',
              fontWeight: 700,
              py: 1
            }}
          >
            打开养老金缺口测算
          </Button>

          {user ? (
            <Button
              fullWidth
              variant="text"
              color="error"
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              sx={{ textTransform: 'none' }}
            >
              退出登录 ({user.name || '用户'})
            </Button>
          ) : (
            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogin}
              sx={{ borderRadius: 2, textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              登录账号
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default Navbar
