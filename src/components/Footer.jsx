import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material'
import { Email, GitHub, Twitter } from '@mui/icons-material'

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#2c3e50',
        color: 'white',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* 主要内容区域 */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={4}
            justifyContent="space-between"
          >
            {/* 左侧：网站信息 */}
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: 'white'
                }}
              >
                中年自救指南
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.6,
                  mb: 3
                }}
              >
                专为中年职场人打造的实用指南平台，提供职业发展、技能提升、心理调节等全方位的自救方案。
                帮助你在职场困境中找到突破口，重新规划职业道路。
              </Typography>
              
              {/* 社交媒体链接 */}
              <Stack direction="row" spacing={2}>
                <Link 
                  href="#" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <Email />
                </Link>
                <Link 
                  href="#" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <GitHub />
                </Link>
                <Link 
                  href="#" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { color: 'white' }
                  }}
                >
                  <Twitter />
                </Link>
              </Stack>
            </Box>

            {/* 右侧：导航链接 */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={4}
              sx={{ flex: 1, justifyContent: 'flex-end' }}
            >
              {/* 快速导航 */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: 'white'
                  }}
                >
                  快速导航
                </Typography>
                <Stack spacing={1}>
                  {['首页', '家庭', '职场', '心理', '兴趣', '财务', '好物'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': { 
                          color: 'white',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Stack>
              </Box>

              {/* 热门分类 */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: 'white'
                  }}
                >
                  热门分类
                </Typography>
                <Stack spacing={1}>
                  {['职场转型', '理财规划', '家庭沟通', '心理调节'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': { 
                          color: 'white',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Stack>
              </Box>

              {/* 关于我们 */}
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: 'white'
                  }}
                >
                  关于我们
                </Typography>
                <Stack spacing={1}>
                  {['联系我们', '意见反馈', '隐私政策', '使用条款'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        '&:hover': { 
                          color: 'white',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* 底部版权信息 */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
            >
              <Typography 
                variant="body2" 
                sx={{ color: 'rgba(255,255,255,0.6)' }}
              >
                © 2024 中年自救指南. 保留所有权利.
              </Typography>
              <Link
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { 
                    color: 'white',
                    textDecoration: 'underline'
                  }
                }}
              >
                皖ICP备2023009170号
              </Link>
            </Stack>
            <Typography 
              variant="body2" 
              sx={{ color: 'rgba(255,255,255,0.6)' }}
            >
              希望每个人都能继续走下去
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer