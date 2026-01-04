import { useState } from 'react'
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem, Avatar, Typography, Tooltip, Container, Divider } from '@mui/material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, FamilyRestroom, Work, Psychology, SportsEsports, Store, AccountBalance, Person, ExitToApp, Diamond } from '@mui/icons-material'
import SearchBar from './SearchBar'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    logout()
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const publicNavItems = [
    { path: '/', label: '首页', icon: <Home /> },
    { path: '/family', label: '家庭', icon: <FamilyRestroom /> },
    { path: '/career', label: '职场', icon: <Work /> },
    { path: '/psychology', label: '心理', icon: <Psychology /> },
    { path: '/interests', label: '兴趣', icon: <SportsEsports /> },
    { path: '/finance', label: '财务', icon: <AccountBalance /> },
    { path: '/products', label: '好物', icon: <Store /> },
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 0,
        zIndex: 1100
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              textDecoration: 'none',
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              mr: 4
            }}
          >
            中年自救指南
          </Typography>

          {/* Navigation Items - Desktop */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 1,
            flex: 1
          }}>
            {publicNavItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                  px: 2,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 200 }}>
              <SearchBar />
            </Box>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => navigate('/membership')}
                  sx={{ color: 'secondary.main' }}
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
                size="medium"
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                }}
              >
                登录
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
