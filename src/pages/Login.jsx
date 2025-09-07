import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Fade,
  Slide,
  Avatar,
  Stack
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Login as LoginIcon,
  PersonAdd,
  Security,
  Verified
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  })

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
    setError('')
    setSuccess('')
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await login(loginForm.username, loginForm.password)
      if (result.success) {
        setSuccess('登录成功！')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1000)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // 表单验证
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }
    
    if (registerForm.password.length < 6) {
      setError('密码长度至少6位')
      setLoading(false)
      return
    }
    
    try {
      const result = await register(registerForm)
      if (result.success) {
        setSuccess('注册成功！正在跳转...')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1000)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginChange = (field) => (e) => {
    setLoginForm({ ...loginForm, [field]: e.target.value })
  }

  const handleRegisterChange = (field) => (e) => {
    setRegisterForm({ ...registerForm, [field]: e.target.value })
  }

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
    )
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 4
        }}>
        <Fade in={mounted} timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%', 
              maxWidth: 450,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
          <Box sx={{ p: 4 }}>
            {/* 品牌标识区域 */}
            <Slide direction="down" in={mounted} timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  <Security sx={{ fontSize: 40, color: 'white' }} />
                </Avatar>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  align="center" 
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  中年人自救指南
                </Typography>
                <Typography 
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    opacity: 0.8
                  }}
                >
                  专业 · 高效 · 成长
                </Typography>
              </Box>
            </Slide>
            
            <Slide direction="up" in={mounted} timeout={800}>
              <Box>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange} 
                  centered
                  sx={{
                    '& .MuiTabs-indicator': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: 3,
                      borderRadius: 1.5
                    },
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      minHeight: 60,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#667eea',
                        transform: 'translateY(-2px)'
                      },
                      '&.Mui-selected': {
                        color: '#667eea',
                        fontWeight: 700
                      }
                    }
                  }}
                >
                  <Tab 
                    icon={<LoginIcon sx={{ fontSize: 24 }} />} 
                    label="登录" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<PersonAdd sx={{ fontSize: 24 }} />} 
                    label="注册" 
                    iconPosition="start"
                  />
                </Tabs>
                
                <Divider sx={{ 
                  my: 3, 
                  background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent)'
                }} />
              </Box>
            </Slide>
            
            {error && (
              <Fade in={!!error} timeout={300}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(244, 67, 54, 0.2)',
                    background: 'rgba(244, 67, 54, 0.05)',
                    '& .MuiAlert-icon': {
                      color: '#f44336'
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            
            {success && (
              <Fade in={!!success} timeout={300}>
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    background: 'rgba(76, 175, 80, 0.05)',
                    '& .MuiAlert-icon': {
                      color: '#4caf50'
                    }
                  }}
                >
                  {success}
                </Alert>
              </Fade>
            )}
            
            {/* 登录表单 */}
            <TabPanel value={currentTab} index={0}>
              <Fade in={currentTab === 0} timeout={400}>
                <Box component="form" onSubmit={handleLoginSubmit}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={loginForm.username}
                    onChange={handleLoginChange('username')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="密码"
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={handleLoginChange('password')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ 
                              color: '#667eea',
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      height: 56,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {loading ? '登录中...' : '登录'}
                  </Button>
                  
                  <Box sx={{ 
                    mt: 2, 
                    p: 2,
                    textAlign: 'center',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 1 }}>
                      <Verified sx={{ fontSize: 16, color: '#667eea' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                        测试账号
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      admin / admin123 或 user / user123
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </TabPanel>
            
            {/* 注册表单 */}
            <TabPanel value={currentTab} index={1}>
              <Fade in={currentTab === 1} timeout={400}>
                <Box component="form" onSubmit={handleRegisterSubmit}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={registerForm.username}
                    onChange={handleRegisterChange('username')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="邮箱"
                    type="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange('email')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="姓名"
                    value={registerForm.name}
                    onChange={handleRegisterChange('name')}
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="密码"
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.password}
                    onChange={handleRegisterChange('password')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ 
                              color: '#667eea',
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="确认密码"
                    type={showPassword ? 'text' : 'password'}
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange('confirmPassword')}
                    margin="normal"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        },
                        '&.Mui-focused': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea'
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                        borderWidth: 2
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      height: 56,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {loading ? '注册中...' : '注册'}
                  </Button>
                </Box>
              </Fade>
            </TabPanel>
          </Box>
        </Paper>
      </Fade>
        </Box>
      </Container>
    </Box>
  )
}

export default Login