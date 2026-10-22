import { Box, Container, Typography, Stack, Divider, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import {
  Calculate as CalculateIcon,
  RateReview as FeedbackIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material'

const Footer = () => {
  const pillarLinks = [
    { label: '职场发展', path: '/career' },
    { label: '转型升级', path: '/transformation' },
    { label: '副业指南', path: '/side-business' },
    { label: '财务管理', path: '/finance' },
    { label: '中年危机', path: '/midlife-crisis' },
    { label: '心理健康', path: '/psychology' },
    { label: '家庭关系', path: '/family' },
    { label: '生活技能', path: '/life-skills' },
    { label: '兴趣爱好', path: '/interests' },
  ]

  const toolLinks = [
    { label: '养老金缺口测算', path: '/pension-planner', icon: <CalculateIcon sx={{ fontSize: 16 }} /> },
    { label: '好物推荐', path: '/products', icon: null },
    { label: '读者建议与反馈', path: '/complaints', icon: <FeedbackIcon sx={{ fontSize: 16 }} /> },
    { label: '会员中心', path: '/membership', icon: <DiamondIcon sx={{ fontSize: 16 }} /> },
  ]

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        pt: 7,
        pb: 5,
        borderTop: '1px solid #1e293b'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* 左侧：品牌与定位 */}
          <Grid item xs={12} md={5}>
            <Typography 
              variant="h6" 
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 800, 
                mb: 1.5,
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '1.25rem'
              }}
            >
              中年自救指南
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#94a3b8',
                lineHeight: 1.7,
                mb: 2.5,
                maxWidth: '440px',
                fontSize: '0.88rem'
              }}
            >
              专为 35+ 职场人打造的务实智库，在危机与变局中提供可落地的职场转型、家庭资产抗风险配置、亲子沟通与心理韧性指南。
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
              © {new Date().getFullYear()} 中年自救指南 · 记录成长 · 分享经验 · 赋能生活
            </Typography>
          </Grid>

          {/* 中间：自救主题分类 */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            >
              自救主题专栏
            </Typography>
            <Stack spacing={1.2}>
              {pillarLinks.slice(0, 6).map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.2s',
                    '&:hover': { 
                      color: '#60a5fa'
                    }
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* 右侧：实用工具与专区 */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            >
              实用工具与服务
            </Typography>
            <Stack spacing={1.2}>
              {toolLinks.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    transition: 'color 0.2s',
                    '&:hover': { 
                      color: '#60a5fa'
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
                    color: '#475569',
                    textDecoration: 'none',
                    '&:hover': { color: '#94a3b8' }
                  }}
                >
                  管理后台
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#1e293b' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            本站内容仅供经验交流与成长参考，不构成任何法律或金融投资担保建议。
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            用匠心制作好内容 · 助你度过人生过渡期
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
