import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { Home, FamilyRestroom, Work, Psychology, SportsEsports, Store, MoodBad } from '@mui/icons-material'
import SearchBar from './SearchBar'

const Navbar = () => {
  const location = useLocation()

  const publicNavItems = [
    { path: '/', label: '首页', icon: <Home /> },
    { path: '/family', label: '家庭', icon: <FamilyRestroom /> },
    { path: '/career', label: '职场', icon: <Work /> },
    { path: '/psychology', label: '心理', icon: <Psychology /> },
    { path: '/interests', label: '兴趣', icon: <SportsEsports /> },
    { path: '/products', label: '好物', icon: <Store /> },
  ]

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #f0f0f0',
        mb: 0
      }}
    >
      <Box sx={{ 
        maxWidth: '1120px', 
        margin: '0 auto',
        width: '100%'
      }}>
        <Toolbar sx={{ px: { xs: 2, md: 0 } }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0,
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1rem', md: '1.25rem' },
            mr: { xs: 2, md: 4 }
          }}
        >
          Ss
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 2 }, 
          mr: { xs: 2, md: 4 },
          flexWrap: 'nowrap',
          overflow: 'auto'
        }}>
          {/* 公共导航项 */}
          {publicNavItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                backgroundColor: location.pathname === item.path ? 'grey.50' : 'transparent',
                px: { xs: 1.5, md: 2.5 },
                py: 1,
                borderRadius: 2,
                fontWeight: location.pathname === item.path ? 600 : 500,
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: 'grey.50',
                  color: 'primary.main'
                }
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {item.label}
              </Box>
            </Button>
          ))}
        </Box>

        {/* 搜索框 */}
        <Box sx={{ 
          width: { xs: '200px', md: '300px' }, 
          mr: { xs: 1, md: 2 },
          display: { xs: 'none', sm: 'block' }
        }}>
          <SearchBar />
        </Box>
      </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Navbar