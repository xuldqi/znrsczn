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
  SportsEsports,
  Store,
  AccountBalance,
  Person,
  ExitToApp,
  Diamond,
  Menu as MenuIcon,
  Close as CloseIcon,
  Calculate as CalculateIcon,
  RateReview as FeedbackIcon
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
    { path: '/career', label: '职场转型', icon: <Work /> },
    { path: '/side-business', label: '副业指南', icon: <Work /> },
    { path: '/finance', label: '财务管理', icon: <AccountBalance /> },
    { path: '/family', label: '家庭关系', icon: <FamilyRestroom /> },
    { path: '/psychology', label: '心理破局', icon: <Psychology /> },
    { path: '/products', label: '好物推荐', icon: <Store /> },
  ]

  const toolNavItems = [
    { path: '/pension-planner', label: '养老金测算', icon: <CalculateIcon /> },
    { path: '/complaints', label: '建议与反馈', icon: <FeedbackIcon /> },
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          {/* Mobile Menu Button + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                textDecoration: 'none',
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
                letterSpacing: '-0.02em',
                mr: { xs: 1, md: 4 }
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
            {publicNavItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  px: 1.8,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: location.pathname === item.path ? 700 : 500,
                  fontSize: '0.9rem',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    color: 'primary.main'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right Side: Search + Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, width: { md: 180, lg: 220 } }}>
              <SearchBar />
            </Box>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => navigate('/membership')}
                  sx={{ color: 'secondary.main' }}
                  title="会员中心"
                >
                  <Diamond />
                </IconButton>
                <Tooltip title="个人中心">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{
                      border: '2px solid',
                      borderColor: 'grey.200',
                      p: 0.5
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
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
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1.2,
                        fontSize: '0.9rem'
                      }
                    }
                  }}
                >
                  <MenuItem onClick={() => navigate('/membership')}>
                    <Diamond fontSize="small" sx={{ mr: 1.5, color: 'secondary.main' }} />
                    会员中心
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
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
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                }}
              >
                登录
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
            中年自救指南
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Mobile Search */}
        <Box sx={{ mb: 2 }}>
          <SearchBar />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <List disablePadding>
          {publicNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.primary',
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      '&:hover': { bgcolor: 'primary.100' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
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

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 600 }}>
          实用工具
        </Typography>

        <List disablePadding>
          {toolNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
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

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleNavClick('/membership')}
            startIcon={<Diamond sx={{ color: 'secondary.main' }} />}
            sx={{ borderRadius: 2, mb: 1.5, textTransform: 'none' }}
          >
            会员专区
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
              variant="contained"
              onClick={handleLogin}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              立即登录
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default Navbar
