import { Box, Container, Typography, Stack, Divider, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import {
  Calculate as CalculateIcon,
  RateReview as FeedbackIcon,
  Diamond as DiamondIcon,
  AutoStories as BookIcon,
  Gavel as GavelIcon
} from '@mui/icons-material'

const Footer = () => {
  const pillarLinks = [
    { label: '职场突围指南', path: '/career' },
    { label: '35+副业轻创', path: '/side-business' },
    { label: '家庭资产配置', path: '/finance' },
    { label: '家庭亲子沟通', path: '/family' },
    { label: '告别焦虑内耗', path: '/psychology' },
    { label: '中年人生重构', path: '/midlife-crisis' },
  ]

  const toolLinks = [
    { label: '裁员赔偿精确测算 (N+1 / 2N)', path: '/layoff-calculator', icon: <GavelIcon sx={{ fontSize: 16, color: '#c2410c' }} /> },
    { label: '2025法定退休金与延迟退休', path: '/retirement-calculator', icon: <CalculateIcon sx={{ fontSize: 16, color: '#d97706' }} /> },
    { label: '36个月存钱与消费降级规划', path: '/savings-planner', icon: null },
    { label: '自救行动工作台 (SOP)', path: '/dashboard', icon: null },
    { label: '读者建议与共创', path: '/complaints', icon: <FeedbackIcon sx={{ fontSize: 16 }} /> },
  ]

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#f5f2eb',
        color: '#57534e',
        pt: 8,
        pb: 6,
        borderTop: '1px solid #e7e5e4'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          {/* 左侧：品牌与定位 */}
          <Grid item xs={12} md={5}>
            <Typography 
              variant="h6" 
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 800, 
                mb: 1.5,
                color: '#1c1917',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '1.25rem'
              }}
            >
              <BookIcon sx={{ color: '#c2410c', fontSize: 24 }} />
              中年自救指南
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#78716c',
                lineHeight: 1.8,
                mb: 3,
                maxWidth: '440px',
                fontSize: '0.88rem'
              }}
            >
              记录普通人在失业、中年转型与家庭日常中的真实经历与实用办法，提供理性的抗风险自救工具与实战指南。
            </Typography>
            <Typography variant="caption" sx={{ color: '#a8a29e', display: 'block' }}>
              © {new Date().getFullYear()} 中年自救指南 · 真实接地气 · 不灌鸡汤 · 拒绝焦虑
            </Typography>
          </Grid>

          {/* 中间：自救主题分类 */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#1c1917',
                fontSize: '0.9rem'
              }}
            >
              实战突围专题
            </Typography>
            <Stack spacing={1.2}>
              {pillarLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: '#78716c',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                    '&:hover': { 
                      color: '#c2410c'
                    }
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* 右侧：实用工具与服务 */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#1c1917',
                fontSize: '0.9rem'
              }}
            >
              实用量化工具
            </Typography>
            <Stack spacing={1.2}>
              {toolLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: '#78716c',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    transition: 'color 0.2s',
                    '&:hover': { 
                      color: '#c2410c'
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Typography>
              ))}
              <Box sx={{ pt: 1 }}>
                <Typography
                  component={Link}
                  to="/admin"
                  variant="caption"
                  sx={{
                    color: '#a8a29e',
                    textDecoration: 'none',
                    '&:hover': { color: '#78716c' }
                  }}
                >
                  管理后台
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#e7e5e4' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#a8a29e' }}>
            本站内容记录真实探索与思考，不构成任何刚性金融投资或法律担保承诺。
          </Typography>
          <Typography variant="caption" sx={{ color: '#a8a29e' }}>
            保持从容，向内探寻，向阳生长
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
