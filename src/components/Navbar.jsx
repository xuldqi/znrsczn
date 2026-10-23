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
  AutoStories as BookIcon,
  SpaceDashboard as DashboardIcon,
  Gavel as GavelIcon,
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  Build as BuildIcon
} from '@mui/icons-material'
import SearchBar from './SearchBar'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const [guideAnchorEl, setGuideAnchorEl] = useState(null)
  const [toolsAnchorEl, setToolsAnchorEl] = useState(null)
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

  const handleToolsMenuOpen = (event) => {
    setToolsAnchorEl(event.currentTarget)
  }

  const handleToolsMenuClose = () => {
    setToolsAnchorEl(null)
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
    handleToolsMenuClose()
    navigate(path)
  }

  // 实战分类体系 (覆盖职场求职、副业搞钱、房贷债务、省钱降级、夫妻育儿、心态调适、转型升级、兴趣爱好、中年危机)
  const guideCategories = [
    { path: '/career', label: '找不到工作 / 职场求生', desc: '裁员应对、争取2N赔偿、35岁找工作面试', icon: <Work sx={{ color: '#2563eb' }} /> },
    { path: '/side-business', label: '副业搞钱 / 技能变现', desc: '一人企业、独立出海、接单外包、小生意', icon: <MonetizationOnIcon sx={{ color: '#059669' }} /> },
    { path: '/finance', label: '房贷债务 / 资产保全', desc: '防断供、银行协商延期还本、保本理财', icon: <AccountBalance sx={{ color: '#d97706' }} /> },
    { path: '/life-skills', label: '省钱降级 / 极简生活', desc: '战时预算、极简做饭备餐、降低开销', icon: <SavingsIcon sx={{ color: '#047857' }} /> },
    { path: '/family', label: '夫妻育儿 / 家庭防线', desc: '夫妻减压沟通、不转嫁金钱焦虑、亲子陪伴', icon: <FamilyRestroom sx={{ color: '#db2777' }} /> },
    { path: '/psychology', label: '心态调适 / 拒绝内耗', desc: '打破失业耻感、放下虚荣心、接纳平凡', icon: <Psychology sx={{ color: '#7c3aed' }} /> },
    { path: '/transformation', label: '技能转型 / 重新出发', desc: '跨界转行、大龄技术转型、第二增长曲线', icon: <TrendingUpIcon sx={{ color: '#ea580c' }} /> },
    { path: '/interests', label: '兴趣爱好 / 精神寄托', desc: '纯粹热爱、独处放空、户外徒步、心流充电', icon: <Diamond sx={{ color: '#0284c7' }} /> },
    { path: '/midlife-crisis', label: '中年危机 / 避坑突围', desc: '35岁+危机应对、认知重构、拒绝加盟踩坑', icon: <FeedbackIcon sx={{ color: '#dc2626' }} /> },
    { path: '/articles', label: '全部实战文库', desc: '全网精选自救实录全景总库 (125篇)', icon: <BookIcon sx={{ color: '#c2410c' }} /> },
  ]

  // 实战工具体系
  const toolItems = [
    { path: '/layoff-calculator', label: '裁员赔偿精算器', desc: 'N+1 / 2N / 试用期 / 社平3倍封顶与仲裁测算', icon: <GavelIcon sx={{ color: '#c2410c' }} /> },
    { path: '/retirement-calculator', label: '法定延迟退休金精算器', desc: '2025新规改革方案、基础与个人账户养老金', icon: <CalculateIcon sx={{ color: '#d97706' }} /> },
    { path: '/savings-planner', label: '36个月生存与存钱规划', desc: '失业现金流跑道测算、极简存钱、消费降级', icon: <SavingsIcon sx={{ color: '#047857' }} /> },
    { path: '/dashboard', label: '自救工作台', desc: '一站式应急指挥中枢、自救待办与工具集合', icon: <DashboardIcon sx={{ color: '#2563eb' }} /> },
    { path: '/pension-planner', label: '品质养老生活规划', desc: '退休后生活成本精算与储备金跑道推演', icon: <AccountBalance sx={{ color: '#059669' }} /> },
  ]

  const isGuideActive = guideCategories.some(c => location.pathname === c.path)
  const isToolsActive = toolItems.some(t => location.pathname === t.path)

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
              <Box
                component="img"
                src="/logo.svg"
                alt="中年自救指南"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '7px',
                  boxShadow: '0 2px 6px rgba(194, 65, 12, 0.25)'
                }}
              />
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

            {/* 2. 实战分类 (下拉聚合) */}
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
              实战分类
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
                  p: 1.5,
                  borderRadius: 3,
                  width: { xs: 320, sm: 580 },
                  maxHeight: 520,
                  bgcolor: '#ffffff',
                  color: '#1c1917',
                  border: '1px solid #e7e5e4',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                }
              }}
            >
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 1
              }}>
                {guideCategories.map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(194, 65, 12, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>{item.icon}</Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '0.88rem' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.73rem', display: 'block', lineHeight: 1.4 }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>
            </Menu>

            {/* 3. 自救工具 (下拉聚合) */}
            <Button
              onClick={handleToolsMenuOpen}
              endIcon={<ArrowDownIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: isToolsActive ? '#c2410c' : '#57534e',
                px: 2,
                py: 0.8,
                borderRadius: 2,
                fontWeight: isToolsActive ? 700 : 500,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                backgroundColor: isToolsActive ? 'rgba(194, 65, 12, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1c1917'
                }
              }}
            >
              自救工具
            </Button>

            <Menu
              anchorEl={toolsAnchorEl}
              open={Boolean(toolsAnchorEl)}
              onClose={handleToolsMenuClose}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  p: 1.5,
                  borderRadius: 3,
                  width: 320,
                  bgcolor: '#ffffff',
                  color: '#1c1917',
                  border: '1px solid #e7e5e4',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
                }
              }}
            >
              {toolItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(194, 65, 12, 0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3 }}>{item.icon}</Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1c1917', fontSize: '0.88rem' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#78716c', fontSize: '0.73rem', display: 'block', lineHeight: 1.4 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/logo.svg"
              alt="中年自救指南"
              sx={{
                width: 26,
                height: 26,
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(194, 65, 12, 0.2)'
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1c1917', fontSize: '1.15rem' }}>
              中年自救指南
            </Typography>
          </Box>
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
          核心导航
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

          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/products')}
              selected={location.pathname === '/products'}
              sx={{ borderRadius: 2, color: location.pathname === '/products' ? '#c2410c' : '#44403c' }}
            >
              <ListItemIcon sx={{ color: location.pathname === '/products' ? '#c2410c' : '#78716c', minWidth: 38 }}>
                <Store />
              </ListItemIcon>
              <ListItemText primary="精选好物" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#a8a29e' }}>
          自救实用工具
        </Typography>

        <List disablePadding>
          {toolItems.map((item) => {
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
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" sx={{ px: 1.5, mb: 1, display: 'block', fontWeight: 700, color: '#a8a29e' }}>
          实战主题分类
        </Typography>

        <List disablePadding>
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
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Divider sx={{ my: 2 }} />

        <List disablePadding>
          <ListItem disablePadding sx={{ mb: 0.6 }}>
            <ListItemButton
              onClick={() => handleNavClick('/complaints')}
              selected={location.pathname === '/complaints'}
              sx={{ borderRadius: 2, color: '#44403c' }}
            >
              <ListItemIcon sx={{ color: '#78716c', minWidth: 38 }}><FeedbackIcon /></ListItemIcon>
              <ListItemText primary="建议与反馈" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
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
