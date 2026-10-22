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
  MenuBook as BookIcon,
  RateReview as FeedbackIcon
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
    { path: '/career', label: '职场突围', desc: '35岁破局 · 管理与专业壁垒', icon: <Work sx={{ color: '#38bdf8' }} /> },
    { path: '/side-business', label: '副业轻创', desc: '低成本变现 · 技能产品化', icon: <MonetizationOnIcon sx={{ color: '#34d399' }} /> },
    { path: '/finance', label: '财务防守', desc: '家庭资产配置 · 抵御黑天鹅', icon: <AccountBalance sx={{ color: '#fbbf24' }} /> },
    { path: '/family', label: '家庭生活', desc: '亲子沟通降温 · 夫妻关系', icon: <FamilyRestroom sx={{ color: '#f472b6' }} /> },
    { path: '/psychology', label: '心理破局', desc: '中年焦虑调节 · 情绪边界感', icon: <Psychology sx={{ color: '#a78bfa' }} /> },
  ]

  const isGuideActive = ['/career', '/side-business', '/finance', '/family', '/psychology'].some(p => location.pathname === p)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(9, 13, 22, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 68, justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          
          {/* Logo 区域：强制单行不截断 */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: { xs: 1.5, md: 4 } }}>
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
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              中年自救指南
            </Typography>
          </Box>

          {/* 桌面端导航：精炼 4 项，拒绝折行 */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1.5,
            flexShrink: 0
          }}>
            {/* 1. 首页 */}
            <Button
              component={Link}
              to="/"
              sx={{
                color: location.pathname === '/' ? '#38bdf8' : '#cbd5e1',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff'
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
                color: isGuideActive ? '#38bdf8' : '#cbd5e1',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: isGuideActive ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: isGuideActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff'
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
                elevation: 5,
                sx: {
                  mt: 1.5,
                  p: 1,
                  borderRadius: 3,
                  width: 270,
                  bgcolor: '#0f172a',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
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
                      bgcolor: 'rgba(56, 189, 248, 0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
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
              startIcon={<CalculateIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: location.pathname === '/pension-planner' ? '#38bdf8' : '#cbd5e1',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/pension-planner' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/pension-planner' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff'
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
                color: location.pathname === '/products' ? '#38bdf8' : '#cbd5e1',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: location.pathname === '/products' ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: location.pathname === '/products' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff'
                }
              }}
            >
              精选好物
            </Button>
          </Box>

          {/* 右侧：搜索框 + 账号信息（留白充足） */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexShrink: 0 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 220 }}>
              <SearchBar />
            </Box>

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
                    onClick={handleUserMenuOpen}
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
                  anchorEl={userAnchorEl}
                  open={Boolean(userAnchorEl)}
                  onClose={handleUserMenuClose}
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
                  px: { xs: 2, sm: 2.5 },
                  py: 0.8,
                  fontSize: '0.88rem',
                  bgcolor: '#2563eb',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
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

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#64748b' }}>
          实战自救专栏
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/')}
              selected={location.pathname === '/'}
              sx={{ borderRadius: 2, color: location.pathname === '/' ? '#38bdf8' : '#cbd5e1' }}
            >
              <ListItemIcon sx={{ color: location.pathname === '/' ? '#38bdf8' : '#94a3b8', minWidth: 38 }}>
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
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    '&.Mui-selected': { bgcolor: 'rgba(56, 189, 248, 0.15)' }
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

        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#64748b' }}>
          工具与服务
        </Typography>

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/pension-planner')}
              selected={location.pathname === '/pension-planner'}
              sx={{ borderRadius: 2, color: '#cbd5e1' }}
            >
              <ListItemIcon sx={{ color: '#38bdf8', minWidth: 38 }}><CalculateIcon /></ListItemIcon>
              <ListItemText primary="养老金缺口测算" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/products')}
              selected={location.pathname === '/products'}
              sx={{ borderRadius: 2, color: '#cbd5e1' }}
            >
              <ListItemIcon sx={{ color: '#38bdf8', minWidth: 38 }}><Store /></ListItemIcon>
              <ListItemText primary="精选好物推荐" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/complaints')}
              selected={location.pathname === '/complaints'}
              sx={{ borderRadius: 2, color: '#cbd5e1' }}
            >
              <ListItemIcon sx={{ color: '#94a3b8', minWidth: 38 }}><FeedbackIcon /></ListItemIcon>
              <ListItemText primary="建议与想法反馈" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.08)' }} />

        <Box sx={{ mt: 'auto', pt: 1 }}>
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
