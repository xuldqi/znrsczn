import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../contexts/ArticleContext'
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  Button,
  Divider,
  Card,
  CardContent
} from '@mui/material'
import {
  WorkOutline as WorkIcon,
  AccountBalanceOutlined as AccountBalanceIcon,
  FamilyRestroomOutlined as FamilyIcon,
  CalculateOutlined as CalculateIcon,
  ArrowForward as ArrowForwardIcon,
  MonetizationOnOutlined as MonetizationOnIcon,
  AssignmentOutlined as ChecklistIcon,
  ShieldOutlined as ShieldIcon,
  AutoStoriesOutlined as BookIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material'
import Footer from '../components/Footer'

const categoryStyles = {
  '职场发展': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe' },
  '转型升级': { bg: '#f5f3ff', color: '#5b21b6', border: '#ddd6fe' },
  '副业指南': { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  '财务管理': { bg: '#fffbeb', color: '#92400e', border: '#fde68a' },
  '中年危机': { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  '心理健康': { bg: '#f0fdfa', color: '#115e59', border: '#99f6e4' },
  '家庭关系': { bg: '#fdf2f8', color: '#9d174d', border: '#fbcfe8' },
  '生活技能': { bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
  '兴趣爱好': { bg: '#faf5ff', color: '#6b21a8', border: '#e9d5ff' },
}

const Home = () => {
  const navigate = useNavigate()
  const { getAllArticles } = useArticles()

  const publishedArticles = useMemo(() => {
    return getAllArticles().filter(a => a.status === 'published')
  }, [getAllArticles])

  // 精选前 6 篇高价值实操文章
  const featuredArticles = useMemo(() => {
    return [...publishedArticles]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 6)
  }, [publishedArticles])

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#faf9f6', color: '#1c1917', width: '100%', overflowX: 'hidden' }}>
      
      {/* 📖 1. 典雅从容的 Hero 区域 */}
      <Box
        sx={{
          pt: { xs: 6, md: 9 },
          pb: { xs: 7, md: 9 },
          borderBottom: '1px solid #e7e5e4',
          background: 'radial-gradient(ellipse at top, #ffffff 0%, #faf9f6 100%)',
          width: '100%'
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          
          {/* 顶栏徽标 */}
          <Chip
            icon={<BookIcon sx={{ fontSize: 16, color: '#c2410c !important' }} />}
            label="写给 35+ 职场人的确定性自救系统与量化工具箱"
            sx={{
              mb: 3.5,
              px: 2,
              py: 2.2,
              borderRadius: '50px',
              backgroundColor: '#fffbeb',
              color: '#92400e',
              fontWeight: 600,
              fontSize: { xs: '0.82rem', sm: '0.9rem' },
              border: '1px solid #fde68a'
            }}
          />

          {/* 主标题 */}
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              color: '#1c1917',
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.2rem' },
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
              mb: 3,
              maxWidth: 900,
              mx: 'auto'
            }}
          >
            中年不是危机，是一场需要重新清点筹码的防守反击战。
          </Typography>

          {/* 副标题 */}
          <Typography
            variant="body1"
            sx={{
              color: '#57534e',
              fontSize: { xs: '1rem', sm: '1.15rem' },
              lineHeight: 1.7,
              maxWidth: 720,
              mx: 'auto',
              mb: 5
            }}
          >
            面对职场变局、家庭账本与退休规划，不讲空泛大道理。通过真实的现金流跑道测算、关键变故 72h 应急 SOP 与 137 篇一线实操避坑经验，陪你安稳走过关键十年。
          </Typography>

          {/* 核心行动按钮组（绝对不换行，尺寸标准统一） */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#c2410c',
                color: '#ffffff',
                py: 1.4,
                px: 4,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                boxShadow: '0 4px 14px rgba(194, 65, 12, 0.25)',
                '&:hover': {
                  bgcolor: '#9a3412',
                  boxShadow: '0 6px 20px rgba(194, 65, 12, 0.35)'
                }
              }}
            >
              进入自救工作台
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const el = document.getElementById('featured-articles')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              sx={{
                borderColor: '#d6d3d1',
                color: '#44403c',
                py: 1.4,
                px: 3.5,
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: '#ffffff',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: '#a8a29e',
                  bgcolor: '#f5f5f4'
                }
              }}
            >
              查阅实操智库
            </Button>
          </Stack>

          {/* 价值基石条 */}
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ pt: 3, borderTop: '1px solid #e7e5e4', color: '#78716c', fontSize: '0.9rem' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckIcon sx={{ color: '#059669', fontSize: 18 }} />
              <span>家庭现金流跑道测算</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckIcon sx={{ color: '#059669', fontSize: 18 }} />
              <span>突遭变故 72h 应急 SOP</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckIcon sx={{ color: '#059669', fontSize: 18 }} />
              <span>家庭资产四笔钱防守法则</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckIcon sx={{ color: '#059669', fontSize: 18 }} />
              <span>137 篇一线实战避坑指南</span>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* 🧭 2. 工作台核心能力导览 (CSS Grid 严密对齐，大小长短绝对一致) */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4', width: '100%' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
            <Typography variant="overline" sx={{ color: '#c2410c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
              核心防守工具箱
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.6rem', sm: '2.1rem' }, mb: 1 }}>
              中年自救工作台：直面真实阻力
            </Typography>
            <Typography variant="body2" sx={{ color: '#78716c', fontSize: '0.95rem' }}>
              不把希望寄托在虚无的侥幸上。点击进入工作台，随时调用量化模型与应急看板。
            </Typography>
          </Box>

          {/* 统一网格：电脑端等分 3 列，手机平板 1 列 100% 满宽，杜绝长短不一 */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              },
              gap: 3,
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {/* 能力卡片 1 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#c2410c',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <CalculateIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', mb: 1.2, fontSize: '1.1rem' }}>
                  现金流生存跑道监测器
                </Typography>
                <Typography variant="body2" sx={{ color: '#57534e', lineHeight: 1.65, fontSize: '0.88rem' }}>
                  模拟极端被动断供或失业场景，输入月度刚性开销与可用活钱，精确推算家庭可维持的月数与 60 岁后的真实养老缺口。
                </Typography>
              </Box>
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e7e5e4' }}>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'block' }}>
                  量化底线 · 拒绝盲目焦虑 →
                </Typography>
              </Box>
            </Paper>

            {/* 能力卡片 2 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#c2410c',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <ChecklistIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', mb: 1.2, fontSize: '1.1rem' }}>
                  关键变故 72 小时应急看板
                </Typography>
                <Typography variant="body2" sx={{ color: '#57534e', lineHeight: 1.65, fontSize: '0.88rem' }}>
                  突遭裁员时“绝不盲签协议、固定流水证据、依法核算补偿、社保医保无缝接续”。按清单逐条核对，保护合法权益。
                </Typography>
              </Box>
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e7e5e4' }}>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'block' }}>
                  清单核对 · 步步为营止损 →
                </Typography>
              </Box>
            </Paper>

            {/* 能力卡片 3 */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#faf9f6',
                border: '1px solid #e7e5e4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#c2410c',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <ShieldIcon sx={{ color: '#c2410c', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1c1917', mb: 1.2, fontSize: '1.1rem' }}>
                  资产四笔钱与轻资产副业
                </Typography>
                <Typography variant="body2" sx={{ color: '#57534e', lineHeight: 1.65, fontSize: '0.88rem' }}>
                  严格划分家庭活钱、保命钱与长钱边界，坚决避开盲目加盟开店的大坑，以个人技能咨询与数字资产探索 0 边际成本增收。
                </Typography>
              </Box>
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e7e5e4' }}>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'block' }}>
                  守正出奇 · 守护家庭后方 →
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* 工作台邀请条（与上排卡片宽度严格一致） */}
          <Paper
            elevation={0}
            sx={{
              mt: 3.5,
              p: { xs: 2.5, sm: 3 },
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: 2.5,
              bgcolor: '#faf9f6',
              border: '1px dashed #d6d3d1',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1c1917' }}>
                准备好清点家庭的抗风险底线了吗？
              </Typography>
              <Typography variant="body2" sx={{ color: '#78716c', mt: 0.3 }}>
                所有测算数据均在本地浏览器安全保存，无需注册，即开即用。
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#1c1917',
                color: '#ffffff',
                px: 3,
                py: 1.1,
                borderRadius: '50px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': { bgcolor: '#c2410c' }
              }}
            >
              进入工作台自测 →
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* 🧭 3. 四大自救专栏战区 (CSS Grid 严密对齐 4 列) */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
            四大实战战区
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
            系统性化解中年难题
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2.5,
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {[
            {
              title: '职场突围战',
              desc: '35岁破局 · 经验变现 · 合法维权 · 技能杠杆',
              icon: <WorkIcon sx={{ color: '#1e40af' }} />,
              count: '38 篇实战',
              path: '/career'
            },
            {
              title: '副业与轻创',
              desc: '技能产品化 · 零成本起步 · 咨询变现 · 避开加盟陷阱',
              icon: <MonetizationOnIcon sx={{ color: '#065f46' }} />,
              count: '24 篇实战',
              path: '/side-business'
            },
            {
              title: '资产与养老',
              desc: '四笔钱法则 · 养老精算 · 债务重构 · 社保不断缴',
              icon: <AccountBalanceIcon sx={{ color: '#92400e' }} />,
              count: '32 篇实战',
              path: '/finance'
            },
            {
              title: '身心与家庭',
              desc: '中年内耗脱敏 · 亲子沟通 · 体检指标 · 情绪降温',
              icon: <FamilyIcon sx={{ color: '#9d174d' }} />,
              count: '43 篇实战',
              path: '/family'
            }
          ].map((col) => (
            <Paper
              key={col.title}
              elevation={0}
              onClick={() => navigate(col.path)}
              sx={{
                p: 3,
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                borderRadius: 2.5,
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e4',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 160,
                '&:hover': {
                  borderColor: '#c2410c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.05)'
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {col.icon}
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1c1917' }}>
                      {col.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#a8a29e', fontWeight: 600 }}>
                    {col.count}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#78716c', fontSize: '0.85rem', lineHeight: 1.55 }}>
                  {col.desc}
                </Typography>
              </Box>

              <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700 }}>
                  进入专栏 →
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* 📚 4. 实战智库精选 (CSS Grid 双列严谨对齐) */}
      <Box id="featured-articles" sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#ffffff', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4', width: '100%' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="overline" sx={{ color: '#78716c', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                精选实战经验
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1c1917', fontSize: { xs: '1.5rem', sm: '1.9rem' } }}>
                经过检验的一线干货
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={() => navigate('/articles')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: '#d6d3d1',
                color: '#44403c',
                borderRadius: '50px',
                px: 2.5,
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': { borderColor: '#a8a29e', bgcolor: '#faf9f6' }
              }}
            >
              浏览全部 137 篇指南
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)'
              },
              gap: 2.5,
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {featuredArticles.map((article, idx) => {
              const colorConfig = categoryStyles[article.category] || { bg: '#f5f5f4', color: '#44403c', border: '#e7e5e4' }
              return (
                <Card
                  key={article.id || idx}
                  onClick={() => navigate(`/article/${article.id}`)}
                  elevation={0}
                  sx={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#faf9f6',
                    border: '1px solid #e7e5e4',
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      borderColor: '#c2410c',
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
                      '& .article-title': { color: '#c2410c' }
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          bgcolor: colorConfig.bg,
                          color: colorConfig.color,
                          border: `1px solid ${colorConfig.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          height: 22
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#a8a29e' }}>
                        {article.readTime || '3分钟阅读'}
                      </Typography>
                    </Box>

                    <Typography
                      className="article-title"
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.2,
                        fontSize: '1.05rem',
                        lineHeight: 1.4,
                        color: '#1c1917',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        transition: 'color 0.15s'
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#78716c',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '0.86rem',
                        lineHeight: 1.6
                      }}
                    >
                      {article.excerpt || article.summary}
                    </Typography>
                  </CardContent>

                  <Box sx={{ px: 3, pb: 2.5, pt: 0 }}>
                    <Divider sx={{ mb: 1.2, borderColor: '#f0ece1' }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#78716c', fontWeight: 600 }}>
                        {article.author || '实战导师'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 600 }}>
                        查阅全文 →
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              )
            })}
          </Box>
        </Container>
      </Box>

      {/* 📜 5. 写在中年转折点 (Editorial Manifesto) */}
      <Container maxWidth="md" sx={{ py: { xs: 7, md: 9 }, textAlign: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 3,
            backgroundColor: '#ffffff',
            border: '1px solid #e7e5e4',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1c1917', mb: 2 }}>
            写在人生的关键中场
          </Typography>
          <Typography variant="body1" sx={{ color: '#57534e', lineHeight: 1.8, fontSize: '0.98rem', maxWidth: 600, mx: 'auto', mb: 3.5 }}>
            35 岁后的安全感，从来不是外界施舍的，而是建立在清醒的财务账本、抗压的技能护城河与健康的家庭防线上。算清账本、守住底线，每一天都是向上走的基石。
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#c2410c',
              color: '#ffffff',
              py: 1.2,
              px: 3.5,
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              '&:hover': { bgcolor: '#9a3412' }
            }}
          >
            开启您的自救工作台
          </Button>
        </Paper>
      </Container>

      <Footer />
    </Box>
  )
}

export default Home
