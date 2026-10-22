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
  KeyboardArrowDown as ArrowDownIcon,
  MonetizationOn as MonetizationOnIcon,
  RateReview as FeedbackIcon,
  AutoStories as BookIcon
} from '@mui/icons-material'
import SearchBar from './SearchBar'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const [guideAnchorEl, setGuideAnchorEl] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserAnchorEl(null)
  }

  const handleGuideMenuOpen = (event) => {
    setGuideAnchorEl(event.currentTarget)
  }

  const handleGuideMenuClose = () => {
    setGuideAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    handleUserMenuClose()
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
    handleGuideMenuClose()
    navigate(path)
  }

  // 指南专栏下拉聚合
  const guideCategories = [
    { path: '/career', label: '职场突围', desc: '35岁破局 · 经验变现 · 生存法则', icon: <Work sx={{ color: '#2563eb' }} /> },
    { path: '/side-business', label: '副业轻创', desc: '低成本变现 · 技能产品化', icon: <MonetizationOnIcon sx={{ color: '#059669' }} /> },
    { path: '/finance', label: '财务防守', desc: '家庭资产配置 · 抵御黑天鹅', icon: <AccountBalance sx={{ color: '#d97706' }} /> },
    { path: '/family', label: '家庭生活', desc: '亲子沟通降温 · 伴侣关系保温', icon: <FamilyRestroom sx={{ color: '#db2777' }} /> },
    { path: '/psychology', label: '心理破局', desc: '中年焦虑脱敏 · 情绪边界感', icon: <Psychology sx={{ color: '#7c3aed' }} /> },
  ]

  const isGuideActive = ['/career', '/side-business', '/finance', '/family', '/psychology'].some(p => location.pathname === p)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(250, 248, 245, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e7e5e4',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 68, justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          
          {/* Logo 区域：温暖雅致，单行不截断 */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: { xs: 1.5, md: 4 } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' }, color: '#44403c' }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: '#1c1917',
                textDecoration: 'none',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <BookIcon sx={{ color: '#c2410c', fontSize: 24 }} />
              中年自救指南
            </Typography>
          </Box>

          {/* 桌面端导航：4 个核心入口，舒展不折行 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
            {/* 1. 首页 */}
            <Button
              component={Link}
              to="/"
              sx={{
                color: location.pathname === '/' ? '#c2410c' : '#57534e',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/' ? 'rgba(194, 65, 12, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1c1917'
                }
              }}
            >
              首页
            </Button>

            {/* 2. 实战指南 (下拉聚合) */}
            <Button
              onClick={handleGuideMenuOpen}
              endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: isGuideActive ? '#c2410c' : '#57534e',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: isGuideActive ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: isGuideActive ? 'rgba(194, 65, 12, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1c1917'
                }
              }}
            >
              实战指南
            </Button>

            <Menu
              anchorEl={guideAnchorEl}
              open={Boolean(guideAnchorEl)}
              onClose={handleGuideMenuClose}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  p: 1,
                  borderRadius: 3,
                  width: 280,
                  bgcolor: '#ffffff',
                  color: '#1c1917',
                  border: '1px solid #e7e5e4',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                }
              }}
            >
              {guideCategories.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(194, 65, 12, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '0.9rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.75rem' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

            {/* 3. 养老测算 */}
            <Button
              component={Link}
              to="/pension-planner"
              startIcon={<CalculateIcon sx={{ fontSize: 18, color: '#d97706' }} />}
              sx={{
                color: location.pathname === '/pension-planner' ? '#c2410c' : '#57534e',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/pension-planner' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/pension-planner' ? 'rgba(194, 65, 12, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1c1917'
                }
              }}
            >
              养老测算
            </Button>

            {/* 4. 精选好物 */}
            <Button
              component={Link}
              to="/products"
              sx={{
                color: location.pathname === '/products' ? '#c2410c' : '#57534e',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/products' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/products' ? 'rgba(194, 65, 12, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1c1917'
                }
              }}
            >
              精选好物
            </Button>
          </Box>

          {/* 右侧：搜索框 + 账号登录 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 220 }}>
              <SearchBar />
            </Box>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => navigate('/membership')}
                  sx={{ color: '#d97706' }}
                  title="会员中心"
                >
                  <Diamond />
                </IconButton>
                <Tooltip title="个人中心">
                  <IconButton
                    onClick={handleUserMenuOpen}
                    size="small"
                    sx={{
                      border: '2px solid #e7e5e4',
                      p: 0.5
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#c2410c', fontSize: '0.8rem', color: 'white' }}>
                      {user.name ? user.name[0] : <Person />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userAnchorEl}
                  open={Boolean(userAnchorEl)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 180,
                      bgcolor: '#ffffff',
                      color: '#1c1917',
                      border: '1px solid #e7e5e4'
                    }
                  }}
                >
                  <MenuItem onClick={() => navigate('/membership')}>
                    <Diamond fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} />
                    会员中心
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: '#dc2626' }}>
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
                  py: 0.8,
                  fontSize: '0.88rem',
                  bgcolor: '#c2410c',
                  color: '#ffffff',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#9a3412', boxShadow: 'none' }
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
            bgcolor: '#faf8f5',
            color: '#1c1917',
            borderRight: '1px solid #e7e5e4'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
            中年自救指南
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ color: '#78716c' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 移动端搜索 */}
        <Box sx={{ mb: 2.5 }}>
          <SearchBar />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#a8a29e' }}>
          实战自救专栏
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/')}
              selected={location.pathname === '/'}
              sx={{ borderRadius: 2, color: location.pathname === '/' ? '#c2410c' : '#44403c' }}
            >
              <ListItemIcon sx={{ color: location.pathname === '/' ? '#c2410c' : '#78716c', minWidth: 38 }}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="首页" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>

          {guideCategories.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.6 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? '#c2410c' : '#44403c',
                    '&.Mui-selected': { bgcolor: 'rgba(194, 65, 12, 0.08)' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.92rem' }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#a8a29e' }}>
          工具与服务
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/pension-planner')}
              selected={location.pathname === '/pension-planner'}
              sx={{ borderRadius: 2, color: '#44403c' }}
            >
              <ListItemIcon sx={{ color: '#d97706', minWidth: 38 }}><CalculateIcon /></ListItemIcon>
              <ListItemText primary="养老金缺口测算" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/products')}
              selected={location.pathname === '/products'}
              sx={{ borderRadius: 2, color: '#44403c' }}
            >
              <ListItemIcon sx={{ color: '#059669', minWidth: 38 }}><Store /></ListItemIcon>
              <ListItemText primary="精选好物推荐" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/complaints')}
              selected={location.pathname === '/complaints'}
              sx={{ borderRadius: 2, color: '#44403c' }}
            >
              <ListItemIcon sx={{ color: '#78716c', minWidth: 38 }}><FeedbackIcon /></ListItemIcon>
              <ListItemText primary="建议与想法反馈" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2.5 }} />

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
              bgcolor: '#c2410c',
              fontWeight: 700,
              py: 1,
              boxShadow: 'none'
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
              sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#d6d3d1', color: '#44403c' }}
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
